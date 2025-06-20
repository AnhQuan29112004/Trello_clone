from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.core.management import call_command 
from .models import Account, UserProfile
from Workspace.models import WorkspaceMember, Workspace
@receiver(post_save,sender=UserProfile)
def addRoleToWorkspace(sender, instance, created, **kwargs):
    if created:
        nameWP = "wp" + instance.user.username
        newWP = Workspace.objects.create(name = nameWP, created_by_id = instance.user.id)
        WorkspaceMember.objects.create(workspace_id = newWP.id, user_id = instance.id, role = "WORKSPACEOWN")