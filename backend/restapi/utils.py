from django.core.exceptions import ValidationError
import boto3
import requests
from .models import TokenStat
import logging


s3 = boto3.resource('s3', aws_access_key_id='AKIAYESYDY5VLEYZMTWQ',
                    aws_secret_access_key='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',
                    region_name='us-east-1')
s3_client = boto3.client('s3', aws_access_key_id='AKIAYESYDY5VLEYZMTWQ',
                         aws_secret_access_key='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',
                         region_name='us-east-1')


def upload_file(internet_image_url, bucket_name_to_upload_image_to, s3_image_filename):
    logging.error('Upload file is called with: image url: '+ internet_image_url)
    logging.error("Bucket name : " + bucket_name_to_upload_image_to)
    logging.error('boto resource is created!')
    req_for_image = requests.get(internet_image_url, stream=True)
    file_object_from_req = req_for_image.raw
    req_data = file_object_from_req.read()
    try:
        s3.Bucket(bucket_name_to_upload_image_to).put_object(Key=s3_image_filename, Body=req_data)
        # uri = s3_client.generate_presigned_url('get_object',
        #                                        Params={'Bucket': bucket_name_to_upload_image_to, 'Key': s3_image_filename},
        #                                        ExpiresIn=604800000)
        uri = "s3://{}/{}".format(bucket_name_to_upload_image_to, s3_image_filename)
        return uri
    except Exception as exp:
        logging.error(exp)
        return ""


def validate_token(token_id):
    token_id = token_id.split(' ')[-1]
    token_stat = TokenStat.objects.get(token_id=str(token_id))
    if token_stat is not None:
        if token_stat.status is True:
            return token_stat.user_id
        else:
            return None
    return None


def validate_url(url):
    logging.error('inside validate_url ' + url)
    image_formats = ("image/png", "image/jpeg", "image/jpg")
    r = requests.head(url)
    if r.headers["content-type"] in image_formats:
        logging.error("meine to validate kar diya!!")
        return True
    return False


# TODO: Download only when the full request is validated and is ready to get saved
def get_download_url(image_url: str, image_name: str) -> str:
    # bucket_name = 'tu-zaid-photos-assignment'
    bucket_name = 'tu-cj-photos-assignment'
    if validate_url(image_url):
        return image_url
        uri = upload_file(internet_image_url=image_url, bucket_name_to_upload_image_to=bucket_name,
                       s3_image_filename=image_name)
        return uri
    return ""



