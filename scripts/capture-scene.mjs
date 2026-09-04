import { spawn } from 'node:child_process';
import { access, mkdir, writeFile } from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = process.env.CAPTURE_DIR || path.join(root, 'generated', 'captures');
const BASE = process.env.BASE || 'http://127.0.0.1:5173';

const CHROME_CANDIDATES = [
  process.env.CHROME,
  '/Users/andrewkittridge/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
].filter(Boolean);

const SHOTS = [
  {
    name: 'county-deer.png',
    path: '/?capture=1&hud=0&shot=county&phase=0.47&event=deer',
    width: 1280,
    height: 800,
  },
  {
    name: 'diner.png',
    path: '/?capture=1&hud=0&shot=town&phase=0.47',
    width: 1280,
    height: 800,
  },
  {
    name: 'lighthouse.png',
    path: '/?capture=1&hud=0&shot=coast&phase=0.47',
    width: 1280,
    height: 800,
  },
  {
    name: 'chapel.png',
    path: '/?capture=1&hud=0&shot=quiet&phase=0.47',
    width: 1280,
    height: 800,
  },
  {
    name: 'mesa.png',
    path: '/?capture=1&hud=0&shot=desert&phase=0.47',
    width: 1280,
    height: 800,
  },
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
  throw new Error('No Chrome or Chromium binary found. Set CHROME.');
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

async function ensureVite() {
  if (await canConnect(BASE)) return null;
  const child = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173'], {
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
    await waitForHttp(BASE, 25000);
    return child;
  } catch (err) {
    child.kill('SIGTERM');
    throw new Error(`${err.message}\n${buf}`);
  }
}

function launchChrome(bin, port) {
  return spawn(
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
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--hide-scrollbars',
      '--window-size=1280,800',
      'about:blank',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
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
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(String(event.data));
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
  return { ready, send, close: () => ws.close() };
}

function pngLooksPainted(buf) {
  if (buf.length < 8000) return false;
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
  const errors = [];
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Runtime.enable', {}, sessionId);
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `window.addEventListener('error', (e) => { window.__pageErrors = (window.__pageErrors || []).concat(e.message); });`,
    },
    sessionId,
  );
  await cdp.send(
    'Emulation.setDeviceMetricsOverride',
    {
      width: shot.width,
      height: shot.height,
      deviceScaleFactor: 1,
      mobile: false,
    },
    sessionId,
  );
  await cdp.send('Page.navigate', { url }, sessionId);
  const ready = await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => new Promise((resolve) => {
        const start = performance.now();
        const tick = () => {
          const canvas = document.getElementById('gl');
          const world = window.__sundayDrive && window.__sundayDrive.world;
          const sized = canvas && canvas.width >= window.innerWidth * 0.9 && canvas.height >= window.innerHeight * 0.9;
          if (world && sized && performance.now() - start > 520) {
            let n = 0;
            const raf = () => {
              n += 1;
              if (n >= 12) {
                resolve({
                  ok: true,
                  width: canvas.width,
                  height: canvas.height,
                  innerW: window.innerWidth,
                  innerH: window.innerHeight,
                  errors: window.__pageErrors || [],
                });
              } else requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
            return;
          }
          if (performance.now() - start > 16000) {
            resolve({
              ok: false,
              width: canvas && canvas.width,
              height: canvas && canvas.height,
              errors: window.__pageErrors || [],
            });
          } else requestAnimationFrame(tick);
        };
        tick();
      }))()`,
      awaitPromise: true,
      returnByValue: true,
    },
    sessionId,
  );
  const info = ready.result.value;
  if (!info?.ok) {
    throw new Error(`${shot.name} canvas not ready ${JSON.stringify(info)}`);
  }
  if (info.errors?.length) {
    throw new Error(`${shot.name} page errors: ${info.errors.join('; ')}`);
  }
  const shotResult = await cdp.send(
    'Page.captureScreenshot',
    { format: 'png', fromSurface: true },
    sessionId,
  );
  const buf = Buffer.from(shotResult.data, 'base64');
  if (!pngLooksPainted(buf)) {
    throw new Error(`${shot.name} looks empty (${buf.length} bytes)`);
  }
  const out = path.join(outDir, shot.name);
  await writeFile(out, buf);
  await cdp.send('Target.closeTarget', { targetId: created.targetId });
  return { out, info, bytes: buf.length };
}

async function main() {
  await mkdir(outDir, { recursive: true });
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
    for (let run = 1; run <= 2; run += 1) {
      const deer = SHOTS[0];
      const result = await captureShot(cdp, {
        ...deer,
        name: run === 1 ? deer.name : `county-deer-${run}.png`,
      });
      console.log(`run ${run} wrote`, result.out, result.info, result.bytes);
    }
    for (const shot of SHOTS.slice(1)) {
      const result = await captureShot(cdp, shot);
      console.log('wrote', result.out, result.info, result.bytes);
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
