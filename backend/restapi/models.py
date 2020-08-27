# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


# Create your models here.
class Tag(models.Model):
    tag_name = models.CharField(max_length=250, unique=True, null=False)
    user_id = models.IntegerField()

    def __str__(self):
        return self.tag_name

    class Meta:
        unique_together = ('tag_name', 'user_id')


# TODO: See if using django user make sense
# class User(models.Model):
#     username = models.CharField(max_length=40, null=False, unique=True)
#     password = models.CharField(max_length=50, null=False)
#
#     def __str__(self):
#         return self.username + " " + str(self.id)


class Image(models.Model):
    name = models.CharField(max_length=250, null=False)
    place = models.CharField(max_length=250, null=False)
    uri = models.CharField(max_length=250, null=False)
    timestamp = models.DateTimeField(max_length=250, default=timezone.now)
    user_id = models.IntegerField(unique=False)
    identity_group = models.IntegerField(unique=False)
    shared_with = models.ManyToManyField(User)
    tags = models.ManyToManyField(Tag)

    class Meta:
        unique_together = ("name", "user_id")

    def __str__(self):
        return self.name


class TokenStat(models.Model):
    token_id = models.CharField(max_length=250, null=False, unique=True)
    user_id = models.IntegerField(unique=False)
    status = models.BooleanField()

    def __str__(self):
        return self.token_id


class Album(models.Model):
    name = models.CharField(max_length=250, null=False, unique=True)
    user_id = models.IntegerField(unique=False)
    images = models.ManyToManyField(Image)
    shared_with = models.ManyToManyField(User)

    def __str__(self):
        return self.name

