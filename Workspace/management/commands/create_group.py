from django.core.management.base import BaseCommand
from Account.models import Account
from django.contrib.auth.models import Group

class Command(BaseCommand):
    help = "Create Group"
    
    def handle(self, *args, **options):
        for role_value, role_label in Account.RoleChoices.choices:
            group, create = Group.objects.get_or_create(name=role_label)
            if create:
                self.stdout.write(self.style.SUCCESS(f"Group '{role_label}' created."))
            else:
                self.stdout.write(self.style.WARNING(f"Group '{role_label}' already exists."))