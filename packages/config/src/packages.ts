import { APP_VERSION } from './app-version';

export type PackageModuleKey =
  | 'documents'
  | 'team'
  | 'crm'
  | 'logistics'
  | 'controlling'
  | 'hr';

export interface PackageDefinition {
  id: string;
  displayName: string;
  editionLabel: string;
  version: string;
  modules: Record<PackageModuleKey, boolean>;
  buildName: string;
  artifactSlug: string;
  /** Windows portable ZIP modul rövidítés (pl. CRM-DMS-LOG-WF) */
  artifactModuleLabel?: string;
  /** Régi build / telepítés azonosítók */
  legacyIds?: string[];
}

/** NestJS / API route prefix → modul */
export const API_ROUTE_MODULE_MAP: Record<string, PackageModuleKey> = {
  crm: 'crm',
  dms: 'documents',
  logistics: 'logistics',
  hr: 'hr',
  controlling: 'controlling',
  team: 'team',
};

/** Mindig engedélyezett API prefixek (auth, rendszer, audit, backup) */
export const API_ALWAYS_ALLOWED_PREFIXES = [
  'auth',
  'health',
  'system',
  'backup',
  'audit',
  'seed',
  'bug-report',
  'bug-reports',
];

export const ERP_PACKAGES: Record<string, PackageDefinition> = {
  full: {
    id: 'full',
    displayName: 'Teljes ERP',
    editionLabel: 'Full Edition',
    version: APP_VERSION,
    modules: {
      documents: true,
      team: true,
      crm: true,
      logistics: true,
      controlling: true,
      hr: true,
    },
    buildName: 'mbit-erp-full',
    artifactSlug: 'full',
    legacyIds: ['ERP_FULL'],
  },
  'customer-4module': {
    id: 'customer-4module',
    displayName: 'Ügyfél 4 modulos csomag',
    editionLabel: 'Customer Edition',
    version: '1.0.1b',
    modules: {
      documents: true,
      team: true,
      crm: true,
      logistics: true,
      controlling: false,
      hr: false,
    },
    buildName: 'mbit-erp-customer-4module',
    artifactSlug: 'customer-4module',
    artifactModuleLabel: 'CRM-DMS-LOG-WF',
    legacyIds: ['ERP_CUSTOMER_4MODULE', 'ERP_CRM_DMS_LOGISTICS_WORKFLOW'],
  },
  'dms-workflow-hr': {
    id: 'dms-workflow-hr',
    displayName: 'DMS + Workflow + HR Edition',
    editionLabel: 'DMS + Workflow + HR Edition',
    version: '1.0.1c',
    modules: {
      documents: true,
      team: true,
      crm: false,
      logistics: false,
      controlling: false,
      hr: true,
    },
    buildName: 'mbit-erp-dms-workflow-hr',
    artifactSlug: 'dms-workflow-hr',
    artifactModuleLabel: 'DMS-WF-HR',
    legacyIds: ['ERP_DMS_WORKFLOW_HR', 'ERP_DMS_TEAM_HR'],
  },
  'ginop-crm-dms-hr': {
    id: 'ginop-crm-dms-hr',
    displayName: 'GINOP CRM+DMS+HR',
    editionLabel: 'GINOP CRM+DMS+HR Edition',
    version: APP_VERSION,
    modules: {
      documents: true,
      team: false,
      crm: true,
      logistics: false,
      controlling: false,
      hr: true,
    },
    buildName: 'mbit-erp-ginop-crm-dms-hr',
    artifactSlug: 'ginop-crm-dms-hr',
    legacyIds: ['ERP_GINOP_CRM_DMS_HR'],
  },
  crm: {
    id: 'crm',
    displayName: 'CRM csomag',
    editionLabel: 'CRM Edition',
    version: APP_VERSION,
    modules: {
      documents: false,
      team: false,
      crm: true,
      logistics: false,
      controlling: false,
      hr: false,
    },
    buildName: 'mbit-erp-crm',
    artifactSlug: 'crm',
    legacyIds: ['ERP_CRM'],
  },
  dms: {
    id: 'dms',
    displayName: 'DMS csomag',
    editionLabel: 'DMS Edition',
    version: APP_VERSION,
    modules: {
      documents: true,
      team: false,
      crm: false,
      logistics: false,
      controlling: false,
      hr: false,
    },
    buildName: 'mbit-erp-dms',
    artifactSlug: 'dms',
    legacyIds: ['ERP_DMS'],
  },
  hr: {
    id: 'hr',
    displayName: 'HR csomag',
    editionLabel: 'HR Edition',
    version: APP_VERSION,
    modules: {
      documents: false,
      team: false,
      crm: false,
      logistics: false,
      controlling: false,
      hr: true,
    },
    buildName: 'mbit-erp-hr',
    artifactSlug: 'hr',
    legacyIds: ['ERP_HR', 'package-hr'],
  },
  logistics: {
    id: 'logistics',
    displayName: 'Logisztika csomag',
    editionLabel: 'Logistics Edition',
    version: APP_VERSION,
    modules: {
      documents: false,
      team: false,
      crm: false,
      logistics: true,
      controlling: false,
      hr: false,
    },
    buildName: 'mbit-erp-logistics',
    artifactSlug: 'logistics',
    legacyIds: ['ERP_LOGISTICS'],
  },
  'package-1': {
    id: 'package-1',
    displayName: 'Csomag 1',
    editionLabel: 'Csomag 1',
    version: APP_VERSION,
    modules: {
      documents: true,
      team: true,
      controlling: true,
      crm: false,
      logistics: false,
      hr: true,
    },
    buildName: 'mbit-erp-package-1',
    artifactSlug: 'package-1',
  },
  'package-2': {
    id: 'package-2',
    displayName: 'Csomag 2',
    editionLabel: 'Csomag 2',
    version: APP_VERSION,
    modules: {
      documents: true,
      team: false,
      controlling: false,
      crm: true,
      logistics: true,
      hr: true,
    },
    buildName: 'mbit-erp-package-2',
    artifactSlug: 'package-2',
  },
  'package-3': {
    id: 'package-3',
    displayName: 'Csomag 3',
    editionLabel: 'Csomag 3',
    version: APP_VERSION,
    modules: {
      documents: true,
      team: true,
      controlling: false,
      crm: true,
      logistics: false,
      hr: true,
    },
    buildName: 'mbit-erp-package-3',
    artifactSlug: 'package-3',
  },
  'package-4': {
    id: 'package-4',
    displayName: 'Csomag 4 (legacy – használja: customer-4module)',
    editionLabel: 'Customer Edition',
    version: APP_VERSION,
    modules: {
      documents: true,
      team: true,
      controlling: false,
      crm: true,
      logistics: true,
      hr: false,
    },
    buildName: 'mbit-erp-package-4',
    artifactSlug: 'package-4',
  },
  'package-5': {
    id: 'package-5',
    displayName: 'Csomag 5 (DMS + Partnerek)',
    editionLabel: 'Csomag 5',
    version: APP_VERSION,
    modules: {
      documents: true,
      team: false,
      controlling: false,
      crm: true,
      logistics: false,
      hr: false,
    },
    buildName: 'mbit-erp-package-5',
    artifactSlug: 'package-5',
  },
};

