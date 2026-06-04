import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// ══════════════════════════════════════════
//  TEXTURE FACTORY — Procedural Canvas
// ══════════════════════════════════════════

function makeWoodTexture(light = false) {
  const W = 512, H = 512;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const base1 = light ? '#c8904a' : '#7a4a1e';
  const base2 = light ? '#5c3510' : '#42240b';
  ctx.fillStyle = base1;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 80; i++) {
    const y = (i / 80) * H + Math.sin(i * 0.8) * 6;
    const w = Math.random() * 3 + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= W; x += 8) {
      ctx.lineTo(x, y + Math.sin(x * 0.04 + i) * 2.5);
    }
    ctx.strokeStyle = i % 3 === 0 ? base2 : (light ? '#d4a060' : '#6b3d18');
    ctx.lineWidth = w;
    ctx.globalAlpha = 0.55;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

function makeWallTexture() {
  const W = 512, H = 512;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#d4c4b0';
  ctx.fillRect(0, 0, W, H);
  const brickW = 80, brickH = 32, mortar = 4;
  for (let row = 0; row * (brickH + mortar) < H + brickH; row++) {
    const offsetX = (row % 2) * (brickW / 2);
    const y0 = row * (brickH + mortar);
    for (let col = -1; col * (brickW + mortar) < W + brickW; col++) {
      const x0 = col * (brickW + mortar) + offsetX;
      const r = 140 + Math.floor(Math.random() * 30);
      const g = 70  + Math.floor(Math.random() * 20);
      const b = 45  + Math.floor(Math.random() * 15);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x0 + mortar/2, y0 + mortar/2, brickW, brickH);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  return tex;
}

function makeCeilingTexture() {
  const W = 256, H = 256;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#eadecc';
  ctx.fillRect(0, 0, W, H);
  return new THREE.CanvasTexture(c);
}

function makeFabricTexture(hue = 'blue') {
  const W = 128, H = 128;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const palettes = {
    blue:  ['#2a4a7a', '#1e3660', '#3a5a90'],
    green: ['#2a5a3a', '#1e4428', '#3a6a4a'],
    red:   ['#7a2a2a', '#601e1e', '#903a3a'],
  };
  const cols = palettes[hue] || palettes.blue;
  ctx.fillStyle = cols[0];
  ctx.fillRect(0, 0, W, H);
  return new THREE.CanvasTexture(c);
}

// ══════════════════════════════════════════
//  SCENE, CAMERA, RENDERER Setup
// ══════════════════════════════════════════
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x110d06);
scene.fog = new THREE.Fog(0x110d06, 15, 35);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 4, 9);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2 - 0.05; // Mencegah kamera menembus lantai

// ══════════════════════════════════════════
//  LIGHTING
// ══════════════════════════════════════════
const ambient = new THREE.AmbientLight(0x554433, 0.8);
scene.add(ambient);

const ceilingLight = new THREE.PointLight(0xffecc4, 3, 20);
ceilingLight.position.set(0, 5.5, 0);
ceilingLight.castShadow = true;
ceilingLight.shadow.mapSize.set(1028, 1028);
scene.add(ceilingLight);

// Bohlam visual untuk lampu atas
const lampGeo = new THREE.SphereGeometry(0.2, 16, 16);
const lampMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const lampMesh = new THREE.Mesh(lampGeo, lampMat);
lampMesh.position.copy(ceilingLight.position);
scene.add(lampMesh);

// ══════════════════════════════════════════
//  RUANGAN (Lantai, Dinding, Plafon)
// ══════════════════════════════════════════
const roomW = 16, roomH = 6, roomD = 12;

// Lantai
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(roomW, roomD),
  new THREE.MeshStandardMaterial({ map: makeWoodTexture(), roughness: 0.6 })
);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

// Plafon
const ceilMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(roomW, roomD),
  new THREE.MeshStandardMaterial({ map: makeCeilingTexture(), roughness: 0.9 })
);
ceilMesh.rotation.x = Math.PI / 2;
ceilMesh.position.y = roomH;
scene.add(ceilMesh);

// Dinding Belakang
const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomW, roomH),
  new THREE.MeshStandardMaterial({ map: makeWallTexture(), roughness: 0.8 })
);
backWall.position.set(0, roomH / 2, -roomD / 2);
backWall.receiveShadow = true;
scene.add(backWall);

