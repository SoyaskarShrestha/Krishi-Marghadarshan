from django.db import models
from django.conf import settings


class Article(models.Model):
    title = models.CharField(max_length=255)
    title_nepali = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=120)
    description = models.TextField()
    badge = models.CharField(max_length=50, blank=True)
    read_time = models.CharField(max_length=50, blank=True)
    published_label = models.CharField(max_length=50, blank=True)
    featured = models.BooleanField(default=False)
    photo = models.ImageField(upload_to="articles/", blank=True, null=True)

    def __str__(self):
        return self.title


class SavedArticle(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_articles")
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="saved_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "article"], name="unique_saved_article_per_user"),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} saved {self.article.title}"
