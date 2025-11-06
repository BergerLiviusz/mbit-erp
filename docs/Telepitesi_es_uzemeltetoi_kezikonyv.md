# Telepítési és Üzemeltetői Kézikönyv
## Audit Institute ERP Rendszer v1.0

---

## 1. Bevezetés

Ez a dokumentum az Audit Institute ERP rendszer telepítésének és üzemeltetésének teljes folyamatát ismerteti.

### 1.1 Rendszerkövetelmények

#### Desktop Alkalmazás:
- **Windows:** Windows 10 vagy újabb (64-bit)
- **macOS:** macOS 10.15 (Catalina) vagy újabb
- **Linux:** Ubuntu 20.04 vagy újabb, vagy egyenértékű disztribúció
- **RAM:** Minimum 4 GB, ajánlott 8 GB
- **Tárhely:** 500 MB szabad hely

#### Böngészős Használat (PWA):
- **Böngészők:** Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Internetkapcsolat:** Kezdeti betöltéshez szükséges, offline működés támogatott

#### Szerver Követelmények:
- **Node.js:** v20.0.0 vagy újabb
- **Adatbázis:** SQLite (alapértelmezett) vagy PostgreSQL 13+
- **RAM:** Minimum 2 GB
- **Tárhely:** 1 GB + adattároló hely

---

## 2. Telepítés

### 2.1 Desktop Alkalmazás Telepítése

#### Windows:
1. Töltse le a  `Audit-Institute-ERP-Setup.msi` fájlt
2. Futtassa a telepítőt rendszergazdai jogosultsággal
3. Kövesse a telepítési varázslót
4. A telepítés után az alkalmazás elérhető a Start menüből

#### macOS:
1. Töltse le a `Audit-Institute-ERP.dmg` fájlt
2. Nyissa meg a DMG fájlt
3. Húzza az alkalmazást az Applications mappába
4. Első indításkor engedélyezze a biztonsági beállításokban

#### Linux:
1. Töltse le a `Audit-Institute-ERP.AppImage` fájlt
2. Adjon végrehajtási jogot: `chmod +x Audit-Institute-ERP.AppImage`
3. Futtassa a fájlt: `./Audit-Institute-ERP.AppImage`

### 2.2 Saját Szerver Telepítése

```bash
# 1. Node.js telepítése (ha még nincs)
# Látogassa meg: https://nodejs.org

# 2. Projekt letöltése
git clone [repository-url]
cd audit-institute-erp

# 3. Függőségek telepítése
npm install

# 4. Környezeti változók beállítása
cp apps/server/.env.example apps/server/.env
# Szerkessze a .env fájlt az adatbázis és egyéb beállításokkal

# 5. Adatbázis inicializálása
npm run db:push
npm run db:seed

# 6. Alkalmazás indítása
npm run server  # Backend
npm run web     # Frontend
```

---

## 3. Konfiguráció

### 3.1 Adatbázis Konfiguráció

#### SQLite (alapértelmezett):
```env
DATABASE_URL="file:./prisma/dev.db"
```

#### PostgreSQL:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/audit_erp"
```

### 3.2 Biztonsági Beállítások

```env
JWT_SECRET="valtoztassa-meg-biztonsagi-kulcs-256-bit"
PORT=3000
NODE_ENV=production
```

### 3.3 Email Konfiguráció (opcionális)

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@auditinstitute.hu
SMTP_PASS=jelszó
```

---

## 4. Üzemeltetés

### 4.1 Alkalmazás Indítása

#### Fejlesztői Mód:
```bash
npm run dev
```

#### Produkciós Mód:
```bash
npm run build
npm run start:prod
```

#### PM2 használatával (ajánlott):
```bash
npm install -g pm2
pm2 start apps/server/dist/main.js --name audit-erp-server
pm2 save
pm2 startup
```

### 4.2 Napi Üzemeltetési Feladatok

#### Naplók Ellenőrzése:
```bash
# PM2 naplók
pm2 logs audit-erp-server

# Manuális naplók
tail -f logs/application.log
```

#### Adatbázis Mentés:
```bash
# Automatikus mentés
npm run backup:create

# Manuális SQLite mentés
cp apps/server/prisma/dev.db backups/dev-$(date +%Y%m%d).db
```

#### Rendszer Státusz:
```bash
# PM2 státusz
pm2 status

# Alkalmazás health check
curl http://localhost:3000/health
```

