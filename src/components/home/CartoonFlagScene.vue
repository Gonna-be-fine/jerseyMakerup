<template>
  <div class="cloth-scene-container" ref="containerRef">
    <canvas ref="canvasRef" class="cloth-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { publicPath } from '../../utils/publicPath';

const containerRef = ref(null);
const canvasRef = ref(null);
const isGusting = ref(false);

// Preset styles for the 3 hanging clothes
const fabricPresets = [
  {
    name: '先锋竞技',
    items: [
      { primaryColor: '#b91c1c', secondaryColor: '#1e3a8a', accentColor: '#f8fafc', pattern: 'jersey', number: '07', title: 'RED FORCE' },
      { primaryColor: '#0f172a', secondaryColor: '#4f46e5', accentColor: '#38bdf8', pattern: 'cyber', number: '24', title: 'CUSTOM LAB' },
      { primaryColor: '#047857', secondaryColor: '#ea580c', accentColor: '#fef08a', pattern: 'stripes', number: '88', title: 'APEX RACER' }
    ]
  },
  {
    name: '极简潮流',
    items: [
      { primaryColor: '#18181b', secondaryColor: '#71717a', accentColor: '#ffffff', pattern: 'cyber', number: '01', title: 'MONOCHROME' },
      { primaryColor: '#312e81', secondaryColor: '#ec4899', accentColor: '#a5f3fc', pattern: 'jersey', number: '10', title: 'PRO STUDIO' },
      { primaryColor: '#7c2d12', secondaryColor: '#d97706', accentColor: '#fed7aa', pattern: 'stripes', number: '33', title: 'DESERT RUN' }
    ]
  },
  {
    name: '活力未来',
    items: [
      { primaryColor: '#0369a1', secondaryColor: '#06b6d4', accentColor: '#ffffff', pattern: 'stripes', number: '09', title: 'OCEAN WAVE' },
      { primaryColor: '#581c87', secondaryColor: '#a855f7', accentColor: '#f43f5e', pattern: 'cyber', number: '77', title: 'CYBER PULSE' },
      { primaryColor: '#15803d', secondaryColor: '#84cc16', accentColor: '#fef08a', pattern: 'jersey', number: '18', title: 'BIO TECH' }
    ]
  }
];

let scene, camera, renderer, animationFrameId;
let sceneGroup;
let clothMeshes = [];
let animatedCat = null;
let windStrength = 1.0;
let targetWindStrength = 1.0;
let clock = new THREE.Clock();

const LUCKY_CAT_GROUND_Y = -2.1;
let layoutState = {
  cameraBase: new THREE.Vector3(0, 0.5, 7.8),
  lookAt: new THREE.Vector3(0.6, 0.2, 0),
  parallaxX: 1.5,
  parallaxY: 0.8
};

// Cloth mesh parameters
const CLOTH_SEG_X = 28;
const CLOTH_SEG_Y = 24;

// 3 Clothes Configurations:
// id 0: Clipped with pegs on the left
// id 1: Draped directly over the rope without clips (搭在绳子�?
// id 2: Clipped with pegs on the right
const clothConfigs = [
  { id: 0, w: 1.20, h: 1.50, ropeU: 0.43, isDraped: false, phaseOffset: 0.0, speedMult: 1.05 },
  { id: 1, w: 1.35, h: 1.55, ropeU: 0.55, isDraped: true, phaseOffset: 1.9, speedMult: 0.92 },
  { id: 2, w: 1.15, h: 1.42, ropeU: 0.68, isDraped: false, phaseOffset: 4.1, speedMult: 1.12 }
];

