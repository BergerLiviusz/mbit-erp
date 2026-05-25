"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionDescriptions = exports.Permission = void 0;
var Permission;
(function (Permission) {
    // CRM Permissions
    Permission["CRM_VIEW"] = "crm:view";
    Permission["CRM_CREATE"] = "crm:create";
    Permission["CRM_EDIT"] = "crm:edit";
    Permission["CRM_DELETE"] = "crm:delete";
    Permission["CRM_EXPORT"] = "crm:export";
    // Customer specific
    Permission["CUSTOMER_VIEW"] = "customer:view";
    Permission["CUSTOMER_CREATE"] = "customer:create";
    Permission["CUSTOMER_EDIT"] = "customer:edit";
    Permission["CUSTOMER_DELETE"] = "customer:delete";
    // Opportunity specific
    Permission["OPPORTUNITY_VIEW"] = "opportunity:view";
    Permission["OPPORTUNITY_CREATE"] = "opportunity:create";
    Permission["OPPORTUNITY_EDIT"] = "opportunity:edit";
    Permission["OPPORTUNITY_DELETE"] = "opportunity:delete";
    // Quote specific
    Permission["QUOTE_VIEW"] = "quote:view";
    Permission["QUOTE_CREATE"] = "quote:create";
    Permission["QUOTE_EDIT"] = "quote:edit";
    Permission["QUOTE_DELETE"] = "quote:delete";
    Permission["QUOTE_APPROVE"] = "quote:approve";
    Permission["QUOTE_SEND"] = "quote:send";
    // Campaign specific
    Permission["CAMPAIGN_VIEW"] = "campaign:view";
    Permission["CAMPAIGN_CREATE"] = "campaign:create";
    Permission["CAMPAIGN_EDIT"] = "campaign:edit";
    Permission["CAMPAIGN_DELETE"] = "campaign:delete";
    // Ticket specific
    Permission["TICKET_VIEW"] = "ticket:view";
    Permission["TICKET_CREATE"] = "ticket:create";
    Permission["TICKET_EDIT"] = "ticket:edit";
    Permission["TICKET_DELETE"] = "ticket:delete";
    Permission["TICKET_ASSIGN"] = "ticket:assign";
    // Order specific
    Permission["ORDER_VIEW"] = "order:view";
    Permission["ORDER_CREATE"] = "order:create";
    Permission["ORDER_EDIT"] = "order:edit";
    Permission["ORDER_DELETE"] = "order:delete";
    Permission["ORDER_FULFILL"] = "order:fulfill";
    Permission["ORDER_CANCEL"] = "order:cancel";
    // DMS Permissions
    Permission["DMS_VIEW"] = "dms:view";
    Permission["DMS_CREATE"] = "dms:create";
    Permission["DMS_EDIT"] = "dms:edit";
    Permission["DMS_DELETE"] = "dms:delete";
    Permission["DMS_DOWNLOAD"] = "dms:download";
    Permission["DMS_UPLOAD"] = "dms:upload";
    Permission["DMS_VERSION"] = "dms:version";
    Permission["DMS_APPROVE_DISPOSAL"] = "dms:approve_disposal";
    Permission["DMS_EXPORT"] = "dms:export";
    // Document specific
    Permission["DOCUMENT_VIEW"] = "document:view";
    Permission["DOCUMENT_CREATE"] = "document:create";
    Permission["DOCUMENT_EDIT"] = "document:edit";
    Permission["DOCUMENT_DELETE"] = "document:delete";
    Permission["DOCUMENT_APPROVE"] = "document:approve";
    Permission["DOCUMENT_ARCHIVE"] = "document:archive";
    Permission["DOCUMENT_OCR"] = "document:ocr";
    // Logistics Permissions
    Permission["LOGISTICS_VIEW"] = "logistics:view";
    Permission["LOGISTICS_CREATE"] = "logistics:create";
    Permission["LOGISTICS_EDIT"] = "logistics:edit";
    Permission["LOGISTICS_UPDATE"] = "logistics:update";
    Permission["LOGISTICS_DELETE"] = "logistics:delete";
    Permission["LOGISTICS_EXPORT"] = "logistics:export";
    Permission["LOGISTICS_ADMIN"] = "logistics:admin";
    Permission["INVENTORY_MANAGE"] = "inventory:manage";
    Permission["PURCHASE_MANAGE"] = "purchase:manage";
    // Warehouse specific
    Permission["WAREHOUSE_VIEW"] = "warehouse:view";
    Permission["WAREHOUSE_CREATE"] = "warehouse:create";
    Permission["WAREHOUSE_EDIT"] = "warehouse:edit";
    Permission["WAREHOUSE_DELETE"] = "warehouse:delete";
    Permission["WAREHOUSE_MANAGE_LOCATIONS"] = "warehouse:manage_locations";
    // Product/Item specific
    Permission["PRODUCT_VIEW"] = "product:view";
    Permission["PRODUCT_CREATE"] = "product:create";
    Permission["PRODUCT_EDIT"] = "product:edit";
    Permission["PRODUCT_DELETE"] = "product:delete";
    // Stock specific
    Permission["STOCK_VIEW"] = "stock:view";
    Permission["STOCK_EDIT"] = "stock:edit";
    Permission["STOCK_MOVE"] = "stock:move";
    Permission["STOCK_ADJUST"] = "stock:adjust";
    Permission["STOCK_INVENTORY"] = "stock:inventory";
    Permission["STOCK_TRANSFER"] = "stock:transfer";
    // Purchase Order specific
    Permission["PURCHASE_ORDER_VIEW"] = "purchase_order:view";
    Permission["PURCHASE_ORDER_CREATE"] = "purchase_order:create";
    Permission["PURCHASE_ORDER_EDIT"] = "purchase_order:edit";
    Permission["PURCHASE_ORDER_DELETE"] = "purchase_order:delete";
    Permission["PURCHASE_ORDER_APPROVE"] = "purchase_order:approve";
    Permission["PURCHASE_ORDER_RECEIVE"] = "purchase_order:receive";
    // Supplier specific
    Permission["SUPPLIER_VIEW"] = "supplier:view";
    Permission["SUPPLIER_CREATE"] = "supplier:create";
    Permission["SUPPLIER_EDIT"] = "supplier:edit";
    Permission["SUPPLIER_DELETE"] = "supplier:delete";
    // Price List specific
    Permission["PRICE_LIST_VIEW"] = "price_list:view";
    Permission["PRICE_LIST_CREATE"] = "price_list:create";
    Permission["PRICE_LIST_EDIT"] = "price_list:edit";
    Permission["PRICE_LIST_DELETE"] = "price_list:delete";
    Permission["PRICE_LIST_IMPORT"] = "price_list:import";
    Permission["PRICE_LIST_EXPORT"] = "price_list:export";
    // Shipment specific
    Permission["SHIPMENT_VIEW"] = "shipment:view";
    Permission["SHIPMENT_CREATE"] = "shipment:create";
    Permission["SHIPMENT_EDIT"] = "shipment:edit";
    Permission["SHIPMENT_DELETE"] = "shipment:delete";
    Permission["SHIPMENT_DISPATCH"] = "shipment:dispatch";
    // System Permissions
    Permission["SYSTEM_SETTINGS"] = "system:settings";
    Permission["SYSTEM_BACKUP"] = "system:backup";
    Permission["SYSTEM_RESTORE"] = "system:restore";
    Permission["SYSTEM_AUDIT_VIEW"] = "system:audit_view";
    Permission["SYSTEM_AUDIT_EXPORT"] = "system:audit_export";
    Permission["SYSTEM_DIAGNOSTICS"] = "system:diagnostics";
    // HR Permissions
    Permission["HR_VIEW"] = "hr:view";
    Permission["HR_CREATE"] = "hr:create";
    Permission["HR_EDIT"] = "hr:edit";
    Permission["HR_DELETE"] = "hr:delete";
    Permission["HR_REPORT"] = "hr:report";
    Permission["HR_EXPORT"] = "hr:export";
    Permission["HR_CONTRACT_MANAGE"] = "hr:contract_manage";
    Permission["HR_ADMIN"] = "hr:admin";
    Permission["HR_APPROVE"] = "hr:approve";
    // User Management
    Permission["USER_VIEW"] = "user:view";
    Permission["USER_CREATE"] = "user:create";
    Permission["USER_EDIT"] = "user:edit";
    Permission["USER_DELETE"] = "user:delete";
    Permission["USER_MANAGE_ROLES"] = "user:manage_roles";
    // Role Management
    Permission["ROLE_VIEW"] = "role:view";
    Permission["ROLE_CREATE"] = "role:create";
    Permission["ROLE_EDIT"] = "role:edit";
    Permission["ROLE_DELETE"] = "role:delete";
    // Controlling / Decision support
    Permission["CONTROLLING_VIEW"] = "controlling:view";
    Permission["CONTROLLING_EXPORT"] = "controlling:export";
    Permission["CONTROLLING_ADMIN"] = "controlling:admin";
    Permission["KPI_MANAGE"] = "kpi:manage";
    Permission["REPORT_MANAGE"] = "report:manage";
    // Report Permissions
    Permission["REPORT_VIEW"] = "report:view";
    Permission["REPORT_CREATE"] = "report:create";
    Permission["REPORT_EDIT"] = "report:edit";
    Permission["REPORT_DELETE"] = "report:delete";
    Permission["REPORT_EXPORT"] = "report:export";
    // Team Communication Permissions
    Permission["TEAM_VIEW"] = "team:view";
    Permission["TEAM_CREATE"] = "team:create";
    Permission["TEAM_EDIT"] = "team:edit";
    Permission["TEAM_DELETE"] = "team:delete";
    // Task specific
    Permission["TASK_VIEW"] = "task:view";
    Permission["TASK_CREATE"] = "task:create";
    Permission["TASK_EDIT"] = "task:edit";
    Permission["TASK_DELETE"] = "task:delete";
    Permission["TASK_ASSIGN"] = "task:assign";
    Permission["TASK_MANAGE_ALL"] = "task:manage_all";
    // Board specific
    Permission["BOARD_VIEW"] = "board:view";
    Permission["BOARD_CREATE"] = "board:create";
    Permission["BOARD_EDIT"] = "board:edit";
    Permission["BOARD_DELETE"] = "board:delete";
    Permission["BOARD_MANAGE_MEMBERS"] = "board:manage_members";
    // Return specific
    Permission["RETURN_VIEW"] = "return:view";
    Permission["RETURN_CREATE"] = "return:create";
    Permission["RETURN_EDIT"] = "return:edit";
    Permission["RETURN_APPROVE"] = "return:approve";
    Permission["RETURN_COMPLETE"] = "return:complete";
    // Inventory Report specific
    Permission["INVENTORY_REPORT_PRINT"] = "inventory:report_print";
    // Task Notification
    Permission["TASK_NOTIFY"] = "task:notify";
})(Permission || (exports.Permission = Permission = {}));
exports.PermissionDescriptions = (_a = {},
    _a[Permission.CRM_VIEW] = { nev: 'CRM megtekintése', modulo: 'CRM', leiras: 'CRM modulban való böngészés' },
    _a[Permission.CRM_CREATE] = { nev: 'CRM létrehozás', modulo: 'CRM', leiras: 'Új CRM rekordok létrehozása' },
    _a[Permission.CRM_EDIT] = { nev: 'CRM szerkesztés', modulo: 'CRM', leiras: 'CRM rekordok módosítása' },
    _a[Permission.CRM_DELETE] = { nev: 'CRM törlés', modulo: 'CRM', leiras: 'CRM rekordok törlése' },
    _a[Permission.CRM_EXPORT] = { nev: 'CRM exportálás', modulo: 'CRM', leiras: 'CRM adatok exportálása' },
    _a[Permission.CUSTOMER_VIEW] = { nev: 'Ügyfelek megtekintése', modulo: 'CRM', leiras: 'Ügyféladatok megtekintése' },
    _a[Permission.CUSTOMER_CREATE] = { nev: 'Ügyfél létrehozás', modulo: 'CRM', leiras: 'Új ügyfelek felvétele' },
    _a[Permission.CUSTOMER_EDIT] = { nev: 'Ügyfél szerkesztés', modulo: 'CRM', leiras: 'Ügyféladatok módosítása' },
    _a[Permission.CUSTOMER_DELETE] = { nev: 'Ügyfél törlés', modulo: 'CRM', leiras: 'Ügyfelek törlése' },
    _a[Permission.OPPORTUNITY_VIEW] = { nev: 'Lehetőségek megtekintése', modulo: 'CRM', leiras: 'Üzleti lehetőségek megtekintése' },
    _a[Permission.OPPORTUNITY_CREATE] = { nev: 'Lehetőség létrehozás', modulo: 'CRM', leiras: 'Új lehetőségek rögzítése' },
    _a[Permission.OPPORTUNITY_EDIT] = { nev: 'Lehetőség szerkesztés', modulo: 'CRM', leiras: 'Lehetőségek módosítása' },
    _a[Permission.OPPORTUNITY_DELETE] = { nev: 'Lehetőség törlés', modulo: 'CRM', leiras: 'Lehetőségek törlése' },
    _a[Permission.QUOTE_VIEW] = { nev: 'Árajánlatok megtekintése', modulo: 'CRM', leiras: 'Árajánlatok böngészése' },
    _a[Permission.QUOTE_CREATE] = { nev: 'Árajánlat létrehozás', modulo: 'CRM', leiras: 'Új árajánlatok készítése' },
    _a[Permission.QUOTE_EDIT] = { nev: 'Árajánlat szerkesztés', modulo: 'CRM', leiras: 'Árajánlatok módosítása' },
    _a[Permission.QUOTE_DELETE] = { nev: 'Árajánlat törlés', modulo: 'CRM', leiras: 'Árajánlatok törlése' },
    _a[Permission.QUOTE_APPROVE] = { nev: 'Árajánlat jóváhagyás', modulo: 'CRM', leiras: 'Magas értékű árajánlatok jóváhagyása' },
    _a[Permission.QUOTE_SEND] = { nev: 'Árajánlat küldés', modulo: 'CRM', leiras: 'Árajánlatok kiküldése ügyfeleknek' },
    _a[Permission.CAMPAIGN_VIEW] = { nev: 'Kampányok megtekintése', modulo: 'CRM', leiras: 'Marketing kampányok böngészése' },
    _a[Permission.CAMPAIGN_CREATE] = { nev: 'Kampány létrehozás', modulo: 'CRM', leiras: 'Új kampányok indítása' },
    _a[Permission.CAMPAIGN_EDIT] = { nev: 'Kampány szerkesztés', modulo: 'CRM', leiras: 'Kampányok módosítása' },
    _a[Permission.CAMPAIGN_DELETE] = { nev: 'Kampány törlés', modulo: 'CRM', leiras: 'Kampányok törlése' },
    _a[Permission.TICKET_VIEW] = { nev: 'Reklamációk megtekintése', modulo: 'CRM', leiras: 'Ticketek és reklamációk böngészése' },
    _a[Permission.TICKET_CREATE] = { nev: 'Reklamáció létrehozás', modulo: 'CRM', leiras: 'Új ticketek rögzítése' },
    _a[Permission.TICKET_EDIT] = { nev: 'Reklamáció szerkesztés', modulo: 'CRM', leiras: 'Ticketek módosítása' },
    _a[Permission.TICKET_DELETE] = { nev: 'Reklamáció törlés', modulo: 'CRM', leiras: 'Ticketek törlése' },
    _a[Permission.TICKET_ASSIGN] = { nev: 'Reklamáció hozzárendelés', modulo: 'CRM', leiras: 'Ticketek kiosztása felhasználóknak' },
    _a[Permission.ORDER_VIEW] = { nev: 'Rendelések megtekintése', modulo: 'CRM', leiras: 'Rendelések böngészése' },
    _a[Permission.ORDER_CREATE] = { nev: 'Rendelés létrehozás', modulo: 'CRM', leiras: 'Új rendelések rögzítése' },
    _a[Permission.ORDER_EDIT] = { nev: 'Rendelés szerkesztés', modulo: 'CRM', leiras: 'Rendelések módosítása' },
    _a[Permission.ORDER_DELETE] = { nev: 'Rendelés törlés', modulo: 'CRM', leiras: 'Rendelések törlése' },
    _a[Permission.ORDER_FULFILL] = { nev: 'Rendelés teljesítés', modulo: 'CRM', leiras: 'Rendelések teljesítése' },
    _a[Permission.ORDER_CANCEL] = { nev: 'Rendelés visszavonás', modulo: 'CRM', leiras: 'Rendelések sztornózása' },
    _a[Permission.DMS_VIEW] = { nev: 'Dokumentumok megtekintése', modulo: 'DMS', leiras: 'Dokumentumok böngészése' },
    _a[Permission.DMS_CREATE] = { nev: 'Dokumentum iktatás', modulo: 'DMS', leiras: 'Új dokumentumok iktatása' },
    _a[Permission.DMS_EDIT] = { nev: 'Dokumentum szerkesztés', modulo: 'DMS', leiras: 'Dokumentum adatok módosítása' },
    _a[Permission.DMS_DELETE] = { nev: 'Dokumentum törlés', modulo: 'DMS', leiras: 'Dokumentumok törlése' },
    _a[Permission.DMS_DOWNLOAD] = { nev: 'Dokumentum letöltés', modulo: 'DMS', leiras: 'Dokumentumok letöltése' },
    _a[Permission.DMS_UPLOAD] = { nev: 'Fájl feltöltés', modulo: 'DMS', leiras: 'Fájlok feltöltése' },
    _a[Permission.DMS_VERSION] = { nev: 'Verziókezelés', modulo: 'DMS', leiras: 'Dokumentum verziók kezelése' },
    _a[Permission.DMS_APPROVE_DISPOSAL] = { nev: 'Selejtezés jóváhagyás', modulo: 'DMS', leiras: 'Dokumentum selejtezés engedélyezése' },
    _a[Permission.DMS_EXPORT] = { nev: 'DMS export', modulo: 'DMS', leiras: 'Dokumentumlista és riport export' },
    _a[Permission.DOCUMENT_VIEW] = { nev: 'Dokumentum megtekintés', modulo: 'DMS', leiras: 'Egyes dokumentumok megtekintése' },
    _a[Permission.DOCUMENT_CREATE] = { nev: 'Dokumentum létrehozás', modulo: 'DMS', leiras: 'Új dokumentum rekord rögzítése' },
    _a[Permission.DOCUMENT_EDIT] = { nev: 'Dokumentum adatok szerkesztés', modulo: 'DMS', leiras: 'Metaadatok módosítása' },
    _a[Permission.DOCUMENT_DELETE] = { nev: 'Dokumentum eltávolítás', modulo: 'DMS', leiras: 'Dokumentum végeleges törlése' },
    _a[Permission.DOCUMENT_APPROVE] = { nev: 'Dokumentum jóváhagyás', modulo: 'DMS', leiras: 'Dokumentumok workflow jóváhagyása' },
    _a[Permission.DOCUMENT_ARCHIVE] = { nev: 'Dokumentum archiválás', modulo: 'DMS', leiras: 'Dokumentumok archiválása' },
    _a[Permission.DOCUMENT_OCR] = { nev: 'OCR feldolgozás', modulo: 'DMS', leiras: 'OCR szövegfelismerés futtatása' },
    _a[Permission.LOGISTICS_VIEW] = { nev: 'Logisztika megtekintése', modulo: 'Logisztika', leiras: 'Logisztikai adatok böngészése' },
    _a[Permission.LOGISTICS_CREATE] = { nev: 'Logisztika létrehozás', modulo: 'Logisztika', leiras: 'Új törzsadatok rögzítése' },
    _a[Permission.LOGISTICS_EDIT] = { nev: 'Logisztika szerkesztés', modulo: 'Logisztika', leiras: 'Törzsadatok módosítása' },
    _a[Permission.LOGISTICS_UPDATE] = { nev: 'Logisztika módosítás', modulo: 'Logisztika', leiras: 'Logisztikai rekordok frissítése' },
    _a[Permission.LOGISTICS_DELETE] = { nev: 'Logisztika törlés', modulo: 'Logisztika', leiras: 'Törzsadatok törlése' },
    _a[Permission.LOGISTICS_EXPORT] = { nev: 'Logisztika export', modulo: 'Logisztika', leiras: 'Riportok és listák CSV/XLSX exportja' },
    _a[Permission.LOGISTICS_ADMIN] = { nev: 'Logisztika admin', modulo: 'Logisztika', leiras: 'Teljes logisztikai modul kezelése' },
    _a[Permission.INVENTORY_MANAGE] = { nev: 'Készletkezelés', modulo: 'Logisztika', leiras: 'Készletmozgások, leltár, sarzs kezelés' },
    _a[Permission.PURCHASE_MANAGE] = { nev: 'Beszerzés kezelés', modulo: 'Logisztika', leiras: 'Beszerzési rendelések és beérkezés' },
    _a[Permission.WAREHOUSE_VIEW] = { nev: 'Raktárak megtekintése', modulo: 'Logisztika', leiras: 'Raktárak és helyek böngészése' },
    _a[Permission.WAREHOUSE_CREATE] = { nev: 'Raktár létrehozás', modulo: 'Logisztika', leiras: 'Új raktár rögzítése' },
    _a[Permission.WAREHOUSE_EDIT] = { nev: 'Raktár szerkesztés', modulo: 'Logisztika', leiras: 'Raktár adatok módosítása' },
    _a[Permission.WAREHOUSE_DELETE] = { nev: 'Raktár törlés', modulo: 'Logisztika', leiras: 'Raktár eltávolítása' },
    _a[Permission.WAREHOUSE_MANAGE_LOCATIONS] = { nev: 'Raktári helyek kezelése', modulo: 'Logisztika', leiras: 'Helyek, zónák, polcok szervezése' },
    _a[Permission.PRODUCT_VIEW] = { nev: 'Termékek megtekintése', modulo: 'Logisztika', leiras: 'Termékek és cikkek böngészése' },
    _a[Permission.PRODUCT_CREATE] = { nev: 'Termék létrehozás', modulo: 'Logisztika', leiras: 'Új termékek felvétele' },
    _a[Permission.PRODUCT_EDIT] = { nev: 'Termék szerkesztés', modulo: 'Logisztika', leiras: 'Termékek módosítása' },
    _a[Permission.PRODUCT_DELETE] = { nev: 'Termék törlés', modulo: 'Logisztika', leiras: 'Termékek törlése' },
    _a[Permission.STOCK_VIEW] = { nev: 'Készlet megtekintése', modulo: 'Logisztika', leiras: 'Készletállományok megtekintése' },
    _a[Permission.STOCK_EDIT] = { nev: 'Készletszint szerkesztés', modulo: 'Logisztika', leiras: 'Készletszintek létrehozása és módosítása' },
    _a[Permission.STOCK_MOVE] = { nev: 'Készletmozgás', modulo: 'Logisztika', leiras: 'Készletmozgások rögzítése' },
    _a[Permission.STOCK_ADJUST] = { nev: 'Készlet korrekció', modulo: 'Logisztika', leiras: 'Készlet korrekciók végrehajtása' },
    _a[Permission.STOCK_INVENTORY] = { nev: 'Leltározás', modulo: 'Logisztika', leiras: 'Leltár rögzítés és lezárás' },
    _a[Permission.STOCK_TRANSFER] = { nev: 'Készlet áthelyezés', modulo: 'Logisztika', leiras: 'Raktárak közötti készletáthelyezés' },
    _a[Permission.PURCHASE_ORDER_VIEW] = { nev: 'Beszerzési rendelések megtekintése', modulo: 'Logisztika', leiras: 'Beszerzések böngészése' },
    _a[Permission.PURCHASE_ORDER_CREATE] = { nev: 'Beszerzési rendelés létrehozás', modulo: 'Logisztika', leiras: 'Új beszerzések rögzítése' },
    _a[Permission.PURCHASE_ORDER_EDIT] = { nev: 'Beszerzési rendelés szerkesztés', modulo: 'Logisztika', leiras: 'Beszerzések módosítása' },
    _a[Permission.PURCHASE_ORDER_DELETE] = { nev: 'Beszerzési rendelés törlés', modulo: 'Logisztika', leiras: 'Beszerzések törlése' },
    _a[Permission.PURCHASE_ORDER_APPROVE] = { nev: 'Beszerzés jóváhagyás', modulo: 'Logisztika', leiras: 'Beszerzések engedélyezése' },
    _a[Permission.PURCHASE_ORDER_RECEIVE] = { nev: 'Áruátvétel rögzítés', modulo: 'Logisztika', leiras: 'Beszerzett áruk bevételezése' },
    _a[Permission.SHIPMENT_VIEW] = { nev: 'Szállítások megtekintése', modulo: 'Logisztika', leiras: 'Szállítmányok böngészése' },
    _a[Permission.SHIPMENT_CREATE] = { nev: 'Szállítás létrehozás', modulo: 'Logisztika', leiras: 'Új szállítmány rögzítése' },
    _a[Permission.SHIPMENT_EDIT] = { nev: 'Szállítás szerkesztés', modulo: 'Logisztika', leiras: 'Szállítmány adatok módosítása' },
    _a[Permission.SHIPMENT_DELETE] = { nev: 'Szállítás törlés', modulo: 'Logisztika', leiras: 'Szállítmány törlése' },
    _a[Permission.SHIPMENT_DISPATCH] = { nev: 'Szállítás indítás', modulo: 'Logisztika', leiras: 'Szállítmány kiadása/indítása' },
    _a[Permission.SYSTEM_SETTINGS] = { nev: 'Rendszer beállítások', modulo: 'Rendszer', leiras: 'Rendszerbeállítások módosítása' },
    _a[Permission.SYSTEM_BACKUP] = { nev: 'Biztonsági mentés', modulo: 'Rendszer', leiras: 'Mentések készítése' },
    _a[Permission.SYSTEM_RESTORE] = { nev: 'Visszaállítás', modulo: 'Rendszer', leiras: 'Rendszer visszaállítása' },
    _a[Permission.SYSTEM_AUDIT_VIEW] = { nev: 'Audit napló megtekintés', modulo: 'Rendszer', leiras: 'Audit naplók böngészése' },
    _a[Permission.SYSTEM_AUDIT_EXPORT] = { nev: 'Audit exportálás', modulo: 'Rendszer', leiras: 'Audit naplók exportálása' },
    _a[Permission.SYSTEM_DIAGNOSTICS] = { nev: 'Diagnosztika', modulo: 'Rendszer', leiras: 'Rendszer diagnosztika futtatása' },
    _a[Permission.HR_VIEW] = { nev: 'HR adatok megtekintése', modulo: 'HR', leiras: 'Dolgozói adatok böngészése' },
    _a[Permission.HR_CREATE] = { nev: 'HR adat létrehozás', modulo: 'HR', leiras: 'Új dolgozók, munkakörök felvétele' },
    _a[Permission.HR_EDIT] = { nev: 'HR adat szerkesztés', modulo: 'HR', leiras: 'Dolgozói adatok módosítása' },
    _a[Permission.HR_DELETE] = { nev: 'HR adat törlés', modulo: 'HR', leiras: 'Dolgozói adatok törlése' },
    _a[Permission.HR_REPORT] = { nev: 'HR riportok', modulo: 'HR', leiras: 'NAV, KSH riportok generálása' },
    _a[Permission.HR_EXPORT] = { nev: 'HR export', modulo: 'HR', leiras: 'HR analitikák CSV/XLSX exportja' },
    _a[Permission.HR_CONTRACT_MANAGE] = { nev: 'Munkaszerződés kezelés', modulo: 'HR', leiras: 'Szerződések és módosítások rögzítése' },
    _a[Permission.HR_ADMIN] = { nev: 'HR adminisztráció', modulo: 'HR', leiras: 'HR modul teljes kezelése és beállítások' },
    _a[Permission.HR_APPROVE] = { nev: 'HR jóváhagyás', modulo: 'HR', leiras: 'Távollét és HR jóváhagyó folyamatok' },
    _a[Permission.USER_VIEW] = { nev: 'Felhasználók megtekintése', modulo: 'Felhasználók', leiras: 'Felhasználók listázása' },
    _a[Permission.USER_CREATE] = { nev: 'Felhasználó létrehozás', modulo: 'Felhasználók', leiras: 'Új felhasználók felvétele' },
    _a[Permission.USER_EDIT] = { nev: 'Felhasználó szerkesztés', modulo: 'Felhasználók', leiras: 'Felhasználók módosítása' },
    _a[Permission.USER_DELETE] = { nev: 'Felhasználó törlés', modulo: 'Felhasználók', leiras: 'Felhasználók törlése' },
    _a[Permission.USER_MANAGE_ROLES] = { nev: 'Szerepkörök kezelése', modulo: 'Felhasználók', leiras: 'Felhasználói szerepkörök hozzárendelése' },
    _a[Permission.ROLE_VIEW] = { nev: 'Szerepkörök megtekintése', modulo: 'Szerepkörök', leiras: 'Szerepkörök listázása' },
    _a[Permission.ROLE_CREATE] = { nev: 'Szerepkör létrehozás', modulo: 'Szerepkörök', leiras: 'Új szerepkörök definiálása' },
    _a[Permission.ROLE_EDIT] = { nev: 'Szerepkör szerkesztés', modulo: 'Szerepkörök', leiras: 'Szerepkörök módosítása' },
    _a[Permission.ROLE_DELETE] = { nev: 'Szerepkör törlés', modulo: 'Szerepkörök', leiras: 'Szerepkörök törlése' },
    _a[Permission.CONTROLLING_VIEW] = { nev: 'Kontrolling megtekintése', modulo: 'Kontrolling', leiras: 'Dashboard és riportok böngészése' },
    _a[Permission.CONTROLLING_EXPORT] = { nev: 'Kontrolling export', modulo: 'Kontrolling', leiras: 'Riportok és KPI export' },
    _a[Permission.CONTROLLING_ADMIN] = { nev: 'Kontrolling admin', modulo: 'Kontrolling', leiras: 'Kontrolling modul teljes kezelése' },
    _a[Permission.KPI_MANAGE] = { nev: 'KPI kezelés', modulo: 'Kontrolling', leiras: 'KPI definíciók létrehozása és szerkesztése' },
    _a[Permission.REPORT_MANAGE] = { nev: 'Riport sablon kezelés', modulo: 'Kontrolling', leiras: 'Riport sablonok és futtatás' },
    _a[Permission.REPORT_VIEW] = { nev: 'Jelentések megtekintése', modulo: 'Jelentések', leiras: 'Riportok böngészése' },
    _a[Permission.REPORT_CREATE] = { nev: 'Jelentés készítés', modulo: 'Jelentések', leiras: 'Új riportok generálása' },
    _a[Permission.REPORT_EDIT] = { nev: 'Jelentés szerkesztés', modulo: 'Jelentések', leiras: 'Riportok módosítása' },
    _a[Permission.REPORT_DELETE] = { nev: 'Jelentés törlés', modulo: 'Jelentések', leiras: 'Riportok törlése' },
    _a[Permission.REPORT_EXPORT] = { nev: 'Jelentés exportálás', modulo: 'Jelentések', leiras: 'Riportok exportálása' },
    _a[Permission.TEAM_VIEW] = { nev: 'Csapat kommunikáció megtekintése', modulo: 'Csapat kommunikáció', leiras: 'Csapat kommunikáció modulban való böngészés' },
    _a[Permission.TEAM_CREATE] = { nev: 'Csapat kommunikáció létrehozás', modulo: 'Csapat kommunikáció', leiras: 'Új feladatok és board-ok létrehozása' },
    _a[Permission.TEAM_EDIT] = { nev: 'Csapat kommunikáció szerkesztés', modulo: 'Csapat kommunikáció', leiras: 'Feladatok és board-ok módosítása' },
    _a[Permission.TEAM_DELETE] = { nev: 'Csapat kommunikáció törlés', modulo: 'Csapat kommunikáció', leiras: 'Feladatok és board-ok törlése' },
    _a[Permission.TASK_VIEW] = { nev: 'Feladatok megtekintése', modulo: 'Csapat kommunikáció', leiras: 'Feladatok böngészése' },
    _a[Permission.TASK_CREATE] = { nev: 'Feladat létrehozás', modulo: 'Csapat kommunikáció', leiras: 'Új feladatok rögzítése' },
    _a[Permission.TASK_EDIT] = { nev: 'Feladat szerkesztés', modulo: 'Csapat kommunikáció', leiras: 'Feladatok módosítása' },
    _a[Permission.TASK_DELETE] = { nev: 'Feladat törlés', modulo: 'Csapat kommunikáció', leiras: 'Feladatok törlése' },
    _a[Permission.TASK_ASSIGN] = { nev: 'Feladat hozzárendelés', modulo: 'Csapat kommunikáció', leiras: 'Feladatok kiosztása felhasználóknak' },
    _a[Permission.TASK_MANAGE_ALL] = { nev: 'Minden feladat kezelése', modulo: 'Csapat kommunikáció', leiras: 'Admin jogosultság: minden feladat kezelése' },
    _a[Permission.BOARD_VIEW] = { nev: 'Board-ok megtekintése', modulo: 'Csapat kommunikáció', leiras: 'Kanban board-ok böngészése' },
    _a[Permission.BOARD_CREATE] = { nev: 'Board létrehozás', modulo: 'Csapat kommunikáció', leiras: 'Új Kanban board-ok létrehozása' },
    _a[Permission.BOARD_EDIT] = { nev: 'Board szerkesztés', modulo: 'Csapat kommunikáció', leiras: 'Board-ok módosítása' },
    _a[Permission.BOARD_DELETE] = { nev: 'Board törlés', modulo: 'Csapat kommunikáció', leiras: 'Board-ok törlése' },
    _a[Permission.BOARD_MANAGE_MEMBERS] = { nev: 'Board tagok kezelése', modulo: 'Csapat kommunikáció', leiras: 'Board tagok hozzáadása és eltávolítása' },
    _a[Permission.RETURN_VIEW] = { nev: 'Visszárú megtekintése', modulo: 'Logisztika', leiras: 'Visszárúk böngészése' },
    _a[Permission.RETURN_CREATE] = { nev: 'Visszárú létrehozás', modulo: 'Logisztika', leiras: 'Új visszárúk rögzítése' },
    _a[Permission.RETURN_EDIT] = { nev: 'Visszárú szerkesztés', modulo: 'Logisztika', leiras: 'Visszárúk módosítása' },
    _a[Permission.RETURN_APPROVE] = { nev: 'Visszárú jóváhagyás', modulo: 'Logisztika', leiras: 'Visszárúk jóváhagyása' },
    _a[Permission.RETURN_COMPLETE] = { nev: 'Visszárú feldolgozás', modulo: 'Logisztika', leiras: 'Visszárúk feldolgozása és készlet visszaírás' },
    _a[Permission.SUPPLIER_VIEW] = { nev: 'Szállítók megtekintése', modulo: 'Logisztika', leiras: 'Szállítók böngészése' },
    _a[Permission.SUPPLIER_CREATE] = { nev: 'Szállító létrehozás', modulo: 'Logisztika', leiras: 'Új szállítók rögzítése' },
    _a[Permission.SUPPLIER_EDIT] = { nev: 'Szállító szerkesztés', modulo: 'Logisztika', leiras: 'Szállítók módosítása' },
    _a[Permission.SUPPLIER_DELETE] = { nev: 'Szállító törlés', modulo: 'Logisztika', leiras: 'Szállítók törlése' },
    _a[Permission.PRICE_LIST_VIEW] = { nev: 'Árlisták megtekintése', modulo: 'Logisztika', leiras: 'Árlisták böngészése' },
    _a[Permission.PRICE_LIST_CREATE] = { nev: 'Árlista létrehozás', modulo: 'Logisztika', leiras: 'Új árlisták rögzítése' },
    _a[Permission.PRICE_LIST_EDIT] = { nev: 'Árlista szerkesztés', modulo: 'Logisztika', leiras: 'Árlisták módosítása' },
    _a[Permission.PRICE_LIST_DELETE] = { nev: 'Árlista törlés', modulo: 'Logisztika', leiras: 'Árlisták törlése' },
    _a[Permission.PRICE_LIST_IMPORT] = { nev: 'Árlista importálás', modulo: 'Logisztika', leiras: 'Árlisták Excel-ből importálása' },
    _a[Permission.PRICE_LIST_EXPORT] = { nev: 'Árlista exportálás', modulo: 'Logisztika', leiras: 'Árlisták Excel-be exportálása' },
    _a[Permission.INVENTORY_REPORT_PRINT] = { nev: 'Leltárív nyomtatás', modulo: 'Logisztika', leiras: 'Leltárív generálása és nyomtatása' },
    _a[Permission.TASK_NOTIFY] = { nev: 'Feladat értesítés', modulo: 'Csapat kommunikáció', leiras: 'Email értesítés küldése feladatokról' },
    _a);
