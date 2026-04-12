from rest_framework import serializers

from .models import AdvisoryQuestion


class AdvisoryQuestionSerializer(serializers.ModelSerializer):
    advisor_name = serializers.SerializerMethodField()
    submitted_by = serializers.SerializerMethodField()

    class Meta:
        model = AdvisoryQuestion
        fields = (
            "id",
            "full_name",
            "category",
            "question",
            "status",
            "advisor_reply",
            "advisor_name",
            "submitted_by",
            "replied_at",
            "language",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "status",
            "advisor_reply",
            "advisor_name",
            "submitted_by",
            "replied_at",
            "created_at",
            "updated_at",
        )

    def get_advisor_name(self, obj):
        if not obj.advisor:
            return ""
        return obj.advisor.username or obj.advisor.email

    def get_submitted_by(self, obj):
        if not obj.user:
            return ""
        return obj.user.email


class AdvisoryReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvisoryQuestion
        fields = ("advisor_reply",)

    def validate_advisor_reply(self, value):
        clean_value = value.strip()
        if not clean_value:
            raise serializers.ValidationError("Reply cannot be empty.")
        return clean_value
