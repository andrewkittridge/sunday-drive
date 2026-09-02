import * as THREE from 'three';
import { clearGroup, populateScenery, themeFor } from './route.js';

function canvasTexture(size, paint) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  paint(canvas.getContext('2d'), size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function makeGrassTexture(base, dark, light) {
  return canvasTexture(256, (ctx, size) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 4) {
      ctx.fillStyle = y % 8 === 0 ? dark : light;
      ctx.fillRect(0, y, size, 2);
    }
    for (let i = 0; i < 900; i += 1) {
      ctx.fillStyle = Math.random() > 0.5 ? dark : light;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 2);
    }
  });
}

function makeRoadTexture() {
  return canvasTexture(256, (ctx, size) => {
    ctx.fillStyle = '#4a4540';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 1400; i += 1) {
      const shade = 58 + Math.random() * 28;
      ctx.fillStyle = `rgb(${shade},${shade - 4},${shade - 8})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }
    ctx.fillStyle = '#d9d1c2';
    ctx.fillRect(10, 0, 6, size);
    ctx.fillRect(size - 16, 0, 6, size);
    ctx.fillStyle = '#e6c15a';
    ctx.fillRect(size / 2 - 4, 0, 8, size * 0.55);
  });
}

function createCar() {
  const car = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({ color: 0xe8d4b4 });
  const woodMat = new THREE.MeshLambertMaterial({ color: 0x6b4a32 });
  const cabinMat = new THREE.MeshLambertMaterial({ color: 0x3d5c56 });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x2a2622 });
  const chromeMat = new THREE.MeshLambertMaterial({ color: 0xc5c0b4 });
  const glassMat = new THREE.MeshLambertMaterial({ color: 0x1b2a32 });
  const rubberMat = new THREE.MeshLambertMaterial({ color: 0x1a1816 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.5, 4.25), bodyMat);
  body.position.y = 0.62;
  body.castShadow = true;
  car.add(body);

  const skirt = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.14, 4.15), darkMat);
  skirt.position.y = 0.4;
  car.add(skirt);

  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.12, 1.42), bodyMat);
  hood.position.set(0, 0.9, -1.22);
  hood.rotation.x = 0.06;
  hood.castShadow = true;
  car.add(hood);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.5, 2.15), cabinMat);
  cabin.position.set(0, 1.08, 0.42);
  cabin.castShadow = true;
  car.add(cabin);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 2.22), cabinMat);
  roof.position.set(0, 1.34, 0.4);
  car.add(roof);

  for (const x of [-0.62, 0.62]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 2.05), chromeMat);
    rail.position.set(x, 1.42, 0.4);
    car.add(rail);
  }

  for (const side of [-1, 1]) {
    const wood = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 3.15), woodMat);
    wood.position.set(side * 0.95, 0.62, 0.28);
    car.add(wood);
    const chrome = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 3.18), chromeMat);
    chrome.position.set(side * 0.97, 0.78, 0.28);
    car.add(chrome);
  }

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.38, 0.06), glassMat);
  windshield.position.set(0, 1.08, -0.62);
  windshield.rotation.x = -0.32;
  car.add(windshield);

  const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.36, 0.06), glassMat);
  rearGlass.position.set(0, 1.08, 1.48);
  car.add(rearGlass);

  for (const x of [-0.8, 0.8]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 1.7), glassMat);
    side.position.set(x, 1.08, 0.38);
    car.add(side);
  }

  const bumperF = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.18, 0.2), chromeMat);
  bumperF.position.set(0, 0.46, -2.16);
  car.add(bumperF);
  const bumperB = bumperF.clone();
  bumperB.position.z = 2.16;
  car.add(bumperB);

  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.28, 0.08), darkMat);
  grille.position.set(0, 0.62, -2.14);
  car.add(grille);
  for (const x of [-0.28, -0.1, 0.1, 0.28]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.24, 0.04), chromeMat);
    bar.position.set(x, 0.62, -2.18);
    car.add(bar);
  }

  const lightMat = new THREE.MeshLambertMaterial({
    color: 0xffe7b8,
    emissive: 0xffcc77,
    emissiveIntensity: 0.35,
  });
  const spots = [];
  for (const x of [-0.62, 0.62]) {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 10), lightMat);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(x, 0.66, -2.18);
    car.add(lamp);

    const spot = new THREE.SpotLight(0xfff0d0, 0, 52, 0.42, 0.55, 1.35);
    spot.position.set(x, 0.68, -2.2);
    spot.target.position.set(x * 0.25, 0.15, -18);
    spot.castShadow = false;
    car.add(spot);
    car.add(spot.target);
    spots.push(spot);
  }

  const amberMat = new THREE.MeshLambertMaterial({
    color: 0xe8a04a,
    emissive: 0xc47a20,
    emissiveIntensity: 0.2,
  });
  for (const x of [-0.86, 0.86]) {
    const marker = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.06), amberMat);
    marker.position.set(x, 0.7, -2.12);
    car.add(marker);
  }

  const tailMat = new THREE.MeshLambertMaterial({
    color: 0xc45c2a,
    emissive: 0x8a2a12,
    emissiveIntensity: 0.25,
  });
  for (const x of [-0.62, 0.62]) {
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.08), tailMat);
    lamp.position.set(x, 0.7, 2.16);
    car.add(lamp);
  }

  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.04), chromeMat);
  plate.position.set(0, 0.48, 2.18);
  car.add(plate);

  for (const x of [-0.94, 0.94]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.18), chromeMat);
    arm.position.set(x, 1.05, -0.55);
    car.add(arm);
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.08), glassMat);
    mirror.position.set(x * 1.08, 1.05, -0.62);
    car.add(mirror);
  }

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.85, 5), chromeMat);
  antenna.position.set(-0.7, 1.7, 0.9);
  antenna.rotation.z = 0.12;
  car.add(antenna);

  const wheels = [];
  const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.26, 12);
  const hubGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.28, 10);
  for (const [x, z] of [
    [-0.94, -1.28],
    [0.94, -1.28],
    [-0.94, 1.28],
    [0.94, 1.28],
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
    wheels.push(wheel);
  }

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.45, 12),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.05;
  shadow.scale.set(1, 2.2, 1);
  car.add(shadow);

  car.position.set(0, 0, 1.6);
  car.userData.wheels = wheels;
  car.userData.lights = lightMat;
  car.userData.tails = tailMat;
  car.userData.spots = spots;
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
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const fogColor = new THREE.Color('#f0c090');
  scene.fog = new THREE.Fog(fogColor, 34, 150);
  scene.background = fogColor.clone();

  const camera = new THREE.PerspectiveCamera(
    52,
    window.innerWidth / window.innerHeight,
    0.1,
    420,
  );

  const hemi = new THREE.HemisphereLight(0xffc088, 0x5d7a3a, 0.9);
  scene.add(hemi);

  const sunLight = new THREE.DirectionalLight(0xffd4a0, 1.32);
  sunLight.position.set(-48, 24, 10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.near = 4;
  sunLight.shadow.camera.far = 140;
  sunLight.shadow.camera.left = -42;
  sunLight.shadow.camera.right = 42;
  sunLight.shadow.camera.top = 28;
  sunLight.shadow.camera.bottom = -22;
  scene.add(sunLight);

  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color('#7ea6d4') },
      bottomColor: { value: new THREE.Color('#f3d2a0') },
      offset: { value: 0 },
      exponent: { value: 0.55 },
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
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(200, 24, 16), skyMat));

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(5.6, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffe1ad, toneMapped: false, fog: false }),
  );
  const sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(10, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0xffb067,
      transparent: true,
      opacity: 0.28,
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
    new THREE.MeshLambertMaterial({ map: roadTex }),
  );
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.03;
  road.receiveShadow = true;
  scene.add(road);

  const shoulderMat = new THREE.MeshLambertMaterial({ color: 0x9a8a6a });
  for (const x of [-5.15, 5.15]) {
    const shoulder = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 280), shoulderMat);
    shoulder.rotation.x = -Math.PI / 2;
    shoulder.position.set(x, 0.02, 0);
    shoulder.receiveShadow = true;
    scene.add(shoulder);
  }

  function addHill(x, z, radius, color) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 10, 8),
      new THREE.MeshLambertMaterial({ color }),
    );
    mesh.position.set(x, radius * 0.12, z);
    mesh.scale.set(1.75, 0.34, 1.15);
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  const hills = [
    addHill(-40, -78, 22, 0x7e925c),
    addHill(44, -92, 26, 0x8a9a68),
    addHill(-56, -118, 32, 0x6f8454),
    addHill(28, -128, 20, 0x9aa574),
    addHill(-18, -150, 24, 0x7a8d5e),
  ];

  const clouds = [];
  const cloudMat = new THREE.MeshLambertMaterial({
    color: 0xf7ead2,
    transparent: true,
    opacity: 0.72,
  });
  for (let i = 0; i < 6; i += 1) {
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(4.5, 8, 6), cloudMat);
    cloud.scale.set(2.4 + (i % 3) * 0.4, 0.45, 1.2);
    cloud.position.set(-40 + i * 16, 22 + (i % 2) * 4, -40 - i * 12);
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
    sun.material.color.setHex(theme.sunDay);
    sunGlow.material.color.setHex(theme.sunDusk);

    hills.forEach((hill, i) => {
      hill.material.color.setHex(theme.hills[i % theme.hills.length]);
      hill.scale.set(theme.hillScale[0], theme.hillScale[1], theme.hillScale[2]);
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

    const theme = themeFor(currentId);
    clock.time += dt;
    const impulse = game.driveImpulse;
    const speed = 5.5 + game.passiveRate * 0.28 + impulse * 16;
    clock.travel += speed * dt;

    roadTex.offset.y = (clock.travel * 0.085) % 1;
    Object.values(grassMaps).forEach((tex) => {
      tex.offset.y = (clock.travel * 0.012) % 1;
    });

    const cycle = (clock.time * 0.035 + game.totalMiles * 0.00025) % 1;
    const dusk = 0.5 + 0.5 * Math.sin(cycle * Math.PI * 2);
    skyMat.uniforms.topColor.value.copy(dayTop).lerp(duskTop, dusk);
    skyMat.uniforms.bottomColor.value.copy(dayBottom).lerp(duskBottom, dusk);
    const fog = dayFog.clone().lerp(duskFog, dusk);
    scene.fog.color.copy(fog);
    scene.background.copy(fog);
    hemi.color.setHex(dusk > 0.6 ? theme.hemiDusk : theme.hemiSky);
    hemi.intensity = 0.75 + (1 - dusk) * 0.28;
    sunLight.intensity = 1.45 - dusk * 0.45;
    sunLight.color.setHex(dusk > 0.55 ? theme.sunDusk : theme.sunDay);
    car.userData.lights.emissiveIntensity = 0.22 + dusk * 1.55;
    car.userData.tails.emissiveIntensity = 0.2 + dusk * 0.55;
    car.userData.spots.forEach((spot) => {
      spot.intensity = dusk * 2.6;
    });

    const sunAngle = cycle * Math.PI * 2;
    sun.position.set(
      Math.cos(sunAngle) * 70,
      16 + Math.sin(sunAngle) * 18,
      -60,
    );
    sunLight.position.copy(sun.position).multiplyScalar(0.7).setY(Math.max(12, sun.position.y));

    const move = speed * dt;
    movers.forEach((item) => {
      recycleZ(item.obj, move * item.speed, item.far, item.near);
    });
    hills.forEach((hill) => recycleZ(hill, move * 0.22, 90, 20));
    clouds.forEach((cloud, i) => {
      cloud.position.x += dt * (0.4 + i * 0.05);
      if (cloud.position.x > 55) cloud.position.x = -55;
    });

    const bob = Math.sin(clock.time * 9) * 0.015 * (0.4 + impulse);
    car.position.y = bob;
    car.rotation.x = -impulse * 0.04 + Math.sin(clock.time * 7) * 0.008;
    car.rotation.z = Math.sin(clock.time * 2.2) * 0.012;
    car.userData.wheels.forEach((wheel) => {
      wheel.rotation.x += speed * dt * 2.4;
    });

    const camZ = 9.4 + impulse * 1.4;
    const camY = 2.55 + impulse * 0.2;
    camera.position.set(1.35, camY, camZ);
    camera.lookAt(0, 0.85, -8);
  }

  function render() {
    renderer.render(scene, camera);
  }

  function getLook() {
    return { ...look };
  }

  return { update, render, renderer, applyRoute, getLook };
}
