export type QuadrantId = 'I' | 'II' | 'III' | 'IV';

export type QuadrantColorKey = 'mint' | 'blue' | 'peach' | 'coral';

export type ScamperCode = 'S' | 'C' | 'A' | 'M' | 'P' | 'E' | 'R' | 'NONE';

export type BuyerBenefitStatus = 'direct' | 'indirect' | 'not-specified';

export type MatrixViewId =
  | 'map2x2'
  | 'space3d'
  | 'staircase'
  | 'levels'
  | 'quadrantCards'
  | 'priorityBoard'
  | 'ranking';

export type SortField = 'totalDesc' | 'totalAsc' | 'feasibilityDesc' | 'impactDesc' | 'nameAsc' | 'idAsc';

export type CameraPreset = 'iso' | 'front' | 'top';

export interface QuadrantDefinition {
  id: QuadrantId;
  roman: QuadrantId;
  name: string;
  shortDesc: string;
  ruleLabel: string;
  detailDesc: string;
  colorKey: QuadrantColorKey;
  representativePoint: {
    feasibility: number;
    impact: number;
  };
  bounds: {
    minF: number;
    maxF: number;
    minI: number;
    maxI: number;
  };
}

export interface LkpdSeedIdea {
  id: number;
  name: string;
  shortLabel: string;
  conceptName: string | null;
  description: string;
  scamper: string;
  scamperCode: ScamperCode;
  scamperNote: string | null;
  originalFeasibility: number;
  originalImpact: number;
  originalQuadrantLabel: string;
  isOriginalFinalSelection: boolean;
  rationale: string;
  sellerBenefit: string;
  buyerBenefit: string;
  buyerBenefitStatus: BuyerBenefitStatus;
  sourceNote: string | null;
  quadrantDiscrepancyNote: string | null;
}

export interface IdeaOverride {
  name?: string;
  shortLabel?: string;
  description?: string;
  scamper?: string;
  scamperCode?: ScamperCode;
  feasibility?: number;
  impact?: number;
  sellerBenefit?: string;
  buyerBenefit?: string;
  rationale?: string;
  modificationSource?: 'slider' | 'drag' | 'edit' | 'quadrant-move';
  updatedAt: string;
}

export interface CustomIdeaRecord {
  id: number;
  name: string;
  shortLabel: string;
  description: string;
  scamper: string;
  scamperCode: ScamperCode;
  feasibility: number;
  impact: number;
  sellerBenefit: string;
  buyerBenefit: string;
  rationale: string;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaItem {
  id: number;
  origin: 'lkpd' | 'custom';
  name: string;
  shortLabel: string;
  conceptName: string | null;
  description: string;
  scamper: string;
  scamperCode: ScamperCode;
  scamperNote: string | null;
  feasibility: number;
  impact: number;
  originalFeasibility: number;
  originalImpact: number;
  originalQuadrantLabel: string;
  isOriginalFinalSelection: boolean;
  isScoreSimulated: boolean;
  isContentEdited: boolean;
  isModified: boolean;
  modificationSource: string | null;
  sellerBenefit: string;
  buyerBenefit: string;
  buyerBenefitStatus: BuyerBenefitStatus;
  rationale: string;
  sourceNote: string | null;
  quadrantDiscrepancyNote: string | null;
}

export interface CreateOrUpdateIdeaInput {
  name: string;
  shortLabel?: string;
  description: string;
  scamperCode: ScamperCode;
  feasibility: number;
  impact: number;
  sellerBenefit: string;
  buyerBenefit: string;
  rationale: string;
}

export interface PersistedWorkspacePayload {
  schemaVersion: number;
  savedAt: string;
  lkpdOverrides: Record<number, IdeaOverride>;
  hiddenLkpdIds: number[];
  customIdeas: CustomIdeaRecord[];
  nextCustomId: number;
}

export interface IdeaFilters {
  search: string;
  quadrant: 'all' | QuadrantId;
  scamper: 'all' | ScamperCode;
  origin: 'all' | 'lkpd' | 'custom';
  sortBy: SortField;
}

export interface PerformanceSnapshot {
  initialPageLoadMs: number | null;
  threeInitMs: number | null;
  lastCrudDurationMs: number | null;
  lastCrudOperation: string | null;
  lastScoreChangeMs: number | null;
  frameTimeMs: number | null;
  fps: number | null;
  reactRenderCount: number;
  lastReactCommitMs: number | null;
  maxReactCommitMs: number | null;
  longTaskCount: number;
  maxLongTaskMs: number | null;
  lcpMs: number | null;
  inpMs: number | null;
  clsScore: number | null;
  jsBundleBytes: number | null;
  jsResourceCount: number | null;
  lowPerfMode: boolean;
}
