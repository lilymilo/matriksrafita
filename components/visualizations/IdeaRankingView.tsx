'use client';

import React, { useMemo } from 'react';
import { computeScoreRanking } from '@/lib/domain/matrix-math';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import { Icon } from '@/components/ui/Icons';

export function IdeaRankingView() {
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const selectedIdeaId = useWorkspaceSelector((s) => s.selectedIdeaId);

  const ranked = useMemo(() => computeScoreRanking(ideas), [ideas]);

  return (
    <div className="stage-panel">
      <div className="stage-panel__toolbar">
        <div>
          <h3 className="stage-panel__title">Peringkat Ide Berdasarkan Total Skor</h3>
          <p className="stage-panel__subtitle">
            Urutan dari penjumlahan Kelayakan + Dampak. Ide dengan skor yang sama tetap menempati peringkat seri.
          </p>
        </div>
        <div className="ranking-legend">
          <span>
            <span className="q-dot" style={{ background: 'var(--ink-primary)' }} /> Kelayakan
          </span>
          <span>
            <span className="q-dot q-dot--mint" /> Dampak
          </span>
        </div>
      </div>

      <div className="ranking-list-wrap">
        {ranked.map(({ idea, total, quadrant, rank, isTied }) => {
          const isSelected = idea.id === selectedIdeaId;
          const fPct = (idea.feasibility / 10) * 100;
          const iPct = (idea.impact / 10) * 100;

          return (
            <button
              key={idea.id}
              type="button"
              className={`ranking-item-btn ${isSelected ? 'is-selected' : ''} ${
                idea.isOriginalFinalSelection ? 'is-trio-card' : ''
              }`}
              onClick={() => workspaceActions.selectIdea(idea.id, true)}
              aria-pressed={isSelected}
            >
              <div className="ranking-rank-col mono">
                <strong className="ranking-rank-num">#{rank}</strong>
                {isTied && <span className="ranking-tie-label">Seri</span>}
              </div>

              <div>
                <div className="ranking-title-row">
                  <span className="mono ranking-idea-id">Ide #{idea.id}</span>
                  <strong className="ranking-idea-name">{idea.name}</strong>
                  {idea.isOriginalFinalSelection && idea.conceptName && (
                    <span className="trio-badge">
                      <Icon name="star" size={13} />
                      <span>Ide Terpilih · {idea.conceptName}</span>
                    </span>
                  )}
                </div>

                <div className="ranking-stacked-bar" aria-hidden="true">
                  <span className="ranking-seg-f" style={{ width: `${fPct}%` }} />
                  <span className="ranking-seg-i" style={{ width: `${iPct}%` }} />
                </div>
              </div>

              <div className="ranking-item-scores mono">
                <div className="ranking-total-val">
                  {total}
                  <small>/10</small>
                </div>
                <div className="ranking-breakdown">
                  Kelayakan {idea.feasibility}/5 · Dampak {idea.impact}/5
                </div>
                <div className="ranking-quad-text">{quadrant.name}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
