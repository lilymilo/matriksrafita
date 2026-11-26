/**
 * FinalSelection — Editorial architectural showcase of the 3 original LKPD selected concepts.
 * Explicitly preserves the original team decision even while users experiment in the simulator.
 */

import { FINAL_SELECTION_SUMMARY } from '../data/ideas.js';
import { computeSummaryStats, getQuadrantMeta, getTotalScore } from '../utils/matrix.js';
import { icon } from './Icons.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderFinalSelection(state) {
  const trio = state.ideas.filter((idea) => idea.isOriginalFinalSelection);
  const stats = computeSummaryStats(state.ideas);

  return `
    <section id="final-selection-section" class="editorial-section" aria-labelledby="final-heading">
      <div class="section-head-row">
        <div>
          <span class="section-index mono">04 / THREE SELECTED CONCEPTS</span>
          <h2 id="final-heading" class="section-heading">Original LKPD 5 priority decisions</h2>
          <p class="section-subcopy">
            Tiga gagasan dari Kuadran I (Prioritas Utama) yang dipilih kelompok untuk dikembangkan menjadi konsep prototipe web.
          </p>
        </div>
        ${stats.hasModifications ? `
          <span class="sim-inline-flag" role="note">Pilihan final asli terkunci · Tidak berubah oleh simulasi</span>
        ` : `<span class="mono-quiet">LOCKED TO LKPD CONCLUSION</span>`}
      </div>

      <div class="concepts-columns">
        ${trio.map((idea, idx) => {
          const origTotal = getTotalScore(idea.originalFeasibility, idea.originalImpact);
          const simTotal = getTotalScore(idea.feasibility, idea.impact);
          const simQ = getQuadrantMeta(idea.feasibility, idea.impact);
          const isSelected = idea.id === state.selectedIdeaId;

          return `
            <article class="concept-col ${isSelected ? 'is-selected' : ''}">
              <div class="concept-col__top mono">
                <span class="concept-num">0${idx + 1} / IDEA #0${idea.id}</span>
                <span class="concept-score">F:${idea.originalFeasibility} · I:${idea.originalImpact} · ${origTotal}/10</span>
              </div>

              <h3 class="concept-col__title">${escapeHtml(idea.conceptName)}</h3>
              <p class="concept-col__orig">${escapeHtml(idea.name)}</p>

              <div class="concept-col__meta mono">
                <span>${escapeHtml(idea.scamper)}</span>
                <span>·</span>
                <span class="concept-col__quad">I · Prioritas Utama</span>
              </div>

              <p class="concept-col__body">${escapeHtml(idea.rationale)}</p>

              <div class="concept-col__impact">
                <span class="mono sub-eyebrow">MANFAAT PENJUAL / ADMIN</span>
                <p>${escapeHtml(idea.sellerBenefit)}</p>
              </div>

              ${idea.isModified ? `
                <div class="concept-col__sim mono">
                  Simulasi aktif: F:${idea.feasibility}, I:${idea.impact} (${simTotal}/10 · Kuadran ${simQ.roman})
                </div>
              ` : ''}

              <button
                type="button"
                class="concept-inspect-link"
                data-action="select-idea-from-list"
                data-idea-id="${idea.id}"
              >
                Inspect in studio ${icon('arrowRight', 14)}
              </button>
            </article>
          `;
        }).join('')}
      </div>

      <div class="conclusion-band">
        <div class="conclusion-band__lead">
          <span class="sub-eyebrow mono">TEAM RATIONALE (LKPD 5 SECTION D)</span>
          <h3>Mengapa tiga konsep ini terpilih?</h3>
          <p class="conclusion-reflection">${escapeHtml(FINAL_SELECTION_SUMMARY.scamperReflection)}</p>
        </div>

        <div class="conclusion-band__points">
          ${FINAL_SELECTION_SUMMARY.reasoning.map((r, i) => `
            <div class="conclusion-point">
              <span class="mono conclusion-point__idx">0${i + 1}</span>
              <div>
                <strong>${escapeHtml(r.label)}</strong>
                <p>${escapeHtml(r.text)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
