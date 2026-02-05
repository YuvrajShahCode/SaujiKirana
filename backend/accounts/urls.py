from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import RegisterView, CreateSellerView, CustomTokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('create-seller/', CreateSellerView.as_view(), name='create_seller'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
