import { LKPD_SEED_IDEAS, SCAMPER_OPTIONS } from '@/lib/data/lkpd-data';
import { clampScore, getQuadrantMeta } from '@/lib/domain/matrix-math';
import type {
  CreateOrUpdateIdeaInput,
  CustomIdeaRecord,
  IdeaItem,
  IdeaOverride,
  PersistedWorkspacePayload,
  ScamperCode,
} from '@/types/idea';

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof CreateOrUpdateIdeaInput, string>>;
}

export function formatScamperLabel(code: ScamperCode): string {
  const match = SCAMPER_OPTIONS.find((item) => item.code === code);
  return match ? match.short : 'S — Substitute';
}

export function deriveShortLabel(name: string, provided?: string): string {
  const cleanProvided = (provided ?? '').trim();
  if (cleanProvided.length >= 2) {
    return cleanProvided.slice(0, 28);
  }
  const cleanName = name.trim();
  if (cleanName.length <= 24) return cleanName;
  const words = cleanName.split(/\s+/).slice(0, 3).join(' ');
  return words.length <= 26 ? words : `${cleanName.slice(0, 23)}…`;
}

export function validateIdeaInput(input: CreateOrUpdateIdeaInput): ValidationResult {
  const errors: Partial<Record<keyof CreateOrUpdateIdeaInput, string>> = {};

  if (!input.name || input.name.trim().length < 3) {
    errors.name = 'Nama ide wajib diisi minimal 3 karakter.';
  } else if (input.name.trim().length > 120) {
    errors.name = 'Nama ide maksimal 120 karakter.';
  }

  if (!input.description || input.description.trim().length < 10) {
    errors.description = 'Deskripsi ide wajib diisi minimal 10 karakter agar mudah dipahami.';
  }

  if (!SCAMPER_OPTIONS.some((s) => s.code === input.scamperCode)) {
    errors.scamperCode = 'Pilih salah satu kategori SCAMPER yang valid.';
  }

  if (
    typeof input.feasibility !== 'number' ||
    Number.isNaN(input.feasibility) ||
    input.feasibility < 1 ||
    input.feasibility > 5
  ) {
    errors.feasibility = 'Skor Kelayakan harus berada pada rentang 1 sampai 5.';
  }

  if (
    typeof input.impact !== 'number' ||
    Number.isNaN(input.impact) ||
    input.impact < 1 ||
    input.impact > 5
  ) {
    errors.impact = 'Skor Dampak harus berada pada rentang 1 sampai 5.';
  }

  if (!input.sellerBenefit || input.sellerBenefit.trim().length < 5) {
    errors.sellerBenefit = 'Manfaat bagi penjual wajib diisi minimal 5 karakter.';
  }

  if (!input.buyerBenefit || input.buyerBenefit.trim().length < 5) {
    errors.buyerBenefit = 'Manfaat bagi pembeli wajib diisi minimal 5 karakter.';
  }

  if (!input.rationale || input.rationale.trim().length < 8) {
    errors.rationale = 'Alasan pemilihan wajib diisi minimal 8 karakter.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function createEmptyPersistencePayload(): PersistedWorkspacePayload {
  return {
    schemaVersion: 3,
    savedAt: new Date().toISOString(),
    lkpdOverrides: {},
    hiddenLkpdIds: [],
    customIdeas: [],
    nextCustomId: 11,
  };
}

/**
 * Materializes the unified IdeaItem[] list from:
 * 1. Canonical LKPD 5 seed ideas (never mutated)
 * 2. Simulated overrides / hidden state on LKPD ideas
 * 3. User-created custom ideas
 */
export function materializeIdeas(payload: PersistedWorkspacePayload): IdeaItem[] {
  const hiddenSet = new Set(payload.hiddenLkpdIds);
  const result: IdeaItem[] = [];

  for (const seed of LKPD_SEED_IDEAS) {
    if (hiddenSet.has(seed.id)) continue;

    const override: IdeaOverride | undefined = payload.lkpdOverrides[seed.id];
    const feasibility = override?.feasibility !== undefined
      ? clampScore(override.feasibility)
      : seed.originalFeasibility;
    const impact = override?.impact !== undefined
      ? clampScore(override.impact)
      : seed.originalImpact;

    const name = override?.name ?? seed.name;
    const shortLabel = override?.shortLabel ?? seed.shortLabel;
    const description = override?.description ?? seed.description;
    const scamperCode = override?.scamperCode ?? seed.scamperCode;
    const scamper = override?.scamper ?? seed.scamper;
    const sellerBenefit = override?.sellerBenefit ?? seed.sellerBenefit;
    const buyerBenefit = override?.buyerBenefit ?? seed.buyerBenefit;
    const rationale = override?.rationale ?? seed.rationale;

    const isScoreSimulated =
      feasibility !== seed.originalFeasibility || impact !== seed.originalImpact;
    const isContentEdited =
      name !== seed.name ||
      description !== seed.description ||
      scamperCode !== seed.scamperCode ||
      sellerBenefit !== seed.sellerBenefit ||
      buyerBenefit !== seed.buyerBenefit ||
      rationale !== seed.rationale;

    result.push({
      id: seed.id,
      origin: 'lkpd',
      name,
      shortLabel,
      conceptName: seed.conceptName,
      description,
      scamper,
      scamperCode,
      scamperNote: seed.scamperNote,
      feasibility,
      impact,
      originalFeasibility: seed.originalFeasibility,
      originalImpact: seed.originalImpact,
      originalQuadrantLabel: seed.originalQuadrantLabel,
      isOriginalFinalSelection: seed.isOriginalFinalSelection,
      isScoreSimulated,
      isContentEdited,
      isModified: isScoreSimulated || isContentEdited,
      modificationSource: override?.modificationSource ?? null,
      sellerBenefit,
      buyerBenefit,
      buyerBenefitStatus: seed.buyerBenefitStatus,
      rationale,
      sourceNote: seed.sourceNote,
      quadrantDiscrepancyNote: seed.quadrantDiscrepancyNote,
    });
  }

  for (const custom of payload.customIdeas) {
    const f = clampScore(custom.feasibility);
    const im = clampScore(custom.impact);
    const q = getQuadrantMeta(f, im);
    result.push({
      id: custom.id,
      origin: 'custom',
      name: custom.name,
      shortLabel: custom.shortLabel,
      conceptName: null,
      description: custom.description,
      scamper: custom.scamper,
      scamperCode: custom.scamperCode,
      scamperNote: 'Ide tambahan yang dibuat pada sesi kerja lokal ini.',
      feasibility: f,
      impact: im,
      originalFeasibility: f,
      originalImpact: im,
      originalQuadrantLabel: `${q.name} (Ide Tambahan)`,
      isOriginalFinalSelection: false,
      isScoreSimulated: false,
      isContentEdited: false,
      isModified: false,
      modificationSource: null,
      sellerBenefit: custom.sellerBenefit,
      buyerBenefit: custom.buyerBenefit,
      buyerBenefitStatus: 'direct',
      rationale: custom.rationale,
      sourceNote: null,
      quadrantDiscrepancyNote: null,
    });
  }

  return result;
}

export function createCustomIdeaInPayload(
  payload: PersistedWorkspacePayload,
  input: CreateOrUpdateIdeaInput,
): { nextPayload: PersistedWorkspacePayload; createdId: number } {
  const createdId = Math.max(
    11,
    payload.nextCustomId,
    ...payload.customIdeas.map((c) => c.id + 1),
  );
  const now = new Date().toISOString();
  const f = clampScore(input.feasibility);
  const im = clampScore(input.impact);

  const record: CustomIdeaRecord = {
    id: createdId,
    name: input.name.trim(),
    shortLabel: deriveShortLabel(input.name, input.shortLabel),
    description: input.description.trim(),
    scamperCode: input.scamperCode,
    scamper: formatScamperLabel(input.scamperCode),
    feasibility: f,
    impact: im,
    sellerBenefit: input.sellerBenefit.trim(),
    buyerBenefit: input.buyerBenefit.trim(),
    rationale: input.rationale.trim(),
    createdAt: now,
    updatedAt: now,
  };

  return {
    createdId,
    nextPayload: {
      ...payload,
      savedAt: now,
      customIdeas: [...payload.customIdeas, record],
      nextCustomId: createdId + 1,
    },
  };
}

export function updateIdeaInPayload(
  payload: PersistedWorkspacePayload,
  id: number,
  input: CreateOrUpdateIdeaInput,
): PersistedWorkspacePayload {
  const now = new Date().toISOString();
  const f = clampScore(input.feasibility);
  const im = clampScore(input.impact);

  const seed = LKPD_SEED_IDEAS.find((item) => item.id === id);
  if (seed) {
    const nextName = input.name.trim();
    const nextShort = deriveShortLabel(nextName, input.shortLabel ?? seed.shortLabel);
    const nextDesc = input.description.trim();
    const nextScamperCode = input.scamperCode;
    const nextScamper =
      nextScamperCode === seed.scamperCode ? seed.scamper : formatScamperLabel(nextScamperCode);
    const nextSeller = input.sellerBenefit.trim();
    const nextBuyer = input.buyerBenefit.trim();
    const nextRationale = input.rationale.trim();

    const matchesOriginal =
      nextName === seed.name &&
      nextDesc === seed.description &&
      nextScamperCode === seed.scamperCode &&
      f === seed.originalFeasibility &&
      im === seed.originalImpact &&
      nextSeller === seed.sellerBenefit &&
      nextBuyer === seed.buyerBenefit &&
      nextRationale === seed.rationale;

    const nextOverrides = { ...payload.lkpdOverrides };
    if (matchesOriginal) {
      delete nextOverrides[id];
    } else {
      nextOverrides[id] = {
        name: nextName,
        shortLabel: nextShort,
        description: nextDesc,
        scamperCode: nextScamperCode,
        scamper: nextScamper,
        feasibility: f,
        impact: im,
        sellerBenefit: nextSeller,
        buyerBenefit: nextBuyer,
        rationale: nextRationale,
        modificationSource: 'edit',
        updatedAt: now,
      };
    }

    return {
      ...payload,
      savedAt: now,
      lkpdOverrides: nextOverrides,
    };
  }

  return {
    ...payload,
    savedAt: now,
    customIdeas: payload.customIdeas.map((item) =>
      item.id === id
        ? {
            ...item,
            name: input.name.trim(),
            shortLabel: deriveShortLabel(input.name, input.shortLabel),
            description: input.description.trim(),
            scamperCode: input.scamperCode,
            scamper: formatScamperLabel(input.scamperCode),
            feasibility: f,
            impact: im,
            sellerBenefit: input.sellerBenefit.trim(),
            buyerBenefit: input.buyerBenefit.trim(),
            rationale: input.rationale.trim(),
            updatedAt: now,
          }
        : item,
    ),
  };
}

export function updateScoreInPayload(
  payload: PersistedWorkspacePayload,
  id: number,
  feasibility: number,
  impact: number,
  source: 'slider' | 'drag' | 'quadrant-move' = 'slider',
): PersistedWorkspacePayload {
  const now = new Date().toISOString();
  const f = clampScore(feasibility);
  const im = clampScore(impact);

  const seed = LKPD_SEED_IDEAS.find((item) => item.id === id);
  if (seed) {
    const existing = payload.lkpdOverrides[id];
    const hasOtherEdits =
      existing &&
      ((existing.name !== undefined && existing.name !== seed.name) ||
        (existing.description !== undefined && existing.description !== seed.description) ||
        (existing.scamperCode !== undefined && existing.scamperCode !== seed.scamperCode) ||
        (existing.sellerBenefit !== undefined && existing.sellerBenefit !== seed.sellerBenefit) ||
        (existing.buyerBenefit !== undefined && existing.buyerBenefit !== seed.buyerBenefit) ||
        (existing.rationale !== undefined && existing.rationale !== seed.rationale));

    const nextOverrides = { ...payload.lkpdOverrides };
    if (f === seed.originalFeasibility && im === seed.originalImpact && !hasOtherEdits) {
      delete nextOverrides[id];
    } else {
      nextOverrides[id] = {
        ...existing,
        feasibility: f,
        impact: im,
        modificationSource: source,
        updatedAt: now,
      };
    }

    return {
      ...payload,
      savedAt: now,
      lkpdOverrides: nextOverrides,
    };
  }

  return {
    ...payload,
    savedAt: now,
    customIdeas: payload.customIdeas.map((item) =>
      item.id === id
        ? {
            ...item,
            feasibility: f,
            impact: im,
            updatedAt: now,
          }
        : item,
    ),
  };
}

export function deleteIdeaFromPayload(
  payload: PersistedWorkspacePayload,
  id: number,
  allowHideLkpd = false,
): { nextPayload: PersistedWorkspacePayload; deleted: boolean; reason?: string } {
  const now = new Date().toISOString();
  const isLkpd = LKPD_SEED_IDEAS.some((item) => item.id === id);

  if (isLkpd) {
    if (!allowHideLkpd) {
      return {
        nextPayload: payload,
        deleted: false,
        reason: 'Ide awal LKPD 5 dilindungi dari penghapusan tidak sengaja.',
      };
    }
    const hiddenSet = new Set(payload.hiddenLkpdIds);
    hiddenSet.add(id);
    return {
      deleted: true,
      nextPayload: {
        ...payload,
        savedAt: now,
        hiddenLkpdIds: [...hiddenSet],
      },
    };
  }

  const exists = payload.customIdeas.some((item) => item.id === id);
  if (!exists) {
    return { nextPayload: payload, deleted: false, reason: 'Ide tidak ditemukan.' };
  }

  return {
    deleted: true,
    nextPayload: {
      ...payload,
      savedAt: now,
      customIdeas: payload.customIdeas.filter((item) => item.id !== id),
    },
  };
}

export function restoreSingleLkpdIdea(
  payload: PersistedWorkspacePayload,
  id: number,
): PersistedWorkspacePayload {
  const nextOverrides = { ...payload.lkpdOverrides };
  delete nextOverrides[id];
  return {
    ...payload,
    savedAt: new Date().toISOString(),
    lkpdOverrides: nextOverrides,
    hiddenLkpdIds: payload.hiddenLkpdIds.filter((hiddenId) => hiddenId !== id),
  };
}

export function restoreAllLkpdSeeds(
  payload: PersistedWorkspacePayload,
  keepCustomIdeas = true,
): PersistedWorkspacePayload {
  if (!keepCustomIdeas) {
    return createEmptyPersistencePayload();
  }
  return {
    ...payload,
    savedAt: new Date().toISOString(),
    lkpdOverrides: {},
    hiddenLkpdIds: [],
  };
}
