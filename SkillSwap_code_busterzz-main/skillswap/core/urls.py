from django.urls import path, re_path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    # API endpoints
    path('api/register/', views.UserRegistrationView.as_view(), name='api_register'),
    path('api/login/', views.login_view, name='api_login'),
    path('api/logout/', views.logout_view, name='api_logout'),
    path('api/profile/', views.UserProfileView.as_view(), name='api_profile'),
    
    # Catch-all route to serve React app
    re_path(r'^.*$', views.ReactAppView.as_view(), name='react_app'),
]
