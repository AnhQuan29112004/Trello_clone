from django.db import models
from Account.models import Account
from utils.workspace.models import UtilModel
# Create your models here.



class Workspace(UtilModel):
    name = models.CharField(max_length=50, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    board = models.ForeignKey('Board', on_delete=models.CASCADE, related_name='boardworkspaces', blank=True, null=True)

    def __str__(self):
        return self.name
    
class List(UtilModel):
    name = models.CharField(max_length=50, null=False, blank=False)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='workspacelists')
    card = models.ForeignKey('Card', on_delete=models.CASCADE, related_name='lists', blank=True, null=True)
    def __str__(self):
        return self.name

class Card(UtilModel):
    title = models.CharField(max_length=50, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    file = models.FileField(upload_to='uploads/', null=True, blank=True)
    label = models.CharField(max_length=50, null=True, blank=True)
    member = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='membercards', null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.title
    
class Board(UtilModel):
    name = models.CharField(max_length=50, null=False, blank=False)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='boards')
    background_color = models.CharField(max_length=7, default='#FFFFFF')  
    list = models.ForeignKey(List,on_delete=models.CASCADE, related_name='listboards', blank=True)
    def __str__(self):
        return self.name
    
    
class Comment(UtilModel):
    content = models.TextField(null=False, blank=False)
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='cardcomments')
    member = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='membercomments')
    def __str__(self):
        return self.content