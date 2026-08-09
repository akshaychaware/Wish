/**
 * Global interactions — ripples, magnetic buttons, click FX, navbar, easter eggs.
 */
(function () {
  'use strict';

  const SURPRISES = [
    "Psst… you're glowing today ✨",
    "A secret star just winked at you.",
    "Cuteness overload detected 💖",
    "The universe called. It said: happy birthday.",
    "You found a hidden sparkle. Keep it forever.",
    "Warning: smiling may become permanent.",
  ];

  const GIFT_MESSAGES = [
    "Inside this gift: infinite soft hugs.",
    "You unlocked: +100000% main character energy.",
    "Surprise! A pocket full of moonlight.",
  ];

  function initInteractions(audio) {
    // Ripple buttons
    document.querySelectorAll('[data-ripple]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Magnetic buttons (desktop)
    if (!WishUtils.isTouchDevice() && !WishUtils.prefersReducedMotion()) {
      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
        });
        el.addEventListener('pointerleave', () => {
          el.style.transform = '';
        });
      });
    }

    // Click sparkles / hearts
    document.addEventListener('click', (e) => {
      if (e.target.closest('.loader')) return;
      WishUtils.sparkAt(e.clientX, e.clientY, 10);
      if (Math.random() > 0.6) WishUtils.heartBurst(e.clientX, e.clientY);
      if (audio) audio.blip('spark');
    });

    // Navbar
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    toggle?.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu?.classList.toggle('is-open', !open);
    });

    menu?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle?.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener(
      'scroll',
      WishUtils.throttle(() => {
        navbar?.classList.toggle('is-scrolled', window.scrollY > 40);
        const sections = document.querySelectorAll('main section[id]');
        let current = 'home';
        sections.forEach((sec) => {
          if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
        });
        document.querySelectorAll('.navbar__link').forEach((a) => {
          a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`);
        });
      }, 100)
    );

    // Secret toast
    document.getElementById('surprise-toast-btn')?.addEventListener('click', () => {
      WishUtils.showToast(SURPRISES[Math.floor(Math.random() * SURPRISES.length)]);
      if (audio) audio.blip('heart');
    });

    // Triple-click easter egg on logo
    let brandClicks = 0;
    document.querySelector('.navbar__brand')?.addEventListener('click', (e) => {
      e.preventDefault();
      brandClicks++;
      if (brandClicks >= 3) {
        brandClicks = 0;
        WishUtils.showToast('Easter egg found: you are the main plot twist 💫');
        if (typeof confetti === 'function') {
          confetti({ particleCount: 80, spread: 90, origin: { y: 0.2 } });
        }
      }
      setTimeout(() => {
        brandClicks = 0;
      }, 1200);
    });

    // Gifts
    document.querySelectorAll('.gift-box').forEach((box) => {
      box.addEventListener('click', () => {
        box.classList.add('is-open');
        const idx = Number(box.dataset.gift || 1) - 1;
        const msg = GIFT_MESSAGES[idx] || GIFT_MESSAGES[0];
        const el = document.getElementById('gift-message');
        if (el) el.textContent = msg;
        WishUtils.heartBurst(
          box.getBoundingClientRect().left + 50,
          box.getBoundingClientRect().top + 40
        );
        if (audio) audio.blip('gift');
      });
    });

    // Reason cards keyboard flip
    document.querySelectorAll('.reason-card').forEach((card) => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('is-flipped');
        }
      });
      card.addEventListener('click', () => card.classList.toggle('is-flipped'));
    });

    // Scrapbook polaroid tilt + parallax
    const TILT_MAX_DEG = 10;
    const PARALLAX_PX = 14;
    const reduceMotion = WishUtils.prefersReducedMotion();

    document.querySelectorAll('.card__inner').forEach((inner) => {
      const photoBg = inner.querySelector('.card__photo-bg');
      if (!photoBg || reduceMotion) return;

      const onMove = (e) => {
        const rect = inner.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const ry = (px - 0.5) * TILT_MAX_DEG * 2;
        const rx = (0.5 - py) * TILT_MAX_DEG * 2;

        inner.style.setProperty('--rx', rx.toFixed(2) + 'deg');
        inner.style.setProperty('--ry', ry.toFixed(2) + 'deg');
        inner.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        inner.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        photoBg.style.setProperty('--px', ((px - 0.5) * -PARALLAX_PX).toFixed(1) + 'px');
        photoBg.style.setProperty('--py', ((py - 0.5) * -PARALLAX_PX).toFixed(1) + 'px');
      };

      const onEnter = () => inner.classList.add('is-hovering');
      const onLeave = () => {
        inner.classList.remove('is-hovering');
        inner.style.setProperty('--rx', '0deg');
        inner.style.setProperty('--ry', '0deg');
        photoBg.style.setProperty('--px', '0px');
        photoBg.style.setProperty('--py', '0px');
      };

      inner.addEventListener('pointermove', onMove);
      inner.addEventListener('pointerenter', onEnter);
      inner.addEventListener('pointerleave', onLeave);
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lbPhoto = document.getElementById('lightbox-photo');
    const lbCaption = document.getElementById('lightbox-caption');
    const gallery = WishUtils.parseJSONScript('gallery-json', []);

    document.querySelectorAll('.polaroid').forEach((pol) => {
      pol.addEventListener('click', () => {
        const i = Number(pol.dataset.index || 0);
        const item = gallery[i] || {};
        const photoEl = pol.querySelector('.polaroid__photo');
        if (lbPhoto && photoEl) {
          const bgImage = getComputedStyle(photoEl).backgroundImage;
          lbPhoto.style.background = bgImage && bgImage !== 'none'
            ? bgImage.split(',')[0].trim() + ' center/cover no-repeat'
            : getComputedStyle(photoEl).background;
        }
        if (lbCaption) lbCaption.textContent = item.caption || pol.querySelector('.polaroid__caption')?.textContent || '';
        if (lightbox) {
          lightbox.hidden = false;
          document.getElementById('lightbox-close')?.focus();
        }
      });
    });

    function closeLightbox() {
      if (lightbox) lightbox.hidden = true;
    }

    document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  window.BirthdayInteractions = { init: initInteractions };
})();
