import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { fork, ChildProcess } from 'child_process';
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

function getLogFilePath(): string {
  return path.join(getUserDataPath(), 'data', 'logs', 'app.log');
}

function writeLog(message: string): void {
  try {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    const logPath = getLogFilePath();
    fs.appendFileSync(logPath, logMessage, 'utf8');
  } catch (error) {
    console.error('[Log Error]', error);
  }
}

async function checkBackendHealth(): Promise<boolean> {
  const hostsToTry = ['127.0.0.1', 'localhost'];
  
  const checkHost = (hostname: string): Promise<{ success: boolean; host: string }> => {
    return new Promise((resolve) => {
      const options = {
        hostname,
        port: BACKEND_PORT,
        path: '/health',
        method: 'GET',
        timeout: 2000,
      };

      const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
          resolve({ success: true, host: hostname });
        } else {
          resolve({ success: false, host: hostname });
        }
      });

      req.on('error', () => {
        resolve({ success: false, host: hostname });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, host: hostname });
      });

      req.end();
    });
  };
  
  const results = await Promise.all(hostsToTry.map(checkHost));
  const successfulHost = results.find(r => r.success);
  
  if (successfulHost) {
    console.log(`[Health Check] Backend is ready on ${successfulHost.host} ✓`);
    writeLog(`[Health Check] Backend is ready on ${successfulHost.host}`);
    return true;
  }
  
  return false;
}

async function waitForBackend(maxRetries = 60, checkTimeoutMs = 2000): Promise<void> {
  const maxWaitSeconds = Math.ceil((maxRetries * checkTimeoutMs) / 1000);
  console.log(`[Backend] Waiting for backend to be ready (max ${maxWaitSeconds}s)...`);
  writeLog(`[Backend] Waiting for backend to be ready (max ${maxWaitSeconds}s)...`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const isHealthy = await checkBackendHealth();
    
    if (isHealthy) {
      const elapsed = Math.ceil((attempt * checkTimeoutMs) / 1000);
      const msg = `[Backend] ✓ Ready after ${attempt} attempt(s) (~${elapsed}s)`;
      console.log(msg);
      writeLog(msg);
      return;
    }
    
    if (attempt % 5 === 0) {
      const elapsed = Math.ceil((attempt * checkTimeoutMs) / 1000);
      const msg = `[Backend] Still waiting... (attempt ${attempt}/${maxRetries}, ${elapsed}s elapsed)`;
      console.log(msg);
      writeLog(msg);
    }
    
    await new Promise(resolve => setTimeout(resolve, checkTimeoutMs));
  }
  
  const errorMsg = `Backend failed to start after ${maxRetries} attempts (~${maxWaitSeconds}s)`;
  writeLog(`[Backend] ERROR: ${errorMsg}`);
  throw new Error(errorMsg);
}

