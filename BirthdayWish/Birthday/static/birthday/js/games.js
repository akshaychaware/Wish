/**
 * Mini games — Heart Catch, Balloons, Hidden Heart, Memory, Reaction, Prize Wheel.
 */
(function () {
  'use strict';

  function initGames(audio) {
    const canvas = document.getElementById('game-canvas');
    const scoreEl = document.getElementById('game-score');
    const statusEl = document.getElementById('game-status');
    const startBtn = document.getElementById('game-start');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let game = 'catch';
    let running = false;
    let score = 0;
    let raf = 0;
    let entities = [];
    let pointer = { x: 0, y: 0, down: false };
    let state = {};

    function setScore(n) {
      score = n;
      if (scoreEl) scoreEl.textContent = String(score);
    }

    function setStatus(msg) {
      if (statusEl) statusEl.textContent = msg;
    }

    function resizeLogical() {
      const ratio = 800 / 480;
      const displayW = canvas.clientWidth;
      canvas.width = 800;
      canvas.height = 480;
      canvas.style.height = displayW / ratio + 'px';
    }
    resizeLogical();
    window.addEventListener('resize', WishUtils.debounce(resizeLogical, 150));

    document.querySelectorAll('.games-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.games-tab').forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        game = tab.dataset.game;
        stop();
        setStatus(`Ready: ${tab.textContent}`);
        drawIdle();
      });
    });

    function canvasPos(e) {
      const r = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - r.left) / r.width) * canvas.width,
        y: ((clientY - r.top) / r.height) * canvas.height,
      };
    }

    canvas.addEventListener('pointerdown', (e) => {
      pointer.down = true;
      const p = canvasPos(e);
      pointer.x = p.x;
      pointer.y = p.y;
      onTap(p.x, p.y);
    });
    canvas.addEventListener('pointermove', (e) => {
      const p = canvasPos(e);
      pointer.x = p.x;
      pointer.y = p.y;
    });
    canvas.addEventListener('pointerup', () => {
      pointer.down = false;
    });

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
      entities = [];
      state = {};
    }

    function drawBg() {
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, '#1e1b4b');
      g.addColorStop(1, '#0b1026');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawHeart(x, y, s, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);
      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.bezierCurveTo(-5, -1, -4, -5, 0, -3);
      ctx.bezierCurveTo(4, -5, 5, -1, 0, 3);
      ctx.fillStyle = color || '#ec4899';
      ctx.fill();
      ctx.restore();
    }

    function drawIdle() {
      drawBg();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '20px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Press Start to play', canvas.width / 2, canvas.height / 2);
    }

    function onTap(x, y) {
      if (!running) return;
      if (game === 'balloons') {
        entities.forEach((b) => {
          const dx = b.x - x;
          const dy = b.y - y;
          if (dx * dx + dy * dy < b.r * b.r) {
            b.pop = true;
            setScore(score + 10);
            if (audio) audio.blip('spark');
          }
        });
      }
      if (game === 'hidden') {
        const dx = state.hx - x;
        const dy = state.hy - y;
        if (dx * dx + dy * dy < 900) {
          setScore(score + 50);
          setStatus('Found it! ❤️');
          if (audio) audio.blip('heart');
          state.hx = WishUtils.rand(40, 760);
          state.hy = WishUtils.rand(40, 440);
        }
      }
      if (game === 'memory') {
        const col = Math.floor(x / 200);
        const row = Math.floor(y / 240);
        const idx = row * 4 + col;
        if (idx >= 0 && idx < 8) flipMemory(idx);
      }
      if (game === 'reaction') {
        if (state.waiting && state.ready) {
          const ms = performance.now() - state.readyAt;
          setScore(Math.max(0, 1000 - Math.floor(ms)));
          setStatus(`Reaction: ${Math.floor(ms)} ms`);
          state.ready = false;
          state.waiting = false;
          running = false;
        } else if (state.waiting && !state.ready) {
          setStatus('Too soon! Wait for pink.');
        }
      }
      if (game === 'wheel') {
        if (!state.spinning) spinWheel();
      }
    }

    /* ---- Games ---- */
    function startCatch() {
      entities = [];
      for (let i = 0; i < 8; i++) {
        entities.push({
          x: WishUtils.rand(40, 760),
          y: WishUtils.rand(-400, -20),
          s: WishUtils.rand(1.2, 2.2),
          vy: WishUtils.rand(1.5, 3.2),
        });
      }
      state.paddleX = 400;
      function loop() {
        if (!running) return;
        drawBg();
        state.paddleX += (pointer.x - state.paddleX) * 0.15;
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(state.paddleX - 50, 440, 100, 16);
        entities.forEach((h) => {
          h.y += h.vy;
          drawHeart(h.x, h.y, h.s, '#f472b6');
          if (h.y > 430 && h.y < 460 && Math.abs(h.x - state.paddleX) < 55) {
            setScore(score + 5);
            h.y = WishUtils.rand(-200, -20);
            h.x = WishUtils.rand(40, 760);
            if (audio) audio.blip('heart');
          } else if (h.y > 500) {
            h.y = WishUtils.rand(-200, -20);
            h.x = WishUtils.rand(40, 760);
          }
        });
        raf = requestAnimationFrame(loop);
      }
      loop();
    }

    function startBalloons() {
      entities = [];
      for (let i = 0; i < 10; i++) {
        entities.push({
          x: WishUtils.rand(60, 740),
          y: WishUtils.rand(60, 400),
          r: WishUtils.rand(22, 36),
          vy: -WishUtils.rand(0.4, 1.1),
          color: `hsl(${WishUtils.rand(280, 340)}, 80%, 65%)`,
          pop: false,
        });
      }
      function loop() {
        if (!running) return;
        drawBg();
        entities = entities.filter((b) => !b.pop);
        while (entities.length < 10) {
          entities.push({
            x: WishUtils.rand(60, 740),
            y: 520,
            r: WishUtils.rand(22, 36),
            vy: -WishUtils.rand(0.4, 1.1),
            color: `hsl(${WishUtils.rand(280, 340)}, 80%, 65%)`,
            pop: false,
          });
        }
        entities.forEach((b) => {
          b.y += b.vy;
          if (b.y < -40) b.y = 520;
          ctx.beginPath();
          ctx.fillStyle = b.color;
          ctx.ellipse(b.x, b.y, b.r * 0.8, b.r, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.beginPath();
          ctx.moveTo(b.x, b.y + b.r);
          ctx.lineTo(b.x, b.y + b.r + 20);
          ctx.stroke();
        });
        raf = requestAnimationFrame(loop);
      }
      loop();
    }

    function startHidden() {
      state.hx = WishUtils.rand(40, 760);
      state.hy = WishUtils.rand(40, 440);
      setStatus('Find the nearly invisible heart!');
      function loop() {
        if (!running) return;
        drawBg();
        // Distortion fog
        for (let i = 0; i < 40; i++) {
          ctx.fillStyle = `rgba(124,58,237,${Math.random() * 0.08})`;
          ctx.fillRect(Math.random() * 800, Math.random() * 480, 40, 40);
        }
        drawHeart(state.hx, state.hy, 1.4, 'rgba(236,72,153,0.22)');
        // flashlight near pointer
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 10, pointer.x, pointer.y, 90);
        g.addColorStop(0, 'rgba(255,255,255,0.12)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 800, 480);
        raf = requestAnimationFrame(loop);
      }
      loop();
    }

    function startMemory() {
      const symbols = ['💖', '✨', '🌙', '🎂', '💖', '✨', '🌙', '🎂'];
      for (let i = symbols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
      }
      state.cards = symbols.map((s) => ({ s, flipped: false, matched: false }));
      state.opened = [];
      function render() {
        drawBg();
        state.cards.forEach((c, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = col * 200 + 20;
          const y = row * 240 + 20;
          ctx.fillStyle = c.matched ? '#34d39955' : c.flipped ? '#7c3aed88' : '#111827';
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 2;
          roundRect(ctx, x, y, 160, 200, 16);
          ctx.fill();
          ctx.stroke();
          if (c.flipped || c.matched) {
            ctx.font = '48px serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.fillText(c.s, x + 80, y + 115);
          }
        });
      }
      state.renderMemory = render;
      render();
    }

    function flipMemory(idx) {
      const c = state.cards[idx];
      if (!c || c.flipped || c.matched || state.opened.length >= 2) return;
      c.flipped = true;
      state.opened.push(idx);
      state.renderMemory?.();
      if (state.opened.length === 2) {
        const [a, b] = state.opened;
        if (state.cards[a].s === state.cards[b].s) {
          state.cards[a].matched = state.cards[b].matched = true;
          setScore(score + 20);
          state.opened = [];
          if (audio) audio.blip('heart');
          if (state.cards.every((x) => x.matched)) {
            setStatus('Memory master! 🎉');
            running = false;
          }
        } else {
          setTimeout(() => {
            state.cards[a].flipped = false;
            state.cards[b].flipped = false;
            state.opened = [];
            state.renderMemory?.();
          }, 600);
        }
        state.renderMemory?.();
      }
    }

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function startReaction() {
      drawBg();
      setStatus('Wait for the screen to turn pink…');
      state.waiting = true;
      state.ready = false;
      const delay = WishUtils.rand(1500, 4000);
      setTimeout(() => {
        if (!running) return;
        state.ready = true;
        state.readyAt = performance.now();
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(0, 0, 800, 480);
        ctx.fillStyle = '#fff';
        ctx.font = '28px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TAP NOW!', 400, 240);
        setStatus('TAP!');
      }, delay);
    }

    function spinWheel() {
      state.spinning = true;
      state.angle = state.angle || 0;
      const prizes = ['Hug', 'Kiss', 'Wish', 'Sparkle', 'Dance', 'Cake'];
      const target = state.angle + Math.PI * 6 + Math.random() * Math.PI * 2;
      const start = performance.now();
      const dur = 2800;
      function loop(now) {
        const t = Math.min(1, (now - start) / dur);
        const e = 1 - Math.pow(1 - t, 3);
        state.angle = state.angle + (target - state.angle) * (e - (state._pe || 0));
        state._pe = e;
        drawBg();
        ctx.save();
        ctx.translate(400, 240);
        ctx.rotate(state.angle);
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.fillStyle = i % 2 ? '#7c3aed' : '#ec4899';
          ctx.arc(0, 0, 160, (i * Math.PI) / 3, ((i + 1) * Math.PI) / 3);
          ctx.fill();
          ctx.save();
          ctx.rotate((i + 0.5) * (Math.PI / 3));
          ctx.fillStyle = '#fff';
          ctx.font = '16px Outfit, sans-serif';
          ctx.fillText(prizes[i], 70, 0);
          ctx.restore();
        }
        ctx.restore();
        // pointer
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(400, 60);
        ctx.lineTo(390, 90);
        ctx.lineTo(410, 90);
        ctx.fill();
        if (t < 1) raf = requestAnimationFrame(loop);
        else {
          state.spinning = false;
          state._pe = 0;
          const idx = Math.floor(((Math.PI * 2 - (state.angle % (Math.PI * 2))) / (Math.PI * 2)) * 6) % 6;
          setStatus(`You won: ${prizes[idx]}!`);
          setScore(score + 25);
          if (audio) audio.blip('gift');
        }
      }
      requestAnimationFrame(loop);
    }

    function startWheel() {
      state.angle = 0;
      state.spinning = false;
      setStatus('Tap the wheel to spin!');
      // draw once
      pointer.down = false;
      spinWheel();
      state.spinning = false;
      // reset: just draw static wheel
      stop();
      running = true;
      state.angle = 0;
      drawBg();
      ctx.save();
      ctx.translate(400, 240);
      const prizes = ['Hug', 'Kiss', 'Wish', 'Sparkle', 'Dance', 'Cake'];
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.fillStyle = i % 2 ? '#7c3aed' : '#ec4899';
        ctx.arc(0, 0, 160, (i * Math.PI) / 3, ((i + 1) * Math.PI) / 3);
        ctx.fill();
      }
      ctx.restore();
      setStatus('Tap to spin the prize wheel');
    }

    function start() {
      stop();
      running = true;
      setScore(0);
      setStatus('Playing…');
      if (game === 'catch') startCatch();
      else if (game === 'balloons') startBalloons();
      else if (game === 'hidden') startHidden();
      else if (game === 'memory') startMemory();
      else if (game === 'reaction') startReaction();
      else if (game === 'wheel') startWheel();
    }

    startBtn?.addEventListener('click', start);
    drawIdle();
  }

  window.BirthdayGames = { init: initGames };
})();
