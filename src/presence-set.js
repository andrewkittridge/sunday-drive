/**
 * @typedef {'beat' | 'leave'} PresenceOp
 * @typedef {{ tab: string, op: PresenceOp, now: number, ttlMs: number }} LiveSetCmd
 */

/**
 * @param {Map<string, number>} map
 * @param {LiveSetCmd} cmd
 * @returns {number}
 */
export function applyLiveSet(map, cmd) {
  const { tab, op, now, ttlMs } = cmd;
  for (const [id, expiry] of map) {
    if (expiry <= now) map.delete(id);
  }
  if (op === 'beat') map.set(tab, now + ttlMs);
  else if (op === 'leave') map.delete(tab);
  return map.size;
}
