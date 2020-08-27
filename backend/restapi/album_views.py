# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse
from .models import Image, Album, User
from rest_framework import status
from rest_framework.request import Request
import json
from django.views.decorators.http import require_http_methods
import logging
from .utils import validate_token


@require_http_methods(['POST', 'GET'])
def album(request: Request):
    logging.error(request)
    if request.method == 'POST':
        try:
            try:
                logging.error(request.body)
                token_id = request.META['HTTP_AUTHORIZATION']
                user_id = validate_token(token_id)
                logging.error('UserId from this post ' + str(user_id))
            except Exception as exp:
                logging.error(exp)
                return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
            album_body = json.loads(request.body)
            logging.error(album_body)
            image_ids = []
            if 'images' in album_body:
                logging.error('images key hai iske paas')
                image_ids = album_body['images']

            images = []
            for image_id in image_ids:
                image = Image.objects.get(id=int(image_id))
                if image.user_id != user_id:
                    return HttpResponse(status=status.HTTP_403_FORBIDDEN)
                logging.error('image add kar raha album_instance mein')
                images.append(image)
            album_instance = Album(name=album_body['name'], user_id=user_id)
            album_instance.save()
            logging.error(album_instance)
            for image in images:
                album_instance.images.add(image)
            album_instance.save()
            album_instance_json = json.dumps({
                'id': album_instance.id,
                'name': album_instance.name,
                'images': [image.id for image in album_instance.images.all()],
                'shared_with': [user_instance.id for user_instance in album_instance.shared_with.all()]
            })
            return HttpResponse(album_instance_json,
                                status=status.HTTP_201_CREATED)
        except Exception as exp:
            logging.error(exp)
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'GET':
        try:
            logging.error(request)
            logging.error(request.body)
            token_id = request.META['HTTP_AUTHORIZATION']
            user_id = validate_token(token_id)
            logging.error('UserId ' + str(user_id))
            if user_id is not None:
                albums = Album.objects.filter(user_id=user_id)
                album_ids = [album_instance.id for album_instance in albums]
                return HttpResponse(json.dumps({"album_ids": album_ids}), status=status.HTTP_200_OK)
        except Exception as exp:
            logging.error(exp)
            return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)


@require_http_methods(['GET', 'PUT', 'DELETE'])
def album_crud(request, album_id: int):
    try:
        logging.error(request)
        token_id = request.META['HTTP_AUTHORIZATION']
        user_id = validate_token(token_id)
        logging.error(user_id)
    except Exception as exp:
        logging.error(exp)
        logging.error('get se pehle hi exception aa gaya!!')
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
    if user_id is not None:
        if request.method == 'GET':
            try:
                logging.error('get wale tak aaya to')
                album_instance = Album.objects.get(id=int(album_id))
                logging.error(album_instance)
            except Exception as exp:
                logging.error(exp)
                return HttpResponse(status=status.HTTP_404_NOT_FOUND)
            if int(album_instance.user_id) == int(user_id):
                album_instance_json = json.dumps({
                    'id': album_instance.id,
                    'name': album_instance.name,
                    'images': [image.id for image in album_instance.images.all()],
                    'shared_with': [user_instance.id for user_instance in album_instance.shared_with.all()]
                })
                logging.error(album_instance_json)
                return HttpResponse(album_instance_json, status=status.HTTP_200_OK)
            return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
        if request.method == 'PUT':
            try:
                album_instance = Album.objects.get(id=int(album_id))
            except Exception as exp:
                logging.error(exp)
                return HttpResponse(status=status.HTTP_404_NOT_FOUND)
            if int(album_instance.user_id) == int(user_id):
                query = json.loads(request.body)
                if 'name' in query:
                    album_instance.name = query['name']
                    album_instance.save()
                    album_instance_json = json.dumps({
                        "id": album_instance.id,
                        "name": album_instance.name,
                        "images": [image.id for image in album_instance.images.all()],
                        "shared_with": [user_instance.id for user_instance in album_instance.shared_with.all()]
                    })
                    logging.error(album_instance_json)
                    return HttpResponse(album_instance_json, status=status.HTTP_200_OK)

        if request.method == 'DELETE':
            try:
                album_instance = Album.objects.get(id=album_id)
            except Exception as exp:
                logging.error(exp)
                return HttpResponse(status=status.HTTP_404_NOT_FOUND)
            if album_instance.user_id == user_id:
                album_instance.delete()
                return HttpResponse(status=status.HTTP_204_NO_CONTENT)
    return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)


