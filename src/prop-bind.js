import * as THREE from 'three';
import { collectNames } from '../tools/blender/contract-shape.mjs';

export function findNode(root, name, id = 'prop') {
  const node = root.getObjectByName(name);
  if (!node) throw new Error(`${id} glTF missing node ${name}`);
  return node;
}

function convertMaterial(mat) {
  const name = mat.name || '';
  const color = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
  const emissive = mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000);
  const emitAmt = emissive.r + emissive.g + emissive.b;
  const opacity = mat.opacity ?? 1;

  if (name === 'Mat_Body') {
    return new THREE.MeshPhongMaterial({
      name,
      color,
      shininess: 38,
      specular: 0x8a7a64,
    });
  }
  if (name === 'Mat_Wood') {
    const next = new THREE.MeshPhongMaterial({
      name,
      color: 0xffffff,
      shininess: 18,
      specular: 0x6a4830,
    });
    next.userData.wood = true;
    return next;
  }
  if (name === 'Mat_Chrome') {
    return new THREE.MeshPhongMaterial({
      name,
      color,
      shininess: 140,
      specular: 0xc8c4ba,
    });
  }
  if (name === 'Mat_Glass' || opacity < 0.99) {
    return new THREE.MeshPhongMaterial({
      name,
      color,
      shininess: 130,
      specular: 0xd0dce0,
      transparent: true,
      opacity: Math.min(opacity, 0.85),
      emissive: emitAmt ? emissive : 0x243038,
      emissiveIntensity: mat.emissiveIntensity || 0.06,
      depthWrite: false,
    });
  }
  if (name === 'Mat_Lights' || name === 'Mat_Tails' || name === 'Mat_Amber' || emitAmt > 0) {
    return new THREE.MeshLambertMaterial({
      name,
      color,
      emissive: emitAmt ? emissive : color,
      emissiveIntensity: mat.emissiveIntensity || (name === 'Mat_Lights' ? 0.35 : 0.4),
    });
  }
  return new THREE.MeshLambertMaterial({
    name,
    color,
    emissive,
    emissiveIntensity: mat.emissiveIntensity || 0,
  });
}

function convertTree(root) {
  const map = new Map();
  root.traverse((node) => {
    if (!node.isMesh) return;
    const mats = Array.isArray(node.material) ? node.material : [node.material];
    const next = mats.map((mat) => {
      if (!mat) return mat;
      if (!map.has(mat)) map.set(mat, convertMaterial(mat));
      return map.get(mat);
    });
    node.material = Array.isArray(node.material) ? next : next[0];
    node.castShadow = !node.material?.transparent;
    node.receiveShadow = false;
  });
}

function cloneMaterials(root) {
  const map = new Map();
  root.traverse((node) => {
    if (!node.isMesh) return;
    const mats = Array.isArray(node.material) ? node.material : [node.material];
    const next = mats.map((mat) => {
      if (!mat) return mat;
      if (!map.has(mat)) map.set(mat, mat.clone());
      return map.get(mat);
    });
    node.material = Array.isArray(node.material) ? next : next[0];
  });
}

function indexMaterials(root) {
  const map = new Map();
  root.traverse((node) => {
    if (!node.isMesh) return;
    const mats = Array.isArray(node.material) ? node.material : [node.material];
    for (const mat of mats) {
      if (mat?.name) map.set(mat.name, mat);
    }
  });
  return map;
}

function mustMat(mats, name, id) {
  const mat = mats.get(name);
  if (!mat) throw new Error(`${id} glTF missing material ${name}`);
  return mat;
}

function bindHooks(root, contract, mats) {
  const id = contract.id;
  const nodes = contract.nodes || {};
  const materials = contract.materials || {};

  if (nodes.wheels) {
    root.userData.wheels = nodes.wheels.map((name) => findNode(root, name, id));
  }
  if (nodes.headlamps) {
    root.userData.headlamps = nodes.headlamps.map((name) => findNode(root, name, id));
  }
  if (nodes.tails) {
    root.userData.tails = nodes.tails.map((name) => findNode(root, name, id));
  }
  if (nodes.head) root.userData.head = findNode(root, nodes.head, id);
  if (nodes.blades) root.userData.blades = findNode(root, nodes.blades, id);
  if (nodes.anchors) {
    root.userData.anchors = Object.fromEntries(
      Object.entries(nodes.anchors).map(([key, name]) => [key, findNode(root, name, id)]),
    );
  }
  if (materials.lights) root.userData.lights = mustMat(mats, materials.lights, id);
  if (materials.tails) root.userData.tails = mustMat(mats, materials.tails, id);
  if (materials.glass) root.userData.glass = mustMat(mats, materials.glass, id);
  if (Array.isArray(materials.neon)) {
    root.userData.neon = materials.neon.map((name) => mustMat(mats, name, id));
  }
  if (Array.isArray(materials.emit)) {
    root.userData.emit = materials.emit.map((name) => mustMat(mats, name, id));
  }
  root.userData.kind = id;
  return root;
}

export function bindProp(root, contract) {
  for (const name of collectNames(contract)) findNode(root, name, contract.id);
  convertTree(root);
  return bindHooks(root, contract, indexMaterials(root));
}

export function spawnBound(proto, contract, opts = {}) {
  const root = proto.clone(true);
  cloneMaterials(root);
  const mats = indexMaterials(root);
  bindHooks(root, contract, mats);

  if (opts.woodMap) {
    root.traverse((node) => {
      if (!node.isMesh) return;
      const mat = node.material;
      if (mat?.userData?.wood) {
        mat.map = opts.woodMap;
        mat.needsUpdate = true;
      }
    });
  }

  if (opts.tint != null && contract.materials?.tint) {
    const mat = mats.get(contract.materials.tint);
    if (!mat) throw new Error(`${contract.id} missing tint material ${contract.materials.tint}`);
    mat.color.set(opts.tint);
  }

  return root;
}
