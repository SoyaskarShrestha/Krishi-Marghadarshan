from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    AdminActionLogSerializer,
    CompleteProfileSerializer,
    KrishiTokenObtainPairSerializer,
    OAuthExchangeSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .models import AdminActionLog


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
                "user": UserSerializer(user).data,
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
                "user": UserSerializer(user).data,
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
                "user": UserSerializer(user).data,
                "message": "OAuth login successful.",
            }
        )


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


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
                "user": UserSerializer(user).data,
            }
        )


class AdminActivityLogView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({"message": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)

        logs = AdminActionLog.objects.select_related("actor")[:50]
        return Response(AdminActionLogSerializer(logs, many=True).data)
