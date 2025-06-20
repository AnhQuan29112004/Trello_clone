from rest_framework.serializers import DateTimeField, ModelSerializer, PrimaryKeyRelatedField, SerializerMethodField, IntegerField, EmailField
from Workspace.models import Comment, WorkspaceMember, Workspace, Board, List, Card, CardMember
from Account.serializers import UserProfileSerializer
from Account.models import Account, UserProfile
from utils.DictToObject.DictToObject import DictToObj
import json
from datetime import datetime

class BoardSerializer(ModelSerializer):
    workspace = PrimaryKeyRelatedField(
        queryset=Workspace.objects.all(),
        write_only=True, required=False
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
    start_date = DateTimeField(input_formats=["%d/%m/%Y"], required=False, allow_null=True)
    end_date = DateTimeField(input_formats=["%d/%m/%Y"],required=False, allow_null=True)
    comment = SerializerMethodField()
    listCard = PrimaryKeyRelatedField(queryset=List.objects.filter(is_deleted=False), write_only=True, required=False)
    class Meta:
        model = Card
        fields= ['id','index','name','description','file','label','start_date','end_date','listCard','tasks','comment']
    def get_comment(self, obj):
        comments = obj.comment.all()
        return [{
            'id': comment.id,
            'content': comment.content,
            'author': UserProfileSerializer(comment.author).data,
            'created_at': comment.created_at,
            'updated_at': comment.updated_at
        } for comment in comments]
    
    def create(self, validated_data):
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        request = self.context.get("request").data
        new_tasks = request.get("tasks", {})
        comment = request.get("comment", '')
        if comment:
            comment_data = {
                'content': comment,
                'author': self.context['request'].user.profile,  # Assuming the author is the current user
            }
            comment_instance = Comment.objects.filter(
                content=comment_data['content'],
                author=comment_data['author']
            ).first()
            if comment_instance is None:
                
                comment_instance = Comment.objects.create(**comment_data)
                instance.comment.add(comment_instance)
            else:
                comment_instance = Comment.objects.get(comment_cards__card_id=instance.id,content=comment_data['content'], author=comment_data['author'])
                comment_instance.content = comment_data['content']
                comment_instance.save()
        if isinstance(new_tasks, str):
            try:
                new_tasks = json.loads(new_tasks)
            except json.JSONDecodeError:
                new_tasks = {}
        crr_tasks =instance.tasks or {} 
        for i in new_tasks:
            if i not in instance.tasks:
                crr_tasks[i] = 0
            else:
                crr_tasks[i] = new_tasks[i]
        validated_data['tasks'] = crr_tasks
        validated_data['start_date'] = datetime.strptime(request.get('start_date'), "%d/%m/%Y") if request.get('start_date') else None
        validated_data['end_date'] = datetime.strptime(request.get('end_date'), "%d/%m/%Y") if request.get('end_date') else None
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['tasks'] = []
        for key, value in instance.tasks.items():
            representation['tasks'].append({
                'task': key,
                'status': value
            })
        representation['listCard'] = instance.listCard.id 
        representation['nameList'] = instance.listCard.name
        return representation
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
        representation['user'] = instance.user.user.username
        representation['owner'] = WorkspaceMember.objects.get(workspace=instance.workspace.id, role = "WORKSPACEOWN").user.user.username
        return representation
        
class BoardInWorkspaceSerializer(ModelSerializer):
    boards = SerializerMethodField()
    cards = SerializerMethodField()
    user = SerializerMethodField()
    class Meta:
        model = Board
        fields = ['id','name','background_color','boards','cards','user']
        
    def get_boards(self,obj):
        request = self.context.get('request')
        key = request.query_params.get("keySearch", "").strip()
        if key:
            board = obj.boards.filter(name__icontains=key, is_deleted=False)
        else:
            board = obj.boards.filter(is_deleted=False)
        return BoardSerializer(board, many=True).data
    
    def get_cards(self,obj):
        request = self.context.get('request')
        key = request.query_params.get("keySearch", "").strip()
        if key:
            matching_cards = []

            for board in obj.boards.all():
                for boardlist in board.boardlists.all():
                    cards = boardlist.listcard.filter(name__icontains=key,is_deleted=False)
                    matching_cards.extend(cards)
        else:
            return []
        return CardSerializer(matching_cards, many=True).data
    def get_user(self, obj):
        owner = WorkspaceMember.objects.filter(
            workspace=obj.id,
            role='WORKSPACEOWN'
        ).select_related('user').first()

        if owner:
            return owner.user.user.username
        return None
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['role'] = WorkspaceMember.objects.get(workspace=instance.id, user=self.context['request'].user.profile.id).role
        return representation
        
class ListSerializer(ModelSerializer):
    listcard = SerializerMethodField()
    board = PrimaryKeyRelatedField(queryset=Board.objects.all(), required=False, allow_null=True)

    class Meta:
        model = List
        fields = ['id','name','board','listcard']
    def create(self, validated_data):
        return super().create(validated_data)
    
    def get_listcard(self, obj):
       
        request = self.context.get('request')
        key = request.query_params.get("keySearch", "").strip()
        if key:
            listcard = obj.listcard.filter(name__icontains=key, is_deleted=False).order_by('index')
        else:
            listcard = obj.listcard.filter(is_deleted=False).order_by('index')
       
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
        
        representation['boardlists'] = ListSerializer(
        instance.boardlists.filter(is_deleted=False),
        many=True,
        context=self.context  
    ).data
        return representation
        
    def create(self, validated_data):
        return super().create(validated_data)

        
class AllBoardSerializer(ModelSerializer):
    class Meta:
        model = Board
        fields = ['id','name','background_color']
    
    def to_representation(self, instance):  
        representation = super().to_representation(instance)
        
        return representation
    
class GetAllListFromBoardSerializer(ModelSerializer):
    class Meta:
        model = List
        fields = ['id','name']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation