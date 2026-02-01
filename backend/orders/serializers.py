from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer
from shops.serializers import ShopSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('product', 'quantity', 'price_at_order')
        read_only_fields = ('price_at_order',)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    items_input = serializers.ListField(write_only=True, child=serializers.DictField())
    
    shop_details = ShopSerializer(source='shop', read_only=True)
    customer_details = serializers.StringRelatedField(source='customer', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('customer', 'total_amount', 'status', 'created_at')

    def create(self, validated_data):
        items_data = validated_data.pop('items_input')
        order = Order.objects.create(**validated_data)
        
        total = 0
        for item_data in items_data:
            product = serializer_fields=Product.objects.get(id=item_data['product_id'])
            # Assuming product_id is passed in dict
            quantity = item_data['quantity']
            price = product.price
            
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price_at_order=price
            )
            total += price * quantity
        
        order.total_amount = total
        order.save()
        return order
