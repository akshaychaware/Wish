/**
 * Original stylized fantasy creatures — SVG, idle + cursor follow + celebrate.
 * No copyrighted characters.
 */
(function () {
  'use strict';

  const SVGS = {
    panda: `<svg viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="38" rx="18" ry="16" fill="#f8f7ff"/>
      <circle cx="20" cy="18" r="8" fill="#1f2937"/><circle cx="44" cy="18" r="8" fill="#1f2937"/>
      <circle cx="32" cy="30" r="14" fill="#f8f7ff"/>
      <ellipse cx="26" cy="30" rx="4" ry="5" fill="#1f2937"/><ellipse cx="38" cy="30" rx="4" ry="5" fill="#1f2937"/>
      <circle cx="26" cy="30" r="1.5" fill="#fff"/><circle cx="38" cy="30" r="1.5" fill="#fff"/>
      <ellipse cx="32" cy="36" rx="3" ry="2" fill="#1f2937"/>
      <path d="M28 40 Q32 44 36 40" stroke="#ec4899" stroke-width="1.5" fill="none"/>
    </svg>`,
    fox: `<svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 28 L22 10 L28 24 Z" fill="#fb923c"/><path d="M52 28 L42 10 L36 24 Z" fill="#fb923c"/>
      <ellipse cx="32" cy="36" rx="16" ry="14" fill="#fb923c"/>
      <ellipse cx="32" cy="40" rx="10" ry="8" fill="#ffedd5"/>
      <circle cx="26" cy="34" r="2.5" fill="#1f2937"/><circle cx="38" cy="34" r="2.5" fill="#1f2937"/>
      <path d="M30 38 L32 40 L34 38" fill="#1f2937"/>
      <path d="M48 40 Q58 30 54 48 Q46 46 48 40" fill="#fb923c"/>
    </svg>`,
    dragon: `<svg viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="36" rx="14" ry="12" fill="#34d399"/>
      <circle cx="32" cy="22" r="10" fill="#6ee7b7"/>
      <path d="M22 16 L18 6 L26 14" fill="#a7f3d0"/><path d="M42 16 L46 6 L38 14" fill="#a7f3d0"/>
      <circle cx="28" cy="22" r="2" fill="#1f2937"/><circle cx="36" cy="22" r="2" fill="#1f2937"/>
      <path d="M44 34 Q58 28 52 44 Q44 40 44 34" fill="#34d399"/>
      <path d="M28 28 Q32 32 36 28" stroke="#059669" fill="none"/>
      <circle cx="24" cy="18" r="2" fill="#f472b6"/>
    </svg>`,
    bunny: `<svg viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="24" cy="14" rx="5" ry="14" fill="#fce7f3" transform="rotate(-10 24 14)"/>
      <ellipse cx="40" cy="14" rx="5" ry="14" fill="#fce7f3" transform="rotate(10 40 14)"/>
      <ellipse cx="32" cy="38" rx="15" ry="14" fill="#fdf2f8"/>
      <circle cx="32" cy="28" r="12" fill="#fdf2f8"/>
      <circle cx="27" cy="28" r="2" fill="#1f2937"/><circle cx="37" cy="28" r="2" fill="#1f2937"/>
      <ellipse cx="32" cy="33" rx="2" ry="1.5" fill="#f9a8d4"/>
      <path d="M28 36 Q32 39 36 36" stroke="#ec4899" fill="none"/>
    </svg>`,
    wizard: `<svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 4 L48 28 L16 28 Z" fill="#7c3aed"/>
      <circle cx="40" cy="12" r="3" fill="#fbbf24"/>
      <circle cx="32" cy="34" r="10" fill="#fde68a"/>
      <ellipse cx="32" cy="50" rx="12" ry="10" fill="#4c1d95"/>
      <circle cx="28" cy="34" r="1.8" fill="#1f2937"/><circle cx="36" cy="34" r="1.8" fill="#1f2937"/>
      <path d="M26 38 Q32 42 38 38" stroke="#92400e" fill="none"/>
      <rect x="46" y="30" width="3" height="24" fill="#a855f7" rx="1"/>
      <circle cx="47.5" cy="28" r="4" fill="#f472b6"/>
    </svg>`,
    electric: `<svg viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="34" rx="14" ry="16" fill="#fde047"/>
      <path d="M34 8 L28 28 L36 28 L30 48 L44 24 L34 24 Z" fill="#facc15" opacity="0.9"/>
      <circle cx="26" cy="30" r="2.5" fill="#1f2937"/><circle cx="38" cy="30" r="2.5" fill="#1f2937"/>
      <path d="M27 38 Q32 42 37 38" stroke="#a16207" fill="none"/>
      <path d="M18 20 L14 14" stroke="#fef08a" stroke-width="2"/>
      <path d="M46 20 L50 12" stroke="#fef08a" stroke-width="2"/>
    </svg>`,
    fire: `<svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 8 C28 20 18 24 18 36 C18 48 48 48 48 36 C48 24 38 18 32 8 Z" fill="#fb923c"/>
      <path d="M32 18 C30 26 24 28 24 36 C24 44 42 44 42 36 C42 28 36 26 32 18 Z" fill="#fde047"/>
      <circle cx="28" cy="34" r="2" fill="#1f2937"/><circle cx="36" cy="34" r="2" fill="#1f2937"/>
      <ellipse cx="32" cy="40" rx="3" ry="2" fill="#ea580c"/>
    </svg>`,
    water: `<svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 10 C20 28 14 34 14 42 C14 52 50 52 50 42 C50 34 44 28 32 10 Z" fill="#38bdf8"/>
      <ellipse cx="32" cy="40" rx="10" ry="8" fill="#7dd3fc"/>
      <circle cx="27" cy="36" r="2.2" fill="#0c4a6e"/><circle cx="37" cy="36" r="2.2" fill="#0c4a6e"/>
      <path d="M28 42 Q32 45 36 42" stroke="#0369a1" fill="none"/>
      <circle cx="24" cy="28" r="2" fill="#e0f2fe" opacity="0.8"/>
    </svg>`,
  };

  const NAMES = Object.keys(SVGS);

  function createCreature(type, stage) {
    const el = document.createElement('div');
    el.className = `creature creature--${type}`;
    el.dataset.type = type;
    el.innerHTML = SVGS[type];
    el.style.left = '0';
    el.style.top = '0';
    stage.appendChild(el);

    const state = {
      el,
      x: WishUtils.rand(40, window.innerWidth - 40),
      y: WishUtils.rand(80, window.innerHeight - 80),
      vx: WishUtils.rand(-0.35, 0.35),
      vy: WishUtils.rand(-0.25, 0.25),
      phase: Math.random() * Math.PI * 2,
      blink: 0,
      follow: type === 'bunny' || type === 'fox',
      mode: 'idle',
    };
    return state;
  }

  function initCreatures() {
    const stage = document.getElementById('creature-stage');
    if (!stage || WishUtils.prefersReducedMotion()) return;

    const count = WishUtils.isTouchDevice() ? 4 : 7;
    const creatures = [];
    const pick = [...NAMES].sort(() => Math.random() - 0.5).slice(0, count);
    pick.forEach((name) => creatures.push(createCreature(name, stage)));

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    window.addEventListener(
      'pointermove',
      WishUtils.throttle((e) => {
        mx = e.clientX;
        my = e.clientY;
      }, 32)
    );

    document.addEventListener('cake:celebrate', () => {
      creatures.forEach((c) => {
        c.mode = 'celebrate';
        setTimeout(() => {
          c.mode = 'idle';
        }, 4000);
      });
    });

    document.addEventListener('finale:start', () => {
      creatures.forEach((c, i) => {
        c.mode = 'gather';
        c.targetX = window.innerWidth * 0.5 + Math.cos((i / creatures.length) * Math.PI * 2) * 120;
        c.targetY = window.innerHeight * 0.55 + Math.sin((i / creatures.length) * Math.PI * 2) * 40;
      });
    });

    function tick() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      creatures.forEach((c) => {
        c.phase += 0.02;

        if (c.mode === 'gather' && c.targetX != null) {
          c.x += (c.targetX - c.x) * 0.04;
          c.y += (c.targetY - c.y) * 0.04;
        } else if (c.follow) {
          const dx = mx - c.x;
          const dy = my - c.y;
          c.x += dx * 0.012;
          c.y += dy * 0.012;
        } else if (c.mode === 'celebrate') {
          c.x += Math.sin(c.phase * 3) * 1.2;
          c.y += Math.cos(c.phase * 2) * 1.2 - 0.3;
        } else {
          c.x += c.vx + Math.sin(c.phase) * 0.15;
          c.y += c.vy + Math.cos(c.phase * 0.8) * 0.1;
          if (c.x < 20 || c.x > w - 20) c.vx *= -1;
          if (c.y < 60 || c.y > h - 40) c.vy *= -1;
        }

        const bob = Math.sin(c.phase) * 6;
        const scale = c.mode === 'celebrate' ? 1.15 + Math.sin(c.phase * 4) * 0.08 : 1;
        const wave = c.mode === 'gather' ? Math.sin(c.phase * 3) * 8 : 0;
        c.el.style.transform = `translate(${c.x}px, ${c.y + bob}px) scale(${scale}) rotate(${wave}deg)`;

        // Blink eyes occasionally via opacity on SVG circles — lightweight
        c.blink++;
        if (c.blink % 180 === 0) {
          c.el.style.filter = 'brightness(1.2) drop-shadow(0 0 14px rgba(236,72,153,0.5))';
          setTimeout(() => {
            c.el.style.filter = '';
          }, 180);
        }
      });

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  window.BirthdayCreatures = { init: initCreatures };
})();
