from rest_framework import serializers

from .models import AdvisoryQuestion


class AdvisoryQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvisoryQuestion
        fields = ("id", "full_name", "category", "question", "language", "created_at")
        read_only_fields = ("id", "created_at")
