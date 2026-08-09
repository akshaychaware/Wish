/**
 * Magical soft synth — procedural birthday ambience via Web Audio API.
 * No external audio files required.
 */
(function (global) {
  'use strict';

  class MagicalAudio {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.analyser = null;
      this.playing = false;
      this.trackIndex = 0;
      this.volume = 0.45;
      this._nodes = [];
      this._interval = null;
      this.tracks = [
        { title: 'Moonlit Lullaby', mood: 'soft', base: 196 },
        { title: 'Sparkle Waltz', mood: 'playful', base: 220 },
        { title: 'Aurora Dream', mood: 'dreamy', base: 174 },
        { title: 'Heartfire Glow', mood: 'warm', base: 246 },
      ];
    }

    async ensure() {
      if (this.ctx) return;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.master.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    setVolume(v) {
      this.volume = WishUtils.clamp(v, 0, 1);
      if (this.master) this.master.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }

    _tone(freq, dur, type = 'sine', gain = 0.08) {
      if (!this.ctx || !this.playing) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(gain, this.ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
      osc.connect(g);
      g.connect(this.master);
      osc.start();
      osc.stop(this.ctx.currentTime + dur + 0.05);
      this._nodes.push(osc);
    }

    _chord() {
      const track = this.tracks[this.trackIndex];
      const base = track.base;
      const intervals =
        track.mood === 'playful'
          ? [0, 4, 7, 12]
          : track.mood === 'warm'
            ? [0, 3, 7, 10]
            : [0, 3, 7, 12];
      intervals.forEach((semi, i) => {
        const f = base * Math.pow(2, semi / 12);
        this._tone(f, 1.8 + i * 0.1, i % 2 ? 'triangle' : 'sine', 0.045);
      });
      // Soft sparkle overtone
      this._tone(base * 4, 0.4, 'sine', 0.02);
    }

    async play() {
      await this.ensure();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this.playing = true;
      this._chord();
      clearInterval(this._interval);
      this._interval = setInterval(() => this._chord(), 2000);
      document.dispatchEvent(new CustomEvent('music:play'));
    }

    pause() {
      this.playing = false;
      clearInterval(this._interval);
      this._interval = null;
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend();
      }
      document.dispatchEvent(new CustomEvent('music:pause'));
    }

    toggle() {
      if (this.playing) this.pause();
      else this.play();
    }

    next() {
      this.trackIndex = (this.trackIndex + 1) % this.tracks.length;
      if (this.playing) {
        this.pause();
        this.play();
      }
      document.dispatchEvent(new CustomEvent('music:track', { detail: this.currentTrack() }));
    }

    prev() {
      this.trackIndex = (this.trackIndex - 1 + this.tracks.length) % this.tracks.length;
      if (this.playing) {
        this.pause();
        this.play();
      }
      document.dispatchEvent(new CustomEvent('music:track', { detail: this.currentTrack() }));
    }

    currentTrack() {
      return this.tracks[this.trackIndex];
    }

    /** Soft UI blip */
    async blip(kind = 'spark') {
      if (WishUtils.prefersReducedMotion()) return;
      await this.ensure();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      const map = { spark: 880, heart: 660, cake: 520, gift: 740 };
      const f = map[kind] || 700;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(f * 1.4, this.ctx.currentTime + 0.12);
      g.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.06 * this.volume, this.ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.18);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    }

    getAnalyserData(target) {
      if (!this.analyser) {
        target.fill(0);
        return target;
      }
      this.analyser.getByteFrequencyData(target);
      return target;
    }
  }

  global.MagicalAudio = MagicalAudio;
})(window);
