from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from django.urls import reverse
from .forms import RegisterForm
from .models import Account, UserProfile
from .serializers import RegisterInfoSerializer, CustormToken, UserProfileSerializer, UserInforSerializer
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from .authentication import CookieJWTAuthentication
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate


# Create your views here.



class RegisterAPI(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print(request.POST)
        form = RegisterForm(data=request.data)
        if form.is_valid():
            user = Account.objects.create_user(
                email=form.cleaned_data['email'],
                password=form.cleaned_data['passWord'],
                username=form.cleaned_data['username'],
                last_name=form.cleaned_data['last_name'],
                first_name=form.cleaned_data['first_name'],
                phone_number=form.cleaned_data['phone_number'],
            )
            user.save()
            return Response({"message": "User registered successfully", 'code':"SUCCESS", 'status':201, 'data':RegisterInfoSerializer(user).data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": form.errors}, status=status.HTTP_400_BAD_REQUEST)


def loginview(request):
    return render(request, 'login.html', )

class GetCrrUser(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            user = request.user
            inforUser = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(inforUser)
            return Response({
                "message": "Get user successfully",
                "code":"SUCCESS",
                "status":200,
                "data":serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e),'code':"ERROR","status":400}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPI(TokenObtainPairView):
    serializer_class = CustormToken

    def post(self, request, *args, **kwargs):
        try:
            user = Account.objects.get(email=request.data.get('email'))
            userSerializer = UserInforSerializer(user)
            serializer = self.get_serializer(data=request.data)
            if (serializer.is_valid()):
                data = serializer.validated_data
                response = Response({
                        "message": "Login successfully",
                        "data": {
                            "access": data.get("access"),
                            "refresh": data.get("refresh"),
                            'user': userSerializer.data
                        },
                        'status': 200,
                        'code':"SUCCESS"
                    }, status=status.HTTP_200_OK)
                return response
            else:
                
                return Response({
                    "message": "Login failed",
                    "error": serializer.errors,
                    'status': 400,
                    "code":"ERROR",
                
            },status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "message": "Login failed",
                "error": str(e),
                'status': 400,
                "code":"ERROR",
                
            },status=status.HTTP_400_BAD_REQUEST)
            
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            data = {
                "status": "success",
                "message": "Token refreshed successfully",
                "accessToken": response.data.get("access"),
                "code": "SUCCESS",
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            data = {
                "status": "error",
                "message": f"Failed to refresh token: {str(e)}",
                "details": "Invalid or expired refresh token",
                "code": "ERROR",
            }
            return Response(data, status=status.HTTP_400_BAD_REQUEST)