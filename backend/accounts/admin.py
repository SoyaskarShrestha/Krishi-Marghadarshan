from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, UserProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "username", "provider", "profile_completed", "is_staff")
    ordering = ("email",)
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Krishi", {"fields": ("provider", "profile_completed")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Krishi", {"fields": ("email", "provider", "profile_completed")}),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "full_name", "location", "crop_type", "phone")
