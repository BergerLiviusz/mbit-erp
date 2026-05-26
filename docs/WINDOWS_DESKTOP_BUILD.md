# Windows desktop build (on-premise végtermék)

## Végtermék

- **Egyetlen szállítási forma:** Windows desktop (Electron)
- Beágyazott NestJS backend + SQLite (`%APPDATA%/mbit-erp/data/mbit-erp.db`)
- **Nincs** kötelező internetkapcsolat runtime alatt
- PWA / böngészős-only build **nem** ellenőrzési végtermék

## Verzió

Központi forrás: `packages/config/src/app-version.ts` → **MBIT ERP v1.0.1a**

## Lokális build

```bash
npm install
npm run build:config
npm run package:full          # teljes ERP
# vagy
npm run package:ginop         # GINOP CRM+DMS+HR (pályázati változat)
```

Manuális lépések:

```bash
cd apps/server && npx prisma generate && npm run build
cd ../web && VITE_ACTIVE_PACKAGE=ginop-crm-dms-hr ERP_PACKAGE=ginop-crm-dms-hr npm run build
cd ../desktop && ERP_PACKAGE=ginop-crm-dms-hr APP_VERSION=1.0.1a npm run package:win
```

Kimenet: `apps/desktop/release/`

- `win-unpacked/` – **teljes futtatható alkalmazásmappa** (közvetlen indítás)
- `MBIT ERP.exe` – indítófájl a `win-unpacked/` gyökerében
- `mbit-erp-v{ver}-{package}-portable-windows.zip` – ugyanez ZIP-ben (kicsomagolás után futtatható)
- `mbit-erp-v{ver}-{package}-setup.exe` – NSIS telepítő (opcionális; kisebb méretnél ne használd)

## CI artifactok (GitHub Actions)

Minden sikeres build után **három** artifact készül:

| Artifact név végződés | Tartalom | Mikor használd |
|----------------------|----------|----------------|
| **`-portable-app`** | Teljes `win-unpacked/` mappa | **Tesztelés / kézi futtatás** – letöltés után futtasd a `MBIT ERP.exe`-t |
| **`-portable-zip`** | ZIP a teljes app mappából | Archiválás, másolás ZIP-ként |
| **`-installer`** | `*-setup.exe` NSIS telepítő | Csak telepítős disztribúcióhoz |

### Régi működés visszaállítása (setup nélkül)

1. Actions → sikeres workflow run → Artifacts
2. Töltsd le: **`…-portable-app`**
3. A mappa gyökerében futtasd: **`MBIT ERP.exe`**
4. Első indításkor az app létrehozza az adatkönyvtárat (`%APPDATA%/…` / `mbit-erp`)

> **Ne** csak az `-installer` artifactot töltsd le teszteléshez – az csak a setup telepítő.

### Backend / Prisma (kötelező a portable artifactban)

Runtime alatt a NestJS backend itt fut:

`resources/backend/main.js`

A `@prisma/client/default.js` ezt require-olja:

`.prisma/client/default`

Node feloldás szerint **kötelező** léteznie:

| Útvonal (win-unpacked alatt) |
|------------------------------|
| `resources/backend/main.js` |
| `resources/backend/node_modules/@prisma/client/default.js` |
| `resources/backend/node_modules/.prisma/client/default.js` |
| `resources/backend/node_modules/.prisma/client/index.js` |
| `resources/backend/node_modules/.prisma/client/query_engine-windows.dll.node` |
| `resources/backend/prisma/schema.prisma` |

**Build folyamat (CI):**

1. `npm run prepare:backend-bundle` → `apps/server/packaging/backend/`
2. `electron-builder` → `win-unpacked/` (gyakran **kihagyja** a `node_modules/.prisma` dot-mappát)
3. **`npm run fix:windows-unpacked-prisma`** – stagingből explicit másolás → `resources/backend/node_modules/.prisma` és `@prisma/client`
4. `npm run verify:windows-artifact` – a **végleges** `win-unpacked` ellenőrzése
5. Artifact upload **`include-hidden-files: true`** (különben a `.prisma` mappa kimarad a feltöltésből)

```bash
npm run fix:windows-unpacked-prisma apps/desktop/release/win-unpacked
npm run verify:windows-artifact apps/desktop/release/win-unpacked
```

> **Fontos:** `resources/backend/prisma/schema.prisma` **nem elég** a futáshoz. Kötelező: `resources/backend/node_modules/.prisma/client/default.js`

