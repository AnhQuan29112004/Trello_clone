from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.core.management import call_command 
from .models import Account
@post_save(post_save,sender=Account)
def automatically_add_user_to_group(sender, instance, created, **kwargs):
    if created:
        call_command('add_user_group')