function cleanupLegacyNodeModules(): void {
  if (app.isPackaged) {
    const backendNodeModules = path.join(process.resourcesPath, 'backend', 'node_modules');
    
    console.log('[Cleanup] Checking for legacy nested node_modules directories...');
    writeLog('[Cleanup] Checking for legacy nested node_modules directories...');
    
    if (!fs.existsSync(backendNodeModules)) {
      console.log('[Cleanup] Backend node_modules not found, skipping cleanup');
      writeLog('[Cleanup] Backend node_modules not found, skipping cleanup');
      return;
    }
    
    let cleanedCount = 0;
    
    const isDirectoryEmpty = (dirPath: string): boolean => {
      try {
        const entries = fs.readdirSync(dirPath);
        if (entries.length === 0) return true;
        
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry);
          const stats = fs.statSync(fullPath);
          
          if (stats.isFile()) return false;
          
          if (stats.isDirectory()) {
            if (!isDirectoryEmpty(fullPath)) return false;
          }
        }
        
        return true;
      } catch (err) {
        return false;
      }
    };
    
    const findAndCleanNestedNodeModules = (dir: string, depth: number = 0): void => {
      if (depth > 10) return;
      
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          if (!entry.isDirectory()) continue;
          
          const fullPath = path.join(dir, entry.name);
          
          if (entry.name === 'node_modules' && depth > 0) {
            if (isDirectoryEmpty(fullPath)) {
              try {
                console.log(`[Cleanup] Removing empty nested node_modules: ${fullPath}`);
                writeLog(`[Cleanup] Removing empty nested node_modules: ${fullPath}`);
                fs.rmSync(fullPath, { recursive: true, force: true });
                cleanedCount++;
              } catch (err) {
                console.warn(`[Cleanup] Failed to remove ${fullPath}:`, err);
                writeLog(`[Cleanup] Failed to remove ${fullPath}: ${err}`);
              }
            }
          } else {
            findAndCleanNestedNodeModules(fullPath, depth + 1);
          }
        }
      } catch (err) {
        console.warn(`[Cleanup] Failed to process ${dir}:`, err);
        writeLog(`[Cleanup] Failed to process ${dir}: ${err}`);
      }
    };
    
    findAndCleanNestedNodeModules(backendNodeModules);
    
    if (cleanedCount > 0) {
      console.log(`[Cleanup] ✓ Removed ${cleanedCount} legacy nested node_modules director${cleanedCount === 1 ? 'y' : 'ies'}`);
      writeLog(`[Cleanup] ✓ Removed ${cleanedCount} legacy nested node_modules director${cleanedCount === 1 ? 'y' : 'ies'}`);
    } else {
      console.log('[Cleanup] ✓ No legacy nested node_modules found');
      writeLog('[Cleanup] ✓ No legacy nested node_modules found');
    }
  }
}