Ha a backend **„Cannot find module '.prisma/client/default'”** hibát ad, hiányzik a generált client – futtasd a fix scriptet, vagy tölts le friss **`-portable-app`** artifactot.

## GitHub Actions

Workflow: `.github/workflows/build-desktop.yml`

**Trigger:**

- Push: `main`, `master`, `package-*`, `release/ginop-crm-dms-hr`, `release/full`, tag `v*`
- `workflow_dispatch` (package választó: `full`, `ginop-crm-dms-hr`, …)

**Lépések:**

1. `npm ci`
2. Prisma generate + validate
3. **CRM unit tesztek** (`apps/server` – `npm test`)
4. Server + web + Electron build
5. `prepare-backend-bundle` (staging)
6. `electron-builder` Windows package
7. `fix:windows-unpacked-prisma` (staging → `resources/backend/node_modules/.prisma`)
8. `verify-windows-artifact` a **végleges** `win-unpacked/` mappán
9. Artifact upload (`-portable-app`, `include-hidden-files: true`)

**Artifact nevek (példa GINOP build):**

- `mbit-erp-v1.0.1a-a1b2c3d-ginop-crm-dms-hr-portable-app` ← **ezt töltsd le teszteléshez**
- `mbit-erp-v1.0.1a-a1b2c3d-ginop-crm-dms-hr-portable-zip`
- `mbit-erp-v1.0.1a-a1b2c3d-ginop-crm-dms-hr-installer`

## Build meta (rendszerinformáció képernyő)

Opcionális környezeti változók a `GET /health/detailed` válaszhoz:

- `APP_VERSION` – alkalmazás verzió (alapértelmezés: `1.0.1a`)
- `ERP_PACKAGE` – aktív csomag ID (pl. `ginop-crm-dms-hr`)
- `VITE_ACTIVE_PACKAGE` – frontend build-time csomag
- `BUILD_SHA` – git commit rövid SHA
- `BUILD_DATE` – build időbélyeg (ISO)

Részletesen: [VERSIONING_STRATEGY.md](./VERSIONING_STRATEGY.md), [PACKAGE_STRATEGY.md](./PACKAGE_STRATEGY.md), [GINOP_PACKAGE_VARIANT.md](./GINOP_PACKAGE_VARIANT.md)

## GINOP release smoke-test (Windows)

1. Töltsd le a CI artifactot: `mbit-erp-v1.0.1a-*-ginop-crm-dms-hr-windows`
2. Csomagold ki a portable ZIP-et
3. Futtasd `MBIT ERP.exe` (vagy a build-meta alapján elnevezett exe-t)
4. Kövesd: [GINOP_RELEASE_CHECKLIST.md](./GINOP_RELEASE_CHECKLIST.md)

**Megjegyzés:** A build csak Windows runneren készül; macOS/Linux csak fejlesztői ellenőrzésre használható (API/script).

## Backup és restore

| Művelet | Hol | Megjegyzés |
|---------|-----|------------|
| Manuális backup | Beállítások → Biztonsági mentések → **Backup indítása** | `mbit-data/backups/` alatt ZIP |
| Backup lista | Ugyanitt | audit esemény a backendben |
| Restore | **Nincs** automatikus UI | Admin: állítsa le az appot, cserélje a DB ZIP-et a dokumentált útvonalon, indítsa újra |

Restore előtt mindig készítsen friss backupot. Kockázatos egy kattintásos visszaállítás – ezért csak dokumentált manuális folyamat.

## Demo adat (opcionális)

```bash
npm run db:seed
```

CRM demo: `apps/server/prisma/seed-crm.ts` – **nem** kötelező üzemeltetéshez.

## DMS fájltárolás desktopon

- Adatkönyvtár: `%USERPROFILE%/mbit-data` vagy `MBIT_DATA_DIR`
- Feltöltött fájlok: `files/`, OCR szöveg: `ocr/`
- OCR: Tesseract.js magyar nyelvvel, **nem igényel internetet** futás közben

## Dokumentáció

- CRM: [GINOP_CRM_MEGFELELOSEG.md](./GINOP_CRM_MEGFELELOSEG.md) · [CRM_DEMO_FORGATOKONYV.md](./CRM_DEMO_FORGATOKONYV.md)
- DMS: [GINOP_DMS_MEGFELELOSEG.md](./GINOP_DMS_MEGFELELOSEG.md) · [DMS_DEMO_FORGATOKONYV.md](./DMS_DEMO_FORGATOKONYV.md)
