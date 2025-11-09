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
  
  // Campaign specific
  CAMPAIGN_VIEW = 'campaign:view',
  CAMPAIGN_CREATE = 'campaign:create',
  CAMPAIGN_EDIT = 'campaign:edit',
  CAMPAIGN_DELETE = 'campaign:delete',
  
  // Ticket specific
  TICKET_VIEW = 'ticket:view',
  TICKET_CREATE = 'ticket:create',
  TICKET_EDIT = 'ticket:edit',
  TICKET_DELETE = 'ticket:delete',
  TICKET_ASSIGN = 'ticket:assign',
  
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
  
  // Document specific
  DOCUMENT_VIEW = 'document:view',
  DOCUMENT_CREATE = 'document:create',
  DOCUMENT_EDIT = 'document:edit',
  DOCUMENT_DELETE = 'document:delete',
  DOCUMENT_APPROVE = 'document:approve',
  DOCUMENT_ARCHIVE = 'document:archive',
  DOCUMENT_OCR = 'document:ocr',
  
  // Logistics Permissions
  LOGISTICS_VIEW = 'logistics:view',
  LOGISTICS_CREATE = 'logistics:create',
  LOGISTICS_EDIT = 'logistics:edit',
  LOGISTICS_DELETE = 'logistics:delete',
  
  // Warehouse specific
  WAREHOUSE_VIEW = 'warehouse:view',
  WAREHOUSE_CREATE = 'warehouse:create',
  WAREHOUSE_EDIT = 'warehouse:edit',
  WAREHOUSE_DELETE = 'warehouse:delete',
  WAREHOUSE_MANAGE_LOCATIONS = 'warehouse:manage_locations',
  
  // Product/Item specific
  PRODUCT_VIEW = 'product:view',
  PRODUCT_CREATE = 'product:create',
  PRODUCT_EDIT = 'product:edit',
  PRODUCT_DELETE = 'product:delete',
  
  // Stock specific
  STOCK_VIEW = 'stock:view',
  STOCK_EDIT = 'stock:edit',
  STOCK_MOVE = 'stock:move',
  STOCK_ADJUST = 'stock:adjust',
  STOCK_INVENTORY = 'stock:inventory',
  STOCK_TRANSFER = 'stock:transfer',
  
  // Purchase Order specific
  PURCHASE_ORDER_VIEW = 'purchase_order:view',
  PURCHASE_ORDER_CREATE = 'purchase_order:create',
  PURCHASE_ORDER_EDIT = 'purchase_order:edit',
  PURCHASE_ORDER_DELETE = 'purchase_order:delete',
  PURCHASE_ORDER_APPROVE = 'purchase_order:approve',
  PURCHASE_ORDER_RECEIVE = 'purchase_order:receive',
  
  // Shipment specific
  SHIPMENT_VIEW = 'shipment:view',
  SHIPMENT_CREATE = 'shipment:create',
  SHIPMENT_EDIT = 'shipment:edit',
  SHIPMENT_DELETE = 'shipment:delete',
  SHIPMENT_DISPATCH = 'shipment:dispatch',
  
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
  
  [Permission.CAMPAIGN_VIEW]: { nev: 'Kampányok megtekintése', modulo: 'CRM', leiras: 'Marketing kampányok böngészése' },
  [Permission.CAMPAIGN_CREATE]: { nev: 'Kampány létrehozás', modulo: 'CRM', leiras: 'Új kampányok indítása' },
  [Permission.CAMPAIGN_EDIT]: { nev: 'Kampány szerkesztés', modulo: 'CRM', leiras: 'Kampányok módosítása' },
  [Permission.CAMPAIGN_DELETE]: { nev: 'Kampány törlés', modulo: 'CRM', leiras: 'Kampányok törlése' },
  
  [Permission.TICKET_VIEW]: { nev: 'Reklamációk megtekintése', modulo: 'CRM', leiras: 'Ticketek és reklamációk böngészése' },
  [Permission.TICKET_CREATE]: { nev: 'Reklamáció létrehozás', modulo: 'CRM', leiras: 'Új ticketek rögzítése' },
  [Permission.TICKET_EDIT]: { nev: 'Reklamáció szerkesztés', modulo: 'CRM', leiras: 'Ticketek módosítása' },
  [Permission.TICKET_DELETE]: { nev: 'Reklamáció törlés', modulo: 'CRM', leiras: 'Ticketek törlése' },
  [Permission.TICKET_ASSIGN]: { nev: 'Reklamáció hozzárendelés', modulo: 'CRM', leiras: 'Ticketek kiosztása felhasználóknak' },
  
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
  
  [Permission.DOCUMENT_VIEW]: { nev: 'Dokumentum megtekintés', modulo: 'DMS', leiras: 'Egyes dokumentumok megtekintése' },
  [Permission.DOCUMENT_CREATE]: { nev: 'Dokumentum létrehozás', modulo: 'DMS', leiras: 'Új dokumentum rekord rögzítése' },
  [Permission.DOCUMENT_EDIT]: { nev: 'Dokumentum adatok szerkesztés', modulo: 'DMS', leiras: 'Metaadatok módosítása' },
  [Permission.DOCUMENT_DELETE]: { nev: 'Dokumentum eltávolítás', modulo: 'DMS', leiras: 'Dokumentum végeleges törlése' },
  [Permission.DOCUMENT_APPROVE]: { nev: 'Dokumentum jóváhagyás', modulo: 'DMS', leiras: 'Dokumentumok workflow jóváhagyása' },
  [Permission.DOCUMENT_ARCHIVE]: { nev: 'Dokumentum archiválás', modulo: 'DMS', leiras: 'Dokumentumok archiválása' },
  [Permission.DOCUMENT_OCR]: { nev: 'OCR feldolgozás', modulo: 'DMS', leiras: 'OCR szövegfelismerés futtatása' },
  
  [Permission.LOGISTICS_VIEW]: { nev: 'Logisztika megtekintése', modulo: 'Logisztika', leiras: 'Logisztikai adatok böngészése' },
  [Permission.LOGISTICS_CREATE]: { nev: 'Logisztika létrehozás', modulo: 'Logisztika', leiras: 'Új törzsadatok rögzítése' },
  [Permission.LOGISTICS_EDIT]: { nev: 'Logisztika szerkesztés', modulo: 'Logisztika', leiras: 'Törzsadatok módosítása' },
  [Permission.LOGISTICS_DELETE]: { nev: 'Logisztika törlés', modulo: 'Logisztika', leiras: 'Törzsadatok törlése' },
  
  [Permission.WAREHOUSE_VIEW]: { nev: 'Raktárak megtekintése', modulo: 'Logisztika', leiras: 'Raktárak és helyek böngészése' },
  [Permission.WAREHOUSE_CREATE]: { nev: 'Raktár létrehozás', modulo: 'Logisztika', leiras: 'Új raktár rögzítése' },
  [Permission.WAREHOUSE_EDIT]: { nev: 'Raktár szerkesztés', modulo: 'Logisztika', leiras: 'Raktár adatok módosítása' },
  [Permission.WAREHOUSE_DELETE]: { nev: 'Raktár törlés', modulo: 'Logisztika', leiras: 'Raktár eltávolítása' },
  [Permission.WAREHOUSE_MANAGE_LOCATIONS]: { nev: 'Raktári helyek kezelése', modulo: 'Logisztika', leiras: 'Helyek, zónák, polcok szervezése' },
  
  [Permission.PRODUCT_VIEW]: { nev: 'Termékek megtekintése', modulo: 'Logisztika', leiras: 'Termékek és cikkek böngészése' },
  [Permission.PRODUCT_CREATE]: { nev: 'Termék létrehozás', modulo: 'Logisztika', leiras: 'Új termékek felvétele' },
  [Permission.PRODUCT_EDIT]: { nev: 'Termék szerkesztés', modulo: 'Logisztika', leiras: 'Termékek módosítása' },
  [Permission.PRODUCT_DELETE]: { nev: 'Termék törlés', modulo: 'Logisztika', leiras: 'Termékek törlése' },
  
  [Permission.STOCK_VIEW]: { nev: 'Készlet megtekintése', modulo: 'Logisztika', leiras: 'Készletállományok megtekintése' },
  [Permission.STOCK_EDIT]: { nev: 'Készletszint szerkesztés', modulo: 'Logisztika', leiras: 'Készletszintek létrehozása és módosítása' },
  [Permission.STOCK_MOVE]: { nev: 'Készletmozgás', modulo: 'Logisztika', leiras: 'Készletmozgások rögzítése' },
  [Permission.STOCK_ADJUST]: { nev: 'Készlet korrekció', modulo: 'Logisztika', leiras: 'Készlet korrekciók végrehajtása' },
  [Permission.STOCK_INVENTORY]: { nev: 'Leltározás', modulo: 'Logisztika', leiras: 'Leltár rögzítés és lezárás' },
  [Permission.STOCK_TRANSFER]: { nev: 'Készlet áthelyezés', modulo: 'Logisztika', leiras: 'Raktárak közötti készletáthelyezés' },
  
  [Permission.PURCHASE_ORDER_VIEW]: { nev: 'Beszerzési rendelések megtekintése', modulo: 'Logisztika', leiras: 'Beszerzések böngészése' },
  [Permission.PURCHASE_ORDER_CREATE]: { nev: 'Beszerzési rendelés létrehozás', modulo: 'Logisztika', leiras: 'Új beszerzések rögzítése' },
  [Permission.PURCHASE_ORDER_EDIT]: { nev: 'Beszerzési rendelés szerkesztés', modulo: 'Logisztika', leiras: 'Beszerzések módosítása' },
  [Permission.PURCHASE_ORDER_DELETE]: { nev: 'Beszerzési rendelés törlés', modulo: 'Logisztika', leiras: 'Beszerzések törlése' },
  [Permission.PURCHASE_ORDER_APPROVE]: { nev: 'Beszerzés jóváhagyás', modulo: 'Logisztika', leiras: 'Beszerzések engedélyezése' },
  [Permission.PURCHASE_ORDER_RECEIVE]: { nev: 'Áruátvétel rögzítés', modulo: 'Logisztika', leiras: 'Beszerzett áruk bevételezése' },
  
  [Permission.SHIPMENT_VIEW]: { nev: 'Szállítások megtekintése', modulo: 'Logisztika', leiras: 'Szállítmányok böngészése' },
  [Permission.SHIPMENT_CREATE]: { nev: 'Szállítás létrehozás', modulo: 'Logisztika', leiras: 'Új szállítmány rögzítése' },
  [Permission.SHIPMENT_EDIT]: { nev: 'Szállítás szerkesztés', modulo: 'Logisztika', leiras: 'Szállítmány adatok módosítása' },
  [Permission.SHIPMENT_DELETE]: { nev: 'Szállítás törlés', modulo: 'Logisztika', leiras: 'Szállítmány törlése' },
  [Permission.SHIPMENT_DISPATCH]: { nev: 'Szállítás indítás', modulo: 'Logisztika', leiras: 'Szállítmány kiadása/indítása' },
  
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
