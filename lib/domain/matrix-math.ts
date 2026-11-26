import {
  QUADRANTS,
  QUADRANT_IDS,
  SCORE_LEVEL_LABELS,
} from '@/lib/data/lkpd-data';
import type {
  IdeaFilters,
  IdeaItem,
  QuadrantDefinition,
  QuadrantId,
} from '@/types/idea';

export const SCORE_MIN = 1;
export const SCORE_MAX = 5;
export const HIGH_THRESHOLD = 4;

export const THRESHOLD_X_PERCENT = 59.5;
export const THRESHOLD_Y_PERCENT = 59;

export const SCENE_STEP = 1.45;
export const SCENE_Y_BASE = 0.85;

export function clampScore(value: number): number {
  const num = Math.round(Number(value));
  if (Number.isNaN(num)) return SCORE_MIN;
  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, num));
}

export function getQuadrantId(feasibility: number, impact: number): QuadrantId {
  const highF = feasibility >= HIGH_THRESHOLD;
  const highI = impact >= HIGH_THRESHOLD;
  if (highF && highI) return 'I';
  if (highF && !highI) return 'II';
  if (!highF && highI) return 'III';
  return 'IV';
}

export function getQuadrantMeta(feasibility: number, impact: number): QuadrantDefinition {
  return QUADRANTS[getQuadrantId(feasibility, impact)];
}

export function getTotalScore(feasibility: number, impact: number): number {
  return feasibility + impact;
}

export function getScoreLevelMeta(score: number): { level: string; summary: string; full: string } {
  const s = clampScore(score);
  const meta = SCORE_LEVEL_LABELS[s] || SCORE_LEVEL_LABELS[1];
  return {
    ...meta,
    full: `${meta.level}: ${meta.summary}`,
  };
}

export function scoreToPercentX(score: number): number {
  return 12 + (clampScore(score) - 1) * 19;
}

export function scoreToPercentY(score: number): number {
  return 14 + (clampScore(score) - 1) * 18;
}

export function dropPositionToQuadrantScores(
  percentX: number | null | undefined,
  percentY: number | null | undefined,
  targetQuadrantId: QuadrantId,
): { feasibility: number; impact: number } {
  const q = QUADRANTS[targetQuadrantId];
  if (!q) return { feasibility: 4, impact: 4 };
  if (
    typeof percentX !== 'number' ||
    typeof percentY !== 'number' ||
    Number.isNaN(percentX) ||
    Number.isNaN(percentY)
  ) {
    return { ...q.representativePoint };
  }

  const rawF = Math.round((percentX - 12) / 19) + 1;
  const rawI = Math.round((percentY - 14) / 18) + 1;

  return {
    feasibility: Math.max(q.bounds.minF, Math.min(q.bounds.maxF, rawF)),
    impact: Math.max(q.bounds.minI, Math.min(q.bounds.maxI, rawI)),
  };
}

export interface MarkerLayoutPoint {
  baseX: number;
  baseY: number;
  offsetX: number;
  offsetY: number;
  clusterSize: number;
  clusterIndex: number;
  clusterKey: string;
  peers: number[];
}

