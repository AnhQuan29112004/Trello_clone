

from django.urls import path,include
from decouple import config

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from Account.views import RegisterAPI, GetCrrUser,LoginAPI, CustomTokenRefreshView
from Workspace.view.card.views import GetCardByIDAPIView, DeleteCardAPIView, AddCardAPIView,UpdateCardAPIView
from Workspace.view.list.views import UpdateListAPIView, DeleteListAPIView, AddListAPIView,GetAllListFromBoardAPIView
from Workspace.view.board.views import DeleteBoardAPIView, GetAllBoardAPIView, AddBoardAPIView, DetailBoardAPIView,UpdateBoardAPIView
from Workspace.view.workspace.views import SearchUserWhenAddMemberAPIView, GetAllUserInWorkspaceAPIView, GetWorkspaceIsOwnedByCrrUserAPIView, LeaveWorkspaceAPIView, WorkspaceGetByIDView, WorkspaceUpdateAPIView, WorkspaceListAPIView, WorkspaceAddAPIView, AddUserToWorkspaceAPIView
version_api = config('VERSION_API')

urlpatterns = [
    path(f'{version_api}/auth/login', LoginAPI.as_view(), name='login'),
    path(f'{version_api}/auth/register', RegisterAPI.as_view(), name='register'),
    path(f'{version_api}/auth/getUser', GetCrrUser.as_view(), name='getUser'),
    path(f'{version_api}/auth/getAccesstoken', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path(f'{version_api}/workspace/getAll', WorkspaceListAPIView.as_view(), name='get_workspace'),
    path(f'{version_api}/workspace/add', WorkspaceAddAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/workspace/get/<int:pk>', WorkspaceGetByIDView.as_view(), name='add_workspace'),
    path(f'{version_api}/board/add', AddBoardAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/list/add', AddListAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/card/add', AddCardAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/board/get/<int:pk>', DetailBoardAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/workspace/addMember', AddUserToWorkspaceAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/workspace/update/<int:pk>', WorkspaceUpdateAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/board/update/<int:pk>', UpdateBoardAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/card/update/<int:pk>', UpdateCardAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/board/get', GetAllBoardAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/list/get', GetAllListFromBoardAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/workspace/leave/<int:pk>', LeaveWorkspaceAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/list/delete/<int:pk>', DeleteListAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/card/delete/<int:pk>', DeleteCardAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/board/delete/<int:pk>', DeleteBoardAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/workspace/workspace-owned-by-current-user/get', GetWorkspaceIsOwnedByCrrUserAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/workspace/get-all-user-in-workspace/<int:pk>', GetAllUserInWorkspaceAPIView.as_view(), name='get_all_user_in_workspace'),    
    path(f'{version_api}/card/get/<int:pk>', GetCardByIDAPIView.as_view(), name='add_workspace'),
    path(f'{version_api}/workspace/search-user', SearchUserWhenAddMemberAPIView.as_view(), name='search_user_in_workspace'),    
    path(f'{version_api}/list/update/<int:pk>', UpdateListAPIView.as_view(), name='add_workspace'),

]
