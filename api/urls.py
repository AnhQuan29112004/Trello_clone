

from django.urls import path,include
from decouple import config

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from Account.views import RegisterAPI, LogoutAPI, GetUserView,LoginAPI, CustomTokenRefreshView
version_api = config('VERSION_API')

urlpatterns = [
    path(f'{version_api}/auth/login/', LoginAPI.as_view(), name='login'),
    path(f'{version_api}/auth/register/', RegisterAPI.as_view(), name='register'),
    path(f'{version_api}/auth/getUser/', GetUserView.as_view(), name='getUser'),
    path(f'{version_api}/auth/getAccesstoken/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path(f'{version_api}/auth/logout/', LogoutAPI.as_view(), name='logout'),
]
