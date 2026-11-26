'use client';

import React, { useEffect } from 'react';
import { LKPD_META } from '@/lib/data/lkpd-data';
import { buildCsvContent, computeSummaryStats } from '@/lib/domain/matrix-math';
import {
  useWorkspaceSelector,
  workspaceActions,
  type WorkspaceSectionId,
} from '@/lib/store/useIdeaQuestStore';
import { Icon, type IconName } from '@/components/ui/Icons';

interface NavItem {
  id: WorkspaceSectionId;
  label: string;
  icon: IconName;
  badge?: string;
}

const NAV_SECTION_IDS: readonly WorkspaceSectionId[] = [
  'ringkasan',
  'matriks-prioritas',
  'semua-ide',
  'ide-terpilih',
  'analisis',
];

export function WorkspaceSidebar() {
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const hiddenCount = useWorkspaceSelector((s) => s.payload.hiddenLkpdIds.length);
  const activeSection = useWorkspaceSelector((s) => s.activeSection);
  const mobileNavOpen = useWorkspaceSelector((s) => s.mobileNavOpen);
  const diagnosticsOpen = useWorkspaceSelector((s) => s.diagnosticsOpen);

  const stats = computeSummaryStats(ideas, hiddenCount);
  const selectedTrioCount = ideas.filter((i) => i.isOriginalFinalSelection).length;

  const navItems: NavItem[] = [
    { id: 'ringkasan', label: 'Ringkasan', icon: 'home' },
    { id: 'matriks-prioritas', label: 'Matriks Prioritas', icon: 'grid' },
    { id: 'semua-ide', label: 'Semua Ide', icon: 'list', badge: String(ideas.length) },
    { id: 'ide-terpilih', label: 'Ide Terpilih', icon: 'star', badge: String(selectedTrioCount) },
    { id: 'analisis', label: 'Analisis', icon: 'fileText' },
  ];

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const elements = NAV_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id as WorkspaceSectionId;
          workspaceActions.setActiveSection(id);
        }
      },
      {
        rootMargin: '-18% 0px -60% 0px',
        threshold: [0.05, 0.25],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        workspaceActions.setMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileNavOpen]);

  const handleNavigate = (id: WorkspaceSectionId) => {
    workspaceActions.setActiveSection(id);
    workspaceActions.setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExportCsv = () => {
    const csv = buildCsvContent(ideas);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ideaquest-lkpd5-matriks-prioritas.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    workspaceActions.notify('Data ide berhasil diunduh dalam format CSV.', 'success');
  };

  return (
    <>
      {mobileNavOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={() => workspaceActions.setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`workspace-sidebar ${mobileNavOpen ? 'is-mobile-open' : ''}`}
        aria-label="Navigasi utama IdeaQuest"
      >
        <div className="workspace-sidebar__head">
          <a
            href="#ringkasan"
            className="brand-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('ringkasan');
            }}
          >
            <span className="brand-mark-box" aria-hidden="true" />
            <span>{LKPD_META.brand}</span>
          </a>

          <button
            type="button"
            className="btn btn--ghost btn--sm sidebar-close-btn"
            onClick={() => workspaceActions.setMobileNavOpen(false)}
            aria-label="Tutup menu navigasi"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="workspace-sidebar__meta">
          <div className="workspace-sidebar__meta-title">
            LKPD 5 · Kelas {LKPD_META.className}
          </div>
          <div className="workspace-sidebar__meta-sub">
            Studi Kasus Toko Kue {LKPD_META.persona.name}
          </div>
        </div>

        <div className="workspace-sidebar__cta">
          <button
            type="button"
            className="btn btn--primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => workspaceActions.openCreateModal()}
          >
            <Icon name="plus" size={17} />
            <span>Tambah Ide</span>
          </button>
        </div>

        <nav className="workspace-sidebar__nav" aria-label="Menu halaman">
          <span className="sidebar-group-label">Menu Utama</span>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`sidebar-nav-link ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(item.id);
                }}
              >
                <span className="sidebar-nav-link__left">
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </span>
                {item.badge && <span className="sidebar-nav-badge mono">{item.badge}</span>}
              </a>
            );
          })}
        </nav>

        <div className="workspace-sidebar__footer">
          <span className="sidebar-group-label">Tindakan</span>

          <button
            type="button"
            className="sidebar-util-btn"
            onClick={() => {
              workspaceActions.setMobileNavOpen(false);
              workspaceActions.openPresentation(0);
            }}
          >
            <Icon name="play" size={16} />
            <span>Mode Presentasi</span>
          </button>

          <button type="button" className="sidebar-util-btn" onClick={handleExportCsv}>
            <Icon name="download" size={16} />
            <span>Unduh Data (CSV)</span>
          </button>

          {stats.hasSimulatedChanges && (
            <button
              type="button"
              className="sidebar-util-btn sidebar-util-btn--accent"
              onClick={() => workspaceActions.restoreLkpdData(true)}
            >
              <Icon name="reset" size={16} />
              <span>Pulihkan Data Awal</span>
            </button>
          )}

          <button
            type="button"
            className="sidebar-util-btn"
            onClick={() => workspaceActions.toggleDiagnostics()}
            aria-pressed={diagnosticsOpen}
          >
            <Icon name="gauge" size={16} />
            <span>{diagnosticsOpen ? 'Tutup Diagnostik' : 'Diagnostik Performa'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
