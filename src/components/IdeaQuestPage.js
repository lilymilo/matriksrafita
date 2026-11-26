/**
 * IdeaQuestPage — Top-level studio orchestrator.
 * Mounts all sections, initializes & synchronizes the Three.js 3D Idea Space
 * cleanly alongside the 2D Matrix, Decision Lenses, Idea Explorer, Inspector,
 * Final Concepts, Critical Analysis, Presentation Mode, and CSV Export.
 */

import { buildCsvContent } from '../utils/matrix.js';
import { renderCriticalAnalysis } from './CriticalAnalysis.js';
import { renderDecisionLenses } from './DecisionLenses.js';
import { renderExportControls } from './ExportControls.js';
import { renderFinalSelection } from './FinalSelection.js';
import { renderIdeaExplorer, updateExplorerBodyInPlace } from './IdeaExplorer.js';
import { renderIdeaInspector, updateIdeaInspectorInPlace } from './IdeaInspector.js';
import { mountIdeaSpace3D } from './IdeaSpace3D.js';
import { renderOverviewHero } from './OverviewHero.js';
import { renderPresentationMode } from './PresentationMode.js';
import {
  bindMatrixDragEvents,
  renderPriorityMatrix,
  syncMatrixViewModeInPlace,
  updatePriorityMatrixInPlace,
} from './PriorityMatrix.js';
import { renderSummaryStats } from './SummaryStats.js';

