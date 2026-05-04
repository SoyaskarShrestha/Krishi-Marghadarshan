# crop/serializers.py
# ─────────────────────────────────────────────────────────────
# Validates and cleans the JSON body that arrives at /api/predict.
# Uses Django REST Framework serializers — same style as your
# other DRF serializers, so nothing new to learn.
# ─────────────────────────────────────────────────────────────

from rest_framework import serializers
from .ml_engine import all_districts

SEASON_CHOICES = [
    "Kharif (Summer)",
    "Rabi (Winter)",
    "Zaid (Spring)",
]

SOIL_TYPE_CHOICES = [
    "Alluvial Sandy Loam", "Alluvial Clay Loam", "Alluvial Loam",
    "Sandy Loam", "Clay", "Clay Loam", "Gravelly Loam",
    "Red Sandy Loam", "Red Clay Loam", "Brown Loam", "Sandy Clay",
    "Brown Forest Soil", "Alpine Meadow Soil", "Rocky Soil", "Stony Soil",
]


class PredictInputSerializer(serializers.Serializer):
    """
    Validates all 14 user inputs for crop prediction.
    Province, Region_Type, and Agro_Zone are AUTO-FILLED from District
    inside the view — the user / frontend only needs to send these fields:
    """

    # ── Location (user provides only District + Season + Soil_Type) ──────
    District  = serializers.ChoiceField(choices=[(d, d) for d in all_districts()])
    Season    = serializers.ChoiceField(choices=[(s, s) for s in SEASON_CHOICES])
    Soil_Type = serializers.ChoiceField(choices=[(s, s) for s in SOIL_TYPE_CHOICES])

    # ── Environmental inputs ──────────────────────────────────────────────
    Altitude_m          = serializers.FloatField(min_value=60,   max_value=5000)
    Avg_Temperature_C   = serializers.FloatField(min_value=-5,   max_value=40)
    Annual_Rainfall_mm  = serializers.FloatField(min_value=100,  max_value=3000)
    Humidity_pct        = serializers.FloatField(min_value=10,   max_value=100)

    # ── Soil chemistry ────────────────────────────────────────────────────
    Soil_pH             = serializers.FloatField(min_value=3.5,  max_value=9.0)
    Nitrogen_kg_ha      = serializers.FloatField(min_value=0,    max_value=500)
    Phosphorus_kg_ha    = serializers.FloatField(min_value=0,    max_value=200)
    Potassium_kg_ha     = serializers.FloatField(min_value=0,    max_value=600)


class BatchPredictSerializer(serializers.Serializer):
    """Wraps a list of PredictInputSerializer for batch endpoint."""
    records = PredictInputSerializer(many=True)

    def validate_records(self, value):
        if len(value) > 100:
            raise serializers.ValidationError("Maximum 100 records per batch request.")
        if len(value) == 0:
            raise serializers.ValidationError("records list must not be empty.")
        return value
