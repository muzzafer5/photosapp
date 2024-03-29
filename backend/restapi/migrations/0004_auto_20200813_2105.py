# Generated by Django 3.1 on 2020-08-13 21:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0003_auto_20200813_0721'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='image',
            unique_together={('name', 'user_id')},
        ),
        migrations.AlterUniqueTogether(
            name='tag',
            unique_together={('tag_name', 'user_id')},
        ),
    ]
