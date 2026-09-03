import * as THREE from 'three';

export const THEMES = {
  county: {
    id: 'county',
    grassMap: 'green',
    grass: 0x6f8f4a,
    shoulder: 0x9a8a6a,
    hills: [0x7e925c, 0x8a9a68, 0x6f8454, 0x9aa574, 0x7a8d5e],
    hillScale: [1.75, 0.34, 1.15],
    foliage: [0x6b8f3c, 0x7a9a45, 0xc4a35a, 0x5e7d38, 0xb08a3c],
    skyTop: 0x86a8d0,
    skyBottom: 0xf6d2a0,
    duskTop: 0x7a86b0,
    duskBottom: 0xf4b078,
    fog: 0xf2c898,
    duskFog: 0xefb888,
    hemiSky: 0xffc490,
    hemiDusk: 0xff9a62,
    hemiGround: 0x5d7a3a,
    sunDay: 0xffe6b4,
    sunDusk: 0xffa45c,
    cloud: 0xfaecd8,
    treeKind: 'round',
    landmark: 'barn',
    extras: 'fence',
    horizon: 0x7a8d5e,
  },
  pond: {
    id: 'pond',
    grassMap: 'cool',
    grass: 0x4e7d62,
    shoulder: 0x7d8f78,
    hills: [0x5e8a72, 0x6f9a80, 0x4a7464, 0x88a898, 0x5a7d70],
    hillScale: [1.6, 0.28, 1.25],
    foliage: [0x3f6f44, 0x5a8a4e, 0x2f5a3c, 0x7a9a58, 0x4a7048],
    skyTop: 0x6a9cbe,
    skyBottom: 0xc8e2d4,
    duskTop: 0x4a5e9a,
    duskBottom: 0xe4c6a6,
    fog: 0xc8dcd4,
    duskFog: 0x7ea0b4,
    hemiSky: 0xc8e4f0,
    hemiDusk: 0x9ab0d0,
    hemiGround: 0x3d6a55,
    sunDay: 0xffefc8,
    sunDusk: 0xffc090,
    cloud: 0xe8f0ea,
    treeKind: 'willow',
    landmark: 'pond',
    extras: 'reeds',
    horizon: 0x5a8078,
  },
  barn: {
    id: 'barn',
    grassMap: 'green',
    grass: 0x6e8a40,
    shoulder: 0xa09070,
    hills: [0x7a8a50, 0x8a9a58, 0x6a7840, 0x9aa868, 0x74844c],
    hillScale: [1.7, 0.36, 1.12],
    foliage: [0x6a8a38, 0xa24b3a, 0xb08a3c, 0x5a702c, 0xc46a48],
    skyTop: 0x88b0d4,
    skyBottom: 0xf7d6aa,
    duskTop: 0xd47858,
    duskBottom: 0xf4b47c,
    fog: 0xf4c8a0,
    duskFog: 0xea946c,
    hemiSky: 0xffc090,
    hemiDusk: 0xff8a60,
    hemiGround: 0x6a7a38,
    sunDay: 0xffe4b0,
    sunDusk: 0xff9a60,
    cloud: 0xf8e8d0,
    treeKind: 'round',
    landmark: 'barns',
    extras: 'fence',
    horizon: 0x7a8448,
  },
  town: {
    id: 'town',
    grassMap: 'green',
    grass: 0x658554,
    shoulder: 0x8a8070,
    hills: [0x6e8658, 0x7e9464, 0x5e7448, 0x8a9a70, 0x70805c],
    hillScale: [1.55, 0.3, 1.1],
    foliage: [0x5a7a3c, 0x6a8a48, 0x4a6a34, 0x8a9a50, 0xb08a48],
    skyTop: 0x6e98c4,
    skyBottom: 0xf2d6b6,
    duskTop: 0x8a7088,
    duskBottom: 0xeeb282,
    fog: 0xe6c8ac,
    duskFog: 0xdaac8c,
    hemiSky: 0xffd0a8,
    hemiDusk: 0xffa078,
    hemiGround: 0x4a6240,
    sunDay: 0xffe8c4,
    sunDusk: 0xffb080,
    cloud: 0xf4e8d8,
    treeKind: 'round',
    landmark: 'diner',
    extras: 'town',
    horizon: 0x6a7a58,
  },
  coast: {
    id: 'coast',
    grassMap: 'cool',
    grass: 0x8b9a5c,
    shoulder: 0xc4b89a,
    hills: [0xb8a878, 0xc8c0a0, 0xa09068, 0xd0c8b0, 0x9a8e6a],
    hillScale: [1.9, 0.2, 1.45],
    foliage: [0x5a6a3c, 0x6a7a44, 0x8a9a58, 0x4a5a34, 0x708048],
    skyTop: 0x5aa0c8,
    skyBottom: 0xeadcc8,
    duskTop: 0xd07858,
    duskBottom: 0xf2ba8a,
    fog: 0xd2dae2,
    duskFog: 0xc4a89c,
    hemiSky: 0xd8ecf4,
    hemiDusk: 0xf0c0a0,
    hemiGround: 0x7a7a58,
    sunDay: 0xfff0d0,
    sunDusk: 0xffc090,
    cloud: 0xf4f0e8,
    treeKind: 'scrub',
    landmark: 'lighthouse',
    extras: 'dunes',
    horizon: 0x7a8a90,
  },
  harvest: {
    id: 'harvest',
    grassMap: 'gold',
    grass: 0xc2a24a,
    shoulder: 0xb8a070,
    hills: [0xc8b060, 0xd4bc70, 0xb49848, 0xdec878, 0xa88840],
    hillScale: [1.85, 0.3, 1.2],
    foliage: [0x8a9a40, 0xc4a24a, 0x6a7a30, 0xb08a38, 0xd4b060],
    skyTop: 0x7ab0d8,
    skyBottom: 0xf8e2ac,
    duskTop: 0xc49078,
    duskBottom: 0xf4c27c,
    fog: 0xf2d294,
    duskFog: 0xefc494,
    hemiSky: 0xffe0a8,
    hemiDusk: 0xffa060,
    hemiGround: 0x8a7a38,
    sunDay: 0xffefc0,
    sunDusk: 0xffb060,
    cloud: 0xfff4dc,
    treeKind: 'round',
    landmark: 'silo',
    extras: 'hay',
    horizon: 0xc4b060,
  },
  mountain: {
    id: 'mountain',
    grassMap: 'green',
    grass: 0x4f6d48,
    shoulder: 0x7a7064,
    hills: [0x5a6a58, 0x6a7a68, 0x4a5a4c, 0x708078, 0x3e4e48],
    hillScale: [1.35, 0.72, 1.25],
    foliage: [0x2f4a32, 0x3d5a3c, 0x2a3e30, 0x4a6244, 0x1e3228],
    skyTop: 0x5a7aaa,
    skyBottom: 0xd6cab8,
    duskTop: 0x6a4a68,
    duskBottom: 0xe2aa7c,
    fog: 0xcac2ba,
    duskFog: 0x8e7484,
    hemiSky: 0xd0d8e8,
    hemiDusk: 0xc090a0,
    hemiGround: 0x3a4a3c,
    sunDay: 0xffecd0,
    sunDusk: 0xffb090,
    cloud: 0xe8e4dc,
    treeKind: 'pine',
    landmark: 'rocks',
    extras: 'pines',
    horizon: 0x4a5a52,
  },
  lake: {
    id: 'lake',
    grassMap: 'cool',
    grass: 0x4d8a68,
    shoulder: 0x8a9a88,
    hills: [0x5a8a70, 0x6a9a80, 0x487a64, 0x80b098, 0x3e6e58],
    hillScale: [1.5, 0.26, 1.3],
    foliage: [0x3a6a40, 0x4a7a4c, 0x2e5a38, 0x6a8a50, 0x508060],
    skyTop: 0x4a98c4,
    skyBottom: 0xcaeae2,
    duskTop: 0x3a5a8a,
    duskBottom: 0xeacaaa,
    fog: 0xbcd4d4,
    duskFog: 0x6e8cac,
    hemiSky: 0xc0e0f0,
    hemiDusk: 0x90b0d0,
    hemiGround: 0x3a6a50,
    sunDay: 0xfff2d8,
    sunDusk: 0xffc8a0,
    cloud: 0xe8f4f0,
    treeKind: 'willow',
    landmark: 'dock',
    extras: 'reeds',
    horizon: 0x4a7a78,
  },
  desert: {
    id: 'desert',
    grassMap: 'sand',
    grass: 0xc9a36a,
    shoulder: 0xd0b080,
    hills: [0xc4a070, 0xd4b080, 0xb08a58, 0xe0c090, 0xa07a4c],
    hillScale: [2.15, 0.22, 1.55],
    foliage: [0x6a7a48, 0x8a8a58, 0x5a6a3c, 0xa09060, 0x708050],
    skyTop: 0x5a98d0,
    skyBottom: 0xf2ca8c,
    duskTop: 0xc48870,
    duskBottom: 0xf2ba7c,
    fog: 0xeac494,
    duskFog: 0xeaac7c,
    hemiSky: 0xffe0b0,
    hemiDusk: 0xffb070,
    hemiGround: 0xa08050,
    sunDay: 0xfff0c4,
    sunDusk: 0xffc070,
    cloud: 0xfff0dc,
    treeKind: 'sage',
    landmark: 'mesa',
    extras: 'sage',
    horizon: 0xc4a070,
  },
  quiet: {
    id: 'quiet',
    grassMap: 'cool',
    grass: 0x6a7358,
    shoulder: 0x8a8478,
    hills: [0x6a7060, 0x7a8070, 0x5a6054, 0x8a9080, 0x50564c],
    hillScale: [1.65, 0.32, 1.18],
    foliage: [0x4a5a40, 0x5a6a4c, 0x3e4e38, 0x6a7a58, 0x8a8a68],
    skyTop: 0x7a90b0,
    skyBottom: 0xead6c2,
    duskTop: 0x5a4a78,
    duskBottom: 0xe2ba9a,
    fog: 0xdacaba,
    duskFog: 0x8e7c9c,
    hemiSky: 0xe0d4c8,
    hemiDusk: 0xc0a8c8,
    hemiGround: 0x4a5044,
    sunDay: 0xffe8d0,
    sunDusk: 0xe8b0a0,
    cloud: 0xf0e8e0,
    treeKind: 'round',
    landmark: 'chapel',
    extras: 'sparse',
    horizon: 0x6a7060,
  },
};

