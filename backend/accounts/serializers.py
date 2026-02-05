from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone_number')
        read_only_fields = ('id',)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role', 'phone_number')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', User.Role.CUSTOMER),
            phone_number=validated_data.get('phone_number', '')
        )
        return user

from shops.models import Shop

class CreateSellerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    shop_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'shop_id')

    def create(self, validated_data):
        shop_id = validated_data.pop('shop_id')
        try:
            shop = Shop.objects.get(id=shop_id)
        except Shop.DoesNotExist:
            raise serializers.ValidationError({"shop_id": "Shop not found."})

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=User.Role.SHOPKEEPER
        )
        
        # Assign shop to this user
        shop.owner = user
        shop.save()
        
        return user

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import PermissionDenied

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Block Superuser
        if self.user.is_superuser:
            raise PermissionDenied("Superuser login is restricted to the Admin Panel.")

        # Add custom claims/response data
        data['role'] = self.user.role
        data['username'] = self.user.username
        data['user_id'] = self.user.id
        
        return data
