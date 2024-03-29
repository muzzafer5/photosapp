# Generated by Django 3.1 on 2020-08-13 21:21

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0004_auto_20200813_2105'),
    ]

    operations = [
        migrations.AlterField(
            model_name='album',
            name='name',
            field=models.CharField(max_length=250, unique=True),
        ),
        migrations.AlterField(
            model_name='image',
            name='name',
            field=models.CharField(max_length=250),
        ),
        migrations.AlterField(
            model_name='image',
            name='place',
            field=models.CharField(max_length=250),
        ),
        migrations.AlterField(
            model_name='image',
            name='timestamp',
            field=models.DateTimeField(default=django.utils.timezone.now, max_length=250),
        ),
        migrations.AlterField(
            model_name='image',
            name='uri',
            field=models.CharField(max_length=250),
        ),
        migrations.AlterField(
            model_name='tag',
            name='tag_name',
            field=models.CharField(max_length=250, unique=True),
        ),
        migrations.AlterField(
            model_name='tokenstat',
            name='token_id',
            field=models.CharField(max_length=250, unique=True),
        ),
    ]
