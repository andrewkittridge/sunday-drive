import * as THREE from 'three';
import {
  clearGroup,
  createDeer,
  createMailTruck,
  createNeonSign,
  populateScenery,
  themeFor,
} from './route.js';

// THREE.MathUtils.smoothstep is (x, min, max). Lighting wants GLSL-style
// inverse: 0 when value >= high, 1 when value <= low.
function airFalloff(value, high, low) {
  if (high === low) return value <= low ? 1 : 0;
  const t = THREE.MathUtils.clamp((high - value) / (high - low), 0, 1);
  return t * t * (3 - 2 * t);
}

const DECK = {
  roadY: 0.08,
  restY: 0.08,
  cookieY: 0.098,
  cookieW: 8.6,
  cookieLen: 9.4,
  cookieZ: -6.7,
  kissDistance: 11,
  kissDecay: 1.6,
  hillInner: 12,
  keyYFloor: 5.2,
  keyReach: 58,
  camFov: 50,
  camNear: 0.6,
  fogNearDay: 34,
  fogFarDay: 128,
  meltAgree: 0.58,
  cloudFar: 130,
  cloudNear: 22,
  cloudZRate: 0.1,
};

const CLOUD_LANES = [
  { x: -22, y: 17.6, z: -48, scale: 1.08 },
  { x: 16, y: 20.0, z: -76, scale: 1.22 },
  { x: 30, y: 16.2, z: -112, scale: 0.88 },
  { x: -12, y: 21.4, z: -94, scale: 1.02 },
];

const WHITE = new THREE.Color(0xffffff);
const moonFill = new THREE.Color(0x8a96b8);
const nightCloud = new THREE.Color(0x6e7c98);
const nightShade = new THREE.Color(0x2e3848);
const moonRim = new THREE.Color(0xd4dcec);
const roadSpecDay = new THREE.Color(0x5a5448);
const roadSpecDusk = new THREE.Color(0x8a7a60);
const roadSpecNight = new THREE.Color(0x9a8a68);
const tmpA = new THREE.Color();
const tmpB = new THREE.Color();
const tmpC = new THREE.Color();

function allocPalette() {
  return {
    id: 'county',
    weather: 'leaves',
    landmark: 'barn',
    extras: 'fence',
    grassMap: 'green',
    treeKind: 'round',
    grass: new THREE.Color(),
    horizon: new THREE.Color(),
    shoulder: new THREE.Color(),
    hills: [],
    hillScale: [1, 1, 1],
    skyTop: new THREE.Color(),
    skyBottom: new THREE.Color(),
    duskTop: new THREE.Color(),
    duskBottom: new THREE.Color(),
    nightTop: new THREE.Color(),
    nightBottom: new THREE.Color(),
    fog: new THREE.Color(),
    duskFog: new THREE.Color(),
    nightFog: new THREE.Color(),
    hemiSky: new THREE.Color(),
    hemiDusk: new THREE.Color(),
    hemiGround: new THREE.Color(),
    sunDay: new THREE.Color(),
    sunDusk: new THREE.Color(),
    cloud: new THREE.Color(),
  };
}

function allocAir() {
  return {
    phase: 0,
    altitude: 0,
    dusk: 0,
    night: 0,
    glow: new THREE.Color(),
    glowAmount: 0,
    skyTop: new THREE.Color(),
    skyMid: new THREE.Color(),
    skyBottom: new THREE.Color(),
    fogColor: new THREE.Color(),
    fogNear: DECK.fogNearDay,
    fogFar: DECK.fogFarDay,
    sunPos: new THREE.Vector3(),
    moonPos: new THREE.Vector3(),
    sunVisible: true,
    moonVisible: false,
    disc: new THREE.Vector3(),
    keyPosition: new THREE.Vector3(),
    keyColor: new THREE.Color(),
    keyIntensity: 1,
    fillColor: new THREE.Color(),
    fillIntensity: 0.16,
    hemiSky: new THREE.Color(),
    hemiGround: new THREE.Color(),
    hemiIntensity: 0.7,
    grassTint: new THREE.Color(0xffffff),
    cloudLit: new THREE.Color(),
    cloudShade: new THREE.Color(),
    cloudRim: new THREE.Color(),
    cloudUnder: new THREE.Color(),
    cloudOpacity: 0.84,
    cloudLightDir: new THREE.Vector3(-0.55, 0.42, 0.28),
    cookieColor: new THREE.Color(),
    cookieStrength: 0,
    exposure: 1.14,
    lampSpots: 0,
    lampKiss: 0,
    lampTails: 0.16,
    cabin: 0.16,
    motes: 0,
    emissive: 0.12,
  };
}

function fillPalette(theme, palette) {
  palette.id = theme.id;
  palette.weather = theme.weather;
  palette.landmark = theme.landmark;
  palette.extras = theme.extras;
  palette.grassMap = theme.grassMap;
  palette.treeKind = theme.treeKind;
  palette.grass.setHex(theme.grass);
  palette.horizon.setHex(theme.horizon);
  palette.shoulder.setHex(theme.shoulder);
  palette.hills = theme.hills;
  palette.hillScale = theme.hillScale;
  palette.skyTop.setHex(theme.skyTop);
  palette.skyBottom.setHex(theme.skyBottom);
  palette.duskTop.setHex(theme.duskTop);
  palette.duskBottom.setHex(theme.duskBottom);
  palette.nightTop.setHex(theme.nightTop);
  palette.nightBottom.setHex(theme.nightBottom);
  palette.fog.setHex(theme.fog);
  palette.duskFog.setHex(theme.duskFog);
  palette.nightFog.setHex(theme.nightFog);
  palette.hemiSky.setHex(theme.hemiSky);
  palette.hemiDusk.setHex(theme.hemiDusk);
  palette.hemiGround.setHex(theme.hemiGround);
  palette.sunDay.setHex(theme.sunDay);
  palette.sunDusk.setHex(theme.sunDusk);
  palette.cloud.setHex(theme.cloud);
}

function cycleAt(phase, out) {
  const azimuth = phase * Math.PI * 2;
  out.phase = phase;
  out.altitude = Math.sin(azimuth);
  out.dusk = airFalloff(out.altitude, 0.42, 0.05);
  out.night = airFalloff(out.altitude, 0.1, -0.16);
  out.sunPos.set(-Math.cos(azimuth) * 52, out.altitude * 26, -90);
  out.moonPos.set(Math.cos(azimuth) * 50, Math.max(0.2, -out.altitude) * 26, -86);
  out.sunVisible = out.altitude > -0.08;
  out.moonVisible = out.night > 0.12;
  const disc = out.sunVisible ? 'sun' : 'moon';
  out.disc.copy(disc === 'sun' ? out.sunPos : out.moonPos);
  return disc;
}

