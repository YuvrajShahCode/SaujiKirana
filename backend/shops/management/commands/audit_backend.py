from django.core.management.base import BaseCommand
import django
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from shops.models import Shop
from products.models import Product

User = get_user_model()

class Command(BaseCommand):
    help = 'Audits backend business rules'

    def handle(self, *args, **options):
        self.stdout.write("\nSTARTING SAUJI KIRANA BACKEND AUDIT\n" + "="*50)
        client = APIClient()
        
        # --- SETUP ---
        user_model = get_user_model()
        if not user_model.objects.filter(username='audit_admin').exists():
            user_model.objects.create_superuser('audit_admin', 'admin@audit.com', 'password123', role='SUPERUSER')
        
        if user_model.objects.filter(username='audit_seller').exists():
           user_model.objects.get(username='audit_seller').delete()
        seller = user_model.objects.create_user('audit_seller', 'seller@audit.com', 'password123') 

        if user_model.objects.filter(username='audit_customer').exists():
           user_model.objects.get(username='audit_customer').delete()
        cust_user = user_model.objects.create_user('audit_customer', 'cust@audit.com', 'password123')

        self.stdout.write("Test Users Created")

        # --- TEST 1: AUTHENTICATION & SUPERUSER BLOCK ---
        self.stdout.write("\nTEST 1: AUTH & SUPERUSER BLOCK")
        
        resp = client.post('/api/auth/login/', {'username': 'audit_admin', 'password': 'password123'})
        if resp.status_code == 403:
            self.stdout.write("   [PASS] Superuser API Login Blocked (403)")
        else:
            self.stdout.write(f"   [FAIL] Superuser API Login Allowed ({resp.status_code}) - FAIL")

        resp = client.post('/api/auth/login/', {'username': 'audit_customer', 'password': 'password123'})
        if resp.status_code == 200:
            cust_token = resp.data['access']
            self.stdout.write("   [PASS] Customer Login Success")
        else:
            self.stdout.write(f"   [FAIL] Customer Login Failed ({resp.status_code})")
            return

        resp = client.post('/api/auth/login/', {'username': 'audit_seller', 'password': 'password123'})
        if resp.status_code == 200:
            seller_token = resp.data['access']
            self.stdout.write("   [PASS] Seller Login Success")
        else:
            self.stdout.write(f"   [FAIL] Seller Login Failed")
            return

        # --- TEST 2: SELLER ONBOARDING & SHOP LOGIC ---
        self.stdout.write("\nTEST 2: SELLER SHOP CREATION & RBAC")
        
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {seller_token}')
        
        shop_data = {
            'name': 'Audit Shop',
            'address': 'Test Loc',
            'latitude': 27.7172,
            'longitude': 85.3240
        }
        resp = client.post('/api/shops/', shop_data)
        if resp.status_code == 201:
            shop_id = resp.data['id']
            self.stdout.write("   [PASS] Shop Created Successfully")
        else:
            self.stdout.write(f"   [FAIL] Shop Creation Failed: {resp.data}")
            return

        seller.refresh_from_db()
        seller.refresh_from_db()
        if seller.role == 'SHOPKEEPER':
             self.stdout.write("   [PASS] User Role Upgraded to SHOPKEEPER")
        else:
             self.stdout.write(f"   [FAIL] User Role NOT Upgraded (Role: {seller.role})")

        resp = client.post('/api/shops/', {'name': 'Second Shop', 'address': 'X', 'latitude': 0, 'longitude': 0})
        # Expecting 400 because validation raises ValidationError
        if resp.status_code == 400: 
             self.stdout.write("   [PASS] One Shop Per Seller Enforced")
        else:
             self.stdout.write(f"   [FAIL] Multiple Shops Allowed ({resp.status_code})")

        shop = Shop.objects.get(id=shop_id)
        if shop.status == 'PENDING':
            self.stdout.write("   [PASS] Shop Status is PENDING by default")
        else:
            self.stdout.write(f"   [FAIL] Shop Status is {shop.status} (Expected PENDING)")

        # --- TEST 3: ORDER RESTRICTIONS ---
        self.stdout.write("\nTEST 3: ORDER LOGIC & APPROVAL")
        
        product = Product.objects.create(shop=shop, name="Audit Item", price=100, stock=10)
        
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {cust_token}')
        
        order_data = {
            'shop': shop_id,
            'delivery_lat': 27.7200, 
            'delivery_lng': 85.3300,
            'delivery_address': "Near",
            'items': [{'product_id': product.id, 'quantity': 1}]
        }
        resp = client.post('/api/orders/', order_data, format='json')
        if resp.status_code == 400 and "not currently accepting orders" in str(resp.data):
            self.stdout.write("   [PASS] Pending Shop Cannot Receive Orders")
        else:
            self.stdout.write(f"   [FAIL] Pending Shop Order Allowed or Wrong Error ({resp.status_code}, {resp.data})")

        shop.status = 'APPROVED'
        shop.save()
        self.stdout.write("   Manually Approved Shop for Testing")

        # --- TEST 4: LOCATION STRICTNESS ---
        self.stdout.write("\nTEST 4: LOCATION & DISTANCE RULES")
        
        order_data['delivery_lat'] = 27.8000 
        resp = client.post('/api/orders/', order_data, format='json')
        if resp.status_code == 400 and "radius" in str(resp.data):
            self.stdout.write("   [PASS] Distance Rule Enforced (>6km Blocked)")
        else:
            self.stdout.write(f"   [FAIL] Distance Rule Failed ({resp.status_code}, {resp.data})")

        order_data['delivery_lat'] = 27.7200
        resp = client.post('/api/orders/', order_data, format='json')
        if resp.status_code == 201:
            self.stdout.write("   [PASS] Valid Distance Order Accepted")
        else:
            self.stdout.write(f"   [FAIL] Valid Order Failed ({resp.status_code}, {resp.data})")

        self.stdout.write("\n" + "="*50 + "\nAUDIT COMPLETE")
