/**
 * OverviewHero — Editorial topbar and cinematic strategy-studio hero header.
 * Compact navigation (no floating pill capsule), confident Geist Sans display type,
 * concise LKPD 5 exercise summary, and slim hairline metric strip.
 */

import { LKPD_META } from '../data/ideas.js';
import { computeSummaryStats } from '../utils/matrix.js';
import { icon } from './Icons.js';

export function renderOverviewHero(state) {
  const stats = computeSummaryStats(state.ideas);

  return `
    <header class="topbar">
      <div class="topbar__inner">
        <a href="#top" class="brand-mark" aria-label="IdeaQuest Home">
          <span class="brand-mark__square" aria-hidden="true"></span>
          <span class="brand-mark__name">${LKPD_META.brand}</span>
          <span class="brand-mark__divider" aria-hidden="true">/</span>
          <span class="brand-mark__context">LKPD 5 · ${LKPD_META.className}</span>
        </a>

        <nav class="topbar__nav" aria-label="Navigasi utama">
          <a href="#matrix-section">Idea Space</a>
          <a href="#lenses-section">Decision Lenses</a>
          <a href="#explorer-section">Explorer</a>
          <a href="#final-selection-section">Selected Trio</a>
          <a href="#analysis-section">Analysis</a>
        </nav>

        <div class="topbar__actions">
          ${stats.hasModifications ? `
            <button type="button" class="btn btn--subtle btn--sm" data-action="reset-all">
              ${icon('reset', 14)} Reset (${stats.modifiedCount})
            </button>
          ` : ''}
          <button type="button" class="btn btn--ghost btn--sm" data-action="export-csv">
            ${icon('download', 14)} CSV
          </button>
          <button type="button" class="btn btn--primary btn--sm" data-action="open-presentation">
            ${icon('play', 14)} Present
          </button>
        </div>
      </div>
    </header>

    <section id="top" class="hero-band" aria-labelledby="hero-heading">
      <div class="hero-band__grid">
        <div class="hero-band__copy">
          <div class="eyebrow-line">
            <span class="mono-tag">LKPD 5 · IDEATION (USP)</span>
            <span class="eyebrow-sep" aria-hidden="true">/</span>
            <span class="eyebrow-meta">Feasibility vs Impact · ${LKPD_META.className}</span>
            ${stats.hasModifications
              ? `<span class="sim-inline-flag" role="status">Simulasi · ${stats.modifiedCount} diubah</span>`
              : ''}
          </div>

          <h1 id="hero-heading" class="hero-display">Ten ideas. One clear direction.</h1>

          <p class="hero-lead">
            Studio visualisasi interaktif hasil brainstorming <strong>SCAMPER</strong> untuk menyelesaikan masalah
            <strong>${LKPD_META.persona.name}</strong> dalam menghitung margin bersih secara cepat dan menjaga batas aman
            keuntungan <strong>${LKPD_META.persona.targetMargin}</strong>—dari 10 gagasan awal hingga 3 konsep prototipe terpilih.
          </p>
        </div>

        <div class="hero-band__actions">
          <div class="hero-cta-group">
            <a href="#matrix-section" class="btn btn--primary btn--lg">
              Explore the matrix ${icon('arrowDownRight', 16)}
            </a>
            <button type="button" class="btn btn--outline btn--lg" data-action="open-presentation">
              ${icon('play', 15)} Presentation mode
            </button>
          </div>
          <p class="hero-attribution">
            Tim ${LKPD_META.className}: ${LKPD_META.teamMembers.join(', ')} · ${LKPD_META.semester}
          </p>
        </div>
      </div>
    </section>
  `;
}
