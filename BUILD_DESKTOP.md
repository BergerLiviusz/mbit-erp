# Mbit ERP Desktop Application - Build Guide

## Gyors Áttekintés

Az Mbit ERP most **Electron desktop alkalmazásként** is elérhető, teljes **on-premise** működéssel.

### ✨ Miért Desktop App?

- 🔒 **100% lokális működés** - nincs külső függőség
- 📦 **Egyszerű telepítés** - Windows/Mac installer
- 🚀 **Gyors indítás** - minden komponens beépített
- 💾 **Saját adatok** - SQLite adatbázis helyben
- 🔧 **Teljes funkciókészlet** - CRM, DMS, OCR, Logisztika

---

## 🔧 Architektúra & Kritikus Javítások

### Backend Startup & Health Check

Az alkalmazás **intelligens backend readiness probe**-ot használ:

- ✅ **Dinamikus health check** - polling a `/health` endpoint-ra (fix delay helyett)
- ✅ **30 másodperces timeout** - max 30 próbálkozás, 1s intervallummal
- ✅ **Progresszív logging** - státusz üzenet 5 próbálkozásonként
- ✅ **Hibakezelés** - magyar nyelvű dialog box backend hiba esetén

### Graceful Shutdown

Backend leállítás biztonságosan történik:

- ✅ **SIGTERM first** - először graceful shutdown kérés
- ✅ **SIGKILL fallback** - 5s után force kill ha nem állt le
- ✅ **1s grace period** - app exit előtt várakozás
- ✅ **Cross-platform** - Windows/macOS/Linux támogatás

### Resource Management

- ✅ **No memory leaks** - minden timeout bounded
- ✅ **Socket cleanup** - HTTP health check automatikus teardown
- ✅ **Process cleanup** - child process tracking és leállítás

---

## ⚠️ FONTOS: TypeScript Build Cache Probléma

**Probléma**: A monorepo TypeScript incremental compilation-t használ, ami `.tsbuildinfo` cache fájlokat hoz létre. Ezek a cache fájlok **blokkolhatják a dist mappák generálását** build során.

**Megoldás**: A build script-ek most automatikusan tisztítják ezeket a cache fájlokat **cross-platform** módon (Windows/macOS/Linux):
```json
"prebuild": "npm run clean && npx rimraf \"**/*.tsbuildinfo\" tsconfig.tsbuildinfo",
"build:electron": "npx rimraf tsconfig.tsbuildinfo && tsc",
"build:backend": "cd ../server && npx rimraf tsconfig.tsbuildinfo && npm run build",
"build:frontend": "cd ../web && npx rimraf tsconfig.tsbuildinfo && cross-env ELECTRON_BUILD=true npm run build"
```

Ha hiányzó `dist` mappákkal találkozol, manuálisan futtasd:
```bash
# Windows/macOS/Linux:
npx rimraf "**/*.tsbuildinfo"
```

**Javított build script-ek**:
- `prebuild` - törli a cache fájlokat
- `build:backend` - törli a server cache-t build előtt
- `build:frontend` - törli a web cache-t build előtt

---

## 🏗️ Build Process

### 1. Előkészületek

Győződj meg róla, hogy minden dependency telepítve van:

```bash
# Gyökérkönyvtárból
npm install

# Desktop app dependencies
cd apps/desktop
npm install
```

### 2. Desktop App Build

```bash
cd apps/desktop

# Teljes build (frontend + backend + electron)
npm run build

# Csak Electron kód
npm run build:electron

# Csak backend
npm run build:backend

# Csak frontend
npm run build:frontend
```

### 3. ⚠️ KRITIKUS: Backend Dependencies Nested Install (VALÓDI FÁJLOK!)

**FONTOS**: A monorepo workspace-ek **hoisted dependencies**-t és Windows **junction point**-okat használnak, ami miatt a csomagolt alkalmazás **NEM fogja** tartalmazni a backend dependencies-eket.

**Két probléma:**
1. **Symlink/junction-ök** az `apps/server/node_modules`-ban
2. **Windows hardlink-ek** még nested install esetén is (alapértelmezett npm viselkedés)

**Megoldás**: `--install-links=false` flag használata a **VALÓDI FÁJLOK** másolásához:

```bash
# Lépj be a server könyvtárba
cd apps/server

# Távolítsd el a symlink-eket/junction-öket
rm -rf node_modules

# Telepítsd újra NESTED módban (production dependencies, VALÓDI FÁJLOK!)
npm install --omit=dev --install-strategy=nested --install-links=false --workspaces=false

# Ellenőrzés: dotenv létezik és NEM symlink
ls -la node_modules/dotenv
```

