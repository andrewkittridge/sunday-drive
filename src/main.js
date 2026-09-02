import { Ambience } from './audio.js';
import {
  DESTINATIONS,
  Game,
  SOUVENIR_BONUS,
  UPGRADES,
  formatDuration,
  formatMiles,
  formatMultiplier,
  formatRate,
  isCollected,
  parseSaveText,
} from './game.js';
import { createWorld } from './scene.js';

const params = new URLSearchParams(window.location.search);
const shotId = params.get('shot');
const hideHud = params.get('hud') === '0';
const captureMode = Boolean(shotId) || hideHud || params.get('capture') === '1';

const game = Game.load();
const audio = new Ambience();
audio.setMuted(game.muted);

if (shotId) {
  const idx = DESTINATIONS.findIndex((d) => d.id === shotId);
  if (idx >= 0) game.destinationIndex = idx;
}

if (params.has('souvenirs')) {
  const n = Number(params.get('souvenirs'));
  if (Number.isFinite(n) && n >= 0) {
    game.souvenirs = Math.floor(n);
    if (!params.get('shot')) {
      game.destinationIndex = game.souvenirs % DESTINATIONS.length;
    }
  }
}
if (params.get('large') === '1') game.largeType = true;
if (params.get('motion') === '0') game.reduceMotion = true;
if (params.get('motion') === '1') game.reduceMotion = false;

const world = createWorld(document.getElementById('gl'));
world.applyRoute(game.destination.id);
if (params.has('phase')) {
  const p = Number(params.get('phase'));
  if (Number.isFinite(p)) world.setPhase(p);
} else if (params.has('time')) {
  const t = Number(params.get('time'));
  if (Number.isFinite(t)) world.setTime(t);
}
if (params.has('event')) {
  world.forceEvent(params.get('event'));
}

const els = {
  miles: document.getElementById('miles'),
  rate: document.getElementById('rate'),
  trip: document.getElementById('trip'),
  destination: document.getElementById('destination'),
  souvenir: document.getElementById('souvenir'),
  mute: document.getElementById('mute'),
  saveFile: document.getElementById('save-file'),
  postcards: document.getElementById('postcards'),
  largeType: document.getElementById('large-type'),
  reduceMotion: document.getElementById('reduce-motion'),
  panelToggle: document.getElementById('panel-toggle'),
  saveInput: document.getElementById('save-input'),
  drive: document.getElementById('drive'),
  driveHint: document.getElementById('drive-hint'),
  upgrades: document.getElementById('upgrades'),
  prestige: document.getElementById('prestige'),
  prestigeHint: document.getElementById('prestige-hint'),
  toast: document.getElementById('toast'),
  modal: document.getElementById('modal'),
  modalTitle: document.getElementById('modal-title'),
  modalBody: document.getElementById('modal-body'),
  modalActions: document.getElementById('modal-actions'),
};

const upgradeNodes = {};
const toastQueue = [];
let toastTimer = 0;
let toastBusy = false;

function souvenirLine() {
  if (game.souvenirs <= 0) return 'No souvenirs yet';
  const last = DESTINATIONS[(game.souvenirs - 1) % DESTINATIONS.length];
  return `${formatMultiplier(game.multiplier)} souvenirs · ${last.souvenir}`;
}

function renderUpgrades() {
  els.upgrades.innerHTML = '';
  for (const upgrade of UPGRADES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'upgrade';
    btn.dataset.id = upgrade.id;
    btn.innerHTML = `
      <span class="name"></span>
      <span class="cost"></span>
      <span class="meta"></span>
    `;
    btn.addEventListener('click', () => buy(upgrade.id));
    els.upgrades.appendChild(btn);
    upgradeNodes[upgrade.id] = btn;
  }
}

function syncMute() {
  els.mute.textContent = game.muted ? 'Sound off' : 'Sound on';
  els.mute.setAttribute('aria-pressed', String(!game.muted));
  audio.setMuted(game.muted);
}

function syncComfort() {
  document.body.classList.toggle('large-type', game.largeType);
  document.body.classList.toggle('reduce-motion', game.reduceMotion);
  els.largeType.setAttribute('aria-pressed', String(game.largeType));
  els.largeType.textContent = game.largeType ? 'Larger type on' : 'Larger type';
  els.reduceMotion.setAttribute('aria-pressed', String(game.reduceMotion));
  els.reduceMotion.textContent = game.reduceMotion ? 'Less motion on' : 'Less motion';
}

