from django.urls import path
from . import views

urlpatterns = [
    # Health check
    path('health/', views.health_check, name='health-check'),
    path('signup/health/', views.signup_health_check, name='signup-health-check'),
    path('session-test/', views.session_test, name='session-test'),
    path('create-session/', views.create_session, name='create-session'),
    path('cookie-test/', views.cookie_test, name='cookie-test'),
    path('auth-test/', views.auth_test, name='auth-test'),
    path('session-check/', views.session_check, name='session-check'),
    
    # Authentication
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    
    # User management
    path('users/profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('users/search/', views.search_users, name='search-users'),
    path('users/<int:user_id>/skills/', views.get_user_skills, name='user-skills'),
    
    # Skills
    path('skills/', views.SkillListView.as_view(), name='skill-list'),
    path('skills/<int:pk>/', views.SkillDetailView.as_view(), name='skill-detail'),
    
    # User Skills
    path('user-skills/', views.UserSkillListView.as_view(), name='user-skill-list'),
    path('user-skills/<int:pk>/', views.UserSkillDetailView.as_view(), name='user-skill-detail'),
    path('user-skills/bulk/', views.bulk_user_skills, name='bulk-user-skills'),
    
    # Swap Requests
    path('swap-requests/', views.SwapRequestListView.as_view(), name='swap-request-list'),
    path('swap-requests/<int:pk>/', views.SwapRequestDetailView.as_view(), name='swap-request-detail'),
    path('swap-requests/sent/', views.SentSwapRequestsView.as_view(), name='sent-swap-requests'),
    path('swap-requests/received/', views.ReceivedSwapRequestsView.as_view(), name='received-swap-requests'),
]
