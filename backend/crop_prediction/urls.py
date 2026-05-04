# crop/urls.py

from django.urls import path
from .views import PredictView, BatchPredictView, OptionsView

urlpatterns = [
    path("predict/",         PredictView.as_view(),      name="crop-predict"),
    path("predict/batch/",   BatchPredictView.as_view(), name="crop-predict-batch"),
    path("predict/options/", OptionsView.as_view(),      name="crop-options"),
]
