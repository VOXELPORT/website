import * as THREE from 'three';

/*
 * The home page hero: three floating voxel islands at night.
 *   your PC (a little house with a lit window) → the VoxelPort relay (a beacon) → your friends.
 * Glowing packets travel the route the way a real connection does: the server dials out to the relay,
 * and the relay hands players to it. Drag to look around, click a friend to make them jump,
 * click the beacon to send a burst.
 */

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function rng(seed) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* ---------------------------------------------------------------- voxel building */

class VoxelSet {
  constructor() { this.map = new Map(); }
  add(x, y, z, color, glow = false) { this.map.set(`${x},${y},${z}`, { x, y, z, color, glow }); }
  has(x, y, z) { return this.map.has(`${x},${y},${z}`); }
  /** One instanced mesh for lit blocks, one for glowing ones. Hidden faces are not culled; the counts are small. */
  build(geometry) {
    const lit = [];
    const glow = [];
    for (const v of this.map.values()) (v.glow ? glow : lit).push(v);
    const out = [];
    const make = (list, material) => {
      if (!list.length) return;
      const mesh = new THREE.InstancedMesh(geometry, material, list.length);
      const m = new THREE.Matrix4();
      const c = new THREE.Color();
      list.forEach((v, i) => {
        m.makeTranslation(v.x, v.y, v.z);
        mesh.setMatrixAt(i, m);
        mesh.setColorAt(i, c.set(v.color));
      });
      mesh.castShadow = material.type !== 'MeshBasicMaterial';
      mesh.receiveShadow = material.type !== 'MeshBasicMaterial';
      out.push(mesh);
    };
    make(lit, new THREE.MeshLambertMaterial());
    make(glow, new THREE.MeshBasicMaterial({ toneMapped: false }));
    return out;
  }
}

const pick = (r, list) => list[Math.floor(r() * list.length)];
const GRASS = ['#5fae3e', '#67b845', '#57a338', '#6fc04c'];
const DIRT = ['#7a5232', '#6c4629', '#835a38'];
const STONE = ['#5f6669', '#6a7174', '#565c5f', '#737a7c'];
const DEEP = ['#3c4245', '#454b4e', '#363b3e'];

function island(vs, cx, cy, cz, radius, r) {
  for (let x = -radius - 1; x <= radius + 1; x += 1) {
    for (let z = -radius - 1; z <= radius + 1; z += 1) {
      const d = Math.hypot(x, z) + (r() - 0.5) * 1.3;
      if (d > radius) continue;
      vs.add(cx + x, cy, cz + z, pick(r, GRASS));
      const depth = 1 + Math.floor((radius - d) * 1.25 + r() * 1.6);
      for (let k = 1; k <= depth; k += 1) {
        let color = k === 1 ? pick(r, DIRT) : k < depth * 0.6 ? pick(r, STONE) : pick(r, DEEP);
        if (k > 2 && r() < 0.035) color = r() < 0.5 ? '#4fd4e4' : '#f7c94b'; // a few ores
        vs.add(cx + x, cy - k, cz + z, color);
      }
    }
  }
}

function tree(vs, x, y, z, r) {
  for (let k = 0; k < 3; k += 1) vs.add(x, y + k, z, '#6b4a2b');
  const leaves = ['#3d8b37', '#459a3e', '#367c31'];
  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dz = -1; dz <= 1; dz += 1) {
      for (let dy = 2; dy <= 3; dy += 1) if (!(dx === 0 && dz === 0 && dy === 2)) vs.add(x + dx, y + dy, z + dz, pick(r, leaves));
    }
  }
  vs.add(x, y + 4, z, pick(r, leaves));
  vs.add(x + 1, y + 4, z, pick(r, leaves));
  vs.add(x, y + 4, z - 1, pick(r, leaves));
}

