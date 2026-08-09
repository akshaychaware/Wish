/**
 * Shared utilities — throttle, debounce, reduced motion, DOM helpers.
 */
(function (global) {
  'use strict';

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isTouchDevice = () =>
    window.matchMedia('(hover: none), (pointer: coarse)').matches;

  function throttle(fn, wait) {
    let last = 0;
    let scheduled = null;
    return function throttled(...args) {
      const now = performance.now();
      const remaining = wait - (now - last);
      if (remaining <= 0) {
        last = now;
        fn.apply(this, args);
      } else if (!scheduled) {
        scheduled = setTimeout(() => {
          last = performance.now();
          scheduled = null;
          fn.apply(this, args);
        }, remaining);
      }
    };
  }

  function debounce(fn, wait) {
    let t;
    return function debounced(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function parseJSONScript(id, fallback) {
    const el = document.getElementById(id);
    if (!el) return fallback;
    try {
      return JSON.parse(el.textContent);
    } catch {
      return fallback;
    }
  }

  function showToast(message, duration = 2800) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => {
        toast.hidden = true;
      }, 350);
    }, duration);
  }

  function sparkAt(x, y, count = 12) {
    if (typeof confetti === 'function' && !prefersReducedMotion()) {
      confetti({
        particleCount: count,
        spread: 50,
        startVelocity: 18,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ['#7C3AED', '#EC4899', '#F472B6', '#A855F7', '#ffffff'],
        scalar: 0.7,
        disableForReducedMotion: true,
      });
    }
  }

  function heartBurst(x, y) {
    if (typeof confetti !== 'function' || prefersReducedMotion()) return;
    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 16,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: ['#EC4899', '#F472B6', '#A855F7'],
      shapes: ['circle'],
      scalar: 0.9,
    };
    confetti({ ...defaults, particleCount: 18 });
  }

  global.WishUtils = {
    prefersReducedMotion,
    isTouchDevice,
    throttle,
    debounce,
    clamp,
    rand,
    parseJSONScript,
    showToast,
    sparkAt,
    heartBurst,
  };
})(window);
