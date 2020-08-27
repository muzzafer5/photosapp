# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse, JsonResponse
from django.utils.datetime_safe import datetime
from rest_framework import status
from rest_framework.decorators import api_view
# from django.shortcuts import render
# import boto3
# kinesis = boto3.client('kinesis', aws_access_key_id='AKIARGSIOJPSYNP7DIJB',
#                        aws_secret_access_key='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', region_name='us-east-1')


@api_view(['GET'])
def api_overview(request):
    return JsonResponse("Kuch diya!!", safe=False, status=status.HTTP_200_OK)


def index(request):
    return HttpResponse("Hello, world. You're at Rest.")


def error_500(request):
    payload = {'message': "Intenal server error, request:{}".format(str(request)),
            'timestamp': str(datetime.now),
            'status_code': "500"}
    # data = "Intenal server error, request:{}".format(str(request))

    # resp = kinesis.put_record(StreamName="Zaid_first_stream", Data=json.dumps(payload), PartitionKey="django_500_errors")
    # logging.error(resp)
    print("isme to aaya")
    return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
