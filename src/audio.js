const BEDS = {
  lofi: { url: '/audio/lofi.mp3' },
  cabin: { url: '/audio/cabin.mp3' },
  road: { url: '/audio/road.mp3' },
};

const MASTER_DEFAULT = 0.2;
const MUSIC_GAIN = [0.46, 0.58, 0.68, 0.78];
const MUSIC_CUTOFF = [3800, 5200, 7000, 8800];
const CABIN_GAIN = 0.18;
const ROAD_IDLE = 0.055;
const ROAD_DRIVE = 0.05;
const FALLBACK_RUMBLE = 0.045;
const FALLBACK_WIND = 0.016;

export function mixtapeTier(level) {
  const n = Number(level) || 0;
  if (n <= 0) return 0;
  if (n < 3) return 1;
  if (n < 6) return 2;
  return 3;
}

function midi(n) {
  return 440 * Math.pow(2, (n - 69) / 12);
}

function decodeAudio(ctx, data) {
  return new Promise((resolve, reject) => {
    const copy = data.slice(0);
    let settled = false;
    const ok = (buffer) => {
      if (settled) return;
      settled = true;
      resolve(buffer);
    };
    const fail = (err) => {
      if (settled) return;
      settled = true;
      reject(err || new Error('decodeAudioData failed'));
    };
    try {
      const ret = ctx.decodeAudioData(copy, ok, fail);
      if (ret && typeof ret.then === 'function') ret.then(ok, fail);
    } catch (err) {
      fail(err);
    }
  });
}

function rampGain(node, value, seconds = 0.08) {
  if (!node) return;
  const now = node.context.currentTime;
  node.gain.cancelScheduledValues(now);
  node.gain.setValueAtTime(node.gain.value, now);
  node.gain.linearRampToValueAtTime(Math.max(0, value), now + seconds);
}

export class Ambience {
  constructor() {
    this.muted = false;
    this.reduceMotion = false;
    this.ctx = null;
    this.master = null;
    this.started = false;
    this.liveGain = MASTER_DEFAULT;
    this.loading = null;
    this.buffers = new Map();
    this.sources = {};
    this.gains = {};
    this.musicFilter = null;
    this.fallback = null;
    this.usingFallback = false;
    this.bedsReady = false;
    this.lastDrive = 0;
    this.tier = 0;
  }

  setMuted(muted) {
    this.muted = muted;
    this.applyMaster();
  }

  setReduceMotion(on) {
    this.reduceMotion = Boolean(on);
  }

  applyMaster() {
    if (!this.master || !this.ctx) return;
    rampGain(this.master, this.muted ? 0 : this.liveGain, 0.07);
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
    this.applyMaster();
    if (this.ctx.state === 'running') this.ensureBeds();
  }

  sync(game) {
    if (!this.started || !this.ctx) return;
    this.reduceMotion = Boolean(game.reduceMotion);
    const tier = mixtapeTier(game.levels?.mixtape);
    this.tier = tier;
    const impulse = this.reduceMotion ? 0 : game.driveImpulse || 0;
    const now = this.ctx.currentTime;

    if (this.gains.lofi) {
      this.gains.lofi.gain.setTargetAtTime(MUSIC_GAIN[tier], now, 0.35);
    }
    if (this.musicFilter) {
      this.musicFilter.frequency.setTargetAtTime(MUSIC_CUTOFF[tier], now, 0.45);
    }
    if (this.gains.cabin) {
      this.gains.cabin.gain.setTargetAtTime(CABIN_GAIN, now, 0.25);
    }
    if (this.gains.road) {
      const road = this.reduceMotion ? ROAD_IDLE : ROAD_IDLE + impulse * ROAD_DRIVE;
      this.gains.road.gain.setTargetAtTime(road, now, 0.28);
    }
    if (this.fallback) {
      const rumble = this.bedsReady ? 0 : FALLBACK_RUMBLE + impulse * 0.02;
      const wind = this.bedsReady ? 0 : FALLBACK_WIND + impulse * 0.008;
      this.fallback.rumble.gain.setTargetAtTime(rumble, now, 0.2);
      this.fallback.wind.gain.setTargetAtTime(wind, now, 0.22);
    }
  }

