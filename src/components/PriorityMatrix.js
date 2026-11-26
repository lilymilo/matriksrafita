/**
 * PriorityMatrix — Main Decision Matrix Studio Centerpiece.
 * Hosts the segmented [ 3D Space | 2D Matrix ] toggle, camera presets for Three.js,
 * keyboard-accessible node selector, WebGL fallback notice, and a crisp architectural
 * 2D Cartesian coordinate plot with cluster list and drag-and-drop simulation.
 */

import { QUADRANTS } from '../data/ideas.js';
import {
  computeMarkerPositions,
  computeSummaryStats,
  getQuadrantMeta,
  getTotalScore,
  scoreToPercentX,
  scoreToPercentY,
  THRESHOLD_X_PERCENT,
  THRESHOLD_Y_PERCENT,
} from '../utils/matrix.js';
import { icon } from './Icons.js';

const GRID_SCORES = [1, 2, 3, 4, 5];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderMatrixQuadrant(quadrantId, count, readOnly) {
  const q = QUADRANTS[quadrantId];
  const posClass = {
    I: 'mquad--tr',
    II: 'mquad--br',
    III: 'mquad--tl',
    IV: 'mquad--bl',
  }[quadrantId];

  return `
    <div
      class="mquad mquad--${q.colorKey} ${posClass}"
      data-quadrant="${q.id}"
      ${readOnly ? '' : 'data-drop-quadrant="' + q.id + '"'}
      aria-label="Kuadran ${q.roman} ${q.name}, ${count} ide"
    >
      <div class="mquad__header">
        <span class="mquad__roman mono">${q.roman}</span>
        <div class="mquad__meta">
          <strong class="mquad__name">${q.name}</strong>
          <span class="mquad__rule mono">${q.shortDesc}</span>
        </div>
        <span class="mquad__count mono" data-quadrant-count="${q.id}">${count}</span>
      </div>
      ${readOnly ? '' : `
        <div class="mquad__drop-overlay" aria-hidden="true">
          Lepas di Kuadran ${q.roman} · ${q.name}
        </div>
      `}
    </div>
  `;
}

function renderIdeaMarker(idea, pos, isSelected, readOnly) {
  const quadrant = getQuadrantMeta(idea.feasibility, idea.impact);
  const total = getTotalScore(idea.feasibility, idea.impact);
  const isModified = idea.feasibility !== idea.originalFeasibility || idea.impact !== idea.originalImpact;
  const tooltipPlacement = idea.impact >= 5 ? 'mtooltip--below' : 'mtooltip--above';
  const tooltipAlign = idea.feasibility <= 1 ? 'mtooltip--left' : idea.feasibility >= 5 ? 'mtooltip--right' : '';

  const ariaLabel = `Ide ${idea.id}: ${idea.name}. Feasibility ${idea.feasibility} dari 5, Impact ${idea.impact} dari 5, Total ${total} dari 10. Kuadran ${quadrant.roman} ${quadrant.name}.${isModified ? ' Skor simulasi.' : ''}`;

  return `
    <button
      type="button"
      class="mnode mnode--${quadrant.colorKey} ${isSelected ? 'is-selected' : ''} ${idea.isOriginalFinalSelection ? 'is-trio' : ''} ${isModified ? 'is-modified' : ''}"
      style="left: ${pos.baseX}%; bottom: ${pos.baseY}%; --ox: ${pos.offsetX}px; --oy: ${pos.offsetY}px;"
      data-marker-id="${idea.id}"
      data-action="${readOnly ? 'presentation-select-idea' : 'select-idea'}"
      data-idea-id="${idea.id}"
      ${readOnly ? '' : 'draggable="true"'}
      aria-pressed="${isSelected ? 'true' : 'false'}"
      aria-label="${escapeHtml(ariaLabel)}"
    >
      <span class="mnode__id mono">#${idea.id}</span>
      <span class="mnode__label">${escapeHtml(idea.shortLabel)}</span>
      ${isModified ? '<span class="mnode__sim" title="Skor Simulasi" aria-hidden="true"></span>' : ''}

      <span class="mtooltip ${tooltipPlacement} ${tooltipAlign}" role="tooltip">
        <span class="mtooltip__head mono">
          <span>#${String(idea.id).padStart(2, '0')}</span>
          <span>${quadrant.roman} · ${quadrant.name}</span>
        </span>
        <strong class="mtooltip__name">${escapeHtml(idea.name)}</strong>
        <span class="mtooltip__scores mono">
          <span>F: <b>${idea.feasibility}/5</b></span>
          <span>I: <b>${idea.impact}/5</b></span>
          <span>Total: <b>${total}/10</b></span>
        </span>
        ${isModified ? `<span class="mtooltip__sim mono">Simulasi (asli ${idea.originalFeasibility}/${idea.originalImpact})</span>` : ''}
      </span>
    </button>
  `;
}

