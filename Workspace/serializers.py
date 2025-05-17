from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, SerializerMethodField, IntegerField, EmailField
from Workspace.models import WorkspaceMember, Workspace, Board, List, Card, CardMember
from Account.serializers import UserProfileSerializer
from Account.models import Account, UserProfile


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
    workspaceID = IntegerField(write_only=True)
    member = EmailField(write_only=True)
    
    user = PrimaryKeyRelatedField(read_only=True, required=False)
    workspace = WorkspaceSerializer(required=False)
    class Meta:
        model = WorkspaceMember
        fields = ['user','workspace','role','workspaceID','member']
        
    def create(self, validated_data):
        account = Account.objects.get(email=validated_data['member'])
        newUser = UserProfile.objects.get(user=account)
        workspace = Workspace.objects.get(id=validated_data['workspaceID'])
        instance= WorkspaceMember.objects.create(
            user=newUser,
            workspace=workspace,
            role="MEMBER"
        ) 
        return instance
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation
        
class BoardInWorkspaceSerializer(ModelSerializer):
    boards = SerializerMethodField()
    class Meta:
        model = Workspace
        fields = ['id',"name","description","boards"]
        
    def get_boards(self,obj):
        return BoardSerializer(obj.boards.all(), many=True).data
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        breakpoint()
        representation['role'] = WorkspaceMember.objects.get(workspace=instance.id, user=self.context['request'].user.id).role
        return representation
        
class ListSerializer(ModelSerializer):
    listcard = CardSerializer(many=True)
    class Meta:
        model = List
        fields = ['id','name','board','listcard']
    def create(self, validated_data):
        return super().create(validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['listcard'] = CardSerializer(instance.listcard.all(), many=True).data
        return representation
class DetailBoardSerializer(ModelSerializer):
    boardlists = ListSerializer(many=True)
    
    class Meta:
        model = Board
        fields = ['id','name','background_color','boardlists']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['boardlists'] = ListSerializer(instance.boardlists.all(), many=True).data
        return representation
        
    def create(self, validated_data):
        return super().create(validated_data)

        