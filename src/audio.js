const TAPES = {
  county: {
    root: 62,
    chords: [
      [0, 4, 7, 11],
      [5, 9, 12],
      [0, 4, 7, 12],
      [7, 11, 14],
    ],
    melody: [7, 4, 9, 7, 12, 9, 4, 0],
  },
  pond: {
    root: 64,
    chords: [
      [0, 3, 7, 10],
      [5, 8, 12],
      [7, 10, 14],
      [0, 3, 7],
    ],
    melody: [7, 10, 5, 3, 12, 7, 5, 0],
  },
  barn: {
    root: 60,
    chords: [
      [0, 4, 7],
      [5, 9, 12],
      [0, 4, 9],
      [7, 11, 14],
    ],
    melody: [4, 7, 12, 7, 9, 4, 0, 7],
  },
  town: {
    root: 65,
    chords: [
      [0, 4, 7, 9],
      [2, 5, 9],
      [5, 9, 12],
      [0, 4, 7],
    ],
    melody: [4, 9, 7, 12, 9, 5, 4, 0],
  },
  coast: {
    root: 69,
    chords: [
      [0, 4, 7, 11],
      [4, 7, 11],
      [5, 9, 12],
      [0, 7, 12],
    ],
    melody: [12, 11, 7, 4, 9, 7, 4, 0],
  },
  harvest: {
    root: 58,
    chords: [
      [0, 4, 7],
      [5, 9, 12],
      [3, 7, 10],
      [0, 4, 7, 12],
    ],
    melody: [7, 12, 9, 4, 7, 5, 0, 4],
  },
  mountain: {
    root: 64,
    chords: [
      [0, 3, 7],
      [5, 8, 12],
      [7, 10, 14],
      [0, 3, 10],
    ],
    melody: [7, 3, 10, 7, 12, 8, 3, 0],
  },
  lake: {
    root: 67,
    chords: [
      [0, 4, 7, 12],
      [4, 7, 11],
      [5, 9, 12],
      [0, 4, 9],
    ],
    melody: [4, 7, 12, 11, 7, 4, 9, 0],
  },
  desert: {
    root: 62,
    chords: [
      [0, 3, 7],
      [5, 8, 12],
      [0, 7, 10],
      [3, 7, 12],
    ],
    melody: [0, 3, 7, 5, 10, 7, 3, 0],
  },
  quiet: {
    root: 60,
    chords: [
      [0, 4, 7],
      [0, 5, 9],
      [0, 4, 12],
      [0, 7, 11],
    ],
    melody: [12, 7, 4, 0, 7, 4, 12, 7],
  },
};

function midi(n) {
  return 440 * Math.pow(2, (n - 69) / 12);
}

export function mixtapeTier(level) {
  const n = Number(level) || 0;
  if (n <= 0) return 0;
  if (n < 3) return 1;
  if (n < 6) return 2;
  return 3;
}

function renderTape(ctx, destId, tier) {
  const spec = TAPES[destId] || TAPES.county;
  const duration = 8;
  const fade = 0.18;
  const sr = ctx.sampleRate;
  const total = Math.floor(sr * (duration + fade));
  const loopLen = Math.floor(sr * duration);
  const Ltmp = new Float32Array(total);
  const Rtmp = new Float32Array(total);
  const padGain = [0, 0.07, 0.1, 0.12][tier];
  const melodyGain = [0, 0, 0.045, 0.06][tier];
  const shimmerGain = [0, 0, 0, 0.03][tier];
  const hiss = 0.008 + tier * 0.002;

  for (let i = 0; i < total; i += 1) {
    const t = i / sr;
    const chordIndex = Math.floor((t / duration) * spec.chords.length) % spec.chords.length;
    const chord = spec.chords[chordIndex];
    const trem = 0.88 + 0.12 * Math.sin((2 * Math.PI * t) / duration);
    let s = 0;
    if (padGain) {
      for (let c = 0; c < chord.length; c += 1) {
        const freq = midi(spec.root + chord[c]);
        const wow = 1 + 0.0025 * Math.sin(2 * Math.PI * (0.12 + c * 0.03) * t);
        s += Math.sin(2 * Math.PI * freq * wow * t) * padGain * trem;
        s += Math.sin(2 * Math.PI * freq * 0.5 * wow * t) * padGain * 0.35 * trem;
      }
    }
    if (melodyGain) {
      const noteIndex = Math.floor(t) % spec.melody.length;
      const noteStart = Math.floor(t);
      const u = t - noteStart;
      if (u < 0.72) {
        const freq = midi(spec.root + spec.melody[noteIndex]);
        const env = Math.min(u / 0.03, 1) * Math.exp(-u * 2.4);
        const vib = freq * (1 + 0.0018 * Math.sin(2 * Math.PI * 5 * t));
        s +=
          melodyGain *
          env *
          (0.7 * Math.sin(2 * Math.PI * vib * t) + 0.22 * Math.sin(2 * Math.PI * vib * 2 * t));
      }
    }
    if (shimmerGain) {
      const freq = midi(spec.root + 19);
      s += Math.sin(2 * Math.PI * freq * t) * shimmerGain * (0.5 + 0.5 * Math.sin(t * 0.7));
    }
    s += (Math.random() * 2 - 1) * hiss;
    s = Math.tanh(s * 1.4);
    Ltmp[i] = s;
    Rtmp[i] = s * 0.94 + (Math.random() * 2 - 1) * hiss * 0.4;
  }

  const buffer = ctx.createBuffer(2, loopLen, sr);
  const L = buffer.getChannelData(0);
  const R = buffer.getChannelData(1);
  const fadeN = Math.floor(sr * fade);
  for (let i = 0; i < loopLen; i += 1) {
    if (i < fadeN) {
      const k = i / fadeN;
      L[i] = Ltmp[i] * k + Ltmp[loopLen + i] * (1 - k);
      R[i] = Rtmp[i] * k + Rtmp[loopLen + i] * (1 - k);
    } else {
      L[i] = Ltmp[i];
      R[i] = Rtmp[i];
    }
  }
  return buffer;
}

