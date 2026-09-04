import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import wagonContract from '../tools/blender/contracts/wagon.json';

const loader = new GLTFLoader();

let wagonProto = null;
let prepareWork = null;

function requiredNames(contract) {
  const nodes = contract.nodes;
  return [
    nodes.root,
    ...nodes.wheels,
    ...nodes.headlamps,
    ...nodes.tails,
    ...Object.values(nodes.anchors),
  ];
}

function findNode(root, name) {
  const node = root.getObjectByName(name);
  if (!node) throw new Error(`wagon glTF missing node ${name}`);
  return node;
}

function convertMaterial(mat) {
  const name = mat.name || '';
  const color = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
  const emissive = mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000);

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
  if (name === 'Mat_Glass') {
    return new THREE.MeshPhongMaterial({
      name,
      color,
      shininess: 130,
      specular: 0xd0dce0,
      transparent: true,
      opacity: 0.82,
      emissive: 0x243038,
      emissiveIntensity: 0.06,
      depthWrite: false,
    });
  }
  if (name === 'Mat_Lights') {
    return new THREE.MeshLambertMaterial({
      name,
      color: color.getHex() || 0xffe7b8,
      emissive: emissive.getHex() || 0xffcc77,
      emissiveIntensity: 0.35,
    });
  }
  if (name === 'Mat_Tails') {
    return new THREE.MeshLambertMaterial({
      name,
      color: color.getHex() || 0xc45c2a,
      emissive: emissive.getHex() || 0x8a2a12,
      emissiveIntensity: 0.25,
    });
  }
  if (name === 'Mat_Amber') {
    return new THREE.MeshLambertMaterial({
      name,
      color,
      emissive: emissive.getHex() || 0xc47a20,
      emissiveIntensity: 0.2,
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

function bindWagon(root, contract) {
  for (const name of requiredNames(contract)) findNode(root, name);
  convertTree(root);

  const materials = {
    lights: null,
    tails: null,
    glass: null,
  };
  root.traverse((node) => {
    if (!node.isMesh) return;
    const mat = node.material;
    if (!mat) return;
    if (mat.name === contract.materials.lights) materials.lights = mat;
    if (mat.name === contract.materials.tails) materials.tails = mat;
    if (mat.name === contract.materials.glass) materials.glass = mat;
  });
  if (!materials.lights || !materials.tails || !materials.glass) {
    throw new Error('wagon glTF missing Mat_Lights, Mat_Tails, or Mat_Glass');
  }

  root.userData.wheels = contract.nodes.wheels.map((name) => findNode(root, name));
  root.userData.lights = materials.lights;
  root.userData.tails = materials.tails;
  root.userData.glass = materials.glass;
  root.userData.anchors = Object.fromEntries(
    Object.entries(contract.nodes.anchors).map(([key, name]) => [key, findNode(root, name)]),
  );
  return root;
}

export async function prepareProps() {
  if (wagonProto) return;
  if (prepareWork) {
    await prepareWork;
    return;
  }
  prepareWork = (async () => {
    const gltf = await loader.loadAsync(`/models/${wagonContract.file}`);
    const root = gltf.scene.getObjectByName(wagonContract.nodes.root) || gltf.scene;
    wagonProto = bindWagon(root, wagonContract);
  })();
  try {
    await prepareWork;
  } finally {
    prepareWork = null;
  }
}

export function spawnWagon(opts = {}) {
  if (!wagonProto) throw new Error('prepareProps() must finish before spawnWagon()');
  const car = wagonProto.clone(true);
  car.userData.wheels = wagonContract.nodes.wheels.map((name) => findNode(car, name));
  car.userData.anchors = Object.fromEntries(
    Object.entries(wagonContract.nodes.anchors).map(([key, name]) => [key, findNode(car, name)]),
  );

  let lights = null;
  let tails = null;
  let glass = null;
  car.traverse((node) => {
    if (!node.isMesh) return;
    const mat = node.material;
    if (!mat) return;
    if (mat.userData?.wood && opts.woodMap) {
      mat.map = opts.woodMap;
      mat.needsUpdate = true;
    }
    if (mat.name === wagonContract.materials.lights) lights = mat;
    if (mat.name === wagonContract.materials.tails) tails = mat;
    if (mat.name === wagonContract.materials.glass) glass = mat;
  });
  if (!lights || !tails || !glass) {
    throw new Error('cloned wagon missing lamp, tail, or glass material');
  }
  car.userData.lights = lights;
  car.userData.tails = tails;
  car.userData.glass = glass;
  return car;
}
