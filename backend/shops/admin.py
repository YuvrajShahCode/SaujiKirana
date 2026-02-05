from django.contrib import admin
from .models import Shop

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'status', 'is_active', 'address', 'created_at')
    list_filter = ('status', 'is_active', 'created_at')
    search_fields = ('name', 'owner__username', 'address')
    ordering = ('-created_at',)
    actions = ['approve_shops', 'suspend_shops', 'reject_shops']

    def approve_shops(self, request, queryset):
        queryset.update(status='APPROVED', is_active=True)
    approve_shops.short_description = "Approve selected shops"

    def suspend_shops(self, request, queryset):
        queryset.update(status='SUSPENDED', is_active=False)
    suspend_shops.short_description = "Suspend selected shops"

    def reject_shops(self, request, queryset):
        # We might want to keep the record but mark as rejected, or delete. 
        # For now, let's keep it as Rejected status if valid.
        # But Status choices are PENDING, APPROVED, SUSPENDED.
        # Ideally we should add REJECTED to choices if needed, but for now Suspend/Delete is fine.
        # Let's check model choices again.
        # Model choices: PENDING, APPROVED, SUSPENDED. 
        # So I will just allow Suspend or re-pending.
        # Actually proper flow is Approve or Suspend.
        pass
    
    # Redefine actions to match model exactly
    def reject_shops(self, request, queryset):
        queryset.update(status='SUSPENDED', is_active=False)
    reject_shops.short_description = "Reject/Suspend selected shops"
