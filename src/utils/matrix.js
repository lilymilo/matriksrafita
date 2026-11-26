/**
 * Pure domain utilities for the Feasibility vs Impact Matrix (2D + 3D + Decision Lenses).
 * Preserves exact 1–5 LKPD scores and the High (4–5) / Low (1–3) threshold.
 */

import { QUADRANTS, QUADRANT_IDS } from '../data/ideas.js';

export const SCORE_MIN = 1;
export const SCORE_MAX = 5;
export const HIGH_THRESHOLD = 4;

/**
 * Clamp an integer score safely to [1, 5].
 */
export function clampScore(value) {
  const num = Math.round(Number(value));
  if (Number.isNaN(num)) return SCORE_MIN;
  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, num));
}

/**
 * Classify a (feasibility, impact) coordinate into quadrant I, II, III, or IV.
 * High = 4–5, Low = 1–3 (threshold between 3 and 4).
 */
export function getQuadrantId(feasibility, impact) {
  const highF = feasibility >= HIGH_THRESHOLD;
  const highI = impact >= HIGH_THRESHOLD;
  if (highF && highI) return 'I';
  if (highF && !highI) return 'II';
  if (!highF && highI) return 'III';
  return 'IV';
}

export function getQuadrantMeta(feasibility, impact) {
  return QUADRANTS[getQuadrantId(feasibility, impact)];
}

export function getTotalScore(feasibility, impact) {
  return feasibility + impact;
}

/**
 * 2D Cartesian coordinate scale:
 * Strictly linear & proportional on scores 1..5 with clean 14% top/bottom and
 * 12% left/right architectural margins so quadrant corner headers and marker pills
 * never collide at extreme coordinates (1, 1) or (5, 5):
 *   Y: 1 -> 14%, 2 -> 32%, 3 -> 50%, threshold 3.5 -> 59%, 4 -> 68%, 5 -> 86%
 *   X: 1 -> 12%, 2 -> 31%, 3 -> 50%, threshold 3.5 -> 59.5%, 4 -> 69%, 5 -> 88%
 */
export const THRESHOLD_X_PERCENT = 59.5;
export const THRESHOLD_Y_PERCENT = 59;
export const THRESHOLD_PERCENT = 59;

export function scoreToPercentX(score) {
  return 12 + (clampScore(score) - 1) * 19;
}

export function scoreToPercentY(score) {
  return 14 + (clampScore(score) - 1) * 18;
}

export function scoreToPercent(score, axis = 'x') {
  return axis === 'y' ? scoreToPercentY(score) : scoreToPercentX(score);
}

/**
 * Inverse mapping for 2D drag-and-drop: maps drop percentage inside the Cartesian
 * plane to the nearest valid integer score inside the target quadrant.
 */
export function dropPositionToQuadrantScores(percentX, percentY, targetQuadrantId) {
  const q = QUADRANTS[targetQuadrantId];
  if (!q) return { feasibility: 4, impact: 4 };
  if (typeof percentX !== 'number' || typeof percentY !== 'number' || Number.isNaN(percentX) || Number.isNaN(percentY)) {
    return { ...q.representativePoint };
  }

  const rawF = Math.round((percentX - 12) / 19) + 1;
  const rawI = Math.round((percentY - 14) / 18) + 1;

  return {
    feasibility: Math.max(q.bounds.minF, Math.min(q.bounds.maxF, rawF)),
    impact: Math.max(q.bounds.minI, Math.min(q.bounds.maxI, rawI)),
  };
}

/**
 * Deterministic 2D layout for markers so coincident coordinates (e.g., Ideas 2 & 3
 * at (4,5) and Ideas 6 & 7 at (3,4)) remain clearly separated and individually
 * clickable without altering stored scores.
 */