const WEATHER_FOR = {
  county: 'leaves',
  pond: 'mist',
  barn: 'leaves',
  town: 'damp',
  coast: 'haze',
  harvest: 'leaves',
  mountain: 'fog',
  lake: 'mist',
  desert: 'heat',
  quiet: 'fog',
};

const NIGHT_FOR = {
  county: { nightTop: 0x121a32, nightBottom: 0x2c384c, nightFog: 0x1a2434 },
  pond: { nightTop: 0x101c30, nightBottom: 0x243848, nightFog: 0x162838 },
  barn: { nightTop: 0x181424, nightBottom: 0x322838, nightFog: 0x1e1828 },
  town: { nightTop: 0x141828, nightBottom: 0x2e3048, nightFog: 0x1a1c30 },
  coast: { nightTop: 0x102030, nightBottom: 0x243848, nightFog: 0x162838 },
  harvest: { nightTop: 0x1a1828, nightBottom: 0x343038, nightFog: 0x221c28 },
  mountain: { nightTop: 0x0e1424, nightBottom: 0x222838, nightFog: 0x141820 },
  lake: { nightTop: 0x0e1c2c, nightBottom: 0x203848, nightFog: 0x142430 },
  desert: { nightTop: 0x161c30, nightBottom: 0x2e2c3c, nightFog: 0x1c1828 },
  quiet: { nightTop: 0x10141c, nightBottom: 0x242830, nightFog: 0x14181c },
};

