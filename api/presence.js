import { Redis } from '@upstash/redis';

const KEY = 'sd:presence';
const TTL_MS = 90_000;
const WIRE_V = 1;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const APPLY_LUA = `
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[1])
if ARGV[4] == 'beat' then
  redis.call('ZADD', KEYS[1], ARGV[2], ARGV[3])
elseif ARGV[4] == 'leave' then
  redis.call('ZREM', KEYS[1], ARGV[3])
end
return redis.call('ZCARD', KEYS[1])
`;

/** @typedef {string} SessionId */
/** @typedef {'beat' | 'leave'} PresenceOp */

/**
 * @param {unknown} raw
 * @returns {SessionId | null}
 */
function parseSessionId(raw) {
  if (typeof raw !== 'string' || !UUID_RE.test(raw)) return null;
  return raw;
}

/**
 * @param {unknown} raw
 * @returns {PresenceOp | null}
 */
function parseOp(raw) {
  if (raw === 'beat' || raw === 'leave') return raw;
  return null;
}

/**
 * @param {unknown} body
 * @returns {{ tab: SessionId, op: PresenceOp } | null}
 */
function parseRequest(body) {
  if (body == null || typeof body !== 'object') return null;
  const wire = /** @type {{ v?: unknown, tab?: unknown, op?: unknown }} */ (
    body
  );
  if (wire.v !== WIRE_V) return null;
  const tab = parseSessionId(wire.tab);
  const op = parseOp(wire.op);
  if (!tab || !op) return null;
  return { tab, op };
}

/**
 * @param {unknown} body
 * @returns {unknown}
 */
function coerceJson(body) {
  if (body == null || body === '') return null;
  if (Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString('utf8'));
    } catch {
      return null;
    }
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  if (typeof body === 'object') return body;
  return null;
}

/**
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<unknown>}
 */
async function readBody(req) {
  const existing = /** @type {{ body?: unknown }} */ (req).body;
  if (existing !== undefined && existing !== null && existing !== '') {
    return coerceJson(existing);
  }
  const text = await new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
  return coerceJson(text);
}

/**
 * @param {Redis} redis
 * @param {{ tab: SessionId, op: PresenceOp, now: number }} cmd
 * @returns {Promise<unknown>}
 */
function applyPresence(redis, cmd) {
  return redis.eval(APPLY_LUA, [KEY], [
    cmd.now,
    cmd.now + TTL_MS,
    cmd.tab,
    cmd.op,
  ]);
}

/**
 * @param {unknown} n
 * @returns {{ v: 1, n: number } | null}
 */
function toWire(n) {
  const count = typeof n === 'string' ? Number(n) : n;
  if (!Number.isInteger(count) || /** @type {number} */ (count) < 0) return null;
  return { v: WIRE_V, n: /** @type {number} */ (count) };
}

/**
 * @param {import('http').IncomingMessage & { method?: string, body?: unknown }} req
 * @param {import('http').ServerResponse & { status: (code: number) => { json: (body: unknown) => void } }} res
 */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.status(405).json({ v: WIRE_V });
    return;
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    res.status(400).json({ v: WIRE_V });
    return;
  }

  const parsed = parseRequest(body);
  if (!parsed) {
    res.status(400).json({ v: WIRE_V });
    return;
  }

  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    res.status(503).json({ v: WIRE_V });
    return;
  }

  try {
    const redis = Redis.fromEnv();
    const n = await applyPresence(redis, {
      tab: parsed.tab,
      op: parsed.op,
      now: Date.now(),
    });
    const wire = toWire(n);
    if (!wire) {
      res.status(503).json({ v: WIRE_V });
      return;
    }
    res.status(200).json(wire);
  } catch {
    res.status(503).json({ v: WIRE_V });
  }
}
