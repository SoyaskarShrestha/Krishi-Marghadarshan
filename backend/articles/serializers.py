from rest_framework import serializers

from .models import Article, SavedArticle


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = "__all__"


class SavedArticleSerializer(serializers.ModelSerializer):
    article = ArticleSerializer(read_only=True)
    article_id = serializers.PrimaryKeyRelatedField(source="article", queryset=Article.objects.all(), write_only=True)

    class Meta:
        model = SavedArticle
        fields = ("id", "article", "article_id", "created_at")
        read_only_fields = ("id", "created_at")