export function themeFor(id) {
  const theme = THEMES[id] || THEMES.county;
  const night = NIGHT_FOR[theme.id] || NIGHT_FOR.county;
  return {
    ...theme,
    weather: WEATHER_FOR[theme.id] || 'clear',
    ...night,
  };
}

function lambert(color, extra = {}) {
  return new THREE.MeshLambertMaterial({ color, ...extra });
}

function phong(color, extra = {}) {
  return new THREE.MeshPhongMaterial({
    color,
    shininess: 16,
    specular: 0x4a4034,
    ...extra,
  });
}

let propWoodMap = null;
function makePropWoodMap() {
  if (propWoodMap) return propWoodMap;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#8a5a32';
  ctx.fillRect(0, 0, 64, 64);
  for (let y = 0; y < 64; y += 1) {
    ctx.fillStyle = y % 11 === 0 ? '#5a3418' : y % 4 === 0 ? '#c48852' : '#9a6234';
    ctx.fillRect(0, y, 64, 1);
  }
  propWoodMap = new THREE.CanvasTexture(canvas);
  propWoodMap.colorSpace = THREE.SRGBColorSpace;
  propWoodMap.wrapS = THREE.RepeatWrapping;
  propWoodMap.wrapT = THREE.RepeatWrapping;
  propWoodMap.needsUpdate = true;
  return propWoodMap;
}

function woodPhong(tint = 0xffffff, extra = {}) {
  return phong(tint, {
    map: makePropWoodMap(),
    shininess: 12,
    specular: 0x5a4030,
    ...extra,
  });
}

function addShadow(mesh, cast = true, receive = false) {
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  return mesh;
}

export function createRoundTree(color) {
  const tree = new THREE.Group();
  const trunk = addShadow(
    new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.1, 5), lambert(0x5c4033)),
  );
  trunk.position.y = 0.55;
  tree.add(trunk);

  const foliage = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(0.95, 7, 6), lambert(color)),
  );
  foliage.position.y = 1.45;
  foliage.scale.set(1.1, 0.95, 1.1);
  tree.add(foliage);

  const canopy = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(0.7, 6, 5), lambert(color)),
  );
  canopy.position.set(0.25, 1.7, 0.1);
  tree.add(canopy);
  return tree;
}

export function createWillow(color) {
  const tree = new THREE.Group();
  const trunk = addShadow(
    new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 1.6, 5), lambert(0x4a382c)),
  );
  trunk.position.y = 0.8;
  tree.add(trunk);
  const drape = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(1.15, 7, 6), lambert(color)),
  );
  drape.position.y = 1.55;
  drape.scale.set(1.05, 1.45, 1.05);
  tree.add(drape);
  return tree;
}

export function createPine(color) {
  const tree = new THREE.Group();
  const trunk = addShadow(
    new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 1.4, 5), lambert(0x3d2e24)),
  );
  trunk.position.y = 0.7;
  tree.add(trunk);
  const shades = [color, color, color];
  [1.55, 1.15, 0.8].forEach((r, i) => {
    const cone = addShadow(
      new THREE.Mesh(new THREE.ConeGeometry(r, 1.7 - i * 0.25, 6), lambert(shades[i])),
    );
    cone.position.y = 1.35 + i * 0.85;
    tree.add(cone);
  });
  return tree;
}

export function createScrub(color) {
  const bush = new THREE.Group();
  const body = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(0.7, 6, 5), lambert(color)),
  );
  body.position.y = 0.55;
  body.scale.set(1.4, 0.7, 0.9);
  bush.add(body);
  const lean = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(0.45, 5, 4), lambert(color)),
  );
  lean.position.set(0.45, 0.5, 0.1);
  lean.scale.set(1.2, 0.55, 0.8);
  bush.add(lean);
  return bush;
}