function scoreAir(palette, phase, out) {
  cycleAt(phase, out);

  out.glow
    .copy(palette.duskBottom)
    .lerp(palette.sunDusk, 0.22)
    .lerp(palette.nightBottom, out.night);
  out.glow.lerp(palette.horizon, 0.22 * (1 - out.night) + 0.12);

  out.skyTop
    .copy(palette.skyTop)
    .lerp(palette.duskTop, out.dusk * 0.18)
    .lerp(palette.nightTop, out.night);
  tmpA.copy(palette.skyBottom).lerp(palette.sunDusk, 0.42);
  tmpB.copy(palette.duskBottom).lerp(palette.sunDusk, 0.28);
  tmpC.copy(palette.nightBottom).lerp(palette.nightTop, 0.4);
  out.skyMid.copy(tmpA).lerp(tmpB, out.dusk).lerp(tmpC, out.night);
  out.skyBottom
    .copy(palette.skyBottom)
    .lerp(palette.duskBottom, out.dusk)
    .lerp(palette.nightBottom, out.night);
  out.glowAmount = 0.16 + out.dusk * 0.14 - out.night * 0.1;

  tmpA.copy(palette.fog).lerp(palette.duskFog, out.dusk).lerp(palette.nightFog, out.night);
  out.fogColor.copy(tmpA).lerp(out.glow, DECK.meltAgree);
  out.fogColor.multiplyScalar(0.9 + out.dusk * 0.04 - out.night * 0.02);
  out.fogNear = DECK.fogNearDay + out.dusk * 2 + out.night * 4;
  out.fogFar = DECK.fogFarDay + out.dusk * 2 - out.night * 12;

  out.keyPosition.copy(out.disc).normalize().multiplyScalar(DECK.keyReach);
  out.keyPosition.y = Math.max(DECK.keyYFloor, out.keyPosition.y);
  out.keyColor.copy(palette.sunDay).lerp(palette.sunDusk, out.dusk).lerp(moonFill, out.night);
  out.keyIntensity = Math.max(0.12, 1.68 - out.dusk * 0.38 - out.night * 1.35);
  out.fillColor.copy(palette.sunDay).lerp(palette.sunDusk, out.dusk * 0.4).lerp(moonFill, out.night);
  out.fillIntensity = Math.max(0.04, 0.16 - out.dusk * 0.02 - out.night * 0.12);

  out.hemiSky.copy(palette.hemiSky).lerp(palette.hemiDusk, out.dusk).lerp(moonFill, out.night * 0.55);
  out.hemiIntensity = 0.58 + (1 - out.dusk) * 0.16 - out.night * 0.18;
  tmpA.copy(palette.horizon).multiplyScalar(0.35);
  out.hemiGround
    .copy(palette.hemiGround)
    .lerp(palette.horizon, out.dusk * 0.45)
    .lerp(tmpA, out.night);

  out.grassTint.copy(palette.grass).lerp(WHITE, 0.55);
  out.grassTint.r *= 1 - out.night * 0.38;
  out.grassTint.g *= 1 - out.night * 0.35;
  out.grassTint.b *= 1 - out.night * 0.28;

  const cloudNight = Math.max(0, Math.min(1, (out.night - 0.28) / 0.6));
  out.cloudLit
    .copy(palette.cloud)
    .lerp(palette.sunDusk, out.dusk * 0.42)
    .lerp(nightCloud, cloudNight);
  out.cloudShade
    .copy(palette.cloud)
    .multiplyScalar(0.72)
    .lerp(palette.hemiDusk, out.dusk * 0.45)
    .lerp(nightShade, cloudNight);
  out.cloudRim.copy(palette.sunDusk).lerp(moonRim, cloudNight);
  out.cloudUnder
    .copy(palette.sunDusk)
    .lerp(palette.cloud, 0.18)
    .lerp(moonRim, cloudNight * 0.55);
  out.cloudOpacity = 0.84 - cloudNight * 0.08;
  out.cloudLightDir.copy(out.disc).normalize();

  out.cookieColor.copy(palette.sunDusk).lerp(palette.sunDay, 0.15).lerp(moonFill, out.night * 0.25);
  out.cookieStrength = out.dusk * 0.4 + out.night * 0.62;
  out.exposure = 1.14 - out.dusk * 0.1 - out.night * 0.22;
  out.emissive = 0.12 + out.dusk * 0.35 + out.night * 0.85;
  out.lampSpots = out.dusk * 4.2 + out.night * 8.5;
  out.lampKiss = out.dusk * 1.2 + out.night * 2.4;
  out.lampTails = 0.16 + out.dusk * 0.35 + out.night * 0.7;
  out.cabin = 0.16 + out.dusk * 0.1 + out.night * 0.14;
  out.motes = out.dusk * 0.35 + out.night * 0.65;
  return out;
}

function paintAir(stage, air) {
  const { skyMat, scene, hemi, sunLight, fill, renderer } = stage;
  skyMat.uniforms.topColor.value.copy(air.skyTop);
  skyMat.uniforms.midColor.value.copy(air.skyMid);
  skyMat.uniforms.bottomColor.value.copy(air.skyBottom);
  skyMat.uniforms.glowColor.value.copy(air.glow);
  skyMat.uniforms.glow.value = air.glowAmount;
  skyMat.uniforms.topEnd.value = 0.22 + air.dusk * 0.04 + air.night * 0.1;

  scene.fog.color.copy(air.fogColor);
  scene.fog.near = air.fogNear;
  scene.fog.far = air.fogFar;
  scene.background.copy(air.fogColor);

  hemi.color.copy(air.hemiSky);
  hemi.groundColor.copy(air.hemiGround);
  hemi.intensity = air.hemiIntensity;

  sunLight.color.copy(air.keyColor);
  sunLight.intensity = air.keyIntensity;
  sunLight.position.copy(air.keyPosition);

  fill.color.copy(air.fillColor);
  fill.intensity = air.fillIntensity;

  renderer.toneMappingExposure = air.exposure;

  stage.sun.position.copy(air.sunPos);
  stage.sun.visible = air.sunVisible;
  stage.sunGlow.material.opacity = 0.16 + air.dusk * 0.12 - air.night * 0.1;
  stage.moon.position.copy(air.moonPos);
  stage.moon.visible = air.moonVisible;
  stage.moonGlow.material.opacity = 0.07 + air.night * 0.11;
  stage.stars.visible = air.night > 0.18;
  stage.starMat.opacity = air.night * 0.48;
  stage.stars.rotation.y = air.phase * 0.15;

  const cloud = stage.cloudUniforms;
  cloud.uLit.value.copy(air.cloudLit);
  cloud.uShade.value.copy(air.cloudShade);
  cloud.uRim.value.copy(air.cloudRim);
  cloud.uUnder.value.copy(air.cloudUnder);
  cloud.uOpacity.value = air.cloudOpacity;
  cloud.uLightDir.value.copy(air.cloudLightDir);
  if (cloud.uFogColor) {
    cloud.uFogColor.value.copy(air.fogColor);
    cloud.uFogNear.value = air.fogNear;
    cloud.uFogFar.value = air.fogFar;
  }

  stage.grass.material.color.copy(air.grassTint);
  stage.road.material.shininess = 22 + air.dusk * 10 + air.night * 16;
  stage.road.material.specular.copy(roadSpecDay).lerp(roadSpecDusk, air.dusk).lerp(roadSpecNight, air.night);

  const car = stage.car;
  car.userData.lights.emissiveIntensity = 0.18 + air.dusk * 0.7 + air.night * 1.15;
  car.userData.tails.emissiveIntensity = air.lampTails;
  car.userData.spots.forEach((spot) => {
    spot.intensity = air.lampSpots;
  });
  car.userData.kiss.intensity = air.lampKiss;
  const cookie = stage.cookie || car.userData.kissMesh;
  if (cookie) {
    cookie.material.uniforms.uStrength.value = air.cookieStrength;
    cookie.material.uniforms.uColor.value.copy(air.cookieColor);
    cookie.visible = air.cookieStrength > 0.05;
  }
  if (car.userData.glass) {
    car.userData.glass.emissiveIntensity = 0.05 + air.dusk * 0.06 + air.night * 0.12;
  }
  if (car.userData.cabinFill) {
    car.userData.cabinFill.intensity = air.cabin;
  }
  if (car.userData.cabinGlow) {
    car.userData.cabinGlow.material.opacity = 0.08 + air.dusk * 0.06 + air.night * 0.2;
  }

  for (const mat of stage.emissives) {
    const base = mat.userData.baseEmissive ?? 0.35;
    mat.emissiveIntensity = base * air.emissive;
  }
}

