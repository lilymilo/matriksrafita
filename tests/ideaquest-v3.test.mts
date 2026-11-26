import test from 'node:test';
import assert from 'node:assert/strict';

import {
  LKPD_SEED_IDEAS,
  MATRIX_VIEWS,
  QUADRANTS,
  SCORE_LEVEL_LABELS,
} from '../lib/data/lkpd-data.ts';
import {
  buildCsvContent,
  compute3DNodePositions,
  computeMarkerPositions,
  computePriorityStaircase,
  computeScoreRanking,
  computeSummaryStats,
  dropPositionToQuadrantScores,
  filterAndSortIdeas,
  getQuadrantId,
  getScoreLevelMeta,
  getTotalScore,
  groupIdeasByQuadrant,
} from '../lib/domain/matrix-math.ts';
import {
  createCustomIdeaInPayload,
  createEmptyPersistencePayload,
  deleteIdeaFromPayload,
  materializeIdeas,
  restoreAllLkpdSeeds,
  restoreSingleLkpdIdea,
  updateIdeaInPayload,
  updateScoreInPayload,
  validateIdeaInput,
} from '../lib/domain/crud.ts';
import {
  loadPersistedWorkspace,
  savePersistedWorkspace,
  STORAGE_KEY,
} from '../lib/persistence/storage.ts';

test('1. Data LKPD 5 utuh: 10 ide awal, skor identik, 3 konsep terpilih, dan transparansi Ide #10', () => {
  assert.equal(LKPD_SEED_IDEAS.length, 10);
  assert.equal(Object.keys(QUADRANTS).length, 4);

  const expected: Array<[number, number, number, QuadrantIdString, boolean]> = [
    [1, 5, 5, 'I', true],
    [2, 4, 5, 'I', true],
    [3, 4, 5, 'I', true],
    [4, 5, 3, 'II', false],
    [5, 4, 3, 'II', false],
    [6, 3, 4, 'III', false],
    [7, 3, 4, 'III', false],
    [8, 2, 4, 'III', false],
    [9, 4, 2, 'II', false],
    [10, 1, 4, 'III', false],
  ];
  type QuadrantIdString = 'I' | 'II' | 'III' | 'IV';

  expected.forEach(([id, f, im, q, selected], idx) => {
    const seed = LKPD_SEED_IDEAS[idx];
    assert.equal(seed.id, id);
    assert.equal(seed.originalFeasibility, f);
    assert.equal(seed.originalImpact, im);
    assert.equal(getQuadrantId(seed.originalFeasibility, seed.originalImpact), q);
    assert.equal(seed.isOriginalFinalSelection, selected);
  });

  const trioNames = LKPD_SEED_IDEAS.filter((s) => s.isOriginalFinalSelection).map(
    (s) => s.conceptName,
  );
  assert.deepEqual(trioNames, [
    'SmartMargin Guard',
    'ReversePrice Planner',
    'Simulasi Multi-Platform',
  ]);

  const idea10 = LKPD_SEED_IDEAS.find((s) => s.id === 10)!;
  assert.match(idea10.originalQuadrantLabel, /Prioritas Rendah/);
  assert.ok(idea10.quadrantDiscrepancyNote && idea10.quadrantDiscrepancyNote.length > 30);
});

test('2. Ketujuh mode visualisasi matriks (A-G) membaca satu sumber data yang konsisten', () => {
  assert.equal(MATRIX_VIEWS.length, 7);
  const payload = createEmptyPersistencePayload();
  const ideas = materializeIdeas(payload);

  // A: Peta Prioritas 2x2
  const pos2d = computeMarkerPositions(ideas);
  assert.equal(pos2d.size, 10);
  assert.equal(pos2d.get(2)!.baseX, pos2d.get(3)!.baseX);
  assert.notEqual(pos2d.get(2)!.offsetX, pos2d.get(3)!.offsetX);

  // B: Ruang Ide 3D (Z strictly depth separation for coincident X,Y)
  const pos3d = compute3DNodePositions(ideas);
  assert.equal(pos3d.get(2)!.x, pos3d.get(3)!.x);
  assert.equal(pos3d.get(2)!.y, pos3d.get(3)!.y);
  assert.notEqual(pos3d.get(2)!.z, pos3d.get(3)!.z);

  // C: Tangga Prioritas (preserves ties on shared steps)
  const stairs = computePriorityStaircase(ideas);
  assert.equal(stairs[0].totalScore, 10);
  assert.equal(stairs[0].items.length, 1);
  assert.equal(stairs[1].totalScore, 9);
  assert.equal(stairs[1].isTied, true);
  assert.equal(stairs[1].items.length, 2);

  // D: Level Kelayakan & Dampak (1..5 labels)
  assert.equal(Object.keys(SCORE_LEVEL_LABELS).length, 5);
  assert.equal(getScoreLevelMeta(1).summary, 'Sangat Rendah');
  assert.equal(getScoreLevelMeta(5).summary, 'Sangat Tinggi');

  // E & F: Kartu Kuadran & Papan Prioritas
  const grouped = groupIdeasByQuadrant(ideas);
  assert.equal(grouped.I.length, 3);
  assert.equal(grouped.II.length, 3);
  assert.equal(grouped.III.length, 4);
  assert.equal(grouped.IV.length, 0);

  const dropped = dropPositionToQuadrantScores(20, 20, 'IV');
  assert.ok(dropped.feasibility <= 3 && dropped.impact <= 3);

  // G: Peringkat Ide (ties preserved)
  const ranking = computeScoreRanking(ideas);
  assert.equal(ranking[0].rank, 1);
  assert.equal(ranking[1].rank, 2);
  assert.equal(ranking[2].rank, 2);
  assert.equal(ranking[3].rank, 4);
});

