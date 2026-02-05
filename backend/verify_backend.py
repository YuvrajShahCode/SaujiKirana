import os
import django
from rest_framework.test import APIClient
from rest_framework import status

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sauji_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from shops.models import Shop
from products.models import Product
from orders.models import Order

User = get_user_model()

def run_audit():
    print("\n🔍 STARTING SAUJI KIRANA BACKEND AUDIT\n" + "="*50)
    client = APIClient()
    
    # --- SETUP ---
    # Create Users
    superuser_data = {'username': 'audit_admin', 'password': 'password123', 'email': 'admin@audit.com', 'role': 'SUPERUSER'}
    if not User.objects.filter(username='audit_admin').exists():
        User.objects.create_superuser(**superuser_data)
    
    seller_data = {'username': 'audit_seller', 'password': 'password123', 'email': 'seller@audit.com'}
    if User.objects.filter(username='audit_seller').exists():
       User.objects.get(username='audit_seller').delete() # Reset
    seller = User.objects.create_user(**seller_data) # Starts as CUSTOMER default

    customer_data = {'username': 'audit_customer', 'password': 'password123', 'email': 'cust@audit.com'}
    if User.objects.filter(username='audit_customer').exists():
       User.objects.get(username='audit_customer').delete()
    customer = User.objects.create_user(**customer_data)

    print("✅ Test Users Created")

    # --- TEST 1: AUTHENTICATION & SUPERUSER BLOCK ---
    print("\n🔹 TEST 1: AUTH & SUPERUSER BLOCK")
    
    # 1.1 Superuser Login
    resp = client.post('/api/auth/login/', {'username': 'audit_admin', 'password': 'password123'})
    if resp.status_code == 403:
        print("   ✅ Superuser API Login Blocked (403)")
    else:
        print(f"   ❌ Superuser API Login Allowed ({resp.status_code}) - FAIL")

    # 1.2 Customer Login
    resp = client.post('/api/auth/login/', {'username': 'audit_customer', 'password': 'password123'})
    if resp.status_code == 200:
        cust_token = resp.data['access']
        print("   ✅ Customer Login Success")
    else:
        print(f"   ❌ Customer Login Failed ({resp.status_code})")
        return

    # 1.3 Seller Login
    resp = client.post('/api/auth/login/', {'username': 'audit_seller', 'password': 'password123'})
    if resp.status_code == 200:
        seller_token = resp.data['access']
        print("   ✅ Seller Login Success")
    else:
        print(f"   ❌ Seller Login Failed")
        return


    # --- TEST 2: SELLER ONBOARDING & SHOP LOGIC ---
    print("\n🔹 TEST 2: SELLER SHOP CREATION & RBAC")
    
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {seller_token}')
    
    # 2.1 Create Shop
    shop_data = {
        'name': 'Audit Shop',
        'address': 'Test Loc',
        'latitude': 27.7172,
        'longitude': 85.3240
    }
    resp = client.post('/api/shops/', shop_data)
    if resp.status_code == 201:
        shop_id = resp.data['id']
        print("   ✅ Shop Created Successfully")
    else:
        print(f"   ❌ Shop Creation Failed: {resp.data}")
        return

    # 2.2 Verify User Role Upgrade
    seller.refresh_from_db()
    if seller.role == 'SHOPKEEPER':
         print("   ✅ User Role Upgraded to SHOPKEEPER")
    else:
         print(f"   ❌ User Role NOT Upgraded (Role: {seller.role})")

    # 2.3 Verify One Shop Rule
    resp = client.post('/api/shops/', {'name': 'Second Shop', 'address': 'X', 'latitude': 0, 'longitude': 0})
    if resp.status_code == 400: # Or 403 depending on implementation, 400 from our view logic
         print("   ✅ One Shop Per Seller Enforced")
    else:
         print(f"   ❌ Multiple Shops Allowed ({resp.status_code})")

    # 2.4 Verify Shop Status Pending
    shop = Shop.objects.get(id=shop_id)
    if shop.status == 'PENDING':
        print("   ✅ Shop Status is PENDING by default")
    else:
        print(f"   ❌ Shop Status is {shop.status} (Expected PENDING)")


    # --- TEST 3: ORDER RESTRICTIONS ---
    print("\n🔹 TEST 3: ORDER LOGIC & APPROVAL")
    
    # 3.0 Setup Product
    product = Product.objects.create(shop=shop, name="Audit Item", price=100, stock=10)
    
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {cust_token}')
    
    # 3.1 Try Order from PENDING Shop (Should Fail)
    # 1km away
    order_data = {
        'shop': shop_id,
        'delivery_lat': 27.7200, 
        'delivery_lng': 85.3300,
        'delivery_address': "Near",
        'items': [{'product_id': product.id, 'quantity': 1}]
    }
    resp = client.post('/api/orders/', order_data, format='json')
    if resp.status_code == 400 and "not currently accepting orders" in str(resp.data):
        print("   ✅ Pending Shop Cannot Receive Orders")
    else:
        print(f"   ❌ Pending Shop Order Allowed or Wrong Error ({resp.status_code}, {resp.data})")

    # 3.2 Approve Shop
    shop.status = 'APPROVED'
    shop.save()
    print("   ℹ️  Manually Approved Shop for Testing")


    # --- TEST 4: LOCATION STRICTNESS ---
    print("\n🔹 TEST 4: LOCATION & DISTANCE RULES")
    
    # 4.1 Order > 6km (Fail)
    # 9km away
    order_data['delivery_lat'] = 27.8000 
    resp = client.post('/api/orders/', order_data, format='json')
    if resp.status_code == 400 and "radius" in str(resp.data):
        print("   ✅ Distance Rule Enforced (>6km Blocked)")
    else:
        print(f"   ❌ Distance Rule Failed ({resp.status_code}, {resp.data})")

    # 4.2 Order < 6km (Success)
    # 1km away
    order_data['delivery_lat'] = 27.7200
    resp = client.post('/api/orders/', order_data, format='json')
    if resp.status_code == 201:
        print("   ✅ Valid Distance Order Accepted")
    else:
        print(f"   ❌ Valid Order Failed ({resp.status_code}, {resp.data})")

    print("\n" + "="*50 + "\nAUDIT COMPLETE")

if __name__ == "__main__":
    run_audit()
