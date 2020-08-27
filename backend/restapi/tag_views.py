# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse, HttpRequest
from .models import Tag
from rest_framework import status
from rest_framework.request import Request
import json
from django.views.decorators.http import require_http_methods
from .serializers import TagSerializer
import logging
from .utils import validate_token


@require_http_methods(['GET', 'POST'])
def tags(request: HttpRequest) -> HttpResponse:
    try:
        token_id = request.META['HTTP_AUTHORIZATION']
        logging.error(token_id)
        logging.error(request)
        user_id = validate_token(token_id)
        logging.error(user_id)
        if user_id is not None:
            if request.method == 'POST':
                try:
                    tag_data = {'user_id': user_id, 'tag_name': json.loads(request.body)['name']}
                    tag_serializer = TagSerializer(data=tag_data)
                    if not tag_serializer.is_valid():
                        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
                except Exception as exp:
                    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
                try:
                    tag_instance = tag_serializer.save()
                    return HttpResponse(json.dumps({'id': tag_instance.id, 'name': tag_instance.tag_name}),
                                        status=status.HTTP_201_CREATED)
                except Exception as exp:
                    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
            if request.method == 'GET':
                logging.error(request)
                tag_ids = []
                for tag_instance in list(Tag.objects.all()):
                    if tag_instance.user_id == user_id:
                        tag_ids.append(tag_instance.id)
                all_data = json.dumps({'tag_ids': tag_ids})
                return HttpResponse(all_data, status=status.HTTP_200_OK)
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
    except Exception as exec:
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)


@require_http_methods(['GET', 'PUT', 'DELETE'])
def tag(request: Request, tag_id: int):
    try:
        logging.error(request)
        try:
            token_id = request.META['HTTP_AUTHORIZATION']
            user_id = validate_token(token_id)
        except Exception as exp:
            return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
        if user_id is not None:
            if request.method == 'GET':
                tag_instance = Tag.objects.get(pk=tag_id)
                if tag_instance.user_id == user_id:
                    return HttpResponse(json.dumps({"id": tag_instance.id, "name": tag_instance.tag_name}),
                                        status=status.HTTP_200_OK)
                return HttpResponse(status=status.HTTP_404_NOT_FOUND)
            if request.method == 'PUT':
                tag_name = json.loads(request.body)['name']
                try:
                    tag_instance = Tag.objects.get(pk=tag_id)
                    if tag_instance.user_id == user_id:
                        tag_instance.tag_name = tag_name
                        tag_instance.save()
                        return HttpResponse(json.dumps({'result': 'success'}), status=status.HTTP_200_OK)
                except Exception as exp:
                    return HttpResponse(status=status.HTTP_404_NOT_FOUND)
            if request.method == 'DELETE':
                tag_instance = Tag.objects.get(pk=tag_id)
                if tag_instance.user_id == user_id:
                    tag_instance.delete()
                    return HttpResponse(status=status.HTTP_204_NO_CONTENT)
                return HttpResponse(status=status.HTTP_404_NOT_FOUND)
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)

    except Exception as exp:
        return HttpResponse('nahi aayega result!!', status=status.HTTP_404_NOT_FOUND)


