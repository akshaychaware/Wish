"""Request gates for the Birthday app."""

from django.conf import settings
from django.shortcuts import render


class EventOverMiddleware:
    """
    When EVENT_OVER is True, serve only the Event Over page for public HTML routes.

    Static assets, admin, and the PWA manifest remain reachable so the blocker
    page can load its CSS/JS/icons without exposing the birthday experience.
    """

    ALLOWED_PREFIXES = (
        '/static/',
        '/admin/',
    )
    ALLOWED_EXACT = (
        '/manifest.webmanifest',
        '/favicon.ico',
    )

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if settings.EVENT_OVER and self._should_block(request.path):
            response = render(request, 'birthday/event_over.html')
            response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
            response['Pragma'] = 'no-cache'
            return response
        return self.get_response(request)

    def _should_block(self, path: str) -> bool:
        if path in self.ALLOWED_EXACT:
            return False
        return not any(path.startswith(prefix) for prefix in self.ALLOWED_PREFIXES)
