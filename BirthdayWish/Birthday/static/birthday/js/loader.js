/**
 * Magical loading screen with progress + particle canvas.
 */
(function () {
  'use strict';

  function runLoader() {
    const loader = document.getElementById('loader');
    const fill = document.getElementById('loader-fill');
    const percent = document.getElementById('loader-percent');
    const bar = document.getElementById('loader-bar');
    const canvas = document.getElementById('loader-particles');
    if (!loader || !fill) return Promise.resolve();

    const ctx = canvas ? canvas.getContext('2d') : null;
    const particles = [];
    let raf = 0;
    let progress = 0;

    function resize() {
      if (!canvas || !ctx) return;
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function spawn() {
      if (!canvas) return;
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 2.2 + 0.4,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          a: Math.random() * 0.7 + 0.2,
          c: Math.random() > 0.5 ? '#F472B6' : '#A855F7',
        });
      }
    }

    function draw() {
      if (!ctx || WishUtils.prefersReducedMotion()) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    resize();
    spawn();
    if (!WishUtils.prefersReducedMotion()) raf = requestAnimationFrame(draw);
    window.addEventListener('resize', WishUtils.debounce(resize, 150));

    return new Promise((resolve) => {
      const start = performance.now();
      const duration = WishUtils.prefersReducedMotion() ? 400 : 2400;

      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        // Ease out cubic with slight overshoot feel near end
        progress = 1 - Math.pow(1 - t, 3);
        const display = Math.floor(progress * 100);
        fill.style.width = `${display}%`;
        percent.textContent = `${display}%`;
        bar.setAttribute('aria-valuenow', String(display));

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(raf);
          loader.classList.add('is-done');
          document.body.classList.add('is-loaded');
          document.dispatchEvent(new CustomEvent('loader:done'));
          setTimeout(resolve, 700);
        }
      }
      requestAnimationFrame(tick);
    });
  }

  window.BirthdayLoader = { run: runLoader };
})();
