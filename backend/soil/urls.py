from django.urls import path

from .views import soil_geojson, soil_map_page, soil_summary


urlpatterns = [
    path("", soil_map_page, name="soil-map"),
    path("geojson/", soil_geojson, name="soil-geojson"),
    path("summary/", soil_summary, name="soil-summary"),
]
