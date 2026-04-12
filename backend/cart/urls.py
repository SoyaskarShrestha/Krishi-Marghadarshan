from django.urls import path
from .views import CartListCreateView, CartDetailView, CartItemView

urlpatterns = [
    path(" ", CartListCreateView.as_view()),
    path("<int:pk>/", CartDetailView.as_view()),
    path("item/", CartItemView.as_view()),
]