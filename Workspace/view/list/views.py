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


class AddListAPIView(CreateAPIView):
    queryset = List.objects.filter(is_deleted=False)
    serializer_class = ListSerializer
    permission_classes=[IsAuthenticated]
    authentication_classes=[JWTAuthentication]
    
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
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)