

from django.urls import path,include
from decouple import config

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from Account.views import RegisterAPI, GetUserView,LoginAPI, CustomTokenRefreshView
from Workspace.views import WorkspaceListAPIView, WorkspaceAddAPIView
version_api = config('VERSION_API')

urlpatterns = [
    path(f'{version_api}/auth/login/', LoginAPI.as_view(), name='login'),
    path(f'{version_api}/auth/register/', RegisterAPI.as_view(), name='register'),
    path(f'{version_api}/auth/getUser/', GetUserView.as_view(), name='getUser'),
    path(f'{version_api}/auth/getAccesstoken/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path(f'{version_api}/workspace/get/', WorkspaceListAPIView.as_view(), name='get_workspace'),
    path(f'{version_api}/workspace/add/', WorkspaceAddAPIView.as_view(), name='add_workspace'),
]
