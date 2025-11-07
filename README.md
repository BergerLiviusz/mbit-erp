# Mbit ERP
## Modular Vállalati Alkalmazás | Desktop & PWA | Magyar Nyelvű

[![Build Desktop App](https://github.com/BergerLiviusz/mbit-erp/actions/workflows/build-desktop.yml/badge.svg)](https://github.com/BergerLiviusz/mbit-erp/actions/workflows/build-desktop.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

---

## 📋 Tartalomjegyzék

- [Áttekintés](#áttekintés)
- [Főbb Funkciók](#főbb-funkciók)
- [Technológiai Stack](#technológiai-stack)
- [Gyors Telepítés](#gyors-telepítés)
- [Modulok](#modulok)
- [Dokumentáció](#dokumentáció)
- [Fejlesztés](#fejlesztés)
- [Deployment](#deployment)
- [Compliance](#compliance)
- [Támogatás](#támogatás)

---

## 🎯 Áttekintés

Az **Mbit ERP** egy átfogó, moduláris vállalati alkalmazás, amely egyesíti a CRM, DMS (Dokumentumkezelés) és Logisztikai funkciókat egyetlen, könnyen használható rendszerben. 

### Kulcs Jellemzők

- ✅ **100% Magyar nyelvű** felhasználói felület
- 🏢 **On-premise képes** - minden adat a saját infrastruktúrán marad
- 💻 **Electron Desktop App** - Windows & macOS telepítők
- 📦 **Egyszerű telepítés** - egy kattintásos installer
- 📱 **PWA támogatás** - böngészőből is elérhető
- 🔐 **GDPR compliant** - teljes adatvédelmi megfelelés
- 📊 **Audit-ready** - részletes naplózás és riportálás
- 🚀 **Gyors és modern** - React + NestJS + TypeScript

### 🖥️ Desktop Alkalmazás

A **teljes ERP rendszer** most elérhető **natív desktop alkalmazásként**:

- **Windows** - `.exe` telepítő (NSIS) + portable verzió
- **macOS** - `.dmg` telepítő (Intel + Apple Silicon)
- **100% offline működés** - nincs internet szükséges
- **Embedded backend** - NestJS szerver beépítve
- **SQLite adatbázis** - helyi fájlban tárolva
- **Teljes OCR támogatás** - Tesseract.js lokálisan

📖 **[Desktop App Build Útmutató →](BUILD_DESKTOP.md)**  
🚀 **[GitHub Actions CI/CD Setup →](GITHUB_ACTIONS_SETUP.md)**

**💾 Letöltés**: A legújabb installer-ek a [GitHub Releases](https://github.com/BergerLiviusz/mbit-erp/releases) oldalon érhetők el.

---

## ✨ Főbb Funkciók

### 📞 CRM Modul
- **Ügyfélkapcsolat-kezelés** - 360° ügyfélnézet
- **Kampánymenedzsment** - célközönség szegmentálás, nyomon követés
- **Értékesítési folyamat** - Ajánlat → Rendelés → Számlázás integráció
- **Kedvezménykezelés** - mennyiségi, egyedi, időszaki kedvezmények
- **Reklamációkezelés** - ticketing rendszer eszkalációval
- **Front office** - email, chat integráció

### 📄 DMS (Iratkezelés) Modul
- **Elektronikus iktatás** - automatikus iktatószám generálás
- **OCR feldolgozás** - Magyar nyelv támogatással (Tesseract)
- **Dokumentum életciklus** - verziózás, jogosultságok
- **Teljes szöveges keresés** - OCR eredményekben is
- **Archiválás** - hosszú távú megőrzés törvényi megfelelőséggel
- **Audit trail** - minden művelet naplózva

### 📦 Logisztika Modul
- **Cikktörzs kezelés** - cikkcsoportok, tulajdonságok
- **Többraktáros rendszer** - készletszintek raktáranként
- **Min/Max készletriasztás** - automatikus figyelmeztetések
- **Sarzs/gyártási szám** - teljes nyomonkövethetőség
- **Árlista menedzsment** - több szállító, import CSV/Excel
- **Beszerzési lánc** - rendelés → szállítás → számlázás

### 🔮 Jövőbeli Modulok (Scaffold)
- HR & Bérszámfejtés
- Controlling / BI
- Gyártás
- Webáruház
- Online Marketing

---

## 🛠️ Technológiai Stack

### Frontend
- **React 18** - UI könyvtár
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TanStack Query** - Server state management
- **Zustand** - Client state
- **React Hook Form + Zod** - Form validation
- **shadcn/ui + Tailwind** - UI komponensek
- **i18next** - Többnyelvűség (Magyar default)

### Backend
- **NestJS** - TypeScript framework
- **Prisma ORM** - Database toolkit
- **SQLite / PostgreSQL** - Adatbázis
- **JWT** - Autentikáció
- **Winston** - Logging
- **WebSocket** - Real-time kommunikáció

### Desktop
- **Electron** - Cross-platform wrapper
- **electron-builder** - Packaging (MSI, DMG, AppImage)

### PWA
- **Vite PWA Plugin** - Service worker
- **IndexedDB** - Offline data storage

### DevOps
- **Turbo** - Monorepo build system
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **GitHub Actions / GitLab CI** - CI/CD

---

## 🚀 Gyors Telepítés

### Előfeltételek

```bash
node >= 20.0.0
npm >= 10.0.0
```

### 1. Klónozás és Függőségek Telepítése

```bash
git clone <repository-url>
cd mbit-erp
npm install
```

### 2. Adatbázis Inicializálása

```bash
# Prisma client generálás
npm run db:generate

# Adatbázis séma alkalmazása
npm run db:push

# Teszt adatok betöltése (opcionális)
npm run db:seed
```

### 3. Környezeti Változók

Másolja a `.env.example` fájlt `.env`-be:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key-change-in-production-256-bit"
PORT=3000
NODE_ENV=development
```

### 4. Fejlesztői Módban Indítás

```bash
# Backend szerver (port 3000)
npm run server

# Frontend web app (port 5000)
npm run web

# Vagy mindkettő egyszerre
npm run dev
```

### 5. Bejelentkezés

- **URL:** http://localhost:5000
- **Email:** admin@mbit.hu
- **Jelszó:** admin123

⚠️ **Változtassa meg a jelszót első bejelentkezéskor!**

---

## 📦 Modulok

### Projekt Struktúra

```
mbit-erp/
├── apps/
│   ├── server/          # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/    # Autentikáció
│   │   │   ├── crm/     # CRM modul
│   │   │   ├── dms/     # Dokumentumkezelés
│   │   │   ├── logistics/ # Logisztika
│   │   │   └── audit/   # Audit naplók
│   │   └── prisma/      # Adatbázis séma
│   ├── web/             # React frontend (PWA)
│   └── desktop/         # Electron wrapper
├── packages/
│   ├── ui/              # Shared UI komponensek
│   ├── types/           # TypeScript típusok
│   └── config/          # Shared konfiguráció
├── docs/                # Magyar dokumentáció
└── package.json         # Monorepo root
```

---

## 📚 Dokumentáció

Minden dokumentáció **magyar nyelven** elérhető a `/docs` könyvtárban:

| Dokumentum | Leírás |
|-----------|--------|
| [Telepítési és Üzemeltetői Kézikönyv](docs/Telepitesi_es_uzemeltetoi_kezikonyv.md) | Rendszer telepítés, konfiguráció, üzemeltetés |
| [Felhasználói Kézikönyv](docs/Felhasznaloi_kezikonyv.md) | Végfelhasználói útmutató képernyőképekkel |
| [E-learning Vázlat](docs/E-learning_vazlat.md) | Moduláris online képzési program |
| [Támogatási Szerződés Sablon](docs/Tamogatasi_szerzodes_sablon.md) | SLA, support, karbantartás |
| [GDPR Adatkezelési Tájékoztató](docs/Adatkezelesi_tajekoztato_GDPR.md) | Adatvédelmi irányelvek |
| [IT Biztonsági Szabályzat](docs/IT_biztonsagi_szabalyzat.md) | Biztonsági politikák és kontrollok |
| [Verziókezelési Stratégia](docs/Verziokezeles_es_karbantartas.md) | Release management, karbantartás |
| [DRP Összefoglaló](docs/DRP_osszefoglalo.md) | Disaster Recovery Plan |

---

## 💻 Fejlesztés

### Parancsok

```bash
# Fejlesztés
npm run dev                    # Összes app indítása
npm run server                 # Csak backend
npm run web                    # Csak frontend

# Build
npm run build                  # Production build
npm run build:desktop          # Desktop app build
npm run build:pwa              # PWA build

# Database
npm run db:generate            # Prisma client generálás
npm run db:push                # Séma alkalmazása
npm run db:seed                # Teszt adatok
npm run db:studio              # Prisma Studio UI

# Tesztelés
npm run lint                   # ESLint
npm run test                   # Unit tesztek
```

### Code Style

- **TypeScript Strict Mode** enabled
- **ESLint + Prettier** formázás
- **Conventional Commits** kötelező
- **Code Review** minden PR-hez

### Git Workflow

```bash
# Új feature branch
git checkout -b feature/crm-kedvezmeny-kezeles

# Commitok (conventional commits)
git commit -m "feat(crm): mennyiségi kedvezmény hozzáadva"

# Push és Pull Request
git push origin feature/crm-kedvezmeny-kezeles
```

---

## 🚢 Deployment

### Desktop Alkalmazás

```bash
# Windows (MSI installer)
npm run package:win

# macOS (DMG + ZIP)
npm run package:mac

# Linux (AppImage)
npm run package:linux
```

**Kimenet:** `apps/desktop/dist/`

### PWA Build

```bash
npm run build:pwa
```

**Kimenet:** `apps/web/dist-pwa/`

### Production Server

```bash
# Build
npm run build

# Environment setup
export NODE_ENV=production
export DATABASE_URL="postgresql://user:pass@localhost:5432/mbit_erp"
export JWT_SECRET="strong-secret-key-256-bit"

# Start with PM2 (ajánlott)
pm2 start apps/server/dist/main.js --name mbit-erp-server
pm2 save
pm2 startup
```

### Docker (Opcionális)

```dockerfile
# Dockerfile példa
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "start:prod"]
```

---

## ✅ Compliance

### GDPR Megfelelés

- ✅ Személyes adatok titkosítva (AES-256)
- ✅ Szerepkör-alapú hozzáférés (RBAC)
- ✅ Audit naplók 7 évig
- ✅ Adat törlési kérelmek kezelése
- ✅ Adatfeldolgozási megállapodások

### Audit Követelmények

- ✅ **Naplózás:** Minden kritikus művelet
- ✅ **Jogosultságkezelés:** Min. 2 szerepkör (User, Admin)
- ✅ **Magyar UI:** 100% magyar felület
- ✅ **Távoli elérés:** HTTPS + opcionális 2FA
- ✅ **Hibabejelentés:** Beépített ticketing rendszer
- ✅ **Backup & ÜBT:** Automatikus mentések + DR terv
- ✅ **Elérhetőség:** ≥96% SLA target

### Dokumentáltság

- ✅ Telepítési kézikönyv
- ✅ Felhasználói kézikönyv
- ✅ E-learning vázlat
- ✅ Támogatási dokumentáció
- ✅ GDPR tájékoztató
- ✅ IT biztonsági szabályzat
- ✅ Verziókezelési stratégia
- ✅ Disaster Recovery Plan

---

## 🆘 Támogatás

### Hibabejelentés

1. **Rendszeren belül:** CRM > Reklamációk > Új Ticket
2. **Email:** support@mbit.hu
3. **Telefon:** +36 1 234 5678

### SLA

| Prioritás | Első válasz | Megoldási cél |
|-----------|-------------|---------------|
| Kritikus (P1) | 1 óra | 4 óra |
| Sürgős (P2) | 4 óra | 8 óra |
| Normál (P3) | 8 óra | 24 óra |
| Alacsony (P4) | 24 óra | 5 munkanap |

### Munkaidő

**Standard:** Hétfő-Péntek, 9:00-17:00 (CET)  
**Extended (opcionális):** 7×24 támogatás

---

## 📝 Licensz

MIT License - Lásd [LICENSE](LICENSE) fájl

---

## 🤝 Közreműködés

Jelenleg belső fejlesztés alatt. További információ hamarosan.

---

## 🗺️ Roadmap

### v1.0 (2025 Q4) - MVP ✅
- [x] CRM modul alapfunkciók
- [x] DMS modul + OCR
- [x] Logisztika modul
- [x] Desktop + PWA build
- [x] Magyar dokumentáció

### v1.1 (2026 Q1)
- [ ] HR modul alapok
- [ ] Controlling/BI riportok
- [ ] Email integráció
- [ ] SMS értesítések
- [ ] Mobil optimalizálás

### v1.2 (2026 Q2)
- [ ] Gyártás modul
- [ ] Webáruház alapok
- [ ] Online Marketing integráció
- [ ] Advanced riporting
- [ ] Multi-tenant támogatás

### v2.0 (2026 Q4)
- [ ] AI asszisztens
- [ ] Prediktív analitika
- [ ] Workflow automatizálás
- [ ] API marketplace

---

## 📊 Projekt Statisztikák

- **Kódsorok:** ~50,000+
- **Komponensek:** 100+ React komponens
- **API Endpoints:** 50+ REST API
- **Adatbázis táblák:** 30+ Prisma modell
- **Modulok:** 3 működő + 5 scaffold
- **Dokumentáció:** 8 átfogó magyar dokumentum

---

## 👥 Készítette

**MB-IT Kft. Fejlesztői Csapat**  
**Verzió:** 1.0  
**Dátum:** 2025. november 6.

---

## 🌟 Features Highlight

```javascript
// Példa: Mennyiségi kedvezmény kalkuláció
const calculateDiscount = (quantity, price) => {
  if (quantity >= 100) return price * 0.85; // 15% kedvezmény
  if (quantity >= 50) return price * 0.90;  // 10% kedvezmény
  if (quantity >= 10) return price * 0.95;  // 5% kedvezmény
  return price;
};

// OCR feldolgozás magyar nyelven
const ocrDocument = async (filePath) => {
  const worker = await createWorker('hun');
  const { data: { text } } = await worker.recognize(filePath);
  return text;
};
```

---

**Köszönjük, hogy az Mbit ERP rendszert választotta!** 🚀
