from django.shortcuts import render
from Workspace.models import WorkspaceMember, Workspace, Board, List,Card,Comment
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView,CreateAPIView, ListCreateAPIView, RetrieveAPIView, UpdateAPIView
from Workspace.serializers import WorkspaceSerializer,ListSerializer, BoardSerializer, WorkspaceMemberSerializer,BoardInWorkspaceSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from utils.Error.get_or_404 import Base_get_or_404
from utils.SearchBase.searchBase import SearchInWorkspaceFilter
from Account.serializers import UserProfileSerializer,UserInforSerializer
from Account.models import UserProfile
from utils.setattr import set_attrs
class WorkspaceListAPIView(ListAPIView):
    serializer_class = WorkspaceMemberSerializer
    def get_queryset(self):
        return WorkspaceMember.objects.filter(user__id = self.request.user.profile.id)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        serializer = self.get_serializer(queryset, many=True)
        merged_data = {
            "status": 200,
            "message": "Get workspace successfully",
            "code": "SUCCESS",
            "data":serializer.data
        }
        return Response(merged_data, status=status.HTTP_200_OK)
    
class WorkspaceAddAPIView(CreateAPIView):
    queryset = Workspace.objects.filter(is_deleted=False)
    serializer_class = WorkspaceMemberSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        response = {
            "message":"them thanh cong",
            "code":"SUCCESS",
            "status":201,
            "data":serializer.data
        }
        return Response(response, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self,serializer):
        serializer.save(
            created_by_id = serializer.validated_data.get('owner').id
        )


class WorkspaceGetByIDView(RetrieveAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    serializer_class = BoardInWorkspaceSerializer
    # filter_backends = [SearchInWorkspaceFilter]
    def get_queryset(self):
        return Workspace.objects.filter(
            workspacemember__user_id = self.request.user.profile.id
        ).prefetch_related('boards__boardlists__listcard')
        
    def get_object(self):
        """
        Returns the object the view is displaying.

        You may want to override this if you need to provide non-standard
        queryset lookups.  Eg if objects are referenced using multiple
        keyword arguments in the url conf.
        """
        queryset = self.filter_queryset(self.get_queryset())

        # Perform the lookup filtering.
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field

        assert lookup_url_kwarg in self.kwargs, (
            'Expected view %s to be called with a URL keyword argument '
            'named "%s". Fix your URL conf, or set the `.lookup_field` '
            'attribute on the view correctly.' %
            (self.__class__.__name__, lookup_url_kwarg)
        )

        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        obj = Base_get_or_404(queryset, **filter_kwargs)

        # May raise a permission denied
        self.check_object_permissions(self.request, obj)

        return obj
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        response = {
            "message":"Success",
            "code":"SUCCESS",
            "status":200,
            "data":serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)

class AddUserToWorkspaceAPIView(CreateAPIView):
    queryset = WorkspaceMember.objects.all()
    serializer_class = WorkspaceMemberSerializer
    permission_classes=[IsAuthenticated]
    authentication_classes=[JWTAuthentication]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()

class WorkspaceUpdateAPIView(UpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    serializer_class = WorkspaceSerializer
    queryset = Workspace.objects.all()
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        response = {
            "message":"Success",
            "code":"SUCCESS",
            "status":200,
            "data":serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user.profile)
    
        
class LeaveWorkspaceAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    
    def delete(self, request,pk):
        try:
            email = request.data.get('email')
            workspace = WorkspaceMember.objects.get(workspace_id=pk, user__user__email=email)
            if workspace.role == "WORKSPACEOWN":
                response = {
                    "message": "Cannot leave workspace as owner",
                    "code": "ERROR",
                    "status": 400,
                    "data": None
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            response = {
                "message":"Leave workspace successfully",
                "code":"SUCCESS",
                "status":200,
                "data":None
            }
            workspace.delete()
            
            return Response(response, status=status.HTTP_200_OK)
        except WorkspaceMember.DoesNotExist:
            return Response({"error": "Workspace not found", 'code':'ERROR','status':404}, status=status.HTTP_404_NOT_FOUND)
        
class GetWorkspaceIsOwnedByCrrUserAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    serializer_class = WorkspaceMemberSerializer
    def get_queryset(self):
        return WorkspaceMember.objects.filter(user__id = self.request.user.profile.id, role="WORKSPACEOWN")
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        response = {
            "message":"Success",
            "code":"SUCCESS",
            "status":200,
            "data":serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)

class GetAllUserInWorkspaceAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        workspace_id = kwargs.get('pk')
        if not workspace_id:
            return Response({"error": "Workspace ID is required", 'code':'ERROR','status':400}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            workspace_members = WorkspaceMember.objects.filter(workspace_id=workspace_id).select_related('user__user')
            allUsers = [set_attrs(wm.user.user,role=wm.role,user_id=wm.user_id) for wm in workspace_members]
            serializer = UserInforSerializer(allUsers, many=True)
            response = {
                "message":"Success",
                "code":"SUCCESS",
                "status":200,
                "data":serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
        except WorkspaceMember.DoesNotExist:
            return Response({"error": "Workspace not found", 'code':'ERROR','status':404}, status=status.HTTP_404_NOT_FOUND)
        
        
class SearchUserWhenAddMemberAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        key = request.query_params.get('keySearch', '').strip()
        if not key:
            return Response({"error": "Key search is required", 'code':'ERROR','status':400}, status=status.HTTP_400_BAD_REQUEST)
        users = UserProfile.objects.filter(user__email__icontains = key).select_related('user')
        if not users.exists():
            return Response({"message": "No users found", 'code':'ERROR','status':404}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserProfileSerializer(users, many=True)
        response = {
            "message":"Success",
            "code":"SUCCESS",
            "status":200,
            "data":serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)