from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import status
from Account.models import Account, UserProfile



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
        print(data)
        return {
            "access": data["access"],
            "refresh": data["refresh"],
        }


class UserInforSerializer(serializers.ModelSerializer):
    role = serializers.CharField(read_only=True)
    user_id= serializers.IntegerField(read_only=True)
    class Meta:
        model = Account
        fields = ['user_id','email','username','phone_number','last_name','first_name','role']
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_picture','bio','address']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        userAccount = UserInforSerializer(instance.user).data
        representation = {**representation, **userAccount}
        for i,j in UserInforSerializer(instance.user).data.items():
            representation[i] = j
        return representation
    
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
        instance.save()
        return instance
        
class RegisterInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['email','username','phone_number','first_name','last_name']
        
    