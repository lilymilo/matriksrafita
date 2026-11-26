'use client';

import React, { useMemo } from 'react';
import { QUADRANTS, QUADRANT_IDS } from '@/lib/data/lkpd-data';
import { getTotalScore, groupIdeasByQuadrant } from '@/lib/domain/matrix-math';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import { Icon } from '@/components/ui/Icons';

export function QuadrantCardsView() {
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const selectedIdeaId = useWorkspaceSelector((s) => s.selectedIdeaId);

  const grouped = useMemo(() => groupIdeasByQuadrant(ideas), [ideas]);

  return (
    <div className="stage-panel">
      <div className="stage-panel__toolbar">
        <div>
          <h3 className="stage-panel__title">Kartu Kuadran (Ringkasan 4 Kelompok)</h3>
          <p className="stage-panel__subtitle">
            Pengelompokan seluruh ide ke dalam empat kuadran. Klik kartu ide untuk membaca rincian dan alasannya.
          </p>
        </div>
      </div>

      <div className="quad-cards-grid">
        {QUADRANT_IDS.map((qId) => {
          const q = QUADRANTS[qId];
          const items = grouped[qId];

          return (
            <section key={qId} className="quad-group-box" aria-label={`Kuadran ${q.roman} ${q.name}`}>
              <header className="quad-group-box__head">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`q-dot q-dot--${q.colorKey}`} />
                    <h4 className="quad-group-box__title">
                      Kuadran {q.roman} · {q.name}
                    </h4>
                  </div>
                  <span className="mono quad-group-box__count">{items.length} ide</span>
                </div>
                <p className="quad-group-box__desc">
                  <strong className="mono">{q.shortDesc}</strong> — {q.detailDesc}
                </p>
              </header>

              <div className="quad-group-box__items">
                {items.length === 0 ? (
                  <p style={{ margin: '12px 6px', fontSize: '0.94rem', color: 'var(--ink-muted)' }}>
                    Belum ada ide di kuadran ini.
                  </p>
                ) : (
                  items.map((idea) => {
                    const total = getTotalScore(idea.feasibility, idea.impact);
                    const isSelected = idea.id === selectedIdeaId;
                    return (
                      <button
                        key={idea.id}
                        type="button"
                        className={`quad-compact-card ${isSelected ? 'is-selected' : ''} ${
                          idea.isOriginalFinalSelection ? 'is-trio-card' : ''
                        }`}
                        onClick={() => workspaceActions.selectIdea(idea.id, true)}
                        aria-pressed={isSelected}
                      >
                        <div className="quad-compact-card__top">
                          <span className="mono" style={{ fontWeight: 700 }}>
                            Ide #{idea.id}
                          </span>
                          <strong className="mono">
                            Kelayakan {idea.feasibility}/5 · Dampak {idea.impact}/5 · Total {total}/10
                          </strong>
                        </div>
                        {idea.isOriginalFinalSelection && idea.conceptName && (
                          <div className="trio-badge" style={{ marginBottom: '8px' }}>
                            <Icon name="star" size={13} />
                            <span>Ide Terpilih · {idea.conceptName}</span>
                          </div>
                        )}
                        <div className="quad-compact-card__title">{idea.name}</div>
                        <div className="quad-compact-card__benefit">{idea.sellerBenefit}</div>
                      </button>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
