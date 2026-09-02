export const SAVE_KEY = 'sunday-drive-save-v1';
export const SAVE_VERSION = 1;
const MAX_OFFLINE_MS = 30 * 24 * 60 * 60 * 1000;
const MILESTONES = [50, 200, 1000, 5000, 25000];

export const DESTINATIONS = [
  { id: 'county', name: 'The county line', souvenir: 'A folded paper map' },
  { id: 'pond', name: "Miller's Pond", souvenir: 'A smooth skipping stone' },
  { id: 'barn', name: 'Red barn overlook', souvenir: 'A postcard of the barn' },
  { id: 'town', name: 'The next town over', souvenir: 'A diner matchbook' },
  { id: 'coast', name: 'Coastal two-lane', souvenir: 'A salt-worn shell' },
  { id: 'harvest', name: 'Harvest road', souvenir: 'A wheat stem in the visor' },
  { id: 'mountain', name: 'Mountain pass', souvenir: 'A pinecone on the dash' },
  { id: 'lake', name: 'Lakeside loop', souvenir: 'A faded swim badge' },
  { id: 'desert', name: 'Desert stretch', souvenir: 'A sun-bleached bottle cap' },
  { id: 'quiet', name: 'Somewhere quiet', souvenir: 'Nothing but the light' },
];

export const UPGRADES = [
  {
    id: 'tires',
    name: 'Tires',
    blurb: 'Better rubber. Every tap goes a little farther.',
    firstToast: 'New tires. The tap goes farther.',
    baseCost: 8,
    growth: 1.14,
    click: 0.85,
    passive: 0.05,
  },
  {
    id: 'mixtape',
    name: 'Mixtape',
    blurb: 'A well-worn cassette. The miles feel shorter.',
    firstToast: 'The tape is in. The miles feel shorter.',
    baseCost: 22,
    growth: 1.16,
    click: 0.28,
    passive: 0.32,
  },
  {
    id: 'diner',
    name: 'Diner',
    blurb: 'Pie and a booth. You leave with more road in you.',
    firstToast: 'Coffee and pie. The road sits easier.',
    baseCost: 85,
    growth: 1.18,
    click: 2.6,
    passive: 0.22,
  },
  {
    id: 'thermos',
    name: 'Thermos',
    blurb: 'Keeps warm. Keeps going.',
    firstToast: 'The thermos is full. You can stay out longer.',
    baseCost: 280,
    growth: 1.2,
    click: 0.7,
    passive: 1.15,
  },
  {
    id: 'cruise',
    name: 'Cruise Control',
    blurb: 'The road holds itself. You watch the fields.',
    firstToast: 'Cruise control is on. You can watch the fields.',
    baseCost: 1800,
    growth: 1.24,
    click: 1.4,
    passive: 5.5,
    unlockLevels: 5,
  },
  {
    id: 'playlist',
    name: 'Autopilot Playlist',
    blurb: 'The tape never ends. The miles keep coming.',
    firstToast: 'The playlist holds the road. Miles keep coming.',
    baseCost: 9000,
    growth: 1.28,
    click: 2.4,
    passive: 20,
    unlockId: 'cruise',
  },
];

const UPGRADE_IDS = UPGRADES.map((u) => u.id);
export const SOUVENIR_BONUS = 0.15;

function osPrefersReducedMotion() {
  try {
    return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
  } catch {
    return false;
  }
}

export function isCollected(souvenirs, destId) {
  if (souvenirs >= DESTINATIONS.length) return true;
  const idx = DESTINATIONS.findIndex((d) => d.id === destId);
  return idx >= 0 && idx < souvenirs;
}

function emptyLevels() {
  return Object.fromEntries(UPGRADE_IDS.map((id) => [id, 0]));
}

function clampNum(value, fallback = 0, max = 1e12) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.min(max, n);
}