function setPanelOpen(open) {
  document.body.classList.toggle('panel-open', open);
  els.panelToggle.setAttribute('aria-expanded', String(open));
  els.panelToggle.textContent = open ? 'The car · hide' : 'The car';
}

function syncHud() {
  els.miles.textContent = formatMiles(game.miles);
  els.rate.textContent = `${formatRate(game.passiveRate)} · ${formatMiles(game.clickPower)} per Drive`;
  els.trip.textContent = `This trip · ${formatMiles(game.tripMiles)} / ${formatMiles(game.prestigeNeed)} to the next town`;
  els.destination.textContent = game.destination.name;
  els.souvenir.textContent = souvenirLine();
  document.body.dataset.destination = game.destination.id;
  document.body.dataset.muted = String(game.muted);
  document.body.dataset.weather = world.getLook()?.weather || '';

  const ready = game.prestigeReady;
  els.prestige.disabled = !ready;
  els.prestigeHint.textContent = ready
    ? `You can park here and keep a souvenir. Upgrades reset. Bonus becomes ${formatMultiplier(1 + (game.souvenirs + 1) * SOUVENIR_BONUS)}.`
    : 'Arrive with enough miles. Keep a souvenir. Start the next road.';

  for (const upgrade of UPGRADES) {
    const btn = upgradeNodes[upgrade.id];
    const unlocked = game.isUnlocked(upgrade.id);
    const cost = game.cost(upgrade.id);
    const level = game.levels[upgrade.id];
    btn.querySelector('.name').textContent = `${upgrade.name} · ${level}`;
    const costEl = btn.querySelector('.cost');
    const meta = btn.querySelector('.meta');
    btn.classList.toggle('locked', !unlocked);
    if (!unlocked) {
      btn.disabled = true;
      costEl.textContent = 'Soon';
      meta.textContent = game.unlockHint(upgrade.id);
    } else {
      btn.disabled = game.miles < cost;
      costEl.textContent = `${formatMiles(cost)} mi`;
      meta.textContent = upgrade.blurb;
    }
  }
}

function pumpToasts() {
  if (toastBusy) return;
  const next = toastQueue.shift();
  if (!next) {
    els.toast.hidden = true;
    return;
  }
  toastBusy = true;
  els.toast.hidden = false;
  els.toast.textContent = next.message;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastBusy = false;
    pumpToasts();
  }, next.duration);
}

function showToast(message, duration = 4200) {
  if (!message) return;
  toastQueue.push({ message, duration });
  pumpToasts();
}

function flushToasts() {
  for (const message of game.takeToasts()) {
    showToast(message);
  }
}

function closeModal() {
  els.modal.hidden = true;
  els.modalActions.replaceChildren();
  els.modal.querySelector('.modal-card')?.classList.remove('gallery-card');
  els.drive.focus();
}

function showModal({ title, bodyHtml, actions }) {
  els.modalTitle.textContent = title;
  els.modalBody.innerHTML = bodyHtml;
  els.modalActions.replaceChildren();
  for (const action of actions) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = action.label;
    if (action.primary) btn.className = 'primary';
    if (action.subtle) btn.className = 'subtle';
    btn.addEventListener('click', action.onClick);
    els.modalActions.appendChild(btn);
  }
  els.modal.hidden = false;
  const first = els.modalActions.querySelector('button');
  if (first) first.focus();
}

function spawnGain(amount) {
  const chip = document.createElement('span');
  chip.className = 'gain';
  chip.textContent = `+${formatMiles(amount)}`;
  els.drive.parentElement.appendChild(chip);
  chip.addEventListener('animationend', () => chip.remove());
}

function wakeAudio() {
  audio.resume();
}

function drive() {
  wakeAudio();
  const gain = game.drive();
  audio.driveClick();
  spawnGain(gain);
  flushToasts();
  syncHud();
}

function buy(id) {
  wakeAudio();
  if (!game.buy(id)) return;
  audio.buyChime();
  audio.sync(game);
  flushToasts();
  game.save();
  syncHud();
}

function confirmPrestige() {
  if (!game.prestigeReady) return;
  const next = DESTINATIONS[(game.souvenirs + 1) % DESTINATIONS.length];
  const current = game.destination;
  showModal({
    title: 'New destination',
    bodyHtml: `
      <p>Park at <strong>${current.name}</strong> and keep a souvenir.</p>
      <p>${current.souvenir}. The next road is ${next.name}.</p>
      <p>Upgrades reset. Your souvenir bonus stays. No clock is running.</p>
    `,
    actions: [
      { label: 'Keep driving', onClick: closeModal },
      {
        label: 'Take the souvenir',
        primary: true,
        onClick: () => {
          game.prestige();
          game.save();
          world.applyRoute(game.destination.id);
          audio.sync(game);
          closeModal();
          flushToasts();
          syncHud();
        },
      },
    ],
  });
}

