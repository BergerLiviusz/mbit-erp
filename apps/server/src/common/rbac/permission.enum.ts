export enum Permission {
  // CRM Permissions
  CRM_VIEW = 'crm:view',
  CRM_CREATE = 'crm:create',
  CRM_EDIT = 'crm:edit',
  CRM_DELETE = 'crm:delete',
  CRM_EXPORT = 'crm:export',
  
  // Customer specific
  CUSTOMER_VIEW = 'customer:view',
  CUSTOMER_CREATE = 'customer:create',
  CUSTOMER_EDIT = 'customer:edit',
  CUSTOMER_DELETE = 'customer:delete',
  
  // Opportunity specific
  OPPORTUNITY_VIEW = 'opportunity:view',
  OPPORTUNITY_CREATE = 'opportunity:create',
  OPPORTUNITY_EDIT = 'opportunity:edit',
  OPPORTUNITY_DELETE = 'opportunity:delete',
  
  // Quote specific
  QUOTE_VIEW = 'quote:view',
  QUOTE_CREATE = 'quote:create',
  QUOTE_EDIT = 'quote:edit',
  QUOTE_DELETE = 'quote:delete',
  QUOTE_APPROVE = 'quote:approve',
  QUOTE_SEND = 'quote:send',
  
  // Order specific
  ORDER_VIEW = 'order:view',
  ORDER_CREATE = 'order:create',
  ORDER_EDIT = 'order:edit',
  ORDER_DELETE = 'order:delete',
  ORDER_FULFILL = 'order:fulfill',
  ORDER_CANCEL = 'order:cancel',
  
  // DMS Permissions
  DMS_VIEW = 'dms:view',
  DMS_CREATE = 'dms:create',
  DMS_EDIT = 'dms:edit',
  DMS_DELETE = 'dms:delete',
  DMS_DOWNLOAD = 'dms:download',
  DMS_UPLOAD = 'dms:upload',
  DMS_VERSION = 'dms:version',
  DMS_APPROVE_DISPOSAL = 'dms:approve_disposal',
  
  // Logistics Permissions
  LOGISTICS_VIEW = 'logistics:view',
  LOGISTICS_CREATE = 'logistics:create',
  LOGISTICS_EDIT = 'logistics:edit',
  LOGISTICS_DELETE = 'logistics:delete',
  
  // Stock specific
  STOCK_VIEW = 'stock:view',
  STOCK_MOVE = 'stock:move',
  STOCK_ADJUST = 'stock:adjust',
  STOCK_INVENTORY = 'stock:inventory',
  
  // System Permissions
  SYSTEM_SETTINGS = 'system:settings',
  SYSTEM_BACKUP = 'system:backup',
  SYSTEM_RESTORE = 'system:restore',
  SYSTEM_AUDIT_VIEW = 'system:audit_view',
  SYSTEM_AUDIT_EXPORT = 'system:audit_export',
  SYSTEM_DIAGNOSTICS = 'system:diagnostics',
  
  // User Management
  USER_VIEW = 'user:view',
  USER_CREATE = 'user:create',
  USER_EDIT = 'user:edit',
  USER_DELETE = 'user:delete',
  USER_MANAGE_ROLES = 'user:manage_roles',
  
  // Role Management
  ROLE_VIEW = 'role:view',
  ROLE_CREATE = 'role:create',
  ROLE_EDIT = 'role:edit',
  ROLE_DELETE = 'role:delete',
  
  // Report Permissions
  REPORT_VIEW = 'report:view',
  REPORT_CREATE = 'report:create',
  REPORT_EXPORT = 'report:export',
}

