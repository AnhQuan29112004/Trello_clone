from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from Workspace.models import WorkspaceMember, Workspace, Board, List, Card, CardMember
from Account.serializers import UserProfileSerializer

class WorkspaceSerializer(ModelSerializer):
    class Meta:
        model = Workspace
        fields = ['name','description']
class CardSerializer(ModelSerializer):
    class Meta:
        model = Card
        fields= ['title','description','file','label','start_date','end_date','list']

class WorkspaceMemberSerializer(ModelSerializer):
    user = UserProfileSerializer()
    workspace = WorkspaceSerializer()
    class Meta:
        model = WorkspaceMember
        fields = ['user','workspace','role']
        
class BoardSerializer(ModelSerializer):
    workspace = PrimaryKeyRelatedField(
        queryset=Workspace.objects.all(),  # Specify the queryset for the related field
        write_only=True,
    )
    class Meta:
        model = Board
        fields = ['workspace','name','background_color']


        
class ListSerializer(ModelSerializer):
    class Meta:
        model = List
        fields = ['name','board']
        

        