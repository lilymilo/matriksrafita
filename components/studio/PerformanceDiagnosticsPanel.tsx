'use client';

import React, { useEffect, useState } from 'react';
import { telemetry } from '@/lib/performance/telemetry';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import { Icon } from '@/components/ui/Icons';

function fmtMs(val: number | null): string {
  return val === null ? 'Belum diukur' : `${val.toFixed(2)} ms`;
}

function fmtBytes(bytes: number | null, count: number | null): string {
  if (bytes === null) return 'Belum diukur';
  const kb = bytes / 1024;
  return `${kb.toFixed(1)} KB (${count ?? 0} file)`;
}

export function PerformanceDiagnosticsPanel() {
  const diagnosticsOpen = useWorkspaceSelector((s) => s.diagnosticsOpen);
  const lowPerfMode = useWorkspaceSelector((s) => s.lowPerfMode);
  const [snap, setSnap] = useState(() => ({ ...telemetry.getSnapshot() }));

  useEffect(() => {
    telemetry.initBrowserObservers();

    const intervalMs = diagnosticsOpen ? 500 : 2000;
    const timer = setInterval(() => {
      setSnap({ ...telemetry.getSnapshot() });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [diagnosticsOpen]);

  if (!diagnosticsOpen) return null;

  return (
    <aside className="perf-dock" aria-label="Panel Diagnostik Performa">
      <div className="perf-dock__head">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <Icon name="gauge" size={16} />
          <span>Diagnostik Performa</span>
        </span>
        <button
          type="button"
          className="perf-dock__close"
          onClick={() => workspaceActions.toggleDiagnostics()}
          aria-label="Tutup panel diagnostik"
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      <div className="perf-dock__panel">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            paddingBottom: '10px',
            borderBottom: '1px solid rgba(255,255,255,0.14)',
            gap: '8px',
          }}
        >
          <span className="mono" style={{ fontWeight: 600 }}>
            {snap.fps !== null ? `${snap.fps} FPS` : 'Memantau...'} ·{' '}
            {snap.frameTimeMs !== null ? `${snap.frameTimeMs} ms` : 'Belum diukur'}
          </span>
          <button
            type="button"
            className="perf-dock__mode-btn"
            onClick={() => workspaceActions.setLowPerfMode(!lowPerfMode)}
            style={{
              background: lowPerfMode ? '#096c49' : 'rgba(255,255,255,0.14)',
            }}
          >
            {lowPerfMode ? 'Hemat GPU: Aktif' : 'Hemat GPU: Nonaktif'}
          </button>
        </div>

        <div className="perf-grid mono">
          <span className="perf-k">1. Muat Awal Halaman</span>
          <span className="perf-v">{fmtMs(snap.initialPageLoadMs)}</span>

          <span className="perf-k">2. Inisialisasi Three.js</span>
          <span className="perf-v">{fmtMs(snap.threeInitMs)}</span>

          <span className="perf-k">3. Operasi CRUD Terakhir</span>
          <span className="perf-v">
            {snap.lastCrudDurationMs === null
              ? 'Belum diukur'
              : `${snap.lastCrudDurationMs.toFixed(2)} ms (${snap.lastCrudOperation})`}
          </span>

          <span className="perf-k">4. Perubahan Skor</span>
          <span className="perf-v">{fmtMs(snap.lastScoreChangeMs)}</span>

          <span className="perf-k">5. Waktu Frame (Rata-rata)</span>
          <span className="perf-v">{fmtMs(snap.frameTimeMs)}</span>

          <span className="perf-k">6. FPS Aktual</span>
          <span className="perf-v">
            {snap.fps === null ? 'Belum diukur' : `${snap.fps} FPS`}
          </span>

          <span className="perf-k">7. Render React (Profiler)</span>
          <span className="perf-v">
            {snap.lastReactCommitMs === null
              ? 'Belum diukur'
              : `${snap.reactRenderCount}× (${snap.lastReactCommitMs.toFixed(2)} ms)`}
          </span>

          <span className="perf-k">8. Long Tasks (&gt;50 ms)</span>
          <span className="perf-v">
            {snap.longTaskCount === 0
              ? '0 tugas'
              : `${snap.longTaskCount}× (maks ${snap.maxLongTaskMs?.toFixed(1)} ms)`}
          </span>

          <span className="perf-k">9. LCP</span>
          <span className="perf-v">{fmtMs(snap.lcpMs)}</span>

          <span className="perf-k">10. INP</span>
          <span className="perf-v">{fmtMs(snap.inpMs)}</span>

          <span className="perf-k">11. CLS</span>
          <span className="perf-v">
            {snap.clsScore === null ? 'Belum diukur' : snap.clsScore.toFixed(4)}
          </span>

          <span className="perf-k">12. Bundle JS Aktif</span>
          <span className="perf-v">
            {fmtBytes(snap.jsBundleBytes, snap.jsResourceCount)}
          </span>
        </div>
      </div>
    </aside>
  );
}
