# crop/views.py
# ─────────────────────────────────────────────────────────────
# Three endpoints:
#   POST /api/predict/          → single prediction
#   POST /api/predict/batch/    → up to 100 predictions
#   GET  /api/predict/options/  → valid dropdown values
# ─────────────────────────────────────────────────────────────

from django.apps import apps
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import PredictInputSerializer, BatchPredictSerializer
from .ml_engine   import predict_top3, get_district_meta, all_districts, SOIL_TYPE_CHOICES, SEASON_CHOICES


def _get_ml():
    """Fetch the model objects loaded by CropPredictionConfig.ready()."""
    cfg = apps.get_app_config("crop_prediction")
    return cfg.model, cfg.encoders, cfg.feature_names


def _model_ready():
    model, encoders, feature_names = _get_ml()
    return model is not None and encoders is not None and feature_names is not None


# ── Helper: build full input dict (auto-fills Province/Region/Zone) ────────
def _build_full_input(validated_data: dict) -> dict:
    district = validated_data["District"]
    meta     = get_district_meta(district)          # Province, Region_Type, Agro_Zone
    return {**validated_data, **meta}


# ══════════════════════════════════════════════════════════════
#  1.  POST /api/predict/
# ══════════════════════════════════════════════════════════════
class PredictView(APIView):
    """
    Predict the best 3 crops for a single location.

    Request body (JSON):
    {
        "District":           "Jhapa",
        "Season":             "Kharif (Summer)",
        "Soil_Type":          "Alluvial Clay Loam",
        "Altitude_m":         100,
        "Avg_Temperature_C":  28.5,
        "Annual_Rainfall_mm": 1800,
        "Humidity_pct":       80,
        "Soil_pH":            6.8,
        "Nitrogen_kg_ha":     280,
        "Phosphorus_kg_ha":   55,
        "Potassium_kg_ha":    200
    }

    Response:
    {
        "success": true,
        "location": {
            "district": "Jhapa",
            "province": "Province 1",
            "region":   "Terai",
            "zone":     "Terai"
        },
        "predictions": [
            {"rank": 1, "crop": "Rice",  "confidence_pct": 91.3},
            {"rank": 2, "crop": "Maize", "confidence_pct":  6.2},
            {"rank": 3, "crop": "Jute",  "confidence_pct":  2.5}
        ]
    }
    """

    def post(self, request):
        if not _model_ready():
            return Response(
                {"success": False, "error": "ML model not loaded. Check backend/crop_prediction/*.pkl files."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        serializer = PredictInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        try:
            full_input   = _build_full_input(serializer.validated_data)
            model, encoders, feature_names = _get_ml()
            predictions  = predict_top3(full_input, model, encoders, feature_names)
            top_prediction = predictions[0] if predictions else None

            return Response({
                "success": True,
                "location": {
                    "district": full_input["District"],
                    "province": full_input["Province"],
                    "region":   full_input["Region_Type"],
                    "zone":     full_input["Agro_Zone"],
                },
                "season":      full_input["Season"],
                "soil_type":   full_input["Soil_Type"],
                "prediction": top_prediction,
            })

        except Exception as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ══════════════════════════════════════════════════════════════
#  2.  POST /api/predict/batch/
# ══════════════════════════════════════════════════════════════
class BatchPredictView(APIView):
    """
    Predict crops for multiple locations in a single request (max 100).

    Request body:
    {
        "records": [
            {"District": "Jhapa",  "Season": "Kharif (Summer)", ...},
            {"District": "Kaski",  "Season": "Rabi (Winter)",   ...},
        ]
    }

    Response:
    {
        "success": true,
        "count": 2,
        "results": [
            {"index": 0, "success": true,  "predictions": [...]},
            {"index": 1, "success": false, "error": "..."}
        ]
    }
    """

    def post(self, request):
        if not _model_ready():
            return Response(
                {"success": False, "error": "ML model not loaded."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        serializer = BatchPredictSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        model, encoders, feature_names = _get_ml()
        results = []

        for i, record in enumerate(serializer.validated_data["records"]):
            try:
                full_input  = _build_full_input(record)
                predictions = predict_top3(full_input, model, encoders, feature_names)
                top_prediction = predictions[0] if predictions else None
                results.append({
                    "index":       i,
                    "success":     True,
                    "district":    full_input["District"],
                    "season":      full_input["Season"],
                    "prediction":  top_prediction,
                })
            except Exception as e:
                results.append({"index": i, "success": False, "error": str(e)})

        return Response({"success": True, "count": len(results), "results": results})


# ══════════════════════════════════════════════════════════════
#  3.  GET /api/predict/options/
# ══════════════════════════════════════════════════════════════
class OptionsView(APIView):
    """
    Returns all valid values for dropdown inputs.
    Call this once when your frontend loads to populate forms.

    Response:
    {
        "districts":   ["Achham", "Arghakhanchi", ...],
        "seasons":     ["Kharif (Summer)", "Rabi (Winter)", "Zaid (Spring)"],
        "soil_types":  ["Alluvial Clay Loam", ...],
        "numeric_ranges": {
            "Altitude_m":         [60, 5000],
            "Avg_Temperature_C":  [-5, 40],
            ...
        }
    }
    """

    def get(self, request):
        return Response({
            "districts":  all_districts(),
            "seasons":    SEASON_CHOICES,
            "soil_types": SOIL_TYPE_CHOICES,
            "numeric_ranges": {
                "Altitude_m":          [60,   5000],
                "Avg_Temperature_C":   [-5,   40],
                "Annual_Rainfall_mm":  [100,  3000],
                "Humidity_pct":        [10,   100],
                "Soil_pH":             [3.5,  9.0],
                "Nitrogen_kg_ha":      [0,    500],
                "Phosphorus_kg_ha":    [0,    200],
                "Potassium_kg_ha":     [0,    600],
            },
            "note": "Province, Region_Type, and Agro_Zone are auto-filled from District — do not send them.",
        })
