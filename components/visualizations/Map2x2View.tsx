'use client';

import React, { useMemo, useRef, useState } from 'react';
import { QUADRANTS } from '@/lib/data/lkpd-data';
import {
  computeMarkerPositions,
  computeSummaryStats,
  getQuadrantMeta,
  getTotalScore,
  scoreToPercentX,
  scoreToPercentY,
  THRESHOLD_X_PERCENT,
  THRESHOLD_Y_PERCENT,
} from '@/lib/domain/matrix-math';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import type { IdeaItem, QuadrantId } from '@/types/idea';

const GRID_TICKS = [1, 2, 3, 4, 5] as const;
const QUAD_RENDER_ORDER: readonly QuadrantId[] = ['III', 'I', 'IV', 'II'] as const;

const QUAD_SHORT_HINT: Record<QuadrantId, string> = {
  I: 'Kerjakan lebih dulu',
  II: 'Fitur pelengkap cepat',
  III: 'Dampak besar, teknis lebih sulit',
  IV: 'Tunda dahulu',
};

interface Map2x2ViewProps {
  ideasOverride?: readonly IdeaItem[];
  selectedIdOverride?: number;
  onSelectOverride?: (id: number) => void;
  readOnly?: boolean;
}

export function Map2x2View({
  ideasOverride,
  selectedIdOverride,
  onSelectOverride,
  readOnly = false,
}: Map2x2ViewProps) {
  const storeIdeas = useWorkspaceSelector((s) => s.ideas);
  const storeSelectedId = useWorkspaceSelector((s) => s.selectedIdeaId);

  const ideas = ideasOverride ?? storeIdeas;
  const selectedIdeaId = selectedIdOverride ?? storeSelectedId;
  const handleSelect = onSelectOverride ?? ((id: number) => workspaceActions.selectIdea(id, true));

  const planeRef = useRef<HTMLDivElement | null>(null);
  const [dragOverQuad, setDragOverQuad] = useState<QuadrantId | null>(null);
  const draggedIdRef = useRef<number | null>(null);

  const stats = useMemo(() => computeSummaryStats(ideas), [ideas]);
  const positions = useMemo(() => computeMarkerPositions(ideas), [ideas]);

  const coincidentGroups = useMemo(() => {
    const groups = new Map<string, IdeaItem[]>();
    for (const idea of ideas) {
      const key = `${idea.feasibility},${idea.impact}`;
      const list = groups.get(key);
      if (list) list.push(idea);
      else groups.set(key, [idea]);
    }
    return [...groups.entries()].filter(([, arr]) => arr.length > 1);
  }, [ideas]);

  const handleDropOnQuadrant = (e: React.DragEvent<HTMLDivElement>, targetQuad: QuadrantId) => {
    if (readOnly) return;
    e.preventDefault();
    setDragOverQuad(null);

    const rawTransfer = e.dataTransfer.getData('text/plain');
    const ideaId = draggedIdRef.current ?? Number(rawTransfer);
    draggedIdRef.current = null;
    if (!ideaId || Number.isNaN(ideaId)) return;

    let dropCoords: { percentX: number; percentY: number } | null = null;
    if (planeRef.current) {
      const rect = planeRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const percentX = ((e.clientX - rect.left) / rect.width) * 100;
        const percentY = ((rect.bottom - e.clientY) / rect.height) * 100;
        dropCoords = { percentX, percentY };
      }
    }

    workspaceActions.moveIdeaToQuadrant(ideaId, targetQuad, dropCoords, 'drag');
  };

  return (
    <div className="stage-panel">
      <div className="stage-panel__toolbar">
        <div>
          <h3 className="stage-panel__title">Peta Prioritas 2×2 (Kelayakan vs Dampak)</h3>
          <p className="stage-panel__subtitle">
            {readOnly
              ? 'Klik salah satu pin untuk melihat rincian ide.'
              : 'Klik pin untuk membaca detail ide, atau seret pin ke kuadran lain untuk mencoba simulasi skor.'}
          </p>
        </div>
      </div>

      <div className="matrix2d-wrap">
        <div className="matrix2d-axis-top">Dampak Tinggi (Skor 4–5)</div>

        <div className="matrix2d-core">
          <div className="matrix2d-y-label" aria-hidden="true">
            Skor Dampak (1 → 5)
          </div>

          <div
            ref={planeRef}
            className="matrix2d-plane"
            role="region"
            aria-label="Bidang Koordinat Kelayakan vs Dampak skala 1 sampai 5"
          >
            <div className="mquad-layer">
              {QUAD_RENDER_ORDER.map((qId) => {
                const q = QUADRANTS[qId];
                return (
                  <div
                    key={qId}
                    className={`mquad-zone mquad-zone--${qId} ${
                      dragOverQuad === qId ? 'is-drop-over' : ''
                    }`}
                    onDragOver={(e) => {
                      if (readOnly) return;
                      e.preventDefault();
                      if (dragOverQuad !== qId) setDragOverQuad(qId);
                    }}
                    onDragLeave={() => {
                      if (dragOverQuad === qId) setDragOverQuad(null);
                    }}
                    onDrop={(e) => handleDropOnQuadrant(e, qId)}
                  >
                    <div className="mquad-zone__head">
                      <div>
                        <span className="mquad-zone__title">
                          {q.roman} · {q.name}
                        </span>
                        <span className="mquad-zone__rule">{QUAD_SHORT_HINT[qId]}</span>
                      </div>
                      <span className="mquad-zone__count mono">
                        {stats.countsByQuadrant[qId]} ide
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {GRID_TICKS.map((score) => {
              const px = scoreToPercentX(score);
              const py = scoreToPercentY(score);
              return (
                <React.Fragment key={score}>
                  <span className="cgrid-line-v" style={{ left: `${px}%` }} aria-hidden="true" />
                  <span className="ctick-x mono" style={{ left: `${px}%` }} aria-hidden="true">
                    {score}
                  </span>
                  <span className="cgrid-line-h" style={{ bottom: `${py}%` }} aria-hidden="true" />
                  <span className="ctick-y mono" style={{ bottom: `${py}%` }} aria-hidden="true">
                    {score}
                  </span>
                </React.Fragment>
              );
            })}

            <div className="cthresh-v" style={{ left: `${THRESHOLD_X_PERCENT}%` }} aria-hidden="true" />
            <div className="cthresh-h" style={{ bottom: `${THRESHOLD_Y_PERCENT}%` }} aria-hidden="true" />

            {coincidentGroups.map(([coordKey, group]) => {
              const first = group[0];
              const pt = positions.get(first.id);
              if (!pt) return null;
              return (
                <span
                  key={coordKey}
                  className="coincident-dot"
                  style={{ left: `${pt.baseX}%`, bottom: `${pt.baseY}%` }}
                  title={`${group.length} ide berbagi titik skor yang sama`}
                  aria-hidden="true"
                />
              );
            })}

            {ideas.map((idea) => {
              const pos = positions.get(idea.id);
              if (!pos) return null;
              const q = getQuadrantMeta(idea.feasibility, idea.impact);
              const total = getTotalScore(idea.feasibility, idea.impact);
              const isSelected = idea.id === selectedIdeaId;

              return (
                <button
                  key={idea.id}
                  type="button"
                  draggable={!readOnly}
                  onDragStart={(e) => {
                    draggedIdRef.current = idea.id;
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', String(idea.id));
                  }}
                  onDragEnd={() => {
                    draggedIdRef.current = null;
                    setDragOverQuad(null);
                  }}
                  onClick={() => handleSelect(idea.id)}
                  className={`mnode-pin mnode-pin--${q.colorKey} ${
                    idea.isOriginalFinalSelection ? 'is-trio-pin' : ''
                  } ${isSelected ? 'is-selected' : ''}`}
                  style={
                    {
                      left: `${pos.baseX}%`,
                      bottom: `${pos.baseY}%`,
                      '--ox': `${pos.offsetX}px`,
                      '--oy': `${pos.offsetY}px`,
                    } as React.CSSProperties
                  }
                  title={`#${idea.id} ${idea.name} — Kelayakan ${idea.feasibility}/5, Dampak ${idea.impact}/5, Total ${total}/10 (${q.name})`}
                  aria-pressed={isSelected}
                  aria-label={`Ide ${idea.id}: ${idea.name}. Kelayakan ${idea.feasibility}, Dampak ${idea.impact}, Kuadran ${q.name}`}
                >
                  {idea.isOriginalFinalSelection && (
                    <span className="mnode-pin__star" aria-hidden="true">
                      ★
                    </span>
                  )}
                  <span className="mnode-pin__id mono">#{idea.id}</span>
                  <span className="mnode-pin__label">{idea.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="matrix2d-axis-bottom">
          <span>Kelayakan Rendah (1–3)</span>
          <span>Skor Kelayakan (1 → 5)</span>
          <span>Kelayakan Tinggi (4–5)</span>
        </div>
      </div>

      {coincidentGroups.length > 0 && (
        <div className="coincident-strip" aria-label="Ide dengan titik skor yang sama">
          <strong style={{ color: 'var(--ink-primary)' }}>Ide dengan skor sama:</strong>
          {coincidentGroups.map(([coordKey, group]) => {
            const [fScore, iScore] = coordKey.split(',');
            return (
              <div
                key={coordKey}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
              >
                <span style={{ color: 'var(--ink-secondary)', fontWeight: 500 }}>
                  Kelayakan {fScore}, Dampak {iScore}:
                </span>
                {group.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`coincident-chip ${item.id === selectedIdeaId ? 'is-selected' : ''} ${
                      item.isOriginalFinalSelection ? 'is-trio-chip' : ''
                    }`}
                    onClick={() => handleSelect(item.id)}
                  >
                    {item.isOriginalFinalSelection ? '★ ' : ''}
                    <span className="mono">#{item.id}</span> {item.shortLabel}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
