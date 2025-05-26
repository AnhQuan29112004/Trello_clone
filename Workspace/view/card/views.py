from django.shortcuts import render
from Workspace.models import WorkspaceMember, Workspace, Board, List,Card,Comment
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView,CreateAPIView,UpdateAPIView, ListCreateAPIView, RetrieveAPIView
from Workspace.serializers import CardSerializer, ListSerializer, BoardSerializer, WorkspaceMemberSerializer,BoardInWorkspaceSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from utils.Error.get_or_404 import Base_get_or_404

class AddCardAPIView(CreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
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
        serializer.save()
        
class UpdateCardAPIView(UpdateAPIView):
    serializer_class = CardSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Card.objects.filter(
            listCard__board__workspace__workspacemember__user_id = self.request.user.profile.id,
            listCard__board__workspace__workspacemember__role__in = ["WORKSPACEOWN","MEMBER"],
            is_deleted = False
        )
    def get_serializer_context(self):
        return {'request': self.request}
    
    
class DeleteCardAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    
    def delete(self, request, *args, **kwargs):
        card_id = kwargs.get('pk')
        card = Base_get_or_404(Card.objects, id=card_id)
        if card.is_deleted:
            return Response({"message": "Card already deleted",'code':"ERROR",'status':400}, status=status.HTTP_400_BAD_REQUEST)
        
        card.is_deleted = True
        card.save()
        return Response({"message": "Card deleted successfully",'code':"SUCCESS","status":204}, status=status.HTTP_204_NO_CONTENT)
class GetCardByIDAPIView(RetrieveAPIView):
    serializer_class = CardSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        return Card.objects.filter(
            listCard__board__workspace__workspacemember__user_id = self.request.user.profile.id,
            listCard__board__workspace__workspacemember__role__in = ["WORKSPACEOWN","MEMBER"],
            is_deleted = False
        )
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        response = {
            "message": "Success",
            "code": "SUCCESS",
            "status": 200,
            "data": serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)