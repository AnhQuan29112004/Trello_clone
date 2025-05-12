from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, SerializerMethodField
from Workspace.models import WorkspaceMember, Workspace, Board, List, Card, CardMember
from Account.serializers import UserProfileSerializer


class BoardSerializer(ModelSerializer):
    workspace = PrimaryKeyRelatedField(
        queryset=Workspace.objects.all(),  # Specify the queryset for the related field
        write_only=True,
    )
    class Meta:
        model = Board
        fields = ['id','workspace','name','background_color']
    def create(self, validated_data):
        request = self.context.get("request").data
        validated_data["workspace"] = Workspace.objects.get(id=request.get("workspace"))
        breakpoint()
        return super().create(validated_data)
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
class WorkspaceSerializer(ModelSerializer):
    class Meta:
        model = Workspace
        fields = ['id','name','description']
class CardSerializer(ModelSerializer):
    class Meta:
        model = Card
        fields= ['id','title','description','file','label','start_date','end_date','list']

class WorkspaceMemberSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(read_only=True)
    workspace = WorkspaceSerializer()
    class Meta:
        model = WorkspaceMember
        fields = ['user','workspace','role']
        
class BoardInWorkspaceSerializer(ModelSerializer):
    boards = SerializerMethodField()
    class Meta:
        model = Workspace
        fields = ['id',"name","description","boards"]
        
    def get_boards(self,obj):
        return BoardSerializer(obj.boards.all(), many=True).data

        
class ListSerializer(ModelSerializer):
    class Meta:
        model = List
        fields = ['id','name','board']
        

        