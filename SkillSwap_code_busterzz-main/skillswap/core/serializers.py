from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Skill, UserSkill, SwapRequest

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'location', 
                 'availability', 'profile_photo', 'is_public', 'rating', 'bio', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class UserProfileSerializer(serializers.ModelSerializer):
    """Detailed user profile serializer with skills"""
    offered_skills = serializers.SerializerMethodField()
    wanted_skills = serializers.SerializerMethodField()
    skill_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'location', 
                 'availability', 'profile_photo', 'is_public', 'rating', 'bio', 'date_joined',
                 'offered_skills', 'wanted_skills', 'skill_count']
        read_only_fields = ['id', 'date_joined', 'rating']
    
    def get_offered_skills(self, obj):
        skills = obj.user_skills.filter(is_offered=True).select_related('skill')
        return [{'id': us.skill.id, 'name': us.skill.name} for us in skills]
    
    def get_wanted_skills(self, obj):
        skills = obj.user_skills.filter(is_offered=False).select_related('skill')
        return [{'id': us.skill.id, 'name': us.skill.name} for us in skills]
    
    def get_skill_count(self, obj):
        return obj.user_skills.count()

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'location', 'availability', 
                 'profile_photo', 'is_public', 'bio']
    
    def validate_location(self, value):
        if value and len(value.strip()) == 0:
            return None
        return value
    
    def validate_bio(self, value):
        if value and len(value.strip()) == 0:
            return None
        return value

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Try to authenticate with username first
            user = authenticate(username=username, password=password)
            
            # If that fails, try to find user by email and authenticate
            if not user:
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(username=user_obj.username, password=password)
                except User.DoesNotExist:
                    pass
            
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')

        return attrs

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class UserSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    skill_id = serializers.IntegerField(write_only=True)
    skill_name = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = UserSkill
        fields = ['id', 'skill', 'skill_id', 'skill_name', 'is_offered']
        read_only_fields = ['id']

    def create(self, validated_data):
        skill_id = validated_data.pop('skill_id')
        try:
            skill = Skill.objects.get(id=skill_id)
        except Skill.DoesNotExist:
            raise serializers.ValidationError(f"Skill with id {skill_id} does not exist")
        
        # Check if this user-skill combination already exists
        user = validated_data.get('user')
        existing = UserSkill.objects.filter(user=user, skill=skill, is_offered=validated_data['is_offered'])
        if existing.exists():
            raise serializers.ValidationError(f"You already have this skill marked as {'offered' if validated_data['is_offered'] else 'wanted'}")
        
        return UserSkill.objects.create(skill=skill, **validated_data)

class UserSkillBulkSerializer(serializers.Serializer):
    """Serializer for bulk adding/removing user skills"""
    skills = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )
    
    def validate_skills(self, value):
        for skill_data in value:
            if 'skill_id' not in skill_data:
                raise serializers.ValidationError("Each skill must have a skill_id")
            if 'is_offered' not in skill_data:
                raise serializers.ValidationError("Each skill must have an is_offered flag")
        return value

class SwapRequestSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    sender_skill = SkillSerializer(read_only=True)
    receiver_skill = SkillSerializer(read_only=True)
    sender_skill_id = serializers.IntegerField(write_only=True, required=False)
    receiver_skill_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = SwapRequest
        fields = ['id', 'sender', 'receiver', 'sender_skill', 'receiver_skill',
                 'sender_skill_id', 'receiver_skill_id', 'message', 'status', 'created_at']
        read_only_fields = ['id', 'sender', 'status', 'created_at']

    def create(self, validated_data):
        sender_skill_id = validated_data.pop('sender_skill_id', None)
        receiver_skill_id = validated_data.pop('receiver_skill_id', None)
        
        if sender_skill_id:
            validated_data['sender_skill'] = Skill.objects.get(id=sender_skill_id)
        if receiver_skill_id:
            validated_data['receiver_skill'] = Skill.objects.get(id=receiver_skill_id)
        
        return SwapRequest.objects.create(**validated_data)

class SwapRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SwapRequest
        fields = ['status'] 