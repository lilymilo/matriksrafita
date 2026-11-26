'use client';

import React, { useEffect } from 'react';
import { QUADRANTS, QUADRANT_IDS } from '@/lib/data/lkpd-data';
import {
  getQuadrantId,
  getQuadrantMeta,
  getScoreLevelMeta,
  getTotalScore,
} from '@/lib/domain/matrix-math';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import { Icon } from '@/components/ui/Icons';

const SCORE_STEPS = [1, 2, 3, 4, 5] as const;

export function IdeaInspectorPanel() {
  const inspectorOpen = useWorkspaceSelector((s) => s.inspectorOpen);
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const selectedIdeaId = useWorkspaceSelector((s) => s.selectedIdeaId);
  const hiddenCount = useWorkspaceSelector((s) => s.payload.hiddenLkpdIds.length);

  useEffect(() => {
    if (!inspectorOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        workspaceActions.closeInspector();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inspectorOpen]);

  if (!inspectorOpen) return null;

  const idea = ideas.find((item) => item.id === selectedIdeaId) ?? ideas[0];

  if (!idea) {
    return (
      <div
        className="drawer-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="Detail Ide"
        onClick={(e) => {
          if (e.target === e.currentTarget) workspaceActions.closeInspector();
        }}
      >
        <aside className="drawer-panel">
          <div className="drawer-panel__head">
            <h2 className="drawer-panel__title">Detail Ide</h2>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => workspaceActions.closeInspector()}
            >
              <Icon name="close" size={16} />
              <span>Tutup</span>
            </button>
          </div>
          <div className="drawer-panel__body">
            <p style={{ margin: 0 }}>
              Belum ada ide yang ditampilkan. Pulihkan data awal LKPD 5 atau tambahkan ide baru.
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => workspaceActions.restoreLkpdData(true)}
            >
              Pulihkan 10 Ide Awal LKPD
            </button>
          </div>
        </aside>
      </div>
    );
  }

  const quadrant = getQuadrantMeta(idea.feasibility, idea.impact);
  const currentQuadId = getQuadrantId(idea.feasibility, idea.impact);
  const origQuad = getQuadrantMeta(idea.originalFeasibility, idea.originalImpact);
  const total = getTotalScore(idea.feasibility, idea.impact);
  const origTotal = getTotalScore(idea.originalFeasibility, idea.originalImpact);
  const fLevel = getScoreLevelMeta(idea.feasibility);
  const iLevel = getScoreLevelMeta(idea.impact);

  return (
    <div
      className="drawer-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) workspaceActions.closeInspector();
      }}
    >
      <aside className="drawer-panel" aria-label="Panel Detail Ide">
        <div className="drawer-panel__head">
          <div>
            <div className="drawer-panel__meta">
              <span className="mono" style={{ fontWeight: 700 }}>
                Ide #{idea.id}
              </span>
              <span>·</span>
              <span>{idea.scamper}</span>
            </div>

            {idea.isOriginalFinalSelection && idea.conceptName && (
              <div className="trio-badge" style={{ marginTop: '8px' }}>
                <Icon name="star" size={13} />
                <span>Ide Terpilih LKPD · {idea.conceptName}</span>
              </div>
            )}

            <h2 id="inspector-drawer-title" className="drawer-panel__title">
              {idea.name}
            </h2>
          </div>

          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => workspaceActions.closeInspector()}
            aria-label="Tutup panel detail"
          >
            <Icon name="close" size={16} />
            <span>Tutup</span>
          </button>
        </div>

        <div className="drawer-panel__body">
          <div className="inspector-actions-row">
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => workspaceActions.openEditModal(idea.id)}
            >
              <Icon name="edit" size={15} />
              <span>Edit Ide</span>
            </button>

            {idea.origin === 'lkpd' && idea.isModified && (
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => workspaceActions.resetSingleIdea(idea.id)}
              >
                <Icon name="reset" size={15} />
                <span>Kembalikan Skor Asli</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn--danger-outline btn--sm"
              onClick={() => workspaceActions.requestDeleteIdea(idea.id)}
            >
              <Icon name="trash" size={15} />
              <span>Hapus</span>
            </button>
          </div>

          <div className="inspector-score-card">
            <div className="inspector-score-grid">
              <div className="inspector-score-cell">
                <span className="inspector-score-label">Kelayakan</span>
                <strong className="inspector-score-val mono">
                  {idea.feasibility}
                  <small>/5</small>
                </strong>
                <span className="inspector-score-level">{fLevel.summary}</span>
              </div>

              <div className="inspector-score-cell">
                <span className="inspector-score-label">Dampak</span>
                <strong className="inspector-score-val mono text-mint">
                  {idea.impact}
                  <small>/5</small>
                </strong>
                <span className="inspector-score-level">{iLevel.summary}</span>
              </div>

              <div className="inspector-score-cell">
                <span className="inspector-score-label">Total Skor</span>
                <strong className="inspector-score-val mono">
                  {total}
                  <small>/10</small>
                </strong>
                <span className="inspector-score-level">Kuadran {quadrant.roman}</span>
              </div>
            </div>

            <div className="inspector-quad-banner">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <span className={`q-dot q-dot--${quadrant.colorKey}`} />
                <span>
                  Kuadran {quadrant.roman} · {quadrant.name}
                </span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.94rem', color: 'var(--ink-secondary)' }}>
                {quadrant.detailDesc}
              </p>
            </div>

            {idea.origin === 'lkpd' && idea.isScoreSimulated && (
              <div className="inspector-sim-diff">
                <div>
                  Skor asli LKPD: Kelayakan {idea.originalFeasibility}/5, Dampak {idea.originalImpact}/5 (Total {origTotal}/10 · {origQuad.name})
                </div>
                <div style={{ color: 'var(--accent)', fontWeight: 700, marginTop: '4px' }}>
                  Skor simulasi saat ini: Kelayakan {idea.feasibility}/5, Dampak {idea.impact}/5 (Total {total}/10 · {quadrant.name})
                </div>
              </div>
            )}
          </div>

          <div className="inspector-details-blocks">
            <div className="inspector-detail-item">
              <h3 className="inspector-detail-heading">Deskripsi Ide</h3>
              <p>{idea.description}</p>
            </div>

            <div className="inspector-detail-item">
              <h3 className="inspector-detail-heading">Alasan Pemilihan &amp; Penilaian</h3>
              <p>{idea.rationale}</p>
            </div>

            <div className="inspector-benefits-grid">
              <div className="inspector-detail-item">
                <h3 className="inspector-detail-heading">Manfaat bagi Penjual / Admin</h3>
                <p>{idea.sellerBenefit}</p>
              </div>

              <div className="inspector-detail-item">
                <h3 className="inspector-detail-heading">Manfaat bagi Pembeli</h3>
                <p>{idea.buyerBenefit}</p>
              </div>
            </div>

            {idea.quadrantDiscrepancyNote && (
              <div className="callout-box" role="note">
                <strong>Catatan Perbedaan Label Ide #10:</strong> {idea.quadrantDiscrepancyNote}
              </div>
            )}
          </div>

          <div className="inspector-sim-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '8px' }}>
              <h3 className="inspector-detail-heading" style={{ margin: 0 }}>
                Simulasi Perubahan Skor
              </h3>
              {hiddenCount > 0 && (
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => workspaceActions.restoreLkpdData(true)}
                >
                  Pulihkan ({hiddenCount})
                </button>
              )}
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.94rem', marginBottom: '6px' }}>
                <label htmlFor="sim-feasibility-slider" style={{ fontWeight: 600 }}>
                  Kelayakan (Kemudahan Dikerjakan)
                </label>
                <span className="mono" style={{ fontWeight: 700 }}>
                  {idea.feasibility}/5 ({fLevel.summary})
                </span>
              </div>
              <input
                id="sim-feasibility-slider"
                type="range"
                min={1}
                max={5}
                step={1}
                value={idea.feasibility}
                onChange={(e) =>
                  workspaceActions.updateScore(idea.id, Number(e.target.value), idea.impact, 'slider')
                }
                className="range-slider"
              />
              <div className="step-buttons-row">
                {SCORE_STEPS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`step-btn mono ${idea.feasibility === n ? 'is-active' : ''}`}
                    onClick={() => workspaceActions.updateScore(idea.id, n, idea.impact, 'slider')}
                    aria-label={`Ubah Kelayakan ke ${n}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.94rem', marginBottom: '6px' }}>
                <label htmlFor="sim-impact-slider" style={{ fontWeight: 600 }}>
                  Dampak (Besarnya Manfaat)
                </label>
                <span className="mono text-mint" style={{ fontWeight: 700 }}>
                  {idea.impact}/5 ({iLevel.summary})
                </span>
              </div>
              <input
                id="sim-impact-slider"
                type="range"
                min={1}
                max={5}
                step={1}
                value={idea.impact}
                onChange={(e) =>
                  workspaceActions.updateScore(idea.id, idea.feasibility, Number(e.target.value), 'slider')
                }
                className="range-slider"
              />
              <div className="step-buttons-row">
                {SCORE_STEPS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`step-btn mono ${idea.impact === n ? 'is-active' : ''}`}
                    onClick={() => workspaceActions.updateScore(idea.id, idea.feasibility, n, 'slider')}
                    aria-label={`Ubah Dampak ke ${n}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="inspector-detail-heading" style={{ display: 'block', marginBottom: '8px' }}>
                Pindah Cepat ke Kuadran Lain
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {QUADRANT_IDS.map((qId) => {
                  const q = QUADRANTS[qId];
                  const active = currentQuadId === qId;
                  return (
                    <button
                      key={qId}
                      type="button"
                      className={`btn btn--sm ${active ? 'btn--primary' : 'btn--outline'}`}
                      style={{ justifyContent: 'flex-start' }}
                      onClick={() => workspaceActions.moveIdeaToQuadrant(idea.id, qId, null, 'quadrant-move')}
                    >
                      <span className={`q-dot q-dot--${q.colorKey}`} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {q.roman} · {q.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
