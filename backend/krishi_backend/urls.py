from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/articles/", include("articles.urls")),
    path("api/shop/", include("shop.urls")),
    path("api/advisory/", include("advisory.urls")),
    path("api/weather/", include("weather.urls")),
    path("api/cart/", include("cart.urls")),
    path("api/chatbot/", include("chatbot.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
