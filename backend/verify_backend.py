import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sauji_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from shops.models import Shop
from products.models import Product
from orders.models import Order, OrderItem
from orders.views import OrderViewSet # To test logic if needed, but better test models/serializers
import math

User = get_user_model()

def run_verification():
    print("--- Starting Backend Verification ---")

    # 1. Setup Data
    # Shop Owner
    owner, _ = User.objects.get_or_create(username='shopowner', defaults={'role': 'SHOPKEEPER', 'email': 'shop@test.com'})
    owner.set_password('pass123')
    owner.save()
    
    # Customer
    customer, _ = User.objects.get_or_create(username='customer', defaults={'role': 'CUSTOMER', 'email': 'cust@test.com'})
    customer.set_password('pass123')
    customer.save()

    # Shop (Center at 0,0 for simplicity)
    # 1 deg lat is approx 111km. So 6km is very small (~0.05 degrees)
    # Let's say Shop at (27.7172, 85.3240) [Kathmandu]
    # 6km radius.
    shop, _ = Shop.objects.get_or_create(
        name="Test Shop",
        defaults={
            'owner': owner,
            'address': "Kathmandu",
            'latitude': 27.7172,
            'longitude': 85.3240,
            'delivery_radius_km': 6.0
        }
    )
    
    # Product
    product, _ = Product.objects.get_or_create(
        shop=shop, 
        name="Test Product", 
        defaults={'price': 100, 'stock': 50}
    )

    print(f"Shop created at ({shop.latitude}, {shop.longitude}) with radius {shop.delivery_radius_km}km")

    # 2. Test Distance Logic
    # Point A: Inside (27.72, 85.33) -> approx 1km away
    lat_in, lng_in = 27.7200, 85.3300
    is_in = shop.is_within_radius(lat_in, lng_in)
    print(f"Location ({lat_in}, {lng_in}) (approx 1km away) - Within Radius? {is_in} (Expected: True)")

    # Point B: Outside (27.80, 85.32) -> approx 9km away
    lat_out, lng_out = 27.8000, 85.3240
    is_out = shop.is_within_radius(lat_out, lng_out)
    print(f"Location ({lat_out}, {lng_out}) (approx 9km away) - Within Radius? {is_out} (Expected: False)")

    if is_in and not is_out:
        print("✅ Distance Validation Logic Passed")
    else:
        print("❌ Distance Validation Logic Failed")

    print("--- Verification Complete ---")

if __name__ == "__main__":
    run_verification()
