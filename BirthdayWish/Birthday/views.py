"""Views for the Magical Birthday Surprise experience."""

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET


WISHES = [
    "Happy Birthday to the prettiest smile I've ever known ❤️",
    "I hope your dreams chase you as fast as I would.",
    "If hugs could travel through screens, you'd already have thousands.",
    "You deserve every sparkle this universe can offer.",
    "I secretly asked the stars to make today unforgettable.",
    "I hope today is as beautiful as your smile.",
    "You make ordinary moments unforgettable.",
    "Warning: This website contains dangerously high levels of cuteness.",
]

BIRTHDAY_CARDS = [
    {
        "badge": "For Vishuu",
        "title": "Happy Birthday Vishuu...",
        "text": "Being around you makes everything better. You have a way of making people feel safe and heard.",
        "mood": "flirty",
    },
    {
        "badge": "Flirty",
        "title": "Hey birthday star",
        "text": "If charm were illegal, you'd still be out here committing felonies with that smile.",
        "mood": "flirty",
    },
    {
        "badge": "Soft",
        "title": "Happy Birthday Vishuu...",
        "text": "I'd steal the moon for you… but you'd probably look prettier next to it anyway.",
        "mood": "romantic",
    },
    {
        "badge": "Cute",
        "title": "Officially immeasurable",
        "text": "How much you mean can't be counted — not in stars, not in hearts, not even in 100000%.",
        "mood": "cute",
    },
    {
        "badge": "Playful",
        "title": "Happy Birthday Vishuu...",
        "text": "Warning: standing this close to your vibe may cause butterflies, daydreams, and bad poetry.",
        "mood": "funny",
    },
    {
        "badge": "Dreamy",
        "title": "To my favorite plot twist",
        "text": "Happy Birthday Vishuu… the universe clearly saved its best chapter for today.",
        "mood": "magical",
    },
    {
        "badge": "Sweet",
        "title": "Happy Birthday Vishuu...",
        "text": "Come closer — I saved you a wish, a sparkle, and a dangerously soft compliment.",
        "mood": "flirty",
    },
    {
        "badge": "Forever",
        "title": "Happy Birthday Vishhuukhhaa",
        "text": "May every candle you blow out bring you closer to everything your heart secretly hopes for.",
        "mood": "romantic",
    },
]

REASONS = [
    {"title": "Your Smile", "text": "It could power a small galaxy. Scientists are baffled. I'm just lucky.", "mood": "cute"},
    {"title": "Your Laugh", "text": "It's my favorite playlist. No skip button. Infinite loop.", "mood": "funny"},
    {"title": "Your Heart", "text": "Softer than moonlight. Stronger than any storm.", "mood": "romantic"},
    {"title": "Your Chaos", "text": "Beautifully unpredictable. Like fireworks that somehow always land on love.", "mood": "flirty"},
    {"title": "Your Brain", "text": "Scary smart. Adorably you. A combination that shouldn't be legal.", "mood": "funny"},
    {"title": "Your Presence", "text": "Ordinary rooms become magical the second you walk in.", "mood": "magical"},
    {"title": "Your Kindness", "text": "The rare kind that makes the world feel safer.", "mood": "cute"},
    {"title": "Your Eyes", "text": "I keep getting lost in them. No GPS. No complaints.", "mood": "flirty"},
]

TIMELINE = [
    {"era": "Chapter I", "title": "The Spark", "text": "One ordinary day… and suddenly nothing felt ordinary anymore."},
    {"era": "Chapter II", "title": "The Butterflies", "text": "They never left. They just learned to dance to your name."},
    {"era": "Chapter III", "title": "The Late-Night Talks", "text": "Stars overheard. Clouds blushed. Time politely waited."},
    {"era": "Chapter IV", "title": "The Little Things", "text": "Shared jokes. Soft glances. A universe built from tiny moments."},
    {"era": "Chapter V", "title": "Today", "text": "A whole magical website… because you deserve a whole magical world."},
]

GALLERY = [
    {"caption": "Soft moonlight & softer hearts", "tone": "violet", "src": "birthday/img/photo1.jpg"},
    {"caption": "A moment that still sparkles", "tone": "pink", "src": "birthday/img/photo2.jpg"},
    {"caption": "Laughter suspended in time", "tone": "magenta", "src": "birthday/img/photo3.jpg"},
    {"caption": "Dreamy & dangerously cute", "tone": "purple", "src": "birthday/img/photo4.jpg"},
    {"caption": "Proof that magic is real", "tone": "rose", "src": "birthday/img/photo5.jpg"},
    {"caption": "Our little fairytale frame", "tone": "indigo", "src": "birthday/img/photo6.jpg"},
]


@require_GET
def home(request):
    """Render the full birthday surprise experience."""
    context = {
        'wishes': WISHES,
        'birthday_cards': BIRTHDAY_CARDS,
        'reasons': REASONS,
        'timeline': TIMELINE,
        'gallery': GALLERY,
        'hero_lines': [
            "You walked into my life and somehow made every ordinary day feel magical.",
            "Today is your day...",
            "So sit back...",
            "Smile...",
            "Because this little universe was created just for you.",
        ],
    }
    return render(request, 'birthday/index.html', context)


@require_GET
def manifest(request):
    """PWA web app manifest."""
    return JsonResponse(
        {
            "name": "Birthday Surprise — A Magical Universe",
            "short_name": "Birthday Magic",
            "description": "An immersive, dreamy birthday surprise experience.",
            "start_url": "/",
            "display": "standalone",
            "background_color": "#0B1026",
            "theme_color": "#7C3AED",
            "lang": "en",
            "icons": [
                {
                    "src": "/static/birthday/icons/favicon.svg",
                    "sizes": "any",
                    "type": "image/svg+xml",
                    "purpose": "any maskable",
                }
            ],
        },
        content_type='application/manifest+json',
    )
