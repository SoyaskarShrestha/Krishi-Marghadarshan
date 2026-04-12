from django.contrib import admin

from .models import AdvisoryQuestion


@admin.register(AdvisoryQuestion)
class AdvisoryQuestionAdmin(admin.ModelAdmin):
    list_display = ("full_name", "category", "language", "created_at")
    search_fields = ("full_name", "category", "question")
    ordering = ("-created_at",)
