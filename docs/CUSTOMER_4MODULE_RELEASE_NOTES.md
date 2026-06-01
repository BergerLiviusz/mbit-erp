# MBIT ERP – Ügyfél 4 modulos csomag (Customer Edition)

**Verzió:** MBIT ERP v1.0.1a  
**Package ID:** `customer-4module` (alias: `ERP_CUSTOMER_4MODULE`, legacy branch: `package-4`)  
**Release dátum:** 2026-06-01  
**Branding:** Customer Edition

## Csomag moduljai

| Modul | Állapot |
|-------|---------|
| CRM (Ügyfélkezelés) | Engedélyezve |
| DMS (Dokumentumkezelés) | Engedélyezve |
| Logisztika / Raktár | Engedélyezve |
| Munkafolyamat / Csapatmunka | Engedélyezve |
| HR | **Tiltva** |
| Kontrolling | **Tiltva** |

## Javított hibák

### Package / HR
- Az ügyfél csomagban az HR menü, route-ok és API (`/hr/*`) nem érhetők el (`PackageModuleGuard` + frontend `isHrModuleEnabled`).
- `package-4` és `customer-4module` egyaránt HR-mentes konfiguráció.

### DMS
- **Irat helye a listában:** régi mezők (`iratHelye`, `felelos`) kompatibilitási réteg; lista megjelenítés javítva.
- **Irat helye szerkesztéskor:** mező betöltése a részletes API-ból; **új dokumentum** létrehozásakor a `jelenlegiHely` mentése (korábban kimaradt a POST body-ból).
- **Dokumentum részletek crash (`j.filter is not a function`):** a `/system/users` válasz `{ items: [] }` formátuma miatt a `users` objektumként került state-be; javítva + `Array.isArray` védelem a jogosultság UI-n.
- **Részletek UI:** kiemelt blokk – iktatószám, típus, irat helye, felelős, állapot; meta blokkban létrehozás / módosítás.

### Workflow
- Duplikált „Hozzárendelt személy” / „Szerepkör” mezőpár eltávolítva az új workflow űrlapról.
- Több személy hozzárendelése lépésenként (multi-select; `assignedToId` + `assignedUserIds`).

### Csapat kommunikáció
- Saját hozzászólás szerkesztése a feladat modálban; mentés audit activity loggal; `updatedAt` megjelenítése.

## Ismert korlátok

- Windows telepítő csak CI / Windows gépen készíthető (`electron-builder --win`).
- Régi adatbázison futtasd a Prisma migrációt (`assignedUserIds` oszlop a workflow lépéseknél).
- A `felelos` mező régi telepítéseken fallback lehet „irat helye”-re, ha a `jelenlegiHely` üres – ellenőrizd az adatokat migráció után.

## Build

```bash
export VITE_ACTIVE_PACKAGE=customer-4module
export ERP_PACKAGE=customer-4module
cd packages/config && npm run build
cd apps/server && npm run build
cd apps/web && cross-env ELECTRON_BUILD=true VITE_ACTIVE_PACKAGE=customer-4module npm run build
cd apps/desktop && cross-env VITE_ACTIVE_PACKAGE=customer-4module ERP_PACKAGE=customer-4module npm run package:win
```

**Artifact név:** `mbit-erp-v1.0.1a-customer-4module-windows.zip`

## Termék részletek – UX javaslat

A termék részletek modálban jelenleg nincs termék-szintű „Létrehozva” mező; a sarzs táblázatban szerepel lot-szinten. Javaslat: termék-szintű meta (létrehozva / utolsó módosítás) halvány másodlagos sorként a modál alján, ha audit igény van – nem kötelező a napi használathoz.
