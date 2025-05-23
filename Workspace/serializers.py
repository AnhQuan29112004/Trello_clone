from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, SerializerMethodField, IntegerField, EmailField
from Workspace.models import WorkspaceMember, Workspace, Board, List, Card, CardMember
from Account.serializers import UserProfileSerializer
from Account.models import Account, UserProfile


class BoardSerializer(ModelSerializer):
    workspace = PrimaryKeyRelatedField(
        queryset=Workspace.objects.all(),  
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
        fields= ['id','name','description','file','label','start_date','end_date','list']

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
        breakpoint()
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
    cards = SerializerMethodField()
    class Meta:
        model = Board
        fields = ['id','name','background_color','boards','cards']
        
    def get_boards(self,obj):
        request = self.context.get('request')
        key = request.query_params.get("keySearch", "").strip()
        if key:
            board = obj.boards.filter(name__icontains=key)
        else:
            board = obj.boards.all()
        return BoardSerializer(board, many=True).data
    
    def get_cards(self,obj):
        request = self.context.get('request')
        key = request.query_params.get("keySearch", "").strip()
        if key:
            matching_cards = []

            for board in obj.boards.all():
                for boardlist in board.boardlists.all():
                    cards = boardlist.listcard.filter(name__icontains=key)
                    matching_cards.extend(cards)
        else:
            return []
        return CardSerializer(matching_cards, many=True).data
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['role'] = WorkspaceMember.objects.get(workspace=instance.id, user=self.context['request'].user.profile.id).role
       
        return representation
        
class ListSerializer(ModelSerializer):
    listcard = SerializerMethodField()
    class Meta:
        model = List
        fields = ['id','name','board','listcard']
    def create(self, validated_data):
        return super().create(validated_data)
    
    def get_listcard(self, obj):
        request = self.context.get('request')
        key = request.query_params.get("keySearch", "").strip()
        if key:
            listcard = obj.listcard.filter(name__icontains=key)
        else:
            listcard = obj.listcard.all()
        return CardSerializer(listcard, many=True).data
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation
class DetailBoardSerializer(ModelSerializer):
    boardlists = ListSerializer(many=True)
    
    class Meta:
        model = Board
        fields = ['id','name','background_color','boardlists']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['boardlists'] = ListSerializer(instance.boardlists.all(), many=True,context=self.context).data
        return representation
        
    def create(self, validated_data):
        return super().create(validated_data)

        