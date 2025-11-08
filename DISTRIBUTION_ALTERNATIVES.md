# Mbit ERP - Alternatív Telepítési Módszerek

## Áttekintés

Ez a dokumentum bemutatja a különböző módszereket, amelyekkel az Mbit ERP desktop alkalmazást terjesztheted felhasználóidnak, **a komplex CI/CD folyamat használata nélkül**.

---

## 📦 **1. LEHETŐSÉG: ZIP Distribúció (AJÁNLOTT - LEGEGYSZERŰBB)**

### **Mi ez?**
A legegyszerűbb és legmegbízhatóbb módszer: helyben build-eled az alkalmazást, majd ZIP-ben terjeszted a `win-unpacked` mappát.

### **Előnyök:**
- ✅ **Nincs CI/CD dependency** - lokálisan build-elhető
- ✅ **Nincs installer** - csak kicsomagolás és futtatás
- ✅ **Portable** - bárhova másolható
- ✅ **Gyors telepítés** - nincs adminisztrátori jog szükséges
- ✅ **Teljes kontroll** - látod mi van a package-ben

### **Hátrányok:**
- ❌ Nincs Windows Registry integráció
- ❌ Nincs Start Menu shortcut (kézzel kell létrehozni)
- ❌ Nincs automatikus update
- ❌ Nagyobb fájl méret (200-300 MB)

### **Lépések:**

#### **1. Lokális Build (Windows gépen):**

```powershell
# 1. Server build
cd apps/server
npm run build
npx prisma generate

# 2. KRITIKUS: Dependencies valódi fájlként (nem junction!)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install --omit=dev --install-strategy=nested --install-links=false --workspaces=false

# 3. Ellenőrzés (FONTOS!)
$dotenvAttrs = (Get-Item "node_modules/dotenv").Attributes
if ($dotenvAttrs -match 'ReparsePoint') {
    Write-Host "HIBA: Még mindig junction!"
    exit 1
}
Write-Host "OK: Valódi fájlok"

# 4. Desktop packaging
cd ../desktop
npm run build
npm run package:win
```

#### **2. Találd meg a `win-unpacked` mappát:**

```
apps/desktop/release/win-unpacked/
├── Mbit ERP.exe          ← EZ az indító fájl
├── resources/
│   ├── app.asar
│   └── backend/
│       ├── main.js
│       ├── node_modules/  ← TELJES dependency tree
│       └── prisma/
├── locales/
└── ... (egyéb Electron fájlok)
```

#### **3. Csomagolás és terjesztés:**

```powershell
# ZIP létrehozása
cd apps/desktop/release
Compress-Archive -Path win-unpacked -DestinationPath "MbitERP-v1.0.3-Portable.zip"
```

#### **4. Felhasználó számára:**

1. Csomagold ki a ZIP-et bárhová (pl. `C:\MbitERP\`)
2. Futtasd a `Mbit ERP.exe` fájlt
3. Opcionális: Hozz létre shortcut-ot az asztalra

---

## 🗂️ **2. LEHETŐSÉG: Repo Distribúció + Starter Script**

### **Mi ez?**
A teljes repository terjesztése egy indító script-tel, ami telepíti a dependencies-eket és elindítja az alkalmazást.

### **Előnyök:**
- ✅ **Forráskód hozzáférés** - felhasználók láthatják/módosíthatják a kódot
- ✅ **Nincs packaging** - közvetlenül fejlesztői módban fut
- ✅ **Egyszerű frissítés** - git pull

### **Hátrányok:**
- ❌ **Node.js + npm szükséges** minden felhasználónál
- ❌ **Lassú első indítás** - npm install időigényes
- ❌ **Kevésbé professzionális**
- ❌ **Komplex hibakeresés** felhasználói oldalon
- ❌ **Biztonsági kockázat** - felhasználók látják a kódot

### **NEM AJÁNLOTT vállalati környezetben!**

#### **Ha mégis használnád:**

**`start-mbit-erp.bat` létrehozása (repo root):**

```batch
@echo off
echo ================================================
echo Mbit ERP Telepito es Indito
echo ================================================
echo.

REM Ellenorzi Node.js telepitese
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo HIBA: Node.js nincs telepitve!
    echo Tolts le innen: https://nodejs.org
    pause
    exit /b 1
)

echo [1/5] Dependencies telepitese (ez eltarthat egy ideig)...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo HIBA: npm install sikertelen!
    pause
    exit /b 1
)

echo.
echo [2/5] Server build...
cd apps\server
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo HIBA: Server build sikertelen!
    pause
    exit /b 1
)

echo.
echo [3/5] Prisma client generálas...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo HIBA: Prisma generate sikertelen!
    pause
    exit /b 1
)

echo.
echo [4/5] Desktop app build...
cd ..\desktop
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo HIBA: Desktop build sikertelen!
    pause
    exit /b 1
)

echo.
echo [5/5] Alkalmazas inditasa...
call npm start

