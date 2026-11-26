/**
 * Automated verification suite for IdeaQuest 2.0:
 *   - Canonical LKPD 5 data integrity & Idea #10 transparency
 *   - 2D + 3D coordinate mapping (X=Feasibility, Y=Impact, Z=depth separation only)
 *   - 4 Decision Lenses (Portfolio, Priority Focus, 4 Quadrant Mini-Matrices, Tie-Preserving Ranking)
 *   - Live score simulation, drag-and-drop snapping, reset single & reset all
 *   - 3D/2D view mode & WebGL fallback state transitions
 *   - CSV export & full HTML rendering across every section & Presentation Mode slide
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { INITIAL_IDEAS, QUADRANTS, CRITICAL_ANALYSIS_ITEMS } from '../src/data/ideas.js';
import {
  buildCsvContent,
  compute3DNodePositions,
  computeMarkerPositions,
  computeScoreRanking,
  computeSummaryStats,
  dropPositionToQuadrantScores,
  getQuadrantId,
  getTotalScore,
  groupIdeasByQuadrant,
} from '../src/utils/matrix.js';
import { createIdeaQuestStore } from '../src/state/store.js';
import { renderOverviewHero } from '../src/components/OverviewHero.js';
import { renderSummaryStats } from '../src/components/SummaryStats.js';
import { renderPriorityMatrix } from '../src/components/PriorityMatrix.js';
import { renderIdeaInspector } from '../src/components/IdeaInspector.js';
import { renderDecisionLenses } from '../src/components/DecisionLenses.js';
import { renderIdeaExplorer } from '../src/components/IdeaExplorer.js';
import { renderFinalSelection } from '../src/components/FinalSelection.js';
import { renderCriticalAnalysis } from '../src/components/CriticalAnalysis.js';
import { renderPresentationMode } from '../src/components/PresentationMode.js';
import { renderExportControls } from '../src/components/ExportControls.js';

test('Canonical LKPD 5 dataset preserves all 10 ideas and exact original scores', () => {
  assert.equal(INITIAL_IDEAS.length, 10);

  const expected = [
    [1, 5, 5, 10, 'I', true],
    [2, 4, 5, 9, 'I', true],
    [3, 4, 5, 9, 'I', true],
    [4, 5, 3, 8, 'II', false],
    [5, 4, 3, 7, 'II', false],
    [6, 3, 4, 7, 'III', false],
    [7, 3, 4, 7, 'III', false],
    [8, 2, 4, 6, 'III', false],
    [9, 4, 2, 6, 'II', false],
    [10, 1, 4, 5, 'III', false],
  ];

  expected.forEach(([id, f, i, total, quadrant, isFinal], idx) => {
    const idea = INITIAL_IDEAS[idx];
    assert.equal(idea.id, id);
    assert.equal(idea.originalFeasibility, f);
    assert.equal(idea.originalImpact, i);
    assert.equal(getTotalScore(idea.originalFeasibility, idea.originalImpact), total);
    assert.equal(getQuadrantId(idea.originalFeasibility, idea.originalImpact), quadrant);
    assert.equal(idea.isOriginalFinalSelection, isFinal);
  });
});

test('Idea 10 keeps original LKPD wording while plotting consistently in Quadrant III', () => {
  const idea10 = INITIAL_IDEAS.find((i) => i.id === 10);
  assert.ok(idea10);
  assert.match(idea10.originalQuadrantLabel, /Prioritas Rendah/);
  assert.equal(getQuadrantId(idea10.originalFeasibility, idea10.originalImpact), 'III');
  assert.ok(idea10.quadrantDiscrepancyNote && idea10.quadrantDiscrepancyNote.length > 20);
});

test('3D coordinate mapping keeps exact X/Y positions and uses Z strictly to separate coincident nodes', () => {
  const store = createIdeaQuestStore();
  const pos3d = compute3DNodePositions(store.getState().ideas);

  // Coincident pair (4,5): Ideas 2 and 3 share exact X & Y, distinct Z depth
  const p2 = pos3d.get(2);
  const p3 = pos3d.get(3);
  assert.equal(p2.x, p3.x);
  assert.equal(p2.y, p3.y);
  assert.notEqual(p2.z, p3.z);

  // Coincident pair (3,4): Ideas 6 and 7 share exact X & Y, distinct Z depth
  const p6 = pos3d.get(6);
  const p7 = pos3d.get(7);
  assert.equal(p6.x, p7.x);
  assert.equal(p6.y, p7.y);
  assert.notEqual(p6.z, p7.z);

  // Non-overlapping node #1 sits at exact higher X than #2 and same Y as #2
  const p1 = pos3d.get(1);
  assert.ok(p1.x > p2.x);
  assert.equal(p1.y, p2.y);
});

test('2D coincident markers receive deterministic offsets without altering scores', () => {
  const store = createIdeaQuestStore();
  const positions = computeMarkerPositions(store.getState().ideas);

  const p2 = positions.get(2);
  const p3 = positions.get(3);
  assert.equal(p2.baseX, p3.baseX);
  assert.equal(p2.baseY, p3.baseY);
  assert.notEqual(`${p2.offsetX},${p2.offsetY}`, `${p3.offsetX},${p3.offsetY}`);
});

test('Decision lenses derive exact tie-preserving ranking and quadrant groupings from LKPD scores', () => {
  const store = createIdeaQuestStore();
  const ideas = store.getState().ideas;

  const ranking = computeScoreRanking(ideas);
  assert.equal(ranking.length, 10);
  assert.equal(ranking[0].idea.id, 1);
  assert.equal(ranking[0].rank, 1);
  assert.equal(ranking[0].total, 10);

  // Tied at 9: Ideas 2 and 3 both share rank 2
  assert.equal(ranking[1].rank, 2);
  assert.equal(ranking[2].rank, 2);
  assert.equal(ranking[1].isTied, true);
  assert.equal(ranking[2].isTied, true);

  // Next distinct score 8 is rank 4
  assert.equal(ranking[3].idea.id, 4);
  assert.equal(ranking[3].rank, 4);

  // Tied at 7: Ideas 5, 6, 7 share rank 5
  assert.equal(ranking[4].rank, 5);
  assert.equal(ranking[5].rank, 5);
  assert.equal(ranking[6].rank, 5);

  const grouped = groupIdeasByQuadrant(ideas);
  assert.deepEqual(grouped.I.map((i) => i.id), [1, 2, 3]);
  assert.deepEqual(grouped.II.map((i) => i.id), [4, 5, 9]);
  assert.deepEqual(grouped.III.map((i) => i.id), [6, 7, 8, 10]);
  assert.deepEqual(grouped.IV.map((i) => i.id), []);
});

test('Summary stats, simulation, drag snapping, WebGL fallback, and reset work seamlessly', () => {
  const store = createIdeaQuestStore();
  const initialStats = computeSummaryStats(store.getState().ideas);
  assert.equal(initialStats.averageTotalFormatted, '7.4');
  assert.equal(initialStats.priorityCount, 3);

  // View mode toggle & WebGL fallback
  store.setViewMode('2d');
  assert.equal(store.getState().viewMode, '2d');
  store.setViewMode('3d');
  assert.equal(store.getState().viewMode, '3d');
  store.setWebglStatus('unavailable');
  assert.equal(store.getState().viewMode, '2d');

  // Simulate moving Idea 10 into Quadrant I
  store.updateScore(10, 5, 5, 'slider');
  const simStats = computeSummaryStats(store.getState().ideas);
  assert.equal(simStats.priorityCount, 4);
  assert.equal(simStats.originalPriorityCount, 3);
  assert.equal(simStats.averageTotalFormatted, '7.9');

  // Original selected trio never mutates under simulation
  assert.deepEqual(
    store.getState().ideas.filter((i) => i.isOriginalFinalSelection).map((i) => i.id),
    [1, 2, 3]
  );

  // Drag snapping stays inside target quadrant bounds
  for (const [qId, q] of Object.entries(QUADRANTS)) {
    const snapped = dropPositionToQuadrantScores(55, 55, qId);
    assert.ok(snapped.feasibility >= q.bounds.minF && snapped.feasibility <= q.bounds.maxF);
    assert.ok(snapped.impact >= q.bounds.minI && snapped.impact <= q.bounds.maxI);
    assert.equal(getQuadrantId(snapped.feasibility, snapped.impact), qId);
  }

  // Reset single & reset all
  store.resetIdea(10);
  assert.equal(computeSummaryStats(store.getState().ideas).modifiedCount, 0);
  store.moveIdeaToQuadrant(1, 'IV', null, 'quadrant-button');
  assert.equal(computeSummaryStats(store.getState().ideas).modifiedCount, 1);
  store.resetAll();
  assert.equal(computeSummaryStats(store.getState().ideas).modifiedCount, 0);
  assert.equal(computeSummaryStats(store.getState().ideas).averageTotalFormatted, '7.4');
});

test('CSV export includes all required headers and both original and simulated scores', () => {
  const store = createIdeaQuestStore();
  store.updateScore(4, 5, 5, 'slider');
  const csv = buildCsvContent(store.getState().ideas);
  assert.ok(csv.startsWith('\uFEFF'));
  const lines = csv.trim().split('\n');
  assert.equal(lines.length, 11);
  assert.match(lines[0], /No,Nama Ide,SCAMPER,Feasibility Asli,Impact Asli,Total Asli,Kuadran Asli LKPD,Feasibility Saat Ini,Impact Saat Ini,Total Saat Ini,Kuadran Saat Ini/);
  assert.match(lines[4], /5,3,8,.*5,5,10,I — Prioritas Utama,Simulasi/);
});

test('All IdeaQuest 2.0 components, 4 decision lenses, and 4 presentation slides render clean HTML', () => {
  const store = createIdeaQuestStore();
  const state = store.getState();

  const heroHtml = renderOverviewHero(state);
  assert.match(heroHtml, /Ten ideas\. One clear direction\./);

  const statsHtml = renderSummaryStats(state);
  assert.match(statsHtml, /7\.4/);

  const matrixHtml = renderPriorityMatrix(state);
  assert.match(matrixHtml, /3D Space/);
  assert.match(matrixHtml, /2D Matrix/);
  for (let id = 1; id <= 10; id += 1) {
    assert.ok(matrixHtml.includes(`data-marker-id="${id}"`), `Missing 2D marker #${id}`);
  }
  assert.doesNotMatch(matrixHtml, /\bundefined\b|\bNaN\b/);

  // Render all 4 Decision Lenses
  for (const lens of ['portfolio', 'priority', 'quadrants', 'ranking']) {
    store.setActiveLens(lens);
    const lensHtml = renderDecisionLenses(store.getState());
    assert.doesNotMatch(lensHtml, /\bundefined\b|\bNaN\b/);
    if (lens === 'ranking') assert.match(lensHtml, /TIE/);
    if (lens === 'priority') assert.match(lensHtml, /SmartMargin Guard/);
  }

  // Idea #10 inspector discrepancy note
  store.selectIdea(10);
  const inspector10 = renderIdeaInspector(store.getState());
  assert.match(inspector10, /Transparansi Sumber/);
  assert.match(inspector10, /Prioritas Rendah \(Feasibility Rendah, Impact Tinggi\)/);

  const explorerHtml = renderIdeaExplorer(store.getState());
  assert.match(explorerHtml, /SHOWING 10 OF 10 IDEAS/);

  const finalHtml = renderFinalSelection(store.getState());
  assert.match(finalHtml, /SmartMargin Guard/);
  assert.match(finalHtml, /ReversePrice Planner/);
  assert.match(finalHtml, /Simulasi Multi-Platform/);

  assert.equal(CRITICAL_ANALYSIS_ITEMS.length, 5);
  const analysisHtml = renderCriticalAnalysis();
  assert.match(analysisHtml, /LKPD SOURCE/);
  assert.match(analysisHtml, /IMPLEMENTATION REC/);

  const exportHtml = renderExportControls(store.getState());
  assert.match(exportHtml, /lokal di sesi browser ini/);

  for (let s = 0; s < 4; s += 1) {
    store.openPresentation(s);
    const presHtml = renderPresentationMode(store.getState());
    assert.match(presHtml, new RegExp(`SLIDE ${s + 1} / 4`));
    assert.doesNotMatch(presHtml, /\bundefined\b|\bNaN\b/);
  }
});
