from django.urls import path

from .views import ArticleDetailView, ArticleListCreateView


urlpatterns = [
    path("", ArticleListCreateView.as_view(), name="article-list-create"),
    path("<int:pk>/", ArticleDetailView.as_view(), name="article-detail"),
]