export function createSage(color) {
  const bush = new THREE.Group();
  for (const [x, z, s] of [
    [0, 0, 1],
    [0.45, 0.2, 0.7],
    [-0.35, -0.15, 0.75],
  ]) {
    const ball = addShadow(
      new THREE.Mesh(new THREE.SphereGeometry(0.42 * s, 5, 4), lambert(color)),
    );
    ball.position.set(x, 0.32 * s, z);
    ball.scale.set(1.2, 0.7, 1);
    bush.add(ball);
  }
  return bush;
}

function makeTree(kind, color) {
  if (kind === 'willow') return createWillow(color);
  if (kind === 'pine') return createPine(color);
  if (kind === 'scrub') return createScrub(color);
  if (kind === 'sage') return createSage(color);
  return createRoundTree(color);
}

function createBarn() {
  const barn = new THREE.Group();
  const body = addShadow(
    new THREE.Mesh(
      new THREE.BoxGeometry(7.0, 3.4, 4.8),
      phong(0xb03c32, { shininess: 14, specular: 0x6a3028 }),
    ),
  );
  body.position.y = 1.7;
  barn.add(body);
  const roofMat = woodPhong(0x6a4a38);
  const roofL = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.18, 5.2), roofMat));
  roofL.position.set(-1.5, 3.9, 0);
  roofL.rotation.z = 0.52;
  barn.add(roofL);
  const roofR = addShadow(new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.18, 5.2), roofMat));
  roofR.position.set(1.5, 3.9, 0);
  roofR.rotation.z = -0.52;
  barn.add(roofR);
  const ridge = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 5.3), roofMat));
  ridge.position.set(0, 4.88, 0);
  barn.add(ridge);
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 2.4, 0.1),
    phong(0xf0e4d0, { shininess: 22, specular: 0x8a7a64 }),
  );
  door.position.set(0, 1.2, 2.42);
  barn.add(door);
  const xMat = woodPhong(0x6a4030);
  const x1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.55, 0.08), xMat);
  x1.position.set(0, 1.2, 2.48);
  x1.rotation.z = 0.55;
  barn.add(x1);
  const x2 = x1.clone();
  x2.rotation.z = -0.55;
  barn.add(x2);
  const loft = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.72, 0.08), phong(0x2a2018, { shininess: 8 }));
  loft.position.set(0, 2.88, 2.42);
  barn.add(loft);
  return barn;
}

function createWindmill() {
  const mill = new THREE.Group();
  const tower = addShadow(
    new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 5.2, 6), woodPhong(0x8a6a48)),
  );
  tower.position.y = 2.6;
  mill.add(tower);
  const head = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.6), woodPhong(0x6a5040)));
  head.position.y = 5.28;
  mill.add(head);
  const bladeMat = phong(0xf0e4cc, { shininess: 28, specular: 0x8a7a64 });
  const blades = new THREE.Group();
  blades.position.set(0.3, 5.28, 0);
  for (let i = 0; i < 4; i += 1) {
    const arm = new THREE.Group();
    arm.rotation.z = (i * Math.PI) / 2;
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.25, 0.06), bladeMat);
    blade.position.y = 1.18;
    arm.add(blade);
    blades.add(arm);
  }
  mill.add(blades);
  mill.userData.blades = blades;
  return mill;
}

function createSilo() {
  const silo = new THREE.Group();
  const drum = addShadow(
    new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.25, 5.4, 8),
      phong(0xd4ccc0, { shininess: 26, specular: 0x7a746c }),
    ),
  );
  drum.position.y = 2.7;
  silo.add(drum);
  const cap = addShadow(
    new THREE.Mesh(new THREE.ConeGeometry(1.35, 1.1, 8), phong(0x8a4a32, { shininess: 14 })),
  );
  cap.position.y = 5.9;
  silo.add(cap);
  return silo;
}

function createPond() {
  const group = new THREE.Group();
  const water = new THREE.Mesh(
    new THREE.CircleGeometry(7.5, 16),
    lambert(0x3e7a80, { transparent: true, opacity: 0.88 }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.06;
  water.receiveShadow = true;
  group.add(water);
  const rim = new THREE.Mesh(
    new THREE.RingGeometry(7.3, 8.4, 16),
    lambert(0x6a7a58),
  );
  rim.rotation.x = -Math.PI / 2;
  rim.position.y = 0.07;
  group.add(rim);
  const dock = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.14, 4.2), lambert(0x6a5344)), true, true);
  dock.position.set(2.4, 0.16, 1.2);
  group.add(dock);
  const shed = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 2.4), lambert(0x8a6a4a)));
  shed.position.set(4.6, 0.8, -1.2);
  group.add(shed);
  const roof = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.16, 2.7), lambert(0x4a3a2c)));
  roof.position.set(4.6, 1.68, -1.2);
  group.add(roof);
  return group;
}

