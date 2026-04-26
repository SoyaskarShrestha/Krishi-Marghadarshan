from django.urls import path

from .views import GeminiChatView


urlpatterns = [
    path("message/", GeminiChatView.as_view(), name="gemini-chat-message"),
]
