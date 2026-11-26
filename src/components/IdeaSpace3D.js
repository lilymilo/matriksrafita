/**
 * IdeaSpace3D — Real Three.js / WebGL interactive 3D strategy coordinate space.
 *
 * Coordinate Semantics (strictly faithful to LKPD 5):
 *   - X-axis: Feasibility / Kelayakan (1..5)
 *   - Y-axis: Impact / Dampak (1..5)
 *   - Z-axis: Visual depth ONLY (separates coincident coordinates like (4,5) and (3,4)
 *             deterministically without implying a third scoring criterion).
 *
 * Includes damped OrbitControls, camera presets, raycaster hover tooltip, click-to-select,
 * orbital halo highlights on the 3 original selected ideas, live score interpolation with
 * simulation ghost tethers, reduced-motion compliance, WebGL fallback, and full resource cleanup.
 */

import { QUADRANTS } from '../data/ideas.js';
import {
  compute3DNodePositions,
  getQuadrantMeta,
  getTotalScore,
  SCENE_STEP,
  SCENE_Y_BASE,
  scoreToWorldX,
  scoreToWorldY,
} from '../utils/matrix.js';

const QUADRANT_HEX = Object.freeze({
  mint: 0x0f8a5f,
  blue: 0x2563eb,
  peach: 0xc46e09,
  coral: 0xc94558,
});

const CAMERA_PRESETS = Object.freeze({
  iso: { pos: [2.25, 5.05, 10.15], target: [0.05, 3.95, 0.25] },
  front: { pos: [0.05, 4.0, 11.2], target: [0.05, 4.0, 0.2] },
  top: { pos: [0.35, 9.1, 7.0], target: [0.05, 3.9, 0.4] },
});