function recycleZ(object, speedDt, far, near) {
  object.position.z += speedDt;
  if (object.position.z > near) object.position.z -= far;
}

function tickClouds(clouds, dt, speed, reduced) {
  const xRate = reduced ? 0.05 : 0.22;
  clouds.forEach((cloud, i) => {
    cloud.position.x += dt * (xRate + i * 0.03 * (reduced ? 0.2 : 1));
    if (cloud.position.x > 58) cloud.position.x = -58;
    if (cloud.position.x < -58) cloud.position.x = 58;
    recycleZ(cloud, speed * DECK.cloudZRate * dt, DECK.cloudFar, DECK.cloudNear);
    if (cloud.userData.baseScale) cloud.scale.setScalar(cloud.userData.baseScale);
  });
}

function seatCookie(stage, car) {
  const cookie = stage.cookie;
  if (!cookie) return;
  cookie.position.set(car.position.x, DECK.cookieY, car.position.z + DECK.cookieZ);
  cookie.rotation.set(-Math.PI / 2, 0, 0);
}

function canvasTexture(size, paint, wrap = 'repeat') {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  paint(canvas.getContext('2d'), size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (wrap === 'clamp') {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  } else {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  }
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function makeGrassTexture(base, dark, light) {
  return canvasTexture(256, (ctx, size) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 2400; i += 1) {
      ctx.fillStyle = Math.random() > 0.42 ? dark : light;
      ctx.fillRect(
        Math.random() * size,
        Math.random() * size,
        1 + Math.random() * 2,
        2 + Math.random() * 5,
      );
    }
    for (let i = 0; i < 90; i += 1) {
      ctx.fillStyle = Math.random() > 0.5 ? '#d4c36a' : '#e8d48a';
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }
  });
}

