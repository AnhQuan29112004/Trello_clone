from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Card,CardMember

@receiver(post_save, sender=Card)
def create_card(sender, instance, created, **kwargs):
    if created:
        CardMember.objects.create(card=instance, user=instance.created_by)
    else:
        # Perform actions when an existing Card instance is updated
        print(f"Card updated: {instance.name}")