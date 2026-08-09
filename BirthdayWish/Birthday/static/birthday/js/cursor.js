/**
 * Custom heart cursor + glowing trail.
 */
(function () {
  'use strict';

  function initCursor() {
    if (WishUtils.isTouchDevice() || WishUtils.prefersReducedMotion()) {
      document.body.classList.add('touch-device');
      return;
    }

    const cursor = document.getElementById('cursor');
    const canvas = document.getElementById('cursor-trail');
    if (!cursor || !canvas) return;

    const ctx = canvas.getContext('2d');
    const trail = [];
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;

    function resize() {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    resize();
    window.addEventListener('resize', WishUtils.debounce(resize, 150));

    window.addEventListener(
      'pointermove',
      WishUtils.throttle((e) => {
        mx = e.clientX;
        my = e.clientY;
        trail.push({ x: mx, y: my, life: 1 });
        if (trail.length > 28) trail.shift();
      }, 16)
    );

    document.addEventListener('pointerover', (e) => {
      const interactive = e.target.closest('a, button, .reason-card, .polaroid, .card__inner, .gift-box, .candle, input');
      document.body.classList.toggle('is-hovering', Boolean(interactive));
    });

    function loop() {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        p.life *= 0.92;
        const r = 3 + (1 - p.life) * 4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(244, 114, 182, ${p.life * 0.55})`;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      while (trail.length && trail[0].life < 0.05) trail.shift();

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  window.BirthdayCursor = { init: initCursor };
})();
