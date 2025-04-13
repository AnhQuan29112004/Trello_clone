from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import Group, Permission
# Create your models here.

class ManagerUser(BaseUserManager):
    def create_user(self, email, username, first_name, last_name, phone_number, role, password):
        if not email:
            raise ValueError("Can nhap email")
        if not username:
            raise ValueError("can nhap username")
        
        user = self.model(
            email = self.normalize_email(email),
            username = username,
            first_name = first_name,
            last_name = last_name,
            phone_number = phone_number,
            role = role
        )
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self, email, username, first_name, last_name, phone_number,role, password):
        if not email:
            raise ValueError("Can nhap email")
        if not username:
            raise ValueError("can nhap username")
        
        user = self.create_user(email, username, first_name, last_name, phone_number,role, password)
        user.is_super = True
        user.role = Account.RoleChoices.ADMIN
        user.set_password(password)
        user.save()
        return user
class Account(AbstractBaseUser):
    class RoleChoices(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        MEMBERWORKSPACE = 'MEMBERWORKSPACE', 'MemberWorkspace'
        WORKSPACEOWN = 'WORKSPACEOWN', 'WorkspaceOwn'
    username = models.CharField(max_length=50,null=False,blank=False)
    first_name = models.CharField(max_length=50,null=False,blank=False)
    last_name = models.CharField(max_length=50,null=False,blank=False)
    email = models.EmailField(unique=True,max_length=50, null=False, blank=False)
    phone_number = models.CharField(max_length=50,null=False,blank=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    role = models.CharField(max_length=50, choices=RoleChoices.choices, default=RoleChoices.WORKSPACEOWN , null=False,blank=False)
    
    
    objects = ManagerUser()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name','last_name','phone_number','role']
    
    is_super = models.BooleanField(default=False)
    
    is_active = models.BooleanField(default=True)

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'
    
    def get_username(self):
        return f'{self.username}'
    
class UserProfile(models.Model):
    user = models.OneToOneField(Account, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    def __str__(self):
        return f"{self.user.username}'s Profile"