from datetime import datetime
from urllib.parse import urlencode
from urllib.request import urlopen
import json

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


GEOCODE_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_BASE_URL = "https://api.open-meteo.com/v1/forecast"

WEATHER_CODE_TO_CONDITION = {
    0: ("SUNNY", "Clear Sky", "CLEAR SKY", "sunny-chip"),
    1: ("PARTLY", "Mainly Clear", "MAINLY CLEAR", "neutral"),
    2: ("PARTLY", "Partly Cloudy", "PARTLY CLOUDY", "neutral"),
    3: ("CLOUDY", "Overcast", "OVERCAST", "neutral"),
    45: ("CLOUDY", "Fog", "FOGGY", "neutral"),
    48: ("CLOUDY", "Depositing Rime Fog", "FOGGY", "neutral"),
    51: ("RAINY", "Light Drizzle", "LIGHT DRIZZLE", "rainy"),
    53: ("RAINY", "Drizzle", "DRIZZLE", "rainy"),
    55: ("RAINY", "Dense Drizzle", "DENSE DRIZZLE", "rainy"),
    61: ("RAINY", "Slight Rain", "LIGHT RAIN", "rainy"),
    63: ("RAINY", "Rain", "RAIN", "rainy"),
    65: ("RAINY", "Heavy Rain", "HEAVY RAIN", "rainy"),
    66: ("RAINY", "Freezing Rain", "FREEZING RAIN", "rainy"),
    67: ("RAINY", "Heavy Freezing Rain", "FREEZING RAIN", "rainy"),
    71: ("CLOUDY", "Slight Snow", "LIGHT SNOW", "neutral"),
    73: ("CLOUDY", "Snow", "SNOW", "neutral"),
    75: ("CLOUDY", "Heavy Snow", "HEAVY SNOW", "neutral"),
    77: ("CLOUDY", "Snow Grains", "SNOW", "neutral"),
    80: ("RAINY", "Rain Showers", "SHOWERS", "rainy"),
    81: ("RAINY", "Rain Showers", "SHOWERS", "rainy"),
    82: ("RAINY", "Violent Rain Showers", "SHOWERS", "rainy"),
    85: ("CLOUDY", "Snow Showers", "SNOW SHOWERS", "neutral"),
    86: ("CLOUDY", "Heavy Snow Showers", "SNOW SHOWERS", "neutral"),
    95: ("RAINY", "Thunderstorm", "THUNDERSTORM", "rainy"),
    96: ("RAINY", "Thunderstorm with Hail", "THUNDERSTORM", "rainy"),
    99: ("RAINY", "Thunderstorm with Hail", "THUNDERSTORM", "rainy"),
}


def _fetch_json(url, params):
    query = urlencode(params)
    with urlopen(f"{url}?{query}", timeout=10) as response:
        return json.loads(response.read().decode("utf-8"))


def _format_time_label(iso_value):
    try:
        dt_value = datetime.fromisoformat(iso_value)
        return dt_value.strftime("%I:%M %p").lstrip("0")
    except (TypeError, ValueError):
        return "--"


def _condition_from_code(code):
    return WEATHER_CODE_TO_CONDITION.get(code, ("PARTLY", "Partly Cloudy", "PARTLY CLOUDY", "neutral"))


def _day_label(date_string, index):
    try:
        dt_value = datetime.fromisoformat(date_string)
        return "TODAY" if index == 0 else dt_value.strftime("%a").upper()
    except (TypeError, ValueError):
        return "TODAY" if index == 0 else "DAY"


class WeatherForecastView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        location = request.query_params.get("location", "Pokhara").strip() or "Pokhara"

        try:
            geocode = _fetch_json(
                GEOCODE_BASE_URL,
                {
                    "name": location,
                    "count": 1,
                    "language": "en",
                    "format": "json",
                },
            )
            results = geocode.get("results") or []
            if not results:
                return Response(
                    {"detail": f"No weather location found for '{location}'."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            first_match = results[0]
            latitude = first_match["latitude"]
            longitude = first_match["longitude"]
            resolved_name = first_match.get("name") or location
            country = first_match.get("country")
            location_label = f"{resolved_name}, {country}" if country else resolved_name

            forecast = _fetch_json(
                FORECAST_BASE_URL,
                {
                    "latitude": latitude,
                    "longitude": longitude,
                    "current": "temperature_2m,relative_humidity_2m,weather_code",
                    "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
                    "timezone": "auto",
                    "forecast_days": 7,
                },
            )

            current = forecast.get("current") or {}
            daily = forecast.get("daily") or {}

            condition, summary, sky_label, tone = _condition_from_code(current.get("weather_code"))
            humidity = current.get("relative_humidity_2m")
            precipitation_values = daily.get("precipitation_sum") or [0]
            rainfall = precipitation_values[0] if precipitation_values else 0

            humidity_label = "OPTIMAL" if isinstance(humidity, (int, float)) and 40 <= humidity <= 75 else "MODERATE"
            rainfall_label = "LOW" if isinstance(rainfall, (int, float)) and rainfall < 5 else "MODERATE"

            weekly = []
            dates = daily.get("time") or []
            highs = daily.get("temperature_2m_max") or []
            lows = daily.get("temperature_2m_min") or []
            codes = daily.get("weather_code") or []

            for idx, date_value in enumerate(dates[:7]):
                day_condition, _, _, day_tone = _condition_from_code(codes[idx] if idx < len(codes) else None)
                high = highs[idx] if idx < len(highs) else None
                low = lows[idx] if idx < len(lows) else None

                weekly.append(
                    {
                        "day": _day_label(date_value, idx),
                        "high": f"{round(high)}°" if isinstance(high, (int, float)) else "--",
                        "low": f"{round(low)}°" if isinstance(low, (int, float)) else "--",
                        "condition": day_condition,
                        "tone": day_tone,
                    }
                )

            return Response(
                {
                    "location": location_label,
                    "current": {
                        "temperature_c": round(current.get("temperature_2m", 0)),
                        "condition": condition,
                        "summary": summary,
                        "timestamp": _format_time_label(current.get("time")),
                        "sky_label": sky_label,
                    },
                    "stats": [
                        {
                            "label": humidity_label,
                            "value": f"{humidity}%" if isinstance(humidity, (int, float)) else "--",
                            "title": "Humidity",
                            "kind": "humidity",
                        },
                        {
                            "label": rainfall_label,
                            "value": f"{round(rainfall)}mm" if isinstance(rainfall, (int, float)) else "--",
                            "title": "Expected Rainfall",
                            "kind": "rainfall",
                        },
                    ],
                    "weekly": weekly,
                    "guide": {
                        "title": "Smart Agriculture Guide",
                        "body": (
                            f"Live weather for {location_label} indicates {summary.lower()} conditions. "
                            "Use this weekly outlook to adjust irrigation timing and field activity planning."
                        ),
                        "tags": ["Weather-Based Planning", "Field Operations", "Irrigation Management"],
                    },
                }
            )
        except Exception:
            return Response(
                {"detail": "Unable to fetch weather data from the live service right now."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