function toggleMute() {
  wakeAudio();
  game.muted = !game.muted;
  syncMute();
  game.save();
}

function toggleLargeType() {
  game.largeType = !game.largeType;
  syncComfort();
  game.save();
}

function toggleReduceMotion() {
  game.reduceMotion = !game.reduceMotion;
  syncComfort();
  game.save();
}

function galleryHtml() {
  const kept = Math.min(game.souvenirs, DESTINATIONS.length);
  const cards = DESTINATIONS.map((dest) => {
    const have = isCollected(game.souvenirs, dest.id);
    if (!have) {
      return `
        <article class="postcard empty">
          <div class="postcard-art" aria-hidden="true"></div>
          <h3>Not yet</h3>
          <p>${dest.name}</p>
        </article>
      `;
    }
    return `
      <article class="postcard collected">
        <span class="stamp" aria-hidden="true"></span>
        <div class="postcard-art art-${dest.id}" aria-hidden="true"></div>
        <h3>${dest.name}</h3>
        <p>${dest.souvenir}</p>
      </article>
    `;
  }).join('');
  const lead =
    kept === 0
      ? 'No roads remembered yet. Park at a destination to keep a postcard.'
      : kept === 1
        ? 'One road remembered.'
        : `${kept} of ${DESTINATIONS.length} roads remembered.`;
  return `
    <p class="gallery-lead">Pieces of places worth remembering.</p>
    <p class="gallery-count">${lead}</p>
    <div class="postcards">${cards}</div>
  `;
}

function openGallery() {
  showModal({
    title: 'Souvenir postcards',
    bodyHtml: galleryHtml(),
    actions: [{ label: 'Close', primary: true, onClick: closeModal }],
  });
  els.modal.querySelector('.modal-card')?.classList.add('gallery-card');
}

