from django.conf import settings
from django.db import models


class AdvisoryQuestion(models.Model):
    STATUS_PENDING = "pending"
    STATUS_ANSWERED = "answered"

    STATUS_CHOICES = (
        (STATUS_PENDING, "Pending"),
        (STATUS_ANSWERED, "Answered"),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    full_name = models.CharField(max_length=255)
    category = models.CharField(max_length=120)
    question = models.TextField()
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_PENDING)
    advisor_reply = models.TextField(blank=True)
    advisor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="advisory_responses")
    replied_at = models.DateTimeField(null=True, blank=True)
    language = models.CharField(max_length=5, default="en")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.category})"