// Helper to draw realistic high-detail textured sportswear fabric graphic
function createFabricTexture(item) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = item.primaryColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (item.pattern === 'cyber') {
    // Dynamic color block
    ctx.fillStyle = item.secondaryColor;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.32);
    ctx.lineTo(canvas.width, canvas.height * 0.12);
    ctx.lineTo(canvas.width, canvas.height * 0.54);
    ctx.lineTo(0, canvas.height * 0.74);
    ctx.closePath();
    ctx.fill();

    // Geometric accent stripe
    ctx.strokeStyle = item.accentColor;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.30);
    ctx.lineTo(canvas.width, canvas.height * 0.10);
    ctx.stroke();

    // Number & title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 130px "Inter", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.number, canvas.width * 0.5, canvas.height * 0.48);

    ctx.font = '700 24px "Inter", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillStyle = item.accentColor;
    ctx.fillText(item.title || 'CUSTOM LAB', canvas.width * 0.5, canvas.height * 0.62);
  } else if (item.pattern === 'jersey') {
    // Classic athletic chevron
    ctx.fillStyle = item.secondaryColor;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.5, canvas.height * 0.1);
    ctx.lineTo(canvas.width, canvas.height * 0.48);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(0, canvas.height * 0.48);
    ctx.closePath();
    ctx.fill();

    // White piping
    ctx.strokeStyle = item.accentColor;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.47);
    ctx.lineTo(canvas.width * 0.5, canvas.height * 0.09);
    ctx.lineTo(canvas.width, canvas.height * 0.47);
    ctx.stroke();

    // Number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 150px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.number, canvas.width * 0.5, canvas.height * 0.56);
  } else {
    // Speed lines
    const stripeW = 55;
    for (let x = 60; x < canvas.width; x += stripeW * 2.5) {
      ctx.fillStyle = item.secondaryColor;
      ctx.fillRect(x, 0, stripeW, canvas.height);
    }
    // Diagonal sash
    ctx.fillStyle = item.accentColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width * 0.25, 0);
    ctx.lineTo(canvas.width * 0.85, canvas.height);
    ctx.lineTo(canvas.width * 0.60, canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 140px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.number, canvas.width * 0.5, canvas.height * 0.5);
  }

  // Micro-mesh breathable sports fabric texture simulation
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const idx = (y * canvas.width + x) * 4;
      const noise = (Math.sin(x * 0.8) * Math.cos(y * 0.8)) * 14;
      data[idx] = Math.min(255, Math.max(0, data[idx] + noise));
      data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + noise));
      data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + noise));
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Border stitch line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Create custom 3D folded geometry for garments draped directly over the rope (no pegs)
function createDrapedClothGeometry(w, h, segX, segY) {
  const geom = new THREE.BufferGeometry();
  const positions = [];
  const uvs = [];
  const indices = [];

  const backLen = h * 0.45;   // Back flap height
  const frontLen = h * 0.80;  // Front flap height
  const archRadius = 0.065;  // Deeper wrap so the center rope stays buried

  // Grid: (segY + 1) rows along length, (segX + 1) columns across width
  for (let iy = 0; iy <= segY; iy++) {
    const t = iy / segY; // 0 (back bottom) -> 1 (front bottom)
    
    let y, z, texV;
    if (t < 0.35) {
      // Back flap hanging down (strictly behind rope: negative Z)
      const r = t / 0.35; // 0 at bottom, 1 near fold
      y = -(1 - r) * backLen;
      z = -(archRadius + 0.008);
      texV = 0.2 + r * 0.6;
    } else if (t <= 0.55) {
      // Arch curve rolling smoothly over the rope from back (-Z) over the top to front (+Z)
      const r = (t - 0.35) / 0.20; // 0 to 1
      const angle = Math.PI * (1 - r); // PI down to 0
      y = Math.sin(angle) * archRadius;
      z = -Math.cos(angle) * (archRadius + 0.008); // Keep the ridge a bit deeper around the rope
      texV = 0.85;
    } else {
      // Front flap hanging down (strictly in front of rope: positive Z)
      const r = (t - 0.55) / 0.45; // 0 near fold, 1 at bottom
      y = -r * frontLen;
      z = archRadius + 0.008;
      texV = 1.0 - r * 0.95;
    }

    for (let ix = 0; ix <= segX; ix++) {
      const u = ix / segX;
      const x = (u - 0.5) * w;

      positions.push(x, y, z);
      uvs.push(u, Math.max(0, Math.min(1, texV)));
    }
  }

  for (let iy = 0; iy < segY; iy++) {
    for (let ix = 0; ix < segX; ix++) {
      const a = iy * (segX + 1) + ix;
      const b = iy * (segX + 1) + (ix + 1);
      const c = (iy + 1) * (segX + 1) + ix;
      const d = (iy + 1) * (segX + 1) + (ix + 1);

      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  return geom;
}


const triggerWindGust = () => {
  isGusting.value = true;
  targetWindStrength = 2.4;
  setTimeout(() => {
    targetWindStrength = 1.0;
    isGusting.value = false;
  }, 1400);
};

// Catenary sag curve stretching all the way beyond the left & right screen borders
function createRopeCurve() {
  const p0 = new THREE.Vector3(-12.0, 3.8, -0.60);  // Far offscreen top-left (reaches screen edge)
  const p1 = new THREE.Vector3(-6.5, 2.5, -0.50);   // Smooth entry from left
  const p2 = new THREE.Vector3(-1.8, 1.65, -0.42);  // Dip near cloth 0 (recessed Z)
  const p3 = new THREE.Vector3(0.6, 1.15, -0.42);   // Deepest Sag in middle under draped cloth 1 (recessed Z)
  const p4 = new THREE.Vector3(3.0, 1.45, -0.42);   // Dip near cloth 2 (recessed Z)
  const p5 = new THREE.Vector3(6.5, 2.2, -0.50);    // Rising right
  const p6 = new THREE.Vector3(10.5, 3.4, -0.60);

  return new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4, p5, p6], false, 'catmullrom', 0.5);
}