export function formatMiles(n) {
  const value = Math.max(0, n);
  if (value < 1000) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: value < 10 ? 1 : 0,
      maximumFractionDigits: value < 100 ? 1 : 0,
    });
  }
  if (value < 1e6) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  const units = [
    [1e12, 'T'],
    [1e9, 'B'],
    [1e6, 'M'],
  ];
  for (const [div, suffix] of units) {
    if (value >= div) {
      return `${(value / div).toFixed(2).replace(/\.?0+$/, '')}${suffix}`;
    }
  }
  return value.toFixed(0);
}

export function formatRate(n) {
  if (n < 10) return `${n.toFixed(2)} mi/s`;
  if (n < 1000) return `${n.toFixed(1)} mi/s`;
  return `${formatMiles(n)} mi/s`;
}

export function formatMultiplier(n) {
  return `${n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}×`;
}

export function formatDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const parts = [];
  if (days) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  if (!days && !hours) {
    parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
  }
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

export function validateSave(data) {
  if (data == null || typeof data !== 'object' || Array.isArray(data)) {
    return 'That is not a Sunday Drive save.';
  }
  if (data.version !== SAVE_VERSION) {
    return 'This save is from a different version. Nothing was changed.';
  }
  const nums = ['miles', 'tripMiles', 'totalMiles', 'souvenirs', 'destinationIndex'];
  for (const key of nums) {
    if (data[key] == null) continue;
    const n = Number(data[key]);
    if (!Number.isFinite(n) || n < 0) {
      return 'That save looks damaged. Nothing was changed.';
    }
  }
  if (data.levels != null) {
    if (typeof data.levels !== 'object' || Array.isArray(data.levels)) {
      return 'That save looks damaged. Nothing was changed.';
    }
    for (const [key, value] of Object.entries(data.levels)) {
      if (!UPGRADE_IDS.includes(key)) continue;
      const n = Number(value);
      if (!Number.isFinite(n) || n < 0 || n > 10000) {
        return 'That save looks damaged. Nothing was changed.';
      }
    }
  }
  if (data.muted != null && typeof data.muted !== 'boolean') {
    return 'That save looks damaged. Nothing was changed.';
  }
  if (data.reduceMotion != null && typeof data.reduceMotion !== 'boolean') {
    return 'That save looks damaged. Nothing was changed.';
  }
  if (data.largeType != null && typeof data.largeType !== 'boolean') {
    return 'That save looks damaged. Nothing was changed.';
  }
  return null;
}

export function parseSaveText(text) {
  if (typeof text !== 'string' || !text.trim()) {
    return { ok: false, error: 'Paste a save first. Nothing was changed.' };
  }
  try {
    const data = JSON.parse(text);
    const error = validateSave(data);
    if (error) return { ok: false, error };
    return { ok: true, data };
  } catch {
    return { ok: false, error: 'That text is not a save file. Nothing was changed.' };
  }
}

export class Game {
  constructor() {
    this.miles = 0;
    this.tripMiles = 0;
    this.totalMiles = 0;
    this.levels = emptyLevels();
    this.souvenirs = 0;
    this.destinationIndex = 0;
    this.muted = false;
    this.reduceMotion = osPrefersReducedMotion();
    this.largeType = false;
    this.seenUnlocks = {};
    this.seenMiles = {};
    this.milestones = { prestigeReady: false };
    this.welcomed = false;
    this.lastSaved = Date.now();
    this.driveImpulse = 0;
    this.offlineReport = null;
    this.toasts = [];
  }

  get destination() {
    return DESTINATIONS[this.destinationIndex % DESTINATIONS.length];
  }

  get multiplier() {
    return 1 + this.souvenirs * SOUVENIR_BONUS;
  }

  get totalUpgradeLevels() {
    return UPGRADE_IDS.reduce((sum, id) => sum + this.levels[id], 0);
  }

  get clickPower() {
    let power = 1.2;
    for (const upgrade of UPGRADES) {
      power += upgrade.click * this.levels[upgrade.id];
    }
    return power * this.multiplier;
  }

  get passiveRate() {
    let rate = 0.05;
    for (const upgrade of UPGRADES) {
      rate += upgrade.passive * this.levels[upgrade.id];
    }
    return rate * this.multiplier;
  }

