import {
  ErpModuleKey,
  ERP_PACKAGES,
  getPackageDefinition,
  resolvePackageId,
  isPackageModuleEnabled,
} from '@mbit-erp/config';

export type { ErpModuleKey };

export interface MenuItem {
  to: string;
  label: string;
  parentMenu?: string;
}

export const MODULE_DOCUMENTS = {
  routes: ['/documents'],
  menuItems: [{ to: '/documents', label: 'Dokumentumok' }] as MenuItem[],
};

export const MODULE_TEAM = {
  routes: ['/team', '/workflows', '/workflow-tasks', '/workflow-instances'],
  menuItems: [
    { to: '/team', label: 'Csapat kommunikáció' },
    { to: '/workflows', label: 'Folyamatleltár' },
    { to: '/workflow-tasks', label: 'Feladatlista' },
    { to: '/workflow-instances', label: 'Workflow példányok' },
  ] as MenuItem[],
};

export const MODULE_CRM = {
  routes: [
    '/crm',
    '/opportunities',
    '/quotes',
    '/orders',
    '/crm/invoices',
    '/crm/chat',
    '/crm/discounts',
    '/crm/audit',
    '/crm/import',
  ],
  menuItems: [
    { to: '/crm', label: 'Partnerek', parentMenu: 'Ügyfélkezelés' },
    { to: '/opportunities', label: 'Lehetőségek', parentMenu: 'Ügyfélkezelés' },
    { to: '/quotes', label: 'Árajánlatok', parentMenu: 'Ügyfélkezelés' },
    { to: '/orders', label: 'Rendelések', parentMenu: 'Ügyfélkezelés' },
    { to: '/crm/invoices', label: 'Számlák', parentMenu: 'Ügyfélkezelés' },
    { to: '/crm/discounts', label: 'Kedvezmények', parentMenu: 'Ügyfélkezelés' },
    { to: '/crm/chat', label: 'Chat', parentMenu: 'Ügyfélkezelés' },
    { to: '/crm/audit', label: 'Audit napló', parentMenu: 'Rendszer' },
    { to: '/crm/import', label: 'Ügyfél import', parentMenu: 'Ügyfélkezelés' },
  ] as MenuItem[],
};

export const MODULE_LOGISTICS = {
  routes: [
    '/products',
    '/logistics/categories',
    '/warehouses',
    '/logistics/stock-movements',
    '/logistics/batches',
    '/logistics/stock-alerts',
    '/price-lists',
    '/logistics/purchase-orders',
    '/returns',
    '/inventory-sheets',
    '/logistics/reports',
    '/logistics/audit',
    '/suppliers',
    '/orders-logistics',
    '/intrastat',
    '/logistics/stock-valuation',
    '/logistics/stock-reservations',
  ],
  menuItems: [
    { to: '/products', label: 'Cikkek', parentMenu: 'Logisztika' },
    { to: '/logistics/categories', label: 'Kategóriák', parentMenu: 'Logisztika' },
    { to: '/warehouses', label: 'Raktárak', parentMenu: 'Logisztika' },
    { to: '/logistics/stock-movements', label: 'Készletmozgások', parentMenu: 'Logisztika' },
    { to: '/logistics/batches', label: 'Sarzsok', parentMenu: 'Logisztika' },
    { to: '/logistics/stock-alerts', label: 'Készlet riasztások', parentMenu: 'Logisztika' },
    { to: '/price-lists', label: 'Árlisták', parentMenu: 'Logisztika' },
    { to: '/logistics/purchase-orders', label: 'Beszerzések', parentMenu: 'Logisztika' },
    { to: '/returns', label: 'Visszárú', parentMenu: 'Logisztika' },
    { to: '/inventory-sheets', label: 'Leltár', parentMenu: 'Logisztika' },
    { to: '/logistics/reports', label: 'Riportok', parentMenu: 'Logisztika' },
    { to: '/logistics/audit', label: 'Audit napló', parentMenu: 'Logisztika' },
    { to: '/suppliers', label: 'Szállítók', parentMenu: 'Logisztika' },
    { to: '/logistics/stock-valuation', label: 'Készletérték', parentMenu: 'Logisztika' },
    { to: '/logistics/stock-reservations', label: 'Foglaltság', parentMenu: 'Logisztika' },
    { to: '/intrastat', label: 'INTRASTAT', parentMenu: 'Logisztika' },
  ] as MenuItem[],
};

