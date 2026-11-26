/**
 * SummaryStats — Slim architectural hairline metric strip (replaces noisy 4-card grid).
 * Dynamically computes counts and average total score from current state.
 */

import { computeSummaryStats } from '../utils/matrix.js';

export function renderSummaryStats(state) {
  const stats = computeSummaryStats(state.ideas);
  const priorityChanged = stats.priorityCount !== stats.originalPriorityCount;
  const avgChanged = stats.averageTotalFormatted !== stats.originalAverageTotalFormatted;

  return `
    <section class="metric-strip" aria-label="Ringkasan metrik ideasi LKPD 5">
      <div class="metric-cell">
        <span class="metric-cell__label">Total Ideas</span>
        <div class="metric-cell__row">
          <strong class="metric-cell__value mono" data-stat="total-ideas">${String(stats.totalIdeas).padStart(2, '0')}</strong>
          <span class="metric-cell__sub">SCAMPER · Skala 1–5</span>
        </div>
      </div>

      <div class="metric-cell">
        <span class="metric-cell__label">Original Selected / Kuadran I</span>
        <div class="metric-cell__row">
          <strong class="metric-cell__value mono" data-stat="priority-count">${String(stats.priorityCount).padStart(2, '0')}</strong>
          <span class="metric-cell__sub">
            ${priorityChanged
              ? `Simulasi (asli LKPD: 0${stats.originalPriorityCount})`
              : `Prioritas Utama · F ≥ 4, I ≥ 4`}
          </span>
        </div>
      </div>

      <div class="metric-cell">
        <span class="metric-cell__label">Average Total Score</span>
        <div class="metric-cell__row">
          <strong class="metric-cell__value mono" data-stat="average-score">${stats.averageTotalFormatted}<span class="metric-cell__denom">/10</span></strong>
          <span class="metric-cell__sub">
            ${avgChanged
              ? `Simulasi (asli LKPD: ${stats.originalAverageTotalFormatted}/10)`
              : `Dihitung dari Feasibility + Impact`}
          </span>
        </div>
      </div>

      <div class="metric-cell">
        <span class="metric-cell__label">Quadrant Distribution</span>
        <div class="metric-cell__row">
          <strong class="metric-cell__value mono" data-stat="quadrant-total">0${stats.quadrantTotal}</strong>
          <span class="metric-cell__sub mono">
            I:${stats.countsByQuadrant.I} · II:${stats.countsByQuadrant.II} · III:${stats.countsByQuadrant.III} · IV:${stats.countsByQuadrant.IV}
          </span>
        </div>
      </div>
    </section>
  `;
}
