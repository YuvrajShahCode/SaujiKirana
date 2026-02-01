from django.db import models
from django.conf import settings
import math

class Shop(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shops')
    name = models.CharField(max_length=255)
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    delivery_radius_km = models.FloatField(default=6.0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def is_within_radius(self, user_lat, user_lng):
        """
        Check if the user is within the shop's delivery radius using Haversine formula.
        """
        R = 6371  # Earth radius in km
        dlat = math.radians(user_lat - self.latitude)
        dlon = math.radians(user_lng - self.longitude)
        
        a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
             math.cos(math.radians(self.latitude)) * math.cos(math.radians(user_lat)) *
             math.sin(dlon / 2) * math.sin(dlon / 2))
        
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        
        return distance <= self.delivery_radius_km
