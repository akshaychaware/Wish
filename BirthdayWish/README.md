# Birthday Wish — Magical Surprise Website

A premium, cinematic birthday surprise experience built with Django.

## Setup

```bash
pyenv activate birthday
cd BirthdayWish
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Open http://127.0.0.1:8000/

## Environment

Uses the `birthday` pyenv virtualenv. Secret key and debug flags can be overridden:

```bash
export DJANGO_SECRET_KEY='your-secure-key'
export DJANGO_DEBUG=False
export DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

## Structure

- `Birthday/` — app with views, templates, and static assets
- `Birthday/static/birthday/css/` — modular stylesheets
- `Birthday/static/birthday/js/` — modular ES6 modules (IIFE)
- CDN: GSAP, ScrollTrigger, Lenis, canvas-confetti

## Accessibility

Respects `prefers-reduced-motion`, includes skip link, focus states, and ARIA labels.
