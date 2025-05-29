from django.shortcuts import render
from Workspace.models import WorkspaceMember, Workspace, Board, List,Card,Comment
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView,CreateAPIView,UpdateAPIView, ListCreateAPIView, RetrieveAPIView
from Workspace.serializers import GetAllListFromBoardSerializer, ListSerializer, BoardSerializer, WorkspaceMemberSerializer,BoardInWorkspaceSerializer
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
        serializer.save(created_by=self.request.user.profile)
        
class UpdateListAPIView(UpdateAPIView):
    serializer_class = ListSerializer
    def get_queryset(self):
        return List.objects.filter(
            board__workspace__workspacemember__user_id = self.request.user.profile.id,
            board__workspace__workspacemember__role__in = ["WORKSPACEOWN","MEMBER"],
            is_deleted = False
        )
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    


class GetAllListFromBoardAPIView(ListAPIView):
    serializer_class = GetAllListFromBoardSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        boardId = self.request.query_params.get("boardId")
        if boardId:
            return List.objects.filter(
                board__id = boardId,
                board__workspace__workspacemember__user_id = self.request.user.profile.id,
                board__workspace__workspacemember__role__in = ["WORKSPACEOWN","MEMBER"],
                is_deleted = False
            )
        else:
            return List.objects.filter(
                board__workspace__workspacemember__user_id = self.request.user.profile.id,
                board__workspace__workspacemember__role__in = ["WORKSPACEOWN","MEMBER"],
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
    
    
class DeleteListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    
    def delete(self, request, *args, **kwargs,):
        list_id = kwargs.get('pk')
        list_instance = Base_get_or_404(List.objects, id=list_id)
        
        if not list_instance.is_deleted:
            list_instance.is_deleted = True
            list_instance.save()
            response = {
                "message": "Xoa thanh cong",
                "code": "SUCCESS",
                "status": 200,
                "data": {}
            }
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {
                "message": "List da bi xoa",
                "code": "ERROR",
                "status": 400,
                "data": {}
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)