export function computeMarkerPositions(ideas: readonly IdeaItem[]): Map<number, MarkerLayoutPoint> {
  const groups = new Map<string, IdeaItem[]>();
  for (const idea of ideas) {
    const key = `${idea.feasibility},${idea.impact}`;
    const existing = groups.get(key);
    if (existing) existing.push(idea);
    else groups.set(key, [idea]);
  }

  const layout = new Map<number, MarkerLayoutPoint>();
  for (const [key, group] of groups.entries()) {
    const sorted = [...group].sort((a, b) => a.id - b.id);
    const count = sorted.length;

    sorted.forEach((idea, idx) => {
      const baseX = scoreToPercentX(idea.feasibility);
      const baseY = scoreToPercentY(idea.impact);
      let offsetX = 0;
      let offsetY = 0;

      if (count === 2) {
        offsetX = idx === 0 ? -18 : 18;
        offsetY = idx === 0 ? 16 : -16;
      } else if (count === 3) {
        const offsets = [
          { x: 0, y: 22 },
          { x: -30, y: -15 },
          { x: 30, y: -15 },
        ];
        offsetX = offsets[idx].x;
        offsetY = offsets[idx].y;
      } else if (count >= 4) {
        const angle = (Math.PI * 2 * idx) / count - Math.PI / 2;
        offsetX = Math.round(Math.cos(angle) * 32);
        offsetY = Math.round(Math.sin(angle) * 24);
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

export function scoreToWorldX(feasibility: number): number {
  return (clampScore(feasibility) - 3) * SCENE_STEP;
}

export function scoreToWorldY(impact: number): number {
  return SCENE_Y_BASE + (clampScore(impact) - 1) * SCENE_STEP;
}

export interface Node3DPosition {
  x: number;
  y: number;
  z: number;
  origX: number;
  origY: number;
  clusterSize: number;
  clusterIndex: number;
  clusterKey: string;
}

export function compute3DNodePositions(ideas: readonly IdeaItem[]): Map<number, Node3DPosition> {
  const groups = new Map<string, IdeaItem[]>();
  for (const idea of ideas) {
    const key = `${idea.feasibility},${idea.impact}`;
    const existing = groups.get(key);
    if (existing) existing.push(idea);
    else groups.set(key, [idea]);
  }

  const positions = new Map<number, Node3DPosition>();
  for (const [key, group] of groups.entries()) {
    const sorted = [...group].sort((a, b) => a.id - b.id);
    const count = sorted.length;

    sorted.forEach((idea, idx) => {
      const x = scoreToWorldX(idea.feasibility);
      const y = scoreToWorldY(idea.impact);
      // Z axis is strictly visual depth to prevent overlapping spheres at identical (X, Y) scores.
      let z = 0.58;
      if (count === 2) {
        z = idx === 0 ? 0.38 : 1.08;
      } else if (count >= 3) {
        z = 0.34 + idx * 0.54;
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

export interface RankedIdeaEntry {
  idea: IdeaItem;
  total: number;
  originalTotal: number;
  quadrant: QuadrantDefinition;
  rank: number;
  isTied: boolean;
  tieCount: number;
}

export function computeScoreRanking(ideas: readonly IdeaItem[]): RankedIdeaEntry[] {
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

  const totalCounts = new Map<number, number>();
  for (const item of enriched) {
    totalCounts.set(item.total, (totalCounts.get(item.total) || 0) + 1);
  }

  let currentRank = 1;
  return enriched.map((item, idx) => {
    if (idx > 0 && item.total < enriched[idx - 1].total) {
      currentRank = idx + 1;
    }
    const tieCount = totalCounts.get(item.total) || 1;
    return {
      ...item,
      rank: currentRank,
      isTied: tieCount > 1,
      tieCount,
    };
  });
}

export interface StairStepGroup {
  stepNumber: number;
  rank: number;
  totalScore: number;
  isTied: boolean;
  items: RankedIdeaEntry[];
}

export function computePriorityStaircase(ideas: readonly IdeaItem[]): StairStepGroup[] {
  const ranked = computeScoreRanking(ideas);
  const groups: StairStepGroup[] = [];

  for (const entry of ranked) {
    const last = groups[groups.length - 1];
    if (last && last.totalScore === entry.total) {
      last.items.push(entry);
      last.isTied = true;
    } else {
      groups.push({
        stepNumber: groups.length + 1,
        rank: entry.rank,
        totalScore: entry.total,
        isTied: entry.isTied,
        items: [entry],
      });
    }
  }

  return groups;
}

export function groupIdeasByQuadrant(ideas: readonly IdeaItem[]): Record<QuadrantId, IdeaItem[]> {
  const grouped: Record<QuadrantId, IdeaItem[]> = { I: [], II: [], III: [], IV: [] };
  for (const idea of ideas) {
    const qId = getQuadrantId(idea.feasibility, idea.impact);
    grouped[qId].push(idea);
  }
  return grouped;
}

export function filterAndSortIdeas(
  ideas: readonly IdeaItem[],
  filters: IdeaFilters,
): IdeaItem[] {
  const query = filters.search.trim().toLowerCase();

  const filtered = ideas.filter((idea) => {
    const qId = getQuadrantId(idea.feasibility, idea.impact);
    if (filters.quadrant !== 'all' && qId !== filters.quadrant) return false;
    if (filters.scamper !== 'all' && idea.scamperCode !== filters.scamper) return false;
    if (filters.origin !== 'all' && idea.origin !== filters.origin) return false;

    if (query) {
      const haystack = [
        `#${idea.id}`,
        String(idea.id),
        idea.name,
        idea.shortLabel,
        idea.conceptName || '',
        idea.description,
        idea.scamper,
        idea.rationale,
        idea.sellerBenefit,
        idea.buyerBenefit,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  const sorted = [...filtered];
  sorted.sort((a, b) => {
    const totalA = getTotalScore(a.feasibility, a.impact);
    const totalB = getTotalScore(b.feasibility, b.impact);
    switch (filters.sortBy) {
      case 'totalDesc':
        if (totalB !== totalA) return totalB - totalA;
        if (b.impact !== a.impact) return b.impact - a.impact;
        return a.id - b.id;
      case 'totalAsc':
        if (totalA !== totalB) return totalA - totalB;
        return a.id - b.id;
      case 'feasibilityDesc':
        if (b.feasibility !== a.feasibility) return b.feasibility - a.feasibility;
        if (b.impact !== a.impact) return b.impact - a.impact;
        return a.id - b.id;
      case 'impactDesc':
        if (b.impact !== a.impact) return b.impact - a.impact;
        if (b.feasibility !== a.feasibility) return b.feasibility - a.feasibility;
        return a.id - b.id;
      case 'nameAsc':
        return a.name.localeCompare(b.name, 'id');
      case 'idAsc':
      default:
        return a.id - b.id;
    }
  });

  return sorted;
}

export interface SummaryMetrics {
  totalIdeas: number;
  lkpdActiveCount: number;
  customCount: number;
  quadrantTotal: number;
  priorityCount: number;
  countsByQuadrant: Record<QuadrantId, number>;
  averageTotal: number;
  averageTotalFormatted: string;
  modifiedCount: number;
  hasSimulatedChanges: boolean;
}

export function computeSummaryStats(
  ideas: readonly IdeaItem[],
  hiddenLkpdCount = 0,
): SummaryMetrics {
  const totalIdeas = ideas.length;
  const countsByQuadrant: Record<QuadrantId, number> = { I: 0, II: 0, III: 0, IV: 0 };
  let totalScoreSum = 0;
  let modifiedCount = 0;
  let lkpdActiveCount = 0;
  let customCount = 0;

  for (const idea of ideas) {
    const q = getQuadrantId(idea.feasibility, idea.impact);
    countsByQuadrant[q] += 1;
    totalScoreSum += getTotalScore(idea.feasibility, idea.impact);
    if (idea.isModified) modifiedCount += 1;
    if (idea.origin === 'lkpd') lkpdActiveCount += 1;
    else customCount += 1;
  }

  const averageTotal = totalIdeas > 0 ? totalScoreSum / totalIdeas : 0;

  return {
    totalIdeas,
    lkpdActiveCount,
    customCount,
    quadrantTotal: QUADRANT_IDS.length,
    priorityCount: countsByQuadrant.I,
    countsByQuadrant,
    averageTotal,
    averageTotalFormatted: averageTotal.toFixed(1).replace('.', ','),
    modifiedCount,
    hasSimulatedChanges: modifiedCount > 0 || customCount > 0 || hiddenLkpdCount > 0,
  };
}

function csvEscape(value: unknown): string {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildCsvContent(ideas: readonly IdeaItem[]): string {
  const headers = [
    'No',
    'Sumber Data',
    'Nama Ide',
    'Deskripsi',
    'Kategori SCAMPER',
    'Kelayakan Awal',
    'Dampak Awal',
    'Kelayakan Saat Ini',
    'Dampak Saat Ini',
    'Total Skor',
    'Kuadran Saat Ini',
    'Manfaat Penjual',
    'Manfaat Pembeli',
    'Alasan Pemilihan',
    'Status Data',
  ];

  const rows = ideas.map((idea) => {
    const currTotal = getTotalScore(idea.feasibility, idea.impact);
    const currQ = getQuadrantMeta(idea.feasibility, idea.impact);
    const statusLabel =
      idea.origin === 'custom'
        ? 'Ide Tambahan'
        : idea.isModified
          ? 'Simulasi / Diedit'
          : 'Data Awal LKPD 5';

    return [
      idea.id,
      idea.origin === 'lkpd' ? 'LKPD 5' : 'Tambahan Pengguna',
      idea.name,
      idea.description,
      idea.scamper,
      idea.originalFeasibility,
      idea.originalImpact,
      idea.feasibility,
      idea.impact,
      currTotal,
      `${currQ.roman} — ${currQ.name}`,
      idea.sellerBenefit,
      idea.buyerBenefit,
      idea.rationale,
      statusLabel,
    ]
      .map(csvEscape)
      .join(',');
  });

  return `\uFEFF${headers.map(csvEscape).join(',')}\n${rows.join('\n')}\n`;
}