export const MODULE_CONTROLLING = {
  routes: [
    '/controlling/dashboard',
    '/controlling/reports',
    '/controlling/adhoc',
    '/controlling/kpi',
    '/controlling/database-connections',
    '/controlling/queries',
  ],
  menuItems: [
    { to: '/controlling/dashboard', label: 'Dashboard', parentMenu: 'Kontrolling' },
    { to: '/controlling/kpi', label: 'KPI mutatószámok', parentMenu: 'Kontrolling' },
    { to: '/controlling/reports', label: 'Riportok', parentMenu: 'Kontrolling' },
    { to: '/controlling/adhoc', label: 'Ad-hoc riport', parentMenu: 'Kontrolling' },
    { to: '/controlling/database-connections', label: 'Adatbázis kapcsolatok', parentMenu: 'Kontrolling' },
    { to: '/controlling/queries', label: 'Lekérdezések', parentMenu: 'Kontrolling' },
  ] as MenuItem[],
};

export const MODULE_HR = {
  routes: [
    '/hr/job-positions',
    '/hr/employees',
    '/hr/contracts',
    '/hr/cafeteria',
    '/hr/recruitment',
    '/hr/onboarding',
    '/hr/performance',
    '/hr/time',
    '/hr/leave',
    '/hr/reports',
  ],
  menuItems: [
    { to: '/hr/employees', label: 'Dolgozók', parentMenu: 'HR' },
    { to: '/hr/job-positions', label: 'Munkakörök', parentMenu: 'HR' },
    { to: '/hr/contracts', label: 'Szerződések', parentMenu: 'HR' },
    { to: '/hr/reports', label: 'Riportok', parentMenu: 'HR' },
    { to: '/hr/cafeteria', label: 'Cafeteria', parentMenu: 'HR' },
    { to: '/hr/recruitment', label: 'Toborzás', parentMenu: 'HR' },
    { to: '/hr/onboarding', label: 'Beléptetés', parentMenu: 'HR' },
    { to: '/hr/performance', label: 'Teljesítmény', parentMenu: 'HR' },
    { to: '/hr/time', label: 'Időgazdálkodás', parentMenu: 'HR' },
    { to: '/hr/leave', label: 'Távollétek', parentMenu: 'HR' },
  ] as MenuItem[],
};

/** Régi PACKAGE_CONFIGS kompatibilitás – delegál a központi ERP_PACKAGES-re */
export const PACKAGE_CONFIGS = Object.fromEntries(
  Object.entries(ERP_PACKAGES).map(([id, pkg]) => [
    id,
    { name: pkg.displayName, modules: pkg.modules },
  ]),
);

export function getActivePackage(): string {
  const packageName = import.meta.env.VITE_ACTIVE_PACKAGE || 'full';
  if (import.meta.env.DEV) {
    console.log('[Module Config] Active package:', resolvePackageId(packageName));
  }
  return resolvePackageId(packageName);
}

export function getPackageDisplayInfo() {
  return getPackageDefinition(getActivePackage());
}

export function isModuleEnabled(module: ErpModuleKey): boolean {
  return isPackageModuleEnabled(module, getActivePackage());
}

export function isHrOnlyPackage(): boolean {
  return getActivePackage() === 'hr' || getActivePackage() === 'package-hr';
}

export function getModuleRoutes(module: ErpModuleKey): string[] {
  switch (module) {
    case 'documents':
      return MODULE_DOCUMENTS.routes;
    case 'team':
      return MODULE_TEAM.routes;
    case 'crm':
      return MODULE_CRM.routes;
    case 'logistics':
      return MODULE_LOGISTICS.routes;
    case 'controlling':
      return MODULE_CONTROLLING.routes;
    case 'hr':
      return MODULE_HR.routes;
    default:
      return [];
  }
}

export function getModuleMenuItems(module: ErpModuleKey): MenuItem[] {
  const activePackage = getActivePackage();
  switch (module) {
    case 'documents':
      return MODULE_DOCUMENTS.menuItems;
    case 'team':
      return MODULE_TEAM.menuItems;
    case 'crm':
      if (activePackage === 'package-5') {
        return [{ to: '/crm', label: 'Partnerek', parentMenu: 'Ügyfélkezelés' }];
      }
      return MODULE_CRM.menuItems;
    case 'hr':
      return MODULE_HR.menuItems;
    case 'logistics':
      return MODULE_LOGISTICS.menuItems;
    case 'controlling':
      return MODULE_CONTROLLING.menuItems;
    default:
      return [];
  }
}

export function isHrModuleEnabled(): boolean {
  return isModuleEnabled('hr');
}
