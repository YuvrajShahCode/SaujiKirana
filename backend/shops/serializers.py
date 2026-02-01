from rest_framework import serializers
from .models import Shop

class ShopSerializer(serializers.ModelSerializer):
    distance = serializers.FloatField(read_only=True, required=False)

    class Meta:
        model = Shop
        fields = '__all__'
        read_only_fields = ('owner', 'created_at')
