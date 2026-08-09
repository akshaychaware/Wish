/**
 * Music player UI + canvas visualizer.
 */
(function () {
  'use strict';

  function initMusic(audio) {
    if (!audio) return;

    const toggle = document.getElementById('music-toggle');
    const floatPlay = document.getElementById('float-play');
    const floatLabel = document.getElementById('float-label');
    const title = document.getElementById('track-title');
    const meta = document.getElementById('track-meta');
    const volume = document.getElementById('music-volume');
    const playlist = document.getElementById('playlist');
    const viz = document.getElementById('visualizer');
    const ctx = viz ? viz.getContext('2d') : null;
    const data = new Uint8Array(64);

    function syncTrack() {
      const t = audio.currentTrack();
      if (title) title.textContent = t.title;
      if (meta) meta.textContent = `${t.mood} · procedural dreamscape`;
      if (floatLabel) floatLabel.textContent = t.title;
      playlist?.querySelectorAll('.playlist__item').forEach((item, i) => {
        item.classList.toggle('is-active', i === audio.trackIndex);
      });
    }

    function syncPlaying() {
      const label = audio.playing ? '⏸ Pause' : '▶ Play';
      if (toggle) {
        toggle.textContent = label;
        toggle.setAttribute('aria-label', audio.playing ? 'Pause music' : 'Play music');
      }
      if (floatPlay) floatPlay.textContent = audio.playing ? '❚❚' : '♪';
    }

    if (playlist) {
      audio.tracks.forEach((t, i) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'playlist__item';
        btn.innerHTML = `<span>${t.title}</span><span>${t.mood}</span>`;
        btn.addEventListener('click', () => {
          audio.trackIndex = i;
          audio.pause();
          audio.play();
          syncTrack();
          syncPlaying();
        });
        li.appendChild(btn);
        playlist.appendChild(li);
      });
    }

    toggle?.addEventListener('click', async () => {
      await audio.toggle();
      syncPlaying();
      syncTrack();
    });
    floatPlay?.addEventListener('click', async () => {
      await audio.toggle();
      syncPlaying();
    });
    document.getElementById('music-next')?.addEventListener('click', () => {
      audio.next();
      syncTrack();
      syncPlaying();
    });
    document.getElementById('music-prev')?.addEventListener('click', () => {
      audio.prev();
      syncTrack();
      syncPlaying();
    });
    volume?.addEventListener('input', () => {
      audio.setVolume(Number(volume.value));
    });

    document.addEventListener('music:play', syncPlaying);
    document.addEventListener('music:pause', syncPlaying);
    document.addEventListener('music:track', syncTrack);

    function drawViz() {
      if (!ctx || !viz) return;
      requestAnimationFrame(drawViz);
      audio.getAnalyserData(data);
      ctx.clearRect(0, 0, viz.width, viz.height);
      const bars = 32;
      const bw = viz.width / bars;
      for (let i = 0; i < bars; i++) {
        const v = data[i] || (audio.playing ? Math.sin(performance.now() / 200 + i) * 40 + 50 : 8);
        const h = (v / 255) * viz.height;
        const grad = ctx.createLinearGradient(0, viz.height - h, 0, viz.height);
        grad.addColorStop(0, '#F472B6');
        grad.addColorStop(1, '#7C3AED');
        ctx.fillStyle = grad;
        ctx.fillRect(i * bw + 2, viz.height - h, bw - 4, h);
      }
    }
    drawViz();
    syncTrack();
    syncPlaying();
  }

  window.BirthdayMusic = { init: initMusic };
})();
