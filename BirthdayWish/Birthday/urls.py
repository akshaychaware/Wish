"""Birthday app URL routes."""

from django.conf import settings
from django.urls import path, re_path
from . import views

app_name = 'birthday'

urlpatterns = [
    path('', views.home, name='home'),
    path('manifest.webmanifest', views.manifest, name='manifest'),
]

# While the event is over, any leftover/deep path still shows only the blocker.
if settings.EVENT_OVER:
    urlpatterns += [
        re_path(r'^(?P<unused_path>.+)/$', views.event_over, name='event_over_trailing'),
        re_path(r'^(?P<unused_path>.+)$', views.event_over, name='event_over'),
    ]