function createDiner() {
  const diner = new THREE.Group();
  const body = addShadow(
    new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 2.6, 4.2),
      phong(0xf0e2cc, { shininess: 22, specular: 0x8a7a64 }),
    ),
  );
  body.position.y = 1.3;
  diner.add(body);
  const roof = addShadow(
    new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.22, 4.7), phong(0xb03c2c, { shininess: 18 })),
  );
  roof.position.y = 2.7;
  diner.add(roof);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(7.21, 0.18, 4.21), lambert(0xc45c2a));
  stripe.position.y = 2.05;
  diner.add(stripe);
  const windowMat = lambert(0xf0d090, { emissive: 0xc4a060, emissiveIntensity: 0.28 });
  for (const x of [-2.2, 0, 2.2]) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.08), windowMat);
    w.position.set(x, 1.35, 2.12);
    diner.add(w);
  }
  const signPost = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.4, 0.14), lambert(0x4a4038)));
  signPost.position.set(-4.4, 1.7, 1.6);
  diner.add(signPost);
  const signMat = new THREE.MeshLambertMaterial({
    color: 0xc45c2a,
    emissive: 0x6a2010,
    emissiveIntensity: 0.35,
  });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 0.12), signMat);
  sign.position.set(-4.4, 3.3, 1.6);
  diner.add(sign);
  diner.userData.neon = [windowMat, signMat];
  return diner;
}

function createLighthouse() {
  const light = new THREE.Group();
  const base = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 1.2, 8), lambert(0x8a8074)));
  base.position.y = 0.6;
  light.add(base);
  const lower = addShadow(
    new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.45, 6.2, 8),
      phong(0xf0e8dc, { shininess: 22, specular: 0x8a7a64 }),
    ),
  );
  lower.position.y = 4.2;
  light.add(lower);
  const stripe = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.32, 1.6, 8), lambert(0xa24b3a)));
  stripe.position.y = 4.4;
  light.add(stripe);
  const lanternMat = new THREE.MeshLambertMaterial({
    color: 0xffe7b8,
    emissive: 0xffcc77,
    emissiveIntensity: 0.8,
  });
  const lantern = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.9, 1.3, 8),
    lanternMat,
  );
  lantern.position.y = 8;
  light.add(lantern);
  light.userData.emit = [lanternMat];
  const cap = addShadow(new THREE.Mesh(new THREE.ConeGeometry(1.15, 1.1, 8), lambert(0x3d2a22)));
  cap.position.y = 8.9;
  light.add(cap);
  return light;
}

function createRocks() {
  const group = new THREE.Group();
  const mat = lambert(0x6a6864);
  const sizes = [
    [3.4, 2.6, 2.8, -1.2, 1.1, 0],
    [2.2, 1.6, 2.4, 2.4, 0.8, 1.4],
    [1.5, 1.1, 1.3, 0.4, 0.55, -2.2],
  ];
  for (const [sx, sy, sz, x, y, z] of sizes) {
    const rock = addShadow(new THREE.Mesh(new THREE.DodecahedronGeometry(1, 0), mat));
    rock.scale.set(sx, sy, sz);
    rock.position.set(x, y, z);
    group.add(rock);
  }
  return group;
}

function createDock() {
  const group = new THREE.Group();
  const water = new THREE.Mesh(
    new THREE.CircleGeometry(9, 18),
    lambert(0x2f6a78, { transparent: true, opacity: 0.9 }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(-2, 0.05, -2);
  group.add(water);
  const dock = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.16, 6.5), lambert(0x6a5344)), true, true);
  dock.position.set(1.6, 0.18, 0.4);
  group.add(dock);
  const hull = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.35, 2.4), lambert(0xc4b49a)));
  hull.position.set(3.1, 0.28, 1.2);
  group.add(hull);
  const house = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.8, 2.8), lambert(0xd8c8b0)));
  house.position.set(5.4, 0.9, -1.6);
  group.add(house);
  const roof = addShadow(new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.16, 3.1), lambert(0x4a5a52)));
  roof.position.set(5.4, 1.86, -1.6);
  group.add(roof);
  return group;
}

function createMesa() {
  const group = new THREE.Group();
  const top = addShadow(
    new THREE.Mesh(new THREE.CylinderGeometry(5.4, 6.4, 3.6, 7), lambert(0xb07a48)),
  );
  top.position.y = 1.7;
  group.add(top);
  const cap = addShadow(
    new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5.2, 0.7, 7), lambert(0xc49660)),
  );
  cap.position.y = 3.7;
  group.add(cap);
  return group;
}

function createChapel() {
  const group = new THREE.Group();
  const body = addShadow(
    new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 2.6, 5.2),
      phong(0xf0e8dc, { shininess: 22, specular: 0x8a7a64 }),
    ),
  );
  body.position.y = 1.3;
  group.add(body);
  const roof = addShadow(new THREE.Mesh(new THREE.ConeGeometry(3.4, 1.8, 4), woodPhong(0x5a4a3c)));
  roof.position.y = 3.4;
  roof.rotation.y = Math.PI / 4;
  group.add(roof);
  const steeple = addShadow(
    new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.2, 0.7), phong(0xf0e8dc, { shininess: 22 })),
  );
  steeple.position.set(0, 3.6, -1.8);
  group.add(steeple);
  const spire = addShadow(new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.3, 4), woodPhong(0x3d2a22)));
  spire.position.set(0, 5.1, -1.8);
  group.add(spire);
  return group;
}

