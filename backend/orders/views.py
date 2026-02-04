from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product
from shops.models import Shop
import math

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'SUPERUSER':
            return Order.objects.select_related('customer', 'shop').all()
        if user.role == 'SHOPKEEPER':
            return Order.objects.select_related('customer', 'shop').filter(shop__owner=user)
        return Order.objects.select_related('customer', 'shop').filter(customer=user)

    def create(self, request, *args, **kwargs):
        # 1. Validate Shop & Location
        shop_id = request.data.get('shop')
        delivery_lat = float(request.data.get('delivery_lat'))
        delivery_lng = float(request.data.get('delivery_lng'))
        shop = Shop.objects.get(id=shop_id)

        # 2. Distance Check (Strict 6km)
        if not shop.is_within_radius(delivery_lat, delivery_lng):
            return Response(
                {"error": "Location is outside the shop's delivery radius (6km)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Create Order
        # Manually create to handle nested Logic cleanly or use serializer logic
        # Here we follow partial serializer usage
        
        items_input = request.data.get('items', []) # Expecting list of {product_id, quantity}
        
        # Calculate Total & Verify Stock
        total_amount = 0
        order_items = []
        
        for item in items_input:
            try:
                product = Product.objects.get(id=item['product_id'], shop=shop)
                if product.stock < item['quantity']:
                     return Response(
                        {"error": f"Insufficient stock for {product.name}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                order_items.append({
                    'product': product,
                    'quantity': item['quantity'],
                    'price': product.price
                })
                total_amount += product.price * item['quantity']
            except Product.DoesNotExist:
                 return Response(
                    {"error": f"Product not found in this shop"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # DB Creation
        order = Order.objects.create(
            customer=request.user,
            shop=shop,
            delivery_lat=delivery_lat,
            delivery_lng=delivery_lng,
            delivery_address=request.data.get('delivery_address', ''),
            total_amount=total_amount
        )

        for item in order_items:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price_at_order=item['price']
            )
            # Deduct stock
            # item['product'].stock -= item['quantity']
            # item['product'].save()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
