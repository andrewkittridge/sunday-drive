import * as THREE from 'three';
import { clearGroup, populateScenery, themeFor } from './route.js';
import { spawnProp, spawnWagon } from './props.js';

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
  cookieY: 0.096,
  cookieW: 6.15,
  cookieLen: 12.2,
  cookieZ: -8.05,
  kissDistance: 11,
  kissDecay: 1.6,
  hillInner: 12,
  landInner: 24,
  landWidth: 88,
  landLength: 96,
  landHeight: 7.4,
  keyYFloor: 5.2,
  keyReach: 58,
  camFov: 50,
  camNear: 0.6,
  fogNearDay: 48,
  fogFarDay: 168,
  meltAgree: 0.62,
  cloudFar: 130,
  cloudNear: 22,
  cloudZRate: 0.1,
};

const CLOUD_LANES = [
  { x: -24, y: 18.8, z: -52, scale: 1.42 },
  { x: 18, y: 21.2, z: -80, scale: 1.58 },
  { x: 32, y: 17.4, z: -118, scale: 1.12 },
  { x: -14, y: 22.6, z: -98, scale: 1.28 },
];

const WHITE = new THREE.Color(0xffffff);
const moonFill = new THREE.Color(0x8a96b8);
const nightCloud = new THREE.Color(0x6e7c98);
const nightShade = new THREE.Color(0x2e3848);
const moonRim = new THREE.Color(0xd4dcec);
const roadSpecDay = new THREE.Color(0x4a4e54);
const roadSpecDusk = new THREE.Color(0x8a7a60);
const roadSpecNight = new THREE.Color(0xb49a70);
const cookieDay = new THREE.Color('#f3d4a0');
const cookieNight = new THREE.Color('#f0c07a');
const tmpA = new THREE.Color();
const tmpB = new THREE.Color();
const tmpC = new THREE.Color();
const ridgeColor = new THREE.Color();

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
  out.glowAmount = 0.06 + out.dusk * 0.08 - out.night * 0.04;

  tmpA.copy(palette.fog).lerp(palette.duskFog, out.dusk).lerp(palette.nightFog, out.night);
  out.fogColor.copy(tmpA).lerp(out.glow, DECK.meltAgree);
  out.fogColor.multiplyScalar(0.74 + out.dusk * 0.06 - out.night * 0.04);
  out.fogNear = DECK.fogNearDay + out.dusk * 3 + out.night * 8;
  out.fogFar = DECK.fogFarDay + out.dusk * 6 - out.night * 18;

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

  out.grassTint.copy(palette.grass).lerp(WHITE, 0.28);
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

  out.cookieColor.copy(cookieDay).lerp(cookieNight, out.night > 0.45 ? 1 : 0);
  out.cookieStrength = out.dusk * 0.4 + out.night * 0.58;
  out.exposure = 1.14 - out.dusk * 0.1 - out.night * 0.22;
  out.emissive = 0.12 + out.dusk * 0.35 + out.night * 0.85;
  out.lampSpots = out.dusk * 1.7 + out.night * 3.4;
  out.lampKiss = out.dusk * 0.48 + out.night * 0.95;
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
  skyMat.uniforms.topStart.value = 0.02;
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
  stage.sunGlow.material.opacity = 0.52 + air.dusk * 0.22 - air.night * 0.42;
  stage.moon.position.copy(air.moonPos);
  stage.moon.visible = air.moonVisible;
  stage.moonGlow.material.opacity = 0.18 + air.night * 0.42;
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

  if (stage.lands) {
    for (const land of stage.lands) {
      const u = land.material.uniforms;
      u.uFogColor.value.copy(air.fogColor);
      u.uFogNear.value = air.fogNear;
      u.uFogFar.value = air.fogFar;
      u.uColor.value.copy(land.userData.baseColor).lerp(air.fogColor, air.night * 0.62);
      u.uColor.value.multiplyScalar(1 - air.night * 0.42);
    }
  }

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
    for (let i = 0; i < 1600; i += 1) {
      ctx.fillStyle = Math.random() > 0.42 ? dark : light;
      ctx.fillRect(
        Math.random() * size,
        Math.random() * size,
        1 + Math.random() * 1.6,
        1 + Math.random() * 3.2,
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
    ctx.fillStyle = '#5a5856';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 3200; i += 1) {
      const cool = Math.random() > 0.5;
      const shade = cool ? 78 + Math.random() * 36 : 64 + Math.random() * 24;
      const r = shade;
      const g = shade - (cool ? 1 : 3);
      const b = shade + (cool ? 4 : -2);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(
        Math.random() * size,
        Math.random() * size,
        1 + Math.random() * 2,
        1 + Math.random() * 2,
      );
    }
    ctx.fillStyle = 'rgba(210, 200, 180, 0.08)';
    ctx.fillRect(size * 0.46, 0, size * 0.08, size);
    ctx.fillStyle = 'rgba(24, 20, 16, 0.18)';
    ctx.fillRect(size * 0.28, 0, 16, size);
    ctx.fillRect(size * 0.66, 0, 16, size);
    ctx.fillStyle = '#efe8d8';
    ctx.fillRect(5, 0, 4, size);
    ctx.fillRect(size - 9, 0, 4, size);
    ctx.fillStyle = '#e2b84a';
    const dash = Math.floor(size * 0.32);
    ctx.fillRect(size / 2 - 2, 18, 4, dash);
  });
}