export function computeMarkerPositions(ideas) {
  const groups = new Map();
  for (const idea of ideas) {
    const key = `${idea.feasibility},${idea.impact}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(idea);
  }

  const layout = new Map();
  for (const [key, group] of groups.entries()) {
    const sorted = [...group].sort((a, b) => a.id - b.id);
    const count = sorted.length;

    sorted.forEach((idea, idx) => {
      const baseX = scoreToPercentX(idea.feasibility);
      const baseY = scoreToPercentY(idea.impact);
      let offsetX = 0;
      let offsetY = 0;

      if (count === 2) {
        offsetX = idx === 0 ? -16 : 16;
        offsetY = idx === 0 ? 15 : -15;
      } else if (count === 3) {
        const offsets = [
          { x: 0, y: 20 },
          { x: -28, y: -14 },
          { x: 28, y: -14 },
        ];
        offsetX = offsets[idx].x;
        offsetY = offsets[idx].y;
      } else if (count >= 4) {
        const angle = (Math.PI * 2 * idx) / count - Math.PI / 2;
        offsetX = Math.round(Math.cos(angle) * 30);
        offsetY = Math.round(Math.sin(angle) * 22);
      }

      layout.set(idea.id, {
        baseX,
        baseY,
        offsetX,
        offsetY,
        clusterSize: count,
        clusterIndex: idx,
        clusterKey: key,
        peers: sorted.map((p) => p.id),
      });
    });
  }

  return layout;
}

/**
 * 3D World Space Coordinate Mapping for Three.js Idea Space:
 * - X axis = Feasibility (1..5), metric step 1.45, centered around 3.0
 * - Y axis = Impact (1..5), metric step 1.45, resting cleanly above ground plinth
 * - Z axis = VISUAL DEPTH ONLY (deterministic slight separation for coincident coordinates;
 *   never represents a third scoring dimension).
 */
export const SCENE_STEP = 1.45;
export const SCENE_Y_BASE = 0.85;

export function scoreToWorldX(feasibility) {
  return (clampScore(feasibility) - 3) * SCENE_STEP;
}

export function scoreToWorldY(impact) {
  return SCENE_Y_BASE + (clampScore(impact) - 1) * SCENE_STEP;
}

export function compute3DNodePositions(ideas) {
  const groups = new Map();
  for (const idea of ideas) {
    const key = `${idea.feasibility},${idea.impact}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(idea);
  }

  const positions = new Map();
  for (const [key, group] of groups.entries()) {
    const sorted = [...group].sort((a, b) => a.id - b.id);
    const count = sorted.length;

    sorted.forEach((idea, idx) => {
      const x = scoreToWorldX(idea.feasibility);
      const y = scoreToWorldY(idea.impact);
      // Visual depth only: single nodes sit at z=0.58; coincident points separate cleanly along Z
      let z = 0.58;
      if (count === 2) {
        z = idx === 0 ? 0.36 : 1.04;
      } else if (count >= 3) {
        z = 0.32 + idx * 0.54;
      }

      positions.set(idea.id, {
        x,
        y,
        z,
        origX: scoreToWorldX(idea.originalFeasibility),
        origY: scoreToWorldY(idea.originalImpact),
        clusterSize: count,
        clusterIndex: idx,
        clusterKey: key,
      });
    });
  }

  return positions;
}

/**
 * Derived total-score ranking (Feasibility + Impact) with ties explicitly preserved.
 * Not a separate scoring criterion — strictly derived from the two LKPD scores.
 */
export function computeScoreRanking(ideas) {
  const enriched = ideas.map((idea) => ({
    idea,
    total: getTotalScore(idea.feasibility, idea.impact),
    originalTotal: getTotalScore(idea.originalFeasibility, idea.originalImpact),
    quadrant: getQuadrantMeta(idea.feasibility, idea.impact),
  }));

  enriched.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.idea.impact !== a.idea.impact) return b.idea.impact - a.idea.impact;
    if (b.idea.feasibility !== a.idea.feasibility) return b.idea.feasibility - a.idea.feasibility;
    return a.idea.id - b.idea.id;
  });

  // Assign competition ranks (1, 2, 2, 4, 5, 5, 5, 8, 8, 10) and tie counts
  const totalCounts = new Map();
  for (const item of enriched) {
    totalCounts.set(item.total, (totalCounts.get(item.total) || 0) + 1);
  }

  let currentRank = 1;
  return enriched.map((item, idx) => {
    if (idx > 0 && item.total < enriched[idx - 1].total) {
      currentRank = idx + 1;
    }
    return {
      ...item,
      rank: currentRank,
      isTied: totalCounts.get(item.total) > 1,
      tieCount: totalCounts.get(item.total),
    };
  });
}