@require_http_methods(['POST'])
def album_share(request: Request, album_id: int):
    try:
        logging.error(request)
        try:
            token_id = request.META['HTTP_AUTHORIZATION']
            user_id = validate_token(token_id)
            user_ids = json.loads(request.body)['user_ids']
        except Exception as exp:
            return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
        if user_id is not None:
            album_instance = Album.objects.get(id=album_id)
            if album_instance.user_id == user_id:
                try:
                    if len(user_ids) != len(set(user_ids)) or len(user_ids) == 0:
                        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
                    for user_id_ in user_ids:
                        if user_id == user_id_:
                            return HttpResponse(status=status.HTTP_403_FORBIDDEN)
                        album_instance.shared_with.add(User.objects.get(id=int(user_id_)))
                except Exception as exp:
                    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
                album_instance.save()
                return HttpResponse(status=status.HTTP_204_NO_CONTENT)
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    except Exception as ex:
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

    return HttpResponse(status=status.HTTP_404_NOT_FOUND)


def put_image_in_album(request, album_id: int):
    logging.error(request)
    logging.error(request.body)
    try:
        token_id = request.META['HTTP_AUTHORIZATION']
        user_id = validate_token(token_id)
        logging.error(user_id)
    except Exception as exp:
        logging.error(exp)
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
    if user_id is not None:
        try:
            album_instance = Album.objects.get(id=int(album_id))
        except Exception as exp:
            logging.error(exp)
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
        if album_instance.user_id != user_id:
            logging.error('Meri album nahi hai!!')
            return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
        existing_image_ids = [image.id for image in album_instance.images.all()]
        logging.error('existing images')
        logging.error(existing_image_ids)
        if 'add' in json.loads(request.body):
            logging.error('Add karna hai!!')
            image_ids = json.loads(request.body)['add']['image_ids']
            image_to_be_added = []
            for id in image_ids:
                if id in existing_image_ids:
                    logging.error('pehle se hi hai')
                    return HttpResponse(status=status.HTTP_403_FORBIDDEN)
                image = Image.objects.get(id=id)
                if image.user_id != user_id:
                    logging.error('Mujhe persmission nahi hai, ye image meri nahi hai')
                    return HttpResponse(status=status.HTTP_404_NOT_FOUND)
                image_to_be_added.append(image)
            for image in image_to_be_added:
                album_instance.images.add(image)
            album_instance.save()
            logging.error('kar diya add')
            return HttpResponse(status=status.HTTP_204_NO_CONTENT)
        if 'remove' in json.loads(request.body):
            logging.error('remove karna hai')
            image_ids = json.loads(request.body)['remove']['image_ids']
            logging.error('ye index remve karne hai')
            logging.error(image_ids)
            image_to_be_removed = []
            for id in image_ids:
                if id not in existing_image_ids:
                    logging.error('pehle se nahi hai mere paas kya hataun')
                    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
                image = Image.objects.get(id=id)
                image_to_be_removed.append(image)
            existing_images = Album.images.all()
            images = [image for image in existing_images if image not in image_to_be_removed]
            album_instance.images.clear()
            for image in images:
                album_instance.images.add(image)
            album_instance.save()
            return HttpResponse(status=status.HTTP_204_NO_CONTENT)

    return HttpResponse(status=status.HTTP_200_OK)
