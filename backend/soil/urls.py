from django.urls import path

from .views import soil_geojson, soil_map_page, soil_summary, soil_raster_layers, soil_data_at_point, soil_reverse_district


urlpatterns = [
    path("", soil_map_page, name="soil-map"),
    path("geojson/", soil_geojson, name="soil-geojson"),
    path("summary/", soil_summary, name="soil-summary"),
    path("raster/layers/", soil_raster_layers, name="soil-raster-layers"),
    path("raster/point/", soil_data_at_point, name="soil-data-at-point"),
    path("reverse-district/", soil_reverse_district, name="soil-reverse-district"),
]
