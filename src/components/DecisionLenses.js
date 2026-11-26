/**
 * DecisionLenses — Four complementary data views derived strictly from the same
 * canonical LKPD Feasibility (1–5) and Impact (1–5) scores:
 *   1. Full Portfolio Matrix
 *   2. Priority Matrix (original 3 selected highlighted, other 7 ghosted)
 *   3. Quadrant Comparison (4 synchronized mini-matrices)
 *   4. Total-Score Ranking (Feasibility + Impact with ties preserved)
 */

import { QUADRANTS, QUADRANT_IDS } from '../data/ideas.js';
import {
  computeMarkerPositions,
  computeScoreRanking,
  getQuadrantId,
  getQuadrantMeta,
  getTotalScore,
  groupIdeasByQuadrant,
  scoreToPercentX,
  scoreToPercentY,
  THRESHOLD_PERCENT,
} from '../utils/matrix.js';
import { icon } from './Icons.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const LENS_TABS = [
  { id: 'portfolio', label: 'Full Portfolio', icon: 'grid', desc: 'Seluruh 10 ide pada satu bidang koordinat.' },
  { id: 'priority', label: 'Priority Focus', icon: 'target', desc: 'Menyorot 3 konsep terpilih asli LKPD dengan 7 ide lain sebagai konteks.' },
  { id: 'quadrants', label: 'Quadrant Comparison', icon: 'layers', desc: 'Empat mini-matriks untuk membandingkan isi tiap kuadran secara terpisah.' },
  { id: 'ranking', label: 'Score Ranking', icon: 'bars', desc: 'Peringkat skor total (Feasibility + Impact) dengan nilai seri dipertahankan.' },
];

/**
 * Reusable compact SVG/CSS coordinate plot for Portfolio, Priority Focus, and Quadrant Mini-Matrices.
 */