// ══════════════════════════════════════════
//  BARISAN OBJEK SEDERHANA
// ══════════════════════════════════════════

// Meja panjang penopang barisan objek
const tableGeo = new THREE.BoxGeometry(11, 0.8, 2);
const tableMat = new THREE.MeshStandardMaterial({ map: makeWoodTexture(true), roughness: 0.4 });
const table = new THREE.Mesh(tableGeo, tableMat);
table.position.set(0, 0.4, -1);
table.castShadow = true;
table.receiveShadow = true;
scene.add(table);

// Kumpulan geometri yang akan dibariskan
const geometries = [
  { geo: new THREE.BoxGeometry(0.9, 0.9, 0.9), type: 'Kubus', desc: 'Kotak 3D dengan 6 sisi presisi.', color: 'red' },
  { geo: new THREE.SphereGeometry(0.55, 32, 32), type: 'Bola (Sphere)', desc: 'Bulatan sempurna bertekstur kain.', color: 'blue' },
  { geo: new THREE.ConeGeometry(0.55, 1.1, 32), type: 'Kerucut (Cone)', desc: 'Geometri runcing seperti tumpeng.', color: 'green' },
  { geo: new THREE.CylinderGeometry(0.45, 0.45, 1.1, 32), type: 'Silinder', desc: 'Tabung silindris vertikal.', color: 'blue' },
  { geo: new THREE.TorusGeometry(0.4, 0.16, 16, 100), type: 'Torus (Donat)', desc: 'Bentuk cincin melingkar estetik.', color: 'red' }
];

const interactiveObjects = [];
const spacing = 2.0; 
const startX = -((geometries.length - 1) * spacing) / 2; // Mengatur barisan tepat di tengah meja

geometries.forEach((item, index) => {
  const mat = new THREE.MeshStandardMaterial({
    map: makeFabricTexture(item.color),
    roughness: 0.5,
  });

  const mesh = new THREE.Mesh(item.geo, mat);
  mesh.position.set(startX + (index * spacing), 1.35, -1); 
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  // Menyimpan data kustom objek untuk dibaca Raycaster
  mesh.userData = {
    name: item.type,
    description: item.desc,
    baseColor: item.color
  };

  scene.add(mesh);
  interactiveObjects.push(mesh);
});

// ══════════════════════════════════════════
//  INTERAKSI: RAYCASTER (Hover & Click)
// ══════════════════════════════════════════
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;

const infoEl = document.getElementById('info');
const nameEl = document.getElementById('iname');
const detailEl = document.getElementById('idetail');

// Sorot Mouse (Hover)
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    document.body.style.cursor = 'pointer';

    if (hoveredObject !== obj) {
      if (hoveredObject) hoveredObject.material.emissive.setHex(0x000000);
      hoveredObject = obj;
      hoveredObject.material.emissive.setHex(0x332211); // Efek menyala redup saat disorot
      nameEl.innerText = hoveredObject.userData.name;
    }
  } else {
    document.body.style.cursor = 'default';
    if (hoveredObject) {
      hoveredObject.material.emissive.setHex(0x000000);
      hoveredObject = null;
      if (!infoEl.classList.contains('active')) {
        nameEl.innerText = "Ruangan Malam";
      }
    }
  }
});

// Klik Mouse untuk Detail Info
window.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    infoEl.classList.add('active');
    nameEl.innerText = obj.userData.name;
    detailEl.innerHTML = `
      <span><strong>Deskripsi:</strong> ${obj.userData.description}</span>
      <span><strong>Posisi X:</strong> ${obj.position.x.toFixed(2)}</span>
      <span><strong>Warna Tema:</strong> ${obj.userData.baseColor.toUpperCase()}</span>
    `;
  } else {
    infoEl.classList.remove('active');
    nameEl.innerText = "Ruangan Malam";
    detailEl.innerHTML = "";
  }
});

// Penyesuaian Ukuran Jendela Layar
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ══════════════════════════════════════════
//  ANIMATION LOOP
// ══════════════════════════════════════════
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime();
  controls.update();

  // Animasi berputar dan melayang unik untuk tiap objek di barisan
  interactiveObjects.forEach((obj, i) => {
    obj.rotation.y = elapsedTime * 0.4 + i;
    obj.position.y = 1.35 + Math.sin(elapsedTime * 2 + i) * 0.08;
  });

  renderer.render(scene, camera);
}

animate();