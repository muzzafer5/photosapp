# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse
from .models import Tag, User, Image
from rest_framework import status
from rest_framework.request import Request
import json
from django.views.decorators.http import require_http_methods
import logging
from .utils import validate_token, get_download_url


@require_http_methods(['POST', 'GET'])
def create_image(request: Request) -> HttpResponse:
    try:
        logging.error(request)
        logging.error(request.body)
        try:
            token_id = request.META['HTTP_AUTHORIZATION']
            user_id = validate_token(token_id)
        except Exception as exp:
            logging.error(exp)
            return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
        if request.method == 'POST':
            logging.error(request)
            if user_id is not None:
                image_data = json.loads(request.body)
                url = get_download_url(image_data['uri'], image_data['name'])
                if url == "":
                    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
                image_content = {}
                if 'timestamp' in image_data:
                    image_content['timestamp'] = image_data['timestamp']
                image_content['name'] = image_data['name']
                image_content['place'] = image_data['place']
                image_content['uri'] = url
                image_content['user_id'] = user_id
                tag_ids = []
                tags = []
                if 'tags' in image_data:
                    for tag_id in image_data['tags']:
                        tag_ids.append(tag_id)
                        tags.append(Tag.objects.get(id=int(tag_id)))
                image_instance = Image(name=image_content['name'], place=image_content['place'],
                                       uri=image_content['uri'],
                                       user_id=image_content['user_id'], identity_group=0)
                image_instance.save()
                image_instance.identity_group = image_instance.id
                image_instance.save()
                image_instance = Image.objects.get(id=image_instance.id)
                for tag in tags:
                    image_instance.tags.add(tag)
                image_instance.save()
                shared_with = [user_instance.id for user_instance in image_instance.shared_with.all()]
                image_instance_json = json.dumps({'id': image_instance.id, 'name': image_instance.name,
                                                  'place': image_instance.place, 'uri': image_instance.uri,
                                                  'timestamp': str(image_instance.timestamp),
                                                  'user_id': user_id, 'tags': tag_ids, 'shared_with': shared_with})
                return HttpResponse(image_instance_json, status=status.HTTP_201_CREATED)
            else:
                return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
        if request.method == 'GET':
            if user_id is not None:
                logging.error(request)
                own_by_me = Image.objects.filter(user_id=user_id)
                shared_with_me = Image.objects.filter(shared_with__id=user_id)
                all_images = []
                for image in own_by_me:
                    all_images.append(image.id)
                for image in shared_with_me:
                    all_images.append(image.id)
                return HttpResponse(json.dumps({"image_ids": all_images}), status=status.HTTP_200_OK)
            return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
    except Exception as ex:
        logging.error('Final Catch se ye error aayi hai ' + str(ex))
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
    return HttpResponse(status=status.HTTP_404_NOT_FOUND)


@require_http_methods(['GET', 'PUT', 'DELETE'])
def image_crud(request: Request, image_id: int):
    logging.error(request)
    try:
        token_id = request.META['HTTP_AUTHORIZATION']
        user_id = validate_token(token_id)
    except Exception as exp:
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
    if user_id is not None:
        if request.method == 'GET':
            try:
                image_instance = Image.objects.get(id=image_id)
            except Exception as exp:
                return HttpResponse(status=status.HTTP_404_NOT_FOUND)
            if image_instance.user_id == user_id:
                image_instance_json = json.dumps({
                    'id': image_instance.id,
                    'name': image_instance.name,
                    'place': image_instance.place,
                    'uri': image_instance.uri,
                    'timestamp': str(image_instance.timestamp),
                    'tags': [tag_instance.id for tag_instance in image_instance.tags.all()],
                    'shared_with': [user_instance.id for user_instance in image_instance.shared_with.all()]
                })
                return HttpResponse(image_instance_json, status=status.HTTP_200_OK)
            return HttpResponse('get call kiya!!', status=status.HTTP_401_UNAUTHORIZED)
        if request.method == 'PUT':
            image_instance = Image.objects.get(id=image_id)
            if image_instance.user_id == user_id:
                query = json.loads(request.body)
                if 'name' in query:
                    image_instance.name = query['name']
                if 'place' in query:
                    image_instance.place = query['place']
                if 'uri' in query:
                    image_instance.uri = query['uri']
                if 'timestamp' in query:
                    image_instance.timestamp = query['timestamp']
                image_instance.save()
                tag_ids = []
                if 'tags' in query:
                    image_instance.tags.clear()
                    for tag_id in query['tags']:
                        tag_ids.append(tag_id)
                        image_instance.tags.add(Tag.objects.get(id=int(tag_id)))
                image_instance.save()
                image_instance_json = json.dumps({
                    'id': image_instance.id,
                    'name': image_instance.name,
                    'place': image_instance.place,
                    'uri': image_instance.uri,
                    'timestamp': str(image_instance.timestamp),
                    'tags': [tag_instance.id for tag_instance in image_instance.tags.all()]
                })
                return HttpResponse(image_instance_json, status=status.HTTP_200_OK)
        if request.method == 'DELETE':
            image_instance = Image.objects.get(id=image_id)
            if image_instance.user_id == user_id:
                image_instance.delete()
                return HttpResponse(status=status.HTTP_204_NO_CONTENT)
    return HttpResponse(status=status.HTTP_404_NOT_FOUND)


