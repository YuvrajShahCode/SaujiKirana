from rest_framework import serializers
from .models import Product
from shops.serializers import ShopSerializer

class ProductSerializer(serializers.ModelSerializer):
    shop_details = ShopSerializer(source='shop', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('shop',)