pause
```

**Felhasználó számára:**
1. Csomagold ki a ZIP-et
2. Dupla klikk a `start-mbit-erp.bat` fájlra
3. Várj 5-10 percet első indításkor (npm install)

---

## ⚙️ **3. LEHETŐSÉG: Konfigurálható Útvonalak**

### **Mi ez?**
Az alkalmazás már most is a felhasználó adatkönyvtárába ment, de létrehozhatsz UI-t, ahol a felhasználók testreszabhatják az útvonalakat.

### **Jelenleg:**
```
Windows: C:\Users\[USERNAME]\AppData\Roaming\@mbit-erp\desktop\
  ├── data\
  │   ├── mbit-erp.db          (SQLite adatbázis)
  │   ├── uploads\             (feltöltött dokumentumok)
  │   ├── backups\             (mentések)
  │   └── logs\                (naplófájlok)
```

### **Implementálás (Beállítások UI):**

#### **1. Új Settings Tab: "Tárolási Helyek"**

```tsx
// apps/web/src/pages/Settings.tsx (új tab)

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function StorageSettings() {
  const { user } = useAuth();
  const [paths, setPaths] = useState({
    database: '',
    uploads: '',
    backups: '',
    logs: ''
  });

  // Betöltés Electron store-ból
  useEffect(() => {
    if (window.electron) {
      window.electron.getStoragePaths().then(setPaths);
    }
  }, []);

  const handleBrowse = async (type: string) => {
    if (window.electron) {
      const newPath = await window.electron.selectFolder();
      if (newPath) {
        setPaths(prev => ({ ...prev, [type]: newPath }));
      }
    }
  };

  const handleSave = async () => {
    if (window.electron) {
      await window.electron.setStoragePaths(paths);
      // Újraindítás szükséges
      alert('Beállítások mentve! Indítsd újra az alkalmazást.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tárolási Helyek</h2>
      
      {['database', 'uploads', 'backups', 'logs'].map(type => (
        <div key={type} className="flex gap-4">
          <input
            type="text"
            value={paths[type]}
            readOnly
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={() => handleBrowse(type)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Tallózás
          </button>
        </div>
      ))}

      <button
        onClick={handleSave}
        className="px-6 py-2 bg-green-600 text-white rounded"
      >
        Mentés
      </button>
    </div>
  );
}
```

#### **2. Electron Preload API:**

```typescript
// apps/desktop/src/preload.ts

import { contextBridge, ipcRenderer } from 'electron';
import { dialog } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getStoragePaths: () => ipcRenderer.invoke('get-storage-paths'),
  setStoragePaths: (paths) => ipcRenderer.invoke('set-storage-paths', paths),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
});
```

#### **3. Main Process Handler:**

```typescript
// apps/desktop/src/main.ts

import Store from 'electron-store';

const store = new Store();

ipcMain.handle('get-storage-paths', () => {
  return {
    database: store.get('paths.database', app.getPath('userData')),
    uploads: store.get('paths.uploads', path.join(app.getPath('userData'), 'uploads')),
    backups: store.get('paths.backups', path.join(app.getPath('userData'), 'backups')),
    logs: store.get('paths.logs', path.join(app.getPath('userData'), 'logs')),
  };
});

ipcMain.handle('set-storage-paths', (_, paths) => {
  store.set('paths', paths);
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  });
  return result.filePaths[0];
});
```

---

## 📊 **Összehasonlítás**

| Módszer | Egyszerűség | Professzionalizmus | Node.js Szükséges? | Ajánlott? |
|---------|-------------|--------------------|--------------------|-----------|
| **ZIP Distribúció** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ Nem | ✅ **IGEN** |
| **CI/CD + Installer** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ Nem | ⚠️ Ha működik |
| **Repo + Script** | ⭐⭐⭐ | ⭐⭐ | ✅ Igen | ❌ NEM |
| **Konfigurálható Paths** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | N/A | ✅ Kiegészítő |

---

## 🚀 **AJÁNLÁS**

### **Rövid távon (azonnal):**
1. ✅ **ZIP Distribúció** használata
2. ✅ Helyi build Windows gépen
3. ✅ Manual shortcut creation dokumentáció

### **Közép távon:**
1. ⚡ CI/CD javítás `--install-links=false` flag-gel
2. ⚡ Konfigurálható paths UI implementáció
3. ⚡ NSIS installer ha CI működik

### **Hosszú távon:**
1. 🔮 Auto-update mechanizmus
2. 🔮 Code signing (Windows Defender warning elkerülése)
3. 🔮 Microsoft Store distribution

---

## 📝 **Következő Lépések**

1. **Válassz egy módszert** (ajánlott: ZIP distribúció)
2. **Teszteld helyben** Windows 11 gépen
3. **Dokumentáld** a felhasználók számára
4. **Terjesszd** (email, fájlmegosztó, stb.)

---

**Kérdések?** Nézd meg a BUILD_DESKTOP.md fájlt részletes build utasításokért.
