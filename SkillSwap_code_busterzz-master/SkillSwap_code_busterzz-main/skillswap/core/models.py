from django.contrib.auth.models import AbstractUser
from django.db import models


# -------------------------
# Custom User Model
# -------------------------
class User(AbstractUser):
    location = models.CharField(max_length=255, blank=True, null=True)
    availability = models.CharField(max_length=100, blank=True, null=True)  # e.g. weekends, evenings
    profile_photo = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_public = models.BooleanField(default=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)  # e.g. 4.2
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username


# -------------------------
# Skill Model
# -------------------------
class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# -------------------------
# UserSkill (Offered or Wanted)
# -------------------------
class UserSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_skills")
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    is_offered = models.BooleanField()  # True = Offered, False = Wanted

    class Meta:
        unique_together = ('user', 'skill', 'is_offered')

    def __str__(self):
        status = 'Offered' if self.is_offered else 'Wanted'
        return f"{self.user.username} - {status} - {self.skill.name}"


# -------------------------
# Swap Request Model
# -------------------------
class SwapRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    sender_skill = models.ForeignKey(Skill, on_delete=models.SET_NULL, null=True, related_name='sender_skill_used')
    receiver_skill = models.ForeignKey(Skill, on_delete=models.SET_NULL, null=True, related_name='receiver_skill_needed')
    message = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} ➝ {self.receiver.username} ({self.status})"