**Ellenőrzés Windows-on (AJÁNLOTT - PONTOSABB):**
```powershell
cd apps\server
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# KRITIKUS FLAG: --install-links=false
npm install --omit=dev --install-strategy=nested --install-links=false --workspaces=false

# Ellenőrzés: dotenv NEM junction/reparse point
$dotenvAttrs = (Get-Item "node_modules\dotenv").Attributes
if ($dotenvAttrs -match 'ReparsePoint') {
    Write-Host "HIBA: Még mindig junction!"
} else {
    Write-Host "OK: Valódi fájlok"
}

# Méret ellenőrzése
$size = (Get-ChildItem node_modules -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host ("Node modules mérete: {0:N2} MB" -f $size)
```

**Mit várj:**
- ✅ `node_modules/dotenv` **könyvtár** (NEM symlink/junction)
- ✅ `Attributes` **NEM tartalmazza** a `ReparsePoint`-ot
- ✅ `node_modules` mérete: **~100-150 MB**
- ❌ Ha csak pár MB, akkor még mindig junction-öket használ!

**FIGYELEM**: Git Bash `test -L` **NEM LÁTJA** a Windows junction-öket! Mindig PowerShell-t használj ellenőrzésre!

### 4. Windows Installer Készítése

```bash
cd apps/desktop
npm run package:win
```

**Kimenet:**
- `release/Mbit-ERP-Setup-1.0.0.exe` - NSIS telepítő
- `release/Mbit-ERP-1.0.0.exe` - Portable verzió

**Várt Méret:** ~200-300 MB (teljes app + backend dependencies)

### 4. Mac Installer Készítése

```bash
cd apps/desktop
npm run package:mac
```

**Kimenet:**
- `release/Mbit-ERP-1.0.0-x64.dmg` - Intel Mac
- `release/Mbit-ERP-1.0.0-arm64.dmg` - Apple Silicon (M1/M2/M3)

**Méret:** ~150-200 MB

### 5. Linux Installer Készítése

```bash
cd apps/desktop
npm run package:linux
```

**Kimenet:**
- `release/Mbit ERP-1.0.0-x86_64.AppImage` - ✅ **SIKERES** (~119 MB)
- `release/Mbit ERP-1.0.0-amd64.deb` - ❌ **Replit limitáció** (FPM segfault)

**⚠️ Replit Build Korlátozások:**

A Replit fejlesztői környezetben:
- ✅ **Linux AppImage**: Sikeresen buildelődik
- ❌ **DEB package**: FPM tool crash (Ruby binary segfault)
- ❌ **Windows NSIS**: Wine függőség hiányzik
- ❌ **macOS DMG**: macOS környezet szükséges

**💡 Ajánlás**: **GitHub Actions CI/CD** használata production build-ekhez (lásd alább)

### 6. Összes Platform Egyszerre

```bash
cd apps/desktop
npm run package:all
```

**Megjegyzés:** Mac build-hez macOS szükséges, Windows build Windows-on vagy Wine-nal működik.

---

## 🧪 Tesztelés Development Módban

### Backend + Frontend + Electron együtt

```bash
# Terminal 1: Backend
cd apps/server
npm run start:dev

# Terminal 2: Frontend
cd apps/web
npm run dev

# Terminal 3: Electron
cd apps/desktop
npm run dev
```

Ez megnyit egy Electron ablakot, ami localhost:5000-re mutat.

---

## 📁 Build Kimenet Struktúra

```
apps/desktop/
├── dist-electron/           # Lefordított Electron kód
│   ├── main.js             # Fő process
│   └── preload.js          # Biztonsági réteg
├── release/                # Telepítők
│   ├── Mbit-ERP-Setup-1.0.0.exe      (Windows NSIS)
│   ├── Mbit-ERP-1.0.0.exe            (Windows Portable)
│   ├── Mbit-ERP-1.0.0-x64.dmg        (Mac Intel)
│   └── Mbit-ERP-1.0.0-arm64.dmg      (Mac ARM)
└── resources/              # App assets
    ├── icon.png            # App ikon
    └── entitlements.mac.plist
```

---

## 🔧 Gyakori Problémák

### ⚠️ KRITIKUS: Backend Indítási Hibák Windows-on

#### **1. "spawn node ENOENT" hiba**

**Probléma**: Telepített alkalmazás nem indul, hibát ír: "spawn node ENOENT"

