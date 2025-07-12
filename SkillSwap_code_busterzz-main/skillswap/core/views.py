from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from django.shortcuts import get_object_or_404
from .models import User, Skill, UserSkill, SwapRequest
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    SkillSerializer, UserSkillSerializer, SwapRequestSerializer, SwapRequestUpdateSerializer
)
import logging

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
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            return Response({
                'user': UserSerializer(user).data,
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return Response({
                'user': UserSerializer(user).data,
                'message': 'Login successful'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logout successful'})


# User Views
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.filter(is_public=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserListView(generics.ListAPIView):
    queryset = User.objects.filter(is_public=True)
    serializer_class = UserSerializer
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
        return UserSkill.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserSkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSkill.objects.filter(user=self.request.user)


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


# Search and Discovery Views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_users(request):
    query = request.query_params.get('q', '')
    if not query:
        return Response({'users': []})
    
    users = User.objects.filter(
        is_public=True,
        username__icontains=query
    ).exclude(id=request.user.id)
    
    serializer = UserSerializer(users, many=True)
    return Response({'users': serializer.data})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_skills(request, user_id):
    user = get_object_or_404(User, id=user_id, is_public=True)
    user_skills = UserSkill.objects.filter(user=user)
    serializer = UserSkillSerializer(user_skills, many=True)
    return Response(serializer.data)
