# GINOP PLUSZ-2.1.3-24 – CRM / Értékesítés on-premise megfelelőség

**Termék:** MB-IT ERP – Windows desktop alkalmazás (Electron + beágyazott NestJS + SQLite)  
**Ellenőrzés:** `npm run db:seed` után desktop app, offline működés  
**Demo felhasználók:** `admin@mbit.hu` / `admin123`, `sales@mbit.hu` / `sales123`

| # | GINOP követelmény | Implementált funkció | Fájlok / endpointok | Ellenőrzés | Demo adat | Státusz |
|---|-------------------|----------------------|---------------------|------------|-----------|---------|
| 1 | Kampánymenedzsment | CRUD, lezárás, célközönség szűrés, CSV/XLSX export, visszajelzés, eredmény riport | `campaign.*`, `POST :id/audience/select`, `GET :id/audience/export/:format`, `GET report/results` | CRM → Kampányok | 3 kampány, visszajelzések | **Teljesítve** |
| 2 | Értékesítési folyamat | Ajánlat→Rendelés→Szállítás→Számla-meta (CRM bizonylati stub, nem NAV) | `POST /crm/quotes/:id/convert-to-order`, `POST /crm/shipments/from-order/:id`, `POST /crm/invoice-stubs/from-order/:id` | Árajánlatok → Rendelés; Rendelések → Szállítás, **🧾 Meta** | 5 ajánlat, 3 rendelés, 2+ szállítás/stub | **Teljesítve** |
| 3 | Lead / opportunity | Lead CRUD, opportunity meglévő modul | `/crm/leads`, `/crm/opportunities` | Lehetőségek menü | 5 lead, 5+ opportunity | **Teljesítve** |
| 4 | Kedvezmények (4 típus) | Szabályok + prioritás + kalkuláció | `DiscountRule`, `/crm/discount-rules`, `discount-calculation.service` | Kedvezmények menü | 4 szabály típus | **Teljesítve** |
| 5 | Ügyfélkezelés / élettörténet | Interakciók, timeline, riportok, export | `CustomerInteraction`, `/crm/interactions/lifecycle/:id` | Partnerek → Élettörténet | 6+ interakció | **Teljesítve** |
| 6 | Reklamáció | Ticket + eszkaláció + riport | `/crm/tickets/:id/escalate`, `assign`, `status` | CRM → Reklamációk → Eszkalálás | 3 ticket (1 eszkalált) | **Teljesítve** |
| 7 | Ügyfél törzsadat | Számlázási/szállítási cím, import, duplikáció | `Account.szamlazasiCim`, `POST /crm/accounts/import`, `import/preview` | Import preview API + UI mezők | 10+ ügyfél | **Teljesítve** |
| 8 | Front office | Email + chat csatorna, élettörténetben | `Message.channel`, `/crm/messages` | Élettörténet → kommunikáció rögzítés | 10 kommunikáció | **Teljesítve** |
| 9 | Audit | CRM műveletek + export | `AuditService`, `GET /system/audit`, `export/:format` | Audit napló menü | Automatikus log | **Teljesítve** |
| 10 | Jogosultság | Admin / Sales / Viewer szerepkör | `permission.enum`, seed roles | Külön bejelentkezés | admin + sales | **Teljesítve** |
| 11 | Windows artifact | GitHub Actions `build-desktop.yml` | `.github/workflows/build-desktop.yml` | CI artifact letöltés | – | **Teljesítve** |
| 12 | SMTP külső kiküldés | Opcionális, nem kötelező runtime | `crm.smtp.host` beállítás | Üres = lokális rögzítés | – | **Nem releváns** (opcionális) |

## Unit tesztek

- `apps/server/src/crm/discount-calculation.service.spec.ts`
- `apps/server/src/crm/sales-flow.service.spec.ts`
- `apps/server/src/crm/account-import.service.spec.ts`
- `apps/server/src/crm/ticket.service.spec.ts`

Futtatás: `cd apps/server && npm test`
