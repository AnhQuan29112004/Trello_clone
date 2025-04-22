from django.shortcuts import render
from Workspace.models import Workspace, Board, List,Card,Comment
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView,CreateAPIView, ListCreateAPIView, RetrieveAPIView
from Workspace.serializers import WorkspaceSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
# Create your views here.
class WorkspaceListAPIView(ListAPIView):
    serializer_class = WorkspaceSerializer
    def get_queryset(self):
        return Workspace.objects.filter(owner__id = self.request.user.id, is_deleted=0)
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            dataPage = self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        merged_data = {
        **{
            "status": 200,
            "message": "Get workspace successfully",
            "code": "SUCCESS"
        },
        **dataPage  
}
        return Response(merged_data, status=status.HTTP_200_OK)
    
class WorkspaceAddAPIView(CreateAPIView):
    queryset = Workspace.objects.filter(is_deleted=False)
    serializer_class = WorkspaceSerializer
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
        
class BoardListAPIView():
    pass