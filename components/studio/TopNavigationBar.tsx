'use client';

import React from 'react';
import { LKPD_META } from '@/lib/data/lkpd-data';
import { computeSummaryStats } from '@/lib/domain/matrix-math';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import { Icon } from '@/components/ui/Icons';

export function TopNavigationBar() {
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const selectedIdeaId = useWorkspaceSelector((s) => s.selectedIdeaId);
  const hiddenCount = useWorkspaceSelector((s) => s.payload.hiddenLkpdIds.length);

  const stats = computeSummaryStats(ideas, hiddenCount);
  const activeIdea = ideas.find((i) => i.id === selectedIdeaId) ?? ideas[0];

  return (
    <>
      <header className="topbar">
        <div className="workspace-container topbar__inner">
          <div className="topbar__left">
            <button
              type="button"
              className="btn btn--outline btn--sm mobile-menu-trigger"
              onClick={() => workspaceActions.setMobileNavOpen(true)}
              aria-label="Buka menu navigasi"
            >
              <Icon name="menu" size={18} />
              <span>Menu</span>
            </button>

            <span className="topbar__context">
              <strong className="topbar__mobile-brand">{LKPD_META.brand}</strong>
              <span className="topbar__doc-title">
                LKPD 5 · Penilaian Prioritas Ide
              </span>
            </span>

            {stats.hasSimulatedChanges && (
              <span className="status-rule">
                Perubahan simulasi aktif
              </span>
            )}
          </div>

          <div className="topbar__actions">
            {activeIdea && (
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => workspaceActions.openInspector(activeIdea.id)}
              >
                <Icon name="panelRight" size={16} />
                <span>Detail Ide #{activeIdea.id}</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => workspaceActions.openCreateModal()}
            >
              <Icon name="plus" size={16} />
              <span>Tambah Ide</span>
            </button>

            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => workspaceActions.openPresentation(0)}
            >
              <Icon name="play" size={15} />
              <span>Presentasi</span>
            </button>
          </div>
        </div>
      </header>

      <section id="ringkasan" className="hero-editorial" aria-labelledby="hero-heading">
        <div className="workspace-container hero-editorial__grid">
          <div>
            <p className="section-kicker">Ringkasan Evaluasi Ide · LKPD 5</p>

            <h1 id="hero-heading" className="hero-title">
              {LKPD_META.heroHeadline}
            </h1>

            <p className="hero-lead">{LKPD_META.heroLead}</p>
          </div>

          <div className="hero-editorial__aside">
            <ul className="editorial-bullet-list">
              <li>
                <strong>10 ide solusi</strong> dinilai pada skala 1 sampai 5 untuk kemudahan pengerjaan (Kelayakan) dan manfaatnya (Dampak).
              </li>
              <li>
                <strong>3 ide terpilih</strong> masuk Kuadran I (Prioritas Utama) dengan total skor tertinggi 9–10.
              </li>
              <li>
                Klik ide mana saja untuk membaca <strong>rincian lengkap dan alasan pemilihannya</strong>.
              </li>
            </ul>

            <div className="hero-cta-stack">
              <a href="#matriks-prioritas" className="btn btn--primary btn--lg">
                <span>Buka Matriks Prioritas</span>
                <Icon name="arrowDownRight" size={17} />
              </a>
              <button
                type="button"
                className="btn btn--outline btn--lg"
                onClick={() => workspaceActions.openCreateModal()}
              >
                <Icon name="plus" size={17} />
                <span>Tambah Ide</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