function createLandmark(kind) {
  if (kind === 'barn') {
    const group = new THREE.Group();
    group.add(createBarn());
    const mill = createWindmill();
    mill.position.set(8.2, 0, -2.4);
    mill.scale.setScalar(0.88);
    group.add(mill);
    return group;
  }
  if (kind === 'barns') {
    const group = new THREE.Group();
    group.add(createBarn());
    const silo = createSilo();
    silo.position.set(4.6, 0, -1.2);
    group.add(silo);
    return group;
  }
  if (kind === 'pond') return createPond();
  if (kind === 'diner') return createDiner();
  if (kind === 'lighthouse') return createLighthouse();
  if (kind === 'silo') {
    const farm = new THREE.Group();
    const barn = createBarn();
    barn.position.set(-4.2, 0, 0);
    farm.add(barn);
    const silo = createSilo();
    silo.position.set(2.2, 0, -1);
    farm.add(silo);
    return farm;
  }
  if (kind === 'rocks') return createRocks();
  if (kind === 'dock') return createDock();
  if (kind === 'mesa') return createMesa();
  if (kind === 'chapel') return createChapel();
  return createBarn();
}

function createHayBale() {
  const bale = addShadow(
    new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.15, 8), lambert(0xc4a24a)),
  );
  bale.rotation.z = Math.PI / 2;
  bale.position.y = 0.7;
  return bale;
}

function createReed() {
  const group = new THREE.Group();
  const mat = lambert(0x6a7a40);
  for (let i = 0; i < 5; i += 1) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, 1.1 + (i % 3) * 0.2, 4), mat);
    stem.position.set((i - 2) * 0.16, 0.6, (i % 2) * 0.1);
    group.add(stem);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.07, 4, 4), lambert(0x6a4a28));
    head.position.set(stem.position.x, 1.15 + (i % 3) * 0.1, stem.position.z);
    group.add(head);
  }
  return group;
}

function createFenceRun(length = 9.5) {
  const group = new THREE.Group();
  const postMat = woodPhong(0x4a382c);
  const railMat = woodPhong(0x5a4030);
  const posts = 3;
  const spacing = length / (posts - 1);
  for (let i = 0; i < posts; i += 1) {
    const post = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.18, 0.13), postMat));
    post.position.set(0, 0.59, -i * spacing);
    group.add(post);
  }
  for (const y of [0.4, 0.8]) {
    const rail = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, length), railMat));
    rail.position.set(0, y, -length / 2);
    group.add(rail);
  }
  return group;
}

function createMailbox() {
  const box = new THREE.Group();
  const post = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 0.1), lambert(0x5a4a3c)));
  post.position.y = 0.55;
  box.add(post);
  const head = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.5), lambert(0x4a5c68)));
  head.position.y = 1.12;
  box.add(head);
  return box;
}

export function createMailTruck() {
  const truck = new THREE.Group();
  const white = lambert(0xe8e4dc);
  const blue = lambert(0x3a5a7a);
  const dark = lambert(0x2a2622);
  const body = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1.55, 1.35, 3.35), white));
  body.position.y = 1.12;
  truck.add(body);
  const cab = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.72, 1.05), white));
  cab.position.set(0, 1.72, -1.05);
  truck.add(cab);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.57, 0.22, 3.36), blue);
  stripe.position.y = 1.05;
  truck.add(stripe);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.42, 0.06), lambert(0x243038));
  glass.position.set(0, 1.78, -1.56);
  truck.add(glass);
  const bumper = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.12, 0.16), lambert(0x9a968c));
  bumper.position.set(0, 0.48, -1.72);
  truck.add(bumper);
  const rubber = lambert(0x1a1816);
  for (const [x, z] of [
    [-0.72, -1.05],
    [0.72, -1.05],
    [-0.72, 1.15],
    [0.72, 1.15],
  ]) {
    const wheel = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 8), rubber));
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.28, z);
    truck.add(wheel);
  }
  truck.userData.kind = 'mail';
  return truck;
}

