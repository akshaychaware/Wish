/**
 * Living background — stars, fireflies, hearts, sparks, magic circles.
 */
(function () {
  'use strict';

  function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    const cloudsHost = document.getElementById('bg-clouds');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let raf = 0;
    const reduced = WishUtils.prefersReducedMotion();

    const stars = [];
    const fireflies = [];
    const hearts = [];
    const sparks = [];
    const circles = [];
    const butterflies = [];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function seed() {
      stars.length = 0;
      fireflies.length = 0;
      hearts.length = 0;
      sparks.length = 0;
      circles.length = 0;
      butterflies.length = 0;

      const starCount = Math.min(120, Math.floor((w * h) / 14000));
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.85,
          r: Math.random() * 1.6 + 0.3,
          tw: Math.random() * Math.PI * 2,
          sp: Math.random() * 0.03 + 0.01,
        });
      }

      for (let i = 0; i < 18; i++) {
        fireflies.push({
          x: Math.random() * w,
          y: Math.random() * h,
          a: Math.random() * Math.PI * 2,
          r: Math.random() * 2 + 1,
          sp: Math.random() * 0.4 + 0.15,
        });
      }

      for (let i = 0; i < 10; i++) {
        hearts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          s: Math.random() * 8 + 6,
          vy: -(Math.random() * 0.25 + 0.08),
          vx: (Math.random() - 0.5) * 0.2,
          a: Math.random() * 0.4 + 0.15,
          rot: Math.random() * Math.PI,
        });
      }

      for (let i = 0; i < 8; i++) {
        sparks.push({
          x: Math.random() * w,
          y: h * (0.4 + Math.random() * 0.5),
          vy: -(Math.random() * 0.6 + 0.2),
          life: Math.random(),
        });
      }

      for (let i = 0; i < 3; i++) {
        circles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 40 + 30,
          a: Math.random() * Math.PI * 2,
          sp: 0.002 + Math.random() * 0.003,
        });
      }

      for (let i = 0; i < 5; i++) {
        butterflies.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.7,
          a: Math.random() * Math.PI * 2,
          flap: Math.random() * Math.PI * 2,
          hue: Math.random() > 0.5 ? 300 : 270,
        });
      }
    }

    function drawHeart(x, y, s, rot, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(s / 16, s / 16);
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.bezierCurveTo(-10, -2, -8, -10, 0, -6);
      ctx.bezierCurveTo(8, -10, 10, -2, 0, 6);
      ctx.fillStyle = `rgba(236, 72, 153, ${alpha})`;
      ctx.fill();
      ctx.restore();
    }

    function drawButterfly(b) {
      const wing = 6 + Math.sin(b.flap) * 3;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(Math.sin(b.a) * 0.3);
      ctx.fillStyle = `hsla(${b.hue}, 80%, 70%, 0.55)`;
      ctx.beginPath();
      ctx.ellipse(-wing, 0, wing, 5, -0.4, 0, Math.PI * 2);
      ctx.ellipse(wing, 0, wing, 5, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(-1, -4, 2, 8);
      ctx.restore();
    }

    function frame(t) {
      ctx.clearRect(0, 0, w, h);

      stars.forEach((s) => {
        s.tw += s.sp;
        const alpha = 0.35 + Math.sin(s.tw) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      fireflies.forEach((f) => {
        f.a += 0.01;
        f.x += Math.cos(f.a) * f.sp;
        f.y += Math.sin(f.a * 0.8) * f.sp;
        if (f.x < 0) f.x = w;
        if (f.x > w) f.x = 0;
        if (f.y < 0) f.y = h;
        if (f.y > h) f.y = 0;
        const glow = 0.4 + Math.sin(t / 400 + f.a) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(250, 204, 21, ${glow})`;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      hearts.forEach((hrt) => {
        hrt.x += hrt.vx;
        hrt.y += hrt.vy;
        hrt.rot += 0.005;
        if (hrt.y < -20) {
          hrt.y = h + 20;
          hrt.x = Math.random() * w;
        }
        drawHeart(hrt.x, hrt.y, hrt.s, hrt.rot, hrt.a);
      });

      sparks.forEach((sp) => {
        sp.y += sp.vy;
        sp.life -= 0.004;
        if (sp.life <= 0 || sp.y < 0) {
          sp.y = h * (0.5 + Math.random() * 0.4);
          sp.x = Math.random() * w;
          sp.life = 1;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(251, 146, 60, ${sp.life * 0.6})`;
        ctx.arc(sp.x, sp.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      circles.forEach((c) => {
        c.a += c.sp;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.12 + Math.sin(c.a) * 0.08})`;
        ctx.lineWidth = 1;
        ctx.arc(c.x, c.y, c.r + Math.sin(c.a) * 10, 0, Math.PI * 2);
        ctx.stroke();
      });

      butterflies.forEach((b) => {
        b.a += 0.008;
        b.flap += 0.15;
        b.x += Math.cos(b.a) * 0.6;
        b.y += Math.sin(b.a * 1.3) * 0.35;
        if (b.x < -20) b.x = w + 20;
        if (b.x > w + 20) b.x = -20;
        drawButterfly(b);
      });

      if (!reduced) raf = requestAnimationFrame(frame);
    }

    function makeClouds() {
      if (!cloudsHost) return;
      cloudsHost.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'bg-cloud';
        const size = 120 + Math.random() * 180;
        cloud.style.width = size + 'px';
        cloud.style.height = size * 0.45 + 'px';
        cloud.style.top = 10 + Math.random() * 50 + '%';
        cloud.style.left = '-20%';
        cloud.style.animationDuration = 40 + Math.random() * 50 + 's';
        cloud.style.animationDelay = -Math.random() * 40 + 's';
        cloudsHost.appendChild(cloud);
      }
    }

    resize();
    seed();
    makeClouds();
    if (!reduced) raf = requestAnimationFrame(frame);
    else frame(0);

    window.addEventListener(
      'resize',
      WishUtils.debounce(() => {
        resize();
        seed();
      }, 200)
    );

    return () => cancelAnimationFrame(raf);
  }

  window.BirthdayBackground = { init: initBackground };
})();
