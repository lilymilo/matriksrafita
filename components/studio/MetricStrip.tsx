'use client';

import React, { memo } from 'react';
import { computeSummaryStats } from '@/lib/domain/matrix-math';
import { useWorkspaceSelector } from '@/lib/store/useIdeaQuestStore';

export const MetricStrip = memo(function MetricStrip() {
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const hiddenCount = useWorkspaceSelector((s) => s.payload.hiddenLkpdIds.length);
  const stats = computeSummaryStats(ideas, hiddenCount);

  return (
    <section className="metric-strip" aria-label="Ringkasan angka penilaian ide">
      <div className="workspace-container metric-strip__grid">
        <div className="metric-cell">
          <span className="metric-cell__label">Total Ide Dinilai</span>
          <strong className="metric-cell__value mono">{stats.totalIdeas} Ide</strong>
          <span className="metric-cell__sub">
            {stats.lkpdActiveCount} ide awal LKPD 5
            {stats.customCount > 0 ? ` dan ${stats.customCount} ide tambahan` : ''}
          </span>
        </div>

        <div className="metric-cell">
          <span className="metric-cell__label">Prioritas Utama (Kuadran I)</span>
          <strong className="metric-cell__value mono text-mint">
            {stats.priorityCount} Ide
          </strong>
          <span className="metric-cell__sub">
            Kelayakan 4–5 dan Dampak 4–5 (3 konsep terpilih)
          </span>
        </div>

        <div className="metric-cell">
          <span className="metric-cell__label">Rata-rata Total Skor</span>
          <strong className="metric-cell__value mono">
            {stats.averageTotalFormatted}
            <span className="metric-cell__unit">/10</span>
          </strong>
          <span className="metric-cell__sub">Gabungan skor Kelayakan + Dampak</span>
        </div>

        <div className="metric-cell">
          <span className="metric-cell__label">Sebaran Kuadran</span>
          <strong className="metric-cell__value mono">
            {stats.countsByQuadrant.I} · {stats.countsByQuadrant.II} · {stats.countsByQuadrant.III} · {stats.countsByQuadrant.IV}
          </strong>
          <span className="metric-cell__sub">
            Kuadran I, II, III, dan IV
          </span>
        </div>
      </div>
    </section>
  );
});
