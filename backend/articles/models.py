from django.db import models


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