// Helper to load and control the uploaded animated Lucky Cat GLB model (招财萌猫)
function createLuckyCatModel() {
  const rootGroup = new THREE.Group();
  
  rootGroup.position.set(2.4, LUCKY_CAT_GROUND_Y, 0.9);
  rootGroup.rotation.y = -0.35; // Angle nicely towards the camera
  rootGroup.scale.set(0.018, 0.018, 0.018); // Compact & cute scale for foreground decoration

  let mixer = null;
  let activeAction = null;
  let isLoaded = false;
  let bounceTime = 0;
  let isInteracting = false;

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(
    publicPath('/models/lucky_cat_with_animation_cute_maneki_neko.glb'),
    (gltf) => {
      const model = gltf.scene;

      // Ensure proper shadow casting and materials
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            // Enhance lighting responsiveness if needed
            child.material.depthWrite = true;
          }
        }
      });

      // Position the model correctly inside the root group
      rootGroup.add(model);

      // Play the built-in animation
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        // Play the main beckoning & nodding animation track
        activeAction = mixer.clipAction(gltf.animations[0]);
        activeAction.setEffectiveTimeScale(1.0);
        activeAction.play();
      }

      isLoaded = true;
    },
    undefined,
    (error) => {
      console.error('Error loading Lucky Cat GLB model:', error);
    }
  );

  function update(delta) {
    if (delta > 0.1) delta = 0.016;

    // Advance skeletal & mesh keyframe animations smoothly
    if (mixer) {
      mixer.update(delta);
    }
  }

  return {
    group: rootGroup,
    update,
    dispose: () => {
      if (mixer) mixer.stopAllAction();
      rootGroup.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
            else child.material.dispose();
          }
        }
      });
    }
  };
}

