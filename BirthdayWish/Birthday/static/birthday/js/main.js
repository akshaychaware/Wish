/**
 * App bootstrap — wire every magical module after DOM ready.
 */
(function () {
  'use strict';

  async function boot() {
    const audio = new MagicalAudio();
    window.birthdayAudio = audio;

    // Loader first
    if (window.BirthdayLoader) {
      await BirthdayLoader.run();
    }

    BirthdayCursor?.init();
    BirthdayBackground?.init();
    BirthdayCreatures?.init();
    BirthdayInteractions?.init(audio);
    BirthdayScroll?.init();
    BirthdaySections?.init();
    BirthdayGames?.init(audio);
    BirthdayCake?.init(audio);
    BirthdayMusic?.init(audio);
    BirthdayFinale?.init(audio);

    // Magical entrance after loader
    if (typeof gsap !== 'undefined' && !WishUtils.prefersReducedMotion()) {
      gsap.from('.navbar', { y: -40, opacity: 0, duration: 0.9, ease: 'power3.out' });
      gsap.from('.hero__title', { y: 30, opacity: 0, duration: 1, delay: 0.15, ease: 'power3.out' });
    }

    // Reveal hero items if observer already missed them
    document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('is-visible'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
