# GINOP PLUSZ-2.1.3-24 – Logisztika / Beszerzés on-premise megfelelőség

**Termék:** MB-IT ERP – Windows desktop (Electron + NestJS + SQLite)  
**Ellenőrzés:** Üres vagy meglévő adatbázissal, offline desktop app  
**Demo:** `admin@mbit.hu` / `admin123` (ha seed futott), egyébként első admin felhasználó

| # | GINOP követelmény | Implementáció | Modellek / API | UI | Ellenőrzés | Státusz |
|---|-------------------|---------------|----------------|-----|------------|---------|
| 1 | Cikktörzs CRUD | `Item`, `ItemGroup`, archiválás (`aktiv=false`) | `GET/POST/PUT/DELETE /logistics/items`, `/item-groups` | Logisztika → Cikkek | Új cikk, szerkesztés | **Teljesítve** |
| 2 | Kategória hierarchia | `ProductCategory` parentId | `/logistics/categories`, export | Kategóriák | Fa nézet, export | **Teljesítve** |
| 3 | Többraktáros készlet | `Warehouse`, `StockLevel`, átmozgatás | `/logistics/warehouses`, `POST /stock-movements` (ATMOZGATAS) | Raktárak, Készletmozgások | Raktár + átmozgatás modal | **Teljesítve** |
| 4 | Készletmozgások | `StockMove`, `StockMovementService` | `POST /logistics/stock-movements`, negatív tiltás beállítás | Készletmozgások | Bevétel/kiadás/korrekció | **Teljesítve** |
| 5 | Sarzs kezelés | `StockLot`, sarzs mozgásnál | `/stock-movements/lots`, lejárati szűrés | Sarzsok | Sarzs keresés, export | **Teljesítve** |
| 6 | Min/max figyelés | `Item.minKeszlet/max`, `StockLevel.minimum/maximum` | `GET /stock-movements/alerts` | Készlet riasztások | Lista + export | **Teljesítve** |
| 7 | Árlista menedzsment | `PriceList`, verzió, érvényesség | `/logistics/price-lists`, import/export | Árlisták | CSV/XLSX import (meglévő) | **Teljesítve** |
| 8 | Beszerzési folyamat | `PurchaseOrder` státuszok | `POST approve/order/receive/close` | Beszerzések | Workflow gombok | **Teljesítve** |
| 9 | Visszáru | `Return` | `/logistics/returns` | Visszáru | Jóváhagyás + készlet (meglévő) | **Teljesítve** |
| 10 | Leltár | `InventorySheet` | `/logistics/inventory-sheets` | Leltár | Eltérés + korrekció (meglévő) | **Teljesítve** |
| 11 | Riportok export | `LogisticsExportService` | `GET /logistics/reports/:type/export/:format` | Riportok | CSV/XLSX letöltés | **Teljesítve** |
| 12 | Jogosultság | `LOGISTICS_*`, `INVENTORY_MANAGE`, `PURCHASE_MANAGE` | `RbacGuard` minden új route-on | `usePermissions` | Szerepkörök seed-ben | **Teljesítve** |
| 13 | Audit | `AuditService` | Item, StockMove, PO, export | Audit napló | Szűrt lista | **Teljesítve** |
| 14 | Desktop UI menük | `modules.ts`, `App.tsx` | – | 10+ logisztika menüpont | Navigáció | **Teljesítve** |
| 15 | Windows artifact | `build-desktop.yml` | – | – | CI build | **Változatlan** |

## Jogosultság szerepkörök

| Szerepkör | Jellemző jogosultságok |
|-----------|------------------------|
| Admin | Minden Logisztika modul jog |
| Logistics Admin | Teljes logisztika + export + beszerzés |
| Warehouse User | Készletmozgás, leltár, átmozgatás |
| Viewer | Olvasás: cikk, raktár, készlet, beszerzés |

## Beszerzési igény (GINOP)

**Döntés (A):** külön `PurchaseRequest` entitás nincs. A **beszerzési igény = `PurchaseOrder` `draft` állapot** (`POST /logistics/purchase-orders`, `allapot: draft`). Jóváhagyás után: `approved` → `ordered` → `partial`/`received` → `closed`.

## Korlátozások
- Bizonylati stub beszerzéshez: `DeliveryNote` / számla-meta kapcsolódó CRM modulok (nem NAV online).
- `PurchaseOrders` UI nem követeli a külön „beszerzési igény” dokumentumot – PO draft = igény.
- Séma bővítés után: `npx prisma db push` (fejlesztés) vagy migráció production-ben.
- Electron desktop módban RBAC bypass – szándékos egyszerűsítés.

## Beállítások

| Kulcs | Leírás |
|-------|--------|
| `logistics.allow_negative_stock` | `false` = tiltás negatív készletre |
| `logistics.low_stock_threshold` | Globális küszöb, ha nincs min/max |
