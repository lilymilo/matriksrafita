'use client';

import React, { useMemo, useRef, useState } from 'react';
import { QUADRANTS, QUADRANT_IDS } from '@/lib/data/lkpd-data';
import { getTotalScore, groupIdeasByQuadrant } from '@/lib/domain/matrix-math';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import type { QuadrantId } from '@/types/idea';
import { Icon } from '@/components/ui/Icons';

export function PriorityBoardView() {
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const selectedIdeaId = useWorkspaceSelector((s) => s.selectedIdeaId);

  const grouped = useMemo(() => groupIdeasByQuadrant(ideas), [ideas]);
  const draggedIdRef = useRef<number | null>(null);
  const [dropQuad, setDropQuad] = useState<QuadrantId | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetQuad: QuadrantId) => {
    e.preventDefault();
    setDropQuad(null);
    const transferred = Number(e.dataTransfer.getData('text/plain'));
    const ideaId = draggedIdRef.current ?? transferred;
    draggedIdRef.current = null;
    if (!ideaId || Number.isNaN(ideaId)) return;

    workspaceActions.moveIdeaToQuadrant(ideaId, targetQuad, null, 'drag');
  };

  return (
    <div className="stage-panel">
      <div className="stage-panel__toolbar">
        <div>
          <h3 className="stage-panel__title">Papan Prioritas (Geser untuk Simulasi)</h3>
          <p className="stage-panel__subtitle">
            Seret kartu ide ke kolom kuadran lain untuk mencoba perubahan prioritas. Klik kartu untuk membuka detailnya.
          </p>
        </div>
      </div>

      <div className="board-columns-grid">
        {QUADRANT_IDS.map((qId) => {
          const q = QUADRANTS[qId];
          const items = grouped[qId];
          const isOver = dropQuad === qId;

          return (
            <div
              key={qId}
              className={`board-col ${isOver ? 'is-drop-over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                if (dropQuad !== qId) setDropQuad(qId);
              }}
              onDragLeave={() => {
                if (dropQuad === qId) setDropQuad(null);
              }}
              onDrop={(e) => handleDrop(e, qId)}
            >
              <div className="board-col__head">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '1rem' }}>
                    <span className={`q-dot q-dot--${q.colorKey}`} />
                    <span>{q.name}</span>
                  </strong>
                  <span className="mono" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    {items.length}
                  </span>
                </div>
                <div className="board-col__rule mono">{q.shortDesc}</div>
              </div>

              <div className="board-col__body">
                {items.length === 0 ? (
                  <div className="board-col__empty">
                    Lepas kartu ide di kolom ini untuk simulasi
                  </div>
                ) : (
                  items.map((idea) => {
                    const total = getTotalScore(idea.feasibility, idea.impact);
                    const isSelected = idea.id === selectedIdeaId;
                    return (
                      <div
                        key={idea.id}
                        draggable
                        onDragStart={(e) => {
                          draggedIdRef.current = idea.id;
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('text/plain', String(idea.id));
                        }}
                        onDragEnd={() => {
                          draggedIdRef.current = null;
                          setDropQuad(null);
                        }}
                        onClick={() => workspaceActions.selectIdea(idea.id, true)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            workspaceActions.selectIdea(idea.id, true);
                          }
                        }}
                        className={`board-card ${isSelected ? 'is-selected' : ''} ${
                          idea.isOriginalFinalSelection ? 'is-trio-card' : ''
                        }`}
                      >
                        <div className="board-card__top">
                          <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                            <Icon name="grip" size={14} />
                            <span>#{idea.id}</span>
                          </span>
                          <strong className="mono">Total {total}/10</strong>
                        </div>
                        {idea.isOriginalFinalSelection && idea.conceptName && (
                          <div className="trio-badge" style={{ marginBottom: '6px' }}>
                            <Icon name="star" size={12} />
                            <span>{idea.conceptName}</span>
                          </div>
                        )}
                        <div className="board-card__title">{idea.shortLabel}</div>
                        <div className="board-card__meta mono">
                          Kelayakan {idea.feasibility}/5 · Dampak {idea.impact}/5
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
