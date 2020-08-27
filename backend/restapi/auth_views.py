from django.http import HttpResponse
import uuid
from django.views.decorators.http import require_http_methods
from rest_framework.request import Request
import logging
from rest_framework import status
from .models import TokenStat
from .serializers import UserSerializer
import json
from django.contrib.auth.models import User


@require_http_methods(['POST'])
def sign_up(request: Request) -> HttpResponse:
    try:
        logging.error(str(request) + ' is the request')
        user_serializer = UserSerializer(data=json.loads(request.body))
        if not user_serializer.is_valid_for_insertion():
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
    except Exception as ex:
        # TODO: Since business error validations are already taken care of by serializers any other exceptions is on the
        #  server sides and client has no role to play in it.  i think it should be 500
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
    try:
        user_serializer.save()
        return HttpResponse(json.dumps({'id': user_serializer.instance.id,
                                        'username': user_serializer.instance.username}), status=status.HTTP_201_CREATED)
    except Exception as exp:
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@require_http_methods(['POST'])
def login(request: Request) -> HttpResponse:
    try:
        logging.error(str(request) + ' is the request')
        user_serializer = UserSerializer(data=json.loads(request.body))
        if not user_serializer.is_valid_for_retrieval():
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
    except Exception as ex:
        logging.error(ex)
        # TODO: Since business error validations are already taken care of by serializers any other exceptions is on the
        #  server sides and client has no role to play in it.  i think it should be 500
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
    user_ground_truth = User.objects.get(username=user_serializer.data['username'])
    if user_serializer.data['password'] == user_ground_truth.password:
        token_id = str(uuid.uuid4())
        user_id = user_ground_truth.id
        status_of_token = True
        token = TokenStat(token_id=token_id, user_id=user_id, status=status_of_token)
        token.save()
        return HttpResponse(json.dumps({"token": token_id}), status=status.HTTP_200_OK)
    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)


@require_http_methods(['POST'])
def logout(request: Request) -> HttpResponse:
    print(request.META['HTTP_AUTHORIZATION'])
    token_id = request.META['HTTP_AUTHORIZATION'].split(' ')[-1]
    print("token_id" + token_id)
    token_stat = TokenStat.objects.get(token_id=str(token_id))
    print(token_stat)
    logging.error('Request' + str(request))
    logging.error(str(token_id) + ' TOKEN ID')
    print(token_stat)
    try:
        if token_stat is not None:
            if token_stat.status is True:
                token_stat.status = False
                token_stat.save()
                return HttpResponse(status=status.HTTP_204_NO_CONTENT)
            else:
                return HttpResponse('Token expired!!')
    except Exception as exp:
        return HttpResponse('No such token!!', status=status.HTTP_204_NO_CONTENT)
    return HttpResponse('No such token!!', status=status.HTTP_204_NO_CONTENT)