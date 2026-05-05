from rest_framework import serializers
from .models import SoilParameter, SoilSurveyPoint


class SoilParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilParameter
        fields = ['id', 'name', 'get_name_display', 'unit', 'min_value', 'max_value', 'mean_value', 'description']


class SoilSurveyPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilSurveyPoint
        fields = [
            'id', 'latitude', 'longitude', 'ph', 'nitrogen', 'phosphorus', 
            'potassium', 'boron', 'zinc', 'clay', 'sand', 'silt', 'organic', 
            'notes', 'created_at'
        ]
