/**
 * IdeaExplorer — Clean architectural data table of all 10 LKPD ideas.
 * Synchronizes selection with the 3D Space, 2D Matrix, Decision Lenses, and Inspector.
 */

import { QUADRANTS, QUADRANT_IDS } from '../data/ideas.js';
import { getQuadrantId, getQuadrantMeta, getTotalScore } from '../utils/matrix.js';
import { icon } from './Icons.js';

const SCAMPER_OPTIONS = [
  { value: 'all', label: 'All SCAMPER' },
  { value: 'S', label: 'S — Substitute' },
  { value: 'C', label: 'C — Combine' },
  { value: 'M', label: 'M — Modify' },
  { value: 'P', label: 'P — Put to Another Use' },
  { value: 'E', label: 'E — Eliminate' },
  { value: 'R', label: 'R — Reverse' },
  { value: 'NONE', label: 'Not specified in SCAMPER' },
];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function filterIdeas(ideas, filters) {
  const q = (filters.search || '').trim().toLowerCase();
  return ideas.filter((idea) => {
    const qId = getQuadrantId(idea.feasibility, idea.impact);
    if (filters.quadrant !== 'all' && qId !== filters.quadrant) return false;
    if (filters.scamper !== 'all' && idea.scamperCode !== filters.scamper) return false;
    if (q) {
      const hay = `${idea.id} ${idea.name} ${idea.shortLabel} ${idea.conceptName || ''} ${idea.scamper} ${idea.rationale}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function renderExplorerRows(state) {
  const filtered = filterIdeas(state.ideas, state.filters);
  if (filtered.length === 0) {
    return `
      <div class="explorer-empty">
        <p>Tidak ada ide yang cocok dengan kriteria filter saat ini.</p>
        <button type="button" class="btn btn--outline btn--sm" data-action="clear-filters">
          Tampilkan semua 10 ide
        </button>
      </div>
    `;
  }

  return `
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th scope="col" class="col-num">No</th>
            <th scope="col">Idea Name</th>
            <th scope="col">SCAMPER</th>
            <th scope="col" class="col-score">Feasibility</th>
            <th scope="col" class="col-score">Impact</th>
            <th scope="col" class="col-score">Total</th>
            <th scope="col">Quadrant</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map((idea) => {
            const q = getQuadrantMeta(idea.feasibility, idea.impact);
            const total = getTotalScore(idea.feasibility, idea.impact);
            const isSelected = idea.id === state.selectedIdeaId;

            return `
              <tr
                class="data-row ${isSelected ? 'is-selected' : ''}"
                data-action="select-idea-from-list"
                data-idea-id="${idea.id}"
              >
                <td class="col-num mono">#${String(idea.id).padStart(2, '0')}</td>
                <td>
                  <button
                    type="button"
                    class="row-trigger"
                    data-action="select-idea-from-list"
                    data-idea-id="${idea.id}"
                    aria-pressed="${isSelected ? 'true' : 'false'}"
                  >
                    <span class="row-trigger__title">${escapeHtml(idea.name)}</span>
                    <span class="row-trigger__flags">
                      ${idea.isOriginalFinalSelection ? `<span class="trio-inline-tag">${escapeHtml(idea.conceptName)}</span>` : ''}
                      ${idea.isModified ? `<span class="sim-micro-tag">Simulasi (asli ${idea.originalFeasibility}/${idea.originalImpact})</span>` : ''}
                      ${idea.id === 10 ? `<span class="source-micro-tag">LKPD label: Prioritas Rendah</span>` : ''}
                    </span>
                  </button>
                </td>
                <td class="col-scamper">${escapeHtml(idea.scamper)}</td>
                <td class="col-score mono"><strong>${idea.feasibility}</strong><span class="muted-inline">/5</span></td>
                <td class="col-score mono"><strong>${idea.impact}</strong><span class="muted-inline">/5</span></td>
                <td class="col-score mono"><strong>${total}</strong><span class="muted-inline">/10</span></td>
                <td class="col-quad">
                  <span class="quad-inline">
                    <span class="q-dot q-dot--${q.colorKey}"></span>
                    <span class="mono">${q.roman}</span>
                    <span>${q.name}</span>
                  </span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

export function renderIdeaExplorer(state) {
  const { filters } = state;
  const filteredCount = filterIdeas(state.ideas, filters).length;

  return `
    <section id="explorer-section" class="editorial-section" aria-labelledby="explorer-heading">
      <div class="section-head-row">
        <div>
          <span class="section-index mono">03 / IDEA EXPLORER</span>
          <h2 id="explorer-heading" class="section-heading">Complete ideation registry</h2>
          <p class="section-subcopy">
            Klik baris untuk menyinkronkan node pada 3D Space, 2D Matrix, Decision Lenses, dan Inspector.
          </p>
        </div>
        <span class="mono-quiet" data-explorer-count>SHOWING ${filteredCount} OF ${state.ideas.length} IDEAS</span>
      </div>

      <div class="explorer-toolbar">
        <div class="search-box">
          <span class="search-box__icon">${icon('search', 15)}</span>
          <label for="idea-search-input" class="sr-only">Cari ide berdasarkan nama</label>
          <input
            id="idea-search-input"
            type="search"
            class="studio-input"
            placeholder="Search ideas (e.g. margin, reverse, bundling, API)..."
            value="${escapeHtml(filters.search)}"
            data-filter-input="search"
          />
        </div>

        <div class="filter-tabs" role="group" aria-label="Filter kuadran">
          <button
            type="button"
            class="filter-tab ${filters.quadrant === 'all' ? 'is-active' : ''}"
            data-action="filter-quadrant"
            data-quadrant-value="all"
          >All</button>
          ${QUADRANT_IDS.map((qId) => {
            const q = QUADRANTS[qId];
            return `
              <button
                type="button"
                class="filter-tab ${filters.quadrant === qId ? 'is-active' : ''}"
                data-action="filter-quadrant"
                data-quadrant-value="${qId}"
              ><span class="q-dot q-dot--${q.colorKey}"></span> ${q.roman} · ${q.name}</button>
            `;
          }).join('')}
        </div>

        <div class="select-wrap">
          <label for="scamper-filter-select" class="sr-only">Filter kategori SCAMPER</label>
          <select id="scamper-filter-select" class="studio-select" data-filter-select="scamper">
            ${SCAMPER_OPTIONS.map((opt) => `
              <option value="${opt.value}" ${filters.scamper === opt.value ? 'selected' : ''}>${opt.label}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div data-explorer-body>
        ${renderExplorerRows(state)}
      </div>
    </section>
  `;
}

export function updateExplorerBodyInPlace(rootEl, state) {
  const body = rootEl.querySelector('[data-explorer-body]');
  const countEl = rootEl.querySelector('[data-explorer-count]');
  if (!body) return false;

  const filtered = filterIdeas(state.ideas, state.filters);
  body.innerHTML = renderExplorerRows(state);
  if (countEl) {
    countEl.textContent = `SHOWING ${filtered.length} OF ${state.ideas.length} IDEAS`;
  }

  rootEl.querySelectorAll('[data-action="filter-quadrant"]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.quadrantValue === state.filters.quadrant);
  });
  const select = rootEl.querySelector('[data-filter-select="scamper"]');
  if (select && select.value !== state.filters.scamper) select.value = state.filters.scamper;
  const searchInput = rootEl.querySelector('[data-filter-input="search"]');
  if (searchInput && document.activeElement !== searchInput && searchInput.value !== state.filters.search) {
    searchInput.value = state.filters.search;
  }

  return true;
}
