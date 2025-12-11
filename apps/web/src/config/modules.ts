export interface MenuItem {
  to: string;
  label: string;
  parentMenu?: string;
}

export interface ModuleConfig {
  enabled: boolean;
  name: string;
  routes: string[];
  menuItems: MenuItem[];
}

export interface PackageConfig {
  name: string;
  modules: {
    documents: boolean;
    team: boolean;
    controlling: boolean;
    crm: boolean;
    logistics: boolean;
  };
}

// Modul definíciók
export const MODULE_DOCUMENTS: ModuleConfig = {
  enabled: true, // Mindig engedélyezve (minden csomagban benne van)
  name: 'Dokumentum kezelés',
  routes: ['/documents'],
  menuItems: [
    { to: '/documents', label: 'Dokumentumok' }
  ]
};

export const MODULE_TEAM: ModuleConfig = {
  enabled: false,
  name: 'Csapatmunka',
  routes: ['/team', '/workflows'],
  menuItems: [
    { to: '/team', label: 'Csapat kommunikáció' },
    { to: '/workflows', label: 'Folyamatleltár' }
  ]
};

export const MODULE_CRM: ModuleConfig = {
  enabled: false,
  name: 'CRM',
  routes: ['/crm', '/opportunities', '/quotes', '/orders', '/crm/invoices', '/crm/chat'],
  menuItems: [
    { to: '/crm', label: 'Partnerek', parentMenu: 'Ügyfélkezelés' },
    { to: '/opportunities', label: 'Lehetőségek', parentMenu: 'Ügyfélkezelés' },
    { to: '/quotes', label: 'Árajánlatok', parentMenu: 'Ügyfélkezelés' },
    { to: '/orders', label: 'Rendelések', parentMenu: 'Ügyfélkezelés' },
    { to: '/crm/invoices', label: 'Számlák', parentMenu: 'Ügyfélkezelés' },
    { to: '/crm/chat', label: 'Chat', parentMenu: 'Ügyfélkezelés' }
  ]
};

export const MODULE_LOGISTICS: ModuleConfig = {
  enabled: false,
  name: 'Logisztika',
  routes: [
    '/warehouses',
    '/products',
    '/returns',
    '/suppliers',
    '/orders-logistics',
    '/inventory-sheets',
    '/intrastat',
    '/logistics/stock-valuation',
    '/logistics/stock-reservations'
  ],
  menuItems: [
    { to: '/warehouses', label: 'Raktárak', parentMenu: 'Logisztika' },
    { to: '/products', label: 'Termékek', parentMenu: 'Logisztika' },
    { to: '/returns', label: 'Visszárúk', parentMenu: 'Logisztika' },
    { to: '/suppliers', label: 'Szállítók', parentMenu: 'Logisztika' },
    { to: '/orders-logistics', label: 'Rendelések', parentMenu: 'Logisztika' },
    { to: '/inventory-sheets', label: 'Leltárívek', parentMenu: 'Logisztika' },
    { to: '/intrastat', label: 'INTRASTAT', parentMenu: 'Logisztika' },
    { to: '/logistics/stock-valuation', label: 'Készletérték értékelés', parentMenu: 'Logisztika' },
    { to: '/logistics/stock-reservations', label: 'Foglaltság és konszignáció', parentMenu: 'Logisztika' }
  ]
};

export const MODULE_CONTROLLING: ModuleConfig = {
  enabled: false,
  name: 'Kontrolling',
  routes: [
    '/controlling/database-connections',
    '/controlling/kpi',
    '/controlling/queries'
  ],
  menuItems: [
    { to: '/controlling/database-connections', label: 'Adatbázis kapcsolatok', parentMenu: 'Kontrolling' },
    { to: '/controlling/kpi', label: 'KPI mutatószámok', parentMenu: 'Kontrolling' },
    { to: '/controlling/queries', label: 'Lekérdezések', parentMenu: 'Kontrolling' }
  ]
};

