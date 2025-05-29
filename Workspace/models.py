from django.db import models
from Account.models import Account, UserProfile
from utils.workspace.models import UtilModel
# Create your models here.



class Workspace(UtilModel):
    name = models.CharField(max_length=50, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    member = models.ManyToManyField(UserProfile, through="WorkspaceMember", related_name='memberworkspaces')
    def __str__(self):
        return self.name
    
class Board(UtilModel):
    name = models.CharField(max_length=50, null=False, blank=False)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='boards')
    background_color = models.CharField(max_length=7, default='#FFFFFF')  
    class Meta:
        unique_together = [['name','workspace']] 
    def __str__(self):
        return self.name
    
class List(UtilModel):
    name = models.CharField(max_length=50, null=False, blank=False)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='boardlists')
    
    def __str__(self):
        return self.name

class Comment(UtilModel):
    content = models.TextField(null=False, blank=False)
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='membercomments')
    def __str__(self):
        return self.content
    
class Card(UtilModel):
    name = models.CharField(max_length=50, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    file = models.FileField(upload_to='uploads/', null=True, blank=True)
    label = models.CharField(max_length=50, null=True, blank=True)
    member = models.ManyToManyField(UserProfile, through="CardMember", related_name='membercards')
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    listCard = models.ForeignKey(List, on_delete=models.CASCADE, related_name="listcard",null=True, blank=True)
    tasks = models.JSONField(null=True, blank=True,default=dict)
    index = models.IntegerField(default=0, null=True, blank=True)
    comment = models.ManyToManyField(Comment, through='CardComment', related_name='cardcomments', blank=True,null=True)
    class Meta:
        unique_together = [['name','listCard']] 
    def __str__(self):
        return self.name
    
class WorkspaceMember(models.Model):
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=Account.RoleChoices.choices, default=Account.RoleChoices.WORKSPACEOWN)
    class Meta:
        unique_together = [['workspace','user']]
    
class CardMember(models.Model):
    card = models.ForeignKey(Card,on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile,on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=Account.RoleChoices.choices)
    
class CardComment(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='card_comments')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='comment_cards')
    
    class Meta:
        unique_together = [['card', 'comment']]
    
    def __str__(self):
        return f"{self.card.name} - {self.comment.content}"