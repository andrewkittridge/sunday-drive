import { spawn } from 'node:child_process';
import { access, copyFile, mkdir, writeFile } from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const afterDir = path.join(root, 'wave11-volume/evidence/after');
const beforeDir = path.join(root, 'wave11-volume/evidence/before');
const BASE = process.env.BASE || 'http://127.0.0.1:5174';

const CHROME_CANDIDATES = [
  process.env.CHROME,
  '/Users/andrewkittridge/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].filter(Boolean);

const SHOTS = [
  {
    name: 'desktop-day.png',
    path: `/?capture=1&hud=0&shot=county&phase=0.47`,
    width: 1280,
    height: 800,
  },
  {
    name: 'desktop-night.png',
    path: `/?capture=1&hud=0&shot=county&phase=0.72`,
    width: 1280,
    height: 800,
  },
  {
    name: 'desktop-1280.png',
    path: `/?capture=1&shot=county&phase=0.47`,
    width: 1280,
    height: 800,
  },
  {
    name: 'deer-shoulder.png',
    path: `/?capture=1&hud=0&shot=county&phase=0.47&event=deer`,
    width: 1280,
    height: 800,
  },
  {
    name: 'phone-390.png',
    path: `/?capture=1&shot=county&phase=0.47`,
    width: 390,
    height: 844,
  },
];

const BEFORES = [
  ['wave10-air/evidence/after/desktop-day.png', 'desktop-day.png'],
  ['wave10-air/evidence/after/desktop-night.png', 'desktop-night.png'],
  ['wave10-air/evidence/after/desktop-1280.png', 'desktop-1280.png'],
  ['wave10-air/evidence/after/deer-shoulder.png', 'deer-shoulder.png'],
  ['wave10-air/evidence/after/phone-390.png', 'phone-390.png'],
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    if (await exists(candidate)) return candidate;
  }
  throw new Error('No Chrome or Chromium binary found. Set CHROME to a Chromium path.');
}

function canConnect(url) {
  return fetch(url, { redirect: 'manual' })
    .then(() => true)
    .catch(() => false);
}

function waitForHttp(url, timeoutMs) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      canConnect(url).then((ok) => {
        if (ok) resolve();
        else if (Date.now() - start > timeoutMs) reject(new Error(`Timeout waiting for ${url}`));
        else setTimeout(tick, 200);
      });
    };
    tick();
  });
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close((err) => (err ? reject(err) : resolve(port)));
    });
    server.on('error', reject);
  });
}

async function copyBefores() {
  await mkdir(beforeDir, { recursive: true });
  for (const [from, name] of BEFORES) {
    const src = path.join(root, from);
    if (await exists(src)) await copyFile(src, path.join(beforeDir, name));
  }
}

async function ensureVite() {
  if (await canConnect(BASE)) return null;
  const child = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5174'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, BROWSER: 'none' },
  });
  let buf = '';
  child.stdout.on('data', (chunk) => {
    buf += chunk;
  });
  child.stderr.on('data', (chunk) => {
    buf += chunk;
  });
  try {
    await waitForHttp(BASE, 20000);
    return child;
  } catch (err) {
    child.kill('SIGTERM');
    throw new Error(`${err.message}\n${buf}`);
  }
}

function launchChrome(bin, port) {
  const child = spawn(
    bin,
    [
      `--remote-debugging-port=${port}`,
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-sync',
      '--disable-extensions',
      '--disable-popup-blocking',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--hide-scrollbars',
      '--window-size=1280,800',
      'about:blank',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
  return child;
}

function jsonGet(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

async function waitForCdp(port, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      return await jsonGet(`http://127.0.0.1:${port}/json/version`);
    } catch {
      await sleep(150);
    }
  }
  throw new Error(`Chrome DevTools on port ${port} did not come up`);
}

function attachCdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 0;
  const pending = new Map();
  const sessions = new Map();

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(String(event.data));
    if (msg.method && msg.sessionId && sessions.has(msg.sessionId)) {
      sessions.get(msg.sessionId)(msg);
    }
    if (msg.id != null && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(`${msg.error.message} (${msg.error.code})`));
      else resolve(msg.result);
    }
  });

  const ready = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  function send(method, params = {}, sessionId) {
    const id = ++nextId;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });
  }

  function onSession(sessionId, handler) {
    sessions.set(sessionId, handler);
  }

  function close() {
    try {
      ws.close();
    } catch {}
  }

  return { ready, send, onSession, close };
}

function pngLooksPainted(buf) {
  if (buf.length < 2000) return false;
  let sum = 0;
  let count = 0;
  const step = Math.max(1, Math.floor(buf.length / 400));
  for (let i = 24; i < buf.length; i += step) {
    sum += buf[i];
    count += 1;
  }
  const mean = sum / count;
  return mean > 8 && mean < 250;
}

async function captureShot(cdp, shot) {
  const url = new URL(shot.path, BASE).href;
  const created = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const attached = await cdp.send('Target.attachToTarget', {
    targetId: created.targetId,
    flatten: true,
  });
  const sessionId = attached.sessionId;
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Runtime.enable', {}, sessionId);
  await cdp.send(
    'Emulation.setDeviceMetricsOverride',
    {
      width: shot.width,
      height: shot.height,
      deviceScaleFactor: 1,
      mobile: shot.width < 600,
    },
    sessionId,
  );
  await cdp.send('Page.navigate', { url }, sessionId);
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => new Promise((resolve) => {
        const start = performance.now();
        const tick = () => {
          const canvas = document.getElementById('gl');
          const world = window.__sundayDrive && window.__sundayDrive.world;
          const sized = canvas && canvas.width > 8 && canvas.height > 8;
          if (world && sized && performance.now() - start > 420) {
            let n = 0;
            const raf = () => {
              n += 1;
              if (n >= 10) resolve(true);
              else requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
            return;
          }
          if (performance.now() - start > 12000) resolve(false);
          else requestAnimationFrame(tick);
        };
        tick();
      }))()`,
      awaitPromise: true,
      returnByValue: true,
    },
    sessionId,
  );
  const shotResult = await cdp.send(
    'Page.captureScreenshot',
    { format: 'png', fromSurface: true },
    sessionId,
  );
  const buf = Buffer.from(shotResult.data, 'base64');
  if (!pngLooksPainted(buf)) {
    throw new Error(`${shot.name} looks empty (${buf.length} bytes)`);
  }
  const out = path.join(afterDir, shot.name);
  await writeFile(out, buf);
  await cdp.send('Target.closeTarget', { targetId: created.targetId });
  return out;
}

async function main() {
  await mkdir(afterDir, { recursive: true });
  await copyBefores();
  const chromePath = await findChrome();
  const vite = await ensureVite();
  const port = await freePort();
  const chrome = launchChrome(chromePath, port);
  let chromeLog = '';
  chrome.stderr.on('data', (chunk) => {
    chromeLog += chunk;
  });
  let cdp;
  try {
    const version = await waitForCdp(port, 15000);
    cdp = attachCdp(version.webSocketDebuggerUrl);
    await cdp.ready;
    for (const shot of SHOTS) {
      const out = await captureShot(cdp, shot);
      console.log('wrote', path.relative(root, out), `${shot.width}x${shot.height}`);
    }
  } catch (err) {
    throw new Error(`${err.message}\n${chromeLog.slice(-2000)}`);
  } finally {
    if (cdp) cdp.close();
    chrome.kill('SIGKILL');
    if (vite) vite.kill('SIGKILL');
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