export function isWebGLAvailable() {
  try {
    if (typeof document === 'undefined') return false;
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Create a crisp high-DPI CanvasTexture for architectural axis & quadrant typography.
 */
function createLabelTexture(THREE, text, options = {}) {
  const {
    font = '600 32px Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color = '#3A4254',
    width = 512,
    height = 96,
    align = 'center',
    bg = null,
    border = null,
    radius = 16,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);

  if (bg) {
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(4, 4, width - 8, height - 8, radius);
    ctx.fill();
  }
  if (border) {
    ctx.strokeStyle = border;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(4, 4, width - 8, height - 8, radius);
    ctx.stroke();
  }

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  const x = align === 'left' ? 16 : align === 'right' ? width - 16 : width / 2;
  ctx.fillText(text, x, height / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function createTextPlane(THREE, text, worldW, worldH, options = {}) {
  const tex = createLabelTexture(THREE, text, options);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(worldW, worldH), mat);
  return { mesh, texture: tex, material: mat };
}

function createNodeBadgeSprite(THREE, id, isTrio) {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 88;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = isTrio ? '#111827' : 'rgba(255,255,255,0.94)';
  ctx.beginPath();
  ctx.roundRect(14, 14, 132, 60, 14);
  ctx.fill();

  ctx.strokeStyle = isTrio ? '#0F8A5F' : '#CBD2DF';
  ctx.lineWidth = isTrio ? 4 : 3;
  ctx.stroke();

  ctx.font = '700 32px "Geist Mono", ui-monospace, monospace';
  ctx.fillStyle = isTrio ? '#FFFFFF' : '#151923';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`#${id}`, 80, 45);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.68, 0.37, 1);
  sprite.renderOrder = 12;
  return { sprite, texture, material };
}

/**
 * Mount a full Three.js WebGL interactive Idea Space into `containerEl`.
 * Returns a controller `{ update(state), setCameraPreset(preset), dispose() }`.
 */
export async function mountIdeaSpace3D(containerEl, initialState, callbacks) {
  if (!isWebGLAvailable()) {
    callbacks?.onWebglUnavailable?.();
    return null;
  }

  let THREE;
  let OrbitControls;
  try {
    [THREE, { OrbitControls }] = await Promise.all([
      import('three'),
      import('three/addons/controls/OrbitControls.js'),
    ]);
  } catch (err) {
    console.error('Failed to load Three.js module:', err);
    callbacks?.onWebglUnavailable?.();
    return null;
  }

  // Guard against unmount while async import was in flight
  if (!containerEl || !containerEl.isConnected) {
    return null;
  }

  const reducedMotion = prefersReducedMotion();
  const disposables = [];
  const track = (obj) => {
    disposables.push(obj);
    return obj;
  };

  // Clear loading placeholder
  const mountHost = containerEl.querySelector('[data-three-canvas-host]') || containerEl;
  mountHost.innerHTML = '';

  const tooltipEl = containerEl.querySelector('[data-three-tooltip]');

  // Scene & Studio Atmosphere
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xedf0f5);
  scene.fog = new THREE.Fog(0xedf0f5, 19, 34);

  // Renderer with mobile-friendly pixel ratio cap
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  });
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.domElement.className = 'three-webgl-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  mountHost.appendChild(renderer.domElement);

  // Camera
  const width = Math.max(320, mountHost.clientWidth || 720);
  const height = Math.max(380, mountHost.clientHeight || 540);
  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 80);
  camera.position.set(...CAMERA_PRESETS.iso.pos);
  renderer.setSize(width, height, false);

  // Restrained OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !reducedMotion;
  controls.dampingFactor = 0.075;
  controls.enablePan = false;
  controls.rotateSpeed = 0.65;
  controls.zoomSpeed = 0.75;
  controls.minDistance = 5.6;
  controls.maxDistance = 15.5;
  controls.minPolarAngle = 0.34;
  controls.maxPolarAngle = Math.PI * 0.54;
  controls.minAzimuthAngle = -Math.PI * 0.42;
  controls.maxAzimuthAngle = Math.PI * 0.42;
  controls.target.set(...CAMERA_PRESETS.iso.target);
  controls.update();

  // Studio Three-Point Lighting
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd4dbe8, 1.15);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfffdf8, 1.25);
  keyLight.position.set(5.5, 11.5, 9.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = isMobile ? 1024 : 2048;
  keyLight.shadow.mapSize.height = isMobile ? 1024 : 2048;
  keyLight.shadow.camera.near = 2;
  keyLight.shadow.camera.far = 28;
  keyLight.shadow.camera.left = -7.5;
  keyLight.shadow.camera.right = 7.5;
  keyLight.shadow.camera.top = 8.5;
  keyLight.shadow.camera.bottom = -3;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xd9e4ff, 0.55);
  rimLight.position.set(-7.5, 4.5, 6.0);
  scene.add(rimLight);

  // =========================================================================
  // Architectural Studio Floor Plinth + Back Coordinate Plane
  // =========================================================================
  const minX = scoreToWorldX(1) - SCENE_STEP * 0.55;
  const maxX = scoreToWorldX(5) + SCENE_STEP * 0.55;
  const minY = scoreToWorldY(1) - SCENE_STEP * 0.5;
  const maxY = scoreToWorldY(5) + SCENE_STEP * 0.86; // Extra header headroom above Impact = 5 badges
  const threshX = (scoreToWorldX(3) + scoreToWorldX(4)) / 2;
  const threshY = (scoreToWorldY(3) + scoreToWorldY(4)) / 2;
  const planeW = maxX - minX;
  const planeH = maxY - minY;
  const planeCenterX = (minX + maxX) / 2;
  const planeCenterY = (minY + maxY) / 2;

  // Floor plane (receives soft shadows)
  const floorGeo = track(new THREE.PlaneGeometry(24, 18));
  const floorMat = track(new THREE.MeshStandardMaterial({
    color: 0xe6eaf1,
    roughness: 0.94,
    metalness: 0.0,
  }));
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0.0, 1.4);
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // Subtle raised plinth base directly underneath the coordinate plane
  const plinthGeo = track(new THREE.BoxGeometry(planeW + 0.5, 0.11, 2.35));
  const plinthMat = track(new THREE.MeshStandardMaterial({
    color: 0xf7f8fb,
    roughness: 0.72,
    metalness: 0.04,
  }));
  const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
  plinthMesh.position.set(planeCenterX, 0.055, 0.92);
  plinthMesh.receiveShadow = true;
  plinthMesh.castShadow = false;
  scene.add(plinthMesh);

  // Coordinate backplate (crisp matte white architectural board)
  const backGeo = track(new THREE.PlaneGeometry(planeW, planeH));
  const backMat = track(new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.88,
    metalness: 0.02,
  }));
  const backPlane = new THREE.Mesh(backGeo, backMat);
  backPlane.position.set(planeCenterX, planeCenterY, -0.02);
  backPlane.receiveShadow = true;
  scene.add(backPlane);

  // Subtle translucent semantic quadrant washes on the coordinate backplate
  const quadRects = [
    // I — Prioritas Utama (top right: threshX..maxX, threshY..maxY)
    { x0: threshX, x1: maxX, y0: threshY, y1: maxY, color: 0x0f8a5f, opacity: 0.085, label: 'I · PRIORITAS UTAMA', lx: (threshX + maxX) / 2, ly: maxY - 0.28 },
    // II — Quick Wins (bottom right: threshX..maxX, minY..threshY)
    { x0: threshX, x1: maxX, y0: minY, y1: threshY, color: 0x2563eb, opacity: 0.06, label: 'II · QUICK WINS', lx: (threshX + maxX) / 2, ly: minY + 0.28 },
    // III — Tantangan (top left: minX..threshX, threshY..maxY)
    { x0: minX, x1: threshX, y0: threshY, y1: maxY, color: 0xc46e09, opacity: 0.065, label: 'III · TANTANGAN', lx: (minX + threshX) / 2, ly: maxY - 0.28 },
    // IV — Prioritas Rendah (bottom left: minX..threshX, minY..threshY)
    { x0: minX, x1: threshX, y0: minY, y1: threshY, color: 0xc94558, opacity: 0.05, label: 'IV · PRIORITAS RENDAH', lx: (minX + threshX) / 2, ly: minY + 0.28 },
  ];

  for (const qr of quadRects) {
    const qw = qr.x1 - qr.x0;
    const qh = qr.y1 - qr.y0;
    const qGeo = track(new THREE.PlaneGeometry(qw, qh));
    const qMat = track(new THREE.MeshBasicMaterial({
      color: qr.color,
      transparent: true,
      opacity: qr.opacity,
      depthWrite: false,
    }));
    const qMesh = new THREE.Mesh(qGeo, qMat);
    qMesh.position.set((qr.x0 + qr.x1) / 2, (qr.y0 + qr.y1) / 2, -0.008);
    scene.add(qMesh);

    const lbl = createTextPlane(THREE, qr.label, 2.5, 0.36, {
      font: '700 22px "Geist Mono", ui-monospace, monospace',
      color: '#' + qr.color.toString(16).padStart(6, '0'),
      width: 560,
      height: 80,
    });
    track(lbl.texture);
    track(lbl.material);
    track(lbl.mesh.geometry);
    lbl.mesh.position.set(qr.lx, qr.ly, 0.008);
    scene.add(lbl.mesh);
  }

  // Crisp perimeter border & integer gridlines (1..5)
  const gridPoints = [];
  for (let s = 1; s <= 5; s += 1) {
    const gx = scoreToWorldX(s);
    const gy = scoreToWorldY(s);
    gridPoints.push(new THREE.Vector3(gx, minY, 0.003), new THREE.Vector3(gx, maxY, 0.003));
    gridPoints.push(new THREE.Vector3(minX, gy, 0.003), new THREE.Vector3(maxX, gy, 0.003));
  }
  const gridGeo = track(new THREE.BufferGeometry().setFromPoints(gridPoints));
  const gridMat = track(new THREE.LineBasicMaterial({ color: 0xcbd2df, transparent: true, opacity: 0.85 }));
  scene.add(new THREE.LineSegments(gridGeo, gridMat));

  // Perimeter frame
  const borderPoints = [
    new THREE.Vector3(minX, minY, 0.006),
    new THREE.Vector3(maxX, minY, 0.006),
    new THREE.Vector3(maxX, maxY, 0.006),
    new THREE.Vector3(minX, maxY, 0.006),
    new THREE.Vector3(minX, minY, 0.006),
  ];
  const borderGeo = track(new THREE.BufferGeometry().setFromPoints(borderPoints));
  const borderMat = track(new THREE.LineBasicMaterial({ color: 0x9aa4b6 }));
  scene.add(new THREE.Line(borderGeo, borderMat));

  // Threshold crosshairs (3.5 on X and 3.5 on Y) — crisp dark architectural rails
  const threshBarMat = track(new THREE.MeshBasicMaterial({ color: 0x262e40 }));
  const vRailGeo = track(new THREE.BoxGeometry(0.028, planeH, 0.022));
  const vRail = new THREE.Mesh(vRailGeo, threshBarMat);
  vRail.position.set(threshX, planeCenterY, 0.01);
  scene.add(vRail);

  const hRailGeo = track(new THREE.BoxGeometry(planeW, 0.028, 0.022));
  const hRail = new THREE.Mesh(hRailGeo, threshBarMat);
  hRail.position.set(planeCenterX, threshY, 0.01);
  scene.add(hRail);

  // Numeric axis ticks (1..5) and axis titles
  for (let s = 1; s <= 5; s += 1) {
    const xTick = createTextPlane(THREE, String(s), 0.42, 0.34, {
      font: '700 30px "Geist Mono", ui-monospace, monospace',
      color: '#4B5568',
      width: 120,
      height: 96,
    });
    track(xTick.texture);
    track(xTick.material);
    track(xTick.mesh.geometry);
    xTick.mesh.position.set(scoreToWorldX(s), 0.14, 1.92);
    xTick.mesh.rotation.x = -Math.PI / 2;
    scene.add(xTick.mesh);

    const yTick = createTextPlane(THREE, String(s), 0.42, 0.34, {
      font: '700 30px "Geist Mono", ui-monospace, monospace',
      color: '#4B5568',
      width: 120,
      height: 96,
    });
    track(yTick.texture);
    track(yTick.material);
    track(yTick.mesh.geometry);
    yTick.mesh.position.set(minX - 0.32, scoreToWorldY(s), 0.02);
    scene.add(yTick.mesh);
  }

  // Axis titles
  const xTitle = createTextPlane(THREE, 'FEASIBILITY / KELAYAKAN  (1 → 5)', 4.2, 0.44, {
    font: '700 22px "Geist Mono", ui-monospace, monospace',
    color: '#151923',
    width: 760,
    height: 80,
  });
  track(xTitle.texture);
  track(xTitle.material);
  track(xTitle.mesh.geometry);
  xTitle.mesh.position.set(planeCenterX, 0.125, 2.38);
  xTitle.mesh.rotation.x = -Math.PI / 2;
  scene.add(xTitle.mesh);

  const yTitle = createTextPlane(THREE, 'IMPACT / DAMPAK  (1 → 5)', 3.8, 0.42, {
    font: '700 22px "Geist Mono", ui-monospace, monospace',
    color: '#151923',
    width: 680,
    height: 80,
  });
  track(yTitle.texture);
  track(yTitle.material);
  track(yTitle.mesh.geometry);
  yTitle.mesh.position.set(minX - 0.72, planeCenterY, 0.02);
  yTitle.mesh.rotation.z = Math.PI / 2;
  scene.add(yTitle.mesh);

  // =========================================================================
  // Ten Sculpted 3D Idea Nodes + Stems + Anchors + Orbital Halos
  // =========================================================================
  const sharedSphereGeo = track(new THREE.SphereGeometry(0.255, 36, 36));
  const sharedStemGeo = track(new THREE.CylinderGeometry(0.016, 0.016, 1, 14));
  const sharedFootprintGeo = track(new THREE.CylinderGeometry(0.085, 0.085, 0.018, 24));
  const sharedHaloGeo = track(new THREE.TorusGeometry(0.375, 0.02, 16, 48));
  const sharedSelectGeo = track(new THREE.TorusGeometry(0.445, 0.024, 16, 48));
  const sharedGhostGeo = track(new THREE.RingGeometry(0.11, 0.16, 28));

  const stemMatDefault = track(new THREE.MeshStandardMaterial({ color: 0x8b95a7, roughness: 0.45, metalness: 0.45 }));
  const haloMatTrio = track(new THREE.MeshStandardMaterial({ color: 0x0f8a5f, roughness: 0.25, metalness: 0.35 }));
  const selectRingMat = track(new THREE.MeshBasicMaterial({ color: 0x2546f5 }));
  const ghostMat = track(new THREE.MeshBasicMaterial({ color: 0x2546f5, transparent: true, opacity: 0.48, side: THREE.DoubleSide }));
  const tetherMat = track(new THREE.LineDashedMaterial({ color: 0x2546f5, dashSize: 0.12, gapSize: 0.08, transparent: true, opacity: 0.75 }));

  const nodeEntries = new Map();
  const pickableMeshes = [];

  const initialPosMap = compute3DNodePositions(initialState.ideas);

  for (const idea of initialState.ideas) {
    const pos = initialPosMap.get(idea.id);
    const q = getQuadrantMeta(idea.feasibility, idea.impact);

    const sphereMat = track(new THREE.MeshPhysicalMaterial({
      color: QUADRANT_HEX[q.colorKey],
      roughness: 0.28,
      metalness: 0.08,
      clearcoat: 0.48,
      clearcoatRoughness: 0.22,
    }));

    const sphere = new THREE.Mesh(sharedSphereGeo, sphereMat);
    sphere.position.set(pos.x, pos.y, pos.z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.userData.ideaId = idea.id;
    scene.add(sphere);
    pickableMeshes.push(sphere);

    // Stem connecting back-plane (x, y, 0) to node (x, y, z)
    const stem = new THREE.Mesh(sharedStemGeo, stemMatDefault);
    stem.rotation.x = Math.PI / 2;
    stem.scale.set(1, pos.z, 1);
    stem.position.set(pos.x, pos.y, pos.z / 2);
    stem.castShadow = true;
    scene.add(stem);

    // Footprint pin on coordinate wall
    const footMat = track(new THREE.MeshStandardMaterial({
      color: QUADRANT_HEX[q.colorKey],
      roughness: 0.5,
      metalness: 0.15,
    }));
    const footprint = new THREE.Mesh(sharedFootprintGeo, footMat);
    footprint.rotation.x = Math.PI / 2;
    footprint.position.set(pos.x, pos.y, 0.012);
    scene.add(footprint);

    // Subtle orbital halo for the 3 original selected ideas
    let trioHalo = null;
    if (idea.isOriginalFinalSelection) {
      trioHalo = new THREE.Mesh(sharedHaloGeo, haloMatTrio);
      trioHalo.position.set(pos.x, pos.y, pos.z);
      trioHalo.rotation.set(Math.PI * 0.16, -Math.PI * 0.12, 0);
      scene.add(trioHalo);
    }

    // Floating crisp ID sprite
    const badge = createNodeBadgeSprite(THREE, idea.id, idea.isOriginalFinalSelection);
    track(badge.texture);
    track(badge.material);
    badge.sprite.position.set(pos.x, pos.y + 0.44, pos.z);
    scene.add(badge.sprite);

    // Simulation ghost anchor & dashed tether (visible only when modified)
    const ghostAnchor = new THREE.Mesh(sharedGhostGeo, ghostMat);
    ghostAnchor.position.set(pos.origX, pos.origY, 0.025);
    ghostAnchor.visible = false;
    scene.add(ghostAnchor);

    const tetherGeo = track(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(pos.origX, pos.origY, 0.03),
      new THREE.Vector3(pos.x, pos.y, pos.z),
    ]));
    const tetherLine = new THREE.Line(tetherGeo, tetherMat);
    tetherLine.computeLineDistances();
    tetherLine.visible = false;
    scene.add(tetherLine);

    nodeEntries.set(idea.id, {
      id: idea.id,
      sphere,
      sphereMat,
      stem,
      footprint,
      footMat,
      trioHalo,
      badgeSprite: badge.sprite,
      ghostAnchor,
      tetherLine,
      tetherGeo,
      currentPos: new THREE.Vector3(pos.x, pos.y, pos.z),
      targetPos: new THREE.Vector3(pos.x, pos.y, pos.z),
      origPos: new THREE.Vector3(pos.origX, pos.origY, 0.03),
      targetScale: 1,
    });
  }

  // Active Selection Ring (shared ring that tracks selected idea smoothly)
  const selectionRing = new THREE.Mesh(sharedSelectGeo, selectRingMat);
  selectionRing.position.copy(nodeEntries.get(initialState.selectedIdeaId)?.currentPos || new THREE.Vector3());
  scene.add(selectionRing);

  // Subtle vertical drop line from selected node to floor plinth (aids spatial reading)
  const dropLineGeo = track(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0.11, 0),
    new THREE.Vector3(0, 1, 0),
  ]));
  const dropLineMat = track(new THREE.LineBasicMaterial({ color: 0x2546f5, transparent: true, opacity: 0.38 }));
  const dropLine = new THREE.Line(dropLineGeo, dropLineMat);
  scene.add(dropLine);

  // =========================================================================
  // State Synchronization, Hover Raycasting, and Camera Presets
  // =========================================================================
  let latestState = initialState;
  let hoveredIdeaId = null;
  let cameraLerpTarget = null;
  let pointerDownPos = null;

  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const projectedVec = new THREE.Vector3();

  function applyState(nextState) {
    latestState = nextState;
    const posMap = compute3DNodePositions(nextState.ideas);

    for (const idea of nextState.ideas) {
      const entry = nodeEntries.get(idea.id);
      const pos = posMap.get(idea.id);
      if (!entry || !pos) continue;

      const q = getQuadrantMeta(idea.feasibility, idea.impact);
      const colorHex = QUADRANT_HEX[q.colorKey];
      entry.sphereMat.color.setHex(colorHex);
      entry.footMat.color.setHex(colorHex);

      entry.targetPos.set(pos.x, pos.y, pos.z);
      if (reducedMotion) {
        entry.currentPos.copy(entry.targetPos);
      }

      const isSelected = idea.id === nextState.selectedIdeaId;
      const isHovered = idea.id === hoveredIdeaId;
      entry.targetScale = isSelected ? 1.18 : isHovered ? 1.1 : 1.0;

      entry.ghostAnchor.visible = idea.isModified;
      entry.tetherLine.visible = idea.isModified;
    }
  }

  function updateTooltip() {
    if (!tooltipEl) return;
    if (!hoveredIdeaId) {
      tooltipEl.classList.remove('is-visible');
      return;
    }

    const idea = latestState.ideas.find((i) => i.id === hoveredIdeaId);
    const entry = nodeEntries.get(hoveredIdeaId);
    if (!idea || !entry) {
      tooltipEl.classList.remove('is-visible');
      return;
    }

    projectedVec.copy(entry.currentPos);
    projectedVec.y += 0.45;
    projectedVec.project(camera);

    const rect = mountHost.getBoundingClientRect();
    const px = (projectedVec.x * 0.5 + 0.5) * rect.width;
    const py = (-projectedVec.y * 0.5 + 0.5) * rect.height;

    const q = getQuadrantMeta(idea.feasibility, idea.impact);
    const total = getTotalScore(idea.feasibility, idea.impact);

    tooltipEl.innerHTML = `
      <div class="canvas-tooltip__head">
        <span class="mono">#${String(idea.id).padStart(2, '0')}</span>
        <span class="canvas-tooltip__quad">${q.roman} · ${q.name}</span>
      </div>
      <strong class="canvas-tooltip__title">${idea.name}</strong>
      <div class="canvas-tooltip__scores mono">
        <span>F: <b>${idea.feasibility}/5</b></span>
        <span>I: <b>${idea.impact}/5</b></span>
        <span>Total: <b>${total}/10</b></span>
      </div>
      ${idea.isModified ? `<div class="canvas-tooltip__sim mono">Simulasi (Asli LKPD: ${idea.originalFeasibility}/${idea.originalImpact})</div>` : ''}
    `;

    // Clamp cleanly inside stage bounds so tooltip never overflows or covers axes
    const clampedX = Math.max(135, Math.min(rect.width - 135, px));
    const clampedY = Math.max(95, Math.min(rect.height - 24, py - 12));
    tooltipEl.style.left = `${clampedX}px`;
    tooltipEl.style.top = `${clampedY}px`;
    tooltipEl.classList.add('is-visible');
  }

  function handlePointerMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(pickableMeshes, false);
    const hitId = hits.length > 0 ? hits[0].object.userData.ideaId : null;

    if (hitId !== hoveredIdeaId) {
      hoveredIdeaId = hitId;
      renderer.domElement.style.cursor = hitId ? 'pointer' : 'grab';
      applyState(latestState);
    }
    updateTooltip();
  }

  function handlePointerLeave() {
    if (hoveredIdeaId !== null) {
      hoveredIdeaId = null;
      renderer.domElement.style.cursor = 'grab';
      applyState(latestState);
      updateTooltip();
    }
  }

  function handlePointerDown(event) {
    pointerDownPos = { x: event.clientX, y: event.clientY };
    cameraLerpTarget = null; // Yield camera control immediately to user orbit
  }

  function handlePointerUp(event) {
    if (!pointerDownPos) return;
    const dist = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y);
    pointerDownPos = null;
    if (dist > 6) return; // User orbited, not clicked

    const rect = renderer.domElement.getBoundingClientRect();
    pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(pickableMeshes, false);
    if (hits.length > 0) {
      const clickedId = hits[0].object.userData.ideaId;
      callbacks?.onSelectIdea?.(clickedId);
    }
  }

  renderer.domElement.addEventListener('pointermove', handlePointerMove);
  renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
  renderer.domElement.addEventListener('pointerdown', handlePointerDown);
  renderer.domElement.addEventListener('pointerup', handlePointerUp);

  // Responsive ResizeObserver
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = Math.max(280, Math.floor(entry.contentRect.width));
      const h = Math.max(360, Math.floor(entry.contentRect.height));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
  });
  resizeObserver.observe(mountHost);

  // Animation Loop
  let rafId = null;
  let disposed = false;

  function setCameraPreset(presetName) {
    const preset = CAMERA_PRESETS[presetName] || CAMERA_PRESETS.iso;
    if (reducedMotion) {
      camera.position.set(...preset.pos);
      controls.target.set(...preset.target);
      controls.update();
      cameraLerpTarget = null;
    } else {
      cameraLerpTarget = {
        pos: new THREE.Vector3(...preset.pos),
        target: new THREE.Vector3(...preset.target),
      };
    }
  }

  function animate() {
    if (disposed) return;
    rafId = requestAnimationFrame(animate);

    // Smooth camera preset transition
    if (cameraLerpTarget) {
      camera.position.lerp(cameraLerpTarget.pos, 0.11);
      controls.target.lerp(cameraLerpTarget.target, 0.11);
      if (camera.position.distanceTo(cameraLerpTarget.pos) < 0.03) {
        camera.position.copy(cameraLerpTarget.pos);
        controls.target.copy(cameraLerpTarget.target);
        cameraLerpTarget = null;
      }
    }

    // Smoothly interpolate nodes, stems, halos, badges, and simulation tethers
    const lerpFactor = reducedMotion ? 1 : 0.14;
    for (const entry of nodeEntries.values()) {
      entry.currentPos.lerp(entry.targetPos, lerpFactor);
      const { x, y, z } = entry.currentPos;

      entry.sphere.position.set(x, y, z);
      const nextScale = THREE.MathUtils.lerp(entry.sphere.scale.x, entry.targetScale, lerpFactor);
      entry.sphere.scale.setScalar(nextScale);

      entry.stem.scale.set(1, Math.max(0.02, z), 1);
      entry.stem.position.set(x, y, z / 2);

      entry.footprint.position.set(x, y, 0.012);
      entry.badgeSprite.position.set(x, y + 0.44 * nextScale, z);

      if (entry.trioHalo) {
        entry.trioHalo.position.set(x, y, z);
        entry.trioHalo.scale.setScalar(nextScale);
      }

      if (entry.tetherLine.visible) {
        const posAttr = entry.tetherGeo.attributes.position;
        posAttr.setXYZ(0, entry.origPos.x, entry.origPos.y, 0.03);
        posAttr.setXYZ(1, x, y, z);
        posAttr.needsUpdate = true;
        entry.tetherLine.computeLineDistances();
      }
    }

    // Update active selection ring + drop plumb line
    const selectedEntry = nodeEntries.get(latestState.selectedIdeaId);
    if (selectedEntry) {
      selectionRing.position.copy(selectedEntry.currentPos);
      selectionRing.lookAt(camera.position);

      const dropPos = dropLineGeo.attributes.position;
      dropPos.setXYZ(0, selectedEntry.currentPos.x, 0.11, selectedEntry.currentPos.z);
      dropPos.setXYZ(1, selectedEntry.currentPos.x, selectedEntry.currentPos.y - 0.28, selectedEntry.currentPos.z);
      dropPos.needsUpdate = true;
    }

    controls.update();
    if (hoveredIdeaId) updateTooltip();
    renderer.render(scene, camera);
  }

  applyState(initialState);
  callbacks?.onReady?.();
  animate();

  return {
    update(nextState) {
      applyState(nextState);
    },
    setCameraPreset,
    dispose() {
      disposed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      for (const item of disposables) {
        if (item && typeof item.dispose === 'function') item.dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
  };
}
