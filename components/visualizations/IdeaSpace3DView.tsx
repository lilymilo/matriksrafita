'use client';

import React, { useEffect, useRef } from 'react';
import {
  createThreeSpaceController,
  isWebGLSupported,
  type ThreeSpaceController,
} from '@/components/visualizations/three/scene-controller';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import type { CameraPreset } from '@/types/idea';

const PRESETS: ReadonlyArray<{ id: CameraPreset; label: string }> = [
  { id: 'iso', label: 'Isometrik' },
  { id: 'front', label: 'Depan' },
  { id: 'top', label: 'Atas' },
];

export default function IdeaSpace3DView() {
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const selectedIdeaId = useWorkspaceSelector((s) => s.selectedIdeaId);
  const cameraPreset = useWorkspaceSelector((s) => s.cameraPreset);
  const cameraNonce = useWorkspaceSelector((s) => s.cameraNonce);
  const lowPerfMode = useWorkspaceSelector((s) => s.lowPerfMode);

  const hostRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<ThreeSpaceController | null>(null);
  const initialMountStateRef = useRef({ ideas, selectedIdeaId, lowPerfMode });

  useEffect(() => {
    if (!hostRef.current) return;
    if (!isWebGLSupported()) {
      workspaceActions.setWebglStatus('unavailable');
      return;
    }

    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const init = initialMountStateRef.current;
    const startLowPerf = init.lowPerfMode || isSmallScreen || prefersReduced;

    if (startLowPerf && !init.lowPerfMode) {
      workspaceActions.setLowPerfMode(true);
    }

    const ctrl = createThreeSpaceController({
      mountEl: hostRef.current,
      tooltipEl: tooltipRef.current,
      initialIdeas: init.ideas,
      initialSelectedId: init.selectedIdeaId,
      lowPerfMode: startLowPerf,
      onSelectIdea: (id) => workspaceActions.selectIdea(id, true),
    });

    controllerRef.current = ctrl;
    workspaceActions.setWebglStatus('ready');

    return () => {
      ctrl.dispose();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.syncIdeas(ideas, selectedIdeaId);
  }, [ideas, selectedIdeaId]);

  useEffect(() => {
    controllerRef.current?.setCameraPreset(cameraPreset);
  }, [cameraPreset, cameraNonce]);

  useEffect(() => {
    controllerRef.current?.setLowPerfMode(lowPerfMode);
  }, [lowPerfMode]);

  return (
    <div className="stage-panel">
      <div className="stage-panel__toolbar">
        <div>
          <h3 className="stage-panel__title">Ruang Ide 3D Interaktif</h3>
          <p className="stage-panel__subtitle">
            Geser untuk memutar atau ketuk bola ide untuk membuka detail. Jika terasa berat di HP, gunakan Peta 2×2.
          </p>
        </div>

        <div className="space3d-controls-row">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`btn btn--sm ${cameraPreset === p.id ? 'btn--primary' : 'btn--outline'}`}
              onClick={() => workspaceActions.setCameraPreset(p.id)}
            >
              {p.label}
            </button>
          ))}

          <button
            type="button"
            className={`btn btn--sm ${lowPerfMode ? 'btn--accent' : 'btn--outline'}`}
            onClick={() => workspaceActions.setLowPerfMode(!lowPerfMode)}
          >
            {lowPerfMode ? 'Ringan: Aktif' : 'Mode Ringan'}
          </button>

          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => workspaceActions.setActiveView('map2x2')}
          >
            Pakai 2D
          </button>
        </div>
      </div>

      <div className="space3d-container">
        <div ref={hostRef} className="space3d-canvas-host">
          <div className="space3d-loading">Memuat ruang 3D...</div>
        </div>
        <div ref={tooltipRef} className="space3d-tooltip" role="status" aria-live="polite" />
      </div>

      <div className="space3d-footer-bar">
        <strong style={{ color: 'var(--ink-primary)' }}>Pilih cepat ide:</strong>
        <div className="kbd-nodes-row" role="group" aria-label="Pilih ide dari daftar tombol">
          {ideas.map((idea) => (
            <button
              key={idea.id}
              type="button"
              className={`kbd-node-btn ${idea.id === selectedIdeaId ? 'is-selected' : ''} ${
                idea.isOriginalFinalSelection ? 'is-trio-chip' : ''
              }`}
              onClick={() => workspaceActions.selectIdea(idea.id, true)}
              aria-pressed={idea.id === selectedIdeaId}
              title={`#${idea.id} ${idea.name} (Kelayakan ${idea.feasibility}/5, Dampak ${idea.impact}/5)`}
            >
              {idea.isOriginalFinalSelection ? '★ ' : ''}
              <span className="mono">#{idea.id}</span> {idea.shortLabel}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