function house(vs, x0, y0, z0, r) {
  // 5×5 footprint, walls 3 high; the front faces +z (towards the camera)
  const W = 5;
  for (let x = 0; x < W; x += 1) {
    for (let z = 0; z < W; z += 1) {
      for (let y = 0; y < 3; y += 1) {
        const edge = x === 0 || z === 0 || x === W - 1 || z === W - 1;
        if (!edge) continue;
        const corner = (x === 0 || x === W - 1) && (z === 0 || z === W - 1);
        vs.add(x0 + x, y0 + y, z0 + z, corner ? '#5b3f24' : pick(r, ['#b48a4e', '#a97f45', '#bd9457']));
      }
    }
  }
  // door and windows
  vs.map.delete(`${x0 + 2},${y0},${z0 + W - 1}`);
  vs.add(x0 + 2, y0, z0 + W - 1, '#3b2715');
  vs.add(x0 + 2, y0 + 1, z0 + W - 1, '#3b2715');
  vs.add(x0 + 1, y0 + 1, z0 + W - 1, '#ffd27a', true);
  vs.add(x0 + 3, y0 + 1, z0 + W - 1, '#ffd27a', true);
  vs.add(x0 + W - 1, y0 + 1, z0 + 2, '#ffd27a', true);
  // stepped roof
  for (let layer = 0; layer < 4; layer += 1) {
    for (let x = -1 + layer; x <= W - layer; x += 1) {
      for (let z = -1 + layer; z <= W - layer; z += 1) vs.add(x0 + x, y0 + 3 + layer, z0 + z, layer % 2 ? '#4a2f1b' : '#5a3a22');
    }
  }
  // chimney
  for (let y = 3; y < 7; y += 1) vs.add(x0 + 3, y0 + y, z0 + 1, pick(r, STONE));
}

function relayTower(vs, x, y, z, r) {
  const brick = ['#7d8a8a', '#6f7c7c', '#889595'];
  for (let dy = 0; dy < 5; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dz = -1; dz <= 1; dz += 1) {
        const moss = dy < 2 && r() < 0.25;
        vs.add(x + dx, y + dy, z + dz, moss ? '#4f7d3b' : pick(r, brick));
      }
    }
  }
  // top: the beacon core
  vs.add(x, y + 5, z, '#7ff6ff', true);
  for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) vs.add(x + dx, y + 5, z + dz, '#4fd4e4', true);
}

/* ---------------------------------------------------------------- blocky players */

function makePlayer(shirt, pants, hair, skin = '#e0ac7e') {
  const g = new THREE.Group();
  const box = (w, h, d, color, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color }));
    m.position.set(x, y, z);
    m.castShadow = true;
    g.add(m);
    return m;
  };
  const legL = box(0.24, 0.72, 0.24, pants, -0.12, 0.36, 0);
  const legR = box(0.24, 0.72, 0.24, pants, 0.12, 0.36, 0);
  box(0.48, 0.72, 0.26, shirt, 0, 1.08, 0);
  const armL = box(0.22, 0.72, 0.22, shirt, -0.36, 1.08, 0);
  const armR = box(0.22, 0.72, 0.22, shirt, 0.36, 1.08, 0);
  const head = new THREE.Group();
  head.position.set(0, 1.68, 0);
  const skull = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), new THREE.MeshLambertMaterial({ color: skin }));
  skull.castShadow = true;
  head.add(skull);
  const hairM = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.5), new THREE.MeshLambertMaterial({ color: hair }));
  hairM.position.y = 0.2;
  head.add(hairM);
  for (const ex of [-0.11, 0.11]) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.02), new THREE.MeshBasicMaterial({ color: '#1b1b2a' }));
    eye.position.set(ex, 0.02, 0.245);
    head.add(eye);
  }
  g.add(head);
  // arms swing from the shoulder
  for (const arm of [armL, armR]) {
    arm.geometry.translate(0, -0.3, 0);
    arm.position.y += 0.3;
  }
  for (const leg of [legL, legR]) {
    leg.geometry.translate(0, -0.3, 0);
    leg.position.y += 0.3;
  }
  return { g, head, armL, armR, legL, legR, jump: 0, jumpV: 0, phase: Math.random() * 6, wave: 0 };
}