**Ok**: Korábbi verziók `spawn('node', ...)` hívással keresték a rendszer Node.js-t.

**Megoldás**: **JAVÍTVA v1.0.2+ VERZIÓTÓL!**
- ✅ `child_process.fork()` API használata Electron beépített Node.js-ével
- ✅ `ELECTRON_RUN_AS_NODE=1` környezeti változó
- ✅ Nincs szükség külső Node.js telepítésre

---

#### **2. "Cannot find module 'dotenv'" és "Cannot find module 'es-object-atoms'" hibák**

**Probléma**: Backend indul, de azonnal összeomlik modul hiány miatt

**Alapvető Ok (ROOT CAUSE)**: 
npm workspaces (Turborepo) **hoisted dependencies** + Windows **junction point/hardlink** rendszer:

1. **Hoisting**: npm a dependencies-eket a root `node_modules`-ba helyezi
2. **Junction-ök**: `apps/server/node_modules` **junction point**-okat tartalmaz
3. **Nested install** is használ **hardlink-eket** alapértelmezetten (még `--install-strategy=nested` esetén is!)
4. **electron-builder**: Junction/hardlink-eket másol AS-IS
5. **Packaged app**: Junction-ök törött hivatkozások lesznek (vissza mutatnak a build runner temp path-ra)

**Példa a problémára:**
```
# A monorepo-ban (fejlesztés közben):
apps/server/node_modules/dotenv → [junction] → ../../node_modules/dotenv  ✅ Működik

# Nested install-lal (alapértelmezett):
apps/server/node_modules/dotenv → [hardlink] → global npm cache  ✅ Működik build-kor

# A csomagolt alkalmazásban:
resources/backend/node_modules/dotenv → [junction] → C:\actions-runner\...\node_modules\dotenv  ❌ Törött!
```

**Miért NEM működött a korábbi nested install?**
- `npm install --install-strategy=nested` **alapértelmezetten hardlink/junction-öket** használ
- Git Bash `test -L` **NEM LÁTJA** a Windows junction-öket → false positive verification
- Installer ~150 MB (üres junction tree, nem ~250 MB valódi fájlokkal)

**Megoldás**: **JAVÍTVA v1.0.4+ VERZIÓTÓL!**

**GitHub Actions javítások:**
```yaml
# 1. Server build (hoisted dependencies használatával)
- Build server code: npm run build

# 2. NESTED install PACKAGING ELŐTT (VALÓDI FÁJLOK, nem junction/hardlink!)
- Remove junctions: Remove-Item -Recurse -Force node_modules
- Install nested: npm install --omit=dev --install-strategy=nested --install-links=false --workspaces=false
  ⚠️ KRITIKUS FLAG: --install-links=false (másolja a fájlokat, ne hardlink!)

# 3. Verification (PowerShell - LÁTJA a junction-öket!)
- Check dotenv: (Get-Item "node_modules\dotenv").Attributes -notmatch 'ReparsePoint'
- Check es-object-atoms: (Get-Item "node_modules\es-object-atoms").Attributes -notmatch 'ReparsePoint'
- Verify size: node_modules ~100-150 MB (nem pár MB!)

# 4. Post-package verification
- Verify packaged build contains real files in win-unpacked/resources/backend/node_modules
- Check multiple packages (dotenv, es-object-atoms, @nestjs/core)
```

**Runtime javítások (main.ts):**
```typescript
- NODE_PATH: backend/node_modules path
- cwd: backend directory (helyes working directory)
- Pre-flight checks: node_modules és dotenv létezésének ellenőrzése
- Részletes hibanapló minden ellenőrzésről
```

**Eredmény:**
- ✅ Teljes backend dependency bundle **valódi fájlokkal** (~100-150 MB node_modules)
- ✅ Installer mérete: **250-300 MB** (vs. korábbi 83-152 MB)
- ✅ **Nincs junction/hardlink/symlink** - tiszta fájl másolatok
- ✅ PowerShell verification **LÁTJA** a Windows junction-öket
- ✅ Helyes module resolution a forked process-ben
- ✅ Azonnali hibakeresés részletes log-okkal
- ✅ CI/CD automatikus ellenőrzések (fail fast ha junction-ök maradnak)

**Naplófájl helye telepített alkalmazásban**:
```
Windows: C:\Users\[USERNAME]\AppData\Roaming\Mbit ERP\data\logs\app.log
macOS: ~/Library/Application Support/Mbit ERP/data/logs/app.log
Linux: ~/.config/Mbit ERP/data/logs/app.log
```

