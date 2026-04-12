from django.urls import path

from .views import CompleteProfileView, LoginView, MeView, OAuthExchangeView, ProfileUpdateView, RegisterView


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("complete-profile/", CompleteProfileView.as_view(), name="complete-profile"),
    path("login/", LoginView.as_view(), name="login"),
    path("oauth/", OAuthExchangeView.as_view(), name="oauth"),
    path("me/", MeView.as_view(), name="me"),
    path("profile/", ProfileUpdateView.as_view(), name="profile"),
]
