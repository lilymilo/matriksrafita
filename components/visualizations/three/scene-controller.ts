import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  compute3DNodePositions,
  getQuadrantMeta,
  getTotalScore,
  SCENE_STEP,
  scoreToWorldX,
  scoreToWorldY,
} from '@/lib/domain/matrix-math';
import { telemetry } from '@/lib/performance/telemetry';
import type { CameraPreset, IdeaItem, QuadrantColorKey } from '@/types/idea';

const QUADRANT_HEX: Record<QuadrantColorKey, number> = {
  mint: 0x0b7a53,
  blue: 0x1d5bd6,
  peach: 0xb45309,
  coral: 0xbe123c,
};

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [2.3, 5.05, 10.2], target: [0.05, 3.95, 0.25] },
  front: { pos: [0.05, 4.0, 11.2], target: [0.05, 4.0, 0.2] },
  top: { pos: [0.35, 9.1, 7.0], target: [0.05, 3.9, 0.4] },
};

export function isWebGLSupported(): boolean {
  try {
    if (typeof document === 'undefined') return false;
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );
}

interface DisposableResource {
  dispose: () => void;
}

function createCanvasLabel(
  text: string,
  opts: {
    font?: string;
    color?: string;
    width?: number;
    height?: number;
  } = {},
): THREE.CanvasTexture {
  const {
    font = '700 26px monospace',
    color = '#11141c',
    width = 512,
    height = 84,
  } = opts;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, width, height);
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2 + 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createBadgeSprite(id: number, isHighlight: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 148;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = isHighlight ? '#11141c' : 'rgba(255,255,255,0.95)';
    ctx.fillRect(10, 12, 128, 56);
    ctx.strokeStyle = isHighlight ? '#0b7a53' : '#9aa3b5';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 12, 128, 56);

    ctx.font = '700 30px monospace';
    ctx.fillStyle = isHighlight ? '#ffffff' : '#11141c';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`#${id}`, 74, 41);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.64, 0.35, 1);
  sprite.renderOrder = 10;
  return { sprite, texture, material };
}

interface NodeVisualEntry {
  id: number;
  sphere: THREE.Mesh;
  sphereMat: THREE.MeshStandardMaterial;
  stem: THREE.Mesh;
  footprint: THREE.Mesh;
  footMat: THREE.MeshStandardMaterial;
  halo: THREE.Mesh | null;
  badgeSprite: THREE.Sprite;
  badgeTex: THREE.CanvasTexture;
  badgeMat: THREE.SpriteMaterial;
  ghostAnchor: THREE.Mesh;
  tetherLine: THREE.Line;
  tetherGeo: THREE.BufferGeometry;
  currentPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  origPos: THREE.Vector3;
  targetScale: number;
}

export interface ThreeSpaceController {
  syncIdeas: (ideas: readonly IdeaItem[], selectedIdeaId: number) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setLowPerfMode: (enabled: boolean) => void;
  dispose: () => void;
}

