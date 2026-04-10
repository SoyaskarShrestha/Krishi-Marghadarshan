from django.urls import path

from .views import AdvisoryMetaView, AdvisoryQuestionCreateView, AdvisoryQuestionDetailView


urlpatterns = [
    path("meta/", AdvisoryMetaView.as_view(), name="advisory-meta"),
    path("questions/", AdvisoryQuestionCreateView.as_view(), name="advisory-question-create"),
    path("questions/<int:pk>/", AdvisoryQuestionDetailView.as_view(), name="advisory-question-detail"),
]