function renderLensPlot({ ideas, selectedIdeaId, mode = 'portfolio', focusQuadrantId = null }) {
  const positions = computeMarkerPositions(ideas);
  const gridTicks = [1, 2, 3, 4, 5];

  const dotsHtml = ideas.map((idea) => {
    const pos = positions.get(idea.id);
    const q = getQuadrantMeta(idea.feasibility, idea.impact);
    const total = getTotalScore(idea.feasibility, idea.impact);
    const isSelected = idea.id === selectedIdeaId;

    let isGhosted = false;
    if (mode === 'priority') {
      isGhosted = !idea.isOriginalFinalSelection;
    } else if (mode === 'mini' && focusQuadrantId) {
      isGhosted = q.id !== focusQuadrantId;
    }

    const offsetScale = mode === 'mini' ? 0.55 : 0.85;
    const ox = Math.round(pos.offsetX * offsetScale);
    const oy = Math.round(pos.offsetY * offsetScale);

    return `
      <button
        type="button"
        class="lens-node lens-node--${q.colorKey} ${isGhosted ? 'is-ghosted' : ''} ${isSelected ? 'is-selected' : ''} ${idea.isOriginalFinalSelection ? 'is-trio' : ''}"
        style="left: ${pos.baseX}%; bottom: ${pos.baseY}%; --ox: ${ox}px; --oy: ${oy}px;"
        data-action="select-idea"
        data-idea-id="${idea.id}"
        title="#${idea.id} ${escapeHtml(idea.name)} (F:${idea.feasibility}, I:${idea.impact}, Total:${total})"
        aria-label="Pilih Ide ${idea.id}: ${escapeHtml(idea.shortLabel)}, Feasibility ${idea.feasibility}, Impact ${idea.impact}"
      >
        <span class="mono">${idea.id}</span>
        ${mode !== 'mini' && !isGhosted ? `<span class="lens-node__tag">${escapeHtml(idea.conceptName || idea.shortLabel)}</span>` : ''}
      </button>
    `;
  }).join('');

  return `
    <div class="lens-plot ${mode === 'mini' ? 'lens-plot--mini' : ''}" role="img" aria-label="Plot koordinat Feasibility versus Impact">
      <div class="lens-plot__quads" style="--split: ${THRESHOLD_PERCENT}%;">
        <div class="lens-quad ${focusQuadrantId === 'III' ? 'is-active-quad is-amber' : ''}"></div>
        <div class="lens-quad ${focusQuadrantId === 'I' || mode === 'priority' ? 'is-active-quad is-emerald' : ''}"></div>
        <div class="lens-quad ${focusQuadrantId === 'IV' ? 'is-active-quad is-coral' : ''}"></div>
        <div class="lens-quad ${focusQuadrantId === 'II' ? 'is-active-quad is-blue' : ''}"></div>
      </div>

      ${gridTicks.map((t) => `
        <span class="lens-grid-v" style="left: ${scoreToPercentX(t)}%;" aria-hidden="true"></span>
        <span class="lens-grid-h" style="bottom: ${scoreToPercentY(t)}%;" aria-hidden="true"></span>
      `).join('')}

      <span class="lens-threshold-v" style="left: ${THRESHOLD_PERCENT}%;" aria-hidden="true"></span>
      <span class="lens-threshold-h" style="bottom: ${THRESHOLD_PERCENT}%;" aria-hidden="true"></span>

      ${mode !== 'mini' ? `
        <span class="lens-qlabel lens-qlabel--tl">III · Tantangan</span>
        <span class="lens-qlabel lens-qlabel--tr">I · Prioritas Utama</span>
        <span class="lens-qlabel lens-qlabel--bl">IV · Prioritas Rendah</span>
        <span class="lens-qlabel lens-qlabel--br">II · Quick Wins</span>
      ` : ''}

      <div class="lens-nodes-layer">
        ${dotsHtml}
      </div>

      ${mode !== 'mini' ? `
        <div class="lens-axis-x mono" aria-hidden="true">
          ${gridTicks.map((t) => `<span style="left: ${scoreToPercentX(t)}%;">${t}</span>`).join('')}
        </div>
        <div class="lens-axis-y mono" aria-hidden="true">
          ${gridTicks.map((t) => `<span style="bottom: ${scoreToPercentY(t)}%;">${t}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function renderPortfolioLens(state) {
  const grouped = groupIdeasByQuadrant(state.ideas);
  return `
    <div class="lens-split">
      <div class="lens-split__visual">
        ${renderLensPlot({ ideas: state.ideas, selectedIdeaId: state.selectedIdeaId, mode: 'portfolio' })}
        <div class="lens-axis-footer mono">
          <span>X: FEASIBILITY (1 → 5)</span>
          <span>THRESHOLD: 3.5</span>
          <span>Y: IMPACT (1 → 5)</span>
        </div>
      </div>

      <div class="lens-split__aside">
        <h3 class="lens-aside-title">Distribusi Portofolio Lengkap</h3>
        <p class="lens-aside-desc">
          Semua 10 ide ditempatkan secara proporsional pada rentang skor 1–5 tanpa skala distorsi.
          Garis putus menandai ambang batas <strong>3.5</strong> (Rendah 1–3 vs Tinggi 4–5).
        </p>

        <div class="lens-breakdown-list">
          ${QUADRANT_IDS.map((qId) => {
            const q = QUADRANTS[qId];
            const items = grouped[qId];
            return `
              <div class="lens-breakdown-row">
                <div class="lens-breakdown-row__top">
                  <span class="q-dot q-dot--${q.colorKey}"></span>
                  <strong>${q.roman} · ${q.name}</strong>
                  <span class="mono lens-breakdown-count">${items.length} ide</span>
                </div>
                <div class="lens-breakdown-ids">
                  ${items.length > 0
                    ? items.map((idea) => `
                        <button
                          type="button"
                          class="inline-id-btn ${idea.id === state.selectedIdeaId ? 'is-selected' : ''}"
                          data-action="select-idea"
                          data-idea-id="${idea.id}"
                        >
                          <span class="mono">#${idea.id}</span> ${escapeHtml(idea.shortLabel)}
                        </button>
                      `).join('')
                    : '<span class="muted-text">Tidak ada ide pada kuadran ini</span>'}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderPriorityLens(state) {
  const trio = state.ideas.filter((i) => i.isOriginalFinalSelection);
  const others = state.ideas.filter((i) => !i.isOriginalFinalSelection);

  return `
    <div class="lens-split">
      <div class="lens-split__visual">
        ${renderLensPlot({ ideas: state.ideas, selectedIdeaId: state.selectedIdeaId, mode: 'priority' })}
        <div class="lens-axis-footer mono">
          <span>HIGHLIGHT: 3 KONSEP ASLI LKPD</span>
          <span>GHOSTED: 7 IDE KONTEKS</span>
        </div>
      </div>

      <div class="lens-split__aside">
        <h3 class="lens-aside-title">Fokus Tiga Ide Prioritas Utama</h3>
        <p class="lens-aside-desc">
          Menampilkan secara kontras mengapa <strong>Ide #1, #2, dan #3</strong> terpilih di sudut kanan atas
          (Feasibility 4–5, Impact 5), sementara 7 ide lain dipertahankan secara samar untuk konteks perbandingan.
        </p>

        <div class="priority-focus-list">
          ${trio.map((idea) => {
            const total = getTotalScore(idea.feasibility, idea.impact);
            return `
              <button
                type="button"
                class="priority-focus-item ${idea.id === state.selectedIdeaId ? 'is-selected' : ''}"
                data-action="select-idea"
                data-idea-id="${idea.id}"
              >
                <div class="priority-focus-item__head">
                  <span class="mono priority-focus-id">#0${idea.id}</span>
                  <strong>${escapeHtml(idea.conceptName)}</strong>
                  <span class="mono priority-focus-score">F:${idea.feasibility} · I:${idea.impact} · ${total}/10</span>
                </div>
                <span class="priority-focus-sub">${escapeHtml(idea.name)}</span>
              </button>
            `;
          }).join('')}
        </div>

        <p class="lens-footnote">
          7 ide konteks lain (${others.map((o) => `#${o.id}`).join(', ')}) tetap dapat diklik langsung pada plot.
        </p>
      </div>
    </div>
  `;
}

function renderQuadrantsLens(state) {
  const grouped = groupIdeasByQuadrant(state.ideas);

  return `
    <div class="mini-matrices-grid">
      ${QUADRANT_IDS.map((qId) => {
        const q = QUADRANTS[qId];
        const items = grouped[qId];
        return `
          <article class="mini-matrix-panel">
            <div class="mini-matrix-panel__head">
              <div class="mini-matrix-title-row">
                <span class="q-dot q-dot--${q.colorKey}"></span>
                <h3>${q.roman} · ${q.name}</h3>
                <span class="mono mini-matrix-count">${items.length}</span>
              </div>
              <p class="mini-matrix-rule mono">${q.shortDesc}</p>
            </div>

            ${renderLensPlot({
              ideas: state.ideas,
              selectedIdeaId: state.selectedIdeaId,
              mode: 'mini',
              focusQuadrantId: qId,
            })}

            <ul class="mini-matrix-list">
              ${items.length > 0
                ? items.map((idea) => `
                    <li>
                      <button
                        type="button"
                        class="mini-list-btn ${idea.id === state.selectedIdeaId ? 'is-selected' : ''}"
                        data-action="select-idea"
                        data-idea-id="${idea.id}"
                      >
                        <span class="mono mini-list-id">#${idea.id}</span>
                        <span class="mini-list-name">${escapeHtml(idea.shortLabel)}</span>
                        <span class="mono mini-list-coord">(${idea.feasibility},${idea.impact})</span>
                      </button>
                    </li>
                  `).join('')
                : '<li class="mini-list-empty">Tidak ada ide pada kuadran ini saat ini.</li>'}
            </ul>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function renderRankingLens(state) {
  const ranked = computeScoreRanking(state.ideas);

  return `
    <div class="ranking-panel">
      <div class="ranking-panel__header">
        <div>
          <h3 class="lens-aside-title">Peringkat Skor Total (Feasibility + Impact)</h3>
          <p class="lens-aside-desc">
            Tampilan turunan dari penjumlahan dua skor asli LKPD—bukan kriteria penilaian baru.
            Nilai seri (tie) diberi nomor peringkat yang sama secara transparan.
          </p>
        </div>
        <div class="ranking-legend mono">
          <span><i class="bar-swatch bar-swatch--f"></i> Feasibility (maks 5)</span>
          <span><i class="bar-swatch bar-swatch--i"></i> Impact (maks 5)</span>
        </div>
      </div>

      <div class="ranking-rows">
        ${ranked.map(({ idea, total, quadrant, rank, isTied }) => {
          const fWidth = (idea.feasibility / 10) * 100;
          const iWidth = (idea.impact / 10) * 100;
          const isSelected = idea.id === state.selectedIdeaId;

          return `
            <button
              type="button"
              class="ranking-row ${isSelected ? 'is-selected' : ''}"
              data-action="select-idea"
              data-idea-id="${idea.id}"
            >
              <div class="ranking-row__rank mono">
                <span class="rank-num">${String(rank).padStart(2, '0')}</span>
                ${isTied ? '<span class="rank-tie">TIE</span>' : ''}
              </div>

              <div class="ranking-row__meta">
                <div class="ranking-row__title-line">
                  <span class="mono ranking-id">#${idea.id}</span>
                  <strong class="ranking-name">${escapeHtml(idea.name)}</strong>
                  ${idea.isOriginalFinalSelection ? `<span class="trio-inline-tag">${escapeHtml(idea.conceptName)}</span>` : ''}
                  ${idea.isModified ? '<span class="sim-micro-tag">Simulasi</span>' : ''}
                </div>
                <div class="ranking-bar-track" aria-hidden="true">
                  <span class="ranking-bar-seg ranking-bar-seg--f" style="width: ${fWidth}%;"></span>
                  <span class="ranking-bar-seg ranking-bar-seg--i ranking-bar-seg--${quadrant.colorKey}" style="width: ${iWidth}%;"></span>
                </div>
              </div>

              <div class="ranking-row__scores mono">
                <span class="ranking-breakdown">F:${idea.feasibility} + I:${idea.impact}</span>
                <strong class="ranking-total">${total}<small>/10</small></strong>
                <span class="ranking-quad ranking-quad--${quadrant.colorKey}">${quadrant.roman}</span>
              </div>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function renderDecisionLenses(state) {
  const activeLens = state.activeLens || 'portfolio';
  const activeMeta = LENS_TABS.find((t) => t.id === activeLens) || LENS_TABS[0];

  let bodyHtml = '';
  if (activeLens === 'priority') bodyHtml = renderPriorityLens(state);
  else if (activeLens === 'quadrants') bodyHtml = renderQuadrantsLens(state);
  else if (activeLens === 'ranking') bodyHtml = renderRankingLens(state);
  else bodyHtml = renderPortfolioLens(state);

  return `
    <section id="lenses-section" class="editorial-section" aria-labelledby="lenses-heading">
      <div class="section-head-row">
        <div>
          <span class="section-index mono">02 / DECISION LENSES</span>
          <h2 id="lenses-heading" class="section-heading">Four perspectives on the same LKPD data</h2>
          <p class="section-subcopy">${activeMeta.desc}</p>
        </div>

        <div class="segmented-tabs" role="tablist" aria-label="Pilihan tampilan analisis matriks">
          ${LENS_TABS.map((tab) => `
            <button
              type="button"
              role="tab"
              aria-selected="${activeLens === tab.id ? 'true' : 'false'}"
              class="segmented-tab ${activeLens === tab.id ? 'is-active' : ''}"
              data-action="set-lens"
              data-lens="${tab.id}"
            >
              ${icon(tab.icon, 14)}
              <span>${tab.label}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="lens-stage" data-lens-stage>
        ${bodyHtml}
      </div>
    </section>
  `;
}