// Csomag konfigurációk
export const PACKAGE_CONFIGS: Record<string, PackageConfig> = {
  'package-1': {
    name: 'Csomag 1',
    modules: {
      documents: true,
      team: true,
      controlling: true,
      crm: false,
      logistics: false
    }
  },
  'package-2': {
    name: 'Csomag 2',
    modules: {
      documents: true,
      team: false,
      controlling: false,
      crm: true,
      logistics: true
    }
  },
  'package-3': {
    name: 'Csomag 3',
    modules: {
      documents: true,
      team: true,
      controlling: false,
      crm: true,
      logistics: false
    }
  },
  'package-4': {
    name: 'Csomag 4',
    modules: {
      documents: true,
      team: true,
      controlling: false,
      crm: true,
      logistics: true
    }
  },
  'package-5': {
    name: 'Csomag 5',
    modules: {
      documents: true,
      team: false,
      controlling: false,
      crm: true, // Engedélyezve, hogy a Partnerek elérhető legyen a dokumentumokhoz
      logistics: false
    }
  },
  'full': {
    name: 'Teljes verzió',
    modules: {
      documents: true,
      team: true,
      controlling: true,
      crm: true,
      logistics: true
    }
  }
};

// Aktuális csomag meghatározása build-time változóból
export function getActivePackage(): keyof typeof PACKAGE_CONFIGS {
  // Vite build-time változó: VITE_ACTIVE_PACKAGE
  // Vite automatikusan elérhetővé teszi a VITE_ prefixű environment változókat
  const packageName = import.meta.env.VITE_ACTIVE_PACKAGE || 'full';
  
  // Debug információ (csak development módban)
  if (import.meta.env.DEV) {
    console.log('[Module Config] Active package:', packageName);
    console.log('[Module Config] VITE_ACTIVE_PACKAGE env:', import.meta.env.VITE_ACTIVE_PACKAGE);
    console.log('[Module Config] All env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
  }
  
  // Validálás: ha nem létező package, akkor default 'full'
  if (!PACKAGE_CONFIGS[packageName]) {
    console.warn(`[Module Config] Unknown package: ${packageName}, falling back to 'full'`);
    return 'full';
  }
  
  return packageName as keyof typeof PACKAGE_CONFIGS;
}

// Modul engedélyezés ellenőrzése
export function isModuleEnabled(
  module: 'documents' | 'team' | 'crm' | 'logistics' | 'controlling'
): boolean {
  const activePackage = getActivePackage();
  const config = PACKAGE_CONFIGS[activePackage];
  
  if (!config) {
    console.warn(`Package config not found for: ${activePackage}`);
    return false;
  }
  
  return config.modules[module] ?? false;
}

// Modul route-ok lekérése
export function getModuleRoutes(module: 'documents' | 'team' | 'crm' | 'logistics' | 'controlling'): string[] {
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
    default:
      return [];
  }
}

// Modul menu items lekérése
export function getModuleMenuItems(module: 'documents' | 'team' | 'crm' | 'logistics' | 'controlling'): MenuItem[] {
  const activePackage = getActivePackage();
  
  switch (module) {
    case 'documents':
      return MODULE_DOCUMENTS.menuItems;
    case 'team':
      return MODULE_TEAM.menuItems;
    case 'crm':
      // Package-5-ben csak a Partnerek menüpontot mutatjuk meg
      if (activePackage === 'package-5') {
        return [{ to: '/crm', label: 'Partnerek', parentMenu: 'Ügyfélkezelés' }];
      }
      return MODULE_CRM.menuItems;
    case 'logistics':
      return MODULE_LOGISTICS.menuItems;
    case 'controlling':
      return MODULE_CONTROLLING.menuItems;
    default:
      return [];
  }
}

// Helper függvény: HR modul elérhetőségének ellenőrzése
// Az HR modul minden package-ben elérhető, kivéve package-5-ben
export function isHrModuleEnabled(): boolean {
  const activePackage = getActivePackage();
  return activePackage !== 'package-5';
}