@require_http_methods(['GET'])
def get_private_images(request: Request):
    try:
        logging.error(request)
        try:
            token_id = request.META['HTTP_AUTHORIZATION']
            user_id = validate_token(token_id)
        except Exception as exp:
            return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
        if user_id is not None:
            image_instances = Image.objects.all().filter(user_id=user_id)
            image_ids = []
            for image_instance in image_instances:
                image_ids.append(image_instance.id)
            return HttpResponse(json.dumps({'image_ids': image_ids}), status=status.HTTP_200_OK)
        else:
            return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
    except Exception as exp:
        logging.error(str(exp))
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)


@require_http_methods(['GET'])
def get_shared_images(request):
    try:
        logging.error(request)
        token_id = request.META['HTTP_AUTHORIZATION']
        user_id = validate_token(token_id)
        if user_id is not None:
            image_instances = Image.objects.filter(shared_with__id=user_id)
            image_ids = []
            for image_instance in image_instances:
                image_ids.append(image_instance.id)
            return HttpResponse(json.dumps({"image_ids": image_ids}), status=status.HTTP_200_OK)
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
    except Exception as exp:
        logging.error("exception has occured: " + str(exp))
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)


def image_share(request: Request, image_id: int):
    try:
        logging.error(request)
        try:
            token_id = request.META['HTTP_AUTHORIZATION']
            user_id = validate_token(token_id)
            user_ids = json.loads(request.body)['user_ids']
        except Exception as exp:
            return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
        if user_id is not None:
            image_instance = Image.objects.get(id=image_id)
            if image_instance.user_id == user_id:
                try:
                    if len(user_ids) != len(set(user_ids)) or len(user_ids) == 0:
                        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
                    for user_id_ in user_ids:
                        if user_id == user_id_:
                            return HttpResponse(status=status.HTTP_403_FORBIDDEN)
                        image_instance.shared_with.add(User.objects.get(id=int(user_id_)))
                except Exception as exp:
                    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
                image_instance.save()
                return HttpResponse(status=status.HTTP_204_NO_CONTENT)
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    except Exception as ex:
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

    return HttpResponse(status=status.HTTP_404_NOT_FOUND)


@require_http_methods(['GET', 'POST'])
def identical_image(request, image_id: int):
    try:
        logging.error(request)
        token_id = request.META['HTTP_AUTHORIZATION']
        user_id = validate_token(token_id)
    except Exception as exp:
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
    if user_id is not None:
        try:
            image_instance = Image.objects.get(id=image_id)
        except Exception as exp:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
        if user_id == image_instance.user_id:
            if request.method == 'GET':
                identity_group = image_instance.identity_group
                identical_images = Image.objects.filter(identity_group=identity_group)
                image_ids = []
                for image in identical_images:
                    if int(image.id) != int(image_id):
                        image_ids.append(image.id)
                return HttpResponse(json.dumps({"image_ids": image_ids}), status=status.HTTP_200_OK)

            if request.method == 'POST':
                identity_group = image_instance.identity_group
                logging.error(request.body)
                image_ids = json.loads(request.body)['image_ids']
                if len(image_ids) != len(set(image_ids)) or len(image_ids) == 0:
                    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
                try:
                    identical_images = []
                    for image_id in image_ids:
                        image = Image.objects.get(id=int(image_id))
                        if image.user_id != user_id:
                            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
                        if image.id == image_instance.id:
                            return HttpResponse(status=status.HTTP_403_FORBIDDEN)
                        current_identity_group = image.identity_group
                        for im in Image.objects.filter(identity_group=current_identity_group):
                            identical_images.append(im)
                    for im in identical_images:
                        im.identity_group = identity_group
                        im.save()
                    return HttpResponse(status=status.HTTP_204_NO_CONTENT)
                except Exception as exp:
                    logging.error(exp)
                    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