  driveClick() {
    if (!this.ctx || this.muted || this.reduceMotion || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    if (t - this.lastDrive < 0.16) return;
    this.lastDrive = t;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(96, t);
    osc.frequency.exponentialRampToValueAtTime(54, t + 0.18);
    filter.type = 'lowpass';
    filter.frequency.value = 280;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.028, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + 0.24);
  }

  buyChime() {
    if (!this.ctx || this.muted || this.reduceMotion || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const freqs = [midi(64), midi(71)];
    freqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.08);
      gain.gain.setValueAtTime(0.0001, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.03, t + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.44);
    });
  }

  build() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : this.liveGain;

    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.value = -20;
    compressor.knee.value = 18;
    compressor.ratio.value = 2.2;
    compressor.attack.value = 0.04;
    compressor.release.value = 0.28;
    this.master.connect(compressor);
    compressor.connect(this.ctx.destination);

    this.musicFilter = this.ctx.createBiquadFilter();
    this.musicFilter.type = 'lowpass';
    this.musicFilter.frequency.value = MUSIC_CUTOFF[0];
    this.musicFilter.Q.value = 0.55;
    this.musicFilter.connect(this.master);

    this.startFallback();
    this.started = true;
  }

  startFallback() {
    if (!this.ctx || this.fallback) return;

    const rumble = this.ctx.createOscillator();
    rumble.type = 'sine';
    rumble.frequency.value = 52;
    const rumble2 = this.ctx.createOscillator();
    rumble2.type = 'triangle';
    rumble2.frequency.value = 78;
    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.value = FALLBACK_RUMBLE;
    const rumbleFilter = this.ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 180;
    rumble.connect(rumbleGain);
    rumble2.connect(rumbleGain);
    rumbleGain.connect(rumbleFilter);
    rumbleFilter.connect(this.master);
    rumble.start();
    rumble2.start();

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
    wind.frequency.value = 540;
    wind.Q.value = 0.5;
    const windGain = this.ctx.createGain();
    windGain.gain.value = FALLBACK_WIND;
    noise.connect(wind);
    wind.connect(windGain);
    windGain.connect(this.master);
    noise.start();

    this.fallback = { rumble: rumbleGain, wind: windGain };
    this.usingFallback = true;
  }

  ensureBeds() {
    if (this.loading || this.bedsReady) return;
    this.loading = this.loadBeds().catch(() => {
      this.loading = null;
    });
  }

  async loadBeds() {
    if (!this.ctx) return;
    const results = await Promise.all(
      Object.entries(BEDS).map(async ([id, spec]) => {
        try {
          const res = await fetch(spec.url);
          if (!res.ok) throw new Error(`missing ${spec.url}`);
          const raw = await res.arrayBuffer();
          const buffer = await decodeAudio(this.ctx, raw);
          return [id, buffer];
        } catch {
          return [id, null];
        }
      }),
    );

    let any = false;
    for (const [id, buffer] of results) {
      if (!buffer) continue;
      this.buffers.set(id, buffer);
      this.startBed(id, buffer);
      any = true;
    }

    if (!any) {
      this.loading = null;
      return;
    }

    this.bedsReady = true;
    if (this.fallback && this.sources.cabin) {
      this.usingFallback = false;
      rampGain(this.fallback.rumble, 0, 1.2);
      rampGain(this.fallback.wind, 0, 1.2);
    }
  }

  startBed(id, buffer) {
    if (!this.ctx || this.sources[id]) return;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    source.connect(gain);
    if (id === 'lofi') {
      gain.connect(this.musicFilter);
      gain.gain.value = MUSIC_GAIN[this.tier] * 0.001;
      rampGain(gain, MUSIC_GAIN[this.tier], 1.6);
    } else if (id === 'cabin') {
      gain.connect(this.master);
      rampGain(gain, CABIN_GAIN, 1.4);
    } else {
      gain.connect(this.master);
      rampGain(gain, ROAD_IDLE, 1.6);
    }
    source.start();
    this.sources[id] = source;
    this.gains[id] = gain;
  }
}
