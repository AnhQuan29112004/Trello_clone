from rest_framework.serializers import ModelSerializer
from Workspace.models import Workspace, Board, List, Card, CardMember

class CardSerializer(ModelSerializer):
    class Meta:
        model = Card
        fields= ['title','description','file','label','start_date','end_date','list']

class WorkspaceSerializer(ModelSerializer):
    class Meta:
        model = Workspace
        fields = ['name','description','owner']
        
class BoardSerializer(ModelSerializer):
    workspace = WorkspaceSerializer()
    class Meta:
        model = Board
        fields = ['workspace','name','background_color']


        
class ListSerializer(ModelSerializer):
    class Meta:
        model = List
        fields = ['name','board']
        

        