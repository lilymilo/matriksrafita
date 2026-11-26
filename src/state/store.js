/**
 * Unidirectional reactive store for IdeaQuest 2.0.
 * Coordinates synchronized state across the 3D Idea Space, 2D Matrix,
 * 4 Decision Lenses, Idea Explorer, Inspector, and Presentation Mode.
 */

import { INITIAL_IDEAS, QUADRANTS } from '../data/ideas.js';
import { clampScore, dropPositionToQuadrantScores, getQuadrantId, getQuadrantMeta } from '../utils/matrix.js';

function createInitialIdeaRecords() {
  return INITIAL_IDEAS.map((item) => ({
    ...item,
    feasibility: item.originalFeasibility,
    impact: item.originalImpact,
    isModified: false,
    modificationSource: null,
  }));
}

export function createIdeaQuestStore() {
  let state = {
    ideas: createInitialIdeaRecords(),
    selectedIdeaId: 1,
    viewMode: '3d', // '3d' | '2d'
    webglStatus: 'pending', // 'pending' | 'ready' | 'unavailable'
    cameraPreset: 'iso', // 'iso' | 'front' | 'top'
    cameraNonce: 0,
    activeLens: 'portfolio', // 'portfolio' | 'priority' | 'quadrants' | 'ranking'
    filters: {
      quadrant: 'all',
      scamper: 'all',
      search: '',
    },
    presentation: {
      open: false,
      slide: 0,
      useSimulatedData: false,
      focusedIdeaId: 1,
    },
    notice: null,
    noticeTimerId: null,
  };

  const listeners = new Set();

  function emit(changeType = 'all') {
    for (const listener of listeners) {
      listener(state, changeType);
    }
  }

  function showNotice(text, tone = 'info') {
    if (state.noticeTimerId && typeof clearTimeout === 'function') {
      clearTimeout(state.noticeTimerId);
    }
    state = {
      ...state,
      notice: { text, tone, id: Date.now() },
      noticeTimerId: null,
    };
    emit('notice');
    if (typeof setTimeout === 'function') {
      const timerId = setTimeout(() => {
        state = { ...state, notice: null, noticeTimerId: null };
        emit('notice');
      }, 4800);
      state.noticeTimerId = timerId;
    }
  }

  return {
    getState() {
      return state;
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    selectIdea(id) {
      const numericId = Number(id);
      if (!state.ideas.some((i) => i.id === numericId)) return;
      state = {
        ...state,
        selectedIdeaId: numericId,
      };
      emit('selection');
    },

    setViewMode(mode) {
      if (mode !== '3d' && mode !== '2d') return;
      if (mode === '3d' && state.webglStatus === 'unavailable') {
        showNotice('WebGL tidak tersedia di perangkat ini; tampilan otomatis menggunakan 2D Matrix.', 'info');
        return;
      }
      if (state.viewMode === mode) return;
      state = {
        ...state,
        viewMode: mode,
      };
      emit('viewMode');
    },

    setWebglStatus(status) {
      if (state.webglStatus === status) return;
      const nextViewMode = status === 'unavailable' ? '2d' : state.viewMode;
      state = {
        ...state,
        webglStatus: status,
        viewMode: nextViewMode,
      };
      emit('viewMode');
    },

    setCameraPreset(preset) {
      if (!['iso', 'front', 'top'].includes(preset)) return;
      state = {
        ...state,
        cameraPreset: preset,
        cameraNonce: state.cameraNonce + 1,
      };
      emit('camera');
    },

    setActiveLens(lens) {
      if (!['portfolio', 'priority', 'quadrants', 'ranking'].includes(lens)) return;
      if (state.activeLens === lens) return;
      state = {
        ...state,
        activeLens: lens,
      };
      emit('lens');
    },

    updateScore(id, nextFeasibility, nextImpact, source = 'slider') {
      const numericId = Number(id);
      const f = clampScore(nextFeasibility);
      const im = clampScore(nextImpact);

      let updatedIdea = null;
      const nextIdeas = state.ideas.map((idea) => {
        if (idea.id !== numericId) return idea;
        const isModified = f !== idea.originalFeasibility || im !== idea.originalImpact;
        updatedIdea = {
          ...idea,
          feasibility: f,
          impact: im,
          isModified,
          modificationSource: isModified ? source : null,
        };
        return updatedIdea;
      });

      if (!updatedIdea) return;
      state = {
        ...state,
        ideas: nextIdeas,
        selectedIdeaId: numericId,
      };
      emit('scores');
    },

    moveIdeaToQuadrant(id, targetQuadrantId, dropCoords = null, source = 'drag') {
      const numericId = Number(id);
      const idea = state.ideas.find((item) => item.id === numericId);
      const quadrant = QUADRANTS[targetQuadrantId];
      if (!idea || !quadrant) return;

      const currentQ = getQuadrantId(idea.feasibility, idea.impact);
      let nextCoords;

      if (dropCoords && typeof dropCoords.percentX === 'number' && typeof dropCoords.percentY === 'number') {
        nextCoords = dropPositionToQuadrantScores(dropCoords.percentX, dropCoords.percentY, targetQuadrantId);
      } else {
        nextCoords = { ...quadrant.representativePoint };
      }

      if (source === 'quadrant-button' && currentQ === targetQuadrantId) {
        nextCoords = { ...quadrant.representativePoint };
      }

      this.updateScore(numericId, nextCoords.feasibility, nextCoords.impact, source);
      const qMeta = getQuadrantMeta(nextCoords.feasibility, nextCoords.impact);
      showNotice(
        `Simulasi: Ide #${idea.id} dipindahkan ke Kuadran ${qMeta.roman} (${qMeta.name}) — F:${nextCoords.feasibility}, I:${nextCoords.impact}. Skor asli LKPD tetap terjaga.`,
        'simulation'
      );
    },

    resetIdea(id) {
      const numericId = Number(id);
      const target = state.ideas.find((item) => item.id === numericId);
      if (!target) return;

      const nextIdeas = state.ideas.map((idea) => {
        if (idea.id !== numericId) return idea;
        return {
          ...idea,
          feasibility: idea.originalFeasibility,
          impact: idea.originalImpact,
          isModified: false,
          modificationSource: null,
        };
      });

      state = {
        ...state,
        ideas: nextIdeas,
      };
      emit('scores');
      showNotice(`Ide #${target.id} dikembalikan ke skor asli LKPD (${target.originalFeasibility}, ${target.originalImpact}).`, 'success');
    },

    resetAll() {
      state = {
        ...state,
        ideas: createInitialIdeaRecords(),
      };
      emit('scores');
      showNotice('Seluruh 10 ide dikembalikan ke skor asli LKPD 5.', 'success');
    },

    setFilter(patch) {
      state = {
        ...state,
        filters: {
          ...state.filters,
          ...patch,
        },
      };
      emit('filters');
    },

    openPresentation(slide = 0) {
      state = {
        ...state,
        presentation: {
          ...state.presentation,
          open: true,
          slide: Math.max(0, Math.min(3, slide)),
          useSimulatedData: false,
        },
      };
      emit('presentation');
    },

    closePresentation() {
      state = {
        ...state,
        presentation: {
          ...state.presentation,
          open: false,
        },
      };
      emit('presentation');
    },

    setPresentationSlide(slide) {
      state = {
        ...state,
        presentation: {
          ...state.presentation,
          slide: Math.max(0, Math.min(3, slide)),
        },
      };
      emit('presentation');
    },

    setPresentationFocusIdea(id) {
      const numericId = Number(id);
      if (!state.ideas.some((i) => i.id === numericId)) return;
      state = {
        ...state,
        presentation: {
          ...state.presentation,
          focusedIdeaId: numericId,
        },
      };
      emit('presentation');
    },

    togglePresentationDataSource(useSimulated) {
      state = {
        ...state,
        presentation: {
          ...state.presentation,
          useSimulatedData: Boolean(useSimulated),
        },
      };
      emit('presentation');
    },

    notify(text, tone = 'info') {
      showNotice(text, tone);
    },
  };
}
