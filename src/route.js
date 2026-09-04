import * as THREE from 'three';
import { spawnProp } from './props.js';

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

function propOpts(extra = {}) {
  return { woodMap: makePropWoodMap(), ...extra };
}

function makeTree(kind, color) {
  const id = kind === 'willow' || kind === 'pine' || kind === 'scrub' || kind === 'sage' ? kind : 'round';
  return spawnProp(id, propOpts({ tint: color }));
}

function createLandmark(kind) {
  if (kind === 'barn') {
    const group = new THREE.Group();
    group.add(spawnProp('barn', propOpts()));
    const mill = spawnProp('windmill', propOpts());
    mill.position.set(8.2, 0, -2.4);
    mill.scale.setScalar(0.88);
    group.add(mill);
    return group;
  }
  if (kind === 'barns') {
    const group = new THREE.Group();
    group.add(spawnProp('barn', propOpts()));
    const silo = spawnProp('silo', propOpts());
    silo.position.set(4.6, 0, -1.2);
    group.add(silo);
    return group;
  }
  if (kind === 'pond') return spawnProp('pond', propOpts());
  if (kind === 'diner') return spawnProp('diner', propOpts());
  if (kind === 'lighthouse') return spawnProp('lighthouse', propOpts());
  if (kind === 'silo') {
    const farm = new THREE.Group();
    const barn = spawnProp('barn', propOpts());
    barn.position.set(-4.2, 0, 0);
    farm.add(barn);
    const silo = spawnProp('silo', propOpts());
    silo.position.set(2.2, 0, -1);
    farm.add(silo);
    return farm;
  }
  if (kind === 'rocks') return spawnProp('rocks', propOpts());
  if (kind === 'dock') return spawnProp('dock', propOpts());
  if (kind === 'mesa') return spawnProp('mesa', propOpts());
  if (kind === 'chapel') return spawnProp('chapel', propOpts());
  return spawnProp('barn', propOpts());
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
        const run = spawnProp('fence', propOpts());
        if (theme.extras === 'sparse') run.scale.z *= 0.8;
        place(run, side * 7.15, -118 + i * gap, 160, 18);
      }
    }
  }

  if (theme.extras === 'reeds') {
    for (let i = 0; i < 12; i += 1) {
      const reed = spawnProp('reed', propOpts());
      const side = i % 2 === 0 ? -1 : 1;
      place(reed, side * (7.4 + (i % 4) * 1.5), -130 + i * 16, 160, 16);
    }
  }

  if (theme.extras === 'town') {
    for (let i = 0; i < 6; i += 1) {
      const lamp = spawnProp('lamp', propOpts());
      const side = i % 2 === 0 ? -1 : 1;
      place(lamp, side * 7.0, -110 + i * 24, 170, 16);
    }
    for (let i = 0; i < 4; i += 1) {
      const mail = spawnProp('mailbox', propOpts());
      const side = i % 2 === 0 ? -1 : 1;
      place(mail, side * 6.9, -88 + i * 32, 160, 14);
    }
  }

  if (theme.extras === 'dunes') {
    for (let i = 0; i < 6; i += 1) {
      const dune = spawnProp('dune', propOpts());
      const side = i % 2 === 0 ? -1 : 1;
      dune.scale.x *= 1 + (i % 3) * 0.2;
      place(dune, side * (16 + (i % 3) * 3), -130 + i * 22, 170, 20, 0.9, 16);
    }
  }

  if (theme.extras === 'hay') {
    for (let i = 0; i < 8; i += 1) {
      const bale = spawnProp('hay', propOpts());
      const side = i % 2 === 0 ? -1 : 1;
      place(bale, side * (8.8 + (i % 3) * 1.8), -125 + i * 18, 165, 16);
    }
  }

  if (theme.extras === 'sage') {
    for (let i = 0; i < 8; i += 1) {
      const sage = spawnProp('sage', propOpts({ tint: theme.foliage[i % theme.foliage.length] }));
      const side = i % 2 === 0 ? -1 : 1;
      place(sage, side * (9 + (i % 4) * 2.4), -135 + i * 18, 165, 16);
    }
  }

  for (let i = 0; i < 10; i += 1) {
    const tuft = spawnProp('tuft', propOpts({ tint: theme.foliage[i % theme.foliage.length] }));
    const side = i % 2 === 0 ? -1 : 1;
    place(tuft, side * (7.25 + (i % 5) * 1.15), -138 + i * 16, 160, 14);
  }

  for (let i = 0; i < 4; i += 1) {
    const rock = spawnProp('rock', propOpts());
    const side = i % 2 === 0 ? -1 : 1;
    place(rock, side * (8.2 + (i % 3) * 1.8), -96 + i * 28, 160, 14);
  }

  const flowerColors = [0xc45c2a, 0xe8d48a, 0xd8c8e0, 0xe8a04a];
  for (let i = 0; i < 4; i += 1) {
    const flowers = spawnProp('wildflowers', propOpts({ tint: flowerColors[i % flowerColors.length] }));
    const side = i % 2 === 0 ? -1 : 1;
    place(flowers, side * (7.8 + (i % 3) * 1.3), -72 + i * 32, 160, 14);
  }

  for (let i = 0; i < 2; i += 1) {
    const sign = spawnProp('sign', propOpts());
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