export class Ambience {
  constructor() {
    this.muted = false;
    this.ctx = null;
    this.master = null;
    this.started = false;
    this.liveGain = 0.26;
    this.dest = null;
    this.tier = null;
    this.cache = new Map();
    this.musicSource = null;
    this.musicGain = null;
    this.lastDrive = 0;
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master && this.ctx) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(this.master.gain.value, now);
      this.master.gain.linearRampToValueAtTime(muted ? 0 : this.liveGain, now + 0.07);
    }
  }

  async resume() {
    if (!this.ctx) this.build();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        return;
      }
    }
    this.setMuted(this.muted);
  }

  sync(game) {
    if (!this.started || !this.ctx) return;
    const dest = game.destination?.id || 'county';
    const tier = mixtapeTier(game.levels?.mixtape);
    if (dest === this.dest && tier === this.tier) return;
    this.playTape(dest, tier);
  }

  playTape(destId, tier) {
    if (!this.ctx || !this.musicBus) return;
    this.dest = destId;
    this.tier = tier;
    const key = `${destId}:${tier}`;
    let buffer = this.cache.get(key);
    if (!buffer) {
      buffer = renderTape(this.ctx, destId, tier);
      this.cache.set(key, buffer);
    }

    const now = this.ctx.currentTime;
    const incoming = this.ctx.createBufferSource();
    incoming.buffer = buffer;
    incoming.loop = true;
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    incoming.connect(gain);
    gain.connect(this.musicBus);
    incoming.start();
    const target = tier === 0 ? 0.45 : 1;
    gain.gain.linearRampToValueAtTime(target, now + 1.1);

    if (this.musicSource) {
      const oldSource = this.musicSource;
      const oldGain = this.musicGain;
      oldGain.gain.cancelScheduledValues(now);
      oldGain.gain.setValueAtTime(oldGain.gain.value, now);
      oldGain.gain.linearRampToValueAtTime(0, now + 1.1);
      try {
        oldSource.stop(now + 1.2);
      } catch {
        // already stopped
      }
    }
    this.musicSource = incoming;
    this.musicGain = gain;
  }

  driveClick() {
    if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    if (t - this.lastDrive < 0.12) return;
    this.lastDrive = t;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(62, t + 0.16);
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.045, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  buyChime() {
    if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const spec = TAPES[this.dest] || TAPES.county;
    const freqs = [midi(spec.root + 12), midi(spec.root + 16)];
    freqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.07);
      gain.gain.setValueAtTime(0.0001, t + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.05, t + i * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.36);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.4);
    });
  }

  build() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : this.liveGain;

    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 18;
    compressor.ratio.value = 2.4;
    compressor.attack.value = 0.03;
    compressor.release.value = 0.25;
    this.master.connect(compressor);
    compressor.connect(this.ctx.destination);

    this.musicBus = this.ctx.createGain();
    this.musicBus.gain.value = 0.85;
    this.musicBus.connect(this.master);

    const rumble = this.ctx.createOscillator();
    rumble.type = 'sine';
    rumble.frequency.value = 58;
    const rumble2 = this.ctx.createOscillator();
    rumble2.type = 'triangle';
    rumble2.frequency.value = 87;
    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.value = 0.09;
    const rumbleFilter = this.ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 220;
    rumble.connect(rumbleGain);
    rumble2.connect(rumbleGain);
    rumbleGain.connect(rumbleFilter);
    rumbleFilter.connect(this.master);
    rumble.start();
    rumble2.start();

    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 10;
    lfo.connect(lfoGain);
    lfoGain.connect(rumbleFilter.frequency);
    lfo.start();

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const wind = this.ctx.createBiquadFilter();
    wind.type = 'bandpass';
    wind.frequency.value = 620;
    wind.Q.value = 0.55;
    const windGain = this.ctx.createGain();
    windGain.gain.value = 0.028;
    noise.connect(wind);
    wind.connect(windGain);
    windGain.connect(this.master);
    noise.start();

    this.started = true;
    this.playTape(this.dest || 'county', this.tier || 0);
  }
}
