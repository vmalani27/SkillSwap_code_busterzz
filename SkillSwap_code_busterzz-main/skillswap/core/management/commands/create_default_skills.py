from django.core.management.base import BaseCommand
from core.models import Skill

class Command(BaseCommand):
    help = 'Create default skills for the SkillSwap platform'

    def handle(self, *args, **options):
        default_skills = [
            'Programming',
            'Web Development',
            'Mobile Development',
            'Data Science',
            'Machine Learning',
            'Graphic Design',
            'UI/UX Design',
            'Digital Marketing',
            'Content Writing',
            'Video Editing',
            'Photography',
            'Music Production',
            'Cooking',
            'Language Teaching',
            'Fitness Training',
            'Yoga',
            'Meditation',
            'Drawing',
            'Painting',
            'Crafting',
            'Gardening',
            'Carpentry',
            'Plumbing',
            'Electrical Work',
            'Car Maintenance',
            'Financial Planning',
            'Business Strategy',
            'Public Speaking',
            'Leadership',
            'Project Management',
        ]

        created_count = 0
        for skill_name in default_skills:
            skill, created = Skill.objects.get_or_create(name=skill_name)
            if created:
                created_count += 1
                self.stdout.write(f'Created skill: {skill_name}')
            else:
                self.stdout.write(f'Skill already exists: {skill_name}')

        self.stdout.write(
            self.style.SUCCESS(f'Successfully processed {len(default_skills)} skills. Created {created_count} new skills.')
        ) 