const initScene = () => {
  const container = containerRef.value;
  const canvas = canvasRef.value;
  if (!container || !canvas) return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || 560;

  // Scene with ambient light fog
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#e9f5ff');
  scene.fog = new THREE.Fog(0xf8fafc, 14, 32);
  // Perspective camera
  camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 0.5, 7.8);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.95);
  scene.add(hemiLight);

  // Key directional light casting soft shadows across the wide area
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.4);
  dirLight.position.set(6.0, 9.0, 5.0);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 26;
  dirLight.shadow.camera.left = -12;
  dirLight.shadow.camera.right = 12;
  dirLight.shadow.camera.top = 8;
  dirLight.shadow.camera.bottom = -8;
  dirLight.shadow.bias = -0.0004;
  dirLight.shadow.radius = 3.2;
  scene.add(dirLight);

  // Fill Light
  const fillLight = new THREE.DirectionalLight(0x94a3b8, 0.85);
  fillLight.position.set(-7, 3, 2);
  scene.add(fillLight);

  // Soft Rim light
  const rimLight = new THREE.DirectionalLight(0x6366f1, 0.6);
  rimLight.position.set(0, -2, -6);
  scene.add(rimLight);

  // Ground plane catching dynamic shadows from the sagging line and clothes
  const groundGeom = new THREE.PlaneGeometry(60, 60);
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.15 });
  const groundMesh = new THREE.Mesh(groundGeom, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -2.1;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // Scene Root Group
  sceneGroup = new THREE.Group();
  
  // Responsive framing: keep the cloths and lucky cat inside narrow mobile viewports.
  const applyResponsiveLayout = (w, h) => {
    const aspect = w / h;
    const isShortMobile = w <= 576;
    let nextLayout;

    if (aspect > 1.3) {
      sceneGroup.position.set(1.4, 0, 0);
      sceneGroup.scale.set(1, 1, 1);
      nextLayout = {
        cameraBase: new THREE.Vector3(0, 0.5, 7.8),
        lookAt: new THREE.Vector3(0.6, 0.2, 0),
        parallaxX: 1.5,
        parallaxY: 0.8,
        catPosition: new THREE.Vector3(2.4, LUCKY_CAT_GROUND_Y, 0.9),
        catScale: 0.018
      };
    } else if (aspect > 0.9) {
      sceneGroup.position.set(0.45, -0.02, 0);
      sceneGroup.scale.set(0.86, 0.86, 0.86);
      nextLayout = {
        cameraBase: new THREE.Vector3(0.05, 0.44, 8.5),
        lookAt: new THREE.Vector3(0.25, 0.15, 0),
        parallaxX: 1.15,
        parallaxY: 0.62,
        catPosition: new THREE.Vector3(1.65, LUCKY_CAT_GROUND_Y, 0.82),
        catScale: 0.016
      };
    } else {
      sceneGroup.position.set(isShortMobile ? -0.08 : -0.02, 0.16, 0);
      sceneGroup.scale.set(isShortMobile ? 0.56 : 0.62, isShortMobile ? 0.56 : 0.62, isShortMobile ? 0.56 : 0.62);
      nextLayout = {
        cameraBase: new THREE.Vector3(0, 0.34, isShortMobile ? 9.6 : 9.15),
        lookAt: new THREE.Vector3(0, 0.08, 0),
        parallaxX: 0.55,
        parallaxY: 0.42,
        catPosition: new THREE.Vector3(isShortMobile ? 0.82 : 1.02, LUCKY_CAT_GROUND_Y, 0.68),
        catScale: isShortMobile ? 0.013 : 0.014
      };
    }

    layoutState = {
      cameraBase: nextLayout.cameraBase,
      lookAt: nextLayout.lookAt,
      parallaxX: nextLayout.parallaxX,
      parallaxY: nextLayout.parallaxY
    };

    camera.position.copy(nextLayout.cameraBase);
    camera.lookAt(nextLayout.lookAt);

    if (animatedCat) {
      animatedCat.group.position.copy(nextLayout.catPosition);
      animatedCat.group.scale.setScalar(nextLayout.catScale);
    }
  };
  applyResponsiveLayout(width, height);

  // --- 1. Long Sagging Rope Stretching to Screen Edges ---
  const ropeCurve = createRopeCurve();
  const ropeGeom = new THREE.TubeGeometry(ropeCurve, 160, 0.016, 12, false);
  const ropeMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.25,
    roughness: 0.85
  });
  const ropeMesh = new THREE.Mesh(ropeGeom, ropeMat);
  ropeMesh.castShadow = true;
  ropeMesh.receiveShadow = true;
  sceneGroup.add(ropeMesh);

  // --- 2. 3 Hanging Clothes (1 Draped over the line, 2 clipped) ---
  clothMeshes = [];
  const currentPreset = fabricPresets[2];

  const clipMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.7,
    roughness: 0.3
  });

  const springMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.1
  });

  clothConfigs.forEach((cfg, index) => {
    let geom;
    if (cfg.isDraped) {
      // Draped directly over the rope (no pegs)
      geom = createDrapedClothGeometry(cfg.w, cfg.h, CLOTH_SEG_X, CLOTH_SEG_Y);
    } else {
      // Flat clipped cloth
      geom = new THREE.PlaneGeometry(cfg.w, cfg.h, CLOTH_SEG_X, CLOTH_SEG_Y);
    }

    // Initial vertex buffer
    const posAttr = geom.attributes.position;
    const origPositions = [];
    for (let i = 0; i < posAttr.count; i++) {
      origPositions.push(new THREE.Vector3(
        posAttr.getX(i),
        posAttr.getY(i),
        posAttr.getZ(i)
      ));
    }

    const tex = createFabricTexture(currentPreset.items[index]);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      side: THREE.DoubleSide,
      roughness: 0.65,
      metalness: 0.05,
      depthWrite: true,
      depthTest: true,
      shadowSide: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Get point and tangent on the sagging rope
    const centerPoint = ropeCurve.getPointAt(cfg.ropeU);
    const tangent = ropeCurve.getTangentAt(cfg.ropeU).normalize();
    const angleZ = Math.atan2(tangent.y, tangent.x);

    mesh.position.copy(centerPoint);
    if (cfg.isDraped) {
      mesh.position.z += 0.04;
    } else {
      mesh.position.y -= cfg.h / 2;
    }
    mesh.rotation.z = angleZ * 0.85;

    sceneGroup.add(mesh);

    // Only create clothes pegs/clips if NOT draped
    if (!cfg.isDraped) {
      [-cfg.w * 0.32, cfg.w * 0.32].forEach(localX => {
        const clipG = new THREE.Group();
        const clipPos = centerPoint.clone().add(
          new THREE.Vector3(Math.cos(angleZ) * localX, Math.sin(angleZ) * localX + 0.02, 0.01)
        );
        clipG.position.copy(clipPos);
        clipG.rotation.z = angleZ;

        const clipBody = new THREE.Mesh(
          new THREE.BoxGeometry(0.045, 0.11, 0.038),
          clipMat
        );
        clipBody.position.set(0, -0.02, 0);
        clipBody.castShadow = true;
        clipG.add(clipBody);

        const pinMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.01, 0.01, 0.05, 10),
          springMat
        );
        pinMesh.rotation.z = Math.PI / 2;
        pinMesh.position.set(0, 0.015, 0);
        clipG.add(pinMesh);

        sceneGroup.add(clipG);
      });
    }

    clothMeshes.push({
      mesh,
      geometry: geom,
      origPositions,
      config: cfg
    });
  });

  scene.add(sceneGroup);

  // --- 3. Animated Lucky Cat (招财萌猫 GLB 模型) on the Ground ---
  animatedCat = createLuckyCatModel();
  scene.add(animatedCat.group);
  applyResponsiveLayout(width, height);

  // Mouse Parallax
  let targetRotY = 0, targetRotX = 0;
  const onMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    targetRotY = nx * 0.22;
    targetRotX = ny * 0.12;
  };
  container.addEventListener('mousemove', onMouseMove);

  // Resize Observer
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width: w, height: h } = entry.contentRect;
      if (w > 0 && h > 0 && renderer && camera) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        applyResponsiveLayout(w, h);
      }
    }
  });
  resizeObserver.observe(container);

  // Animation Loop
  let lastFrameTime = performance.now();
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    const now = performance.now();
    const delta = Math.min(0.05, (now - lastFrameTime) / 1000);
    lastFrameTime = now;

    const time = clock.getElapsedTime();
    windStrength += (targetWindStrength - windStrength) * 0.04;

    // Simulate wind flutter on each piece of cloth
    clothMeshes.forEach(item => {
      const pos = item.geometry.attributes.position;
      const cfg = item.config;
      const origs = item.origPositions;
      const halfW = cfg.w / 2;

      const clothTime = time * cfg.speedMult + cfg.phaseOffset;
      const windSpeed = clothTime * 4.2 * windStrength;

      if (cfg.isDraped) {
        // Draped cloth over the rope: front & back flaps fluttering naturally without self-intersection
        for (let i = 0; i < pos.count; i++) {
          const orig = origs[i];
          const u = orig.x / halfW;
          const dropRatio = Math.max(0, -orig.y) / cfg.h;
          const hangWeight = Math.pow(Math.min(1.0, dropRatio * 1.3), 1.35);

          // Shared wind wave and ripple at this drop depth
          const windWave = (Math.sin(windSpeed + u * 1.5) * 0.18 + 0.08) * hangWeight * windStrength;
          const ripple = Math.sin(dropRatio * 8.0 - windSpeed * 1.3 + u * 2.0) * 0.04 * hangWeight * windStrength;
          const flutter = Math.cos(dropRatio * 14.0 - windSpeed * 2.4 + u * 3.5) * 0.015 * Math.pow(dropRatio, 1.8) * windStrength;
          const displacement = windWave + ripple + flutter;

          let totalZ = orig.z;
          if (orig.z > 0.02) {
            // Front flap (+Z)
            totalZ = Math.max(orig.z + displacement, 0.055);
          } else if (orig.z < -0.02) {
            // Back flap (-Z) - synchronised with front flap, staying strictly 0.11m behind
            totalZ = Math.min(orig.z + displacement * 0.90, -0.055);
          } else {
            // Top arch rolling over rope
            totalZ = Math.max(orig.z + Math.sin(windSpeed * 0.5 + u) * 0.004 * windStrength, 0.025);
          }

          const yContraction = -Math.abs(displacement) * 0.10;
          const totalY = orig.y + yContraction;
          const totalX = orig.x + Math.sin(windSpeed * 0.6 + dropRatio * 3.0) * 0.02 * hangWeight * windStrength;

          pos.setXYZ(i, totalX, totalY, totalZ);
        }
      } else {
        // Flat clipped cloth
        const halfH = cfg.h / 2;
        for (let i = 0; i < pos.count; i++) {
          const orig = origs[i];
          const v = (halfH - orig.y) / cfg.h;
          const u = orig.x / halfW;
          const hangWeight = Math.pow(Math.max(0, v), 1.35);

          const billowZ = (Math.sin(windSpeed + u * 1.5) * 0.26 + 0.12) * hangWeight * windStrength;
          const rippleZ = Math.sin(v * 7.0 - windSpeed * 1.2 + u * 2.0) * 0.11 * hangWeight * windStrength;
          const edgeFlutter = Math.cos(v * 13.0 - windSpeed * 2.4 + u * 3.5) * 0.035 * Math.pow(v, 2.0) * windStrength;

          const totalZ = (billowZ + rippleZ + edgeFlutter);
          const yContraction = -Math.abs(totalZ) * 0.12;
          const totalY = orig.y + yContraction;
          const totalX = orig.x + Math.sin(windSpeed * 0.6 + v * 2.5) * 0.025 * hangWeight * windStrength;

          pos.setXYZ(i, totalX, totalY, orig.z + totalZ);
        }
      }

      pos.needsUpdate = true;
      item.geometry.computeVertexNormals();
    });

    // Update animated cartoon cat running & roaming on the ground
    if (animatedCat) {
      animatedCat.update(delta);
    }

    // Camera mouse parallax
    camera.position.x += (layoutState.cameraBase.x + targetRotY * layoutState.parallaxX - camera.position.x) * 0.05;
    camera.position.y += (layoutState.cameraBase.y + targetRotX * layoutState.parallaxY - camera.position.y) * 0.05;
    camera.position.z += (layoutState.cameraBase.z - camera.position.z) * 0.05;
    camera.lookAt(layoutState.lookAt);

    renderer.render(scene, camera);
  };

  animate();

  return () => {
    cancelAnimationFrame(animationFrameId);
    resizeObserver.disconnect();
    container.removeEventListener('mousemove', onMouseMove);
    if (renderer) renderer.dispose();
    if (animatedCat) animatedCat.dispose();
    clothMeshes.forEach(item => {
      if (item.geometry) item.geometry.dispose();
    });
  };
};

let cleanupScene;

onMounted(() => {
  cleanupScene = initScene();
});

onBeforeUnmount(() => {
  if (cleanupScene) cleanupScene();
});
</script>

<style scoped>
.cloth-scene-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 580px;
  background: #f8fafc;
  user-select: none;
  overflow: hidden;
}

.cloth-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
}

.cloth-canvas:active {
  cursor: grabbing;
}

@media (max-width: 576px) {
  .cloth-scene-container {
    min-height: 100%;
  }
}


</style>
