from django.shortcuts import render
from Workspace.models import WorkspaceMember, Workspace, Board, List,Card,Comment
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView,CreateAPIView, UpdateAPIView, ListCreateAPIView, RetrieveAPIView
from Workspace.serializers import AllBoardSerializer, DetailBoardSerializer, ListSerializer, BoardSerializer, WorkspaceMemberSerializer,BoardInWorkspaceSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from utils.Error.get_or_404 import Base_get_or_404


class AddBoardAPIView(CreateAPIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[JWTAuthentication]
    serializer_class=BoardSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request":request})
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
        
class DetailBoardAPIView(RetrieveAPIView):
    serializer_class = DetailBoardSerializer
    def get_queryset(self):
        return Board.objects.filter(
            workspace__workspacemember__user_id = self.request.user.profile.id,
            workspace__workspacemember__role__in = ["WORKSPACEOWN","MEMBER"],
            is_deleted = False
        ).prefetch_related('boardlists__listcard')
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get_serializer_context(self):
        return {'request': self.request}
    
    
class UpdateBoardAPIView(UpdateAPIView):
    serializer_class = BoardSerializer
    def get_queryset(self):
        return Board.objects.filter(
            workspace__workspacemember__user_id = self.request.user.profile.id,
            workspace__workspacemember__role__in = ["WORKSPACEOWN","MEMBER"],
            is_deleted = False
        )
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]


class GetAllBoardAPIView(ListAPIView):
    serializer_class = AllBoardSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        workSpaceId = self.request.query_params.get("workspaceId")
        return Board.objects.filter(
            workspace__workspacemember__user_id = self.request.user.profile.id,
            workspace_id = workSpaceId,
            workspace__workspacemember__role__in = ["WORKSPACEOWN","MEMBER"],
            is_deleted = False
        )
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        response = {
            "message":"thanh cong",
            "code":"SUCCESS",
            "status":200,
            "data":serializer.data
        }   
        
        return Response(response, status=status.HTTP_200_OK)