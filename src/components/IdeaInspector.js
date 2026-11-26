/**
 * IdeaInspector — Docked architectural strategy-studio inspector & score simulator.
 * Displays canonical LKPD 5 data, tabular monospace scores, original vs simulated diff,
 * accessible sliders & discrete 1–5 controls, keyboard quadrant movers, and source notes.
 */

import { QUADRANTS, QUADRANT_IDS } from '../data/ideas.js';
import { computeSummaryStats, getQuadrantId, getQuadrantMeta, getTotalScore } from '../utils/matrix.js';
import { icon } from './Icons.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderScoreStepButtons(axis, currentValue, ideaId) {
  return [1, 2, 3, 4, 5].map((num) => `
    <button
      type="button"
      class="step-num mono ${currentValue === num ? 'is-active' : ''}"
      data-action="set-axis-score"
      data-idea-id="${ideaId}"
      data-axis="${axis}"
      data-value="${num}"
      aria-label="Atur ${axis === 'feasibility' ? 'Feasibility' : 'Impact'} ke ${num}"
    >${num}</button>
  `).join('');
}

export function renderIdeaInspector(state) {
  const idea = state.ideas.find((item) => item.id === state.selectedIdeaId) || state.ideas[0];
  const stats = computeSummaryStats(state.ideas);
  const currentQ = getQuadrantMeta(idea.feasibility, idea.impact);
  const origQ = getQuadrantMeta(idea.originalFeasibility, idea.originalImpact);
  const currentTotal = getTotalScore(idea.feasibility, idea.impact);
  const origTotal = getTotalScore(idea.originalFeasibility, idea.originalImpact);
  const currentQuadrantId = getQuadrantId(idea.feasibility, idea.impact);

  const buyerLabel = {
    direct: 'Direct Benefit',
    indirect: 'Internal Control',
    'not-specified': 'Not Specified in LKPD',
  }[idea.buyerBenefitStatus];

  return `
    <aside class="studio-inspector" aria-label="Inspektor Detail Ide" data-inspector-idea-id="${idea.id}">
      <div class="inspector-head">
        <div class="inspector-head__meta mono">
          <span class="inspector-index">IDEA #${String(idea.id).padStart(2, '0')}</span>
          <span class="meta-sep">/</span>
          <span>${escapeHtml(idea.scamper)}</span>
        </div>

        ${idea.isOriginalFinalSelection ? `
          <div class="inspector-selected-flag">
            <span class="q-dot q-dot--mint"></span>
            <span>Selected Concept · <strong>${escapeHtml(idea.conceptName)}</strong></span>
          </div>
        ` : ''}

        <h2 class="inspector-name">${escapeHtml(idea.name)}</h2>
      </div>

      <!-- Tabular Score Bar -->
      <div class="inspector-metrics">
        <div class="im-cell">
          <span class="im-cell__label mono">FEASIBILITY</span>
          <strong class="im-cell__val mono" data-tile="feasibility">${idea.feasibility}<small>/5</small></strong>
        </div>
        <div class="im-cell">
          <span class="im-cell__label mono">IMPACT</span>
          <strong class="im-cell__val mono" data-tile="impact">${idea.impact}<small>/5</small></strong>
        </div>
        <div class="im-cell">
          <span class="im-cell__label mono">TOTAL</span>
          <strong class="im-cell__val mono" data-tile="total">${currentTotal}<small>/10</small></strong>
        </div>
      </div>

      <div class="inspector-quad-strip inspector-quad-strip--${currentQ.colorKey}" data-tile="quadrant-box">
        <span class="q-dot q-dot--${currentQ.colorKey}"></span>
        <strong data-tile="quadrant">Kuadran ${currentQ.roman} · ${currentQ.name}</strong>
        <span class="inspector-sim-state mono ${idea.isModified ? 'is-sim' : ''}" data-inspector-sim-badge>
          ${idea.isModified ? 'SIMULASI' : 'LKPD ASLI'}
        </span>
      </div>

      <!-- Original vs Simulated Diff -->
      <div class="inspector-diff ${idea.isModified ? '' : 'is-hidden'}" data-score-comparison role="status">
        <div class="inspector-diff__row mono">
          <span class="diff-k">ASLI LKPD</span>
          <span>F:${idea.originalFeasibility} · I:${idea.originalImpact} · Total ${origTotal}/10 (${origQ.roman})</span>
        </div>
        <div class="inspector-diff__row inspector-diff__row--sim mono">
          <span class="diff-k">SIMULASI</span>
          <span data-comp-current>F:${idea.feasibility} · I:${idea.impact} · Total ${currentTotal}/10 (${currentQ.roman})</span>
        </div>
      </div>

      <!-- Live Score Simulator -->
      <div class="inspector-sim" aria-labelledby="simulator-heading">
        <div class="inspector-sim__head">
          <h3 id="simulator-heading" class="sub-eyebrow mono">SCORE SIMULATOR</h3>
          <div class="inspector-sim__reset-row">
            <button
              type="button"
              class="text-action-btn"
              data-action="reset-idea"
              data-idea-id="${idea.id}"
              data-btn-reset-idea
              ${idea.isModified ? '' : 'disabled'}
            >${icon('reset', 12)} Reset #${idea.id}</button>
            <button
              type="button"
              class="text-action-btn"
              data-action="reset-all"
              data-btn-reset-all
              ${stats.hasModifications ? '' : 'disabled'}
            >Reset all</button>
          </div>
        </div>

        <div class="sim-control">
          <div class="sim-control__row">
            <label for="feasibility-range">Feasibility <span class="mono muted-inline">(X)</span></label>
            <span class="mono sim-control__val" data-readout="feasibility">${idea.feasibility} / 5</span>
          </div>
          <input
            id="feasibility-range"
            class="studio-range"
            type="range"
            min="1"
            max="5"
            step="1"
            value="${idea.feasibility}"
            data-sim-slider="feasibility"
            data-idea-id="${idea.id}"
            aria-valuetext="${idea.feasibility} dari 5 (${idea.feasibility >= 4 ? 'Tinggi' : 'Rendah'})"
          />
          <div class="step-strip" data-step-row="feasibility">
            ${renderScoreStepButtons('feasibility', idea.feasibility, idea.id)}
          </div>
        </div>

        <div class="sim-control">
          <div class="sim-control__row">
            <label for="impact-range">Impact <span class="mono muted-inline">(Y)</span></label>
            <span class="mono sim-control__val" data-readout="impact">${idea.impact} / 5</span>
          </div>
          <input
            id="impact-range"
            class="studio-range studio-range--emerald"
            type="range"
            min="1"
            max="5"
            step="1"
            value="${idea.impact}"
            data-sim-slider="impact"
            data-idea-id="${idea.id}"
            aria-valuetext="${idea.impact} dari 5 (${idea.impact >= 4 ? 'Tinggi' : 'Rendah'})"
          />
          <div class="step-strip" data-step-row="impact">
            ${renderScoreStepButtons('impact', idea.impact, idea.id)}
          </div>
        </div>

        <div class="qmove-block" role="group" aria-label="Pindah cepat ke kuadran">
          <span class="qmove-block__label mono">MOVE TO QUADRANT (KEYBOARD ALT.)</span>
          <div class="qmove-grid" data-quadrant-mover-grid>
            ${QUADRANT_IDS.map((qId) => {
              const q = QUADRANTS[qId];
              return `
                <button
                  type="button"
                  class="qmove-btn ${currentQuadrantId === qId ? 'is-current' : ''}"
                  data-action="move-to-quadrant"
                  data-idea-id="${idea.id}"
                  data-target-quadrant="${qId}"
                  aria-pressed="${currentQuadrantId === qId ? 'true' : 'false'}"
                >
                  <span class="q-dot q-dot--${q.colorKey}"></span>
                  <span class="mono">${q.roman}</span>
                  <span>${q.name}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Canonical LKPD Rationale & Benefits -->
      <div class="inspector-doc">
        <div class="doc-section">
          <h3 class="sub-eyebrow mono">LKPD RATIONALE</h3>
          <p class="doc-copy">${escapeHtml(idea.rationale)}</p>
          ${idea.scamperNote ? `<p class="doc-note">${escapeHtml(idea.scamperNote)}</p>` : ''}
        </div>

        <div class="doc-section">
          <div class="doc-section__head">
            <h3 class="sub-eyebrow mono">SELLER / ADMIN BENEFIT</h3>
          </div>
          <p class="doc-copy">${escapeHtml(idea.sellerBenefit)}</p>
        </div>

        <div class="doc-section">
          <div class="doc-section__head">
            <h3 class="sub-eyebrow mono">BUYER BENEFIT</h3>
            <span class="doc-tag mono">${buyerLabel}</span>
          </div>
          <p class="doc-copy">${escapeHtml(idea.buyerBenefit)}</p>
        </div>

        ${idea.sourceNote ? `
          <div class="inspector-callout inspector-callout--info">
            <strong>Catatan Sumber:</strong> ${escapeHtml(idea.sourceNote)}
          </div>
        ` : ''}

        ${idea.quadrantDiscrepancyNote ? `
          <div class="inspector-callout inspector-callout--warn">
            <strong>Transparansi Sumber (Ide #10):</strong> ${escapeHtml(idea.quadrantDiscrepancyNote)}
            <div class="inspector-callout__sub mono">Label asli LKPD: ${escapeHtml(idea.originalQuadrantLabel)}</div>
          </div>
        ` : `
          <p class="inspector-origin mono">LKPD TABLE LABEL: ${escapeHtml(idea.originalQuadrantLabel)}</p>
        `}
      </div>
    </aside>
  `;
}

/**
 * In-place DOM updater so dragging range sliders remains 60fps smooth without losing focus.
 */
export function updateIdeaInspectorInPlace(rootEl, state) {
  const panel = rootEl.querySelector('[data-inspector-idea-id]');
  if (!panel) return false;

  const idea = state.ideas.find((item) => item.id === state.selectedIdeaId) || state.ideas[0];
  if (Number(panel.dataset.inspectorIdeaId) !== idea.id) return false;

  const stats = computeSummaryStats(state.ideas);
  const currentQ = getQuadrantMeta(idea.feasibility, idea.impact);
  const currentTotal = getTotalScore(idea.feasibility, idea.impact);

  const fTile = panel.querySelector('[data-tile="feasibility"]');
  const iTile = panel.querySelector('[data-tile="impact"]');
  const tTile = panel.querySelector('[data-tile="total"]');
  const qTile = panel.querySelector('[data-tile="quadrant"]');
  const qBox = panel.querySelector('[data-tile="quadrant-box"]');

  if (fTile) fTile.innerHTML = `${idea.feasibility}<small>/5</small>`;
  if (iTile) iTile.innerHTML = `${idea.impact}<small>/5</small>`;
  if (tTile) tTile.innerHTML = `${currentTotal}<small>/10</small>`;
  if (qTile) qTile.textContent = `Kuadran ${currentQ.roman} · ${currentQ.name}`;
  if (qBox) {
    qBox.className = `inspector-quad-strip inspector-quad-strip--${currentQ.colorKey}`;
    const dot = qBox.querySelector('.q-dot');
    if (dot) dot.className = `q-dot q-dot--${currentQ.colorKey}`;
  }

  const simBadge = panel.querySelector('[data-inspector-sim-badge]');
  if (simBadge) {
    simBadge.classList.toggle('is-sim', idea.isModified);
    simBadge.textContent = idea.isModified ? 'SIMULASI' : 'LKPD ASLI';
  }

  const compBox = panel.querySelector('[data-score-comparison]');
  if (compBox) {
    compBox.classList.toggle('is-hidden', !idea.isModified);
    const compCurr = compBox.querySelector('[data-comp-current]');
    if (compCurr) {
      compCurr.textContent = `F:${idea.feasibility} · I:${idea.impact} · Total ${currentTotal}/10 (${currentQ.roman})`;
    }
  }

  const fSlider = panel.querySelector('[data-sim-slider="feasibility"]');
  const iSlider = panel.querySelector('[data-sim-slider="impact"]');
  if (fSlider && Number(fSlider.value) !== idea.feasibility) fSlider.value = String(idea.feasibility);
  if (iSlider && Number(iSlider.value) !== idea.impact) iSlider.value = String(idea.impact);

  const fReadout = panel.querySelector('[data-readout="feasibility"]');
  const iReadout = panel.querySelector('[data-readout="impact"]');
  if (fReadout) fReadout.textContent = `${idea.feasibility} / 5`;
  if (iReadout) iReadout.textContent = `${idea.impact} / 5`;

  panel.querySelectorAll('[data-step-row="feasibility"] .step-num').forEach((btn) => {
    btn.classList.toggle('is-active', Number(btn.dataset.value) === idea.feasibility);
  });
  panel.querySelectorAll('[data-step-row="impact"] .step-num').forEach((btn) => {
    btn.classList.toggle('is-active', Number(btn.dataset.value) === idea.impact);
  });

  panel.querySelectorAll('[data-quadrant-mover-grid] .qmove-btn').forEach((btn) => {
    const active = btn.dataset.targetQuadrant === currentQ.id;
    btn.classList.toggle('is-current', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  const resetOne = panel.querySelector('[data-btn-reset-idea]');
  const resetAll = panel.querySelector('[data-btn-reset-all]');
  if (resetOne) resetOne.disabled = !idea.isModified;
  if (resetAll) resetAll.disabled = !stats.hasModifications;

  return true;
}
