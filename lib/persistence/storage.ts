import { createEmptyPersistencePayload } from '@/lib/domain/crud';
import type { PersistedWorkspacePayload } from '@/types/idea';

export const STORAGE_KEY = 'ideaquest.v3.workspace';

function isValidPayload(raw: unknown): raw is PersistedWorkspacePayload {
  if (!raw || typeof raw !== 'object') return false;
  const candidate = raw as Record<string, unknown>;
  return (
    candidate.schemaVersion === 3 &&
    typeof candidate.lkpdOverrides === 'object' &&
    candidate.lkpdOverrides !== null &&
    Array.isArray(candidate.hiddenLkpdIds) &&
    Array.isArray(candidate.customIdeas) &&
    typeof candidate.nextCustomId === 'number'
  );
}

export function loadPersistedWorkspace(): PersistedWorkspacePayload {
  if (typeof window === 'undefined') {
    return createEmptyPersistencePayload();
  }
  try {
    const rawText = window.localStorage.getItem(STORAGE_KEY);
    if (!rawText) return createEmptyPersistencePayload();
    const parsed: unknown = JSON.parse(rawText);
    if (!isValidPayload(parsed)) {
      return createEmptyPersistencePayload();
    }
    return parsed;
  } catch {
    return createEmptyPersistencePayload();
  }
}

export function savePersistedWorkspace(payload: PersistedWorkspacePayload): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function clearPersistedWorkspace(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage quota / privacy mode errors cleanly
  }
}
