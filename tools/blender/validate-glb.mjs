import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { collectNames, materialNames } from './contract-shape.mjs';

export { collectNames, materialNames };

export function parseGlb(buf) {
  const magic = buf.toString('utf8', 0, 4);
  if (magic !== 'glTF') throw new Error('not a glb');
  const jsonLength = buf.readUInt32LE(12);
  return JSON.parse(buf.slice(20, 20 + jsonLength).toString('utf8'));
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

function triangleCount(json) {
  let tris = 0;
  for (const mesh of json.meshes || []) {
    for (const prim of mesh.primitives || []) {
      const mode = prim.mode ?? 4;
      const accessors = json.accessors || [];
      let verts = 0;
      if (prim.indices != null) verts = accessors[prim.indices].count;
      else verts = accessors[prim.attributes.POSITION].count;
      if (mode === 4) tris += verts / 3;
      else if (mode === 5 || mode === 6) tris += Math.max(0, verts - 2);
    }
  }
  return tris;
}

function primitivesHaveUv(json) {
  const prims = [];
  for (const mesh of json.meshes || []) prims.push(...(mesh.primitives || []));
  if (!prims.length) return false;
  return prims.every((prim) => prim.attributes && prim.attributes.TEXCOORD_0 != null);
}

function mat4Identity() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function quatToMat(x, y, z, w) {
  const xx = x * x;
  const yy = y * y;
  const zz = z * z;
  const xy = x * y;
  const xz = x * z;
  const yz = y * z;
  const wx = w * x;
  const wy = w * y;
  const wz = w * z;
  return [
    1 - 2 * (yy + zz),
    2 * (xy + wz),
    2 * (xz - wy),
    0,
    2 * (xy - wz),
    1 - 2 * (xx + zz),
    2 * (yz + wx),
    0,
    2 * (xz + wy),
    2 * (yz - wx),
    1 - 2 * (xx + yy),
    0,
    0,
    0,
    0,
    1,
  ];
}

function mulMat(a, b) {
  const out = new Array(16);
  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      out[c * 4 + r] =
        a[0 * 4 + r] * b[c * 4 + 0] +
        a[1 * 4 + r] * b[c * 4 + 1] +
        a[2 * 4 + r] * b[c * 4 + 2] +
        a[3 * 4 + r] * b[c * 4 + 3];
    }
  }
  return out;
}

function nodeLocal(node) {
  if (node.matrix) return node.matrix.slice();
  const t = node.translation || [0, 0, 0];
  const r = node.rotation || [0, 0, 0, 1];
  const s = node.scale || [1, 1, 1];
  const m = quatToMat(r[0], r[1], r[2], r[3]);
  m[0] *= s[0];
  m[1] *= s[0];
  m[2] *= s[0];
  m[4] *= s[1];
  m[5] *= s[1];
  m[6] *= s[1];
  m[8] *= s[2];
  m[9] *= s[2];
  m[10] *= s[2];
  m[12] = t[0];
  m[13] = t[1];
  m[14] = t[2];
  return m;
}

function transformPoint(m, p) {
  return [
    m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
    m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
    m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
  ];
}

function worldMatrices(json) {
  const nodes = json.nodes || [];
  const parent = nodes.map(() => -1);
  nodes.forEach((node, i) => {
    for (const child of node.children || []) parent[child] = i;
  });
  const cache = nodes.map(() => null);
  const world = (i) => {
    if (cache[i]) return cache[i];
    const local = nodeLocal(nodes[i]);
    cache[i] = parent[i] >= 0 ? mulMat(world(parent[i]), local) : local;
    return cache[i];
  };
  nodes.forEach((_, i) => world(i));
  return cache;
}