export function createDeer() {
  const deer = new THREE.Group();
  const hide = lambert(0x9a6238);
  const hideDark = lambert(0x6e4324);
  const dark = lambert(0x3a281c);
  const cream = new THREE.MeshLambertMaterial({
    color: 0xf7f0e4,
    emissive: 0xe8dcc8,
    emissiveIntensity: 0.22,
  });
  const hoofMat = lambert(0x1c1612);

  const body = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.44, 1.14), hide));
  body.position.set(0, 1.18, 0.04);
  deer.add(body);

  const chest = addShadow(new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 5), hide));
  chest.position.set(0, 1.12, -0.44);
  chest.scale.set(0.74, 0.9, 1.08);
  deer.add(chest);

  const rump = addShadow(new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 5), hide));
  rump.position.set(0, 1.2, 0.5);
  rump.scale.set(0.82, 0.84, 0.98);
  deer.add(rump);

  const patch = new THREE.Mesh(new THREE.CircleGeometry(0.26, 10), cream);
  patch.position.set(0, 1.26, 0.9);
  deer.add(patch);
  const patchSide = new THREE.Mesh(new THREE.CircleGeometry(0.18, 8), cream);
  patchSide.position.set(0.16, 1.24, 0.72);
  patchSide.rotation.y = 0.9;
  deer.add(patchSide);

  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.26, 0.1), cream);
  tail.position.set(0, 1.48, 0.92);
  tail.rotation.x = 0.42;
  deer.add(tail);

  const headRig = new THREE.Group();
  headRig.position.set(0, 1.22, -0.48);
  deer.add(headRig);

  const neck = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.15, 0.86, 5), hide));
  neck.position.set(0, 0.34, -0.3);
  neck.rotation.x = 0.58;
  headRig.add(neck);

  const head = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.34), hideDark));
  head.position.set(0, 0.7, -0.6);
  headRig.add(head);

  const snout = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.1, 0.26), hideDark));
  snout.position.set(0, 0.64, -0.82);
  headRig.add(snout);

  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.055, 0.05), dark);
  nose.position.set(0, 0.62, -0.96);
  headRig.add(nose);

  for (const x of [-0.11, 0.11]) {
    const ear = addShadow(new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.28, 4), hide));
    ear.position.set(x, 0.92, -0.48);
    ear.rotation.x = -0.5;
    ear.rotation.z = x > 0 ? 0.52 : -0.52;
    headRig.add(ear);
  }

  for (const [x, z, rear] of [
    [-0.12, -0.36, false],
    [0.12, -0.36, false],
    [-0.13, 0.46, true],
    [0.13, 0.46, true],
  ]) {
    const upper = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.54, 0.09), hideDark));
    upper.position.set(x, 0.86, z);
    upper.rotation.x = rear ? 0.14 : -0.1;
    deer.add(upper);

    const lowerZ = z + (rear ? 0.1 : -0.08);
    const lower = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.5, 0.07), dark));
    lower.position.set(x, 0.38, lowerZ);
    deer.add(lower);

    const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.13), hoofMat);
    hoof.position.set(x, 0.1, lowerZ + (rear ? 0.02 : -0.02));
    deer.add(hoof);
  }

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 1.7),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.05;
  shadow.renderOrder = -1;
  deer.add(shadow);

  deer.userData.kind = 'deer';
  deer.userData.head = headRig;
  return deer;
}

export function createNeonSign() {
  const sign = new THREE.Group();
  const post = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.6, 0.12), lambert(0x3a3834)));
  post.position.y = 1.8;
  sign.add(post);
  const neonMat = new THREE.MeshLambertMaterial({
    color: 0xe07050,
    emissive: 0xc45c2a,
    emissiveIntensity: 0.7,
  });
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.62, 0.1), neonMat);
  board.position.set(0, 3.35, 0);
  sign.add(board);
  const eat = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.28, 0.08),
    new THREE.MeshLambertMaterial({
      color: 0xf7e7c7,
      emissive: 0xe8c090,
      emissiveIntensity: 0.55,
    }),
  );
  eat.position.set(0, 3.35, 0.08);
  sign.add(eat);
  sign.userData.neon = [neonMat, eat.material];
  sign.userData.kind = 'neon';
  return sign;
}

function createLampPost() {
  const lamp = new THREE.Group();
  const post = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.2, 5), lambert(0x3a3834)));
  post.position.y = 1.6;
  lamp.add(post);
  const bulbMat = new THREE.MeshLambertMaterial({
    color: 0xffe7b8,
    emissive: 0xffcc88,
    emissiveIntensity: 0.55,
  });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 6, 5), bulbMat);
  bulb.position.y = 3.25;
  lamp.add(bulb);
  lamp.userData.emit = [bulbMat];
  return lamp;
}

function createDune() {
  const dune = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(2.4, 7, 5), lambert(0xd4c4a0)),
    false,
    true,
  );
  dune.scale.set(1.8, 0.28, 1.1);
  dune.position.y = 0.2;
  return dune;
}

function createTuft(color) {
  const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.55, 5), lambert(color));
  tuft.position.y = 0.22;
  return tuft;
}

function createRock() {
  const rock = addShadow(new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 0), lambert(0x6e6a64)));
  rock.position.y = 0.2;
  rock.rotation.set(0.3, 0.4, 0.1);
  return rock;
}

function createWildflowers(color) {
  const bunch = new THREE.Group();
  for (let i = 0; i < 4; i += 1) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.4, 4), lambert(0x4a6a34));
    stem.position.set((i - 1.5) * 0.14, 0.2, (i % 2) * 0.1);
    bunch.add(stem);
    const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.07, 4, 4), lambert(color));
    bloom.position.set(stem.position.x, 0.42, stem.position.z);
    bunch.add(bloom);
  }
  return bunch;
}

function disposeObject(object) {
  object.traverse((node) => {
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      mats.forEach((mat) => mat.dispose());
    }
  });
}

export function clearGroup(group) {
  const children = [...group.children];
  for (const child of children) {
    group.remove(child);
    disposeObject(child);
  }
}

// Road plane is 8.4 wide; dirt shoulders extend to about |x| = 6.1.
const ROADSIDE_X = 6.7;
const HERO_SLOT = { x: -18, z: -48, far: 170, near: 24 };

