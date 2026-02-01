from django.db import models
from shops.models import Shop

class Product(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    image_url = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.shop.name}"
