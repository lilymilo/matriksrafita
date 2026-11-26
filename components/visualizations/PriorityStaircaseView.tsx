'use client';

import React, { useMemo } from 'react';
import { computePriorityStaircase } from '@/lib/domain/matrix-math';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import { Icon } from '@/components/ui/Icons';

export function PriorityStaircaseView() {
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const selectedIdeaId = useWorkspaceSelector((s) => s.selectedIdeaId);

  const steps = useMemo(() => computePriorityStaircase(ideas), [ideas]);

  return (
    <div className="stage-panel">
      <div className="stage-panel__toolbar">
        <div>
          <h3 className="stage-panel__title">Tangga Prioritas (Urutan dari Puncak)</h3>
          <p className="stage-panel__subtitle">
            Ide dengan total skor tertinggi berada di paling atas. Ide yang memiliki skor seri berbagi anak tangga yang sama.
          </p>
        </div>
      </div>

      <div className="staircase-wrap">
        {steps.map((step, index) => {
          const widthPercent = Math.max(82, 100 - index * 3.5);
          return (
            <div key={step.totalScore} className="stair-step-row">
              <div className={`stair-riser ${index === 0 ? 'stair-riser--top' : ''}`}>
                <span className="stair-riser__rank">
                  Peringkat #{step.rank}
                  {step.isTied ? ' (Seri)' : ''}
                </span>
                <div>
                  <div className="stair-riser__score mono">
                    {step.totalScore}
                    <small>/10</small>
                  </div>
                  <div className="stair-riser__label">Total Skor</div>
                </div>
              </div>

              <div className="stair-platform" style={{ maxWidth: `${widthPercent}%` }}>
                <div className="stair-ideas-grid">
                  {step.items.map(({ idea, quadrant }) => {
                    const isSelected = idea.id === selectedIdeaId;
                    return (
                      <button
                        key={idea.id}
                        type="button"
                        className={`stair-card ${isSelected ? 'is-selected' : ''} ${
                          idea.isOriginalFinalSelection ? 'is-trio-card' : ''
                        }`}
                        onClick={() => workspaceActions.selectIdea(idea.id, true)}
                        aria-pressed={isSelected}
                      >
                        <div className="stair-card__top">
                          <span className="mono" style={{ fontWeight: 700 }}>
                            Ide #{idea.id}
                          </span>
                          <span className="quad-inline-badge">
                            <span className={`q-dot q-dot--${quadrant.colorKey}`} />
                            <span>{quadrant.name}</span>
                          </span>
                        </div>

                        {idea.isOriginalFinalSelection && idea.conceptName && (
                          <div className="trio-badge">
                            <Icon name="star" size={13} />
                            <span>Ide Terpilih · {idea.conceptName}</span>
                          </div>
                        )}

                        <strong className="stair-card__title">{idea.name}</strong>

                        <div className="stair-DualIndicators">
                          <div className="stair-meter-col">
                            <div className="stair-meter-head">
                              <span>Kelayakan</span>
                              <strong className="mono">{idea.feasibility}/5</strong>
                            </div>
                            <div className="mini-meter-track" aria-hidden="true">
                              <span
                                className="mini-meter-fill mini-meter-fill--f"
                                style={{ width: `${(idea.feasibility / 5) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="stair-meter-col">
                            <div className="stair-meter-head">
                              <span>Dampak</span>
                              <strong className="mono text-mint">{idea.impact}/5</strong>
                            </div>
                            <div className="mini-meter-track" aria-hidden="true">
                              <span
                                className="mini-meter-fill mini-meter-fill--i"
                                style={{ width: `${(idea.impact / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
