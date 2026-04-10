from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/articles/", include("articles.urls")),
    path("api/shop/", include("shop.urls")),
    path("api/advisory/", include("advisory.urls")),
    path("api/weather/", include("weather.urls")),
]
