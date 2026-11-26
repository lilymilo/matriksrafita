/**
 * ExportControls — Clean architectural export and local-session disclosure bar.
 */

import { computeSummaryStats } from '../utils/matrix.js';
import { icon } from './Icons.js';

export function renderExportControls(state) {
  const stats = computeSummaryStats(state.ideas);

  return `
    <section class="export-strip" aria-label="Ekspor data dan kontrol sesi">
      <div class="export-strip__copy">
        <span class="section-index mono">06 / EXPORT &amp; PRESENTATION</span>
        <h2 class="export-strip__title">Siap dipresentasikan &amp; diekspor</h2>
        <p class="export-strip__note">
          Perubahan simulasi hanya tersimpan secara <strong>lokal di sesi browser ini</strong> (tanpa backend/sinkronisasi cloud)
          dan tidak mengubah data kanonis LKPD 5.
        </p>
      </div>

      <div class="export-strip__actions">
        <button type="button" class="btn btn--primary" data-action="open-presentation">
          ${icon('play', 15)} Presentation Mode
        </button>
        <button type="button" class="btn btn--outline" data-action="export-csv">
          ${icon('download', 15)} Export CSV
        </button>
        <button type="button" class="btn btn--outline" data-action="print-summary">
          ${icon('printer', 15)} Print / Save PDF
        </button>
        <button
          type="button"
          class="btn btn--subtle"
          data-action="reset-all"
          ${stats.hasModifications ? '' : 'disabled'}
        >
          ${icon('reset', 15)} Reset All Scores
        </button>
      </div>
    </section>
  `;
}