function makeRoadTexture() {
  return canvasTexture(256, (ctx, size) => {
    ctx.fillStyle = '#4a4743';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 2200; i += 1) {
      const shade = 68 + Math.random() * 38;
      ctx.fillStyle = `rgb(${shade},${shade - 2},${shade - 8})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }
    ctx.fillStyle = 'rgba(28, 24, 20, 0.2)';
    ctx.fillRect(size * 0.27, 0, 20, size);
    ctx.fillRect(size * 0.64, 0, 20, size);
    ctx.fillStyle = '#efe6d4';
    ctx.fillRect(7, 0, 7, size);
    ctx.fillRect(size - 14, 0, 7, size);
    ctx.fillStyle = '#e6c15a';
    const dash = Math.floor(size * 0.46);
    ctx.fillRect(size / 2 - 4, 10, 8, dash);
  });
}

function makeWoodTexture() {
  const texture = canvasTexture(128, (ctx, size) => {
    ctx.fillStyle = '#a86c3c';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 1) {
      const wave = Math.sin(y * 0.28) * 8 + Math.sin(y * 0.07) * 14;
      ctx.fillStyle = y % 13 === 0 ? '#6e4020' : y % 5 === 0 ? '#c48852' : '#9a6234';
      ctx.fillRect(0, y, size, 1);
      ctx.fillStyle = 'rgba(40, 20, 8, 0.18)';
      ctx.fillRect(16 + wave, y, 12, 1);
      if (y % 19 === 0) {
        ctx.fillStyle = 'rgba(220, 170, 110, 0.16)';
        ctx.fillRect(0, y, size, 1);
      }
    }
  });
  texture.repeat.set(1, 2);
  return texture;
}

function makeShadowTexture() {
  return canvasTexture(
    128,
    (ctx, size) => {
      const g = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
      g.addColorStop(0, 'rgba(0,0,0,0.56)');
      g.addColorStop(0.38, 'rgba(0,0,0,0.26)');
      g.addColorStop(0.72, 'rgba(0,0,0,0.08)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    },
    'clamp',
  );
}

function makeCookieMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uStrength: { value: 0 },
      uColor: { value: new THREE.Color('#f0a24a') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uStrength;
      uniform vec3 uColor;
      varying vec2 vUv;

      float lamp(vec2 uv, vec2 origin) {
        vec2 p = uv - origin;
        p.x *= 2.05;
        p.y *= 1.12;
        float d = dot(p, p);
        float core = exp(-d * 7.6);
        float wash = exp(-d * 2.4);
        return core * 0.62 + wash * 0.34;
      }

      void main() {
        float a = lamp(vUv, vec2(0.36, 0.11)) + lamp(vUv, vec2(0.64, 0.11));
        a = min(a, 1.0);
        a *= smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
        a *= smoothstep(0.0, 0.06, vUv.y) * smoothstep(0.78, 0.22, vUv.y);
        a *= uStrength;
        gl_FragColor = vec4(uColor, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    fog: false,
    blending: THREE.AdditiveBlending,
    polygonOffset: true,
    polygonOffsetFactor: -3,
    polygonOffsetUnits: -3,
  });
}

function makeMoteTexture() {
  return canvasTexture(
    32,
    (ctx, size) => {
      const g = ctx.createRadialGradient(16, 16, 1, 16, 16, 14);
      g.addColorStop(0, 'rgba(255, 236, 210, 0.9)');
      g.addColorStop(0.35, 'rgba(255, 214, 170, 0.35)');
      g.addColorStop(1, 'rgba(255, 214, 170, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    },
    'clamp',
  );
}

function createCar() {
  const car = new THREE.Group();
  const paint = 0xf3e6cc;
  const bodyMat = new THREE.MeshPhongMaterial({
    color: paint,
    shininess: 22,
    specular: 0x6a5e50,
  });
  const woodMat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: makeWoodTexture(),
    shininess: 14,
    specular: 0x5a4030,
  });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x2a2622 });
  const chromeMat = new THREE.MeshPhongMaterial({
    color: 0xd0ccc0,
    shininess: 110,
    specular: 0xb0aaa0,
  });
  const glassMat = new THREE.MeshPhongMaterial({
    color: 0x4e5c52,
    shininess: 96,
    specular: 0xe8d8c0,
    transparent: true,
    opacity: 0.7,
    emissive: 0x3a2414,
    emissiveIntensity: 0.08,
    depthWrite: false,
  });
  const rubberMat = new THREE.MeshLambertMaterial({ color: 0x1a1816 });
  const interiorMat = new THREE.MeshLambertMaterial({
    color: 0x4a382c,
    emissive: 0x3a2418,
    emissiveIntensity: 0.14,
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.52, 4.38), bodyMat);
  body.position.y = 0.64;
  body.castShadow = true;
  car.add(body);

  const skirt = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.14, 4.28), darkMat);
  skirt.position.y = 0.4;
  car.add(skirt);

  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.1, 1.38), bodyMat);
  hood.position.set(0, 0.92, -1.32);
  hood.rotation.x = 0.07;
  hood.castShadow = true;
  car.add(hood);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.48, 2.92), bodyMat);
  cabin.position.set(0, 1.12, 0.66);
  cabin.castShadow = true;
  car.add(cabin);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.07, 2.72), bodyMat);
  roof.position.set(0, 1.42, 0.48);
  roof.castShadow = true;
  car.add(roof);

  const rearSlope = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.07, 0.95), bodyMat);
  rearSlope.position.set(0, 1.3, 1.78);
  rearSlope.rotation.x = 0.28;
  rearSlope.castShadow = true;
  car.add(rearSlope);

  const interior = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.32, 1.85), interiorMat);
  interior.position.set(0, 0.94, 0.42);
  car.add(interior);

  const cabinGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.22, 0.44),
    new THREE.MeshBasicMaterial({
      color: 0xffc898,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  cabinGlow.position.set(0, 1.15, 2.132);
  car.add(cabinGlow);

  const cabinFill = new THREE.PointLight(0xffc090, 0.2, 2.35, 2);
  cabinFill.position.set(0, 1.08, 0.4);
  car.add(cabinFill);

  for (const x of [-0.58, 0.58]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 2.15), chromeMat);
    rail.position.set(x, 1.48, 0.38);
    car.add(rail);
  }
  for (const z of [-0.55, 1.28]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.04), chromeMat);
    bar.position.set(0, 1.48, z);
    car.add(bar);
  }

  for (const side of [-1, 1]) {
    const wood = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.58, 3.48), woodMat);
    wood.position.set(side * 0.96, 0.74, 0.18);
    wood.castShadow = true;
    car.add(wood);
    const chrome = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.035, 3.5), chromeMat);
    chrome.position.set(side * 1.0, 1.04, 0.18);
    car.add(chrome);
    const chromeLow = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 3.5), chromeMat);
    chromeLow.position.set(side * 1.0, 0.46, 0.18);
    car.add(chromeLow);
  }

  const tailWood = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.72, 0.07), woodMat);
  tailWood.position.set(0, 0.8, 2.21);
  tailWood.castShadow = true;
  car.add(tailWood);
  const tailChrome = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.03, 0.04), chromeMat);
  tailChrome.position.set(0, 1.14, 2.25);
  car.add(tailChrome);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.42, 0.05), glassMat);
  windshield.position.set(0, 1.14, -0.7);
  windshield.rotation.x = -0.28;
  car.add(windshield);

  const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.5, 0.05), glassMat);
  rearGlass.position.set(0, 1.16, 2.14);
  car.add(rearGlass);
  for (const x of [-0.7, 0.7]) {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.54, 0.08), bodyMat);
    pillar.position.set(x, 1.16, 2.16);
    car.add(pillar);
  }

  for (const x of [-0.82, 0.82]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.34, 2.05), glassMat);
    side.position.set(x, 1.14, 0.42);
    car.add(side);
  }

  const bumperF = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.16, 0.22), chromeMat);
  bumperF.position.set(0, 0.44, -2.2);
  car.add(bumperF);
  const bumperB = bumperF.clone();
  bumperB.position.z = 2.22;
  car.add(bumperB);

  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.26, 0.08), darkMat);
  grille.position.set(0, 0.64, -2.18);
  car.add(grille);
  for (const x of [-0.28, -0.1, 0.1, 0.28]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.04), chromeMat);
    bar.position.set(x, 0.64, -2.22);
    car.add(bar);
  }

  const lightMat = new THREE.MeshLambertMaterial({
    color: 0xffe7b8,
    emissive: 0xffcc77,
    emissiveIntensity: 0.35,
  });
  const spots = [];
  for (const x of [-0.62, 0.62]) {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 10), lightMat);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(x, 0.66, -2.2);
    car.add(lamp);

    const spot = new THREE.SpotLight(0xffe4b0, 0, 14, 0.32, 0.9, 2);
    spot.position.set(x, 0.66, -2.22);
    spot.target.position.set(x * 0.12, 0.08, -8.5);
    spot.castShadow = false;
    car.add(spot);
    car.add(spot.target);
    spots.push(spot);
  }

  const kiss = new THREE.PointLight(0xffd8a0, 0, DECK.kissDistance, DECK.kissDecay);
  kiss.position.set(0, 0.2, -2.85);
  car.add(kiss);

  const cookieMat = makeCookieMaterial();
  const kissMesh = new THREE.Mesh(new THREE.PlaneGeometry(DECK.cookieW, DECK.cookieLen), cookieMat);
  kissMesh.rotation.x = -Math.PI / 2;
  kissMesh.position.set(0, DECK.cookieY, DECK.cookieZ);
  kissMesh.renderOrder = 1;
  kissMesh.visible = false;
  car.add(kissMesh);

  const moteCount = 42;
  const motePositions = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i += 1) {
    motePositions[i * 3] = (Math.random() - 0.5) * 1.55;
    motePositions[i * 3 + 1] = 0.2 + Math.random() * 1.05;
    motePositions[i * 3 + 2] = -2.5 - Math.random() * 9;
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
  const moteMat = new THREE.PointsMaterial({
    color: 0xffe8c8,
    map: makeMoteTexture(),
    size: 0.11,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const motes = new THREE.Points(moteGeo, moteMat);
  motes.visible = false;
  motes.frustumCulled = false;
  car.add(motes);

  const amberMat = new THREE.MeshLambertMaterial({
    color: 0xe8a04a,
    emissive: 0xc47a20,
    emissiveIntensity: 0.2,
  });
  for (const x of [-0.88, 0.88]) {
    const marker = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.06), amberMat);
    marker.position.set(x, 0.7, -2.14);
    car.add(marker);
  }

  const tailMat = new THREE.MeshLambertMaterial({
    color: 0xc45c2a,
    emissive: 0x8a2a12,
    emissiveIntensity: 0.25,
  });
  for (const x of [-0.78, 0.78]) {
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 0.08), chromeMat);
    bezel.position.set(x, 0.74, 2.2);
    car.add(bezel);
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.08), tailMat);
    lamp.position.set(x, 0.74, 2.24);
    car.add(lamp);
  }

  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.16, 0.04), chromeMat);
  plate.position.set(0, 0.46, 2.24);
  car.add(plate);
  const plateFace = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.12, 0.02),
    new THREE.MeshLambertMaterial({ color: 0xefe6d4 }),
  );
  plateFace.position.set(0, 0.46, 2.27);
  car.add(plateFace);

  for (const x of [-0.94, 0.94]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.16), chromeMat);
    arm.position.set(x, 1.08, -0.58);
    car.add(arm);
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.08), glassMat);
    mirror.position.set(x * 1.08, 1.08, -0.64);
    car.add(mirror);
  }

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.9, 5), chromeMat);
  antenna.position.set(-0.62, 1.82, 1.05);
  antenna.rotation.z = 0.1;
  car.add(antenna);

  const wheels = [];
  const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.26, 12);
  const hubGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.28, 10);
  const capGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.3, 8);
  for (const [x, z] of [
    [-0.94, -1.28],
    [0.94, -1.28],
    [-0.94, 1.32],
    [0.94, 1.32],
  ]) {
    const wheel = new THREE.Mesh(wheelGeo, rubberMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.36, z);
    wheel.castShadow = true;
    car.add(wheel);
    const hub = new THREE.Mesh(hubGeo, chromeMat);
    hub.rotation.z = Math.PI / 2;
    hub.position.set(x, 0.36, z);
    car.add(hub);
    const cap = new THREE.Mesh(capGeo, darkMat);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(x, 0.36, z);
    car.add(cap);
    wheels.push(wheel);
  }

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.35, 8.2),
    new THREE.MeshBasicMaterial({
      map: makeShadowTexture(),
      transparent: true,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.03;
  shadow.renderOrder = -1;
  car.add(shadow);

  car.position.set(0, DECK.restY, 1.6);
  car.userData.wheels = wheels;
  car.userData.lights = lightMat;
  car.userData.tails = tailMat;
  car.userData.spots = spots;
  car.userData.kiss = kiss;
  car.userData.kissMesh = kissMesh;
  car.userData.glass = glassMat;
  car.userData.cabinFill = cabinFill;
  car.userData.cabinGlow = cabinGlow;
  car.userData.motes = motes;
  return car;
}

export function createWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.14;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const fogColor = new THREE.Color('#f2c898');
  scene.fog = new THREE.Fog(fogColor, DECK.fogNearDay, DECK.fogFarDay);
  scene.background = fogColor.clone();

  const camera = new THREE.PerspectiveCamera(
    DECK.camFov,
    window.innerWidth / window.innerHeight,
    DECK.camNear,
    420,
  );
  const camCurrent = new THREE.Vector3(0.78, 2.24, 8.4);
  const lookCurrent = new THREE.Vector3(0.04, 0.58, -13.2);
  const camTarget = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  camera.position.copy(camCurrent);
  camera.lookAt(lookCurrent);

  const hemi = new THREE.HemisphereLight(0xffc088, 0x5d7a3a, 0.7);
  scene.add(hemi);

  const sunLight = new THREE.DirectionalLight(0xffd4a0, 1.62);
  sunLight.position.set(-48, 24, 10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.bias = -0.0008;
  sunLight.shadow.normalBias = 0.04;
  sunLight.shadow.camera.near = 4;
  sunLight.shadow.camera.far = 140;
  sunLight.shadow.camera.left = -42;
  sunLight.shadow.camera.right = 42;
  sunLight.shadow.camera.top = 28;
  sunLight.shadow.camera.bottom = -22;
  scene.add(sunLight);

  const fill = new THREE.DirectionalLight(0xffe2c4, 0.22);
  fill.position.set(10, 14, 20);
  scene.add(fill);

  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color('#86a8d0') },
      midColor: { value: new THREE.Color('#f0b888') },
      bottomColor: { value: new THREE.Color('#f6d2a0') },
      glowColor: { value: new THREE.Color('#ffb070') },
      offset: { value: 0.02 },
      midStart: { value: 0.0 },
      midEnd: { value: 0.1 },
      topStart: { value: 0.06 },
      topEnd: { value: 0.24 },
      glow: { value: 0.22 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPosition = world.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 midColor;
      uniform vec3 bottomColor;
      uniform vec3 glowColor;
      uniform float offset;
      uniform float midStart;
      uniform float midEnd;
      uniform float topStart;
      uniform float topEnd;
      uniform float glow;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
        float midT = smoothstep(midStart, midEnd, h);
        float topT = smoothstep(topStart, topEnd, h);
        vec3 col = mix(bottomColor, midColor, midT);
        col = mix(col, topColor, topT);
        float melt = smoothstep(0.1, -0.05, h);
        col = mix(col, glowColor, melt * glow);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
    toneMapped: false,
    fog: false,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(240, 24, 16), skyMat));

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(4.6, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffe1ad, toneMapped: false, fog: false }),
  );
  const sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(7.4, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0xffc080,
      transparent: true,
      opacity: 0.22,
      toneMapped: false,
      fog: false,
      depthWrite: false,
    }),
  );
  sun.add(sunGlow);
  scene.add(sun);

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3.6, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xe8e6dc, toneMapped: false, fog: false }),
  );
  const moonGlow = new THREE.Mesh(
    new THREE.SphereGeometry(7.2, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0xb8c4d8,
      transparent: true,
      opacity: 0.1,
      toneMapped: false,
      fog: false,
      depthWrite: false,
    }),
  );
  moon.add(moonGlow);
  moon.visible = false;
  scene.add(moon);

  const starCount = 48;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    starPositions[i * 3] = (Math.random() - 0.5) * 210;
    starPositions[i * 3 + 1] = 36 + Math.random() * 88;
    starPositions[i * 3 + 2] = -30 - Math.random() * 150;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starTex = canvasTexture(
    32,
    (ctx, size) => {
      const g = ctx.createRadialGradient(16, 16, 1, 16, 16, 15);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.4, 'rgba(230,236,248,0.7)');
      g.addColorStop(1, 'rgba(230,236,248,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    },
    'clamp',
  );
  const starMat = new THREE.PointsMaterial({
    color: 0xd8e0f0,
    map: starTex,
    size: 1.55,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    fog: false,
    sizeAttenuation: true,
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.visible = false;
  scene.add(stars);

  const grassMaps = {
    green: makeGrassTexture('#6f8f4a', '#5d7a3d', '#86a35b'),
    cool: makeGrassTexture('#4e7d62', '#3d6a52', '#6a9a78'),
    gold: makeGrassTexture('#c2a24a', '#a88838', '#d4bc70'),
    sand: makeGrassTexture('#c9a36a', '#b08a50', '#dcc090'),
  };
  Object.values(grassMaps).forEach((tex) => tex.repeat.set(90, 90));

  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(420, 420),
    new THREE.MeshLambertMaterial({ map: grassMaps.green, color: 0xffffff }),
  );
  grass.rotation.x = -Math.PI / 2;
  grass.receiveShadow = true;
  scene.add(grass);

  const roadTex = makeRoadTexture();
  roadTex.repeat.set(1, 52);
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(8.4, 280),
    new THREE.MeshPhongMaterial({
      map: roadTex,
      shininess: 24,
      specular: 0x5a5448,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    }),
  );
  road.rotation.x = -Math.PI / 2;
  road.position.y = DECK.roadY;
  road.receiveShadow = true;
  scene.add(road);

  const shoulderMat = new THREE.MeshLambertMaterial({
    color: 0x9a8a6a,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  for (const x of [-5.15, 5.15]) {
    const shoulder = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 280), shoulderMat);
    shoulder.rotation.x = -Math.PI / 2;
    shoulder.position.set(x, 0.04, 0);
    shoulder.receiveShadow = true;
    scene.add(shoulder);
  }

  // Keep the inner edge of each ellipsoid outside the paved corridor (|x| < ~6.1).
  function addHill(x, z, radius, color) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 10, 8),
      new THREE.MeshLambertMaterial({ color }),
    );
    mesh.position.set(x, radius * 0.12, z);
    mesh.scale.set(1.75, 0.34, 1.15);
    mesh.receiveShadow = true;
    mesh.userData.hillRadius = radius;
    mesh.userData.baseX = x;
    scene.add(mesh);
    return mesh;
  }

  function seatHill(hill, scale) {
    hill.scale.set(scale[0], scale[1], scale[2]);
    const extentX = hill.userData.hillRadius * scale[0];
    const absX = Math.max(Math.abs(hill.userData.baseX), DECK.hillInner + extentX);
    hill.position.x = Math.sign(hill.userData.baseX || -1) * absX;
  }

  const hills = [
    addHill(-58, -78, 22, 0x7e925c),
    addHill(62, -92, 26, 0x8a9a68),
    addHill(-74, -118, 32, 0x6f8454),
    addHill(56, -128, 20, 0x9aa574),
    addHill(-60, -150, 24, 0x7a8d5e),
  ];

  const cloudUniforms = {
    uLit: { value: new THREE.Color('#faebd4') },
    uShade: { value: new THREE.Color('#c49878') },
    uRim: { value: new THREE.Color('#ffb070') },
    uUnder: { value: new THREE.Color('#f0a060') },
    uLightDir: { value: new THREE.Vector3(-0.55, 0.42, 0.28).normalize() },
    uOpacity: { value: 0.84 },
    uFogColor: { value: fogColor.clone() },
    uFogNear: { value: DECK.fogNearDay },
    uFogFar: { value: DECK.fogFarDay },
  };
  const cloudMat = new THREE.ShaderMaterial({
    uniforms: cloudUniforms,
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      void main() {
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPosition = world.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uLit;
      uniform vec3 uShade;
      uniform vec3 uRim;
      uniform vec3 uUnder;
      uniform vec3 uLightDir;
      uniform float uOpacity;
      uniform vec3 uFogColor;
      uniform float uFogNear;
      uniform float uFogFar;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      void main() {
        vec3 N = normalize(vWorldNormal);
        vec3 L = normalize(uLightDir);
        float wrap = clamp(dot(N, L) * 0.42 + 0.58, 0.0, 1.0);
        float belly = smoothstep(0.18, -0.62, N.y);
        float crown = smoothstep(0.02, 0.78, N.y);
        vec3 col = mix(uShade, uLit, wrap);
        col = mix(col, uUnder, belly * 0.92);
        col = mix(col, uLit, crown * 0.22);
        float rim = pow(max(0.0, 1.0 - abs(dot(N, L))), 1.4) * 0.3;
        col += uRim * rim;
        float depth = abs(vWorldPosition.z);
        float fogF = smoothstep(uFogNear, uFogFar, depth);
        col = mix(col, uFogColor, fogF);
        float alpha = uOpacity * (1.0 - fogF);
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    fog: false,
    toneMapped: false,
    side: THREE.FrontSide,
  });
  const puffGeo = new THREE.SphereGeometry(1.9, 11, 8);
  const clouds = [];
  const puffOffsets = [
    [0.0, 0.42, 0.0, 1.78, 1.08, 1.4],
    [1.78, 0.58, 0.3, 1.22, 0.95, 1.08],
    [-1.7, 0.5, -0.22, 1.32, 0.98, 1.16],
    [0.32, 1.28, 0.18, 1.08, 0.9, 0.96],
    [-0.82, 1.18, -0.14, 1.0, 0.86, 0.9],
    [1.12, 0.18, -0.82, 0.95, 0.62, 0.86],
    [-0.48, 0.14, 0.92, 1.05, 0.6, 0.94],
    [0.08, 1.78, 0.06, 0.78, 0.68, 0.7],
    [1.22, 1.05, 0.5, 0.82, 0.7, 0.72],
    [-1.18, 0.95, 0.4, 0.76, 0.66, 0.68],
    [0.55, 0.08, 0.22, 1.12, 0.48, 0.95],
  ];
  function createCloud() {
    const group = new THREE.Group();
    for (const [x, y, z, sx, sy, sz] of puffOffsets) {
      const puff = new THREE.Mesh(puffGeo, cloudMat);
      puff.position.set(x, y, z * 2.6);
      puff.scale.set(sx, sy, sz);
      group.add(puff);
    }
    return group;
  }
  for (const lane of CLOUD_LANES) {
    const cloud = createCloud();
    cloud.position.set(lane.x, lane.y, lane.z);
    cloud.scale.setScalar(lane.scale);
    cloud.userData.baseScale = lane.scale;
    scene.add(cloud);
    clouds.push(cloud);
  }

  const weatherRoot = new THREE.Group();
  scene.add(weatherRoot);
  const eventRoot = new THREE.Group();
  scene.add(eventRoot);
  const weather = {
    kind: 'clear',
    leaves: [],
    mist: [],
    rain: [],
    haze: [],
    hazeTime: 0,
  };
  const eventState = {
    kind: null,
    age: 0,
    life: 0,
    cooldown: 28 + Math.random() * 22,
    neonMats: [],
    truck: null,
    deer: null,
    sign: null,
  };

  const scenery = new THREE.Group();
  scene.add(scenery);

  const car = createCar();
  scene.add(car);
  const cookie = car.userData.kissMesh;
  car.remove(cookie);
  scene.add(cookie);

  const clock = { travel: 0, time: 0, phase: null };
  let movers = [];
  let currentId = null;
  const palette = allocPalette();
  const air = allocAir();
  const stage = {
    scene,
    renderer,
    skyMat,
    hemi,
    sunLight,
    fill,
    sun,
    sunGlow,
    moon,
    moonGlow,
    stars,
    starMat,
    cloudUniforms,
    clouds,
    grass,
    road,
    cookie,
    car,
    scenery,
    spin: [],
    emissives: [],
  };
  seatCookie(stage, car);

  function makeMistTexture() {
    return canvasTexture(
      256,
      (ctx, size) => {
        const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 124);
        g.addColorStop(0, 'rgba(255,255,255,0.5)');
        g.addColorStop(0.55, 'rgba(255,255,255,0.16)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
      },
      'clamp',
    );
  }

  const mistTex = makeMistTexture();
  const hazeMat = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      tint: { value: new THREE.Color('#f0c888') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 tint;
      varying vec2 vUv;
      void main() {
        float band = sin(vUv.y * 22.0 + time * 1.3) * 0.5 + 0.5;
        float fade = smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.65, 1.0, vUv.y));
        float side = smoothstep(0.0, 0.18, vUv.x) * (1.0 - smoothstep(0.82, 1.0, vUv.x));
        float a = (0.1 + band * 0.12) * fade * side;
        gl_FragColor = vec4(tint, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    fog: false,
    toneMapped: false,
    side: THREE.DoubleSide,
  });

  function gatherTagged(root, key) {
    const mats = [];
    root.traverse((node) => {
      if (node.userData && Array.isArray(node.userData[key])) {
        mats.push(...node.userData[key]);
      }
    });
    return mats;
  }

  function gatherNeon(root) {
    return gatherTagged(root, 'neon');
  }

  function gatherEmit(root) {
    return gatherTagged(root, 'emit');
  }

  function clearWeather() {
    clearGroup(weatherRoot);
    weather.kind = 'clear';
    weather.leaves = [];
    weather.mist = [];
    weather.rain = [];
    weather.haze = [];
  }

  function buildWeather(theme) {
    clearWeather();
    weather.kind = theme.weather || 'clear';
    const kind = weather.kind;

    if (kind === 'leaves') {
      const colors = [0xc45c2a, 0xd4a24a, 0xb06a32, 0xe8a04a, 0xa24b3a, 0xc4a24a];
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0.22);
      leafShape.bezierCurveTo(0.2, 0.14, 0.18, 0, 0, -0.18);
      leafShape.bezierCurveTo(-0.18, 0, -0.2, 0.14, 0, 0.22);
      const leafGeo = new THREE.ShapeGeometry(leafShape);
      for (let i = 0; i < 20; i += 1) {
        const leaf = new THREE.Mesh(
          leafGeo,
          new THREE.MeshBasicMaterial({
            color: colors[i % colors.length],
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.88,
            depthWrite: false,
          }),
        );
        leaf.position.set((Math.random() - 0.5) * 14, 0.9 + Math.random() * 3.6, -4 - Math.random() * 36);
        leaf.rotation.set(Math.random() * 0.6, Math.random() * Math.PI, Math.random());
        leaf.scale.setScalar(0.85 + (i % 4) * 0.18);
        leaf.userData.fall = 0.28 + Math.random() * 0.4;
        leaf.userData.spin = 0.3 + Math.random() * 0.7;
        leaf.userData.sway = 0.3 + Math.random() * 0.55;
        leaf.userData.phase = Math.random() * Math.PI * 2;
        weatherRoot.add(leaf);
        weather.leaves.push(leaf);
      }
    }

    if (kind === 'mist' || kind === 'fog' || kind === 'haze' || kind === 'damp') {
      const tint =
        kind === 'haze' ? 0xd8e0e8 : kind === 'fog' ? 0xc8d0d4 : kind === 'damp' ? 0xd0c8c0 : 0xd4e4dc;
      const mistMat = new THREE.MeshBasicMaterial({
        map: mistTex,
        color: tint,
        transparent: true,
        opacity: kind === 'fog' ? 0.2 : kind === 'haze' ? 0.16 : 0.14,
        depthWrite: false,
        fog: true,
        side: THREE.DoubleSide,
      });
      const count = kind === 'fog' ? 5 : 4;
      for (let i = 0; i < count; i += 1) {
        const sheet = new THREE.Mesh(new THREE.PlaneGeometry(14, 6.4), mistMat);
        const side = i % 2 === 0 ? -1 : 1;
        // Keep inner edge off the paved corridor (|x| < ~6.1) and clip-safe props.
        sheet.position.set(side * (14 + (i % 3) * 2.2), kind === 'fog' ? 3.8 : 2.2, -28 - i * 18);
        sheet.rotation.y = side * 0.12;
        sheet.userData.drift = (i % 2 === 0 ? 1 : -1) * (0.08 + i * 0.015);
        weatherRoot.add(sheet);
        weather.mist.push(sheet);
      }
    }

    if (kind === 'damp') {
      const streakMat = new THREE.MeshBasicMaterial({
        color: 0xc8d4dc,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      for (let i = 0; i < 12; i += 1) {
        const drop = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 0.42), streakMat);
        drop.position.set((Math.random() - 0.5) * 12, 2 + Math.random() * 5, -8 - Math.random() * 28);
        drop.userData.fall = 6 + Math.random() * 5;
        weatherRoot.add(drop);
        weather.rain.push(drop);
      }
    }

    if (kind === 'heat') {
      hazeMat.uniforms.tint.value.setHex(0xf0c888);
      for (let i = 0; i < 3; i += 1) {
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 2.4), hazeMat);
        plane.position.set(0, 0.7 + i * 0.15, -22 - i * 18);
        plane.renderOrder = 2;
        weatherRoot.add(plane);
        weather.haze.push(plane);
      }
    }
  }

  function clearEvent() {
    clearGroup(eventRoot);
    eventState.kind = null;
    eventState.age = 0;
    eventState.life = 0;
    eventState.truck = null;
    eventState.deer = null;
    eventState.sign = null;
  }

  function spawnEvent(kind) {
    clearEvent();
    const type = kind || ['mail', 'deer', 'neon'][Math.floor(Math.random() * 3)];
    eventState.kind = type;
    eventState.age = 0;

    if (type === 'mail') {
      const truck = createMailTruck();
      truck.position.set(-2.45, 0.08, -22);
      truck.rotation.y = Math.PI;
      eventRoot.add(truck);
      eventState.truck = truck;
      eventState.life = 14;
    } else if (type === 'deer') {
      const deer = createDeer();
      const side = kind ? 1 : Math.random() > 0.5 ? 1 : -1;
      deer.scale.setScalar(1.82);
      deer.position.set(side * 8.4, 0, -6.35);
      deer.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
      if (deer.userData.head) deer.userData.head.rotation.y = side * 0.16;
      deer.userData.side = side;
      eventRoot.add(deer);
      eventState.deer = deer;
      eventState.life = 16;
    } else {
      const sign = createNeonSign();
      const side = Math.random() > 0.45 ? 1 : -1;
      sign.position.set(side * 7.4, 0, -26);
      eventRoot.add(sign);
      eventState.sign = sign;
      eventState.life = 18;
      eventState.neonMats = gatherNeon(scenery).concat(gatherNeon(eventRoot));
      eventState.neonMats.forEach((mat) => {
        if (mat) mat.userData.baseNeon = mat.emissiveIntensity;
      });
    }
  }

  function tickEvent(dt, speed, reduced) {
    if (!eventState.kind) {
      eventState.cooldown -= dt;
      if (eventState.cooldown <= 0) {
        spawnEvent();
        eventState.cooldown = 78 + Math.random() * 64;
      }
      return;
    }
    eventState.age += dt;
    const t = eventState.age;
    if (eventState.truck) {
      const rush = reduced ? 1.15 : 1.85;
      eventState.truck.position.z += speed * rush * dt;
      eventState.truck.position.y = 0.08;
    }
    if (eventState.deer) {
      const deer = eventState.deer;
      const side = deer.userData.side || 1;
      if (deer.userData.head) {
        deer.userData.head.rotation.y = side * 0.18 + Math.sin(t * 0.7) * 0.1;
      }
      if (t > 7) {
        const walk = reduced ? 0.18 : 0.48;
        deer.position.x += side * walk * dt;
        deer.position.z += 0.16 * dt;
      }
      const minX = 7.2;
      if (Math.abs(deer.position.x) < minX) {
        deer.position.x = side * minX;
      }
    }
    if (eventState.kind === 'neon') {
      const pulse = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.4));
      const wink = t % 3.6 > 3.35 ? 0.12 : pulse;
      eventState.neonMats.forEach((mat) => {
        if (mat && mat.emissiveIntensity != null) mat.emissiveIntensity = wink;
      });
    }
    if (eventState.age > eventState.life) {
      if (eventState.kind === 'neon') {
        gatherNeon(scenery).forEach((mat) => {
          if (mat && mat.emissiveIntensity != null) {
            mat.emissiveIntensity = mat.userData?.baseNeon ?? 0.35;
          }
        });
      }
      clearEvent();
    }
  }

  function tickWeather(dt, speed, reduced, sample) {
    const motion = reduced ? 0.14 : 1;
    weather.hazeTime += dt * motion;
    if (weather.haze.length) hazeMat.uniforms.time.value = weather.hazeTime;

    const leavesOn = !sample || sample.night < 0.45;
    weather.leaves.forEach((leaf) => {
      leaf.visible = leavesOn;
      if (!leavesOn) return;
      leaf.position.y -= leaf.userData.fall * dt * motion;
      leaf.position.x += Math.sin(clock.time * leaf.userData.sway + leaf.userData.phase) * 0.35 * dt * motion;
      leaf.position.z += speed * 0.35 * dt;
      leaf.rotation.z += leaf.userData.spin * dt * motion;
      leaf.rotation.x += 0.2 * dt * motion;
      if (leaf.position.y < 0.12 || leaf.position.z > 8) {
        leaf.position.set((Math.random() - 0.5) * 14, 3.2 + Math.random() * 2.4, -10 - Math.random() * 32);
      }
    });

    weather.mist.forEach((sheet) => {
      sheet.position.x += sheet.userData.drift * dt * motion;
      sheet.position.z += speed * 0.28 * dt;
      if (sheet.position.x > 22) sheet.position.x = -22;
      if (sheet.position.x < -22) sheet.position.x = 22;
      if (Math.abs(sheet.position.x) < 12) {
        sheet.position.x = Math.sign(sheet.position.x || 1) * 14;
      }
      if (sheet.position.z > 6) sheet.position.z -= 70;
    });

    weather.rain.forEach((drop) => {
      drop.position.y -= drop.userData.fall * dt * (reduced ? 0.2 : 1);
      drop.position.z += speed * 0.5 * dt;
      if (drop.position.y < 0.2 || drop.position.z > 6) {
        drop.position.set((Math.random() - 0.5) * 14, 6 + Math.random() * 4, -8 - Math.random() * 32);
      }
    });

    weather.haze.forEach((plane, i) => {
      plane.position.z += speed * 0.2 * dt;
      if (plane.position.z > -8) plane.position.z = -22 - i * 18;
    });
  }

  function applyRoute(id) {
    const theme = themeFor(id);
    if (theme.id === currentId) return;
    currentId = theme.id;
    fillPalette(theme, palette);

    grass.material.map = grassMaps[theme.grassMap] || grassMaps.green;
    grass.material.needsUpdate = true;
    shoulderMat.color.setHex(theme.shoulder);
    sun.material.color.setHex(theme.sunDay);
    sunGlow.material.color.setHex(theme.sunDusk);

    hills.forEach((hill, i) => {
      hill.material.color.setHex(theme.hills[i % theme.hills.length]);
      seatHill(hill, theme.hillScale);
    });

    clearGroup(scenery);
    const built = populateScenery(scenery, theme);
    movers = built.movers;
    stage.spin = built.spin || [];
    stage.emissives = gatherEmit(scenery);
    stage.emissives.forEach((mat) => {
      if (mat && mat.userData.baseEmissive == null) {
        mat.userData.baseEmissive = mat.emissiveIntensity;
      }
    });
    buildWeather(theme);
    clearEvent();
  }

  applyRoute('county');

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onResize);

  function update(dt, game) {
    const destId = game.destination?.id || 'county';
    if (destId !== currentId) applyRoute(destId);

    const reduced = Boolean(game.reduceMotion);
    clock.time += dt;
    const impulse = reduced ? game.driveImpulse * 0.15 : game.driveImpulse;
    const speed = 5.5 + game.passiveRate * 0.28 + impulse * 16;
    clock.travel += speed * dt;

    roadTex.offset.y = (clock.travel * 0.085) % 1;
    Object.values(grassMaps).forEach((tex) => {
      tex.offset.y = (clock.travel * 0.012) % 1;
    });

    const phase =
      clock.phase != null
        ? clock.phase
        : (0.468 + clock.time * 0.0046 + (game.totalMiles || 0) * 0.00005) % 1;
    scoreAir(palette, phase, air);
    paintAir(stage, air);

    const move = speed * dt;
    movers.forEach((item) => {
      recycleZ(item.obj, move * item.speed, item.far, item.near);
    });
    hills.forEach((hill) => recycleZ(hill, move * 0.22, 90, 20));
    tickClouds(clouds, dt, speed, reduced);

    tickWeather(dt, speed, reduced, air);
    tickEvent(dt, speed, reduced);
    if (!reduced) {
      stage.spin.forEach((blades) => {
        blades.rotation.z += dt * 0.7;
      });
    }

    const motes = car.userData.motes;
    if (motes) {
      if (reduced) {
        motes.visible = false;
      } else {
        const show = air.motes;
        motes.visible = show > 0.08;
        motes.material.opacity = show * 0.4;
        const arr = motes.geometry.attributes.position.array;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i + 1] += dt * 0.03 * (0.4 + (i % 5) * 0.08);
          arr[i + 2] += dt * 0.07;
          if (arr[i + 2] > -1.6 || arr[i + 1] > 1.75) {
            arr[i] = (Math.random() - 0.5) * 1.55;
            arr[i + 1] = 0.18 + Math.random() * 1.05;
            arr[i + 2] = -2.5 - Math.random() * 9;
          }
        }
        motes.geometry.attributes.position.needsUpdate = true;
      }
    }

    const sway = reduced ? 0 : 1;
    const bob = Math.sin(clock.time * 6.2) * 0.01 * (0.35 + impulse * 0.45) * sway;
    car.position.y = DECK.restY + bob;
    car.rotation.x = -impulse * 0.018 + Math.sin(clock.time * 5.1) * 0.005 * sway;
    car.rotation.z = Math.sin(clock.time * 1.8) * 0.008 * sway;
    car.userData.wheels.forEach((wheel) => {
      wheel.rotation.x += speed * dt * 2.4;
    });
    seatCookie(stage, car);

    const camNudge = reduced ? 0 : 1;
    camTarget.set(0.76, 2.2 + impulse * 0.05 * camNudge, 8.35 + impulse * 0.22 * camNudge);
    lookTarget.set(0.04, 0.56, -13.4);
    const smooth = 1 - Math.pow(0.02, dt);
    camCurrent.lerp(camTarget, smooth);
    lookCurrent.lerp(lookTarget, smooth);
    camera.position.copy(camCurrent);
    camera.lookAt(lookCurrent);
  }

  function render() {
    renderer.render(scene, camera);
  }

  function getLook() {
    return {
      id: palette.id,
      weather: palette.weather,
      landmark: palette.landmark,
      extras: palette.extras,
      grassMap: palette.grassMap,
      dusk: air.dusk,
      night: air.night,
    };
  }

  function setTime(t) {
    clock.time = t;
    clock.phase = null;
  }

  function setPhase(p) {
    const n = Number(p);
    if (!Number.isFinite(n)) return;
    clock.phase = ((n % 1) + 1) % 1;
  }

  function forceEvent(kind) {
    spawnEvent(kind);
    eventState.cooldown = 90;
  }

  return {
    update,
    render,
    renderer,
    applyRoute,
    getLook,
    setTime,
    setPhase,
    forceEvent,
  };
}
