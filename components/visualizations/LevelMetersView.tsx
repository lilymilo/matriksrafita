'use client';

import React from 'react';
import { SCORE_LEVEL_LABELS } from '@/lib/data/lkpd-data';
import {
  getQuadrantMeta,
  getScoreLevelMeta,
  getTotalScore,
} from '@/lib/domain/matrix-math';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import { Icon } from '@/components/ui/Icons';

const FIVE_LEVELS = [1, 2, 3, 4, 5] as const;

export function LevelMetersView() {
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const selectedIdeaId = useWorkspaceSelector((s) => s.selectedIdeaId);

  return (
    <div className="stage-panel">
      <div className="stage-panel__toolbar">
        <div>
          <h3 className="stage-panel__title">Level Kelayakan dan Dampak (Skala 1–5)</h3>
          <p className="stage-panel__subtitle">
            Setiap ide dinilai dengan dua indikator sederhana dari Level 1 (Sangat Rendah) hingga Level 5 (Sangat Tinggi).
          </p>
        </div>
      </div>

      <div className="levels-legend-bar" aria-label="Panduan arti Level 1 sampai 5">
        {FIVE_LEVELS.map((num) => (
          <div key={num} className="levels-legend-cell">
            <strong className="mono">
              Level {num} ({num}/5)
            </strong>
            <span>{SCORE_LEVEL_LABELS[num].summary}</span>
          </div>
        ))}
      </div>

      <div className="levels-list">
        {ideas.map((idea) => {
          const q = getQuadrantMeta(idea.feasibility, idea.impact);
          const total = getTotalScore(idea.feasibility, idea.impact);
          const fMeta = getScoreLevelMeta(idea.feasibility);
          const iMeta = getScoreLevelMeta(idea.impact);
          const isSelected = idea.id === selectedIdeaId;

          return (
            <button
              key={idea.id}
              type="button"
              className={`level-idea-row ${isSelected ? 'is-selected' : ''} ${
                idea.isOriginalFinalSelection ? 'is-trio-card' : ''
              }`}
              onClick={() => workspaceActions.selectIdea(idea.id, true)}
              aria-pressed={isSelected}
            >
              <div className="level-idea-row__head">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span className="mono" style={{ fontWeight: 700, color: 'var(--ink-secondary)' }}>
                      Ide #{idea.id}
                    </span>
                    {idea.isOriginalFinalSelection && idea.conceptName && (
                      <span className="trio-badge">
                        <Icon name="star" size={13} />
                        <span>Ide Terpilih · {idea.conceptName}</span>
                      </span>
                    )}
                  </div>
                  <div className="level-idea-row__title">{idea.name}</div>
                </div>

                <div className="level-idea-row__summary">
                  <span className="quad-inline-badge">
                    <span className={`q-dot q-dot--${q.colorKey}`} />
                    <span>{q.name}</span>
                  </span>
                  <strong className="level-total-pill mono">Total {total}/10</strong>
                </div>
              </div>

              <div className="level-meters-pair">
                <div className="level-meter-card">
                  <div className="level-meter-box__question">
                    <span>Seberapa mudah ide direalisasikan?</span>
                    <strong className="mono level-score-badge">
                      {idea.feasibility}/5 · {fMeta.summary}
                    </strong>
                  </div>
                  <div className="level-segments" aria-hidden="true">
                    {FIVE_LEVELS.map((step) => (
                      <span
                        key={step}
                        className={`level-seg ${step <= idea.feasibility ? 'is-filled-f' : ''}`}
                      />
                    ))}
                  </div>
                  <div className="level-meter-box__caption">
                    Kelayakan: <strong>Level {idea.feasibility} ({fMeta.summary})</strong>
                  </div>
                </div>

                <div className="level-meter-card">
                  <div className="level-meter-box__question">
                    <span>Seberapa besar dampak ide tersebut?</span>
                    <strong className="mono level-score-badge text-mint">
                      {idea.impact}/5 · {iMeta.summary}
                    </strong>
                  </div>
                  <div className="level-segments" aria-hidden="true">
                    {FIVE_LEVELS.map((step) => (
                      <span
                        key={step}
                        className={`level-seg ${step <= idea.impact ? 'is-filled-i' : ''}`}
                      />
                    ))}
                  </div>
                  <div className="level-meter-box__caption">
                    Dampak: <strong className="text-mint">Level {idea.impact} ({iMeta.summary})</strong>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
