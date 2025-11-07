import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';

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
    });

    setTimeout(() => {
      console.log('[Backend] Started successfully');
      resolve();
    }, 5000);
  });
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: 'Mbit ERP',
    icon: path.join(__dirname, '..', 'resources', 'icon.png'),
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

  const isDev = !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5000');
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, '..', 'frontend', 'index.html');
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
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    console.log('[App] Stopping backend process...');
    backendProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

app.on('will-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
