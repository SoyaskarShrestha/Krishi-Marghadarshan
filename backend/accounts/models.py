from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    provider = models.CharField(max_length=32, default="password")
    profile_completed = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    crop_type = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.user.email