export const PermissionDescriptions: Record<Permission, { nev: string; modulo: string; leiras: string }> = {
  [Permission.CRM_VIEW]: { nev: 'CRM megtekintése', modulo: 'CRM', leiras: 'CRM modulban való böngészés' },
  [Permission.CRM_CREATE]: { nev: 'CRM létrehozás', modulo: 'CRM', leiras: 'Új CRM rekordok létrehozása' },
  [Permission.CRM_EDIT]: { nev: 'CRM szerkesztés', modulo: 'CRM', leiras: 'CRM rekordok módosítása' },
  [Permission.CRM_DELETE]: { nev: 'CRM törlés', modulo: 'CRM', leiras: 'CRM rekordok törlése' },
  [Permission.CRM_EXPORT]: { nev: 'CRM exportálás', modulo: 'CRM', leiras: 'CRM adatok exportálása' },
  
  [Permission.CUSTOMER_VIEW]: { nev: 'Ügyfelek megtekintése', modulo: 'CRM', leiras: 'Ügyféladatok megtekintése' },
  [Permission.CUSTOMER_CREATE]: { nev: 'Ügyfél létrehozás', modulo: 'CRM', leiras: 'Új ügyfelek felvétele' },
  [Permission.CUSTOMER_EDIT]: { nev: 'Ügyfél szerkesztés', modulo: 'CRM', leiras: 'Ügyféladatok módosítása' },
  [Permission.CUSTOMER_DELETE]: { nev: 'Ügyfél törlés', modulo: 'CRM', leiras: 'Ügyfelek törlése' },
  
  [Permission.OPPORTUNITY_VIEW]: { nev: 'Lehetőségek megtekintése', modulo: 'CRM', leiras: 'Üzleti lehetőségek megtekintése' },
  [Permission.OPPORTUNITY_CREATE]: { nev: 'Lehetőség létrehozás', modulo: 'CRM', leiras: 'Új lehetőségek rögzítése' },
  [Permission.OPPORTUNITY_EDIT]: { nev: 'Lehetőség szerkesztés', modulo: 'CRM', leiras: 'Lehetőségek módosítása' },
  [Permission.OPPORTUNITY_DELETE]: { nev: 'Lehetőség törlés', modulo: 'CRM', leiras: 'Lehetőségek törlése' },
  
  [Permission.QUOTE_VIEW]: { nev: 'Árajánlatok megtekintése', modulo: 'CRM', leiras: 'Árajánlatok böngészése' },
  [Permission.QUOTE_CREATE]: { nev: 'Árajánlat létrehozás', modulo: 'CRM', leiras: 'Új árajánlatok készítése' },
  [Permission.QUOTE_EDIT]: { nev: 'Árajánlat szerkesztés', modulo: 'CRM', leiras: 'Árajánlatok módosítása' },
  [Permission.QUOTE_DELETE]: { nev: 'Árajánlat törlés', modulo: 'CRM', leiras: 'Árajánlatok törlése' },
  [Permission.QUOTE_APPROVE]: { nev: 'Árajánlat jóváhagyás', modulo: 'CRM', leiras: 'Magas értékű árajánlatok jóváhagyása' },
  [Permission.QUOTE_SEND]: { nev: 'Árajánlat küldés', modulo: 'CRM', leiras: 'Árajánlatok kiküldése ügyfeleknek' },
  
  [Permission.ORDER_VIEW]: { nev: 'Rendelések megtekintése', modulo: 'CRM', leiras: 'Rendelések böngészése' },
  [Permission.ORDER_CREATE]: { nev: 'Rendelés létrehozás', modulo: 'CRM', leiras: 'Új rendelések rögzítése' },
  [Permission.ORDER_EDIT]: { nev: 'Rendelés szerkesztés', modulo: 'CRM', leiras: 'Rendelések módosítása' },
  [Permission.ORDER_DELETE]: { nev: 'Rendelés törlés', modulo: 'CRM', leiras: 'Rendelések törlése' },
  [Permission.ORDER_FULFILL]: { nev: 'Rendelés teljesítés', modulo: 'CRM', leiras: 'Rendelések teljesítése' },
  [Permission.ORDER_CANCEL]: { nev: 'Rendelés visszavonás', modulo: 'CRM', leiras: 'Rendelések sztornózása' },
  
  [Permission.DMS_VIEW]: { nev: 'Dokumentumok megtekintése', modulo: 'DMS', leiras: 'Dokumentumok böngészése' },
  [Permission.DMS_CREATE]: { nev: 'Dokumentum iktatás', modulo: 'DMS', leiras: 'Új dokumentumok iktatása' },
  [Permission.DMS_EDIT]: { nev: 'Dokumentum szerkesztés', modulo: 'DMS', leiras: 'Dokumentum adatok módosítása' },
  [Permission.DMS_DELETE]: { nev: 'Dokumentum törlés', modulo: 'DMS', leiras: 'Dokumentumok törlése' },
  [Permission.DMS_DOWNLOAD]: { nev: 'Dokumentum letöltés', modulo: 'DMS', leiras: 'Dokumentumok letöltése' },
  [Permission.DMS_UPLOAD]: { nev: 'Fájl feltöltés', modulo: 'DMS', leiras: 'Fájlok feltöltése' },
  [Permission.DMS_VERSION]: { nev: 'Verziókezelés', modulo: 'DMS', leiras: 'Dokumentum verziók kezelése' },
  [Permission.DMS_APPROVE_DISPOSAL]: { nev: 'Selejtezés jóváhagyás', modulo: 'DMS', leiras: 'Dokumentum selejtezés engedélyezése' },
  
  [Permission.LOGISTICS_VIEW]: { nev: 'Logisztika megtekintése', modulo: 'Logisztika', leiras: 'Logisztikai adatok böngészése' },
  [Permission.LOGISTICS_CREATE]: { nev: 'Logisztika létrehozás', modulo: 'Logisztika', leiras: 'Új törzsadatok rögzítése' },
  [Permission.LOGISTICS_EDIT]: { nev: 'Logisztika szerkesztés', modulo: 'Logisztika', leiras: 'Törzsadatok módosítása' },
  [Permission.LOGISTICS_DELETE]: { nev: 'Logisztika törlés', modulo: 'Logisztika', leiras: 'Törzsadatok törlése' },
  
  [Permission.STOCK_VIEW]: { nev: 'Készlet megtekintése', modulo: 'Logisztika', leiras: 'Készletállományok megtekintése' },
  [Permission.STOCK_MOVE]: { nev: 'Készletmozgás', modulo: 'Logisztika', leiras: 'Készletmozgások rögzítése' },
  [Permission.STOCK_ADJUST]: { nev: 'Készlet korrekció', modulo: 'Logisztika', leiras: 'Készlet korrekciók végrehajtása' },
  [Permission.STOCK_INVENTORY]: { nev: 'Leltározás', modulo: 'Logisztika', leiras: 'Leltár rögzítés és lezárás' },
  
  [Permission.SYSTEM_SETTINGS]: { nev: 'Rendszer beállítások', modulo: 'Rendszer', leiras: 'Rendszerbeállítások módosítása' },
  [Permission.SYSTEM_BACKUP]: { nev: 'Biztonsági mentés', modulo: 'Rendszer', leiras: 'Mentések készítése' },
  [Permission.SYSTEM_RESTORE]: { nev: 'Visszaállítás', modulo: 'Rendszer', leiras: 'Rendszer visszaállítása' },
  [Permission.SYSTEM_AUDIT_VIEW]: { nev: 'Audit napló megtekintés', modulo: 'Rendszer', leiras: 'Audit naplók böngészése' },
  [Permission.SYSTEM_AUDIT_EXPORT]: { nev: 'Audit exportálás', modulo: 'Rendszer', leiras: 'Audit naplók exportálása' },
  [Permission.SYSTEM_DIAGNOSTICS]: { nev: 'Diagnosztika', modulo: 'Rendszer', leiras: 'Rendszer diagnosztika futtatása' },
  
  [Permission.USER_VIEW]: { nev: 'Felhasználók megtekintése', modulo: 'Felhasználók', leiras: 'Felhasználók listázása' },
  [Permission.USER_CREATE]: { nev: 'Felhasználó létrehozás', modulo: 'Felhasználók', leiras: 'Új felhasználók felvétele' },
  [Permission.USER_EDIT]: { nev: 'Felhasználó szerkesztés', modulo: 'Felhasználók', leiras: 'Felhasználók módosítása' },
  [Permission.USER_DELETE]: { nev: 'Felhasználó törlés', modulo: 'Felhasználók', leiras: 'Felhasználók törlése' },
  [Permission.USER_MANAGE_ROLES]: { nev: 'Szerepkörök kezelése', modulo: 'Felhasználók', leiras: 'Felhasználói szerepkörök hozzárendelése' },
  
  [Permission.ROLE_VIEW]: { nev: 'Szerepkörök megtekintése', modulo: 'Szerepkörök', leiras: 'Szerepkörök listázása' },
  [Permission.ROLE_CREATE]: { nev: 'Szerepkör létrehozás', modulo: 'Szerepkörök', leiras: 'Új szerepkörök definiálása' },
  [Permission.ROLE_EDIT]: { nev: 'Szerepkör szerkesztés', modulo: 'Szerepkörök', leiras: 'Szerepkörök módosítása' },
  [Permission.ROLE_DELETE]: { nev: 'Szerepkör törlés', modulo: 'Szerepkörök', leiras: 'Szerepkörök törlése' },
  
  [Permission.REPORT_VIEW]: { nev: 'Jelentések megtekintése', modulo: 'Jelentések', leiras: 'Riportok böngészése' },
  [Permission.REPORT_CREATE]: { nev: 'Jelentés készítés', modulo: 'Jelentések', leiras: 'Új riportok generálása' },
  [Permission.REPORT_EXPORT]: { nev: 'Jelentés exportálás', modulo: 'Jelentések', leiras: 'Riportok exportálása' },
};
