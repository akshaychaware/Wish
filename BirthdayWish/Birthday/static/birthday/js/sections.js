/**
 * Section behaviors — typing hero, wish cards, wishes carousel.
 */
(function () {
  'use strict';

  const HERO_LINES = [
    'You walked into my life and somehow made every ordinary day feel magical.',
    'Today is your day...',
    'So sit back...',
    'Smile...',
    'Because this little universe was created just for you.',
  ];

  const REPLY_TOASTS = {
    mast: 'मस्त! That’s my cuttie ✨ magic loading for you…',
    khush: 'खूप खुश — looks so pretty on you 💖',
    best: 'Best mood unlocked 🌙 this universe is all yours…',
  };

  function startHeroTyping() {
    const el = document.getElementById('typed-text');
    if (!el) return;
    const full = HERO_LINES.join('\n\n');
    if (WishUtils.prefersReducedMotion()) {
      el.textContent = full;
      return;
    }
    let i = 0;
    function tick() {
      i++;
      el.textContent = full.slice(0, i);
      if (i < full.length) {
        const ch = full[i - 1];
        const delay = ch === '\n' ? 280 : WishUtils.rand(18, 42);
        setTimeout(tick, delay);
      }
    }
    setTimeout(tick, 350);
  }

  function heroCheckin() {
    const checkin = document.getElementById('hero-checkin');
    const message = document.getElementById('hero-message');
    const actions = document.getElementById('hero-actions');
    if (!checkin) {
      startHeroTyping();
      return;
    }

    const replies = checkin.querySelectorAll('.hero__reply');
    replies.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (checkin.classList.contains('is-done')) return;
        checkin.classList.add('is-done');
        replies.forEach((b) => {
          b.disabled = true;
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });

        const key = btn.dataset.reply || 'mast';
        WishUtils.showToast(REPLY_TOASTS[key] || REPLY_TOASTS.mast, 3200);

        if (message) message.hidden = false;
        if (actions) actions.hidden = false;
        startHeroTyping();
      });
    });
  }

  function wishCards() {
    document.querySelectorAll('.wish-card').forEach((card) => {
      card.addEventListener('pointerenter', () => {
        if (!WishUtils.prefersReducedMotion()) {
          card.style.transform = 'translateY(-8px) scale(1.02) rotate(' + (Math.random() > 0.5 ? 1 : -1) + 'deg)';
        }
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  function wishes() {
    const wishes = WishUtils.parseJSONScript('wishes-json', []);
    const text = document.getElementById('wish-text');
    const indexEl = document.getElementById('wish-index');
    if (!text || !wishes.length) return;

    let index = 0;
    let auto = null;

    function show(i) {
      index = (i + wishes.length) % wishes.length;
      text.classList.add('is-leaving');
      setTimeout(() => {
        text.textContent = wishes[index];
        text.classList.remove('is-leaving');
        if (indexEl) indexEl.textContent = String(index + 1);
      }, 280);
    }

    document.getElementById('wish-next')?.addEventListener('click', () => {
      show(index + 1);
      resetAuto();
    });
    document.getElementById('wish-prev')?.addEventListener('click', () => {
      show(index - 1);
      resetAuto();
    });

    function resetAuto() {
      clearInterval(auto);
      if (!WishUtils.prefersReducedMotion()) {
        auto = setInterval(() => show(index + 1), 4500);
      }
    }
    resetAuto();
  }

  function initSections() {
    heroCheckin();
    wishCards();
    wishes();
  }

  window.BirthdaySections = { init: initSections };
})();
