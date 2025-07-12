from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import User, Skill, UserSkill, SwapRequest
from .serializers import (
    UserSerializer, UserProfileSerializer, UserProfileUpdateSerializer, UserRegistrationSerializer, UserLoginSerializer,
    SkillSerializer, UserSkillSerializer, UserSkillBulkSerializer, SwapRequestSerializer, SwapRequestUpdateSerializer
)
import logging
from django.db import models

logger = logging.getLogger(__name__)

# Health Check View
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    print(f"[Django] Health check endpoint called - Method: {request.method}")
    logger.info(f"[Django] Health check endpoint called - Method: {request.method}")
    
    response_data = {
        'status': 'healthy',
        'message': 'Django API is running',
        'timestamp': '2024-01-01T00:00:00Z'
    }
    
    return Response(response_data)

# Session Test View
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def session_test(request):
    print(f"[Django] Session test endpoint called")
    print(f"[Django] User: {request.user}")
    print(f"[Django] User authenticated: {request.user.is_authenticated}")
    print(f"[Django] Session ID: {request.session.session_key}")
    print(f"[Django] Session data: {dict(request.session)}")
    print(f"[Django] Cookies: {request.COOKIES}")
    
    # Try to create a session if none exists
    if not request.session.session_key:
        print(f"[Django] No session exists, creating one...")
        request.session.create()
        request.session.save()
        print(f"[Django] New session created: {request.session.session_key}")
    
    response_data = {
        'user': str(request.user),
        'authenticated': request.user.is_authenticated,
        'session_key': request.session.session_key,
        'session_data': dict(request.session),
        'cookies': dict(request.COOKIES),
        'session_created': bool(request.session.session_key),
    }
    
    return Response(response_data)

# Session Creation Test View
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_session(request):
    print(f"[Django] Create session endpoint called")
    print(f"[Django] Session ID before: {request.session.session_key}")
    
    # Create a new session
    request.session.create()
    request.session.save()
    
    print(f"[Django] Session ID after: {request.session.session_key}")
    print(f"[Django] Session data: {dict(request.session)}")
    
    response_data = {
        'session_created': True,
        'session_key': request.session.session_key,
        'session_data': dict(request.session),
    }
    
    return Response(response_data)

# Cookie Test View
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def cookie_test(request):
    print(f"[Django] Cookie test endpoint called")
    print(f"[Django] All cookies: {request.COOKIES}")
    print(f"[Django] Session cookie: {request.COOKIES.get('sessionid', 'NOT_FOUND')}")
    print(f"[Django] Session key: {request.session.session_key}")
    
    # Set a test cookie
    response = Response({
        'cookies_received': dict(request.COOKIES),
        'session_cookie': request.COOKIES.get('sessionid', 'NOT_FOUND'),
        'session_key': request.session.session_key,
        'user_authenticated': request.user.is_authenticated,
    })
    
    # Set a test cookie to verify cookie setting works
    response.set_cookie(
        'test_cookie',
        'test_value',
        max_age=3600,
        domain=None,
        secure=False,
        httponly=False,
        samesite='Lax',
        path='/'
    )
    
    return response

# Authentication Test View
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def auth_test(request):
    print(f"[Django] Auth test endpoint called")
    print(f"[Django] User: {request.user}")
    print(f"[Django] User authenticated: {request.user.is_authenticated}")
    print(f"[Django] Session ID: {request.session.session_key}")
    print(f"[Django] Session data: {dict(request.session)}")
    print(f"[Django] Cookies: {request.COOKIES}")
    
    response_data = {
        'user': str(request.user),
        'authenticated': request.user.is_authenticated,
        'session_key': request.session.session_key,
        'session_data': dict(request.session),
        'cookies': dict(request.COOKIES),
        'headers': dict(request.headers),
    }
    
    return Response(response_data)

# Session Check View
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def session_check(request):
    """Check if user has a valid session"""
    print(f"[Django] Session check endpoint called")
    print(f"[Django] User: {request.user}")
    print(f"[Django] User authenticated: {request.user.is_authenticated}")
    print(f"[Django] Session ID: {request.session.session_key}")
    
    if not request.user.is_authenticated:
        return Response({
            'authenticated': False,
            'message': 'No active session'
        })
    
    # Check session timeout
    import time
    current_time = time.time()
    last_activity = request.session.get('last_activity', current_time)
    login_time = request.session.get('login_time', current_time)
    
    # Calculate time remaining
    time_elapsed = current_time - last_activity
    time_remaining = 1800 - time_elapsed  # 30 minutes - elapsed time
    
    if time_elapsed > 1800:
        # Session expired
        logout(request)
        return Response({
            'authenticated': False,
            'message': 'Session expired',
            'expired': True
        }, status=401)
    
    response_data = {
        'authenticated': True,
        'user': UserSerializer(request.user).data,
        'session_key': request.session.session_key,
        'last_activity': last_activity,
        'login_time': login_time,
        'time_elapsed': time_elapsed,
        'time_remaining': time_remaining,
        'session_valid': True
    }
    
    return Response(response_data)

