from django.urls import path

from .views import AdminActivityLogView, AdminStatusView, CompleteProfileView, ConsultationSummaryView, LoginView, MeView, OAuthExchangeView, ProfilePhotoUploadView, ProfileUpdateView, RegisterView


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("complete-profile/", CompleteProfileView.as_view(), name="complete-profile"),
    path("login/", LoginView.as_view(), name="login"),
    path("oauth/", OAuthExchangeView.as_view(), name="oauth"),
    path("me/", MeView.as_view(), name="me"),
    path("consultation-summary/", ConsultationSummaryView.as_view(), name="consultation-summary"),
    path("profile/photo/", ProfilePhotoUploadView.as_view(), name="profile-photo"),
    path("admin-status/", AdminStatusView.as_view(), name="admin-status"),
    path("admin-activity/", AdminActivityLogView.as_view(), name="admin-activity"),
    path("profile/", ProfileUpdateView.as_view(), name="profile"),
]
