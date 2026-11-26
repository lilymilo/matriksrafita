'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MATRIX_VIEWS, QUADRANTS, QUADRANT_IDS } from '@/lib/data/lkpd-data';
import { getQuadrantMeta, getTotalScore } from '@/lib/domain/matrix-math';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import { Map2x2View } from '@/components/visualizations/Map2x2View';
import { Icon, type IconName } from '@/components/ui/Icons';
import type { MatrixViewId, QuadrantId } from '@/types/idea';

// Lazy-load Three.js & secondary visualizations into separate JS chunks
const LazyIdeaSpace3DView = dynamic(
  () => import('@/components/visualizations/IdeaSpace3DView'),
  {
    ssr: false,
    loading: () => (
      <div className="stage-panel">
        <div className="space3d-container">
          <div className="space3d-loading">
            <span>Memuat tampilan 3D...</span>
          </div>
        </div>
      </div>
    ),
  },
);

const LazyPriorityStaircaseView = dynamic(() =>
  import('@/components/visualizations/PriorityStaircaseView').then(
    (m) => m.PriorityStaircaseView,
  ),
);

const LazyLevelMetersView = dynamic(() =>
  import('@/components/visualizations/LevelMetersView').then((m) => m.LevelMetersView),
);

const LazyQuadrantCardsView = dynamic(() =>
  import('@/components/visualizations/QuadrantCardsView').then((m) => m.QuadrantCardsView),
);

const LazyPriorityBoardView = dynamic(() =>
  import('@/components/visualizations/PriorityBoardView').then((m) => m.PriorityBoardView),
);

const LazyIdeaRankingView = dynamic(() =>
  import('@/components/visualizations/IdeaRankingView').then((m) => m.IdeaRankingView),
);

const VIEW_ICON_MAP: Record<MatrixViewId, IconName> = {
  map2x2: 'grid',
  space3d: 'cube',
  staircase: 'stairs',
  levels: 'meters',
  quadrantCards: 'cards',
  priorityBoard: 'board',
  ranking: 'ranking',
};

const SIMPLE_QUADRANT_MEANINGS: Record<QuadrantId, string> = {
  I: 'Mudah dibuat dan berdampak besar. Menjadi fokus utama untuk prototipe.',
  II: 'Mudah dibuat dengan dampak pendukung. Cocok sebagai fitur pelengkap.',
  III: 'Berdampak besar, tetapi lebih sulit dibuat. Disiapkan untuk tahap lanjut.',
  IV: 'Sulit dikerjakan dan dampaknya terbatas. Sebaiknya ditunda dahulu.',
};

export function MatrixViewSwitcher() {
  const activeView = useWorkspaceSelector((s) => s.activeView);
  const webglStatus = useWorkspaceSelector((s) => s.webglStatus);
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const selectedIdeaId = useWorkspaceSelector((s) => s.selectedIdeaId);

  const activeIdea = ideas.find((i) => i.id === selectedIdeaId) ?? ideas[0];
  const activeQuad = activeIdea
    ? getQuadrantMeta(activeIdea.feasibility, activeIdea.impact)
    : null;

  return (
    <div>
      <div
        className="view-switcher-bar"
        role="tablist"
        aria-label="Pilihan tampilan matriks prioritas"
      >
        {MATRIX_VIEWS.map((view) => {
          const isActive = view.id === activeView;
          const isDisabled = view.id === 'space3d' && webglStatus === 'unavailable';

          return (
            <button
              key={view.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={isDisabled}
              className={`view-tab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => workspaceActions.setActiveView(view.id)}
            >
              <Icon name={VIEW_ICON_MAP[view.id]} size={17} />
              <span>{view.label}</span>
            </button>
          );
        })}
      </div>

      {activeView === 'map2x2' && <Map2x2View />}
      {activeView === 'space3d' && <LazyIdeaSpace3DView />}
      {activeView === 'staircase' && <LazyPriorityStaircaseView />}
      {activeView === 'levels' && <LazyLevelMetersView />}
      {activeView === 'quadrantCards' && <LazyQuadrantCardsView />}
      {activeView === 'priorityBoard' && <LazyPriorityBoardView />}
      {activeView === 'ranking' && <LazyIdeaRankingView />}

      {activeIdea && activeQuad && (
        <div className="active-idea-bar" role="region" aria-label="Ringkasan ide yang sedang dipilih">
          <div className="active-idea-bar__info">
            <span className={`q-dot q-dot--${activeQuad.colorKey}`} />
            <strong className="active-idea-bar__name">
              Ide #{activeIdea.id} — {activeIdea.name}
            </strong>
            {activeIdea.isOriginalFinalSelection && activeIdea.conceptName && (
              <span className="trio-badge">
                <Icon name="star" size={13} />
                <span>Ide Terpilih · {activeIdea.conceptName}</span>
              </span>
            )}
            <span className="active-idea-bar__scores mono">
              Kelayakan {activeIdea.feasibility}/5 · Dampak {activeIdea.impact}/5 · Total{' '}
              {getTotalScore(activeIdea.feasibility, activeIdea.impact)}/10
            </span>
          </div>
          <div className="active-idea-bar__actions">
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => workspaceActions.openEditModal(activeIdea.id)}
            >
              <Icon name="edit" size={15} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => workspaceActions.openInspector(activeIdea.id)}
            >
              <Icon name="panelRight" size={15} />
              <span>Lihat Detail</span>
            </button>
          </div>
        </div>
      )}

      <div className="quadrant-legend-section" aria-label="Penjelasan empat kuadran">
        <div className="quadrant-legend-section__head">
          <h3>Arti Empat Kuadran</h3>
          <span className="trio-badge">
            <Icon name="star" size={13} />
            <span>Tanda bintang = 3 Ide Terpilih LKPD 5</span>
          </span>
        </div>

        <div className="quadrant-legend-grid">
          {QUADRANT_IDS.map((qId) => {
            const q = QUADRANTS[qId];
            return (
              <div key={qId} className={`quadrant-legend-card quadrant-legend-card--${q.colorKey}`}>
                <div className="quadrant-legend-card__head">
                  <span className={`q-dot q-dot--${q.colorKey}`} />
                  <strong>
                    Kuadran {q.roman} · {q.name}
                  </strong>
                </div>
                <div className="quadrant-legend-card__rule mono">{q.shortDesc}</div>
                <p className="quadrant-legend-card__desc">{SIMPLE_QUADRANT_MEANINGS[qId]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
