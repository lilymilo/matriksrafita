/**
 * PresentationMode — Cinematic, high-contrast, projector-ready full-screen deck.
 * Hides editing sliders, defaults to exact original LKPD 5 data, provides clear
 * section navigation (keyboard arrows + Escape), large readable matrix, and Print/PDF.
 */

import { CRITICAL_ANALYSIS_ITEMS, FINAL_SELECTION_SUMMARY, INITIAL_IDEAS, LKPD_META } from '../data/ideas.js';
import { computeSummaryStats, getQuadrantMeta, getTotalScore } from '../utils/matrix.js';
import { icon } from './Icons.js';
import { renderMatrixCanvas } from './PriorityMatrix.js';

const SLIDES = [
  { id: 0, code: '01', title: 'Context & Summary' },
  { id: 1, code: '02', title: 'Decision Matrix' },
  { id: 2, code: '03', title: 'Selected Concepts' },
  { id: 3, code: '04', title: 'Critical Analysis' },
];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getOriginalIdeasView() {
  return INITIAL_IDEAS.map((item) => ({
    ...item,
    feasibility: item.originalFeasibility,
    impact: item.originalImpact,
    isModified: false,
  }));
}

function renderSlideBody(state) {
  const { slide, useSimulatedData, focusedIdeaId } = state.presentation;
  const activeIdeas = useSimulatedData ? state.ideas : getOriginalIdeasView();
  const stats = computeSummaryStats(activeIdeas);

  if (slide === 0) {
    return `
      <div class="pres-slide pres-slide--intro">
        <div class="pres-intro-main">
          <span class="mono-tag">${LKPD_META.documentTitle} · ${LKPD_META.className}</span>
          <h2 class="pres-display">Ten ideas.<br/>One clear direction.</h2>
          <p class="pres-lead">
            Prioritisasi fitur Unique Selling Point (USP) e-commerce menggunakan teknik brainstorming SCAMPER
            dan Matriks Feasibility vs Impact (skala 1–5).
          </p>

          <div class="pres-pov">
            <span class="sub-eyebrow mono">USER PERSONA &amp; POV (LKPD 4)</span>
            <p class="pres-pov__quote">${escapeHtml(LKPD_META.persona.pov)}</p>
            <p class="pres-pov__hmw"><strong>How Might We:</strong> ${escapeHtml(LKPD_META.persona.hmw)}</p>
          </div>
        </div>

        <div class="pres-intro-side">
          <div class="pres-stat-stack">
            <div class="pres-stat-item"><strong class="mono">${String(stats.totalIdeas).padStart(2, '0')}</strong><span>Ide SCAMPER</span></div>
            <div class="pres-stat-item"><strong class="mono">0${stats.priorityCount}</strong><span>Prioritas Utama (F ≥ 4, I ≥ 4)</span></div>
            <div class="pres-stat-item"><strong class="mono">${stats.averageTotalFormatted}/10</strong><span>Rata-Rata Skor Total</span></div>
            <div class="pres-stat-item"><strong class="mono">04</strong><span>Kuadran Keputusan</span></div>
          </div>
          <p class="pres-credit mono">TIM ${LKPD_META.className}: ${LKPD_META.teamMembers.join(' · ')}</p>
        </div>
      </div>
    `;
  }

  if (slide === 1) {
    const focused = activeIdeas.find((i) => i.id === focusedIdeaId) || activeIdeas[0];
    const q = getQuadrantMeta(focused.feasibility, focused.impact);
    const total = getTotalScore(focused.feasibility, focused.impact);

    return `
      <div class="pres-slide pres-slide--matrix">
        <div class="pres-matrix-canvas">
          ${renderMatrixCanvas({
            ideas: activeIdeas,
            selectedIdeaId: focused.id,
            readOnly: true,
            compact: true,
          })}
        </div>

        <aside class="pres-callout" aria-label="Detail ide terpilih pada presentasi">
          <div class="pres-callout__top mono">
            <span>IDEA #${String(focused.id).padStart(2, '0')}</span>
            <span>${escapeHtml(focused.scamper)}</span>
          </div>
          <h3 class="pres-callout__title">${escapeHtml(focused.name)}</h3>

          <div class="pres-callout__scores mono">
            <span>F: <strong>${focused.feasibility}/5</strong></span>
            <span>I: <strong>${focused.impact}/5</strong></span>
            <span>TOTAL: <strong>${total}/10</strong></span>
          </div>

          <div class="pres-callout__quad">
            <span class="q-dot q-dot--${q.colorKey}"></span>
            <strong>Kuadran ${q.roman} · ${q.name}</strong>
          </div>

          <p class="pres-callout__copy"><strong>Konsep:</strong> ${escapeHtml(focused.rationale)}</p>
          <p class="pres-callout__copy"><strong>Penjual:</strong> ${escapeHtml(focused.sellerBenefit)}</p>
          <p class="pres-callout__copy"><strong>Pembeli:</strong> ${escapeHtml(focused.buyerBenefit)}</p>
          ${focused.quadrantDiscrepancyNote ? `<p class="pres-callout__warn">${escapeHtml(focused.quadrantDiscrepancyNote)}</p>` : ''}
          <p class="pres-callout__hint mono">Klik pin mana saja di matriks untuk mengganti sorotan.</p>
        </aside>
      </div>
    `;
  }

  if (slide === 2) {
    const trio = getOriginalIdeasView().filter((i) => i.isOriginalFinalSelection);
    return `
      <div class="pres-slide pres-slide--trio">
        <div class="pres-head">
          <span class="mono-tag">ORIGINAL LKPD 5 SELECTION · QUADRANT I</span>
          <h2>Three Selected Product Concepts</h2>
        </div>

        <div class="pres-trio-cols">
          ${trio.map((idea, idx) => `
            <article class="pres-trio-col">
              <div class="pres-trio-col__top mono">
                <span>0${idx + 1} / IDEA #0${idea.id}</span>
                <span>F:${idea.originalFeasibility} · I:${idea.originalImpact} · ${idea.originalFeasibility + idea.originalImpact}/10</span>
              </div>
              <h3>${escapeHtml(idea.conceptName)}</h3>
              <p class="pres-trio-col__sub">${escapeHtml(idea.name)}</p>
              <p class="pres-trio-col__desc">${escapeHtml(idea.rationale)}</p>
              <p class="pres-trio-col__benefit">${escapeHtml(idea.sellerBenefit)}</p>
            </article>
          `).join('')}
        </div>

        <div class="pres-reasons">
          ${FINAL_SELECTION_SUMMARY.reasoning.map((r, i) => `
            <div>
              <span class="mono">0${i + 1} · ${escapeHtml(r.label)}</span>
              <p>${escapeHtml(r.text)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="pres-slide pres-slide--analysis">
      <div class="pres-head">
        <span class="mono-tag">CRITICAL IMPLEMENTATION CONSIDERATIONS</span>
        <h2>LKPD Facts &amp; Prototype Readiness</h2>
      </div>

      <ol class="pres-analysis-list">
        ${CRITICAL_ANALYSIS_ITEMS.map((item, idx) => `
          <li>
            <span class="mono pres-a-num">0${idx + 1}</span>
            <div class="pres-a-body">
              <div class="pres-a-head">
                <strong>${escapeHtml(item.title)}</strong>
                <span class="src-badge ${item.category === 'lkpd-fact' ? 'src-badge--lkpd' : 'src-badge--rec'} mono">${escapeHtml(item.categoryLabel)}</span>
              </div>
              <p><b>LKPD:</b> ${escapeHtml(item.lkpdStatement)}</p>
              <p><b>Implementasi:</b> ${escapeHtml(item.recommendation)}</p>
            </div>
          </li>
        `).join('')}
      </ol>
    </div>
  `;
}

export function renderPresentationMode(state) {
  if (!state.presentation.open) return '';

  const { slide, useSimulatedData } = state.presentation;
  const stats = computeSummaryStats(state.ideas);

  return `
    <div class="pres-overlay" role="dialog" aria-modal="true" aria-label="Mode Presentasi IdeaQuest">
      <header class="pres-topbar">
        <div class="pres-topbar__left">
          <strong class="pres-brand">IdeaQuest / Presentation</strong>
          <span class="mono pres-source-tag">
            ${useSimulatedData ? 'SIMULATION VIEW' : 'ORIGINAL LKPD 5 DATA'}
          </span>
          ${stats.hasModifications ? `
            <button type="button" class="btn btn--ghost btn--sm" data-action="toggle-presentation-data">
              ${useSimulatedData ? 'Switch to Original LKPD' : 'Show Simulation'}
            </button>
          ` : ''}
        </div>

        <nav class="pres-tabs" role="tablist" aria-label="Slide presentasi">
          ${SLIDES.map((s) => `
            <button
              type="button"
              role="tab"
              aria-selected="${slide === s.id ? 'true' : 'false'}"
              class="pres-tab ${slide === s.id ? 'is-active' : ''}"
              data-action="presentation-slide"
              data-slide="${s.id}"
            >
              <span class="mono">${s.code}</span> ${s.title}
            </button>
          `).join('')}
        </nav>

        <div class="pres-topbar__right">
          <button type="button" class="btn btn--outline btn--sm" data-action="print-summary">
            ${icon('printer', 14)} Print / PDF
          </button>
          <button type="button" class="btn btn--primary btn--sm" data-action="close-presentation">
            ${icon('close', 14)} Exit
          </button>
        </div>
      </header>

      <div class="pres-stage">
        ${renderSlideBody(state)}
      </div>

      <footer class="pres-footer">
        <button
          type="button"
          class="btn btn--outline btn--sm"
          data-action="presentation-prev"
          ${slide === 0 ? 'disabled' : ''}
        >
          ${icon('arrowLeft', 14)} Previous
        </button>

        <span class="mono pres-counter">SLIDE ${slide + 1} / ${SLIDES.length} · ARROW KEYS ← / → · ESC TO EXIT</span>

        <button
          type="button"
          class="btn btn--primary btn--sm"
          data-action="presentation-next"
          ${slide === SLIDES.length - 1 ? 'disabled' : ''}
        >
          Next ${icon('arrowRight', 14)}
        </button>
      </footer>
    </div>
  `;
}