  get prestigeNeed() {
    return Math.floor(5000 * Math.pow(1.4, this.souvenirs));
  }

  get prestigeReady() {
    return this.tripMiles >= this.prestigeNeed;
  }

  isUnlocked(id) {
    const upgrade = UPGRADES.find((item) => item.id === id);
    if (!upgrade) return false;
    if (upgrade.unlockLevels && this.totalUpgradeLevels < upgrade.unlockLevels) {
      return false;
    }
    if (upgrade.unlockId && this.levels[upgrade.unlockId] < 1) {
      return false;
    }
    return true;
  }

  unlockHint(id) {
    const upgrade = UPGRADES.find((item) => item.id === id);
    if (!upgrade) return '';
    if (upgrade.unlockLevels && this.totalUpgradeLevels < upgrade.unlockLevels) {
      const left = upgrade.unlockLevels - this.totalUpgradeLevels;
      return `Unlocks after ${left} more upgrade${left === 1 ? '' : 's'}.`;
    }
    if (upgrade.unlockId && this.levels[upgrade.unlockId] < 1) {
      const parent = UPGRADES.find((item) => item.id === upgrade.unlockId);
      return `Unlocks after ${parent.name}.`;
    }
    return '';
  }

  cost(id) {
    const upgrade = UPGRADES.find((item) => item.id === id);
    const level = this.levels[id] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.growth, level));
  }

  pushToast(message) {
    if (!message) return;
    this.toasts.push(message);
  }

  takeToasts() {
    const list = this.toasts;
    this.toasts = [];
    return list;
  }

  drive() {
    const gain = this.clickPower;
    this.miles += gain;
    this.tripMiles += gain;
    this.totalMiles += gain;
    this.driveImpulse = Math.min(1, this.driveImpulse + 0.38);
    this.noteMilestones();
    return gain;
  }

  buy(id) {
    if (!this.isUnlocked(id)) return false;
    const price = this.cost(id);
    if (this.miles < price) return false;
    this.miles -= price;
    this.levels[id] += 1;
    const upgrade = UPGRADES.find((item) => item.id === id);
    if (upgrade && this.levels[id] === 1 && upgrade.firstToast) {
      this.pushToast(upgrade.firstToast);
    }
    this.noteMilestones();
    return true;
  }

  prestige() {
    if (!this.prestigeReady) return false;
    this.souvenirs += 1;
    this.destinationIndex = this.souvenirs % DESTINATIONS.length;
    this.levels = emptyLevels();
    this.miles = 0;
    this.tripMiles = 0;
    this.driveImpulse = 0;
    this.seenUnlocks = {};
    this.milestones = { prestigeReady: false };
    this.pushToast(`On the road to ${this.destination.name}.`);
    return true;
  }

  tick(dt) {
    const gain = this.passiveRate * dt;
    this.miles += gain;
    this.tripMiles += gain;
    this.totalMiles += gain;
    this.driveImpulse = Math.max(0, this.driveImpulse - dt * 1.6);
    this.noteMilestones();
  }

  noteMilestones() {
    for (const upgrade of UPGRADES) {
      if (!upgrade.unlockLevels && !upgrade.unlockId) continue;
      if (this.seenUnlocks[upgrade.id]) continue;
      if (this.isUnlocked(upgrade.id)) {
        this.seenUnlocks[upgrade.id] = true;
        this.pushToast(`${upgrade.name} — ready when you are.`);
      }
    }
    if (this.prestigeReady && !this.milestones.prestigeReady) {
      this.milestones.prestigeReady = true;
      this.pushToast(
        `You've reached the next town. ${this.destination.name} is close enough to park.`,
      );
    }
    for (const mark of MILESTONES) {
      if (this.totalMiles >= mark && !this.seenMiles[mark]) {
        this.seenMiles[mark] = true;
        this.pushToast(`${formatMiles(mark)} miles on the odometer.`);
      }
    }
  }

  applyOffline() {
    const now = Date.now();
    const elapsed = Math.max(0, now - this.lastSaved);
    if (elapsed < 8000) {
      this.lastSaved = now;
      return null;
    }
    const counted = Math.min(elapsed, MAX_OFFLINE_MS);
    const gained = this.passiveRate * (counted / 1000);
    this.miles += gained;
    this.tripMiles += gained;
    this.totalMiles += gained;
    this.lastSaved = now;
    this.offlineReport = {
      elapsed,
      counted,
      gained,
      capped: counted < elapsed,
    };
    this.noteMilestones();
    return this.offlineReport;
  }

  takeOfflineReport() {
    const report = this.offlineReport;
    this.offlineReport = null;
    return report;
  }

  serialize() {
    return {
      version: SAVE_VERSION,
      miles: this.miles,
      tripMiles: this.tripMiles,
      totalMiles: this.totalMiles,
      levels: { ...this.levels },
      souvenirs: this.souvenirs,
      destinationIndex: this.destinationIndex,
      muted: this.muted,
      reduceMotion: this.reduceMotion,
      largeType: this.largeType,
      seenUnlocks: { ...this.seenUnlocks },
      seenMiles: { ...this.seenMiles },
      milestones: { ...this.milestones },
      welcomed: this.welcomed,
      lastSaved: Date.now(),
    };
  }

  hydrate(data) {
    if (!data || data.version !== SAVE_VERSION) return false;
    this.miles = clampNum(data.miles);
    this.tripMiles = clampNum(data.tripMiles);
    this.totalMiles = clampNum(data.totalMiles);
    const levels = emptyLevels();
    if (data.levels && typeof data.levels === 'object') {
      for (const id of UPGRADE_IDS) {
        levels[id] = Math.floor(clampNum(data.levels[id], 0, 10000));
      }
    }
    this.levels = levels;
    this.souvenirs = Math.floor(clampNum(data.souvenirs, 0, 10000));
    this.destinationIndex =
      Math.floor(clampNum(data.destinationIndex, 0, DESTINATIONS.length * 40)) %
      DESTINATIONS.length;
    this.muted = Boolean(data.muted);
    this.reduceMotion =
      typeof data.reduceMotion === 'boolean' ? data.reduceMotion : osPrefersReducedMotion();
    this.largeType = Boolean(data.largeType);
    this.seenUnlocks = { ...(data.seenUnlocks || {}) };
    this.seenMiles = { ...(data.seenMiles || {}) };
    if (!data.seenMiles) {
      for (const mark of MILESTONES) {
        if (this.totalMiles >= mark) this.seenMiles[mark] = true;
      }
    }
    this.milestones = { prestigeReady: false, ...(data.milestones || {}) };
    if (!data.milestones && this.tripMiles >= this.prestigeNeed) {
      this.milestones.prestigeReady = true;
    }
    this.welcomed = Boolean(data.welcomed);
    this.lastSaved = Number(data.lastSaved) || Date.now();
    this.toasts = [];
    return true;
  }

  save() {
    try {
      const payload = this.serialize();
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
      this.lastSaved = payload.lastSaved;
    } catch {
      // Private mode or full storage — keep playing in memory.
    }
  }

  exportText() {
    return JSON.stringify(this.serialize(), null, 2);
  }

  importData(data, { preserveMute = true } = {}) {
    const error = validateSave(data);
    if (error) return { ok: false, error };
    const muted = this.muted;
    const reduceMotion = this.reduceMotion;
    const largeType = this.largeType;
    this.hydrate(data);
    if (preserveMute) this.muted = muted;
    this.reduceMotion = reduceMotion;
    this.largeType = largeType;
    this.lastSaved = Date.now();
    this.driveImpulse = 0;
    this.offlineReport = null;
    return { ok: true };
  }

  static load() {
    const game = new Game();
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) game.hydrate(JSON.parse(raw));
    } catch {
      // Ignore corrupt saves and start a new trip.
    }
    return game;
  }
}
