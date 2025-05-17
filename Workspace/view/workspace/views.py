from django.shortcuts import render
from Workspace.models import WorkspaceMember, Workspace, Board, List,Card,Comment
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView,CreateAPIView, ListCreateAPIView, RetrieveAPIView
from Workspace.serializers import ListSerializer, BoardSerializer, WorkspaceMemberSerializer,BoardInWorkspaceSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from utils.Error.get_or_404 import Base_get_or_404

class WorkspaceListAPIView(ListAPIView):
    serializer_class = WorkspaceMemberSerializer
    def get_queryset(self):
        return WorkspaceMember.objects.filter(user__id = self.request.user.id)
    
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
    def get_queryset(self):
        return Workspace.objects.filter(
            workspacemember__user_id = self.request.user.id,
            workspacemember__role = "WORKSPACEOWN"
        ).prefetch_related('boards')
        
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