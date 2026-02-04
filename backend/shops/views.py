from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny
from .models import Shop
from .serializers import ShopSerializer
import math

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        # Default: Show only Active and Approved shops
        queryset = Shop.objects.select_related('owner').filter(is_active=True, status='APPROVED')
        
        # Admin or Shop Owner sees their own shops regardless of status
        if self.request.user.is_authenticated:
            if self.request.user.role == 'SUPERUSER':
                queryset = Shop.objects.select_related('owner').all()
            elif self.request.user.role == 'SHOPKEEPER':
                # Shopkeeper usually sees their own shop in Dashboard context
                # But for public list, they see others only if approved
                # We can handle "My Shop" via a separate action or filter
                pass

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
        # Ensure user doesn't already have a shop
        if Shop.objects.filter(owner=self.request.user).exists():
             from rest_framework.exceptions import ValidationError
             raise ValidationError({"error": "You can only create one shop."})
             
        serializer.save(
            owner=self.request.user,
            status='PENDING' # Always start as pending
        )
