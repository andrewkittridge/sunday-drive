import * as THREE from 'three';
import { clearGroup, populateScenery, themeFor } from './route.js';

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
    ctx.fillStyle = '#5c5852';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 1900; i += 1) {
      const shade = 82 + Math.random() * 30;
      ctx.fillStyle = `rgb(${shade},${shade - 3},${shade - 9})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }
    ctx.fillStyle = 'rgba(36, 32, 28, 0.16)';
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
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 1) {
      const wave = Math.sin(y * 0.28) * 8 + Math.sin(y * 0.07) * 14;
      ctx.fillStyle = y % 11 === 0 ? '#5e3c22' : y % 4 === 0 ? '#8a6240' : '#704a2c';
      ctx.fillRect(0, y, size, 1);
      ctx.fillStyle = 'rgba(40, 22, 10, 0.16)';
      ctx.fillRect(18 + wave, y, 10, 1);
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
      g.addColorStop(0, 'rgba(0,0,0,0.55)');
      g.addColorStop(0.4, 'rgba(0,0,0,0.22)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    },
    'clamp',
  );
}

function createCar() {
  const car = new THREE.Group();
  const paint = 0xe6d2b0;
  const bodyMat = new THREE.MeshPhongMaterial({
    color: paint,
    shininess: 14,
    specular: 0x4a4038,
  });
  const woodMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    map: makeWoodTexture(),
  });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x2a2622 });
  const chromeMat = new THREE.MeshPhongMaterial({
    color: 0xc8c4b8,
    shininess: 90,
    specular: 0x999990,
  });
  const glassMat = new THREE.MeshPhongMaterial({
    color: 0x243038,
    shininess: 70,
    specular: 0x88a0b0,
  });
  const rubberMat = new THREE.MeshLambertMaterial({ color: 0x1a1816 });
  const interiorMat = new THREE.MeshLambertMaterial({ color: 0x3a322c });

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

  const interior = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.28, 1.7), interiorMat);
  interior.position.set(0, 0.92, 0.35);
  car.add(interior);

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
    const wood = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 3.35), woodMat);
    wood.position.set(side * 0.95, 0.66, 0.22);
    wood.castShadow = true;
    car.add(wood);
    const chrome = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.035, 3.38), chromeMat);
    chrome.position.set(side * 0.98, 0.88, 0.22);
    car.add(chrome);
  }

  const tailWood = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.38, 0.05), woodMat);
  tailWood.position.set(0, 0.66, 2.2);
  car.add(tailWood);

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

    const spot = new THREE.SpotLight(0xfff0d0, 0, 38, 0.5, 0.72, 1.55);
    spot.position.set(x, 0.66, -2.22);
    spot.target.position.set(x * 0.2, 0.08, -14);
    spot.castShadow = false;
    car.add(spot);
    car.add(spot.target);
    spots.push(spot);
  }

  const kiss = new THREE.PointLight(0xffe4b8, 0, 11, 2);
  kiss.position.set(0, 0.42, -3.2);
  car.add(kiss);

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
    new THREE.PlaneGeometry(3.5, 7.4),
    new THREE.MeshBasicMaterial({
      map: makeShadowTexture(),
      transparent: true,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.11;
  shadow.renderOrder = -1;
  car.add(shadow);

  car.position.set(0, 0, 1.6);
  car.userData.wheels = wheels;
  car.userData.lights = lightMat;
  car.userData.tails = tailMat;
  car.userData.spots = spots;
  car.userData.kiss = kiss;
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
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const fogColor = new THREE.Color('#f0c090');
  scene.fog = new THREE.Fog(fogColor, 42, 175);
  scene.background = fogColor.clone();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.6,
    420,
  );
  const camCurrent = new THREE.Vector3(0.78, 2.24, 8.4);
  const lookCurrent = new THREE.Vector3(0.04, 0.58, -13.2);
  const camTarget = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  camera.position.copy(camCurrent);
  camera.lookAt(lookCurrent);

  const hemi = new THREE.HemisphereLight(0xffc088, 0x5d7a3a, 0.86);
  scene.add(hemi);

  const sunLight = new THREE.DirectionalLight(0xffd4a0, 1.55);
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

  const fill = new THREE.DirectionalLight(0xffe2c4, 0.36);
  fill.position.set(10, 14, 20);
  scene.add(fill);

  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color('#7ea6d4') },
      bottomColor: { value: new THREE.Color('#f3d2a0') },
      offset: { value: 0.08 },
      exponent: { value: 0.68 },
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
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
        float t = pow(max(h, 0.0), exponent);
        gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
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
      shininess: 16,
      specular: 0x2a2824,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    }),
  );
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.08;
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
  const HILL_INNER = 12;

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
    const absX = Math.max(Math.abs(hill.userData.baseX), HILL_INNER + extentX);
    hill.position.x = Math.sign(hill.userData.baseX || -1) * absX;
  }

  const hills = [
    addHill(-58, -78, 22, 0x7e925c),
    addHill(62, -92, 26, 0x8a9a68),
    addHill(-74, -118, 32, 0x6f8454),
    addHill(56, -128, 20, 0x9aa574),
    addHill(-60, -150, 24, 0x7a8d5e),
  ];

  const clouds = [];
  const cloudMat = new THREE.MeshBasicMaterial({
    color: 0xf7ead2,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
  });
  for (let i = 0; i < 5; i += 1) {
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(2.8, 8, 6), cloudMat);
    cloud.scale.set(1.35 + (i % 3) * 0.22, 0.3, 0.85);
    cloud.position.set(-28 + i * 16, 28 + (i % 2) * 4, -52 - i * 13);
    scene.add(cloud);
    clouds.push(cloud);
  }

  const scenery = new THREE.Group();
  scene.add(scenery);

  const car = createCar();
  scene.add(car);

  const dayTop = new THREE.Color();
  const duskTop = new THREE.Color();
  const dayBottom = new THREE.Color();
  const duskBottom = new THREE.Color();
  const dayFog = new THREE.Color();
  const duskFog = new THREE.Color();
  const dayHemi = new THREE.Color();
  const duskHemi = new THREE.Color();
  const daySun = new THREE.Color();
  const duskSun = new THREE.Color();
  const clock = { travel: 0, time: 0 };
  let movers = [];
  let currentId = null;
  let look = { id: 'county', landmark: 'barn', extras: 'fence', grassMap: 'green' };

  function recycleZ(object, speedDt, far, near) {
    object.position.z += speedDt;
    if (object.position.z > near) object.position.z -= far;
  }

  function applyRoute(id) {
    const theme = themeFor(id);
    if (theme.id === currentId) return;
    currentId = theme.id;
    look = {
      id: theme.id,
      landmark: theme.landmark,
      extras: theme.extras,
      grassMap: theme.grassMap,
      grassHex: theme.grass.toString(16).padStart(6, '0'),
      skyTopHex: theme.skyTop.toString(16).padStart(6, '0'),
      fogHex: theme.fog.toString(16).padStart(6, '0'),
    };

    grass.material.map = grassMaps[theme.grassMap] || grassMaps.green;
    grass.material.color.setHex(0xffffff);
    grass.material.needsUpdate = true;
    shoulderMat.color.setHex(theme.shoulder);
    cloudMat.color.setHex(theme.cloud);
    hemi.groundColor.setHex(theme.hemiGround);

    dayTop.setHex(theme.skyTop);
    duskTop.setHex(theme.duskTop);
    dayBottom.setHex(theme.skyBottom);
    duskBottom.setHex(theme.duskBottom);
    dayFog.setHex(theme.fog);
    duskFog.setHex(theme.duskFog);
    dayHemi.setHex(theme.hemiSky);
    duskHemi.setHex(theme.hemiDusk);
    daySun.setHex(theme.sunDay);
    duskSun.setHex(theme.sunDusk);
    sun.material.color.setHex(theme.sunDay);
    sunGlow.material.color.setHex(theme.sunDusk);

    hills.forEach((hill, i) => {
      hill.material.color.setHex(theme.hills[i % theme.hills.length]);
      seatHill(hill, theme.hillScale);
    });

    clearGroup(scenery);
    const built = populateScenery(scenery, theme);
    movers = built.movers;
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

    clock.time += dt;
    const impulse = game.driveImpulse;
    const speed = 5.5 + game.passiveRate * 0.28 + impulse * 16;
    clock.travel += speed * dt;

    roadTex.offset.y = (clock.travel * 0.085) % 1;
    Object.values(grassMaps).forEach((tex) => {
      tex.offset.y = (clock.travel * 0.012) % 1;
    });

    const cycle = (0.1 + clock.time * 0.022 + game.totalMiles * 0.00018) % 1;
    const sunAngle = cycle * Math.PI;
    const sunHeight = Math.sin(sunAngle);
    const dusk = THREE.MathUtils.smoothstep(0.58, 0.14, sunHeight);
    skyMat.uniforms.topColor.value.copy(dayTop).lerp(duskTop, dusk * 0.36);
    skyMat.uniforms.bottomColor.value.copy(dayBottom).lerp(duskBottom, dusk);
    const fog = dayFog.clone().lerp(duskFog, dusk);
    scene.fog.color.copy(fog);
    scene.background.copy(fog);
    scene.fog.near = 38 + dusk * 8;
    scene.fog.far = 168 + dusk * 18;
    hemi.color.copy(dayHemi).lerp(duskHemi, dusk);
    hemi.intensity = 0.72 + (1 - dusk) * 0.22;
    sunLight.intensity = 1.72 - dusk * 0.55;
    sunLight.color.copy(daySun).lerp(duskSun, dusk);
    fill.intensity = 0.22 + dusk * 0.12;
    renderer.toneMappingExposure = 1.16 - dusk * 0.18;
    car.userData.lights.emissiveIntensity = 0.2 + dusk * 1.65;
    car.userData.tails.emissiveIntensity = 0.18 + dusk * 0.6;
    const beam = dusk * 48;
    car.userData.spots.forEach((spot) => {
      spot.intensity = beam;
    });
    car.userData.kiss.intensity = dusk * 7.5;

    sun.position.set(Math.cos(sunAngle) * 44, 3.4 + sunHeight * 24, -88);
    sunGlow.material.opacity = 0.16 + dusk * 0.12;
    const lightPos = sun.position.clone().normalize().multiplyScalar(58);
    lightPos.y = Math.max(14, lightPos.y);
    sunLight.position.copy(lightPos);

    const move = speed * dt;
    movers.forEach((item) => {
      recycleZ(item.obj, move * item.speed, item.far, item.near);
    });
    hills.forEach((hill) => recycleZ(hill, move * 0.22, 90, 20));
    clouds.forEach((cloud, i) => {
      cloud.position.x += dt * (0.28 + i * 0.04);
      if (cloud.position.x > 55) cloud.position.x = -55;
    });

    const bob = Math.sin(clock.time * 6.2) * 0.01 * (0.35 + impulse * 0.45);
    car.position.y = bob;
    car.rotation.x = -impulse * 0.018 + Math.sin(clock.time * 5.1) * 0.005;
    car.rotation.z = Math.sin(clock.time * 1.8) * 0.008;
    car.userData.wheels.forEach((wheel) => {
      wheel.rotation.x += speed * dt * 2.4;
    });

    camTarget.set(0.76, 2.2 + impulse * 0.05, 8.35 + impulse * 0.22);
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
    return { ...look };
  }

  function setTime(t) {
    clock.time = t;
  }

  return { update, render, renderer, applyRoute, getLook, setTime };
}
