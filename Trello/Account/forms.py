from django import forms
from .models import Account
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

class RegisterForm(forms.ModelForm):
    passWord = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        help_text='Required. 8 characters minimum.'
    )
    
    confirmPassWord = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        help_text='Required. 8 characters minimum.'
    )
    class Meta:
        model = Account
        fields = ['email', 'username', 'last_name', 'first_name', 'phone_number']
        widgets = {
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
        }
        
    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("passWord")
        password2 = cleaned_data.get("confirmPassWord")
        
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords do not match.")
        return cleaned_data
    
    
class LoginForm(AuthenticationForm):
    email = forms.EmailField(
        label='Email',
        widget=forms.EmailInput(attrs={'class': 'form-control'}),
        help_text='Required. Enter your email.'
    )
    password = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        help_text='Required. Enter your password.'
    )
    
    def clean(self):
        data = super().clean()
        email = data.get('username')
        password = data.get('password')
        if not Account.objects.filter(email=email).exists():
            raise forms.ValidationError("This email is not registered.")
        return data