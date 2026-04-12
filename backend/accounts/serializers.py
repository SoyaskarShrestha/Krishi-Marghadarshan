from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import AdminActionLog, UserProfile


User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ("full_name", "location", "crop_type", "phone")


class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "provider",
            "profile_completed",
            "is_staff",
            "is_superuser",
            "profile",
        )

    def get_profile(self, obj):
        profile, _ = UserProfile.objects.get_or_create(user=obj)
        return UserProfileSerializer(profile).data


class AdminActionLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True)

    class Meta:
        model = AdminActionLog
        fields = (
            "id",
            "actor_email",
            "action",
            "target_type",
            "target_label",
            "target_id",
            "summary",
            "metadata",
            "created_at",
        )


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return email

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["name"].strip() or validated_data["email"],
            password=validated_data["password"],
            provider="password",
        )
        UserProfile.objects.create(user=user)
        return user


class CompleteProfileSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    fullName = serializers.CharField()
    location = serializers.CharField()
    cropType = serializers.CharField()
    phone = serializers.CharField()

    def save(self, **kwargs):
        email = self.validated_data["email"].strip().lower()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError({"message": "Account not found. Please sign up first."}) from exc

        profile, _ = UserProfile.objects.get_or_create(user=user)
        user.username = self.validated_data["username"].strip() or user.username
        user.profile_completed = True
        user.save()

        profile.full_name = self.validated_data["fullName"].strip()
        profile.location = self.validated_data["location"].strip()
        profile.crop_type = self.validated_data["cropType"].strip()
        profile.phone = self.validated_data["phone"].strip()
        profile.save()
        return user


class KrishiTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    def validate(self, attrs):
        email = attrs.get("email", "").strip().lower()
        password = attrs.get("password")
        user = User.objects.filter(email=email).first()

        if not user or user.provider != "password":
            raise serializers.ValidationError({"message": "No password-based account found for this email."})
        if not user.check_password(password):
            raise serializers.ValidationError({"message": "Invalid password."})
        if not user.profile_completed:
            raise serializers.ValidationError(
                {
                    "message": "Please complete your profile details before login.",
                    "profileIncomplete": True,
                    "email": user.email,
                }
            )
        attrs["email"] = email
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        data["message"] = "Login successful."
        return data


class OAuthExchangeSerializer(serializers.Serializer):
    provider = serializers.CharField()
    email = serializers.EmailField()
    name = serializers.CharField(required=False, allow_blank=True)

    def save(self, **kwargs):
        provider = self.validated_data["provider"].strip().lower()
        email = self.validated_data["email"].strip().lower()
        fallback_name = self.validated_data.get("name", "").strip() or f"{provider.title()} Farmer"

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": fallback_name,
                "provider": provider,
                "profile_completed": False,
            },
        )
        if user.provider != provider:
            user.provider = provider
            user.save(update_fields=["provider"])
        UserProfile.objects.get_or_create(user=user)
        return user, created
