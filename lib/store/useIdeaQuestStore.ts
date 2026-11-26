'use client';

import { useSyncExternalStore } from 'react';
import { QUADRANTS } from '@/lib/data/lkpd-data';
import {
  createCustomIdeaInPayload,
  createEmptyPersistencePayload,
  deleteIdeaFromPayload,
  materializeIdeas,
  restoreAllLkpdSeeds,
  restoreSingleLkpdIdea,
  updateIdeaInPayload,
  updateScoreInPayload,
} from '@/lib/domain/crud';
import {
  dropPositionToQuadrantScores,
  getQuadrantMeta,
} from '@/lib/domain/matrix-math';
import { telemetry } from '@/lib/performance/telemetry';
import {
  clearPersistedWorkspace,
  loadPersistedWorkspace,
  savePersistedWorkspace,
} from '@/lib/persistence/storage';
import type {
  CameraPreset,
  CreateOrUpdateIdeaInput,
  IdeaFilters,
  IdeaItem,
  MatrixViewId,
  PersistedWorkspacePayload,
  QuadrantId,
} from '@/types/idea';

export type WorkspaceSectionId =
  | 'ringkasan'
  | 'matriks-prioritas'
  | 'semua-ide'
  | 'ide-terpilih'
  | 'analisis';

export interface ToastNotice {
  id: number;
  text: string;
  tone: 'info' | 'success' | 'warning';
}

export interface WorkspaceState {
  hydrated: boolean;
  payload: PersistedWorkspacePayload;
  ideas: IdeaItem[];
  selectedIdeaId: number;
  inspectorOpen: boolean;
  activeSection: WorkspaceSectionId;
  mobileNavOpen: boolean;
  activeView: MatrixViewId;
  webglStatus: 'pending' | 'ready' | 'unavailable';
  cameraPreset: CameraPreset;
  cameraNonce: number;
  lowPerfMode: boolean;
  filters: IdeaFilters;
  crudModal: {
    open: boolean;
    mode: 'create' | 'edit';
    editingId: number | null;
  };
  deleteDialog: {
    open: boolean;
    targetId: number | null;
  };
  presentation: {
    open: boolean;
    slide: number;
    useSimulatedData: boolean;
    focusedIdeaId: number;
  };
  diagnosticsOpen: boolean;
  notice: ToastNotice | null;
}

const initialPayload = createEmptyPersistencePayload();
const initialIdeas = materializeIdeas(initialPayload);

let state: WorkspaceState = {
  hydrated: false,
  payload: initialPayload,
  ideas: initialIdeas,
  selectedIdeaId: 1,
  inspectorOpen: false,
  activeSection: 'ringkasan',
  mobileNavOpen: false,
  activeView: 'map2x2',
  webglStatus: 'pending',
  cameraPreset: 'iso',
  cameraNonce: 0,
  lowPerfMode: false,
  filters: {
    search: '',
    quadrant: 'all',
    scamper: 'all',
    origin: 'all',
    sortBy: 'idAsc',
  },
  crudModal: {
    open: false,
    mode: 'create',
    editingId: null,
  },
  deleteDialog: {
    open: false,
    targetId: null,
  },
  presentation: {
    open: false,
    slide: 0,
    useSimulatedData: false,
    focusedIdeaId: 1,
  },
  diagnosticsOpen: false,
  notice: null,
};

let noticeTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function setNotice(text: string, tone: ToastNotice['tone'] = 'info') {
  if (noticeTimer) clearTimeout(noticeTimer);
  state = {
    ...state,
    notice: {
      id: Date.now(),
      text,
      tone,
    },
  };
  emit();

  if (typeof setTimeout === 'function') {
    noticeTimer = setTimeout(() => {
      state = {
        ...state,
        notice: null,
      };
      emit();
    }, 4500);
  }
}

