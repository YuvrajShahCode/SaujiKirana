from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, CreateSellerView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('create-seller/', CreateSellerView.as_view(), name='create_seller'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
