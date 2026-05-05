from collections import Counter
from functools import lru_cache
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json

import shapefile
import rasterio
import numpy as np
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
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


# ============================================================================
# RASTER SOIL DATA ENDPOINTS
# ============================================================================

@require_http_methods(["GET"])
def soil_raster_layers(request):
    """List all available soil raster layers with metadata"""
    soil_data_path = BACKEND_ROOT / "data" / "soil data"
    
    soil_layers = {
        'ph': {'path': 'ph/ph.tif', 'unit': 'pH (0-14)', 'description': 'Soil pH Level'},
        'nitrogen': {'path': 'nitrogen/nitrogen.tif', 'unit': '%', 'description': 'Nitrogen Content'},
        'phosphorus': {'path': 'phosphorus/p2o5.tif', 'unit': 'mg/kg', 'description': 'Available Phosphorus'},
        'potassium': {'path': 'potassium/k.tif', 'unit': 'mg/kg', 'description': 'Available Potassium'},
        'boron': {'path': 'boron/boron.tif', 'unit': 'mg/kg', 'description': 'Boron Content'},
        'zinc': {'path': 'zinc/zinc.tif', 'unit': 'mg/kg', 'description': 'Zinc Content'},
        'clay': {'path': 'clay/clay.tif', 'unit': '%', 'description': 'Clay Percentage'},
        'sand': {'path': 'sand/sand.tif', 'unit': '%', 'description': 'Sand Percentage'},
        'silt': {'path': 'slit/slit.tif', 'unit': '%', 'description': 'Silt Percentage'},
        'organic': {'path': 'organic/organic.tif', 'unit': '%', 'description': 'Organic Matter Content'},
    }
    
    layers = []
    for param_name, info in soil_layers.items():
        full_path = soil_data_path / info['path']
        if full_path.exists():
            try:
                with rasterio.open(full_path) as src:
                    data = src.read(1)
                    valid_mask = ~np.isnan(data)
                    valid_data = data[valid_mask]
                    
                    layers.append({
                        'name': param_name,
                        'display_name': info['description'],
                        'unit': info['unit'],
                        'path': info['path'],
                        'bounds': {
                            'left': src.bounds.left,
                            'bottom': src.bounds.bottom,
                            'right': src.bounds.right,
                            'top': src.bounds.top,
                        },
                        'crs': str(src.crs),
                        'stats': {
                            'min': float(np.min(valid_data)),
                            'max': float(np.max(valid_data)),
                            'mean': float(np.mean(valid_data)),
                            'median': float(np.median(valid_data)),
                        }
                    })
            except Exception as e:
                layers.append({
                    'name': param_name,
                    'error': str(e)
                })
    
    return JsonResponse({'layers': layers})


@require_http_methods(["GET"])
def soil_data_at_point(request):
    """Extract soil data from all raster layers at a given point (lat, lon)"""
    lat_str = request.GET.get('lat')
    lon_str = request.GET.get('lon')
    
    if not lat_str or not lon_str:
        return JsonResponse(
            {'error': 'lat and lon parameters required'},
            status=400
        )
    
    try:
        latitude = float(lat_str)
        longitude = float(lon_str)
    except ValueError:
        return JsonResponse(
            {'error': 'lat and lon must be numbers'},
            status=400
        )
    
    soil_data_path = BACKEND_ROOT / "data" / "soil data"
    
    soil_layers = {
        'ph': 'ph/ph.tif',
        'nitrogen': 'nitrogen/nitrogen.tif',
        'phosphorus': 'phosphorus/p2o5.tif',
        'potassium': 'potassium/k.tif',
        'boron': 'boron/boron.tif',
        'zinc': 'zinc/zinc.tif',
        'clay': 'clay/clay.tif',
        'sand': 'sand/sand.tif',
        'silt': 'slit/slit.tif',
        'organic': 'organic/organic.tif',
    }

    def read_nearest_value(src, latitude, longitude, max_radius=10):
        row, col = src.index(longitude, latitude)
        data = src.read(1)

        if 0 <= row < src.height and 0 <= col < src.width:
            value = data[int(row), int(col)]
            if not np.isnan(value):
                return float(value), None

        for radius in range(1, max_radius + 1):
            row_min = max(0, int(row) - radius)
            row_max = min(src.height, int(row) + radius + 1)
            col_min = max(0, int(col) - radius)
            col_max = min(src.width, int(col) + radius + 1)

            window = data[row_min:row_max, col_min:col_max]
            valid_values = window[~np.isnan(window)]
            if valid_values.size:
                return float(valid_values.flat[0]), None

        return None, 'No data at location'
    
    result = {
        'latitude': latitude,
        'longitude': longitude,
        'parameters': {}
    }
    
    for param_name, raster_path in soil_layers.items():
        full_path = soil_data_path / raster_path
        
        if not full_path.exists():
            result['parameters'][param_name] = {'value': None, 'error': 'File not found'}
            continue
        
        try:
            with rasterio.open(full_path) as src:
                value, error = read_nearest_value(src, latitude, longitude)
                if error:
                    result['parameters'][param_name] = {'value': None, 'error': error}
                else:
                    result['parameters'][param_name] = {'value': value}
        
        except Exception as e:
            result['parameters'][param_name] = {'value': None, 'error': str(e)}
    
    return JsonResponse(result)


@require_http_methods(["GET"])
def soil_reverse_district(request):
    """Resolve district name from latitude/longitude using reverse geocoding."""
    lat_str = request.GET.get('lat')
    lon_str = request.GET.get('lon')

    if not lat_str or not lon_str:
        return JsonResponse({'error': 'lat and lon parameters required'}, status=400)

    try:
        latitude = float(lat_str)
        longitude = float(lon_str)
    except ValueError:
        return JsonResponse({'error': 'lat and lon must be numbers'}, status=400)

    try:
        reverse_url = 'https://nominatim.openstreetmap.org/reverse'
        query = urlencode(
            {
                'lat': latitude,
                'lon': longitude,
                'format': 'jsonv2',
                'zoom': 10,
                'addressdetails': 1,
                'accept-language': 'en',
            }
        )
        request_obj = Request(
            f'{reverse_url}?{query}',
            headers={'User-Agent': 'krishi-margadarshan/1.0'},
        )

        with urlopen(request_obj, timeout=10) as response:
            payload = json.loads(response.read().decode('utf-8'))

        address = payload.get('address') or {}
        district_guess = (
            address.get('county')
            or address.get('state_district')
            or address.get('city_district')
            or address.get('municipality')
            or address.get('city')
            or ''
        )

        return JsonResponse(
            {
                'latitude': latitude,
                'longitude': longitude,
                'district_guess': district_guess,
                'address': address,
            }
        )
    except Exception as exc:
        return JsonResponse(
            {
                'latitude': latitude,
                'longitude': longitude,
                'district_guess': '',
                'error': str(exc),
            },
            status=200,
        )
