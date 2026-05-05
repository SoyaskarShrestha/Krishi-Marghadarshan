from django.db import models


class SoilParameter(models.Model):
    """Metadata for soil parameters from raster data"""
    
    PARAMETER_CHOICES = [
        ('ph', 'pH Level'),
        ('nitrogen', 'Nitrogen (N)'),
        ('phosphorus', 'Phosphorus (P2O5)'),
        ('potassium', 'Potassium (K)'),
        ('boron', 'Boron'),
        ('zinc', 'Zinc'),
        ('clay', 'Clay (%)'),
        ('sand', 'Sand (%)'),
        ('silt', 'Silt (%)'),
        ('organic', 'Organic Matter (%)'),
    ]
    
    name = models.CharField(max_length=50, choices=PARAMETER_CHOICES, unique=True)
    raster_path = models.CharField(max_length=255)
    unit = models.CharField(max_length=50)
    min_value = models.FloatField()
    max_value = models.FloatField()
    mean_value = models.FloatField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Soil Parameters'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.get_name_display()} ({self.unit})"


class SoilSurveyPoint(models.Model):
    """Individual soil survey points with extracted values"""
    
    latitude = models.FloatField()
    longitude = models.FloatField()
    
    ph = models.FloatField(null=True, blank=True)
    nitrogen = models.FloatField(null=True, blank=True)
    phosphorus = models.FloatField(null=True, blank=True)
    potassium = models.FloatField(null=True, blank=True)
    boron = models.FloatField(null=True, blank=True)
    zinc = models.FloatField(null=True, blank=True)
    clay = models.FloatField(null=True, blank=True)
    sand = models.FloatField(null=True, blank=True)
    silt = models.FloatField(null=True, blank=True)
    organic = models.FloatField(null=True, blank=True)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['latitude', 'longitude']),
        ]
    
    def __str__(self):
        return f"Point at ({self.latitude}, {self.longitude})"
