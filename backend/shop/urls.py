from django.urls import path

from .views import CartItemDetailView, CartItemListCreateView, ProductDetailView, ProductListView


urlpatterns = [
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("cart/", CartItemListCreateView.as_view(), name="cart-list-create"),
    path("cart/<int:pk>/", CartItemDetailView.as_view(), name="cart-detail"),
]
