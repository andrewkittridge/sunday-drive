import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { bindProp, spawnBound } from '../src/prop-bind.js';
import { parseGlb, validateGlbJson } from '../tools/blender/validate-glb.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');

export const CRITERION_IDS = [
  'wagon',
  'round',
  'willow',
  'pine',
  'scrub',
  'sage',
  'barn',
  'windmill',
  'silo',
  'pond',
  'diner',
  'lighthouse',
  'rocks',
  'dock',
  'mesa',
  'chapel',
  'fence',
  'reed',
  'mailbox',
  'lamp',
  'hay',
  'dune',
  'tuft',
  'rock',
  'wildflowers',
  'sign',
  'mail',
  'deer',
  'neon',
];

const FORBIDDEN = [
  'BoxGeometry',
  'SphereGeometry',
  'CylinderGeometry',
  'ConeGeometry',
  'DodecahedronGeometry',
  'CircleGeometry',
];

function assert(cond, message) {
  if (!cond) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
  console.log(`ok ${message}`);
}

function toArrayBuffer(buf) {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

function loadGltf(buf) {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.parse(toArrayBuffer(buf), '', resolve, reject);
  });
}

async function loadContract(id) {
  const raw = await readFile(join(repo, 'tools/blender/contracts', `${id}.json`), 'utf8');
  return JSON.parse(raw);
}

const files = process.argv[1] === fileURLToPath(import.meta.url) ? process.argv.slice(2) : [];
const only = files[0];

const contractDir = join(repo, 'tools/blender/contracts');
const contractFiles = (await readdir(contractDir)).filter((name) => name.endsWith('.json')).sort();
const diskIds = contractFiles.map((name) => name.replace(/\.json$/, ''));

assert(CRITERION_IDS.length === 29, 'criterion 1 has 29 kinds');
for (const id of CRITERION_IDS) {
  assert(diskIds.includes(id), `contract on disk: ${id}`);
}

const routeSrc = await readFile(join(repo, 'src/route.js'), 'utf8');
const propsSrc = await readFile(join(repo, 'src/props.js'), 'utf8');
const bindSrc = await readFile(join(repo, 'src/prop-bind.js'), 'utf8');
const sceneSrc = await readFile(join(repo, 'src/scene.js'), 'utf8');

for (const geom of FORBIDDEN) {
  assert(!routeSrc.includes(geom), `route.js has no ${geom}`);
  assert(!propsSrc.includes(geom), `props.js has no ${geom}`);
  assert(!bindSrc.includes(geom), `prop-bind.js has no ${geom}`);
}

assert(routeSrc.includes("spawnProp('barn'"), 'landmark barn loads glTF');
assert(routeSrc.includes("spawnProp('windmill'"), 'windmill loads glTF');
assert(routeSrc.includes("spawnProp('fence'"), 'fence loads glTF');
assert(routeSrc.includes("spawnProp('deer'") || sceneSrc.includes("spawnProp('deer'"), 'deer loads glTF');
assert(sceneSrc.includes("spawnProp('mail'"), 'mail truck loads glTF');
assert(sceneSrc.includes("spawnProp('neon'"), 'neon sign loads glTF');
assert(sceneSrc.includes('spawnWagon') || sceneSrc.includes("spawnProp('wagon'"), 'wagon spawn stays loaded glTF');

const spawnEventSrc = sceneSrc.slice(
  sceneSrc.indexOf('function spawnEvent'),
  sceneSrc.indexOf('function tickEvent'),
);
assert(spawnEventSrc.includes("spawnProp('mail'"), 'spawnEvent mail uses glTF');
assert(spawnEventSrc.includes("spawnProp('deer'"), 'spawnEvent deer uses glTF');
assert(spawnEventSrc.includes("spawnProp('neon'"), 'spawnEvent neon uses glTF');
for (const geom of FORBIDDEN) {
  assert(!spawnEventSrc.includes(geom), `spawnEvent has no ${geom}`);
}
assert(propsSrc.includes('spawnBound') || propsSrc.includes('bindProp'), 'props spawn uses bind path');

const ids = only ? [only] : CRITERION_IDS;
const loaderOk = [];

for (const id of ids) {
  const contract = await loadContract(id);
  const glbPath = join(repo, 'public/models', contract.file);
  const buf = await readFile(glbPath);
  const report = validateGlbJson(parseGlb(buf), contract);
  assert(report.triangles <= (contract.maxTriangles ?? 8000), `${id} triangles ${report.triangles}`);
  assert(report.materials >= 2, `${id} named materials ${report.materials}`);

  const gltf = await loadGltf(buf);
  const root = gltf.scene.getObjectByName(contract.nodes.root) || gltf.scene;
  const bound = bindProp(root, contract);
  const spawned = spawnBound(bound, contract, { tint: 0xc45c2a });

  if (contract.nodes.wheels) {
    assert(
      Array.isArray(spawned.userData.wheels) && spawned.userData.wheels.length === contract.nodes.wheels.length,
      `${id} wheels hook`,
    );
  }
  if (contract.nodes.head) {
    assert(Boolean(spawned.userData.head), `${id} head hook`);
  }
  if (contract.nodes.blades) {
    assert(Boolean(spawned.userData.blades), `${id} blades hook`);
  }
  if (contract.nodes.anchors) {
    assert(Boolean(spawned.userData.anchors?.spotL), `${id} light anchors`);
  }
  if (contract.materials?.lights) {
    assert(Boolean(spawned.userData.lights), `${id} lamp material`);
  }
  if (Array.isArray(contract.materials?.neon)) {
    assert(
      Array.isArray(spawned.userData.neon) && spawned.userData.neon.length === contract.materials.neon.length,
      `${id} neon materials`,
    );
  }
  if (Array.isArray(contract.materials?.emit)) {
    assert(
      Array.isArray(spawned.userData.emit) && spawned.userData.emit.length === contract.materials.emit.length,
      `${id} emit materials`,
    );
  }
  if (contract.materials?.tint) {
    const tinted = [];
    spawned.traverse((node) => {
      if (node.isMesh && node.material?.name === contract.materials.tint) tinted.push(node.material);
    });
    assert(tinted.length > 0, `${id} tint material present`);
    assert(tinted[0].color.getHex() === 0xc45c2a, `${id} tint applied`);
  }
  loaderOk.push(id);
  console.log(`bound ${id}`, JSON.stringify(report));
}

assert(loaderOk.length === ids.length, `bound ${loaderOk.length}/${ids.length} kinds`);
console.log(`verified ${loaderOk.join(', ')}`);
