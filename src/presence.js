/** @typedef {string & { readonly __brand: 'SessionId' }} SessionId */

/** @typedef {{ cars: number }} Census */

/**
 * @typedef {
 *   | { kind: 'hidden' }
 *   | { kind: 'shown', line: string, glyphs: 1 | 2 | 3 | 4 | 5 }
 * } CompanyView
 */

/** @typedef {'beat' | 'leave'} PresenceOp */

const TAB_KEY = 'sunday-drive-presence-tab';
const PRESENCE_URL = '/api/presence';
const BEAT_MS = 30_000;
const WIRE_V = 1;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HIDDEN = /** @type {const} */ ({ kind: 'hidden' });

/** @type {null | (() => void)} */
let running = null;

/**
 * @param {unknown} raw
 * @returns {SessionId | null}
 */
function parseSessionId(raw) {
  if (typeof raw !== 'string' || !UUID_RE.test(raw)) return null;
  return /** @type {SessionId} */ (raw);
}

/** @returns {SessionId} */
function readOrMintTab() {
  try {
    const existing = parseSessionId(sessionStorage.getItem(TAB_KEY));
    if (existing) return existing;
    const tab = /** @type {SessionId} */ (crypto.randomUUID());
    sessionStorage.setItem(TAB_KEY, tab);
    return tab;
  } catch {
    return /** @type {SessionId} */ (crypto.randomUUID());
  }
}

/**
 * @param {unknown} raw
 * @returns {Census | null}
 */
export function parseCensus(raw) {
  if (raw == null || typeof raw !== 'object') return null;
  const body = /** @type {{ v?: unknown, n?: unknown }} */ (raw);
  if (body.v !== WIRE_V) return null;
  if (!Number.isInteger(body.n) || /** @type {number} */ (body.n) < 1) {
    return null;
  }
  return { cars: /** @type {number} */ (body.n) };
}

/**
 * @param {Census} census
 * @returns {Extract<CompanyView, { kind: 'shown' }>}
 */
export function toView(census) {
  const cars = census.cars;
  const glyphs = /** @type {1 | 2 | 3 | 4 | 5} */ (Math.min(cars, 5));
  if (cars === 1) return { kind: 'shown', line: 'Just this car', glyphs: 1 };
  if (cars === 2) return { kind: 'shown', line: 'Another car out', glyphs: 2 };
  return { kind: 'shown', line: `${cars} cars on the road`, glyphs };
}

/**
 * @param {HTMLElement} node
 * @param {CompanyView} view
 */
function paint(node, view) {
  if (view.kind === 'hidden') {
    node.hidden = true;
    node.textContent = '';
    delete node.dataset.glyphs;
    return;
  }
  node.hidden = false;
  node.textContent = view.line;
  node.dataset.glyphs = String(view.glyphs);
}

/**
 * @param {SessionId} tab
 * @param {PresenceOp} op
 * @returns {Promise<unknown>}
 */
async function postPresence(tab, op) {
  const res = await fetch(PRESENCE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ v: WIRE_V, tab, op }),
  });
  return res.json();
}

/** @param {SessionId} tab */
function postLeave(tab) {
  const body = JSON.stringify({ v: WIRE_V, tab, op: 'leave' });
  try {
    const req = fetch(PRESENCE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
    if (req && typeof req.catch === 'function') req.catch(() => {});
  } catch {
    try {
      navigator.sendBeacon(
        PRESENCE_URL,
        new Blob([body], { type: 'text/plain' }),
      );
    } catch {}
  }
}

/**
 * @param {HTMLElement} node
 * @returns {() => void}
 */
export function startCompany(node) {
  if (!node) return () => {};
  if (running) running();

  let stopped = false;
  let left = false;
  const tab = readOrMintTab();
  paint(node, HIDDEN);

  async function beat() {
    if (stopped) return;
    try {
      const raw = await postPresence(tab, 'beat');
      if (stopped) return;
      const census = parseCensus(raw);
      paint(node, census ? toView(census) : HIDDEN);
    } catch {
      if (stopped) return;
      paint(node, HIDDEN);
    }
  }

  function onLeave() {
    if (stopped || left) return;
    left = true;
    postLeave(tab);
  }

  function onShow() {
    if (stopped) return;
    left = false;
    beat();
  }

  window.addEventListener('pagehide', onLeave);
  window.addEventListener('pageshow', onShow);
  document.addEventListener('freeze', onLeave);
  document.addEventListener('resume', onShow);
  const timer = globalThis.setInterval(beat, BEAT_MS);

  function stop() {
    if (stopped) return;
    stopped = true;
    globalThis.clearInterval(timer);
    window.removeEventListener('pagehide', onLeave);
    window.removeEventListener('pageshow', onShow);
    document.removeEventListener('freeze', onLeave);
    document.removeEventListener('resume', onShow);
    if (running === stop) running = null;
  }

  running = stop;
  beat();
  return stop;
}
