from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Shop
from .serializers import ShopSerializer
import math

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Shop.objects.filter(is_active=True)
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')

        if lat and lng:
            try:
                user_lat = float(lat)
                user_lng = float(lng)
                R = 6371  # Earth radius in km

                # In a real heavy production, use PostGIS. 
                # For this specific requirement " Implement Haversine formula in Django",
                # we will filter in Python or use custom SQL. 
                # Doing it in Python for simplicity/demonstration as requested, 
                # but for huge DBs, use `annotate` with raw SQL.
                
                filtered_shops = []
                for shop in queryset:
                    dlat = math.radians(user_lat - shop.latitude)
                    dlon = math.radians(user_lng - shop.longitude)
                    a = (math.sin(dlat/2)**2 + 
                         math.cos(math.radians(shop.latitude)) * math.cos(math.radians(user_lat)) * 
                         math.sin(dlon/2)**2)
                    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
                    dist = R * c
                    
                    if dist <= shop.delivery_radius_km:
                        shop.distance = round(dist, 2)
                        filtered_shops.append(shop)
                
                # Sort by distance
                filtered_shops.sort(key=lambda x: x.distance)
                return filtered_shops

            except ValueError:
                pass
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
