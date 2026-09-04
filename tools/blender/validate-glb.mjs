import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

function parseGlb(buf) {
  const magic = buf.toString('utf8', 0, 4);
  if (magic !== 'glTF') throw new Error('not a glb');
  const jsonLength = buf.readUInt32LE(12);
  const json = JSON.parse(buf.slice(20, 20 + jsonLength).toString('utf8'));
  return json;
}

function nodeMap(json) {
  const map = new Map();
  for (const node of json.nodes || []) {
    if (node.name) map.set(node.name, node);
  }
  return map;
}

function translation(node) {
  const t = node.translation || [0, 0, 0];
  return { x: t[0], y: t[1], z: t[2] };
}

function collectNames(contract) {
  const nodes = contract.nodes;
  return [
    nodes.root,
    ...nodes.wheels,
    ...(nodes.headlamps || []),
    ...(nodes.tails || []),
    ...Object.values(nodes.anchors || {}),
  ];
}

export function validateGlbJson(json, contract) {
  const nodes = nodeMap(json);
  const missing = collectNames(contract).filter((name) => !nodes.has(name));
  if (missing.length) {
    throw new Error(`${contract.id} missing nodes: ${missing.join(', ')}`);
  }

  const mats = new Set((json.materials || []).map((m) => m.name));
  const missingMats = Object.values(contract.materials || {}).filter((name) => !mats.has(name));
  if (missingMats.length) {
    throw new Error(`${contract.id} missing materials: ${missingMats.join(', ')}`);
  }

  const lamps = (contract.nodes.headlamps || []).map((name) => translation(nodes.get(name)));
  const meanZ = lamps.reduce((s, p) => s + p.z, 0) / Math.max(1, lamps.length);
  if (contract.forward === '-z' && meanZ >= 0) {
    throw new Error(`${contract.id} hood/lamps sit at z=${meanZ.toFixed(2)}; expected -Z`);
  }

  const xs = [];
  const ys = [];
  const zs = [];
  for (const node of json.nodes || []) {
    const t = translation(node);
    xs.push(t.x);
    ys.push(t.y);
    zs.push(t.z);
  }
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  const length = Math.max(...zs) - Math.min(...zs);
  const max = contract.aabbMax;
  if (width > max.width || height > max.height || length > max.length) {
    throw new Error(
      `${contract.id} aabb ${width.toFixed(2)}x${height.toFixed(2)}x${length.toFixed(2)} exceeds ${max.width}x${max.height}x${max.length}`,
    );
  }

  return {
    id: contract.id,
    nodes: nodes.size,
    materials: mats.size,
    lampZ: meanZ,
    aabb: { width, height, length },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const glbPath = process.argv[2];
  const contractPath = process.argv[3];
  if (!glbPath || !contractPath) {
    console.error('usage: node validate-glb.mjs <file.glb> <contract.json>');
    process.exit(1);
  }
  const [buf, contractRaw] = await Promise.all([readFile(glbPath), readFile(contractPath, 'utf8')]);
  const report = validateGlbJson(parseGlb(buf), JSON.parse(contractRaw));
  console.log(`ok ${basename(glbPath)}`, JSON.stringify(report));
}