**Ha még mindig problémát tapasztalsz**:
1. Töröld az alkalmazást teljesen
2. Töröld a felhasználói adatmappát (fenti útvonal)
3. Telepítsd újra a legújabb verziót
4. Ha továbbra sem működik, küldd el az `app.log` fájlt a támogatásnak

---

### Build Error: `Cannot find module 'electron'`

```bash
cd apps/desktop
npm install
```

### Build Error: Prisma Client Not Generated

```bash
cd apps/server
npx prisma generate
```

### Build Error: Backend node_modules hiányzik

A packaging során az összes backend dependency-nek be kell ágyazódnia. Ha hiányzik:

```bash
cd apps/server
npm install
cd ../desktop
npm run build
npm run package:win
```

### Windows Build on Mac/Linux

```bash
# Docker-ben (opcionális)
docker run --rm -v $(pwd):/project electronuserland/builder:wine \
  bash -c "cd /project/apps/desktop && npm run package:win"
```

### Mac Build Code Signing

Mac build-nél ha nem signed, a felhasználóknak "right-click → Open" kell:

```bash
# Opcionális: Code signing
export CSC_LINK=path/to/certificate.p12
export CSC_KEY_PASSWORD=password
npm run package:mac
```

---

## 🚀 Automatikus Build (CI/CD)

### GitHub Actions

1. Push to `main` branch vagy tag létrehozása:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. GitHub Actions automatikusan build-eli mindkét platformot

3. Letöltés:
   - **Actions tab** → legutóbbi workflow → Artifacts
   - **Releases tab** → legutóbbi release (ha tag-gelted)

### Workflow Fájl

`.github/workflows/build-desktop.yml` - már konfigurálva van!

---

## 📋 Build Checklist Production Release-hez

- [ ] Verziószám frissítése: `apps/desktop/package.json`
- [ ] CHANGELOG.md frissítése
- [ ] Icon-ok ellenőrzése: `apps/desktop/resources/`
- [ ] Build tesztelése minden platformon
- [ ] Code signing (opcionális, de ajánlott)
- [ ] Installer tesztelése tiszta gépeken
- [ ] Release notes írása
- [ ] Git tag létrehozása: `v1.0.0`

---

## 🎨 Icon Cserélése

A generált placeholder icon cseréje saját logóra:

1. **PNG készítés** (1024x1024):
   ```bash
   # Másold ide
   cp /path/to/your-logo.png apps/desktop/resources/icon.png
   ```

2. **Windows ICO** (opcionális):
   ```bash
   # ImageMagick-kel
   convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
   ```

3. **Mac ICNS** (opcionális):
   ```bash
   # macOS-en
   mkdir icon.iconset
   sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
   # ... (további méretek)
   iconutil -c icns icon.iconset
   ```

**Tipp:** electron-builder automatikusan konvertál PNG-ből, ha nincs ICO/ICNS!

---

## 📊 Build Idők (becsült)

| Platform | Build idő | Méret |
|----------|-----------|-------|
| Windows NSIS | ~3-5 perc | ~150 MB |
| Mac DMG (x64) | ~4-6 perc | ~180 MB |
| Mac DMG (arm64) | ~4-6 perc | ~160 MB |
| Linux AppImage | ~3-5 perc | ~140 MB |

---

## 🔐 Biztonság

### Code Signing Előnyei

- ✅ Nincs "Unknown Developer" warning
- ✅ SmartScreen nem blokkol (Windows)
- ✅ Gatekeeper elfogadja (Mac)
- ✅ Felhasználói bizalom növelése

### Költségek

- **Windows Authenticode:** ~$100-300/év (DigiCert, Sectigo)
- **Apple Developer:** $99/év (developer.apple.com)

**Megjegyzés:** Kis/közép cégeknek először kipróbálható signing nélkül is!

---

## 📞 Támogatás

Problémák esetén:

1. Ellenőrizd a build log-okat
2. GitHub Issues: Készíts issue-t a repo-ban
3. Dokumentáció: `apps/desktop/README.md`
4. Kapcsolat: MB-IT Kft.

---

## ✅ Következő Lépések

1. [ ] Build Windows installer
2. [ ] Build Mac installer
3. [ ] Teszteld telepítést tiszta gépen
4. [ ] Ossza meg a csapattal tesztelésre
5. [ ] Gyűjts feedback-et
6. [ ] Kiadás production-be!

**Kész vagy?** Futtasd: `cd apps/desktop && npm run package:win` 🚀
