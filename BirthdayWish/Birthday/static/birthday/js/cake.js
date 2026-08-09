/**
 * Birthday cake — blow candles, smoke, confetti celebration.
 */
(function () {
  'use strict';

  function initCake(audio) {
    const candles = Array.from(document.querySelectorAll('.candle'));
    const hint = document.getElementById('cake-hint');
    const blowAll = document.getElementById('blow-all');
    if (!candles.length) return;

    function litCount() {
      return candles.filter((c) => c.dataset.lit === 'true').length;
    }

    function blow(candle) {
      if (candle.dataset.lit !== 'true') return;
      candle.dataset.lit = 'false';
      if (audio) audio.blip('cake');
      const r = candle.getBoundingClientRect();
      WishUtils.sparkAt(r.left + r.width / 2, r.top, 8);

      if (litCount() === 0) celebrate();
      else if (hint) hint.textContent = `${litCount()} candle${litCount() === 1 ? '' : 's'} left…`;
    }

    function celebrate() {
      if (hint) hint.textContent = 'Wish granted. Make it count ✨';
      document.dispatchEvent(new CustomEvent('cake:celebrate'));
      if (typeof confetti === 'function') {
        const end = performance.now() + 2200;
        (function frame() {
          confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#7C3AED', '#EC4899', '#F472B6', '#A855F7', '#FBBF24'],
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#7C3AED', '#EC4899', '#F472B6', '#A855F7', '#FBBF24'],
          });
          if (performance.now() < end) requestAnimationFrame(frame);
        })();
      }
      // Soft birthday fanfare via audio chords
      if (audio) {
        audio.play();
        WishUtils.showToast('Happy Birthday! Candles out — confetti on 🎂');
      }
    }

    candles.forEach((c) => c.addEventListener('click', () => blow(c)));

    blowAll?.addEventListener('click', () => {
      candles.forEach((c, i) => {
        setTimeout(() => blow(c), i * 180);
      });
    });
  }

  window.BirthdayCake = { init: initCake };
})();