# Signup Health Check View
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def signup_health_check(request):
    print(f"[Django] Signup health check endpoint called - Method: {request.method}")
    logger.info(f"[Django] Signup health check endpoint called - Method: {request.method}")
    
    try:
        # Check if database is accessible
        user_count = User.objects.count()
        
        response_data = {
            'status': 'healthy',
            'message': 'Signup service is ready',
            'database': 'connected',
            'user_count': user_count,
            'timestamp': '2024-01-01T00:00:00Z'
        }
        
        print(f"[Django] Signup health check response: {response_data}")
        logger.info(f"[Django] Signup health check response: {response_data}")
        
        return Response(response_data)
    except Exception as e:
        print(f"[Django] Signup health check failed: {str(e)}")
        logger.error(f"[Django] Signup health check failed: {str(e)}")
        
        return Response({
            'status': 'unhealthy',
            'message': 'Signup service is not ready',
            'error': str(e),
            'timestamp': '2024-01-01T00:00:00Z'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

# Authentication Views
@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print(f"[Django] RegisterView called - Method: {request.method}")
        print(f"[Django] RegisterView data: {request.data}")
        print(f"[Django] RegisterView user: {request.user}")
        print(f"[Django] RegisterView authenticated: {request.user.is_authenticated}")
        print(f"[Django] RegisterView headers: {dict(request.headers)}")
        
        try:
            serializer = UserRegistrationSerializer(data=request.data)
            print(f"[Django] Serializer created")
            
            if serializer.is_valid():
                print(f"[Django] Serializer is valid")
                user = serializer.save()
                print(f"[Django] User created: {user.username}")
                login(request, user)
                print(f"[Django] User logged in")
                return Response({
                    'user': UserSerializer(user).data,
                    'message': 'User registered successfully'
                }, status=status.HTTP_201_CREATED)
            else:
                print(f"[Django] Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"[Django] RegisterView error: {str(e)}")
            import traceback
            print(f"[Django] Full traceback: {traceback.format_exc()}")
            return Response({
                'error': str(e),
                'message': 'Registration failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print(f"[Django] LoginView called - Method: {request.method}")
        print(f"[Django] LoginView data: {request.data}")
        print(f"[Django] LoginView user: {request.user}")
        print(f"[Django] LoginView authenticated: {request.user.is_authenticated}")
        print(f"[Django] Session ID before login: {request.session.session_key}")
        print(f"[Django] Session data before login: {dict(request.session)}")
        
        try:
            serializer = UserLoginSerializer(data=request.data)
            print(f"[Django] Login serializer created")
            
            if serializer.is_valid():
                print(f"[Django] Login serializer is valid")
                user = serializer.validated_data['user']
                print(f"[Django] User found: {user.username}")
                login(request, user)
                print(f"[Django] User logged in successfully")
                print(f"[Django] Session ID after login: {request.session.session_key}")
                print(f"[Django] Session data after login: {dict(request.session)}")
                print(f"[Django] User authenticated after login: {request.user.is_authenticated}")
                
                # Ensure session is created and saved
                if not request.session.session_key:
                    request.session.create()
                
                # Set session timeout and activity tracking
                import time
                request.session['last_activity'] = time.time()
                request.session['user_id'] = user.id
                request.session['login_time'] = time.time()
                
                # Save the session
                request.session.save()
                print(f"[Django] Session saved, final session key: {request.session.session_key}")
                print(f"[Django] Session timeout set to 30 minutes")
                
                response = Response({
                    'user': UserSerializer(user).data,
                    'message': 'Login successful',
                    'session_key': request.session.session_key,
                    'session_timeout': 1800,  # 30 minutes in seconds
                    'expires_at': time.time() + 1800
                })
                
                # Set session cookie with 30-minute timeout
                response.set_cookie(
                    'sessionid',
                    request.session.session_key,
                    max_age=1800,  # 30 minutes
                    domain=None,
                    secure=False,
                    httponly=False,
                    samesite='Lax',
                    path='/'
                )
                
                print(f"[Django] Session cookie set with 30-minute timeout")
                return response
            else:
                print(f"[Django] Login serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"[Django] LoginView error: {str(e)}")
            import traceback
            print(f"[Django] Full traceback: {traceback.format_exc()}")
            return Response({
                'error': str(e),
                'message': 'Login failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logout successful'})


# Profile Views
class UserProfileView(APIView):
    permission_classes = [permissions.AllowAny]  # Temporarily allow any for debugging

    def get(self, request):
        print(f"[Django] UserProfileView GET called")
        print(f"[Django] User: {request.user}")
        print(f"[Django] User authenticated: {request.user.is_authenticated}")
        print(f"[Django] Session ID: {request.session.session_key}")
        print(f"[Django] Session data: {dict(request.session)}")
        print(f"[Django] Headers: {dict(request.headers)}")
        
        if not request.user.is_authenticated:
            print(f"[Django] User not authenticated, returning empty response for debugging")
            return Response({'error': 'No authenticated user found', 'debug_info': {
                'session_key': request.session.session_key,
                'session_data': dict(request.session),
                'cookies': dict(request.COOKIES)
            }})
        
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        print(f"[Django] UserProfileView PUT called")
        print(f"[Django] User: {request.user}")
        print(f"[Django] User authenticated: {request.user.is_authenticated}")
        
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Return the full profile data
            profile_serializer = UserProfileSerializer(request.user)
            return Response(profile_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.filter(is_public=True)
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserListView(generics.ListAPIView):
    queryset = User.objects.filter(is_public=True)
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.filter(is_public=True).exclude(id=self.request.user.id)
        
        # Filter by location if provided
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Filter by skill if provided
        skill = self.request.query_params.get('skill', None)
        if skill:
            queryset = queryset.filter(user_skills__skill__name__icontains=skill)
        
        return queryset.distinct()


# Skill Views
class SkillListView(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]


class SkillDetailView(generics.RetrieveAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]


# UserSkill Views
class UserSkillListView(generics.ListCreateAPIView):
    serializer_class = UserSkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        print(f"[Django] UserSkillListView GET called")
        print(f"[Django] User: {self.request.user}")
        print(f"[Django] User authenticated: {self.request.user.is_authenticated}")
        print(f"[Django] Session ID: {self.request.session.session_key}")
        print(f"[Django] Session data: {dict(self.request.session)}")
        
        if not self.request.user.is_authenticated:
            print(f"[Django] User not authenticated in UserSkillListView, returning empty queryset")
            return UserSkill.objects.none()
        
        return UserSkill.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        print(f"[Django] UserSkillListView CREATE called")
        print(f"[Django] User: {self.request.user}")
        print(f"[Django] User authenticated: {self.request.user.is_authenticated}")
        
        if not self.request.user.is_authenticated:
            raise permissions.PermissionDenied("Authentication required")
        
        serializer.save(user=self.request.user)


class UserSkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSkill.objects.filter(user=self.request.user)


# Bulk UserSkill operations
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_user_skills(request):
    """Bulk add/update user skills"""
    print(f"[Django] Bulk user skills called by user: {request.user}")
    
    serializer = UserSkillBulkSerializer(data=request.data)
    if serializer.is_valid():
        skills_data = serializer.validated_data['skills']
        results = []
        
        for skill_data in skills_data:
            try:
                # Check if skill exists
                skill = Skill.objects.get(id=skill_data['skill_id'])
                
                # Check if user-skill combination already exists
                user_skill, created = UserSkill.objects.get_or_create(
                    user=request.user,
                    skill=skill,
                    defaults={'is_offered': skill_data['is_offered']}
                )
                
                if not created:
                    # Update existing
                    user_skill.is_offered = skill_data['is_offered']
                    user_skill.save()
                
                results.append({
                    'skill_id': skill.id,
                    'skill_name': skill.name,
                    'is_offered': user_skill.is_offered,
                    'created': created
                })
                
            except Skill.DoesNotExist:
                results.append({
                    'skill_id': skill_data['skill_id'],
                    'error': 'Skill not found'
                })
        
        return Response({
            'message': 'Skills updated successfully',
            'results': results
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# SwapRequest Views
class SwapRequestListView(generics.ListCreateAPIView):
    serializer_class = SwapRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return SwapRequest.objects.filter(sender=user) | SwapRequest.objects.filter(receiver=user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class SwapRequestDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = SwapRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return SwapRequest.objects.filter(sender=user) | SwapRequest.objects.filter(receiver=user)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return SwapRequestUpdateSerializer
        return SwapRequestSerializer


class SentSwapRequestsView(generics.ListAPIView):
    serializer_class = SwapRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SwapRequest.objects.filter(sender=self.request.user)


class ReceivedSwapRequestsView(generics.ListAPIView):
    serializer_class = SwapRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SwapRequest.objects.filter(receiver=self.request.user)


# Search and Utility Views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_users(request):
    query = request.query_params.get('q', '')
    location = request.query_params.get('location', '')
    skill = request.query_params.get('skill', '')
    
    queryset = User.objects.filter(is_public=True).exclude(id=request.user.id)
    
    if query:
        queryset = queryset.filter(
            models.Q(username__icontains=query) |
            models.Q(first_name__icontains=query) |
            models.Q(last_name__icontains=query) |
            models.Q(bio__icontains=query)
        )
    
    if location:
        queryset = queryset.filter(location__icontains=location)
    
    if skill:
        queryset = queryset.filter(user_skills__skill__name__icontains=skill)
    
    serializer = UserProfileSerializer(queryset.distinct()[:20], many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_skills(request, user_id):
    try:
        user = User.objects.get(id=user_id, is_public=True)
        user_skills = UserSkill.objects.filter(user=user)
        serializer = UserSkillSerializer(user_skills, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