function renderCoincidentAnchors(ideas, positions) {
  const seen = new Set();
  const html = [];

  for (const idea of ideas) {
    const pos = positions.get(idea.id);
    if (!pos || pos.clusterSize < 2 || seen.has(pos.clusterKey)) continue;
    seen.add(pos.clusterKey);
    html.push(`
      <div
        class="cluster-pin"
        style="left: ${pos.baseX}%; bottom: ${pos.baseY}%;"
        title="${pos.clusterSize} ide berbagi koordinat exact (${idea.feasibility}, ${idea.impact})"
        aria-hidden="true"
      >
        <span class="cluster-pin__dot"></span>
      </div>
    `);
  }
  return html.join('');
}

/**
 * Render an explicit quiet strip underneath the 2D matrix listing any overlapping
 * coordinates so teachers & keyboard users can jump cleanly between coincident ideas.
 */
function renderCoincidentStrip(ideas, selectedIdeaId, readOnly) {
  const groups = new Map();
  for (const idea of ideas) {
    const key = `${idea.feasibility},${idea.impact}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(idea);
  }
  const clusters = [...groups.entries()].filter(([, arr]) => arr.length > 1);
  if (clusters.length === 0) return '';

  return `
    <div class="coincident-bar" aria-label="Koordinat bersama">
      <span class="coincident-bar__label mono">COINCIDENT POINTS</span>
      <div class="coincident-bar__items">
        ${clusters.map(([key, arr]) => `
          <div class="coincident-group">
            <span class="mono coincident-group__coord">(${key})</span>
            ${arr.map((idea) => `
              <button
                type="button"
                class="coincident-chip ${idea.id === selectedIdeaId ? 'is-selected' : ''}"
                data-action="${readOnly ? 'presentation-select-idea' : 'select-idea'}"
                data-idea-id="${idea.id}"
              >
                <span class="mono">#${idea.id}</span> ${escapeHtml(idea.shortLabel)}
              </button>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Reusable architectural 2D Cartesian Matrix Canvas (used in 2D Studio Mode & Presentation Mode).
 */
export function renderMatrixCanvas({ ideas, selectedIdeaId, readOnly = false, compact = false }) {
  const stats = computeSummaryStats(ideas);
  const positions = computeMarkerPositions(ideas);

  const vGrid = GRID_SCORES.map((s) => {
    const pct = scoreToPercentX(s);
    return `
      <span class="cgrid__v" style="left: ${pct}%;" aria-hidden="true"></span>
      <span class="ctick ctick--x mono" style="left: ${pct}%;" aria-hidden="true">${s}</span>
    `;
  }).join('');

  const hGrid = GRID_SCORES.map((s) => {
    const pct = scoreToPercentY(s);
    return `
      <span class="cgrid__h" style="bottom: ${pct}%;" aria-hidden="true"></span>
      <span class="ctick ctick--y mono" style="bottom: ${pct}%;" aria-hidden="true">${s}</span>
    `;
  }).join('');

  const markersHtml = ideas
    .map((idea) => renderIdeaMarker(idea, positions.get(idea.id), idea.id === selectedIdeaId, readOnly))
    .join('');

  return `
    <div class="matrix2d-shell ${compact ? 'matrix2d-shell--compact' : ''}">
      <div class="matrix2d-frame ${readOnly ? 'is-readonly' : ''}" data-matrix-canvas="${readOnly ? 'presentation' : 'workspace'}">
        <div class="matrix2d-top-axis mono">
          <span>IMPACT / DAMPAK TINGGI (4–5)</span>
        </div>

        <div class="matrix2d-body">
          <div class="matrix2d-y-title mono" aria-hidden="true">IMPACT / DAMPAK (1 → 5)</div>

          <div
            class="matrix2d-plane"
            style="--split-x: ${THRESHOLD_X_PERCENT}%; --split-y: ${THRESHOLD_Y_PERCENT}%;"
            role="region"
            aria-label="Matriks 2D Koordinat Kartesius Feasibility (X, 1–5) versus Impact (Y, 1–5)"
          >
            <div class="mquad-grid">
              ${renderMatrixQuadrant('III', stats.countsByQuadrant.III, readOnly)}
              ${renderMatrixQuadrant('I', stats.countsByQuadrant.I, readOnly)}
              ${renderMatrixQuadrant('IV', stats.countsByQuadrant.IV, readOnly)}
              ${renderMatrixQuadrant('II', stats.countsByQuadrant.II, readOnly)}
            </div>

            <div class="cgrid-layer" aria-hidden="true">
              ${vGrid}
              ${hGrid}
            </div>

            <!-- Threshold Crosshairs at 3.5 -->
            <div class="cthresh cthresh--v" style="left: ${THRESHOLD_X_PERCENT}%;" aria-hidden="true"></div>
            <div class="cthresh cthresh--h" style="bottom: ${THRESHOLD_Y_PERCENT}%;" aria-hidden="true"></div>
            <span class="cthresh-tag mono" style="left: ${THRESHOLD_X_PERCENT}%; bottom: ${THRESHOLD_Y_PERCENT}%;" aria-hidden="true">3.5</span>

            <div class="anchors-layer" data-anchors-layer>
              ${renderCoincidentAnchors(ideas, positions)}
            </div>

            <div class="markers-layer" data-markers-layer>
              ${markersHtml}
            </div>
          </div>
        </div>

        <div class="matrix2d-bottom-axis mono">
          <span>FEASIBILITY RENDAH (1–3)</span>
          <span class="matrix2d-bottom-center">FEASIBILITY / KELAYAKAN (1 → 5)</span>
          <span>FEASIBILITY TINGGI (4–5)</span>
        </div>
      </div>
    </div>

    <div data-coincident-slot>
      ${renderCoincidentStrip(ideas, selectedIdeaId, readOnly)}
    </div>
  `;
}

/**
 * Main Studio Centerpiece combining the 3D Idea Space (Three.js) and the 2D Matrix
 * behind a crisp segmented toggle + keyboard-accessible node navigator.
 */
export function renderPriorityMatrix(state) {
  const stats = computeSummaryStats(state.ideas);
  const is3D = state.viewMode === '3d';
  const webglUnavailable = state.webglStatus === 'unavailable';

  return `
    <div class="studio-matrix-stage">
      <div class="studio-toolbar">
        <div class="studio-toolbar__left">
          <div class="view-toggle" role="tablist" aria-label="Mode tampilan matriks">
            <button
              type="button"
              role="tab"
              aria-selected="${is3D ? 'true' : 'false'}"
              class="view-toggle__btn ${is3D ? 'is-active' : ''}"
              data-action="set-view-mode"
              data-view-mode="3d"
              ${webglUnavailable ? 'disabled title="WebGL tidak tersedia pada browser ini"' : ''}
            >
              ${icon('cube', 14)} <span>3D Space</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected="${!is3D ? 'true' : 'false'}"
              class="view-toggle__btn ${!is3D ? 'is-active' : ''}"
              data-action="set-view-mode"
              data-view-mode="2d"
            >
              ${icon('grid', 14)} <span>2D Matrix</span>
            </button>
          </div>

          ${is3D ? `
            <div class="camera-controls" role="group" aria-label="Sudut kamera 3D">
              <button type="button" class="cam-btn ${state.cameraPreset === 'iso' ? 'is-active' : ''}" data-action="camera-preset" data-preset="iso">Isometric</button>
              <button type="button" class="cam-btn ${state.cameraPreset === 'front' ? 'is-active' : ''}" data-action="camera-preset" data-preset="front">Front X/Y</button>
              <button type="button" class="cam-btn ${state.cameraPreset === 'top' ? 'is-active' : ''}" data-action="camera-preset" data-preset="top">Depth View</button>
            </div>
          ` : `
            <span class="toolbar-hint">Drag pin antar kuadran untuk simulasi · Klik untuk inspeksi</span>
          `}
        </div>

        <div class="studio-toolbar__right">
          ${stats.hasModifications
            ? `<span class="sim-inline-flag" data-matrix-sim-flag>Simulasi · ${stats.modifiedCount} diubah</span>`
            : `<span class="mono-quiet" data-matrix-sim-flag>EXACT LKPD SCORES</span>`}
        </div>
      </div>

      ${webglUnavailable ? `
        <div class="fallback-notice" role="status">
          ${icon('alert', 15)}
          <span>WebGL tidak aktif di perangkat ini — menampilkan <strong>2D Cartesian Matrix</strong> sebagai fallback penuh.</span>
        </div>
      ` : ''}

      <!-- 3D Three.js Idea Space Viewport -->
      <div class="stage-3d-wrap ${is3D ? '' : 'is-hidden'}" data-stage-3d>
        <div class="stage-3d-canvas-host" data-three-canvas-host>
          <div class="stage-3d-loading">
            <span class="mono">INITIALIZING 3D IDEA SPACE...</span>
          </div>
        </div>
        <div class="canvas-tooltip" data-three-tooltip role="status" aria-live="polite"></div>

        <div class="stage-3d-overlay-meta">
          <span class="mono">X: FEASIBILITY (1–5) · Y: IMPACT (1–5) · Z: VISUAL DEPTH ONLY</span>
          <span class="stage-3d-controls-hint">Drag to orbit · Scroll to zoom · Click node to inspect</span>
        </div>

        <!-- Keyboard-accessible direct node selector for 3D space -->
        <div class="kbd-node-strip" role="group" aria-label="Pilih node ide via keyboard">
          <span class="kbd-node-strip__label mono">NODES</span>
          <div class="kbd-node-strip__buttons" data-kbd-node-strip>
            ${state.ideas.map((idea) => {
              const q = getQuadrantMeta(idea.feasibility, idea.impact);
              return `
                <button
                  type="button"
                  class="kbd-node-btn kbd-node-btn--${q.colorKey} ${idea.id === state.selectedIdeaId ? 'is-selected' : ''} ${idea.isOriginalFinalSelection ? 'is-trio' : ''}"
                  data-action="select-idea"
                  data-idea-id="${idea.id}"
                  aria-pressed="${idea.id === state.selectedIdeaId ? 'true' : 'false'}"
                  title="#${idea.id} ${escapeHtml(idea.name)}"
                >
                  <span class="mono">#${idea.id}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- 2D Precision Cartesian Matrix Viewport -->
      <div class="stage-2d-wrap ${is3D ? 'is-hidden' : ''}" data-stage-2d>
        ${renderMatrixCanvas({
          ideas: state.ideas,
          selectedIdeaId: state.selectedIdeaId,
          readOnly: false,
        })}
      </div>
    </div>
  `;
}

/**
 * In-place DOM updater for the 2D matrix & keyboard node strip so markers animate
 * smoothly without destroying the live WebGL canvas in the sibling container!
 */
export function updatePriorityMatrixInPlace(rootEl, state) {
  const stage = rootEl.querySelector('.studio-matrix-stage');
  if (!stage) return false;

  const stats = computeSummaryStats(state.ideas);
  const positions = computeMarkerPositions(state.ideas);

  // Sync top status flag
  const simFlag = stage.querySelector('[data-matrix-sim-flag]');
  if (simFlag) {
    if (stats.hasModifications) {
      simFlag.className = 'sim-inline-flag';
      simFlag.textContent = `Simulasi · ${stats.modifiedCount} diubah`;
    } else {
      simFlag.className = 'mono-quiet';
      simFlag.textContent = 'EXACT LKPD SCORES';
    }
  }

  // Sync keyboard node strip
  stage.querySelectorAll('[data-kbd-node-strip] .kbd-node-btn').forEach((btn) => {
    const id = Number(btn.dataset.ideaId);
    const idea = state.ideas.find((i) => i.id === id);
    if (!idea) return;
    const q = getQuadrantMeta(idea.feasibility, idea.impact);
    const isSel = id === state.selectedIdeaId;
    btn.className = `kbd-node-btn kbd-node-btn--${q.colorKey} ${isSel ? 'is-selected' : ''} ${idea.isOriginalFinalSelection ? 'is-trio' : ''}`;
    btn.setAttribute('aria-pressed', isSel ? 'true' : 'false');
  });

  // Sync 2D Matrix elements
  const plane = stage.querySelector('[data-matrix-canvas="workspace"]');
  if (!plane) return true;

  for (const [qId, count] of Object.entries(stats.countsByQuadrant)) {
    const countEl = plane.querySelector(`[data-quadrant-count="${qId}"]`);
    if (countEl) countEl.textContent = String(count);
  }

  const anchorsLayer = plane.querySelector('[data-anchors-layer]');
  if (anchorsLayer) {
    anchorsLayer.innerHTML = renderCoincidentAnchors(state.ideas, positions);
  }

  const coincidentSlot = stage.querySelector('[data-coincident-slot]');
  if (coincidentSlot) {
    coincidentSlot.innerHTML = renderCoincidentStrip(state.ideas, state.selectedIdeaId, false);
  }

  for (const idea of state.ideas) {
    const marker = plane.querySelector(`[data-marker-id="${idea.id}"]`);
    const pos = positions.get(idea.id);
    if (!marker || !pos) continue;

    const quadrant = getQuadrantMeta(idea.feasibility, idea.impact);
    const total = getTotalScore(idea.feasibility, idea.impact);
    const isModified = idea.feasibility !== idea.originalFeasibility || idea.impact !== idea.originalImpact;
    const isSelected = idea.id === state.selectedIdeaId;

    marker.style.left = `${pos.baseX}%`;
    marker.style.bottom = `${pos.baseY}%`;
    marker.style.setProperty('--ox', `${pos.offsetX}px`);
    marker.style.setProperty('--oy', `${pos.offsetY}px`);

    marker.className = `mnode mnode--${quadrant.colorKey} ${isSelected ? 'is-selected' : ''} ${idea.isOriginalFinalSelection ? 'is-trio' : ''} ${isModified ? 'is-modified' : ''}`;
    marker.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

    let simDot = marker.querySelector('.mnode__sim');
    if (isModified && !simDot) {
      simDot = document.createElement('span');
      simDot.className = 'mnode__sim';
      simDot.title = 'Skor Simulasi';
      simDot.setAttribute('aria-hidden', 'true');
      const tip = marker.querySelector('.mtooltip');
      marker.insertBefore(simDot, tip);
    } else if (!isModified && simDot) {
      simDot.remove();
    }

    const tooltip = marker.querySelector('.mtooltip');
    if (tooltip) {
      const placement = idea.impact >= 5 ? 'mtooltip--below' : 'mtooltip--above';
      const align = idea.feasibility <= 1 ? 'mtooltip--left' : idea.feasibility >= 5 ? 'mtooltip--right' : '';
      tooltip.className = `mtooltip ${placement} ${align}`;
      tooltip.innerHTML = `
        <span class="mtooltip__head mono">
          <span>#${String(idea.id).padStart(2, '0')}</span>
          <span>${quadrant.roman} · ${quadrant.name}</span>
        </span>
        <strong class="mtooltip__name">${escapeHtml(idea.name)}</strong>
        <span class="mtooltip__scores mono">
          <span>F: <b>${idea.feasibility}/5</b></span>
          <span>I: <b>${idea.impact}/5</b></span>
          <span>Total: <b>${total}/10</b></span>
        </span>
        ${isModified ? `<span class="mtooltip__sim mono">Simulasi (asli ${idea.originalFeasibility}/${idea.originalImpact})</span>` : ''}
      `;
    }
  }

  return true;
}

/**
 * Sync 3D vs 2D viewport visibility and toolbar buttons cleanly in-place so the
 * WebGL context stays alive and instant across toggles.
 */
export function syncMatrixViewModeInPlace(rootEl, state) {
  const stage = rootEl.querySelector('.studio-matrix-stage');
  if (!stage) return false;

  const is3D = state.viewMode === '3d';
  const stage3d = stage.querySelector('[data-stage-3d]');
  const stage2d = stage.querySelector('[data-stage-2d]');
  if (!stage3d || !stage2d) return false;

  stage3d.classList.toggle('is-hidden', !is3D);
  stage2d.classList.toggle('is-hidden', is3D);

  stage.querySelectorAll('[data-action="set-view-mode"]').forEach((btn) => {
    const active = btn.dataset.viewMode === state.viewMode;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
    if (btn.dataset.viewMode === '3d') {
      btn.disabled = state.webglStatus === 'unavailable';
    }
  });

  stage.querySelectorAll('[data-action="camera-preset"]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.preset === state.cameraPreset);
  });

  // Update toolbar right-of-toggle controls cleanly
  const leftBar = stage.querySelector('.studio-toolbar__left');
  const existingCam = leftBar?.querySelector('.camera-controls');
  const existingHint = leftBar?.querySelector('.toolbar-hint');
  if (is3D) {
    if (existingHint) existingHint.remove();
    if (!existingCam && leftBar) {
      leftBar.insertAdjacentHTML('beforeend', `
        <div class="camera-controls" role="group" aria-label="Sudut kamera 3D">
          <button type="button" class="cam-btn ${state.cameraPreset === 'iso' ? 'is-active' : ''}" data-action="camera-preset" data-preset="iso">Isometric</button>
          <button type="button" class="cam-btn ${state.cameraPreset === 'front' ? 'is-active' : ''}" data-action="camera-preset" data-preset="front">Front X/Y</button>
          <button type="button" class="cam-btn ${state.cameraPreset === 'top' ? 'is-active' : ''}" data-action="camera-preset" data-preset="top">Depth View</button>
        </div>
      `);
    }
  } else {
    if (existingCam) existingCam.remove();
    if (!existingHint && leftBar) {
      leftBar.insertAdjacentHTML('beforeend', '<span class="toolbar-hint">Drag pin antar kuadran untuk simulasi · Klik untuk inspeksi</span>');
    }
  }

  // Show fallback notice if WebGL is unavailable
  const existingFallback = stage.querySelector('.fallback-notice');
  if (state.webglStatus === 'unavailable' && !existingFallback) {
    const toolbar = stage.querySelector('.studio-toolbar');
    toolbar?.insertAdjacentHTML('afterend', `
      <div class="fallback-notice" role="status">
        ${icon('alert', 15)}
        <span>WebGL tidak aktif di perangkat ini — menampilkan <strong>2D Cartesian Matrix</strong> sebagai fallback penuh.</span>
      </div>
    `);
  }

  return true;
}

/**
 * Attach HTML5 drag-and-drop simulation events for the 2D Matrix.
 */
export function bindMatrixDragEvents(rootEl, store) {
  let draggedIdeaId = null;

  rootEl.addEventListener('dragstart', (event) => {
    const marker = event.target.closest('[data-marker-id][draggable="true"]');
    if (!marker) return;
    draggedIdeaId = Number(marker.dataset.markerId);
    marker.classList.add('is-dragging');
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(draggedIdeaId));
    }
  });

  rootEl.addEventListener('dragend', () => {
    draggedIdeaId = null;
    rootEl.querySelectorAll('.is-dragging').forEach((el) => el.classList.remove('is-dragging'));
    rootEl.querySelectorAll('.is-drop-target').forEach((el) => el.classList.remove('is-drop-target'));
  });

  rootEl.addEventListener('dragover', (event) => {
    const dropZone = event.target.closest('[data-drop-quadrant]');
    if (!dropZone) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';

    rootEl.querySelectorAll('.is-drop-target').forEach((el) => {
      if (el !== dropZone) el.classList.remove('is-drop-target');
    });
    dropZone.classList.add('is-drop-target');
  });

  rootEl.addEventListener('dragleave', (event) => {
    const dropZone = event.target.closest('[data-drop-quadrant]');
    if (!dropZone) return;
    if (!dropZone.contains(event.relatedTarget)) {
      dropZone.classList.remove('is-drop-target');
    }
  });

  rootEl.addEventListener('drop', (event) => {
    const dropZone = event.target.closest('[data-drop-quadrant]');
    if (!dropZone) return;
    event.preventDefault();
    dropZone.classList.remove('is-drop-target');

    const targetQuadrant = dropZone.dataset.dropQuadrant;
    const transferId = event.dataTransfer ? Number(event.dataTransfer.getData('text/plain')) : null;
    const ideaId = draggedIdeaId || transferId;
    if (!ideaId || !targetQuadrant) return;

    const plane = rootEl.querySelector('.matrix2d-plane');
    let dropCoords = null;
    if (plane) {
      const rect = plane.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const percentX = ((event.clientX - rect.left) / rect.width) * 100;
        const percentY = ((rect.bottom - event.clientY) / rect.height) * 100;
        dropCoords = { percentX, percentY };
      }
    }

    store.moveIdeaToQuadrant(ideaId, targetQuadrant, dropCoords, 'drag');
    draggedIdeaId = null;
  });
}
