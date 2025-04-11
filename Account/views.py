from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from django.urls import reverse
from .forms import RegisterForm
from .models import Account
from .serializers import CustormToken
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from .authentication import CookieJWTAuthentication
from django.contrib.auth.decorators import login_required


# Create your views here.
# def home(request):
    
#     return render(request, 'home.html',{
#         "user": request.user,
#     })
# def register(request):  
#     form = RegisterForm()
#     return render(request, 'register.html', {
#         'form': form,   })
    
class LogoutAPI(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def post(self, request):
        try:
            response = Response({
                "message": "Logout successfully", 
                "next": reverse("loginview")
            }, status=status.HTTP_200_OK)
            
            response.delete_cookie('refresh')
            response.delete_cookie('access')
            return response
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
                birth=form.cleaned_data['birth']
            )
            user.save()
            return Response({"message": "User registered successfully", 'next':reverse("loginview"), 'code':"SUCCESS"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": form.errors}, status=status.HTTP_400_BAD_REQUEST)


def loginview(request):
    return render(request, 'login.html', )

class GetUserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def get(self, request):
        try:
            user = request.user
            print(user.is_authenticated)
            data = {
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': user.phone_number,
                'birth': user.birth,
                'check': user.is_authenticated,
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPI(TokenObtainPairView):
    serializer_class = CustormToken

    def post(self, request, *args, **kwargs):
        print("DATA :",request.data)
        user = Account.objects.get(email=request.data.get('email'))
        serializer = self.get_serializer(data=request.data)
        next = request.data.get('next', reverse("home"))
        breakpoint()
        if (serializer.is_valid()):
            data = serializer.validated_data
            response = Response({
                    "message": "Login successfully",
                    "data": {
                        "access": data.get("access"),
                        "refresh": data.get("refresh"),
                    },
                    'Status': 200,
                    'next': next,
                    'role': user.role,
                    'code':"SUCCESS"
                }, status=status.HTTP_200_OK)
            return response
        else:
            return Response({
                "message": "Login failed",
                "error": serializer.errors,
                'Status': 400,
                "code":"ERROR",
                
            },status=status.HTTP_400_BAD_REQUEST)
            
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            data = {
                "status": "success",
                "message": "Token refreshed successfully",
                "access_token": response.data.get("access"),
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