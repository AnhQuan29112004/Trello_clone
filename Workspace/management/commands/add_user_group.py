from django.core.management.base import BaseCommand
from Account.models import Account
from django.contrib.auth.models import Group

class Command(BaseCommand):
    help = "Add user to group"
    
    def handle(self, *args, **options):
        all_users = Account.objects.all()
        all_roles = Account.RoleChoices.choices
        for i in all_users:
            if i.groups.exists():
                continue
            if (i.role.lower() in [label.lower() for _,label in all_roles]):
                group = Group.objects.get(name=i.role.upper())
                i.groups.add(group)
                i.save()
                self.stdout.write(self.style.SUCCESS(f"User '{i.email}' added to group '{i.role}'."))