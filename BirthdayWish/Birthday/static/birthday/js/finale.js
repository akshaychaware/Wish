/**
 * Final surprise — aurora transform, fireworks, heart rain, balloons.
 */
(function () {
  'use strict';

  function initFinale(audio) {
    const trigger = document.getElementById('finale-trigger');
    const message = document.getElementById('finale-message');
    const section = document.getElementById('finale');
    const canvas = document.getElementById('finale-canvas');
    if (!trigger || !canvas) return;

    const ctx = canvas.getContext('2d');
    let running = false;
    let hearts = [];
    let balloons = [];
    let fireworks = [];

    function resize() {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    resize();
    window.addEventListener('resize', WishUtils.debounce(resize, 150));

    function spawnFirework() {
      const x = WishUtils.rand(window.innerWidth * 0.15, window.innerWidth * 0.85);
      const y = WishUtils.rand(window.innerHeight * 0.15, window.innerHeight * 0.45);
      const parts = [];
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        parts.push({
          x,
          y,
          vx: Math.cos(a) * WishUtils.rand(1.5, 4),
          vy: Math.sin(a) * WishUtils.rand(1.5, 4),
          life: 1,
          color: ['#EC4899', '#A855F7', '#FBBF24', '#F472B6'][i % 4],
        });
      }
      fireworks.push(...parts);
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (Math.random() > 0.96) spawnFirework();

      fireworks.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.life -= 0.012;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
      fireworks = fireworks.filter((p) => p.life > 0);
      ctx.globalAlpha = 1;

      hearts.forEach((h) => {
        h.y += h.vy;
        h.x += Math.sin(h.y / 30) * 0.6;
        ctx.fillStyle = `rgba(236,72,153,${h.a})`;
        ctx.font = `${h.s}px serif`;
        ctx.fillText('♥', h.x, h.y);
        if (h.y > window.innerHeight + 20) {
          h.y = -20;
          h.x = Math.random() * window.innerWidth;
        }
      });

      balloons.forEach((b) => {
        b.y += b.vy;
        b.x += Math.sin(performance.now() / 800 + b.ph) * 0.4;
        ctx.beginPath();
        ctx.fillStyle = b.color;
        ctx.ellipse(b.x, b.y, 12, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + 16);
        ctx.lineTo(b.x, b.y + 40);
        ctx.stroke();
        if (b.y < -40) {
          b.y = window.innerHeight + 40;
          b.x = Math.random() * window.innerWidth;
        }
      });

      requestAnimationFrame(frame);
    }

    trigger.addEventListener('click', () => {
      if (running) return;
      running = true;
      document.body.classList.add('finale-active');
      section?.classList.add('is-magical');
      if (message) message.hidden = false;
      trigger.hidden = true;

      document.dispatchEvent(new CustomEvent('finale:start'));

      for (let i = 0; i < 40; i++) {
        hearts.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vy: WishUtils.rand(0.8, 2.2),
          s: WishUtils.rand(12, 28),
          a: WishUtils.rand(0.35, 0.85),
        });
      }
      for (let i = 0; i < 14; i++) {
        balloons.push({
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + Math.random() * 200,
          vy: -WishUtils.rand(0.6, 1.4),
          ph: Math.random() * Math.PI * 2,
          color: `hsl(${WishUtils.rand(280, 340)}, 75%, 65%)`,
        });
      }

      if (typeof confetti === 'function') {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      }

      if (audio) {
        audio.trackIndex = 0;
        audio.play();
      }

      WishUtils.showToast('Happy Birthday Vishhuukhhaa ❤️', 4000);
      requestAnimationFrame(frame);
    });
  }

  window.BirthdayFinale = { init: initFinale };
})();