const LEGACY_ID_INDEX: Record<string, string> = {};
for (const pkg of Object.values(ERP_PACKAGES)) {
  LEGACY_ID_INDEX[pkg.id] = pkg.id;
  for (const legacy of pkg.legacyIds ?? []) {
    LEGACY_ID_INDEX[legacy] = pkg.id;
  }
}

export function resolvePackageId(raw?: string | null): string {
  const key = (raw || 'full').trim();
  return LEGACY_ID_INDEX[key] ?? (ERP_PACKAGES[key] ? key : 'full');
}

export function getPackageDefinition(packageId?: string | null): PackageDefinition {
  const id = resolvePackageId(packageId);
  return ERP_PACKAGES[id] ?? ERP_PACKAGES.full;
}

export function isPackageModuleEnabled(
  module: PackageModuleKey,
  packageId?: string | null,
): boolean {
  const pkg = getPackageDefinition(packageId);
  return pkg.modules[module] ?? false;
}

export function getActivePackageIdFromEnv(): string {
  return resolvePackageId(process.env.ERP_PACKAGE || process.env.VITE_ACTIVE_PACKAGE || 'full');
}

/** Permission prefix → modul (package szűréshez) */
export const PERMISSION_MODULE_PREFIX: Record<string, PackageModuleKey> = {
  crm: 'crm',
  customer: 'crm',
  opportunity: 'crm',
  quote: 'crm',
  campaign: 'crm',
  ticket: 'crm',
  order: 'crm',
  shipment: 'crm',
  dms: 'documents',
  document: 'documents',
  logistics: 'logistics',
  warehouse: 'logistics',
  product: 'logistics',
  stock: 'logistics',
  purchase_order: 'logistics',
  purchase: 'logistics',
  supplier: 'logistics',
  price_list: 'logistics',
  return: 'logistics',
  inventory: 'logistics',
  controlling: 'controlling',
  kpi: 'controlling',
  report: 'controlling',
  hr: 'hr',
  team: 'team',
  task: 'team',
  board: 'team',
};

export function isPermissionAllowedInPackage(
  permissionCode: string,
  packageId?: string | null,
): boolean {
  const prefix = permissionCode.split(':')[0];
  const module = PERMISSION_MODULE_PREFIX[prefix];
  if (!module) return true;
  return isPackageModuleEnabled(module, packageId);
}

export function buildArtifactBaseName(packageId?: string | null): string {
  const pkg = getPackageDefinition(packageId);
  return `mbit-erp-v${pkg.version}-${pkg.artifactSlug}`;
}

export function buildWindowsPortableZipName(packageId?: string | null): string {
  const pkg = getPackageDefinition(packageId);
  const modules = pkg.artifactModuleLabel ? `-${pkg.artifactModuleLabel}` : '';
  return `mbit-erp-v${pkg.version}-${pkg.artifactSlug}${modules}-windows.zip`;
}

export function resolvePackageVersion(packageId?: string | null): string {
  if (process.env.APP_VERSION?.trim()) {
    return process.env.APP_VERSION.trim();
  }
  return getPackageDefinition(packageId).version;
}

/** Frontend modules.ts kulcsok → package modul */
export const WEB_MODULE_TO_PACKAGE: Record<
  'documents' | 'team' | 'crm' | 'logistics' | 'controlling',
  PackageModuleKey
> = {
  documents: 'documents',
  team: 'team',
  crm: 'crm',
  logistics: 'logistics',
  controlling: 'controlling',
};

export function isHrEnabledForPackage(packageId?: string | null): boolean {
  return isPackageModuleEnabled('hr', packageId);
}
