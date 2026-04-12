from rest_framework import permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta

from .serializers import (
    AdminActionLogSerializer,
    CompleteProfileSerializer,
    KrishiTokenObtainPairSerializer,
    OAuthExchangeSerializer,
    ProfilePhotoUploadSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .models import AdminActionLog
from advisory.models import AdvisoryQuestion


User = get_user_model()


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Signup successful. Please complete your profile details.",
                "email": user.email,
                "user": UserSerializer(user, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CompleteProfileView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CompleteProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Profile details saved. Please login to continue.",
                "user": UserSerializer(user, context={"request": request}).data,
            }
        )


class LoginView(TokenObtainPairView):
    serializer_class = KrishiTokenObtainPairSerializer


class OAuthExchangeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OAuthExchangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, created = serializer.save()
        if not user.profile_completed:
            return Response(
                {
                    "ok": True,
                    "profileIncomplete": True,
                    "email": user.email,
                    "message": (
                        f"{user.provider.title()} account connected. Please complete your profile details."
                        if created
                        else f"{user.provider.title()} account found. Continue with profile details if required."
                    ),
                }
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "ok": True,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user, context={"request": request}).data,
                "message": "OAuth login successful.",
            }
        )


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user, context={"request": request}).data)


class AdminStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "is_admin": bool(request.user.is_staff or request.user.is_superuser),
                "is_staff": bool(request.user.is_staff),
                "is_superuser": bool(request.user.is_superuser),
            }
        )


class ProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        serializer = CompleteProfileSerializer(data={**request.data, "email": request.user.email})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Profile details updated successfully.",
                "user": UserSerializer(user, context={"request": request}).data,
            }
        )


class ProfilePhotoUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        profile = request.user.profile
        serializer = ProfilePhotoUploadSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Profile photo updated successfully.",
                "user": UserSerializer(request.user, context={"request": request}).data,
            }
        )


class ConsultationSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        start_of_week = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)

        available_advisors = User.objects.filter(is_active=True).filter(Q(is_staff=True) | Q(is_superuser=True)).count()

        my_pending_questions = AdvisoryQuestion.objects.filter(user=request.user, status=AdvisoryQuestion.STATUS_PENDING).count()
        my_answered_this_week = AdvisoryQuestion.objects.filter(
            user=request.user,
            status=AdvisoryQuestion.STATUS_ANSWERED,
            replied_at__gte=start_of_week,
        ).count()

        answered_rows = AdvisoryQuestion.objects.filter(
            status=AdvisoryQuestion.STATUS_ANSWERED,
            replied_at__isnull=False,
        ).values_list("created_at", "replied_at")

        durations_in_minutes = []
        for created_at, replied_at in answered_rows:
            if created_at and replied_at and replied_at >= created_at:
                durations_in_minutes.append((replied_at - created_at).total_seconds() / 60)

        avg_response_minutes = None
        if durations_in_minutes:
            avg_response_minutes = int(round(sum(durations_in_minutes) / len(durations_in_minutes)))

        return Response(
            {
                "available_advisors": available_advisors,
                "avg_response_minutes": avg_response_minutes,
                "my_pending_questions": my_pending_questions,
                "my_answered_this_week": my_answered_this_week,
                "updated_at": now,
            }
        )


class AdminActivityLogView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({"message": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)

        logs = AdminActionLog.objects.select_related("actor")[:50]
        return Response(AdminActionLogSerializer(logs, many=True).data)