/* ---------------------------------------------------------------- textures */

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function skyMaterial() {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      top: { value: new THREE.Color('#03070d') },
      mid: { value: new THREE.Color('#081a1f') },
      bottom: { value: new THREE.Color('#0d2a26') },
    },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP;
      void main(){ float h = vP.y; vec3 c = h > 0. ? mix(mid, top, smoothstep(0., .6, h)) : mix(mid, bottom, smoothstep(0., -.35, h));
      gl_FragColor = vec4(c, 1.); }`,
  });
}

/* ---------------------------------------------------------------- mount */

export function mountWorld(host, labels = {}) {
  const small = host.clientWidth < 760;
  const renderer = new THREE.WebGLRenderer({ antialias: !small, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  renderer.shadowMap.enabled = !small;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.className = 'w3-canvas';
  host.append(canvas);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#081a1f', 85, 210);
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), skyMaterial()));

  const camera = new THREE.PerspectiveCamera(34, 1, 0.5, 900);
  const target = new THREE.Vector3(2, 3, 0);
  const aim = new THREE.Vector3();

  /* lights */
  scene.add(new THREE.HemisphereLight('#a9ddff', '#22362a', 1.7));
  const rim = new THREE.DirectionalLight('#4fd4e4', 1.1);
  rim.position.set(25, 12, -35);
  scene.add(rim);
  const moon = new THREE.DirectionalLight('#e2eeff', 2.6);
  moon.position.set(-30, 45, 25);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  Object.assign(moon.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 140 });
  moon.shadow.bias = -0.0006;
  scene.add(moon);
  const windowLight = new THREE.PointLight('#ffb85c', 38, 16, 2);
  windowLight.position.set(-8.5, 3, 4.6);
  scene.add(windowLight);
  const beaconLight = new THREE.PointLight('#5ff0ff', 60, 22, 2);
  beaconLight.position.set(3, 12.5, -6);
  scene.add(beaconLight);

  /* the world, in a group so dragging can turn it */
  const world = new THREE.Group();
  scene.add(world);
  const r = rng(7);
  const vs = new VoxelSet();
  island(vs, -9, 0, 1, 6, r); // your PC
  island(vs, 3, 5, -6, 3, r); // relay
  island(vs, 14, 1, 2, 4, r); // friends
  island(vs, -1, -6, 9, 2, r); // a stray rock
  island(vs, 22, 7, -9, 1, r);
  house(vs, -11, 1, -1, r);
  tree(vs, -14, 1, 3, r);
  tree(vs, -5, 1, -3, r);
  tree(vs, 16, 2, -1, r);
  relayTower(vs, 3, 6, -6, r);
  // flowers on the friends' island
  for (const [x, z, c] of [[12, 4, '#f05d5e'], [16, 4, '#f7c94b'], [13, 0, '#b48cff'], [11, 2, '#f7c94b']]) vs.add(x, 2, z, c);
  const geo = new THREE.BoxGeometry(1, 1, 1);
  vs.build(geo).forEach((m) => world.add(m));

  /* the beacon beam */
  const beamMat = new THREE.MeshBasicMaterial({ color: '#5ff0ff', transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 80, 12, 1, true), beamMat);
  beam.position.set(3, 11.5 + 40, -6);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 80, 8, 1, true), beamMat.clone());
  core.material.opacity = 0.45;
  core.position.copy(beam.position);
  world.add(beam, core);

  /* friends */
  const friends = [
    makePlayer('#3aa6d9', '#2d3d8a', '#3b2a1a'),
    makePlayer('#d9483a', '#2b2b38', '#e8c35a'),
    makePlayer('#55b84a', '#5a3b22', '#1c1c1c'),
  ];
  const spots = [[12, 2, 3.4], [14.3, 2, 1.2], [15.8, 2, 4.2]];
  friends.forEach((f, i) => {
    f.g.position.set(...spots[i]);
    f.base = f.g.position.y;
    f.g.lookAt(3, 2, -6);
    f.g.rotation.x = 0;
    f.g.rotation.z = 0;
    world.add(f.g);
  });

  /* connection paths: PC → relay, relay → each friend */
  const relayTop = new THREE.Vector3(3, 11.6, -6);
  const pcOut = new THREE.Vector3(-8.5, 7.5, 1.5);
  const curve = (a, b, lift) => {
    const mid = a.clone().lerp(b, 0.5);
    mid.y += lift;
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  };
  const up = curve(pcOut, relayTop, 6);
  const downs = friends.map((f) => curve(relayTop, f.g.position.clone().add(new THREE.Vector3(0, 2.3, 0)), 4));
  const pathMat = new THREE.MeshBasicMaterial({ color: '#a4e78b', transparent: true, opacity: 0.22, depthWrite: false, toneMapped: false });
  for (const c of [up, ...downs]) world.add(new THREE.Mesh(new THREE.TubeGeometry(c, 48, 0.035, 5, false), pathMat));

  /* packets: small glowing cubes + soft glow points */
  const MAXP = 60;
  const packetMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.26, 0.26, 0.26), new THREE.MeshBasicMaterial({ toneMapped: false }), MAXP);
  packetMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  world.add(packetMesh);
  const glowGeo = new THREE.BufferGeometry();
  const glowPos = new Float32Array(MAXP * 3);
  const glowCol = new Float32Array(MAXP * 3);
  glowGeo.setAttribute('position', new THREE.BufferAttribute(glowPos, 3));
  glowGeo.setAttribute('color', new THREE.BufferAttribute(glowCol, 3));
  const glowTex = glowTexture();
  const glowPts = new THREE.Points(glowGeo, new THREE.PointsMaterial({ size: 2.2, map: glowTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  world.add(glowPts);
  const packets = [];
  const GREEN = new THREE.Color('#b6ff8f');
  const CYAN = new THREE.Color('#7ff6ff');
  function spawn(kind, t = 0) {
    if (packets.length >= MAXP) return;
    if (kind === 'up') packets.push({ curve: up, t, speed: 0.32 + Math.random() * 0.08, color: GREEN, next: true });
    else packets.push({ curve: downs[kind], t, speed: 0.42 + Math.random() * 0.1, color: CYAN });
  }

  /* sky: stars, moon, clouds, drifting motes */
  const starCount = small ? 450 : 900;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(Math.random() * 0.95);
    const R = 300;
    starPos.set([R * Math.sin(ph) * Math.cos(th), R * Math.cos(ph) - 20, R * Math.sin(ph) * Math.sin(th)], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, color: '#dff6ff', transparent: true, opacity: 0.85, fog: false }));
  scene.add(stars);

  const moonMesh = new THREE.Mesh(new THREE.BoxGeometry(14, 14, 1), new THREE.MeshBasicMaterial({ color: '#eef6dd', fog: false, toneMapped: false }));
  moonMesh.position.set(-95, 85, -230);
  moonMesh.lookAt(0, 0, 0);
  const moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: '#cfe8ff', transparent: true, opacity: 0.35, depthWrite: false, fog: false }));
  moonGlow.scale.setScalar(80);
  moonGlow.position.copy(moonMesh.position);
  scene.add(moonMesh, moonGlow);

  const moteCount = 140;
  const motePos = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i += 1) motePos.set([(Math.random() - 0.5) * 60, Math.random() * 25 - 5, (Math.random() - 0.5) * 30], i * 3);
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ size: 0.5, map: glowTex, color: '#b6ff8f', transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  world.add(motes);

  /* labels (HTML, so they stay crisp and translatable) */
  const labelDefs = [
    { key: 'pc', at: new THREE.Vector3(-8.5, 9.5, 1.5) },
    { key: 'relay', at: new THREE.Vector3(3, 14.5, -6) },
    { key: 'friends', at: new THREE.Vector3(14, 5.2, 2.5) },
  ];
  const labelEls = labelDefs.map((d) => {
    const el = document.createElement('span');
    el.className = `w3-label w3-label-${d.key}`;
    el.textContent = labels[d.key] || '';
    host.append(el);
    return el;
  });

  /* ---------------------------------------------------------------- framing */
  function resize() {
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Wide screens: the world sits in the right half, clear of the headline. Narrow screens: centred above the text.
    const aspect = w / h;
    const wide = aspect > 1.15;
    camera.userData.dist = wide ? 74 : 22 / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect) + 6;
    const halfH = camera.userData.dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.userData.shiftX = wide ? halfH * aspect * 0.42 : 0;
    camera.userData.shiftY = wide ? -halfH * 0.2 : -halfH * 0.1;
    camera.updateProjectionMatrix();
    render(0);
  }

  /* ---------------------------------------------------------------- input */
  const pointer = new THREE.Vector2();
  const look = { x: 0, y: 0 };
  let yaw = 0;
  let yawV = 0;
  let drag = null;
  const ray = new THREE.Raycaster();
  friends.forEach((f) => f.g.traverse((c) => { c.userData.friend = f; }));
  const hitTargets = friends.map((f) => f.g);
  const beaconHit = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3, 3.4), new THREE.MeshBasicMaterial({ visible: false }));
  beaconHit.position.set(3, 11.5, -6);
  world.add(beaconHit);

  const ndc = (e) => {
    const rc = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
  };
  function pickAt(e) {
    ndc(e);
    ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects([...hitTargets, beaconHit], true)[0];
    return hit?.object;
  }
  const onMove = (e) => {
    ndc(e);
    look.x = pointer.x;
    look.y = pointer.y;
    if (drag) {
      const dx = e.clientX - drag.x;
      drag.moved += Math.abs(dx);
      yaw += dx * 0.005;
      yawV = dx * 0.3;
      drag.x = e.clientX;
      return;
    }
    if (e.pointerType === 'mouse') canvas.style.cursor = pickAt(e) ? 'pointer' : 'grab';
  };
  const onDown = (e) => {
    drag = { x: e.clientX, moved: 0, id: e.pointerId };
    if (e.pointerType === 'mouse') canvas.style.cursor = 'grabbing';
  };
  const onUp = (e) => {
    if (!drag) return;
    if (drag.moved < 6) {
      const obj = pickAt(e);
      if (obj?.userData.friend) {
        const f = obj.userData.friend;
        if (f.jump <= 0.001) { f.jumpV = 6.5; f.wave = 1.6; }
      } else if (obj === beaconHit) {
        for (let i = 0; i < 9; i += 1) spawn(i % 3, -i * 0.06);
        beaconLight.intensity = 160;
      }
    }
    drag = null;
    if (e.pointerType === 'mouse') canvas.style.cursor = 'grab';
  };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointerleave', () => { look.x = 0; look.y = 0; });

  /* ---------------------------------------------------------------- animation */
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const proj = new THREE.Vector3();
  let spawnClock = 0;
  let time = 0;
  for (let i = 0; i < 4; i += 1) spawn('up', i * 0.25);
  for (let i = 0; i < 3; i += 1) spawn(i, 0.15 + i * 0.3);

  function render(dt) {
    time += dt;
    const t = time;

    // camera: slow drift + pointer parallax
    if (!drag) {
      yawV *= Math.exp(-3 * dt);
      yaw += yawV * dt * 0.02;
      yaw += (0 - yaw) * Math.min(1, dt * 0.35);
    }
    yaw = Math.max(-0.9, Math.min(0.9, yaw));
    world.rotation.y = yaw + (reduceMotion ? 0 : Math.sin(t * 0.07) * 0.06);
    const dist = camera.userData.dist || 74;
    const az = 0.42 + look.x * 0.05;
    const el = 0.3 + look.y * 0.03;
    camera.position.set(target.x + Math.sin(az) * Math.cos(el) * dist, target.y + Math.sin(el) * dist, target.z + Math.cos(az) * Math.cos(el) * dist);
    // aim off-centre (left/down of the world) so the world lands right/up on screen
    const right = new THREE.Vector3(Math.cos(az), 0, -Math.sin(az));
    aim.copy(target).addScaledVector(right, -(camera.userData.shiftX || 0));
    aim.y += camera.userData.shiftY || 0;
    camera.position.add(aim).sub(target);
    camera.lookAt(aim);

    // friends
    for (const f of friends) {
      const idle = reduceMotion ? 0 : Math.sin(t * 2 + f.phase);
      f.head.rotation.y = Math.sin(t * 0.6 + f.phase) * 0.35;
      f.head.rotation.x = idle * 0.05;
      if (f.jump > 0 || f.jumpV > 0) {
        f.jumpV -= 22 * dt;
        f.jump = Math.max(0, f.jump + f.jumpV * dt);
        if (f.jump === 0) f.jumpV = 0;
      }
      f.wave = Math.max(0, f.wave - dt);
      f.armR.rotation.x = f.wave > 0 ? -2.6 + Math.sin(t * 16) * 0.35 : idle * 0.12;
      f.armL.rotation.x = -idle * 0.12;
      f.legL.rotation.x = f.jump > 0 ? -0.4 : 0;
      f.legR.rotation.x = f.jump > 0 ? 0.4 : 0;
      f.g.position.y = f.base + f.jump;
    }

    // packets
    if (!reduceMotion) {
      spawnClock += dt;
      if (spawnClock > 0.55) {
        spawnClock = 0;
        spawn('up');
      }
    }
    for (let i = packets.length - 1; i >= 0; i -= 1) {
      const pk = packets[i];
      pk.t += dt * pk.speed * (reduceMotion ? 0 : 1);
      if (pk.t >= 1) {
        packets.splice(i, 1);
        if (pk.next) {
          spawn(Math.floor(Math.random() * 3));
          beaconLight.intensity = Math.max(beaconLight.intensity, 95);
        }
      }
    }
    for (let i = 0; i < MAXP; i += 1) {
      const pk = packets[i];
      if (pk && pk.t >= 0) {
        pk.curve.getPoint(Math.max(0, pk.t), p);
        const sc = Math.sin(Math.min(1, Math.max(0, pk.t)) * Math.PI) * 0.6 + 0.5;
        q.setFromEuler(new THREE.Euler(t * 3 + i, t * 2 + i, 0));
        m4.compose(p, q, s.setScalar(sc));
        packetMesh.setColorAt(i, pk.color);
        glowPos.set([p.x, p.y, p.z], i * 3);
        glowCol.set([pk.color.r * 0.8, pk.color.g * 0.8, pk.color.b * 0.8], i * 3);
      } else {
        m4.makeScale(0, 0, 0);
        glowPos.set([0, -999, 0], i * 3);
      }
      packetMesh.setMatrixAt(i, m4);
    }
    packetMesh.instanceMatrix.needsUpdate = true;
    if (packetMesh.instanceColor) packetMesh.instanceColor.needsUpdate = true;
    glowGeo.attributes.position.needsUpdate = true;
    glowGeo.attributes.color.needsUpdate = true;

    beaconLight.intensity += (60 - beaconLight.intensity) * Math.min(1, dt * 3);
    beamMat.opacity = 0.14 + Math.sin(t * 2.2) * 0.04;
    windowLight.intensity = 36 + Math.sin(t * 9) * 1.5 + Math.sin(t * 2.7) * 2;

    // ambience
    if (!reduceMotion) {
      const arr = moteGeo.attributes.position.array;
      for (let i = 0; i < moteCount; i += 1) {
        arr[i * 3 + 1] += dt * (0.3 + (i % 5) * 0.08);
        if (arr[i * 3 + 1] > 22) arr[i * 3 + 1] = -5;
      }
      moteGeo.attributes.position.needsUpdate = true;
      stars.material.opacity = 0.75 + Math.sin(t * 0.8) * 0.1;
    }

    renderer.render(scene, camera);

    // labels follow their anchors
    labelDefs.forEach((d, i) => {
      proj.copy(d.at).applyMatrix4(world.matrixWorld).project(camera);
      const el2 = labelEls[i];
      if (proj.z > 1) {
        el2.style.opacity = '0';
        return;
      }
      el2.style.opacity = '';
      el2.style.transform = `translate(-50%, -100%) translate(${((proj.x + 1) / 2) * host.clientWidth}px, ${((1 - proj.y) / 2) * host.clientHeight}px)`;
    });
  }

  /* ---------------------------------------------------------------- loop, only while visible */
  let raf = 0;
  let last = 0;
  let visible = true;
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000 || 0, 1 / 20);
    last = now;
    render(dt);
  };
  const update = () => {
    const run = visible && !document.hidden;
    if (run && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    } else if (!run && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; update(); });
  io.observe(host);
  document.addEventListener('visibilitychange', update);
  resize();
  update();
  requestAnimationFrame(() => host.classList.add('is-ready'));

  return {
    setLabels(next) {
      labelDefs.forEach((d, i) => { labelEls[i].textContent = next[d.key] || ''; });
    },
    dispose() {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('pointerup', onUp);
      scene.traverse((o) => {
        o.geometry?.dispose();
        const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
        mats.forEach((m) => { m.map?.dispose(); m.dispose(); });
      });
      renderer.dispose();
      canvas.remove();
      labelEls.forEach((e) => e.remove());
      host.classList.remove('is-ready');
    },
  };
}
