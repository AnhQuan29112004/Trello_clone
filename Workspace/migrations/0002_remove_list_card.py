# Generated by Django 5.2 on 2025-04-13 15:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Workspace', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='list',
            name='card',
        ),
    ]
