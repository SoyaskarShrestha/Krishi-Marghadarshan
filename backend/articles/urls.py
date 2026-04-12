from django.urls import path

from .views import ArticleDetailView, ArticleListCreateView, SavedArticleDetailView, SavedArticleListCreateView


urlpatterns = [
    path("", ArticleListCreateView.as_view(), name="article-list-create"),
    path("saved/", SavedArticleListCreateView.as_view(), name="saved-article-list-create"),
    path("saved/<int:article_id>/", SavedArticleDetailView.as_view(), name="saved-article-detail"),
    path("<int:pk>/", ArticleDetailView.as_view(), name="article-detail"),
]
