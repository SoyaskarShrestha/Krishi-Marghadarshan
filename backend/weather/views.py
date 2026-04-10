from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView


class WeatherForecastView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        location = request.query_params.get("location", "Pokhara").strip() or "Pokhara"

        return Response(
            {
                "location": location,
                "current": {
                    "temperature_c": 22,
                    "condition": "PARTLY",
                    "summary": "Partly Cloudy",
                    "timestamp": "10:45 AM",
                    "sky_label": "SCATTERED CLOUDS",
                },
                "stats": [
                    {
                        "label": "OPTIMAL",
                        "value": "64%",
                        "title": "Humidity",
                        "kind": "humidity",
                    },
                    {
                        "label": "MODERATE",
                        "value": "12mm",
                        "title": "Expected Rainfall",
                        "kind": "rainfall",
                    },
                ],
                "weekly": [
                    {"day": "TODAY", "high": "24°", "low": "18°", "condition": "SUNNY", "tone": "sunny-chip"},
                    {"day": "MON", "high": "22°", "low": "16°", "condition": "CLOUDY", "tone": "neutral"},
                    {"day": "TUE", "high": "19°", "low": "15°", "condition": "RAINY", "tone": "rainy"},
                    {"day": "WED", "high": "21°", "low": "16°", "condition": "PARTLY", "tone": "neutral"},
                    {"day": "THU", "high": "25°", "low": "19°", "condition": "SUNNY", "tone": "neutral"},
                    {"day": "FRI", "high": "26°", "low": "20°", "condition": "SUNNY", "tone": "neutral"},
                    {"day": "SAT", "high": "24°", "low": "18°", "condition": "PARTLY", "tone": "neutral"},
                ],
                "guide": {
                    "title": "Smart Agriculture Guide",
                    "body": (
                        f"Based on the latest forecast for {location}, this is a suitable week for field preparation. "
                        "Moderate humidity and scattered showers reduce irrigation pressure."
                    ),
                    "tags": ["Planting Season", "Low Irrigation Need", "Favorable Winds"],
                },
            }
        )