function commitPayload(
  nextPayload: PersistedWorkspacePayload,
  nextSelectedId?: number,
) {
  const nextIdeas = materializeIdeas(nextPayload);
  savePersistedWorkspace(nextPayload);

  const fallbackId = nextIdeas[0]?.id ?? 1;
  const targetId = nextSelectedId ?? state.selectedIdeaId;
  const resolvedSelected = nextIdeas.some((item) => item.id === targetId)
    ? targetId
    : fallbackId;

  state = {
    ...state,
    payload: nextPayload,
    ideas: nextIdeas,
    selectedIdeaId: resolvedSelected,
  };
}

export const workspaceActions = {
  hydrateFromStorage() {
    if (state.hydrated) return;
    const loaded = loadPersistedWorkspace();
    const materialized = materializeIdeas(loaded);
    const firstId = materialized[0]?.id ?? 1;
    state = {
      ...state,
      hydrated: true,
      payload: loaded,
      ideas: materialized,
      selectedIdeaId: materialized.some((i) => i.id === state.selectedIdeaId)
        ? state.selectedIdeaId
        : firstId,
    };
    emit();
  },

  selectIdea(id: number, openPanel = true) {
    if (!state.ideas.some((item) => item.id === id)) return;
    if (state.selectedIdeaId === id && state.inspectorOpen === openPanel) return;
    state = {
      ...state,
      selectedIdeaId: id,
      inspectorOpen: openPanel,
    };
    emit();
  },

  openInspector(id?: number) {
    const targetId = id ?? state.selectedIdeaId;
    if (!state.ideas.some((item) => item.id === targetId)) return;
    state = {
      ...state,
      selectedIdeaId: targetId,
      inspectorOpen: true,
    };
    emit();
  },

  closeInspector() {
    if (!state.inspectorOpen) return;
    state = {
      ...state,
      inspectorOpen: false,
    };
    emit();
  },

  setActiveSection(section: WorkspaceSectionId) {
    if (state.activeSection === section) return;
    state = {
      ...state,
      activeSection: section,
    };
    emit();
  },

  setMobileNavOpen(open: boolean) {
    if (state.mobileNavOpen === open) return;
    state = {
      ...state,
      mobileNavOpen: open,
    };
    emit();
  },

  setActiveView(view: MatrixViewId) {
    if (view === 'space3d' && state.webglStatus === 'unavailable') {
      setNotice(
        'WebGL tidak tersedia pada perangkat ini. Menggunakan Peta Prioritas 2×2 sebagai pengganti.',
        'warning',
      );
      state = { ...state, activeView: 'map2x2' };
      emit();
      return;
    }
    if (state.activeView === view) return;
    state = {
      ...state,
      activeView: view,
    };
    emit();
  },

  setWebglStatus(status: 'pending' | 'ready' | 'unavailable') {
    if (state.webglStatus === status) return;
    const shouldFallback = status === 'unavailable' && state.activeView === 'space3d';
    state = {
      ...state,
      webglStatus: status,
      activeView: shouldFallback ? 'map2x2' : state.activeView,
    };
    emit();
  },

  setCameraPreset(preset: CameraPreset) {
    state = {
      ...state,
      cameraPreset: preset,
      cameraNonce: state.cameraNonce + 1,
    };
    emit();
  },

  setLowPerfMode(enabled: boolean) {
    telemetry.setLowPerfMode(enabled);
    state = {
      ...state,
      lowPerfMode: enabled,
    };
    emit();
    setNotice(
      enabled
        ? 'Mode Performa Rendah diaktifkan: resolusi piksel, bayangan, dan geometri 3D diringankan.'
        : 'Mode Kualitas Standar diaktifkan kembali.',
      'info',
    );
  },

  setFilters(patch: Partial<IdeaFilters>) {
    state = {
      ...state,
      filters: {
        ...state.filters,
        ...patch,
      },
    };
    emit();
  },

  resetFilters() {
    state = {
      ...state,
      filters: {
        search: '',
        quadrant: 'all',
        scamper: 'all',
        origin: 'all',
        sortBy: 'idAsc',
      },
    };
    emit();
  },

  updateScore(
    id: number,
    feasibility: number,
    impact: number,
    source: 'slider' | 'drag' | 'quadrant-move' = 'slider',
  ) {
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
    const nextPayload = updateScoreInPayload(state.payload, id, feasibility, impact, source);
    commitPayload(nextPayload, id);
    emit();
    if (typeof performance !== 'undefined') {
      telemetry.recordScoreChangeAfterPaint(t0);
    }
  },

  moveIdeaToQuadrant(
    id: number,
    targetQuadrantId: QuadrantId,
    dropCoords?: { percentX: number; percentY: number } | null,
    source: 'drag' | 'quadrant-move' = 'drag',
  ) {
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
    const quadrant = QUADRANTS[targetQuadrantId];
    if (!quadrant) return;

    const coords = dropCoords
      ? dropPositionToQuadrantScores(dropCoords.percentX, dropCoords.percentY, targetQuadrantId)
      : { ...quadrant.representativePoint };

    const nextPayload = updateScoreInPayload(
      state.payload,
      id,
      coords.feasibility,
      coords.impact,
      source,
    );
    commitPayload(nextPayload, id);
    emit();

    if (typeof performance !== 'undefined') {
      telemetry.recordScoreChangeAfterPaint(t0);
    }

    const qMeta = getQuadrantMeta(coords.feasibility, coords.impact);
    setNotice(
      `Ide #${id} dipindahkan ke Kuadran ${qMeta.roman} (${qMeta.name}) — Kelayakan ${coords.feasibility}, Dampak ${coords.impact}.`,
      'info',
    );
  },

  openCreateModal() {
    state = {
      ...state,
      inspectorOpen: false,
      mobileNavOpen: false,
      crudModal: {
        open: true,
        mode: 'create',
        editingId: null,
      },
    };
    emit();
  },

  openEditModal(id: number) {
    if (!state.ideas.some((item) => item.id === id)) return;
    state = {
      ...state,
      selectedIdeaId: id,
      inspectorOpen: false,
      mobileNavOpen: false,
      crudModal: {
        open: true,
        mode: 'edit',
        editingId: id,
      },
    };
    emit();
  },

  closeCrudModal() {
    state = {
      ...state,
      crudModal: {
        open: false,
        mode: 'create',
        editingId: null,
      },
    };
    emit();
  },

  createIdea(input: CreateOrUpdateIdeaInput) {
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
    const { nextPayload, createdId } = createCustomIdeaInPayload(state.payload, input);
    commitPayload(nextPayload, createdId);
    state = {
      ...state,
      crudModal: {
        open: false,
        mode: 'create',
        editingId: null,
      },
    };
    emit();
    if (typeof performance !== 'undefined') {
      telemetry.recordCrudAfterPaint('Tambah Ide', t0);
    }
    setNotice(`Ide baru #${createdId} berhasil ditambahkan dan disimpan di browser.`, 'success');
  },

  updateIdea(id: number, input: CreateOrUpdateIdeaInput) {
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
    const nextPayload = updateIdeaInPayload(state.payload, id, input);
    commitPayload(nextPayload, id);
    state = {
      ...state,
      crudModal: {
        open: false,
        mode: 'create',
        editingId: null,
      },
    };
    emit();
    if (typeof performance !== 'undefined') {
      telemetry.recordCrudAfterPaint('Perbarui Ide', t0);
    }
    setNotice(`Perubahan pada Ide #${id} berhasil disimpan.`, 'success');
  },

  requestDeleteIdea(id: number) {
    if (!state.ideas.some((item) => item.id === id)) return;
    state = {
      ...state,
      deleteDialog: {
        open: true,
        targetId: id,
      },
    };
    emit();
  },

  closeDeleteDialog() {
    state = {
      ...state,
      deleteDialog: {
        open: false,
        targetId: null,
      },
    };
    emit();
  },

  confirmDeleteIdea(id: number, allowHideLkpd = false) {
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
    const target = state.ideas.find((item) => item.id === id);
    const { nextPayload, deleted, reason } = deleteIdeaFromPayload(
      state.payload,
      id,
      allowHideLkpd,
    );

    if (!deleted) {
      setNotice(reason || 'Penghapusan dibatalkan.', 'warning');
      return;
    }

    commitPayload(nextPayload);
    state = {
      ...state,
      inspectorOpen: false,
      deleteDialog: {
        open: false,
        targetId: null,
      },
    };
    emit();

    if (typeof performance !== 'undefined') {
      telemetry.recordCrudAfterPaint('Hapus Ide', t0);
    }

    if (target?.origin === 'lkpd') {
      setNotice(
        `Ide awal LKPD #${id} disembunyikan dari simulasi aktif. Klik "Pulihkan Data Awal" kapan saja untuk mengembalikannya.`,
        'info',
      );
    } else {
      setNotice(`Ide tambahan #${id} berhasil dihapus.`, 'success');
    }
  },

  resetSingleIdea(id: number) {
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
    const nextPayload = restoreSingleLkpdIdea(state.payload, id);
    commitPayload(nextPayload, id);
    emit();
    if (typeof performance !== 'undefined') {
      telemetry.recordCrudAfterPaint('Pulihkan 1 Ide', t0);
    }
    setNotice(`Ide #${id} dikembalikan ke data dan skor asli LKPD 5.`, 'success');
  },

  restoreLkpdData(keepCustomIdeas = true) {
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
    const nextPayload = restoreAllLkpdSeeds(state.payload, keepCustomIdeas);
    if (!keepCustomIdeas) {
      clearPersistedWorkspace();
    }
    commitPayload(nextPayload, 1);
    emit();
    if (typeof performance !== 'undefined') {
      telemetry.recordCrudAfterPaint('Pulihkan LKPD', t0);
    }
    setNotice(
      keepCustomIdeas
        ? 'Seluruh 10 ide awal LKPD 5 dikembalikan ke kondisi asli (ide tambahan tetap disimpan).'
        : 'Workspace direset penuh ke 10 ide awal LKPD 5.',
      'success',
    );
  },

  openPresentation(slide = 0) {
    state = {
      ...state,
      presentation: {
        ...state.presentation,
        open: true,
        slide: Math.max(0, Math.min(3, slide)),
        focusedIdeaId: state.selectedIdeaId,
      },
    };
    emit();
  },

  closePresentation() {
    state = {
      ...state,
      presentation: {
        ...state.presentation,
        open: false,
      },
    };
    emit();
  },

  setPresentationSlide(slide: number) {
    state = {
      ...state,
      presentation: {
        ...state.presentation,
        slide: Math.max(0, Math.min(3, slide)),
      },
    };
    emit();
  },

  setPresentationFocusIdea(id: number) {
    state = {
      ...state,
      presentation: {
        ...state.presentation,
        focusedIdeaId: id,
      },
    };
    emit();
  },

  togglePresentationSource(useSimulated: boolean) {
    state = {
      ...state,
      presentation: {
        ...state.presentation,
        useSimulatedData: useSimulated,
      },
    };
    emit();
  },

  toggleDiagnostics() {
    state = {
      ...state,
      diagnosticsOpen: !state.diagnosticsOpen,
    };
    emit();
  },

  dismissNotice() {
    if (noticeTimer) clearTimeout(noticeTimer);
    state = { ...state, notice: null };
    emit();
  },

  notify(text: string, tone: ToastNotice['tone'] = 'info') {
    setNotice(text, tone);
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): WorkspaceState {
  return state;
}

const serverSnapshot: WorkspaceState = state;
function getServerSnapshot(): WorkspaceState {
  return serverSnapshot;
}

export function useWorkspaceSelector<T>(selector: (s: WorkspaceState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getServerSnapshot()),
  );
}
