'use client';

import React, { Profiler, useEffect } from 'react';
import { telemetry } from '@/lib/performance/telemetry';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import { WorkspaceSidebar } from '@/components/studio/WorkspaceSidebar';
import { TopNavigationBar } from '@/components/studio/TopNavigationBar';
import { MetricStrip } from '@/components/studio/MetricStrip';
import { MatrixViewSwitcher } from '@/components/studio/MatrixViewSwitcher';
import { IdeaInspectorPanel } from '@/components/studio/IdeaInspectorPanel';
import { IdeaRegistryExplorer } from '@/components/studio/IdeaRegistryExplorer';
import { CrudIdeaModal } from '@/components/studio/CrudIdeaModal';
import { DeleteConfirmDialog } from '@/components/studio/DeleteConfirmDialog';
import { PresentationModal } from '@/components/studio/PresentationModal';
import { PerformanceDiagnosticsPanel } from '@/components/studio/PerformanceDiagnosticsPanel';
import { Icon } from '@/components/ui/Icons';

function ToastNotification() {
  const notice = useWorkspaceSelector((s) => s.notice);
  if (!notice) return null;

  return (
    <div className="toast-banner" role="status" aria-live="polite">
      <span>{notice.text}</span>
      <button
        type="button"
        className="btn btn--ghost btn--sm"
        style={{ color: '#fff', padding: '4px' }}
        onClick={() => workspaceActions.dismissNotice()}
        aria-label="Tutup pemberitahuan"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

interface IdeaQuestAppShellProps {
  personaBand: React.ReactNode;
  selectedConcepts: React.ReactNode;
  criticalAnalysis: React.ReactNode;
  footer: React.ReactNode;
}

/**
 * Interactive Dashboard Shell with consistent left navigation sidebar and right slide-over drawers.
 * Static LKPD Server Components are passed in via ReactNode props so they stay Server Components.
 */
export function IdeaQuestAppShell({
  personaBand,
  selectedConcepts,
  criticalAnalysis,
  footer,
}: IdeaQuestAppShellProps) {
  useEffect(() => {
    workspaceActions.hydrateFromStorage();
  }, []);

  return (
    <>
      <div className="workspace-app-shell">
        <WorkspaceSidebar />

        <div className="workspace-main-column">
          <Profiler id="IdeaQuestStudio" onRender={telemetry.recordReactRender}>
            <TopNavigationBar />
            <MetricStrip />
            {personaBand}

            <div className="workspace-container">
              <section
                id="matriks-prioritas"
                className="editorial-section"
                aria-labelledby="studio-heading"
              >
                <div className="section-header">
                  <div>
                    <p className="section-kicker">Visualisasi Perbandingan Ide</p>
                    <h2 id="studio-heading" className="section-title">
                      Matriks Prioritas Kelayakan &amp; Dampak
                    </h2>
                    <p className="section-lead">
                      Pilih cara tampilan yang paling nyaman dibaca. Klik salah satu ide untuk membuka detail lengkap dan simulasi skor di sisi kanan.
                    </p>
                  </div>
                </div>

                <MatrixViewSwitcher />
              </section>

              <IdeaRegistryExplorer />
              {selectedConcepts}
              {criticalAnalysis}
            </div>

            {footer}

            <IdeaInspectorPanel />
            <CrudIdeaModal />
            <DeleteConfirmDialog />
            <PresentationModal />
          </Profiler>
        </div>
      </div>

      <PerformanceDiagnosticsPanel />
      <ToastNotification />
    </>
  );
}