export function createThreeSpaceController(params: {
  mountEl: HTMLElement;
  tooltipEl: HTMLElement | null;
  initialIdeas: readonly IdeaItem[];
  initialSelectedId: number;
  lowPerfMode: boolean;
  onSelectIdea: (id: number) => void;
}): ThreeSpaceController {
  const initStart = performance.now();
  const { mountEl, tooltipEl, onSelectIdea } = params;
  let isLowPerf = params.lowPerfMode;
  const reducedMotion = prefersReducedMotion();

  const staticDisposables: DisposableResource[] = [];
  const track = <T extends DisposableResource>(res: T): T => {
    staticDisposables.push(res);
    return res;
  };

  mountEl.innerHTML = '';

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xebedf2);
  scene.fog = new THREE.Fog(0xebedf2, 19, 34);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isLowPerf,
    powerPreference: 'high-performance',
  });
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const applyPixelRatio = (low: boolean) => {
    const cap = low ? 1 : isMobile ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    renderer.shadowMap.enabled = !low;
  };
  applyPixelRatio(isLowPerf);
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.className = 'three-webgl-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  mountEl.appendChild(renderer.domElement);

  const initW = Math.max(300, mountEl.clientWidth || 760);
  const initH = Math.max(360, mountEl.clientHeight || 520);
  const camera = new THREE.PerspectiveCamera(36, initW / initH, 0.1, 80);
  camera.position.set(...CAMERA_PRESETS.iso.pos);
  renderer.setSize(initW, initH, false);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !reducedMotion;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.rotateSpeed = 0.65;
  controls.zoomSpeed = 0.75;
  controls.minDistance = 5.6;
  controls.maxDistance = 16.0;
  controls.minPolarAngle = 0.34;
  controls.maxPolarAngle = Math.PI * 0.54;
  controls.minAzimuthAngle = -Math.PI * 0.42;
  controls.maxAzimuthAngle = Math.PI * 0.42;
  controls.target.set(...CAMERA_PRESETS.iso.target);
  controls.update();

  // Balanced 3-light studio setup (minimal GPU shader cost)
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd4dbe8, 1.18);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfffdf8, 1.2);
  keyLight.position.set(5.5, 11.5, 9.5);
  keyLight.castShadow = !isLowPerf;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 2;
  keyLight.shadow.camera.far = 28;
  keyLight.shadow.camera.left = -7.5;
  keyLight.shadow.camera.right = 7.5;
  keyLight.shadow.camera.top = 8.5;
  keyLight.shadow.camera.bottom = -3;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xd9e4ff, 0.48);
  rimLight.position.set(-7.5, 4.5, 6.0);
  scene.add(rimLight);

  // Coordinate architecture bounds
  const minX = scoreToWorldX(1) - SCENE_STEP * 0.55;
  const maxX = scoreToWorldX(5) + SCENE_STEP * 0.55;
  const minY = scoreToWorldY(1) - SCENE_STEP * 0.5;
  const maxY = scoreToWorldY(5) + SCENE_STEP * 0.86;
  const threshX = (scoreToWorldX(3) + scoreToWorldX(4)) / 2;
  const threshY = (scoreToWorldY(3) + scoreToWorldY(4)) / 2;
  const planeW = maxX - minX;
  const planeH = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const floorMesh = new THREE.Mesh(
    track(new THREE.PlaneGeometry(24, 18)),
    track(new THREE.MeshStandardMaterial({ color: 0xe3e7ef, roughness: 0.95 })),
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0, 1.4);
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  const plinthMesh = new THREE.Mesh(
    track(new THREE.BoxGeometry(planeW + 0.5, 0.11, 2.4)),
    track(new THREE.MeshStandardMaterial({ color: 0xf7f8fb, roughness: 0.78 })),
  );
  plinthMesh.position.set(centerX, 0.055, 0.95);
  plinthMesh.receiveShadow = true;
  scene.add(plinthMesh);

  const backPlane = new THREE.Mesh(
    track(new THREE.PlaneGeometry(planeW, planeH)),
    track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })),
  );
  backPlane.position.set(centerX, centerY, -0.02);
  backPlane.receiveShadow = true;
  scene.add(backPlane);

  const quadDefs = [
    {
      x0: threshX,
      x1: maxX,
      y0: threshY,
      y1: maxY,
      hex: 0x0b7a53,
      op: 0.08,
      title: 'I · PRIORITAS UTAMA',
      ly: maxY - 0.28,
    },
    {
      x0: threshX,
      x1: maxX,
      y0: minY,
      y1: threshY,
      hex: 0x1d5bd6,
      op: 0.06,
      title: 'II · QUICK WINS',
      ly: minY + 0.28,
    },
    {
      x0: minX,
      x1: threshX,
      y0: threshY,
      y1: maxY,
      hex: 0xb45309,
      op: 0.065,
      title: 'III · TANTANGAN',
      ly: maxY - 0.28,
    },
    {
      x0: minX,
      x1: threshX,
      y0: minY,
      y1: threshY,
      hex: 0xbe123c,
      op: 0.05,
      title: 'IV · PRIORITAS RENDAH',
      ly: minY + 0.28,
    },
  ];

  for (const qd of quadDefs) {
    const qMesh = new THREE.Mesh(
      track(new THREE.PlaneGeometry(qd.x1 - qd.x0, qd.y1 - qd.y0)),
      track(
        new THREE.MeshBasicMaterial({
          color: qd.hex,
          transparent: true,
          opacity: qd.op,
          depthWrite: false,
        }),
      ),
    );
    qMesh.position.set((qd.x0 + qd.x1) / 2, (qd.y0 + qd.y1) / 2, -0.008);
    scene.add(qMesh);

    const tex = track(
      createCanvasLabel(qd.title, {
        font: '700 22px monospace',
        color: `#${qd.hex.toString(16).padStart(6, '0')}`,
      }),
    );
    const lblMesh = new THREE.Mesh(
      track(new THREE.PlaneGeometry(2.5, 0.36)),
      track(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })),
    );
    lblMesh.position.set((qd.x0 + qd.x1) / 2, qd.ly, 0.008);
    scene.add(lblMesh);
  }

  // Gridlines & threshold rails
  const gridPts: THREE.Vector3[] = [];
  for (let s = 1; s <= 5; s += 1) {
    const gx = scoreToWorldX(s);
    const gy = scoreToWorldY(s);
    gridPts.push(new THREE.Vector3(gx, minY, 0.003), new THREE.Vector3(gx, maxY, 0.003));
    gridPts.push(new THREE.Vector3(minX, gy, 0.003), new THREE.Vector3(maxX, gy, 0.003));

    const xTex = track(createCanvasLabel(String(s), { width: 120, height: 84, font: '700 30px monospace' }));
    const xTick = new THREE.Mesh(
      track(new THREE.PlaneGeometry(0.4, 0.32)),
      track(new THREE.MeshBasicMaterial({ map: xTex, transparent: true, depthWrite: false })),
    );
    xTick.position.set(gx, 0.13, 1.92);
    xTick.rotation.x = -Math.PI / 2;
    scene.add(xTick);

    const yTex = track(createCanvasLabel(String(s), { width: 120, height: 84, font: '700 30px monospace' }));
    const yTick = new THREE.Mesh(
      track(new THREE.PlaneGeometry(0.4, 0.32)),
      track(new THREE.MeshBasicMaterial({ map: yTex, transparent: true, depthWrite: false })),
    );
    yTick.position.set(minX - 0.32, gy, 0.02);
    scene.add(yTick);
  }

  scene.add(
    new THREE.LineSegments(
      track(new THREE.BufferGeometry().setFromPoints(gridPts)),
      track(new THREE.LineBasicMaterial({ color: 0xcfd5e2 })),
    ),
  );

  const railMat = track(new THREE.MeshBasicMaterial({ color: 0x11141c }));
  const vRail = new THREE.Mesh(track(new THREE.BoxGeometry(0.028, planeH, 0.02)), railMat);
  vRail.position.set(threshX, centerY, 0.01);
  scene.add(vRail);

  const hRail = new THREE.Mesh(track(new THREE.BoxGeometry(planeW, 0.028, 0.02)), railMat);
  hRail.position.set(centerX, threshY, 0.01);
  scene.add(hRail);

  const xAxisTex = track(
    createCanvasLabel('KELAYAKAN (1 → 5)', { width: 640, height: 80, font: '700 22px monospace' }),
  );
  const xAxisMesh = new THREE.Mesh(
    track(new THREE.PlaneGeometry(3.6, 0.4)),
    track(new THREE.MeshBasicMaterial({ map: xAxisTex, transparent: true, depthWrite: false })),
  );
  xAxisMesh.position.set(centerX, 0.125, 2.38);
  xAxisMesh.rotation.x = -Math.PI / 2;
  scene.add(xAxisMesh);

  const yAxisTex = track(
    createCanvasLabel('DAMPAK IDE (1 → 5)', { width: 640, height: 80, font: '700 22px monospace' }),
  );
  const yAxisMesh = new THREE.Mesh(
    track(new THREE.PlaneGeometry(3.6, 0.4)),
    track(new THREE.MeshBasicMaterial({ map: yAxisTex, transparent: true, depthWrite: false })),
  );
  yAxisMesh.position.set(minX - 0.72, centerY, 0.02);
  yAxisMesh.rotation.z = Math.PI / 2;
  scene.add(yAxisMesh);

  // Shared Geometries & Materials (Zero duplicate GPU allocations across nodes!)
  const sharedSphereGeo = track(new THREE.SphereGeometry(0.25, 24, 24));
  const sharedStemGeo = track(new THREE.CylinderGeometry(0.016, 0.016, 1, 10));
  const sharedFootGeo = track(new THREE.CylinderGeometry(0.082, 0.082, 0.018, 18));
  const sharedHaloGeo = track(new THREE.TorusGeometry(0.37, 0.02, 12, 36));
  const sharedSelectGeo = track(new THREE.TorusGeometry(0.44, 0.024, 12, 36));
  const sharedGhostGeo = track(new THREE.RingGeometry(0.11, 0.16, 24));

  const sharedStemMat = track(
    new THREE.MeshStandardMaterial({ color: 0x8b95a7, roughness: 0.5, metalness: 0.35 }),
  );
  const sharedHaloMat = track(
    new THREE.MeshStandardMaterial({ color: 0x0b7a53, roughness: 0.3, metalness: 0.25 }),
  );
  const sharedSelectMat = track(new THREE.MeshBasicMaterial({ color: 0x1d4ed8 }));
  const sharedGhostMat = track(
    new THREE.MeshBasicMaterial({
      color: 0x1d4ed8,
      transparent: true,
      opacity: 0.48,
      side: THREE.DoubleSide,
    }),
  );
  const sharedTetherMat = track(
    new THREE.LineDashedMaterial({
      color: 0x1d4ed8,
      dashSize: 0.12,
      gapSize: 0.08,
      transparent: true,
      opacity: 0.75,
    }),
  );

  const selectionRing = new THREE.Mesh(sharedSelectGeo, sharedSelectMat);
  scene.add(selectionRing);

  const nodeMap = new Map<number, NodeVisualEntry>();
  let pickableSpheres: THREE.Mesh[] = [];
  let currentIdeas: readonly IdeaItem[] = params.initialIdeas;
  let selectedIdeaId = params.initialSelectedId;
  let hoveredIdeaId: number | null = null;

  function removeNodeEntry(id: number) {
    const entry = nodeMap.get(id);
    if (!entry) return;
    scene.remove(entry.sphere);
    scene.remove(entry.stem);
    scene.remove(entry.footprint);
    if (entry.halo) scene.remove(entry.halo);
    scene.remove(entry.badgeSprite);
    scene.remove(entry.ghostAnchor);
    scene.remove(entry.tetherLine);

    entry.sphereMat.dispose();
    entry.footMat.dispose();
    entry.badgeTex.dispose();
    entry.badgeMat.dispose();
    entry.tetherGeo.dispose();
    nodeMap.delete(id);
  }

  function syncIdeas(ideas: readonly IdeaItem[], nextSelectedId: number) {
    currentIdeas = ideas;
    selectedIdeaId = nextSelectedId;
    const posMap = compute3DNodePositions(ideas);
    const activeIds = new Set(ideas.map((i) => i.id));

    for (const existingId of [...nodeMap.keys()]) {
      if (!activeIds.has(existingId)) {
        removeNodeEntry(existingId);
      }
    }

    for (const idea of ideas) {
      const pos = posMap.get(idea.id);
      if (!pos) continue;
      const q = getQuadrantMeta(idea.feasibility, idea.impact);
      const colorHex = QUADRANT_HEX[q.colorKey];

      let entry = nodeMap.get(idea.id);
      if (!entry) {
        const sphereMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          roughness: 0.28,
          metalness: 0.1,
        });
        const sphere = new THREE.Mesh(sharedSphereGeo, sphereMat);
        sphere.position.set(pos.x, pos.y, pos.z);
        sphere.castShadow = !isLowPerf;
        sphere.receiveShadow = !isLowPerf;
        sphere.userData.ideaId = idea.id;
        scene.add(sphere);

        const stem = new THREE.Mesh(sharedStemGeo, sharedStemMat);
        stem.rotation.x = Math.PI / 2;
        stem.scale.set(1, pos.z, 1);
        stem.position.set(pos.x, pos.y, pos.z / 2);
        scene.add(stem);

        const footMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          roughness: 0.5,
        });
        const footprint = new THREE.Mesh(sharedFootGeo, footMat);
        footprint.rotation.x = Math.PI / 2;
        footprint.position.set(pos.x, pos.y, 0.012);
        scene.add(footprint);

        let halo: THREE.Mesh | null = null;
        if (idea.isOriginalFinalSelection) {
          halo = new THREE.Mesh(sharedHaloGeo, sharedHaloMat);
          halo.position.set(pos.x, pos.y, pos.z);
          halo.rotation.set(Math.PI * 0.16, -Math.PI * 0.12, 0);
          scene.add(halo);
        }

        const badge = createBadgeSprite(idea.id, idea.isOriginalFinalSelection);
        badge.sprite.position.set(pos.x, pos.y + 0.44, pos.z);
        scene.add(badge.sprite);

        const ghostAnchor = new THREE.Mesh(sharedGhostGeo, sharedGhostMat);
        ghostAnchor.position.set(pos.origX, pos.origY, 0.025);
        ghostAnchor.visible = false;
        scene.add(ghostAnchor);

        const tetherGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(pos.origX, pos.origY, 0.03),
          new THREE.Vector3(pos.x, pos.y, pos.z),
        ]);
        const tetherLine = new THREE.Line(tetherGeo, sharedTetherMat);
        tetherLine.computeLineDistances();
        tetherLine.visible = false;
        scene.add(tetherLine);

        entry = {
          id: idea.id,
          sphere,
          sphereMat,
          stem,
          footprint,
          footMat,
          halo,
          badgeSprite: badge.sprite,
          badgeTex: badge.texture,
          badgeMat: badge.material,
          ghostAnchor,
          tetherLine,
          tetherGeo,
          currentPos: new THREE.Vector3(pos.x, pos.y, pos.z),
          targetPos: new THREE.Vector3(pos.x, pos.y, pos.z),
          origPos: new THREE.Vector3(pos.origX, pos.origY, 0.03),
          targetScale: 1,
        };
        nodeMap.set(idea.id, entry);
      }

      entry.sphereMat.color.setHex(colorHex);
      entry.footMat.color.setHex(colorHex);
      entry.targetPos.set(pos.x, pos.y, pos.z);
      entry.origPos.set(pos.origX, pos.origY, 0.03);
      entry.ghostAnchor.position.set(pos.origX, pos.origY, 0.025);

      if (reducedMotion) {
        entry.currentPos.copy(entry.targetPos);
      }

      const isSelected = idea.id === selectedIdeaId;
      const isHovered = idea.id === hoveredIdeaId;
      entry.targetScale = isSelected ? 1.18 : isHovered ? 1.1 : 1.0;
      entry.ghostAnchor.visible = idea.isScoreSimulated;
      entry.tetherLine.visible = idea.isScoreSimulated;
    }

    pickableSpheres = [...nodeMap.values()].map((e) => e.sphere);
    selectionRing.visible = nodeMap.has(selectedIdeaId);
  }

  // Reusable scratch vectors (zero per-frame heap allocations)
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const projectedVec = new THREE.Vector3();
  let cameraLerp: { pos: THREE.Vector3; target: THREE.Vector3 } | null = null;
  let pointerDownXY: { x: number; y: number } | null = null;

  function renderTooltip() {
    if (!tooltipEl) return;
    if (hoveredIdeaId === null) {
      tooltipEl.classList.remove('is-visible');
      return;
    }
    const idea = currentIdeas.find((i) => i.id === hoveredIdeaId);
    const entry = nodeMap.get(hoveredIdeaId);
    if (!idea || !entry) {
      tooltipEl.classList.remove('is-visible');
      return;
    }

    projectedVec.copy(entry.currentPos);
    projectedVec.y += 0.45;
    projectedVec.project(camera);

    const rect = mountEl.getBoundingClientRect();
    const px = (projectedVec.x * 0.5 + 0.5) * rect.width;
    const py = (-projectedVec.y * 0.5 + 0.5) * rect.height;
    const q = getQuadrantMeta(idea.feasibility, idea.impact);
    const total = getTotalScore(idea.feasibility, idea.impact);

    tooltipEl.textContent = '';
    const line1 = document.createElement('div');
    line1.className = 'mono';
    line1.style.fontSize = '0.72rem';
    line1.style.opacity = '0.8';
    line1.textContent = `#${String(idea.id).padStart(2, '0')} · ${q.roman} ${q.name}`;

    const line2 = document.createElement('div');
    line2.style.fontWeight = '700';
    line2.style.margin = '3px 0';
    line2.textContent = idea.name;

    const line3 = document.createElement('div');
    line3.className = 'mono';
    line3.style.fontSize = '0.74rem';
    line3.textContent = `Kelayakan ${idea.feasibility}/5 · Dampak ${idea.impact}/5 · Total ${total}/10`;

    tooltipEl.append(line1, line2, line3);

    const clampedX = Math.max(120, Math.min(rect.width - 120, px));
    const clampedY = Math.max(85, Math.min(rect.height - 20, py - 10));
    tooltipEl.style.left = `${clampedX}px`;
    tooltipEl.style.top = `${clampedY}px`;
    tooltipEl.classList.add('is-visible');
  }

  const onPointerMove = (e: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(pickableSpheres, false);
    const hitId = hits.length > 0 ? (hits[0].object.userData.ideaId as number) : null;

    if (hitId !== hoveredIdeaId) {
      hoveredIdeaId = hitId;
      renderer.domElement.style.cursor = hitId !== null ? 'pointer' : 'grab';
      syncIdeas(currentIdeas, selectedIdeaId);
    }
    renderTooltip();
  };

  const onPointerLeave = () => {
    if (hoveredIdeaId !== null) {
      hoveredIdeaId = null;
      renderer.domElement.style.cursor = 'grab';
      syncIdeas(currentIdeas, selectedIdeaId);
      renderTooltip();
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    pointerDownXY = { x: e.clientX, y: e.clientY };
    cameraLerp = null;
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!pointerDownXY) return;
    const dist = Math.hypot(e.clientX - pointerDownXY.x, e.clientY - pointerDownXY.y);
    pointerDownXY = null;
    if (dist > 6) return;

    const rect = renderer.domElement.getBoundingClientRect();
    pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(pickableSpheres, false);
    if (hits.length > 0) {
      const id = hits[0].object.userData.ideaId as number;
      onSelectIdea(id);
    }
  };

  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerleave', onPointerLeave);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = Math.max(280, Math.floor(entry.contentRect.width));
      const h = Math.max(340, Math.floor(entry.contentRect.height));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
  });
  resizeObserver.observe(mountEl);

  let disposed = false;
  let rafId: number | null = null;
  let tabHidden = typeof document !== 'undefined' && document.visibilityState === 'hidden';
  let firstFrameRecorded = false;

  const onVisibilityChange = () => {
    tabHidden = document.visibilityState === 'hidden';
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  function animate() {
    if (disposed) return;
    rafId = window.requestAnimationFrame(animate);

    // Pause heavy WebGL rendering automatically when browser tab is inactive
    if (tabHidden) return;

    if (cameraLerp) {
      camera.position.lerp(cameraLerp.pos, 0.12);
      controls.target.lerp(cameraLerp.target, 0.12);
      if (camera.position.distanceTo(cameraLerp.pos) < 0.03) {
        camera.position.copy(cameraLerp.pos);
        controls.target.copy(cameraLerp.target);
        cameraLerp = null;
      }
    }

    const lerpFactor = reducedMotion ? 1 : 0.15;
    for (const entry of nodeMap.values()) {
      entry.currentPos.lerp(entry.targetPos, lerpFactor);
      const { x, y, z } = entry.currentPos;

      entry.sphere.position.set(x, y, z);
      const nextScale = THREE.MathUtils.lerp(entry.sphere.scale.x, entry.targetScale, lerpFactor);
      entry.sphere.scale.setScalar(nextScale);

      entry.stem.scale.set(1, Math.max(0.02, z), 1);
      entry.stem.position.set(x, y, z / 2);
      entry.footprint.position.set(x, y, 0.012);
      entry.badgeSprite.position.set(x, y + 0.44 * nextScale, z);

      if (entry.halo) {
        entry.halo.position.set(x, y, z);
        entry.halo.scale.setScalar(nextScale);
      }

      if (entry.tetherLine.visible) {
        const attr = entry.tetherGeo.attributes.position as THREE.BufferAttribute;
        attr.setXYZ(0, entry.origPos.x, entry.origPos.y, 0.03);
        attr.setXYZ(1, x, y, z);
        attr.needsUpdate = true;
        entry.tetherLine.computeLineDistances();
      }
    }

    const sel = nodeMap.get(selectedIdeaId);
    if (sel) {
      selectionRing.position.copy(sel.currentPos);
      selectionRing.lookAt(camera.position);
    }

    controls.update();
    if (hoveredIdeaId !== null) renderTooltip();
    renderer.render(scene, camera);

    if (!firstFrameRecorded) {
      firstFrameRecorded = true;
      telemetry.recordThreeInit(performance.now() - initStart);
    }
  }

  syncIdeas(params.initialIdeas, params.initialSelectedId);
  animate();

  return {
    syncIdeas,

    setCameraPreset(preset: CameraPreset) {
      const target = CAMERA_PRESETS[preset] || CAMERA_PRESETS.iso;
      if (reducedMotion) {
        camera.position.set(...target.pos);
        controls.target.set(...target.target);
        controls.update();
        cameraLerp = null;
      } else {
        cameraLerp = {
          pos: new THREE.Vector3(...target.pos),
          target: new THREE.Vector3(...target.target),
        };
      }
    },

    setLowPerfMode(enabled: boolean) {
      isLowPerf = enabled;
      applyPixelRatio(enabled);
      keyLight.castShadow = !enabled;
      for (const entry of nodeMap.values()) {
        entry.sphere.castShadow = !enabled;
        entry.sphere.receiveShadow = !enabled;
      }
    },

    dispose() {
      disposed = true;
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      resizeObserver.disconnect();

      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);

      for (const id of [...nodeMap.keys()]) {
        removeNodeEntry(id);
      }
      for (const res of staticDisposables) {
        res.dispose();
      }
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
