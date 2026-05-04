from pathlib import Path

import joblib
from django.apps import AppConfig


class CropPredictionConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "crop_prediction"

    model = None
    encoders = None
    feature_names = None

    def ready(self):
        """Called once when Django starts. Loads all .pkl files into memory."""
        base_dir = Path(__file__).resolve().parent
        model_path = base_dir / "crop_model.pkl"
        encoders_path = base_dir / "encoders.pkl"
        features_path = base_dir / "feature_names.pkl"

        if not model_path.exists() or not encoders_path.exists() or not features_path.exists():
            self.model = None
            self.encoders = None
            self.feature_names = None
            return

        self.model = joblib.load(model_path)
        self.encoders = joblib.load(encoders_path)
        self.feature_names = joblib.load(features_path)

