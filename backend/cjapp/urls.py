"""cjapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
# from restapi.views import *
# from restapi.rest_views import *;
from django.conf.urls import include
from restapi.auth_views import *
from restapi.tag_views import *
from restapi.image_views import *
from restapi.album_views import *
handler500 = 'restapi.views.error_500'

urlpatterns = [
    url(r'^api-auth/', include('rest_framework.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/accounts/signup/', sign_up),
    url(r'^api/v1/accounts/login/', login),
    url(r'^api/v1/accounts/logout/', logout),
    # url(r'', index),
    url(r'^api/v1/tags/(?P<tag_id>\d+)/$', tag, name='tag_id'),
    url(r'^api/v1/tags/', tags),
    url(r'^api/v1/images/(?P<image_id>\d+)/$', image_crud, name='image_id'),
    url(r'^api/v1/images/(?P<image_id>\d+)/share/$', image_share, name='image_id'),
    url(r'^api/v1/images/(?P<image_id>\d+)/identical/$', identical_image, name='image_id'),
    url(r'^api/v1/images/private/', get_private_images),
    url(r'^api/v1/images/shared/', get_shared_images),
    url(r'^api/v1/images/', create_image),
    url(r'^api/v1/albums/(?P<album_id>\d+)/share/$', album_share, name='album_id'),
    url(r'^api/v1/albums/(?P<album_id>\d+)/images/$', put_image_in_album, name='album_id'),
    url(r'^api/v1/albums/(?P<album_id>\d+)/$', album_crud, name='album_id'),
    url(r'^api/v1/albums/', album),
]


