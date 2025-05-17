from django.shortcuts import render
from Workspace.models import WorkspaceMember, Workspace, Board, List,Card,Comment
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView,CreateAPIView, ListCreateAPIView, RetrieveAPIView
from Workspace.serializers import DetailBoardSerializer, ListSerializer, BoardSerializer, WorkspaceMemberSerializer,BoardInWorkspaceSerializer
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
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        
class DetailBoardAPIView(RetrieveAPIView):
    serializer_class = DetailBoardSerializer
    def get_queryset(self):
        return Board.objects.filter(
            workspace__workspacemember__user_id = self.request.user.id,
            workspace__workspacemember__role__in = ["WORKSPACEOWN","MEMBER"],
            is_deleted = False
        ).prefetch_related('boardlists__listcard')
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    pass
    