function meshAabb(json) {
  const nodes = json.nodes || [];
  const worlds = worldMatrices(json);
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  let hits = 0;
  nodes.forEach((node, i) => {
    if (node.mesh == null) return;
    const mesh = json.meshes[node.mesh];
    const m = worlds[i] || mat4Identity();
    for (const prim of mesh.primitives || []) {
      const acc = json.accessors[prim.attributes.POSITION];
      if (!acc.min || !acc.max) continue;
      hits += 1;
      const corners = [];
      for (const x of [acc.min[0], acc.max[0]]) {
        for (const y of [acc.min[1], acc.max[1]]) {
          for (const z of [acc.min[2], acc.max[2]]) corners.push([x, y, z]);
        }
      }
      for (const c of corners) {
        const p = transformPoint(m, c);
        min = [Math.min(min[0], p[0]), Math.min(min[1], p[1]), Math.min(min[2], p[2])];
        max = [Math.max(max[0], p[0]), Math.max(max[1], p[1]), Math.max(max[2], p[2])];
      }
    }
  });
  if (!hits) throw new Error('no mesh positions with min/max');
  return {
    min,
    max,
    width: max[0] - min[0],
    height: max[1] - min[1],
    length: max[2] - min[2],
  };
}

export function validateGlbJson(json, contract) {
  const nodes = nodeMap(json);
  const missing = collectNames(contract).filter((name) => !nodes.has(name));
  if (missing.length) {
    throw new Error(`${contract.id} missing nodes: ${missing.join(', ')}`);
  }

  const mats = new Set((json.materials || []).map((m) => m.name).filter(Boolean));
  const missingMats = materialNames(contract).filter((name) => !mats.has(name));
  if (missingMats.length) {
    throw new Error(`${contract.id} missing materials: ${missingMats.join(', ')}`);
  }
  if (mats.size < 2) {
    throw new Error(`${contract.id} needs at least 2 named materials, got ${mats.size}`);
  }

  if (!primitivesHaveUv(json)) {
    throw new Error(`${contract.id} missing UVs`);
  }

  const tris = triangleCount(json);
  const cap = contract.maxTriangles ?? 8000;
  if (tris > cap) {
    throw new Error(`${contract.id} triangles ${tris} exceed ${cap}`);
  }

  if (contract.forward === '-z') {
    const lamps = (contract.nodes.headlamps || []).map((name) => translation(nodes.get(name)));
    if (lamps.length) {
      const meanZ = lamps.reduce((s, p) => s + p.z, 0) / lamps.length;
      if (meanZ >= 0) {
        throw new Error(`${contract.id} hood/lamps sit at z=${meanZ.toFixed(2)}; expected -Z`);
      }
    } else if (contract.nodes.front) {
      const z = translation(nodes.get(contract.nodes.front)).z;
      if (z >= 0) {
        throw new Error(`${contract.id} front sits at z=${z.toFixed(2)}; expected -Z`);
      }
    }
  }

  const aabb = meshAabb(json);
  const max = contract.aabbMax;
  if (aabb.width > max.width || aabb.height > max.height || aabb.length > max.length) {
    throw new Error(
      `${contract.id} aabb ${aabb.width.toFixed(2)}x${aabb.height.toFixed(2)}x${aabb.length.toFixed(2)} exceeds ${max.width}x${max.height}x${max.length}`,
    );
  }

  if (contract.origin === 'ground') {
    if (aabb.min[1] < -0.16 || aabb.min[1] > 0.28) {
      throw new Error(`${contract.id} origin minY=${aabb.min[1].toFixed(3)}; expected near ground`);
    }
  }

  const lamps = (contract.nodes.headlamps || []).map((name) => translation(nodes.get(name)));
  const meanZ = lamps.length ? lamps.reduce((s, p) => s + p.z, 0) / lamps.length : 0;

  return {
    id: contract.id,
    nodes: nodes.size,
    materials: mats.size,
    triangles: tris,
    lampZ: meanZ,
    aabb: { width: aabb.width, height: aabb.height, length: aabb.length },
    minY: aabb.min[1],
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