### 4.3 Frissítések

```bash
# 1. Backup készítése
npm run backup:create

# 2. Frissítés letöltése
git pull origin main

# 3. Függőségek frissítése
npm install

# 4. Adatbázis migráció
npm run db:push

# 5. Újraindítás
pm2 restart audit-erp-server
```

---

## 5. Biztonsági Mentés és Visszaállítás

### 5.1 Automatikus Mentés Beállítása

A rendszer beépített mentési funkciót tartalmaz:

```bash
# Mentési időzítő beállítása (cron)
0 2 * * * cd /path/to/app && npm run backup:create
```

### 5.2 Manuális Mentés

```bash
npm run backup:create
# Mentés helye: backups/backup-YYYYMMDD-HHMMSS.tar.gz
```

### 5.3 Visszaállítás

```bash
npm run backup:restore -- --file=backups/backup-20251106.tar.gz
```

---

## 6. Monitoring és Teljesítmény

### 6.1 Teljesítményfigyelés

```bash
# PM2 monitoring
pm2 monit

# Rendszer erőforrások
pm2 status
```

### 6.2 Logok Elemzése

```bash
# Hibák keresése
grep "ERROR" logs/application.log

# Lassú lekérdezések
grep "slow query" logs/database.log
```

### 6.3 Elérhetőség Cél: ≥96%

A rendszer monitoring eszközei riasztást küldenek, ha az elérhetőség 96% alá esik.

---

## 7. Hibaelhárítás

### 7.1 Gyakori Problémák

#### Alkalmazás nem indul:
```bash
# Port foglaltság ellenőrzése
lsof -i :3000

# Naplók ellenőrzése
pm2 logs --err

# Újraindítás
pm2 restart audit-erp-server
```

#### Adatbázis kapcsolati hiba:
```bash
# Kapcsolat tesztelése
npm run db:test

# Séma szinkronizálása
npm run db:push
```

#### Lassú teljesítmény:
```bash
# Cache tisztítása
npm run cache:clear

# Adatbázis optimalizálás
npm run db:optimize
```

### 7.2 Support Elérhetőség

- **Email:** support@auditinstitute.hu
- **Telefon:** +36 1 234 5678
- **Munkaidő:** H-P 9:00-17:00
- **SLA:** 96% elérhetőség, 4 óra válaszidő

---

## 8. Karbantartás

### 8.1 Heti Feladatok
- Naplók archiválása
- Mentések ellenőrzése
- Disk használat monitoring

### 8.2 Havi Feladatok
- Biztonsági frissítések telepítése
- Teljesítmény riportok készítése
- Felhasználói fiók audit

### 8.3 Negyedéves Feladatok
- Teljes rendszer audit
- Kapacitástervezés felülvizsgálata
- Disaster Recovery teszt

---

## 9. Compliance és Audit

### 9.1 Naplózás

Minden kritikus művelet naplózásra kerül:
- Felhasználói bejelentkezések
- Adat módosítások (CRM, DMS, Logisztika)
- Jogosultság változások
- Rendszer konfigurációs változások

### 9.2 Adatmegőrzés

- **Működési naplók:** 1 év
- **Audit naplók:** 7 év
- **Biztonsági mentések:** 90 nap

### 9.3 GDPR Megfelelés

- Személyes adatok titkosítva tárolva
- Felhasználói hozzáférési jogok
- Adattörlési kérelmek kezelése
- Adatfeldolgozási nyilvántartás

---

## 10. Függelék

### 10.1 Környezeti Változók

| Változó | Leírás | Alapértelmezett |
|---------|--------|-----------------|
| DATABASE_URL | Adatbázis kapcsolat | file:./prisma/dev.db |
| JWT_SECRET | JWT titkosítási kulcs | - |
| PORT | Szerver port | 3000 |
| NODE_ENV | Környezet | development |

### 10.2 Parancsok Referencia

| Parancs | Leírás |
|---------|--------|
| npm run dev | Fejlesztői mód indítása |
| npm run build | Produkciós build |
| npm run start:prod | Produkciós indítás |
| npm run db:push | Adatbázis séma frissítés |
| npm run db:seed | Teszt adatok betöltése |
| npm run backup:create | Mentés készítése |

---

**Verzió:** 1.0  
**Utolsó frissítés:** 2025. november 6.  
**Készítette:** Audit Institute IT Csapat
