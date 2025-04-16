from django.db import models
from Account.models import Account
from django.conf import settings
class UtilModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='%(class)s_created_by', null=True, blank=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='%(class)s_updated_by', null=True, blank=True)
    class Meta:
        abstract = True