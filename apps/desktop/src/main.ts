import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as http from 'http';

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;
const BACKEND_PORT = 3000;

function getUserDataPath(): string {
  return app.getPath('userData');
}

function ensureDataDirectories(): void {
  const dataPath = getUserDataPath();
  const directories = [
    path.join(dataPath, 'data'),
    path.join(dataPath, 'data', 'uploads'),
    path.join(dataPath, 'data', 'backups'),
    path.join(dataPath, 'data', 'logs'),
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

async function checkBackendHealth(): Promise<boolean> {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: BACKEND_PORT,
      path: '/health',
      method: 'GET',
      timeout: 2000,
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('[Health Check] Backend is ready ✓');
        resolve(true);
      } else {
        console.log(`[Health Check] Backend returned status ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', () => {
      // Silent fail - backend not ready yet
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function waitForBackend(maxRetries = 30, intervalMs = 1000): Promise<void> {
  console.log('[Backend] Waiting for backend to be ready...');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const isHealthy = await checkBackendHealth();
    
    if (isHealthy) {
      console.log(`[Backend] ✓ Ready after ${attempt} attempt(s) (~${attempt}s)`);
      return;
    }
    
    // Log progress every 5 attempts to avoid spam
    if (attempt % 5 === 0) {
      console.log(`[Backend] Still waiting... (attempt ${attempt}/${maxRetries})`);
    }
    
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
  
  throw new Error(`Backend failed to start after ${maxRetries} attempts (~${maxRetries}s)`);
}

async function startBackend(): Promise<void> {
  return new Promise((resolve, reject) => {
    const isDev = !app.isPackaged;
    const dataPath = getUserDataPath();
    
    const env = {
      ...process.env,
      PORT: String(BACKEND_PORT),
      DATA_DIR: path.join(dataPath, 'data'),
      DATABASE_URL: `file:${path.join(dataPath, 'data', 'mbit-erp.db')}`,
      NODE_ENV: isDev ? 'development' : 'production',
      JWT_SECRET: process.env.JWT_SECRET || 'mbit-erp-default-secret-change-in-production',
    };

    if (isDev) {
      backendProcess = spawn('npm', ['run', 'start:dev'], {
        cwd: path.join(__dirname, '..', '..', 'server'),
        env,
        shell: true,
      });
    } else {
      const backendPath = path.join(process.resourcesPath, 'backend', 'main.js');
      backendProcess = spawn('node', [backendPath], {
        env,
        shell: false,
      });
    }

    backendProcess.stdout?.on('data', (data) => {
      console.log(`[Backend] ${data.toString()}`);
    });

    backendProcess.stderr?.on('data', (data) => {
      console.error(`[Backend Error] ${data.toString()}`);
    });

    backendProcess.on('error', (error) => {
      console.error('[Backend] Process error:', error);
      reject(error);
    });

    backendProcess.on('exit', (code) => {
      console.log(`[Backend] Process exited with code ${code}`);
      if (code !== 0 && code !== null) {
        reject(new Error(`Backend process exited with code ${code}`));
      }
    });

    // Wait for backend to be healthy instead of fixed delay
    waitForBackend()
      .then(() => {
        console.log('[Backend] Started successfully');
        resolve();
      })
      .catch((error) => {
        console.error('[Backend] Failed to become ready:', error);
        reject(error);
      });
  });
}

function createWindow(): void {
  const isDev = !app.isPackaged;
  
  const iconPath = isDev
    ? path.join(__dirname, '..', 'resources', 'icon.png')
    : path.join(process.resourcesPath, 'icon.png');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: 'Mbit ERP',
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
    autoHideMenuBar: true,
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5000');
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(process.resourcesPath, 'frontend', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.handle('get-user-data-path', () => {
  return getUserDataPath();
});

ipcMain.handle('get-backend-url', () => {
  return `http://localhost:${BACKEND_PORT}`;
});

app.whenReady().then(async () => {
  console.log('[App] Starting Mbit ERP Desktop...');
  console.log('[App] User Data Path:', getUserDataPath());
  
  ensureDataDirectories();
  
  try {
    console.log('[App] Starting backend server...');
    await startBackend();
    console.log('[App] Backend ready, creating window...');
    createWindow();
  } catch (error) {
    console.error('[App] Failed to start backend:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Ismeretlen hiba';
    
    await dialog.showMessageBox({
      type: 'error',
      title: 'Backend Indítási Hiba',
      message: 'Az alkalmazás backend szervert nem sikerült elindítani.',
      detail: `Hiba: ${errorMessage}\n\nKérem ellenőrizze a naplófájlokat vagy próbálja újra az alkalmazást indítani.`,
      buttons: ['Bezárás']
    });
    
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

function stopBackend(): void {
  if (backendProcess && !backendProcess.killed) {
    console.log('[App] Stopping backend process gracefully...');
    
    // Send SIGTERM for graceful shutdown
    backendProcess.kill('SIGTERM');
    
    // Force kill after 5 seconds if still running
    setTimeout(() => {
      if (backendProcess && !backendProcess.killed) {
        console.log('[App] Forcing backend process termination...');
        backendProcess.kill('SIGKILL');
      }
    }, 5000);
  }
}

app.on('window-all-closed', () => {
  stopBackend();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', (event) => {
  if (backendProcess && !backendProcess.killed) {
    event.preventDefault();
    stopBackend();
    
    // Wait a bit for graceful shutdown, then quit
    setTimeout(() => {
      app.exit(0);
    }, 1000);
  }
});
