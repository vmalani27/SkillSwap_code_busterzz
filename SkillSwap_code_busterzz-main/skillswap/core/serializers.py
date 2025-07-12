from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Skill, UserSkill, SwapRequest

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'location', 
                 'availability', 'profile_photo', 'is_public', 'rating', 'bio', 'date_joined']
        read_only_fields = ['id', 'date_joined']

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
            user = authenticate(username=username, password=password)
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

    class Meta:
        model = UserSkill
        fields = ['id', 'skill', 'skill_id', 'is_offered']
        read_only_fields = ['id']

    def create(self, validated_data):
        skill_id = validated_data.pop('skill_id')
        skill = Skill.objects.get(id=skill_id)
        return UserSkill.objects.create(skill=skill, **validated_data)

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