/**
 * CriticalAnalysis — Numbered architectural editorial list (not a wall of pastel cards).
 * Explicitly separates canonical LKPD statements from technical & UX recommendations.
 */

import { CRITICAL_ANALYSIS_ITEMS } from '../data/ideas.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderCriticalAnalysis() {
  return `
    <section id="analysis-section" class="editorial-section" aria-labelledby="analysis-heading">
      <div class="section-head-row">
        <div>
          <span class="section-index mono">05 / CRITICAL IMPLEMENTATION ANALYSIS</span>
          <h2 id="analysis-heading" class="section-heading">LKPD facts versus engineering considerations</h2>
          <p class="section-subcopy">
            Pemisahan tegas antara pernyataan sumber LKPD 3–5 dan pertimbangan teknis/validasi sebelum membangun prototipe.
          </p>
        </div>
        <div class="source-legend mono">
          <span class="src-badge src-badge--lkpd">LKPD SOURCE</span>
          <span class="src-badge src-badge--rec">IMPLEMENTATION REC</span>
        </div>
      </div>

      <ol class="analysis-list">
        ${CRITICAL_ANALYSIS_ITEMS.map((item, idx) => `
          <li class="analysis-item">
            <div class="analysis-item__head">
              <span class="analysis-item__num mono">0${idx + 1}</span>
              <div>
                <span class="src-badge ${item.category === 'lkpd-fact' ? 'src-badge--lkpd' : 'src-badge--rec'} mono">
                  ${escapeHtml(item.categoryLabel)}
                </span>
                <h3 class="analysis-item__title">${escapeHtml(item.title)}</h3>
              </div>
            </div>

            <div class="analysis-item__columns">
              <div class="analysis-col">
                <span class="sub-eyebrow mono">LKPD STATEMENT</span>
                <p>${escapeHtml(item.lkpdStatement)}</p>
              </div>
              <div class="analysis-col analysis-col--rec">
                <span class="sub-eyebrow mono">IMPLEMENTATION CONSIDERATION</span>
                <p>${escapeHtml(item.recommendation)}</p>
              </div>
            </div>
          </li>
        `).join('')}
      </ol>
    </section>
  `;
}