function downloadSave() {
  game.save();
  const blob = new Blob([game.exportText()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sunday-drive-save.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
  showToast('Save file downloaded.');
}

async function copySave() {
  game.save();
  const text = game.exportText();
  try {
    await navigator.clipboard.writeText(text);
    showToast('Save copied. Keep it somewhere safe.');
  } catch {
    const box = els.modalBody.querySelector('#save-paste');
    if (box) {
      box.value = text;
      box.focus();
      box.select();
      showToast('Copy the text in the box. Clipboard was blocked.');
    } else {
      showToast('Could not copy. Use Download a copy instead.');
    }
  }
}

function confirmImport(data) {
  const preview = new Game();
  preview.hydrate(data);
  showModal({
    title: 'Load this trip?',
    bodyHtml: `
      <p>This replaces the trip in this browser. Your current odometer is not kept.</p>
      <p><strong>${preview.destination.name}</strong></p>
      <p class="big">${formatMiles(preview.miles)} miles</p>
      <p>${formatMultiplier(preview.multiplier)} souvenirs · this trip ${formatMiles(preview.tripMiles)}</p>
    `,
    actions: [
      { label: 'Keep current trip', onClick: closeModal },
      {
        label: 'Load the copy',
        primary: true,
        onClick: () => {
          const result = game.importData(data);
          if (!result.ok) {
            showToast(result.error);
            return;
          }
          game.save();
          world.applyRoute(game.destination.id);
          audio.setMuted(game.muted);
          audio.sync(game);
          syncMute();
          syncComfort();
          closeModal();
          showToast(`Loaded ${preview.destination.name} · ${formatMiles(preview.miles)} miles.`);
          syncHud();
        },
      },
    ],
  });
}

function importFromText(text) {
  const parsed = parseSaveText(text);
  if (!parsed.ok) {
    showToast(parsed.error, 5200);
    return;
  }
  confirmImport(parsed.data);
}

function openSaveModal() {
  showModal({
    title: 'Keep this trip',
    bodyHtml: `
      <p>Your trip already saves in this browser. A file is a spare key for another computer or profile.</p>
      <p>Nothing here is on a clock.</p>
      <label class="save-label" for="save-paste">Paste a save</label>
      <textarea id="save-paste" class="save-paste" rows="5" placeholder="{ ... }" spellcheck="false"></textarea>
    `,
    actions: [
      { label: 'Download a copy', onClick: downloadSave },
      { label: 'Copy save', onClick: copySave },
      {
        label: 'Choose file',
        onClick: () => els.saveInput.click(),
      },
      {
        label: 'Load pasted save',
        onClick: () => {
          const box = document.getElementById('save-paste');
          importFromText(box ? box.value : '');
        },
      },
      { label: 'Close', primary: true, onClick: closeModal },
    ],
  });
}

els.drive.addEventListener('click', drive);
els.mute.addEventListener('click', toggleMute);
els.postcards.addEventListener('click', openGallery);
els.largeType.addEventListener('click', toggleLargeType);
els.reduceMotion.addEventListener('click', toggleReduceMotion);
els.panelToggle.addEventListener('click', () => {
  setPanelOpen(!document.body.classList.contains('panel-open'));
});
els.prestige.addEventListener('click', confirmPrestige);
els.saveFile.addEventListener('click', openSaveModal);
els.saveInput.addEventListener('change', async (event) => {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (!file) return;
  try {
    const text = await file.text();
    importFromText(text);
  } catch {
    showToast('Could not read that file. Nothing was changed.');
  }
});

window.addEventListener('keydown', (event) => {
  if (event.repeat && event.code === 'Space') return;
  if (event.code === 'Escape' && !els.modal.hidden) {
    event.preventDefault();
    closeModal();
    return;
  }
  if (!els.modal.hidden) return;
  if (event.code === 'Space' || event.code === 'Enter') {
    if (event.target === els.drive || event.target === document.body || event.target === document.documentElement) {
      event.preventDefault();
      drive();
    } else if (event.code === 'Space' && event.target.tagName !== 'BUTTON') {
      event.preventDefault();
      drive();
    }
  }
  if (event.code === 'KeyM') toggleMute();
  const digit = Number(event.key);
  if (digit >= 1 && digit <= UPGRADES.length) buy(UPGRADES[digit - 1].id);
});

window.addEventListener('beforeunload', () => {
  if (!captureMode) game.save();
});

if (hideHud) {
  document.getElementById('hud').hidden = true;
}

if (params.get('gallery') === '1') {
  game.welcomed = true;
  window.setTimeout(() => openGallery(), 80);
}

if (window.matchMedia?.('(pointer: coarse)')?.matches && els.driveHint) {
  els.driveHint.textContent = 'Tap Drive';
}

renderUpgrades();
syncMute();
syncComfort();
setPanelOpen(params.get('panel') === '1');
syncHud();

const offline = captureMode ? null : game.applyOffline();
if (captureMode) {
  game.welcomed = true;
  game.miles = 0;
  game.tripMiles = 0;
  game.driveImpulse = 0;
  els.modal.hidden = true;
  syncHud();
} else if (offline) {
  const extra = offline.capped
    ? `<p>The odometer counted ${formatDuration(offline.counted)} of road — as far as it could keep honestly.</p>`
    : '';
  showModal({
    title: 'Welcome back',
    bodyHtml: `
      <p>You were away ${formatDuration(offline.elapsed)}.</p>
      <p>The car kept the quiet road.</p>
      <p class="big">+${formatMiles(offline.gained)} miles</p>
      ${extra}
    `,
    actions: [
      {
        label: 'Continue',
        primary: true,
        onClick: () => {
          closeModal();
          showToast(`While you were away: +${formatMiles(offline.gained)} miles.`, 5600);
          flushToasts();
        },
      },
    ],
  });
  game.save();
} else if (!game.welcomed) {
  showModal({
    title: 'Sunday Drive',
    bodyHtml: `
      <p>A quiet weekend car. Miles while you are away.</p>
      <p>Press Drive, or the spacebar. Spend miles on the car. When you reach the next town, keep a souvenir.</p>
    `,
    actions: [
      {
        label: 'Take the keys',
        primary: true,
        onClick: () => {
          game.welcomed = true;
          game.save();
          closeModal();
        },
      },
    ],
  });
}

window.__sundayDrive = { game, world, audio };

const clock = { last: performance.now(), saveAt: 0 };

function frame(now) {
  const dt = Math.min(0.05, (now - clock.last) / 1000);
  clock.last = now;
  game.tick(dt);
  world.update(dt, game);
  world.render();
  audio.sync(game);
  if (els.modal.hidden) flushToasts();
  syncHud();
  if (!captureMode && now - clock.saveAt > 2000) {
    game.save();
    clock.saveAt = now;
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
