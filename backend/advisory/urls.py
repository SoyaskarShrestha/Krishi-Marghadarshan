from django.urls import path

from .views import AdvisoryMetaView, AdvisoryQuestionCreateView


urlpatterns = [
    path("meta/", AdvisoryMetaView.as_view(), name="advisory-meta"),
    path("questions/", AdvisoryQuestionCreateView.as_view(), name="advisory-question-create"),
]
