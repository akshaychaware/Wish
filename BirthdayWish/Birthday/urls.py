"""Birthday app URL routes."""

from django.urls import path
from . import views

app_name = 'birthday'

urlpatterns = [
    path('', views.home, name='home'),
    path('manifest.webmanifest', views.manifest, name='manifest'),
]
