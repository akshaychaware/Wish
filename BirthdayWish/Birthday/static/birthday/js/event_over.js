/**
 * Event Over page — soft particles + floating hearts/stars.
 * No links into the birthday experience; decorative motion only.
 */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initFloaters() {
    const root = document.getElementById('eo-floaters');
    if (!root || reduceMotion) return;

    const glyphs = ['♥', '✦', '✧', '♡', '⋆', '✦'];
    const count = window.innerWidth < 640 ? 10 : 16;

    for (let i = 0; i < count; i += 1) {
      const el = document.createElement('span');
      el.className = 'eo-floater';
      el.textContent = glyphs[i % glyphs.length];
      el.style.left = `${Math.random() * 100}%`;
      el.style.bottom = `${-8 - Math.random() * 20}%`;
      el.style.setProperty('--eo-dur', `${12 + Math.random() * 10}s`);
      el.style.setProperty('--eo-delay', `${Math.random() * 10}s`);
      el.style.fontSize = `${0.65 + Math.random() * 0.7}rem`;
      root.appendChild(el);
    }
  }

  function initParticles() {
    const canvas = document.getElementById('eo-particles');
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    }

    function spawn() {
      const count = width < 640 ? 36 : 55;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.8,
        a: 0.15 + Math.random() * 0.45,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.12 - Math.random() * 0.28,
        pulse: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.5 ? 320 : 270,
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const glow = p.a * (0.65 + 0.35 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 72%, ${glow})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, ${glow * 0.8})`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      raf = window.requestAnimationFrame(frame);
    }

    resize();
    frame();

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        window.cancelAnimationFrame(raf);
      } else {
        raf = window.requestAnimationFrame(frame);
      }
    });
  }

  // Prevent scroll / accidental navigation into leftover history entries of the old site UX.
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  window.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );
  window.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );

  initFloaters();
  initParticles();
})();
