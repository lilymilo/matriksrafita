'use client';

import React, { useEffect } from 'react';
import {
  CRITICAL_ANALYSIS_ITEMS,
  FINAL_SELECTION_SUMMARY,
  LKPD_META,
} from '@/lib/data/lkpd-data';
import { createEmptyPersistencePayload, materializeIdeas } from '@/lib/domain/crud';
import {
  computeSummaryStats,
  getQuadrantMeta,
  getTotalScore,
} from '@/lib/domain/matrix-math';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import { Map2x2View } from '@/components/visualizations/Map2x2View';
import { Icon } from '@/components/ui/Icons';

const SLIDES = [
  { id: 0, code: '1', title: 'Masalah & Ringkasan' },
  { id: 1, code: '2', title: 'Peta Prioritas 2×2' },
  { id: 2, code: '3', title: '3 Ide Terpilih' },
  { id: 3, code: '4', title: 'Catatan Penerapan' },
] as const;

const canonicalIdeas = materializeIdeas(createEmptyPersistencePayload());

export function PresentationModal() {
  const presentation = useWorkspaceSelector((s) => s.presentation);
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const hiddenCount = useWorkspaceSelector((s) => s.payload.hiddenLkpdIds.length);

  const statsSim = computeSummaryStats(ideas, hiddenCount);
  const activeIdeas = presentation.useSimulatedData ? ideas : canonicalIdeas;
  const stats = computeSummaryStats(activeIdeas, 0);

  useEffect(() => {
    if (!presentation.open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') workspaceActions.closePresentation();
      else if (e.key === 'ArrowRight') {
        workspaceActions.setPresentationSlide(Math.min(3, presentation.slide + 1));
      } else if (e.key === 'ArrowLeft') {
        workspaceActions.setPresentationSlide(Math.max(0, presentation.slide - 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [presentation.open, presentation.slide]);

  if (!presentation.open) return null;

  const focused =
    activeIdeas.find((i) => i.id === presentation.focusedIdeaId) ?? activeIdeas[0];

  return (
    <div
      className="pres-fullscreen"
      role="dialog"
      aria-modal="true"
      aria-label="Mode Presentasi IdeaQuest"
    >
      <header className="pres-fullscreen__top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <strong style={{ fontSize: '1.05rem' }}>IdeaQuest · Mode Presentasi</strong>
          <span className="status-rule">
            {presentation.useSimulatedData ? 'Data Simulasi' : 'Data Asli LKPD 5'}
          </span>
          {statsSim.hasSimulatedChanges && (
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() =>
                workspaceActions.togglePresentationSource(!presentation.useSimulatedData)
              }
            >
              {presentation.useSimulatedData
                ? 'Tampilkan Data Asli'
                : 'Tampilkan Hasil Simulasi'}
            </button>
          )}
        </div>

        <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} aria-label="Slide presentasi">
          {SLIDES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`btn btn--sm ${presentation.slide === s.id ? 'btn--primary' : 'btn--outline'}`}
              onClick={() => workspaceActions.setPresentationSlide(s.id)}
            >
              <span className="mono">{s.code}.</span>
              <span>{s.title}</span>
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => window.print()}
          >
            <Icon name="printer" size={15} />
            <span>Cetak / PDF</span>
          </button>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => workspaceActions.closePresentation()}
          >
            <Icon name="close" size={15} />
            <span>Tutup</span>
          </button>
        </div>
      </header>

      <div className="pres-fullscreen__body">
        {presentation.slide === 0 && (
          <div className="hero-editorial__grid" style={{ alignItems: 'start' }}>
            <div>
              <p className="section-kicker">LKPD 5 · Penilaian Prioritas Ide</p>
              <h2 className="hero-title" style={{ marginTop: '10px' }}>
                {LKPD_META.heroHeadline}
              </h2>
              <p className="hero-lead" style={{ marginBottom: '24px' }}>
                {LKPD_META.heroLead}
              </p>

              <div className="stage-panel" style={{ padding: '24px' }}>
                <p className="section-kicker" style={{ marginBottom: '8px' }}>
                  Masalah Utama — {LKPD_META.persona.name}
                </p>
                <p style={{ margin: '0 0 14px', fontSize: '1.04rem', lineHeight: 1.65 }}>
                  {LKPD_META.persona.pov}
                </p>
                <p style={{ margin: 0, fontSize: '1rem', color: 'var(--ink-secondary)', lineHeight: 1.65 }}>
                  <strong>Pertanyaan Utama:</strong> {LKPD_META.persona.hmw}
                </p>
              </div>
            </div>

            <div className="stage-panel" style={{ padding: '26px' }}>
              <p className="section-kicker" style={{ marginBottom: '16px' }}>
                Ringkasan Angka
              </p>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <strong className="mono" style={{ fontSize: '2.2rem' }}>
                    {stats.totalIdeas} Ide
                  </strong>
                  <div style={{ color: 'var(--ink-secondary)', fontSize: '1rem' }}>
                    Total ide solusi yang dinilai
                  </div>
                </div>
                <div>
                  <strong className="mono text-mint" style={{ fontSize: '2.2rem' }}>
                    {stats.priorityCount} Ide
                  </strong>
                  <div style={{ color: 'var(--ink-secondary)', fontSize: '1rem' }}>
                    Masuk Kuadran Prioritas Utama (Kelayakan 4–5, Dampak 4–5)
                  </div>
                </div>
                <div>
                  <strong className="mono" style={{ fontSize: '2.2rem' }}>
                    {stats.averageTotalFormatted}/10
                  </strong>
                  <div style={{ color: 'var(--ink-secondary)', fontSize: '1rem' }}>
                    Rata-rata total skor seluruh ide
                  </div>
                </div>
              </div>
              <p style={{ marginTop: '24px', fontSize: '0.92rem', color: 'var(--ink-secondary)' }}>
                Kelas {LKPD_META.className}: {LKPD_META.teamMembers.join(', ')}
              </p>
            </div>
          </div>
        )}

        {presentation.slide === 1 && focused && (
          <div className="studio-workspace-grid">
            <Map2x2View
              ideasOverride={activeIdeas}
              selectedIdOverride={focused.id}
              onSelectOverride={(id) => workspaceActions.setPresentationFocusIdea(id)}
              readOnly
            />
            <aside className="stage-panel" style={{ padding: '24px' }}>
              <p className="section-kicker" style={{ marginBottom: '6px' }}>
                Ide #{focused.id} · {focused.scamper}
              </p>
              <h3 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>{focused.name}</h3>
              <div className="mono" style={{ marginBottom: '16px', fontWeight: 700, fontSize: '0.96rem' }}>
                Kelayakan {focused.feasibility}/5 · Dampak {focused.impact}/5 · Total{' '}
                {getTotalScore(focused.feasibility, focused.impact)}/10 (
                {getQuadrantMeta(focused.feasibility, focused.impact).name})
              </div>
              <p style={{ fontSize: '0.98rem', color: 'var(--ink-secondary)', lineHeight: 1.65 }}>
                <strong>Deskripsi:</strong> {focused.description}
              </p>
              <p style={{ fontSize: '0.98rem', color: 'var(--ink-secondary)', lineHeight: 1.65 }}>
                <strong>Manfaat Penjual:</strong> {focused.sellerBenefit}
              </p>
              <p style={{ fontSize: '0.98rem', color: 'var(--ink-secondary)', lineHeight: 1.65 }}>
                <strong>Alasan Pemilihan:</strong> {focused.rationale}
              </p>
              {focused.quadrantDiscrepancyNote && (
                <div className="callout-box">{focused.quadrantDiscrepancyNote}</div>
              )}
            </aside>
          </div>
        )}

        {presentation.slide === 2 && (
          <div>
            <div className="trio-editorial-grid">
              {canonicalIdeas
                .filter((i) => i.isOriginalFinalSelection)
                .map((idea, idx) => (
                  <article key={idea.id} className="trio-column">
                    <div className="trio-column__top">
                      <span>Pilihan {idx + 1} · Ide #{idea.id}</span>
                      <strong className="mono text-mint">
                        Total {idea.originalFeasibility + idea.originalImpact}/10
                      </strong>
                    </div>
                    <h3 className="trio-column__concept">{idea.conceptName}</h3>
                    <p className="trio-column__origin">{idea.name}</p>
                    <div className="trio-score-pills mono">
                      <span>Kelayakan: <strong>{idea.originalFeasibility}/5</strong></span>
                      <span>Dampak: <strong className="text-mint">{idea.originalImpact}/5</strong></span>
                    </div>
                    <p className="trio-column__summary">{idea.sellerBenefit}</p>
                    <p className="trio-column__summary">
                      <strong>Alasan:</strong> {idea.rationale}
                    </p>
                  </article>
                ))}
            </div>
            <div className="rationale-editorial-band">
              <div className="rationale-editorial-band__intro">
                <p className="section-kicker">Kesimpulan Kelompok</p>
                <h3>Alasan pemilihan tiga konsep utama</h3>
                <p>{FINAL_SELECTION_SUMMARY.scamperReflection}</p>
              </div>
              <div className="rationale-editorial-band__list">
                {FINAL_SELECTION_SUMMARY.reasoning.map((r) => (
                  <div key={r.code} className="rationale-point">
                    <span className="rationale-point__num mono">{r.code}</span>
                    <div>
                      <strong>{r.label}</strong>
                      <p>{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {presentation.slide === 3 && (
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
                  <p style={{ margin: '8px 0 0', fontSize: '0.96rem', color: 'var(--ink-secondary)' }}>
                    <strong>Dasar LKPD:</strong> {item.lkpdStatement}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <footer className="pres-fullscreen__foot">
        <button
          type="button"
          className="btn btn--outline"
          disabled={presentation.slide === 0}
          onClick={() => workspaceActions.setPresentationSlide(presentation.slide - 1)}
        >
          <Icon name="arrowLeft" size={16} />
          <span>Sebelumnya</span>
        </button>

        <span style={{ fontSize: '0.94rem', color: 'var(--ink-secondary)', fontWeight: 500 }}>
          Slide {presentation.slide + 1} dari {SLIDES.length} · Gunakan panah kiri/kanan atau tombol Esc untuk keluar
        </span>

        <button
          type="button"
          className="btn btn--primary"
          disabled={presentation.slide === SLIDES.length - 1}
          onClick={() => workspaceActions.setPresentationSlide(presentation.slide + 1)}
        >
          <span>Berikutnya</span>
          <Icon name="arrowRight" size={16} />
        </button>
      </footer>
    </div>
  );
}
