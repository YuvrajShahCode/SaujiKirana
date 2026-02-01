from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Product.objects.filter(is_available=True)
        shop_id = self.request.query_params.get('shop_id')
        if shop_id:
            queryset = queryset.filter(shop_id=shop_id)
        return queryset

    def perform_create(self, serializer):
        # In a real app, validate user is shop owner
        # For now, we assume shop is passed or handled via nested route logic
        # But to keep it simple as per request, we allow passing shop_id in body (via serializer) 
        # OR we can restrict based on request.user.shop
        # We will require shop field in POST
        serializer.save()
