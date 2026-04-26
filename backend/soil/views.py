from collections import Counter
from functools import lru_cache
from pathlib import Path

import shapefile
from django.http import JsonResponse
from django.shortcuts import render
from pyproj import Transformer

BACKEND_ROOT = Path(__file__).resolve().parent.parent
SOIL_SHAPEFILE = BACKEND_ROOT / "data" / "soil data" / "parentsoil" / "soilparent.shp"


def _resolve_transformer(reader):
    min_x, min_y, max_x, max_y = reader.bbox
    if -180 <= min_x <= 180 and -180 <= max_x <= 180 and -90 <= min_y <= 90 and -90 <= max_y <= 90:
        return lambda x_value, y_value: (x_value, y_value)

    transformer = Transformer.from_crs("EPSG:32645", "EPSG:4326", always_xy=True)
    return transformer.transform


def _to_json_value(value):
    if value is None:
        return None
    if isinstance(value, (str, int, float, bool)):
        return value
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return str(value)


def _transform_coordinates(coordinates, transform_point):
    if not coordinates:
        return coordinates

    first_item = coordinates[0]
    if isinstance(first_item[0], (int, float)):
        transformed_ring = []
        for x_value, y_value in coordinates:
            lon_value, lat_value = transform_point(x_value, y_value)
            transformed_ring.append([lon_value, lat_value])
        return transformed_ring

    return [_transform_coordinates(part, transform_point) for part in coordinates]


def _shape_to_geojson(shape_interface, transform_point):
    return {
        "type": shape_interface["type"],
        "coordinates": _transform_coordinates(shape_interface["coordinates"], transform_point),
    }


@lru_cache(maxsize=1)
def _load_soil_features():
    if not SOIL_SHAPEFILE.exists():
        raise FileNotFoundError(f"Soil shapefile not found: {SOIL_SHAPEFILE}")

    reader = shapefile.Reader(str(SOIL_SHAPEFILE), encoding="utf-8")
    field_names = [field[0] for field in reader.fields[1:]]
    transform_point = _resolve_transformer(reader)
    features = []

    for index, shape_record in enumerate(reader.iterShapeRecords(), start=1):
        raw_properties = shape_record.record.as_dict() if hasattr(shape_record.record, "as_dict") else dict(zip(field_names, shape_record.record))
        properties = {key: _to_json_value(value) for key, value in raw_properties.items()}

        features.append(
            {
                "type": "Feature",
                "id": index,
                "geometry": _shape_to_geojson(shape_record.shape.__geo_interface__, transform_point),
                "properties": properties,
            }
        )

    return features


def _numeric_values(features, field_name):
    values = []
    for feature in features:
        raw_value = feature["properties"].get(field_name)
        try:
            number_value = float(raw_value)
        except (TypeError, ValueError):
            continue
        values.append(number_value)
    return values


def soil_geojson(request):
    features = _load_soil_features()
    return JsonResponse(
        {
            "type": "FeatureCollection",
            "name": "soil_parent_data",
            "features": features,
        },
        json_dumps_params={"ensure_ascii": False},
    )


def soil_summary(request):
    features = _load_soil_features()
    landform_counts = Counter()
    parent_material_counts = Counter()
    dominant_soil_counts = Counter()

    for feature in features:
        properties = feature["properties"]
        if properties.get("Landform"):
            landform_counts[str(properties["Landform"])] += 1
        if properties.get("Parent_Mat"):
            parent_material_counts[str(properties["Parent_Mat"])] += 1
        if properties.get("Dominant_S"):
            dominant_soil_counts[str(properties["Dominant_S"])] += 1

    slope_values = _numeric_values(features, "Slope_med")
    elevation_min_values = _numeric_values(features, "Elev_min")
    elevation_max_values = _numeric_values(features, "Elev_max")
    area_values = _numeric_values(features, "SQKM")

    return JsonResponse(
        {
            "total_features": len(features),
            "landforms": landform_counts.most_common(10),
            "parent_materials": parent_material_counts.most_common(10),
            "dominant_soils": dominant_soil_counts.most_common(10),
            "stats": {
                "slope_med": {
                    "min": min(slope_values) if slope_values else None,
                    "max": max(slope_values) if slope_values else None,
                    "avg": round(sum(slope_values) / len(slope_values), 2) if slope_values else None,
                },
                "elev_min": {
                    "min": min(elevation_min_values) if elevation_min_values else None,
                    "max": max(elevation_min_values) if elevation_min_values else None,
                },
                "elev_max": {
                    "min": min(elevation_max_values) if elevation_max_values else None,
                    "max": max(elevation_max_values) if elevation_max_values else None,
                },
                "area_sqkm": {
                    "total": round(sum(area_values), 2) if area_values else None,
                },
            },
        },
        json_dumps_params={"ensure_ascii": False},
    )


def soil_map_page(request):
    return render(
        request,
        "soil/soil_map.html",
        {
            "geojson_url": "/api/soil/geojson/",
            "summary_url": "/api/soil/summary/",
        },
    )