test('3. Operasi CRUD lengkap + validasi + perlindungan data awal LKPD + pemulihan', () => {
  let payload = createEmptyPersistencePayload();

  // Validasi form gagal bila kosong
  const invalid = validateIdeaInput({
    name: 'AB',
    description: 'Pendek',
    scamperCode: 'S',
    feasibility: 4,
    impact: 5,
    sellerBenefit: '',
    buyerBenefit: '',
    rationale: '',
  });
  assert.equal(invalid.valid, false);

  // CREATE
  const validInput = {
    name: 'Notifikasi Stok Box Kue Real-Time',
    shortLabel: 'Alert Box Kue',
    description: 'Memberi peringatan otomatis saat stok kemasan kue menipis agar pesanan tidak batal.',
    scamperCode: 'A' as const,
    feasibility: 4,
    impact: 5,
    sellerBenefit: 'Admin cabang tidak telat restock kemasan kue tart.',
    buyerBenefit: 'Pesanan kue tidak dibatalkan mendadak akibat box habis.',
    rationale: 'Menjawab keluhan stok kemasan pada hasil wawancara LKPD 3.',
  };
  assert.equal(validateIdeaInput(validInput).valid, true);

  const created = createCustomIdeaInPayload(payload, validInput);
  payload = created.nextPayload;
  assert.equal(created.createdId, 11);
  let ideas = materializeIdeas(payload);
  assert.equal(ideas.length, 11);

  // READ + Search + Filter + Sort
  const filtered = filterAndSortIdeas(ideas, {
    search: 'Box Kue',
    quadrant: 'I',
    scamper: 'A',
    origin: 'custom',
    sortBy: 'totalDesc',
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 11);

  // UPDATE skor & deskripsi
  payload = updateScoreInPayload(payload, 4, 4, 4, 'drag');
  ideas = materializeIdeas(payload);
  const idea4 = ideas.find((i) => i.id === 4)!;
  assert.equal(idea4.isScoreSimulated, true);
  assert.equal(getQuadrantId(idea4.feasibility, idea4.impact), 'I');

  payload = updateIdeaInPayload(payload, 11, {
    ...validInput,
    feasibility: 5,
    impact: 5,
  });
  ideas = materializeIdeas(payload);
  assert.equal(getTotalScore(ideas.find((i) => i.id === 11)!.feasibility, ideas.find((i) => i.id === 11)!.impact), 10);

  // DELETE: tolak penghapusan ide LKPD tanpa konfirmasi buka kunci
  const blockedDelete = deleteIdeaFromPayload(payload, 1, false);
  assert.equal(blockedDelete.deleted, false);
  assert.equal(materializeIdeas(blockedDelete.nextPayload).length, 11);

  // DELETE dengan konfirmasi eksplisit pada LKPD menyembunyikan sementara tanpa merusak seed
  const allowedHide = deleteIdeaFromPayload(payload, 1, true);
  assert.equal(allowedHide.deleted, true);
  payload = allowedHide.nextPayload;
  assert.equal(materializeIdeas(payload).length, 10);

  // Pulihkan 1 ide LKPD
  payload = restoreSingleLkpdIdea(payload, 1);
  assert.equal(materializeIdeas(payload).length, 11);

  // Hapus ide tambahan #11
  const deletedCustom = deleteIdeaFromPayload(payload, 11, false);
  assert.equal(deletedCustom.deleted, true);
  payload = deletedCustom.nextPayload;
  assert.equal(materializeIdeas(payload).length, 10);

  // Pulihkan seluruh LKPD ke skor awal
  payload = restoreAllLkpdSeeds(payload, true);
  ideas = materializeIdeas(payload);
  const stats = computeSummaryStats(ideas, payload.hiddenLkpdIds.length);
  assert.equal(stats.hasSimulatedChanges, false);

  // CSV Export valid
  const csv = buildCsvContent(ideas);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.match(csv, /Margin Alert/);
});

test('4. Persistence localStorage bertahan setelah simulasi refresh halaman', () => {
  const storeMap = new Map<string, string>();
  const mockWindow = {
    localStorage: {
      getItem: (k: string) => storeMap.get(k) ?? null,
      setItem: (k: string, v: string) => {
        storeMap.set(k, v);
      },
      removeItem: (k: string) => {
        storeMap.delete(k);
      },
    },
  };

  Object.defineProperty(globalThis, 'window', {
    value: mockWindow,
    configurable: true,
    writable: true,
  });

  let payload = createEmptyPersistencePayload();
  payload = updateScoreInPayload(payload, 2, 5, 5, 'slider');
  const saved = savePersistedWorkspace(payload);
  assert.equal(saved, true);
  assert.ok(storeMap.has(STORAGE_KEY));

  const reloaded = loadPersistedWorkspace();
  const reloadedIdeas = materializeIdeas(reloaded);
  const idea2 = reloadedIdeas.find((i) => i.id === 2)!;
  assert.equal(idea2.feasibility, 5);
  assert.equal(idea2.impact, 5);
  assert.equal(idea2.originalFeasibility, 4);

  // Cleanup mock window
  // @ts-expect-error test cleanup
  delete globalThis.window;
});
