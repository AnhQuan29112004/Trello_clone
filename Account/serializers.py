from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status



class CustormToken(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['role'] = user.role  
        token['email'] = user.email

        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        return {
            "access": data["access"],
            "refresh": data["refresh"],
        }
        
        
