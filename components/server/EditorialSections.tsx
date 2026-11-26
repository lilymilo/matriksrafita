import React from 'react';
import {
  CRITICAL_ANALYSIS_ITEMS,
  FINAL_SELECTION_SUMMARY,
  LKPD_META,
  LKPD_SEED_IDEAS,
} from '@/lib/data/lkpd-data';

/**
 * Pure React Server Components for static LKPD 3–5 context,
 * Three Selected Product Concepts, Critical Implementation Analysis, and Footer.
 */

export function PersonaContextBandServer() {
  const { persona } = LKPD_META;
  return (
    <section className="persona-band" aria-labelledby="persona-heading">
      <div className="workspace-container persona-band__inner">
        <div className="persona-band__meta">
          <p className="section-kicker">Latar Belakang Masalah · LKPD 3 &amp; 4</p>
          <h2 id="persona-heading" className="persona-band__title">
            {persona.name} <span className="persona-band__age">({persona.age} tahun)</span>
          </h2>
          <p className="persona-band__role">{persona.role}</p>
          <div className="persona-band__target">
            <span>Target Margin Aman:</span>
            <strong className="mono">{persona.targetMargin}</strong>
          </div>
        </div>

        <div className="persona-band__pov">
          <blockquote className="persona-quote">“{persona.quote}”</blockquote>
          <p className="persona-hmw-text">
            <strong>Pertanyaan Utama:</strong> {persona.hmw}
          </p>
        </div>
      </div>
    </section>
  );
}

export function SelectedConceptsServer() {
  const selectedTrio = LKPD_SEED_IDEAS.filter((idea) => idea.isOriginalFinalSelection);

  return (
    <section
      id="ide-terpilih"
      className="editorial-section"
      aria-labelledby="selected-concepts-heading"
    >
      <div className="section-header">
        <div>
          <p className="section-kicker">Keputusan Kelompok · LKPD 5</p>
          <h2 id="selected-concepts-heading" className="section-title">
            {FINAL_SELECTION_SUMMARY.title}
          </h2>
          <p className="section-lead">{FINAL_SELECTION_SUMMARY.subtitle}</p>
        </div>
        <span className="trio-badge">★ Kuadran I · Prioritas Utama</span>
      </div>

      <div className="trio-editorial-grid">
        {selectedTrio.map((idea, idx) => {
          const total = idea.originalFeasibility + idea.originalImpact;
          return (
            <article key={idea.id} className="trio-column">
              <div className="trio-column__top">
                <span className="trio-column__index">
                  Pilihan {idx + 1} · Ide #{idea.id}
                </span>
                <strong className="mono text-mint">Total {total}/10</strong>
              </div>

              <h3 className="trio-column__concept">{idea.conceptName}</h3>
              <p className="trio-column__origin">{idea.name}</p>

              <div className="trio-score-pills mono">
                <span>
                  Kelayakan: <strong>{idea.originalFeasibility}/5</strong>
                </span>
                <span>
                  Dampak: <strong className="text-mint">{idea.originalImpact}/5</strong>
                </span>
              </div>

              <p className="trio-column__summary">{idea.sellerBenefit}</p>

              <details className="editorial-expandable">
                <summary>Lihat cara kerja &amp; alasan pemilihan</summary>
                <div className="editorial-expandable__body">
                  <p>
                    <strong>Cara Kerja:</strong> {idea.description}
                  </p>
                  <p>
                    <strong>Alasan Dipilih:</strong> {idea.rationale}
                  </p>
                  <p>
                    <strong>Teknik SCAMPER:</strong> {idea.scamper}
                  </p>
                </div>
              </details>
            </article>
          );
        })}
      </div>

      <div className="rationale-editorial-band">
        <div className="rationale-editorial-band__intro">
          <p className="section-kicker">Alasan Keputusan</p>
          <h3>Mengapa tiga konsep ini paling siap dikembangkan?</h3>
          <p>{FINAL_SELECTION_SUMMARY.scamperReflection}</p>
        </div>

        <div className="rationale-editorial-band__list">
          {FINAL_SELECTION_SUMMARY.reasoning.map((item) => (
            <div key={item.code} className="rationale-point">
              <span className="rationale-point__num mono">{item.code}</span>
              <div>
                <strong>{item.label}</strong>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CriticalAnalysisServer() {
  return (
    <section
      id="analisis"
      className="editorial-section"
      aria-labelledby="critical-analysis-heading"
    >
      <div className="section-header">
        <div>
          <p className="section-kicker">Evaluasi &amp; Tindak Lanjut</p>
          <h2 id="critical-analysis-heading" className="section-title">
            Analisis Penerapan ke Tahap Prototipe
          </h2>
          <p className="section-lead">
            Lima catatan penting yang memisahkan data tertulis dari dokumen LKPD 3–5 dengan hal yang perlu disiapkan saat membuat prototipe.
          </p>
        </div>
      </div>

      <ol className="analysis-editorial-list">
        {CRITICAL_ANALYSIS_ITEMS.map((item, idx) => (
          <li key={item.id} className="analysis-row">
            <div className="analysis-row__left">
              <span className="analysis-row__index mono">0{idx + 1}</span>
              <div>
                <span className="analysis-row__tag">{item.categoryLabel}</span>
                <h3 className="analysis-row__title">{item.title}</h3>
              </div>
            </div>

            <div className="analysis-row__content">
              <p className="analysis-row__rec">
                <strong>Langkah Prototipe:</strong> {item.recommendation}
              </p>

              <details className="editorial-expandable">
                <summary>Lihat dasar dari dokumen LKPD</summary>
                <div className="editorial-expandable__body">
                  <p>{item.lkpdStatement}</p>
                </div>
              </details>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function EditorialFooterServer() {
  return (
    <footer className="site-footer">
      <div className="workspace-container site-footer__inner">
        <div>
          <strong className="site-footer__brand">
            {LKPD_META.brand} {LKPD_META.version}
          </strong>
          <p className="site-footer__copy">
            {LKPD_META.subject} · Kelas {LKPD_META.className} ({LKPD_META.semester})
          </p>
        </div>
        <div className="site-footer__team">
          <span>Tim: {LKPD_META.teamMembers.join(', ')}</span>
          <span>Data tersimpan secara lokal di browser perangkat ini</span>
        </div>
      </div>
    </footer>
  );
}
