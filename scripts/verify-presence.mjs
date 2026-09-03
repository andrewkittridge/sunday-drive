import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const { parseCensus, toView } = await import(
  pathToFileURL(join(here, '../src/presence.js')).href
);
const { applyLiveSet } = await import(
  pathToFileURL(join(here, '../src/presence-set.js')).href
);
const { default: handler } = await import(
  pathToFileURL(join(here, '../api/presence.js')).href
);

function mockReq(method, body) {
  return { method, body };
}

function mockRes() {
  const out = { statusCode: 0, body: null, headers: {} };
  return {
    out,
    setHeader(key, value) {
      out.headers[key] = value;
    },
    status(code) {
      out.statusCode = code;
      return {
        json(body) {
          out.body = body;
        },
      };
    },
  };
}

async function callHandler(method, body) {
  const res = mockRes();
  await handler(mockReq(method, body), res);
  return res.out;
}

function assert(cond, message) {
  if (!cond) {
    console.error(message);
    process.exit(1);
  }
  console.log(message);
}

assert(parseCensus({ v: 1 }) === null, 'missing n');
assert(parseCensus({ v: 1, n: 0 }) === null, 'n 0');
assert(parseCensus({ v: 2, n: 3 }) === null, 'wrong v');
assert(parseCensus({}) === null, 'empty object');

const one = parseCensus({ v: 1, n: 1 });
assert(one !== null && one.cars === 1, 'n 1');
const view1 = toView(one);
assert(view1.kind === 'shown' && view1.line === 'Just this car' && view1.glyphs === 1, 'view 1');

const two = parseCensus({ v: 1, n: 2 });
assert(two !== null && two.cars === 2, 'n 2');
const view2 = toView(two);
assert(view2.kind === 'shown' && view2.line === 'Another car out' && view2.glyphs === 2, 'view 2');

const twelve = parseCensus({ v: 1, n: 12 });
assert(twelve !== null && twelve.cars === 12, 'n 12');
const view12 = toView(twelve);
assert(
  view12.kind === 'shown' &&
    view12.line === '12 cars on the road' &&
    view12.glyphs === 5,
  'view 12',
);

const live = new Map();
const ttlMs = 90_000;
assert(applyLiveSet(live, { tab: 'a', op: 'beat', now: 0, ttlMs }) === 1, 'beat a');
assert(applyLiveSet(live, { tab: 'b', op: 'beat', now: 0, ttlMs }) === 2, 'two tabs');
assert(applyLiveSet(live, { tab: 'a', op: 'leave', now: 0, ttlMs }) === 1, 'leave one');
assert(applyLiveSet(live, { tab: 'b', op: 'leave', now: 0, ttlMs }) === 0, 'leave last');
assert(applyLiveSet(live, { tab: 'b', op: 'leave', now: 0, ttlMs }) === 0, 'double leave');

const again = new Map();
assert(applyLiveSet(again, { tab: 'a', op: 'beat', now: 0, ttlMs }) === 1, 'beat once');
assert(applyLiveSet(again, { tab: 'a', op: 'beat', now: 5, ttlMs }) === 1, 'double beat');
assert(again.get('a') === 5 + ttlMs, 'double beat refreshes expiry');

const exp = new Map();
assert(applyLiveSet(exp, { tab: 'a', op: 'beat', now: 0, ttlMs: 90 }) === 1, 'beat for expiry');
assert(applyLiveSet(exp, { tab: 'b', op: 'beat', now: 91, ttlMs: 90 }) === 1, 'expired score drops');
assert(!exp.has('a') && exp.get('b') === 181, 'expired member gone');

const get = await callHandler('GET');
assert(get.statusCode === 405 && get.body?.v === 1 && !('n' in get.body), 'GET 405 no n');
assert(get.headers['Cache-Control'] === 'no-store', 'no-store');

const bad = await callHandler('POST', { v: 1, tab: 'not-a-uuid', op: 'beat' });
assert(bad.statusCode === 400 && bad.body?.v === 1 && !('n' in bad.body), 'bad tab 400 no n');

const beat = await callHandler('POST', {
  v: 1,
  tab: '550e8400-e29b-41d4-a716-446655440000',
  op: 'beat',
});
assert(beat.statusCode === 503 && beat.body?.v === 1 && !('n' in beat.body), 'no redis 503 no n');