function triggerCsvDownload(ideas) {
  const csv = buildCsvContent(ideas);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ideaquest-lkpd5-matrix.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function mountIdeaQuestPage(appRoot, store) {
  appRoot.innerHTML = `
    <div id="hero-root"></div>
    <main class="studio-main">
      <div id="stats-root"></div>

      <section id="matrix-section" class="studio-centerpiece" aria-label="Ruang Keputusan Matriks 3D dan 2D">
        <div class="section-head-row section-head-row--compact">
          <div>
            <span class="section-index mono">01 / INTERACTIVE IDEA SPACE</span>
            <h2 class="section-heading">Feasibility vs Impact Matrix</h2>
          </div>
          <span class="mono-quiet">HIGH: 4–5 · LOW: 1–3 · THRESHOLD: 3.5</span>
        </div>

        <div class="studio-split">
          <div id="matrix-root" class="studio-split__primary"></div>
          <div id="inspector-root" class="studio-split__aside"></div>
        </div>
      </section>

      <div id="lenses-root"></div>
      <div id="explorer-root"></div>
      <div id="final-root"></div>
      <div id="analysis-root"></div>
      <div id="export-root"></div>
    </main>

    <footer class="studio-footer">
      <div class="studio-footer__inner">
        <span><strong>IdeaQuest</strong> · LKPD 5 Ideation (Unique Selling Point) · 11 PPLG 3</span>
        <span class="mono">Local browser session only · Original LKPD scores preserved</span>
      </div>
    </footer>

    <div id="toast-root" class="toast-host" aria-live="polite"></div>
    <div id="presentation-root"></div>
  `;

  const roots = {
    hero: appRoot.querySelector('#hero-root'),
    stats: appRoot.querySelector('#stats-root'),
    matrix: appRoot.querySelector('#matrix-root'),
    inspector: appRoot.querySelector('#inspector-root'),
    lenses: appRoot.querySelector('#lenses-root'),
    explorer: appRoot.querySelector('#explorer-root'),
    final: appRoot.querySelector('#final-root'),
    analysis: appRoot.querySelector('#analysis-root'),
    exportBar: appRoot.querySelector('#export-root'),
    toast: appRoot.querySelector('#toast-root'),
    presentation: appRoot.querySelector('#presentation-root'),
  };

  const liveRegion = document.getElementById('live-region');
  let threeController = null;
  let threeInitStarted = false;

  function announce(message) {
    if (!liveRegion || !message) return;
    liveRegion.textContent = '';
    requestAnimationFrame(() => {
      liveRegion.textContent = message;
    });
  }

  function renderToast(state) {
    if (!state.notice) {
      roots.toast.innerHTML = '';
      return;
    }
    roots.toast.innerHTML = `
      <div class="studio-toast studio-toast--${state.notice.tone}" role="status">
        <span>${state.notice.text}</span>
      </div>
    `;
    announce(state.notice.text);
  }

  async function ensureThreeSceneMounted() {
    if (threeInitStarted || threeController) return;
    const stage3d = roots.matrix.querySelector('[data-stage-3d]');
    if (!stage3d) return;

    threeInitStarted = true;
    const ctrl = await mountIdeaSpace3D(stage3d, store.getState(), {
      onSelectIdea: (ideaId) => {
        store.selectIdea(ideaId);
      },
      onReady: () => {
        store.setWebglStatus('ready');
      },
      onWebglUnavailable: () => {
        store.setWebglStatus('unavailable');
      },
    });

    if (ctrl) {
      threeController = ctrl;
      threeController.update(store.getState());
    }
  }

  function renderAll(state, changeType = 'all') {
    if (changeType === 'notice') {
      renderToast(state);
      return;
    }

    if (changeType === 'camera') {
      if (threeController) threeController.setCameraPreset(state.cameraPreset);
      syncMatrixViewModeInPlace(roots.matrix, state);
      return;
    }

    if (changeType === 'viewMode') {
      syncMatrixViewModeInPlace(roots.matrix, state);
      if (state.viewMode === '3d') {
        ensureThreeSceneMounted();
      }
      return;
    }

    if (changeType === 'lens') {
      roots.lenses.innerHTML = renderDecisionLenses(state);
      return;
    }

    if (changeType === 'presentation') {
      roots.presentation.innerHTML = renderPresentationMode(state);
      document.body.classList.toggle('is-presentation-open', state.presentation.open);
      return;
    }

    if (changeType === 'filters') {
      if (!updateExplorerBodyInPlace(roots.explorer, state)) {
        roots.explorer.innerHTML = renderIdeaExplorer(state);
      }
      return;
    }

    if (changeType === 'scores') {
      roots.hero.innerHTML = renderOverviewHero(state);
      roots.stats.innerHTML = renderSummaryStats(state);
      updatePriorityMatrixInPlace(roots.matrix, state);
      if (threeController) threeController.update(state);
      if (!updateIdeaInspectorInPlace(roots.inspector, state)) {
        roots.inspector.innerHTML = renderIdeaInspector(state);
      }
      roots.lenses.innerHTML = renderDecisionLenses(state);
      if (!updateExplorerBodyInPlace(roots.explorer, state)) {
        roots.explorer.innerHTML = renderIdeaExplorer(state);
      }
      roots.final.innerHTML = renderFinalSelection(state);
      roots.exportBar.innerHTML = renderExportControls(state);
      if (state.presentation.open) {
        roots.presentation.innerHTML = renderPresentationMode(state);
      }
      return;
    }

    if (changeType === 'selection') {
      updatePriorityMatrixInPlace(roots.matrix, state);
      if (threeController) threeController.update(state);
      roots.inspector.innerHTML = renderIdeaInspector(state);
      roots.lenses.innerHTML = renderDecisionLenses(state);
      if (!updateExplorerBodyInPlace(roots.explorer, state)) {
        roots.explorer.innerHTML = renderIdeaExplorer(state);
      }
      roots.final.innerHTML = renderFinalSelection(state);
      return;
    }

    // Initial mount
    roots.hero.innerHTML = renderOverviewHero(state);
    roots.stats.innerHTML = renderSummaryStats(state);
    roots.matrix.innerHTML = renderPriorityMatrix(state);
    roots.inspector.innerHTML = renderIdeaInspector(state);
    roots.lenses.innerHTML = renderDecisionLenses(state);
    roots.explorer.innerHTML = renderIdeaExplorer(state);
    roots.final.innerHTML = renderFinalSelection(state);
    roots.analysis.innerHTML = renderCriticalAnalysis();
    roots.exportBar.innerHTML = renderExportControls(state);
    roots.presentation.innerHTML = renderPresentationMode(state);
    renderToast(state);

    if (state.viewMode === '3d') {
      ensureThreeSceneMounted();
    }
  }

  bindMatrixDragEvents(roots.matrix, store);

  // Unified click delegation
  appRoot.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    const state = store.getState();

    switch (action) {
      case 'select-idea': {
        store.selectIdea(actionEl.dataset.ideaId);
        break;
      }
      case 'select-idea-from-list': {
        store.selectIdea(actionEl.dataset.ideaId);
        const matrixEl = document.getElementById('matrix-section');
        if (matrixEl) {
          matrixEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        break;
      }
      case 'set-view-mode': {
        store.setViewMode(actionEl.dataset.viewMode);
        break;
      }
      case 'camera-preset': {
        store.setCameraPreset(actionEl.dataset.preset);
        break;
      }
      case 'set-lens': {
        store.setActiveLens(actionEl.dataset.lens);
        break;
      }
      case 'set-axis-score': {
        const id = Number(actionEl.dataset.ideaId);
        const axis = actionEl.dataset.axis;
        const val = Number(actionEl.dataset.value);
        const idea = state.ideas.find((i) => i.id === id);
        if (!idea) break;
        store.updateScore(
          id,
          axis === 'feasibility' ? val : idea.feasibility,
          axis === 'impact' ? val : idea.impact,
          'slider'
        );
        break;
      }
      case 'move-to-quadrant': {
        store.moveIdeaToQuadrant(actionEl.dataset.ideaId, actionEl.dataset.targetQuadrant, null, 'quadrant-button');
        break;
      }
      case 'reset-idea': {
        store.resetIdea(actionEl.dataset.ideaId);
        break;
      }
      case 'reset-all': {
        store.resetAll();
        break;
      }
      case 'filter-quadrant': {
        store.setFilter({ quadrant: actionEl.dataset.quadrantValue });
        break;
      }
      case 'clear-filters': {
        store.setFilter({ quadrant: 'all', scamper: 'all', search: '' });
        break;
      }
      case 'export-csv': {
        triggerCsvDownload(state.ideas);
        store.notify('CSV "ideaquest-lkpd5-matrix.csv" berhasil diunduh.', 'success');
        break;
      }
      case 'print-summary': {
        window.print();
        break;
      }
      case 'open-presentation': {
        store.openPresentation(0);
        break;
      }
      case 'close-presentation': {
        store.closePresentation();
        break;
      }
      case 'presentation-slide': {
        store.setPresentationSlide(Number(actionEl.dataset.slide));
        break;
      }
      case 'presentation-prev': {
        store.setPresentationSlide(state.presentation.slide - 1);
        break;
      }
      case 'presentation-next': {
        store.setPresentationSlide(state.presentation.slide + 1);
        break;
      }
      case 'presentation-select-idea': {
        store.setPresentationFocusIdea(actionEl.dataset.ideaId);
        break;
      }
      case 'toggle-presentation-data': {
        store.togglePresentationDataSource(!state.presentation.useSimulatedData);
        break;
      }
      default:
        break;
    }
  });

  // Live range slider & search input delegation
  appRoot.addEventListener('input', (event) => {
    const target = event.target;
    if (target.matches('[data-sim-slider]')) {
      const axis = target.dataset.simSlider;
      const id = Number(target.dataset.ideaId);
      const val = Number(target.value);
      const idea = store.getState().ideas.find((i) => i.id === id);
      if (!idea) return;
      store.updateScore(
        id,
        axis === 'feasibility' ? val : idea.feasibility,
        axis === 'impact' ? val : idea.impact,
        'slider'
      );
      return;
    }

    if (target.matches('[data-filter-input="search"]')) {
      store.setFilter({ search: target.value });
    }
  });

  appRoot.addEventListener('change', (event) => {
    const target = event.target;
    if (target.matches('[data-filter-select="scamper"]')) {
      store.setFilter({ scamper: target.value });
    }
  });

  // Global keyboard shortcuts for Presentation Mode
  document.addEventListener('keydown', (event) => {
    const state = store.getState();
    if (!state.presentation.open) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      store.closePresentation();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      store.setPresentationSlide(state.presentation.slide + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      store.setPresentationSlide(state.presentation.slide - 1);
    }
  });

  // Clean up Three.js WebGL resources on page unload
  window.addEventListener('beforeunload', () => {
    if (threeController) {
      threeController.dispose();
      threeController = null;
    }
  });

  store.subscribe((nextState, changeType) => {
    renderAll(nextState, changeType);
  });

  renderAll(store.getState(), 'all');
}