/**
 * Group ideas by current quadrant ID for the 4 Mini-Matrices comparison view.
 */
export function groupIdeasByQuadrant(ideas) {
  const grouped = { I: [], II: [], III: [], IV: [] };
  for (const idea of ideas) {
    const qId = getQuadrantId(idea.feasibility, idea.impact);
    grouped[qId].push(idea);
  }
  return grouped;
}

/**
 * Compute dynamic summary statistics from the current ideas array.
 */
export function computeSummaryStats(ideas) {
  const totalIdeas = ideas.length;
  const countsByQuadrant = { I: 0, II: 0, III: 0, IV: 0 };
  const originalCountsByQuadrant = { I: 0, II: 0, III: 0, IV: 0 };
  let totalScoreSum = 0;
  let originalScoreSum = 0;
  let modifiedCount = 0;

  for (const idea of ideas) {
    const q = getQuadrantId(idea.feasibility, idea.impact);
    const origQ = getQuadrantId(idea.originalFeasibility, idea.originalImpact);
    countsByQuadrant[q] += 1;
    originalCountsByQuadrant[origQ] += 1;
    totalScoreSum += getTotalScore(idea.feasibility, idea.impact);
    originalScoreSum += getTotalScore(idea.originalFeasibility, idea.originalImpact);
    if (idea.feasibility !== idea.originalFeasibility || idea.impact !== idea.originalImpact) {
      modifiedCount += 1;
    }
  }

  const averageTotal = totalIdeas > 0 ? totalScoreSum / totalIdeas : 0;
  const originalAverageTotal = totalIdeas > 0 ? originalScoreSum / totalIdeas : 0;

  return {
    totalIdeas,
    quadrantTotal: QUADRANT_IDS.length,
    priorityCount: countsByQuadrant.I,
    originalPriorityCount: originalCountsByQuadrant.I,
    countsByQuadrant,
    originalCountsByQuadrant,
    averageTotal,
    averageTotalFormatted: averageTotal.toFixed(1),
    originalAverageTotal,
    originalAverageTotalFormatted: originalAverageTotal.toFixed(1),
    modifiedCount,
    hasModifications: modifiedCount > 0,
  };
}

function csvEscape(value) {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generate RFC 4180 CSV export with UTF-8 BOM containing original & simulated scores.
 */
export function buildCsvContent(ideas) {
  const headers = [
    'No',
    'Nama Ide',
    'SCAMPER',
    'Feasibility Asli',
    'Impact Asli',
    'Total Asli',
    'Kuadran Asli LKPD',
    'Feasibility Saat Ini',
    'Impact Saat Ini',
    'Total Saat Ini',
    'Kuadran Saat Ini',
    'Status Simulasi',
    'Pilihan Final LKPD',
  ];

  const rows = ideas.map((idea) => {
    const origTotal = getTotalScore(idea.originalFeasibility, idea.originalImpact);
    const currTotal = getTotalScore(idea.feasibility, idea.impact);
    const currQ = getQuadrantMeta(idea.feasibility, idea.impact);
    const isModified = idea.feasibility !== idea.originalFeasibility || idea.impact !== idea.originalImpact;

    return [
      idea.id,
      idea.name,
      idea.scamper,
      idea.originalFeasibility,
      idea.originalImpact,
      origTotal,
      idea.originalQuadrantLabel,
      idea.feasibility,
      idea.impact,
      currTotal,
      `${currQ.roman} — ${currQ.name}`,
      isModified ? 'Simulasi' : 'Asli LKPD',
      idea.isOriginalFinalSelection ? `Ya (${idea.conceptName})` : 'Tidak',
    ].map(csvEscape).join(',');
  });

  return `\uFEFF${headers.map(csvEscape).join(',')}\n${rows.join('\n')}\n`;
}
