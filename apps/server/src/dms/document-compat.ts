/**
 * Régi telepítések kompatibilitása – korábbi mezőnevek / tárolási helyek.
 */
export function resolveJelenlegiHely(doc: Record<string, unknown>): string | null {
  const direct = doc.jelenlegiHely;
  if (typeof direct === 'string' && direct.trim()) {
    return direct.trim();
  }

  const legacyKeys = ['iratHelye', 'irat_helye', 'physicalLocation', 'documentLocation'];
  for (const key of legacyKeys) {
    const val = doc[key];
    if (typeof val === 'string' && val.trim()) {
      return val.trim();
    }
  }

  const felelos = doc.felelos;
  if (typeof felelos === 'string' && felelos.trim() && !direct) {
    return felelos.trim();
  }

  return null;
}

export function normalizeDocumentRecord<T>(doc: T): T {
  const raw = doc as Record<string, unknown>;
  const jelenlegiHely = resolveJelenlegiHely(raw);
  const tags = Array.isArray(raw.tags) ? raw.tags : [];
  const versions = Array.isArray(raw.versions) ? raw.versions : [];
  const workflowLogs = Array.isArray(raw.workflowLogs) ? raw.workflowLogs : [];
  const access = Array.isArray(raw.access) ? raw.access : [];

  return {
    ...(doc as object),
    jelenlegiHely,
    tags,
    versions,
    workflowLogs,
    access,
  } as T;
}

export function normalizeDocumentList<T>(data: T[]): T[] {
  return data.map((row) => normalizeDocumentRecord(row));
}