function makeShoulderTexture() {
  return canvasTexture(128, (ctx, size) => {
    ctx.fillStyle = '#9a8a6a';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 1100; i += 1) {
      const s = 118 + Math.random() * 52;
      ctx.fillStyle = `rgb(${s},${s - 14},${s - 30})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
  });
}

function makeWoodTexture() {
  const texture = canvasTexture(128, (ctx, size) => {
    ctx.fillStyle = '#b07942';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 1) {
      const wave = Math.sin(y * 0.26) * 10 + Math.sin(y * 0.07) * 16;
      const plank = y % 21 === 0;
      ctx.fillStyle = plank ? '#5c3418' : y % 5 === 0 ? '#d4a06a' : '#a86c3c';
      ctx.fillRect(0, y, size, 1);
      ctx.fillStyle = 'rgba(48, 22, 8, 0.28)';
      ctx.fillRect(14 + wave, y, 10, 1);
      ctx.fillStyle = 'rgba(32, 14, 6, 0.16)';
      ctx.fillRect(58 + wave * 0.4, y, 7, 1);
      if (y % 9 === 0) {
        ctx.fillStyle = 'rgba(236, 196, 140, 0.18)';
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
      const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
      g.addColorStop(0, 'rgba(0,0,0,0.62)');
      g.addColorStop(0.28, 'rgba(0,0,0,0.34)');
      g.addColorStop(0.58, 'rgba(0,0,0,0.12)');
      g.addColorStop(0.82, 'rgba(0,0,0,0.04)');
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
      uColor: { value: new THREE.Color('#f3d4a0') },
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

      float ellipse(vec2 uv, vec2 origin, vec2 scale, float tight) {
        vec2 p = (uv - origin) * scale;
        return exp(-dot(p, p) * tight);
      }

      void main() {
        float wash = ellipse(vUv, vec2(0.5, 0.3), vec2(2.28, 0.72), 2.05);
        float core = ellipse(vUv, vec2(0.5, 0.18), vec2(2.55, 1.02), 5.1);
        float left = ellipse(vUv, vec2(0.41, 0.11), vec2(3.35, 1.32), 8.2);
        float right = ellipse(vUv, vec2(0.59, 0.11), vec2(3.35, 1.32), 8.2);
        float a = wash * 0.48 + core * 0.36 + (left + right) * 0.2;
        a = min(a, 1.0);
        a *= smoothstep(0.06, 0.2, vUv.x) * smoothstep(0.94, 0.8, vUv.x);
        a *= smoothstep(0.0, 0.08, vUv.y) * smoothstep(0.9, 0.36, vUv.y);
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

function makeLandGeometry(side, height, width, length) {
  const geo = new THREE.PlaneGeometry(width, length, 40, 24);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const innerT = side > 0 ? (x + width / 2) / width : (width / 2 - x) / width;
    const zn = z / (length * 0.5);
    const rise = THREE.MathUtils.smoothstep(innerT, 0.05, 0.24) * (1 - THREE.MathUtils.smoothstep(innerT, 0.58, 0.99));
    const lobe = Math.max(0.12, Math.cos(zn * Math.PI * 0.46));
    const lump =
      0.9 +
      0.08 * Math.sin(innerT * 15.2 + zn * 3.1) +
      0.06 * Math.sin(zn * 6.4 + innerT * 9.5);
    const y = Math.max(0.04, height * rise * lobe * lobe * lump);
    pos.setY(i, y);
  }
  geo.computeVertexNormals();
  return geo;
}

function makeLandMaterial(color, fogColor) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uFogColor: { value: fogColor.clone() },
      uFogNear: { value: DECK.fogNearDay },
      uFogFar: { value: DECK.fogFarDay },
      uMelt: { value: 0.78 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;
      varying float vHeight;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPosition = world.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vHeight = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uFogColor;
      uniform float uFogNear;
      uniform float uFogFar;
      uniform float uMelt;
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;
      varying float vHeight;
      void main() {
        vec3 N = normalize(vWorldNormal);
        float lit = clamp(N.y * 0.62 + 0.4, 0.0, 1.0);
        vec3 col = uColor * (0.68 + lit * 0.42);
        float fogF = smoothstep(uFogNear, uFogFar, abs(vWorldPosition.z));
        float crown = smoothstep(1.4, 6.4, vHeight);
        float rim = pow(max(0.0, 1.0 - N.y), 1.35);
        float melt = clamp(fogF * 0.74 + crown * 0.58 + rim * 0.22, 0.0, 1.0) * uMelt;
        col = mix(col, uFogColor, melt);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    lights: false,
    fog: false,
  });
}

function makeGlowTexture() {
  return canvasTexture(
    128,
    (ctx, size) => {
      const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.18, 'rgba(255,255,255,0.55)');
      g.addColorStop(0.48, 'rgba(255,255,255,0.16)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    },
    'clamp',
  );
}

function makeCloudNoise() {
  return canvasTexture(
    256,
    (ctx, size) => {
      ctx.clearRect(0, 0, size, size);
      for (let i = 0; i < 34; i += 1) {
        const x = size * (0.16 + Math.random() * 0.68);
        const y = size * (0.22 + Math.random() * 0.56);
        const r = 16 + Math.random() * 42;
        const g = ctx.createRadialGradient(x, y, 1, x, y, r);
        g.addColorStop(0, 'rgba(255,255,255,0.82)');
        g.addColorStop(0.42, 'rgba(255,255,255,0.38)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    'clamp',
  );
}

function createCar() {
  const car = spawnWagon({ woodMap: makeWoodTexture() });
  const anchors = car.userData.anchors || {};

  const cabinGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.08, 0.34),
    new THREE.MeshBasicMaterial({
      color: 0xffc898,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  if (anchors.cabinGlow) cabinGlow.position.copy(anchors.cabinGlow.position);
  else cabinGlow.position.set(0, 1.15, 2.132);
  car.add(cabinGlow);

  const cabinFill = new THREE.PointLight(0xffc090, 0.2, 2.35, 2);
  if (anchors.cabinFill) cabinFill.position.copy(anchors.cabinFill.position);
  else cabinFill.position.set(0, 1.08, 0.4);
  car.add(cabinFill);

  const spots = [];
  const lampAnchors = [anchors.spotL, anchors.spotR];
  const fallbackX = [-0.62, 0.62];
  for (let i = 0; i < 2; i += 1) {
    const anchor = lampAnchors[i];
    const x = anchor ? anchor.position.x : fallbackX[i];
    const y = anchor ? anchor.position.y : 0.66;
    const z = anchor ? anchor.position.z : -2.22;
    const spot = new THREE.SpotLight(0xffe4b0, 0, 12, 0.26, 0.92, 2);
    spot.position.set(x, y, z);
    spot.target.position.set(x * 0.08, 0.06, -9.2);
    spot.castShadow = false;
    car.add(spot);
    car.add(spot.target);
    spots.push(spot);
  }

  const kiss = new THREE.PointLight(0xffd8a0, 0, DECK.kissDistance, DECK.kissDecay);
  if (anchors.kiss) kiss.position.copy(anchors.kiss.position);
  else kiss.position.set(0, 0.2, -2.85);
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

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.85, 8.6),
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
  car.userData.spots = spots;
  car.userData.kiss = kiss;
  car.userData.kissMesh = kissMesh;
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
  const fogColor = new THREE.Color('#e8c49a');
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
      midEnd: { value: 0.08 },
      topStart: { value: 0.02 },
      topEnd: { value: 0.18 },
      glow: { value: 0.12 },
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
        float melt = smoothstep(0.22, -0.1, h);
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

  const glowMap = makeGlowTexture();
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2.4, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xffe1ad, toneMapped: false, fog: false }),
  );
  const sunGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowMap,
      color: 0xffc080,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      toneMapped: false,
    }),
  );
  sunGlow.scale.set(14, 14, 1);
  sun.add(sunGlow);
  scene.add(sun);

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(1.65, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xf2f0e8, toneMapped: false, fog: false }),
  );
  const moonGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowMap,
      color: 0xc4d0e6,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      toneMapped: false,
    }),
  );
  moonGlow.scale.set(9.5, 9.5, 1);
  moon.add(moonGlow);
  moon.visible = false;
  scene.add(moon);

  const starCount = 96;
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
    size: 0.85,
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
      shininess: 42,
      specular: 0x6a6860,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    }),
  );
  road.rotation.x = -Math.PI / 2;
  road.position.y = DECK.roadY;
  road.receiveShadow = true;
  scene.add(road);

  const shoulderTex = makeShoulderTexture();
  shoulderTex.repeat.set(4, 70);
  const shoulderMat = new THREE.MeshLambertMaterial({
    color: 0x9a8a6a,
    map: shoulderTex,
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

  function addLand(side, z, color, far) {
    const width = far ? DECK.landWidth * 1.28 : DECK.landWidth;
    const length = far ? DECK.landLength * 1.18 : DECK.landLength;
    const height = far ? DECK.landHeight * 0.82 : DECK.landHeight;
    const mesh = new THREE.Mesh(
      makeLandGeometry(side, height, width, length),
      makeLandMaterial(color, fogColor),
    );
    mesh.position.set(side * (DECK.landInner + width * 0.5), 0, z);
    mesh.receiveShadow = true;
    mesh.userData.side = side;
    mesh.userData.far = far;
    mesh.userData.width = width;
    mesh.userData.baseColor = new THREE.Color(color);
    scene.add(mesh);
    return mesh;
  }

  function seatLand(land, heightScale) {
    land.scale.y = Math.max(0.42, heightScale);
    land.position.x = land.userData.side * (DECK.landInner + land.userData.width * 0.5);
  }

  const hills = [
    addLand(-1, -44, 0x7e925c, false),
    addLand(1, -62, 0x8a9a68, false),
    addLand(-1, -98, 0x6f8454, false),
    addLand(1, -116, 0x9aa574, false),
    addLand(-1, -148, 0x7a8d5e, false),
  ];
  const ridges = [
    addLand(-1, -156, 0x8a9a78, true),
    addLand(1, -178, 0x9aa882, true),
    addLand(-1, -206, 0x7a8c6a, true),
    addLand(1, -228, 0x94a070, true),
  ];

  const cloudMap = makeCloudNoise();
  const cloudUniforms = {
    uMap: { value: cloudMap },
    uLit: { value: new THREE.Color('#faebd4') },
    uShade: { value: new THREE.Color('#c49878') },
    uRim: { value: new THREE.Color('#ffb070') },
    uUnder: { value: new THREE.Color('#f0a060') },
    uLightDir: { value: new THREE.Vector3(-0.55, 0.42, 0.28).normalize() },
    uOpacity: { value: 0.78 },
    uFogColor: { value: fogColor.clone() },
    uFogNear: { value: DECK.fogNearDay },
    uFogFar: { value: DECK.fogFarDay },
  };
  const cloudMat = new THREE.ShaderMaterial({
    uniforms: cloudUniforms,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      void main() {
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPosition = world.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform vec3 uLit;
      uniform vec3 uShade;
      uniform vec3 uRim;
      uniform vec3 uUnder;
      uniform vec3 uLightDir;
      uniform float uOpacity;
      uniform vec3 uFogColor;
      uniform float uFogNear;
      uniform float uFogFar;
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      void main() {
        float n = texture2D(uMap, vUv).r;
        float edge = smoothstep(0.1, 0.46, n);
        float core = smoothstep(0.28, 0.78, n);
        vec3 L = normalize(uLightDir);
        float wrap = clamp(L.y * 0.45 + 0.55, 0.0, 1.0);
        vec3 col = mix(uShade, uLit, wrap);
        col = mix(col, uUnder, (1.0 - core) * 0.55);
        col = mix(col, uRim, (1.0 - core) * edge * 0.32);
        float depth = abs(vWorldPosition.z);
        float fogF = smoothstep(uFogNear * 0.7, uFogFar, depth);
        col = mix(col, uFogColor, fogF * 0.85);
        float alpha = edge * uOpacity * (1.0 - fogF);
        if (alpha < 0.02) discard;
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    fog: false,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  const cloudSheet = new THREE.PlaneGeometry(22, 11);
  const clouds = [];
  const sheetOffsets = [
    [0, 0, 0, 1, 1, 0.1],
    [3.4, 0.55, -1.2, 0.78, 0.72, -0.16],
    [-2.8, 0.35, 1.4, 0.7, 0.64, 0.18],
  ];
  function createCloud() {
    const group = new THREE.Group();
    for (const [x, y, z, sx, sy, tilt] of sheetOffsets) {
      const sheet = new THREE.Mesh(cloudSheet, cloudMat);
      sheet.position.set(x, y, z);
      sheet.scale.set(sx, sy, 1);
      sheet.rotation.x = -Math.PI / 2 + tilt;
      sheet.rotation.z = x * 0.02;
      group.add(sheet);
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
    lands: hills.concat(ridges),
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
        leaf.scale.setScalar(0.42 + (i % 4) * 0.1);
        leaf.material.opacity = 0.62;
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
      const truck = spawnProp('mail');
      truck.position.set(-2.45, 0.08, -22);
      truck.rotation.y = Math.PI;
      eventRoot.add(truck);
      eventState.truck = truck;
      eventState.life = 14;
    } else if (type === 'deer') {
      const deer = spawnProp('deer');
      const side = kind ? 1 : Math.random() > 0.5 ? 1 : -1;
      deer.scale.setScalar(1.06);
      deer.position.set(side * 8.2, 0, -7.2);
      deer.rotation.y = side > 0 ? 0.28 : -0.28;
      if (deer.userData.head) deer.userData.head.rotation.y = -side * 0.32;
      deer.userData.side = side;
      eventRoot.add(deer);
      eventState.deer = deer;
      eventState.life = 16;
    } else {
      const sign = spawnProp('neon');
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
        deer.userData.head.rotation.y = -side * 0.32 + Math.sin(t * 0.7) * 0.1;
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
      hill.userData.baseColor.setHex(theme.hills[i % theme.hills.length]);
      hill.userData.baseColor.lerp(palette.fog, 0.12);
      seatLand(hill, theme.hillScale[1] * 2.55);
    });
    ridgeColor.copy(palette.horizon).lerp(palette.duskFog, 0.28);
    ridges.forEach((hill, i) => {
      hill.userData.baseColor.copy(ridgeColor);
      if (i % 2 === 1) hill.userData.baseColor.lerp(palette.fog, 0.18);
      seatLand(hill, theme.hillScale[1] * 2.05);
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
    shoulderTex.offset.y = (clock.travel * 0.085) % 1;
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
    hills.forEach((hill) => recycleZ(hill, move * 0.22, 150, 28));
    ridges.forEach((hill) => recycleZ(hill, move * 0.1, 210, 48));
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