function offRoadX(x, minAbs = ROADSIDE_X) {
  const sign = x < 0 ? -1 : 1;
  return sign * Math.max(Math.abs(x), minAbs);
}

export function populateScenery(scenery, theme) {
  const movers = [];
  const spin = [];
  function place(object, x, z, far = 170, near = 18, speed = 1, minAbsX = ROADSIDE_X) {
    object.position.x = offRoadX(x, minAbsX);
    object.position.z = z;
    scenery.add(object);
    movers.push({ obj: object, far, near, speed });
  }

  const treeCount = theme.treeKind === 'pine' ? 16 : theme.treeKind === 'sage' || theme.treeKind === 'scrub' ? 10 : 12;
  for (let i = 0; i < treeCount; i += 1) {
    const tree = makeTree(theme.treeKind, theme.foliage[i % theme.foliage.length]);
    const side = i % 2 === 0 ? -1 : 1;
    const x = side * (11.5 + (i % 5) * 3.6 + (i % 3) * 0.8);
    tree.scale.setScalar(0.88 + (i % 5) * 0.14);
    if (theme.treeKind === 'pine') tree.scale.setScalar(1.02 + (i % 4) * 0.2);
    place(tree, x, -140 + i * 14.5);
  }

  if (theme.extras === 'fence' || theme.extras === 'sparse') {
    const count = theme.extras === 'sparse' ? 5 : 8;
    const gap = theme.extras === 'sparse' ? 28 : 18;
    for (let i = 0; i < count; i += 1) {
      for (const side of [-1, 1]) {
        const run = createFenceRun(theme.extras === 'sparse' ? 8 : 10);
        place(run, side * 7.15, -118 + i * gap, 160, 18);
      }
    }
  }

  if (theme.extras === 'reeds') {
    for (let i = 0; i < 12; i += 1) {
      const reed = createReed();
      const side = i % 2 === 0 ? -1 : 1;
      place(reed, side * (7.4 + (i % 4) * 1.5), -130 + i * 16, 160, 16);
    }
  }

  if (theme.extras === 'town') {
    for (let i = 0; i < 6; i += 1) {
      const lamp = createLampPost();
      const side = i % 2 === 0 ? -1 : 1;
      place(lamp, side * 7.0, -110 + i * 24, 170, 16);
    }
    for (let i = 0; i < 4; i += 1) {
      const mail = createMailbox();
      const side = i % 2 === 0 ? -1 : 1;
      place(mail, side * 6.9, -88 + i * 32, 160, 14);
    }
  }

  if (theme.extras === 'dunes') {
    for (let i = 0; i < 6; i += 1) {
      const dune = createDune();
      const side = i % 2 === 0 ? -1 : 1;
      dune.scale.x *= 1 + (i % 3) * 0.2;
      place(dune, side * (16 + (i % 3) * 3), -130 + i * 22, 170, 20, 0.9, 16);
    }
  }

  if (theme.extras === 'hay') {
    for (let i = 0; i < 8; i += 1) {
      const bale = createHayBale();
      const side = i % 2 === 0 ? -1 : 1;
      place(bale, side * (8.8 + (i % 3) * 1.8), -125 + i * 18, 165, 16);
    }
  }

  if (theme.extras === 'sage') {
    for (let i = 0; i < 8; i += 1) {
      const sage = createSage(theme.foliage[i % theme.foliage.length]);
      const side = i % 2 === 0 ? -1 : 1;
      place(sage, side * (9 + (i % 4) * 2.4), -135 + i * 18, 165, 16);
    }
  }

  for (let i = 0; i < 10; i += 1) {
    const tuft = createTuft(theme.foliage[i % theme.foliage.length]);
    const side = i % 2 === 0 ? -1 : 1;
    place(tuft, side * (7.25 + (i % 5) * 1.15), -138 + i * 16, 160, 14);
  }

  for (let i = 0; i < 4; i += 1) {
    const rock = createRock();
    const side = i % 2 === 0 ? -1 : 1;
    place(rock, side * (8.2 + (i % 3) * 1.8), -96 + i * 28, 160, 14);
  }

  const flowerColors = [0xc45c2a, 0xe8d48a, 0xd8c8e0, 0xe8a04a];
  for (let i = 0; i < 4; i += 1) {
    const flowers = createWildflowers(flowerColors[i % flowerColors.length]);
    const side = i % 2 === 0 ? -1 : 1;
    place(flowers, side * (7.8 + (i % 3) * 1.3), -72 + i * 32, 160, 14);
  }

  for (let i = 0; i < 2; i += 1) {
    const sign = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 0.08), lambert(0x5a5348));
    pole.position.y = 0.9;
    pole.castShadow = true;
    sign.add(pole);
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.06), lambert(0xc4a24a));
    board.position.y = 1.7;
    sign.add(board);
    const side = i % 2 === 0 ? -1 : 1;
    place(sign, side * 7.05, -54 + i * 70, 170, 16);
  }

  const hero = createLandmark(theme.landmark);
  place(hero, HERO_SLOT.x, HERO_SLOT.z, HERO_SLOT.far, HERO_SLOT.near);
  hero.traverse((node) => {
    if (node.userData && node.userData.blades) spin.push(node.userData.blades);
  });

  return { movers, landmark: theme.landmark, spin };
}
