from django.db import models
from Account.models import Account
from utils.workspace.models import UtilModel
# Create your models here.



class Workspace(UtilModel):
    name = models.CharField(max_length=50, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    member = models.ManyToManyField(Account, through="WorkspaceMember", related_name='memberworkspaces')
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
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='workspacelists')
    class Meta:
        unique_together = [['name','board']] 
    def __str__(self):
        return self.name

class Card(UtilModel):
    title = models.CharField(max_length=50, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    file = models.FileField(upload_to='uploads/', null=True, blank=True)
    label = models.CharField(max_length=50, null=True, blank=True)
    member = models.ManyToManyField(Account, through="CardMember", related_name='membercards')
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name="cardlist")
    class Meta:
        unique_together = [['title','list']] 
    def __str__(self):
        return self.title
    
class WorkspaceMember(models.Model):
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE)
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=Account.RoleChoices.choices)

class CardMember(models.Model):
    card = models.ForeignKey(Card,on_delete=models.CASCADE)
    user = models.ForeignKey(Account,on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=Account.RoleChoices.choices)
    
class Comment(UtilModel):
    content = models.TextField(null=False, blank=False)
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='cardcomments')
    member = models.OneToOneField(Account, on_delete=models.CASCADE, related_name='membercomments')
    def __str__(self):
        return self.content