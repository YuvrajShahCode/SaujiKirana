from django.test import TestCase
from django.contrib.auth import get_user_model
from shops.models import Shop
from products.models import Product
from orders.models import Order
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class BusinessRulesAuditTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.seller = User.objects.create_user(username='seller', password='password', role='SHOPKEEPER')
        self.customer = User.objects.create_user(username='customer', password='password', role='CUSTOMER')
        self.superuser = User.objects.create_superuser(username='admin', password='password', role='SUPERUSER')

    def test_one_seller_one_shop_constraint(self):
        """Rule: One Seller = One Shop"""
        self.client.force_authenticate(user=self.seller)
        
        # 1. Create First Shop -> Should Succeed
        payload = {
            "name": "Shop 1",
            "address": "Address 1",
            "latitude": 27.7172,
            "longitude": 85.3240,
            "delivery_radius_km": 6.0
        }
        response = self.client.post('/api/shops/', payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 2. Try Create Second Shop -> Should Fail
        payload2 = {
            "name": "Shop 2",
            "address": "Address 2",
            "latitude": 27.7172,
            "longitude": 85.3240
        }
        response2 = self.client.post('/api/shops/', payload2)
        # Expecting 400 Bad Request due to validation in ViewSet or DB constraint
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("You can only create one shop", str(response2.data))

    def test_shop_visibility(self):
        """Rule: Seller sees Pending Shop, Customer does not"""
        # Create Pending Shop directly in DB
        shop = Shop.objects.create(
            owner=self.seller,
            name="Pending Shop",
            address="Test Addr",
            latitude=27.7172,
            longitude=85.3240,
            status='PENDING'
        )

        # 1. Seller Request -> Should See It
        self.client.force_authenticate(user=self.seller)
        response = self.client.get('/api/shops/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Pending Shop")

        # 2. Customer Request -> Should NOT See It (assuming list filters Approved)
        self.client.force_authenticate(user=self.customer)
        response = self.client.get('/api/shops/')
        self.assertEqual(len(response.data), 0)

    def test_distance_validation_and_stock(self):
        """Rule: 6km Distance Strict & Stock Deduction"""
        shop = Shop.objects.create(
            owner=self.seller,
            name="Active Shop",
            address="Center",
            latitude=0.0,
            longitude=0.0,
            status='APPROVED',
            delivery_radius_km=6.0
        )
        product = Product.objects.create(
            shop=shop,
            name="Test Product",
            price=100.00,
            stock=10
        )

        self.client.force_authenticate(user=self.customer)

        # 1. Order > 6km (1 degree lat is ~111km)
        payload_far = {
            "shop": shop.id,
            "delivery_lat": 1.0, 
            "delivery_lng": 0.0, 
            "delivery_address": "Far Away",
            "items": [{"product_id": product.id, "quantity": 1}]
        }
        response = self.client.post('/api/orders/', payload_far, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("radius", str(response.data).lower())

        # 2. Order Within Range (0.01 deg is ~1.1km)
        payload_near = {
            "shop": shop.id,
            "delivery_lat": 0.01,
            "delivery_lng": 0.0,
            "delivery_address": "Nearby",
            "items": [{"product_id": product.id, "quantity": 2}]
        }
        response = self.client.post('/api/orders/', payload_near, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 3. Check Stock Deduction
        product.refresh_from_db()
        self.assertEqual(product.stock, 8)