async function startBackend(): Promise<void> {
  return new Promise((resolve, reject) => {
    const isDev = !app.isPackaged;
    const dataPath = getUserDataPath();
    
    const backendNodeModulesPath = isDev 
      ? path.join(__dirname, '..', '..', 'server', 'node_modules')
      : path.join(process.resourcesPath, 'backend', 'node_modules');
    
    // Ensure database directory exists before setting DATABASE_URL
    const dbDir = path.join(dataPath, 'data');
    const dbPath = path.join(dbDir, 'mbit-erp.db');
    
    // Normalize path for Prisma SQLite - use forward slashes even on Windows
    const normalizedDbPath = dbPath.replace(/\\/g, '/');
    // For Windows absolute paths, ensure proper format: file:/C:/path/to/db.db
    const databaseUrl = process.platform === 'win32' && normalizedDbPath.match(/^[A-Z]:/)
      ? `file:${normalizedDbPath}`
      : `file:${normalizedDbPath}`;
    
    const env = {
      ...process.env,
      PORT: String(BACKEND_PORT),
      DATA_DIR: dbDir,
      DATABASE_URL: databaseUrl,
      NODE_ENV: isDev ? 'development' : 'production',
      JWT_SECRET: process.env.JWT_SECRET || 'mbit-erp-default-secret-change-in-production',
      ELECTRON_RUN_AS_NODE: '1',
      NODE_PATH: backendNodeModulesPath,
    };

    if (isDev) {
      const { spawn } = require('child_process');
      backendProcess = spawn('npm', ['run', 'start:dev'], {
        cwd: path.join(__dirname, '..', '..', 'server'),
        env,
        shell: true,
      });
    } else {
      const backendPath = path.join(process.resourcesPath, 'backend', 'main.js');
      const backendDir = path.join(process.resourcesPath, 'backend');
      const nodeModulesPath = path.join(backendDir, 'node_modules');
      
      console.log('[Backend] Backend path:', backendPath);
      console.log('[Backend] Backend directory:', backendDir);
      console.log('[Backend] Node modules path:', nodeModulesPath);
      console.log('[Backend] Resources path:', process.resourcesPath);
      writeLog(`[Backend] Backend path: ${backendPath}`);
      writeLog(`[Backend] Backend directory: ${backendDir}`);
      writeLog(`[Backend] Node modules path: ${nodeModulesPath}`);
      writeLog(`[Backend] Resources path: ${process.resourcesPath}`);
      
      if (!fs.existsSync(backendPath)) {
        const errorMsg = `Backend file not found at: ${backendPath}`;
        console.error(`[Backend Error] ${errorMsg}`);
        writeLog(`[Backend Error] ${errorMsg}`);
        reject(new Error(errorMsg));
        return;
      }
      
      if (!fs.existsSync(nodeModulesPath)) {
        const errorMsg = `Backend node_modules not found at: ${nodeModulesPath}`;
        console.error(`[Backend Error] ${errorMsg}`);
        writeLog(`[Backend Error] ${errorMsg}`);
        reject(new Error(errorMsg));
        return;
      }
      
      const dotenvPath = path.join(nodeModulesPath, 'dotenv');
      if (!fs.existsSync(dotenvPath)) {
        const errorMsg = `Critical dependency 'dotenv' not found at: ${dotenvPath}`;
        console.error(`[Backend Error] ${errorMsg}`);
        writeLog(`[Backend Error] ${errorMsg}`);
        reject(new Error(errorMsg));
        return;
      }
      
      console.log('[Backend] Using Electron bundled Node.js runtime via fork()');
      console.log('[Backend] NODE_PATH set to:', env.NODE_PATH);
      writeLog('[Backend] Using Electron bundled Node.js runtime via fork()');
      writeLog(`[Backend] NODE_PATH set to: ${env.NODE_PATH}`);
      
      backendProcess = fork(backendPath, [], {
        cwd: backendDir,
        env,
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        execPath: process.execPath,
        execArgv: [],
      });
    }

    if (!backendProcess) {
      const errorMsg = 'Failed to create backend process';
      console.error(`[Backend Error] ${errorMsg}`);
      writeLog(`[Backend Error] ${errorMsg}`);
      reject(new Error(errorMsg));
      return;
    }

    backendProcess.stdout?.on('data', (data) => {
      const message = data.toString();
      console.log(`[Backend] ${message}`);
      writeLog(`[Backend] ${message}`);
    });

    backendProcess.stderr?.on('data', (data) => {
      const message = data.toString();
      console.error(`[Backend Error] ${message}`);
      writeLog(`[Backend Error] ${message}`);
    });

    backendProcess.on('error', (error) => {
      const errorMsg = `[Backend] Process error: ${error.message}`;
      console.error(errorMsg);
      writeLog(errorMsg);
      writeLog(`[Backend] Error stack: ${error.stack}`);
      reject(error);
    });

    backendProcess.on('exit', (code) => {
      const exitMsg = `[Backend] Process exited with code ${code}`;
      console.log(exitMsg);
      writeLog(exitMsg);
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
  writeLog('[App] Starting Mbit ERP Desktop...');
  writeLog(`[App] User Data Path: ${getUserDataPath()}`);
  writeLog(`[App] Platform: ${process.platform}`);
  writeLog(`[App] Electron version: ${process.versions.electron}`);
  writeLog(`[App] Node version: ${process.versions.node}`);
  writeLog(`[App] Packaged: ${app.isPackaged}`);
  
  ensureDataDirectories();
  
  cleanupLegacyNodeModules();
  
  try {
    console.log('[App] Starting backend server...');
    writeLog('[App] Starting backend server...');
    await startBackend();
    console.log('[App] Backend ready, creating window...');
    writeLog('[App] Backend ready, creating window...');
    createWindow();
  } catch (error) {
    console.error('[App] Failed to start backend:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Ismeretlen hiba';
    const logPath = getLogFilePath();
    
    writeLog(`[App] FATAL ERROR: Failed to start backend: ${errorMessage}`);
    if (error instanceof Error && error.stack) {
      writeLog(`[App] Error stack: ${error.stack}`);
    }
    
    await dialog.showMessageBox({
      type: 'error',
      title: 'Backend Indítási Hiba',
      message: 'Az alkalmazás backend szervert nem sikerült elindítani.',
      detail: `Hiba: ${errorMessage}\n\nA részletes naplófájl helye:\n${logPath}\n\nKérjük, küldje el ezt a fájlt a támogatásnak, vagy próbálja újra az alkalmazást indítani.`,
      buttons: ['Naplófájl Megnyitása', 'Bezárás']
    }).then((result) => {
      if (result.response === 0) {
        require('electron').shell.showItemInFolder(logPath);
      }
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
