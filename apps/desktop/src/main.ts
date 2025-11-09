import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as url from 'url';
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

// Health check interval for backend process monitoring
let backendHealthCheckInterval: NodeJS.Timeout | null = null;

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

    // Log environment setup (without sensitive data)
    console.log('[Backend] Environment configuration:');
    console.log(`[Backend]   - PORT: ${env.PORT}`);
    console.log(`[Backend]   - DATA_DIR: ${env.DATA_DIR}`);
    console.log(`[Backend]   - DATABASE_URL: file:***${path.basename(dbPath)}`);
    console.log(`[Backend]   - NODE_ENV: ${env.NODE_ENV}`);
    console.log(`[Backend]   - ELECTRON_RUN_AS_NODE: ${env.ELECTRON_RUN_AS_NODE}`);
    console.log(`[Backend]   - NODE_PATH: ${env.NODE_PATH}`);
    writeLog(`[Backend] Environment: PORT=${env.PORT}, DATA_DIR=${env.DATA_DIR}, DATABASE_URL=file:***${path.basename(dbPath)}`);

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
      
      // Verify Prisma client exists
      const prismaClientPath = path.join(nodeModulesPath, '@prisma', 'client');
      if (!fs.existsSync(prismaClientPath)) {
        const errorMsg = `Prisma client not found at: ${prismaClientPath}. Run 'npx prisma generate' during build.`;
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

    // Monitor backend process health periodically
    if (backendProcess) {
      // Clear any existing health check
      if (backendHealthCheckInterval) {
        clearInterval(backendHealthCheckInterval);
      }
      
      backendHealthCheckInterval = setInterval(() => {
        if (backendProcess && !backendProcess.killed) {
          // Check if process is still alive by checking if it responds to signal 0
          try {
            process.kill(backendProcess.pid!, 0); // Signal 0 just checks if process exists
            console.log(`[Backend] Health check: PID ${backendProcess.pid} is alive`);
            writeLog(`[Backend] Health check: PID ${backendProcess.pid} is alive`);
          } catch (err) {
            console.warn(`[Backend] Health check failed: PID ${backendProcess.pid} may be dead`);
            writeLog(`[Backend] Health check failed: PID ${backendProcess.pid} may be dead`);
            if (backendHealthCheckInterval) {
              clearInterval(backendHealthCheckInterval);
              backendHealthCheckInterval = null;
            }
          }
        } else {
          if (backendHealthCheckInterval) {
            clearInterval(backendHealthCheckInterval);
            backendHealthCheckInterval = null;
          }
        }
      }, 10000); // Check every 10 seconds
    }

    backendProcess.on('error', (error) => {
      const errorMsg = `[Backend] Process error: ${error.message}`;
      console.error(errorMsg);
      writeLog(errorMsg);
      writeLog(`[Backend] Error stack: ${error.stack}`);
      reject(error);
    });

    // Track if backend has started successfully
    let backendStarted = false;

    backendProcess.on('exit', (code, signal) => {
      // Clear health check interval
      if (backendHealthCheckInterval) {
        clearInterval(backendHealthCheckInterval);
        backendHealthCheckInterval = null;
      }
      
      const exitMsg = `[Backend] Process exited with code ${code}, signal ${signal}`;
      console.log(exitMsg);
      writeLog(exitMsg);
      writeLog(`[Backend] Exit details: code=${code}, signal=${signal}, pid=${backendProcess?.pid}`);
      
      // If backend hasn't started yet and exits, it's a failure
      if (!backendStarted) {
        const errorMsg = code === null 
          ? 'Backend process crashed or was killed during startup. Check logs for details.'
          : `Backend process exited with code ${code} during startup. Check logs for details.`;
        console.error(`[Backend Error] ${errorMsg}`);
        writeLog(`[Backend Error] ${errorMsg}`);
        // Only reject if we haven't already resolved/rejected
        if (!backendStarted) {
          reject(new Error(errorMsg));
        }
      } else {
        // Backend was running but exited - this is unexpected!
        const errorMsg = signal === 'SIGTERM'
          ? 'Backend process was terminated unexpectedly. It may have crashed or been killed by the system.'
          : `Backend process exited unexpectedly with code ${code}, signal ${signal}`;
        console.error(`[Backend Error] ${errorMsg}`);
        writeLog(`[Backend Error] ${errorMsg}`);
        
        // Try to restart the backend if it was running
        if (mainWindow && !mainWindow.isDestroyed()) {
          console.log('[Backend] Attempting to restart backend...');
          writeLog('[Backend] Attempting to restart backend...');
          startBackend().catch((restartError) => {
            console.error('[Backend] Failed to restart:', restartError);
            writeLog(`[Backend] Failed to restart: ${restartError.message}`);
          });
        }
      }
    });

    // Wait for backend to be healthy instead of fixed delay
    waitForBackend()
      .then(() => {
        backendStarted = true;
        console.log('[Backend] Started successfully');
        writeLog('[Backend] Started successfully - health check passed');
        resolve();
      })
      .catch((error) => {
        console.error('[Backend] Failed to become ready:', error);
        writeLog(`[Backend] Failed to become ready: ${error.message}`);
        reject(error);
      });
  });
}

function createWindow(): void {
  const isDev = !app.isPackaged;
  
  // Use .ico for Windows, .png for other platforms
  // Try to find icon, but don't fail if it doesn't exist
  let iconPath: string | undefined;
  try {
    if (isDev) {
      iconPath = process.platform === 'win32' 
        ? path.join(__dirname, '..', 'resources', 'icon.ico')
        : path.join(__dirname, '..', 'resources', 'icon.png');
    } else {
      iconPath = process.platform === 'win32'
        ? path.join(process.resourcesPath, 'icon.ico')
        : path.join(process.resourcesPath, 'icon.png');
    }
    
    // Check if icon file exists
    if (!fs.existsSync(iconPath)) {
      console.warn(`[Window] Icon not found at ${iconPath}, using default`);
      writeLog(`[Window] Icon not found at ${iconPath}, using default`);
      iconPath = undefined;
    }
  } catch (error) {
    console.warn('[Window] Error checking icon path:', error);
    iconPath = undefined;
  }

  console.log('[Window] Creating BrowserWindow...');
  writeLog('[Window] Creating BrowserWindow...');
  
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
    show: true, // Show immediately
  });

  console.log('[Window] BrowserWindow created, showing...');
  writeLog('[Window] BrowserWindow created, showing...');
  
  // Show window immediately
  mainWindow.show();
  mainWindow.focus();
  
  // Also handle ready-to-show for better UX
  mainWindow.once('ready-to-show', () => {
    console.log('[Window] Window ready-to-show event fired');
    writeLog('[Window] Window ready-to-show event fired');
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
  
  // Handle window errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('[Window] Failed to load:', errorCode, errorDescription, validatedURL);
    writeLog(`[Window] Failed to load: ${errorCode} - ${errorDescription} - ${validatedURL}`);
  });
  
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[Window] Window finished loading');
    writeLog('[Window] Window finished loading');
  });
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5000');
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(process.resourcesPath, 'frontend', 'index.html');
    console.log('[Window] Loading frontend from:', indexPath);
    writeLog(`[Window] Loading frontend from: ${indexPath}`);
    
    // Check if index.html exists
    if (!fs.existsSync(indexPath)) {
      const errorMsg = `Frontend index.html not found at: ${indexPath}`;
      console.error(`[Window] ${errorMsg}`);
      writeLog(`[Window] ${errorMsg}`);
      
      mainWindow.webContents.once('did-finish-load', () => {
        mainWindow?.webContents.executeJavaScript(`
          document.body.innerHTML = '<div style="padding: 20px; font-family: Arial; text-align: center;">
            <h1>Hiba</h1>
            <p>Az alkalmazás frontend fájlja nem található.</p>
            <p>Útvonal: ${indexPath}</p>
          </div>';
        `);
      });
    }
    
    // Handle UNC paths properly - convert to file:// URL format
    try {
      let fileUrl: string;
      
      // Check if path is UNC (starts with \\)
      if (indexPath.startsWith('\\\\')) {
        // UNC path: convert \\server\share\path to file://server/share/path
        // Remove leading \\ and replace \ with /
        const uncPath = indexPath.replace(/^\\\\/, '').replace(/\\/g, '/');
        fileUrl = `file:///${uncPath}`;
      } else {
        // Regular path: use pathToFileURL
        fileUrl = url.pathToFileURL(indexPath).href;
      }
      
      console.log('[Window] Loading from URL:', fileUrl);
      writeLog(`[Window] Loading from URL: ${fileUrl}`);
      
      mainWindow.loadURL(fileUrl).catch((error) => {
        console.error('[Window] Error loading URL:', error);
        writeLog(`[Window] Error loading URL: ${error.message}`);
        
        // Fallback 1: Try with loadFile (handles UNC paths better in some Electron versions)
        console.log('[Window] Trying fallback: loadFile');
        writeLog('[Window] Trying fallback: loadFile');
        mainWindow.loadFile(indexPath).catch((loadFileError) => {
          console.error('[Window] loadFile also failed:', loadFileError);
          writeLog(`[Window] loadFile also failed: ${loadFileError.message}`);
          
          // Fallback 2: Show error message in window
          mainWindow?.webContents.once('did-finish-load', () => {
            mainWindow?.webContents.executeJavaScript(`
              document.body.innerHTML = '<div style="padding: 40px; font-family: Arial; text-align: center; background: #f0f0f0;">
                <h1 style="color: #d32f2f;">Hiba történt</h1>
                <p style="font-size: 16px; margin: 20px 0;">Az alkalmazás frontend fájlja nem tölthető be.</p>
                <p style="font-size: 14px; color: #666; margin: 10px 0;">Útvonal: ${indexPath}</p>
                <p style="font-size: 12px; color: #999; margin-top: 30px;">Kérjük, másolja az alkalmazást helyi mappába és futtassa onnan.</p>
              </div>';
            `);
          });
          // Load empty page first
          mainWindow.loadURL('data:text/html,<html><body></body></html>');
        });
      });
    } catch (urlError) {
      console.error('[Window] Error creating file URL:', urlError);
      writeLog(`[Window] Error creating file URL: ${urlError}`);
      // Final fallback: try loadFile directly
      mainWindow.loadFile(indexPath).catch((error) => {
        console.error('[Window] Error loading file:', error);
        writeLog(`[Window] Error loading file: ${error.message}`);
      });
    }
  }

  mainWindow.on('closed', () => {
    console.log('[Window] Window closed event fired');
    writeLog('[Window] Window closed event fired');
    mainWindow = null;
  });

  mainWindow.on('close', (event) => {
    console.log('[Window] Window close event fired');
    writeLog('[Window] Window close event fired');
  });
  
  console.log('[Window] Window setup complete');
  writeLog('[Window] Window setup complete');
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
  
  // Create window immediately - don't wait for backend
  console.log('[App] Creating window immediately...');
  writeLog('[App] Creating window immediately...');
  createWindow();
  
  // Start backend in background - don't block window creation
  console.log('[App] Starting backend server in background...');
  writeLog('[App] Starting backend server in background...');
  
  startBackend()
    .then(() => {
      console.log('[App] Backend started successfully');
      writeLog('[App] Backend started successfully');
      
      // Reload window once backend is ready
      if (mainWindow && !mainWindow.isDestroyed()) {
        console.log('[App] Reloading window now that backend is ready...');
        writeLog('[App] Reloading window now that backend is ready...');
        mainWindow.reload();
      }
    })
    .catch((error) => {
      console.error('[App] Failed to start backend:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ismeretlen hiba';
      writeLog(`[App] ERROR: Failed to start backend: ${errorMessage}`);
      if (error instanceof Error && error.stack) {
        writeLog(`[App] Error stack: ${error.stack}`);
      }
      
      // Show error dialog but don't quit - let user see the window
      if (mainWindow && !mainWindow.isDestroyed()) {
        dialog.showMessageBox(mainWindow, {
          type: 'error',
          title: 'Backend Indítási Hiba',
          message: 'Az alkalmazás backend szervert nem sikerült elindítani.',
          detail: `Hiba: ${errorMessage}\n\nAz alkalmazás továbbra is működik, de előfordulhat, hogy egyes funkciók nem érhetők el.\n\nKérjük, indítsa újra az alkalmazást.`,
          buttons: ['Rendben']
        }).catch(() => {});
      }
    });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

function stopBackend(): void {
  if (backendProcess && !backendProcess.killed) {
    console.log('[App] Stopping backend process gracefully...');
    writeLog('[App] Stopping backend process gracefully...');
    writeLog(`[App] Backend process PID: ${backendProcess.pid}`);
    
    // Send SIGTERM for graceful shutdown
    backendProcess.kill('SIGTERM');
    
    // Force kill after 5 seconds if still running
    setTimeout(() => {
      if (backendProcess && !backendProcess.killed) {
        console.log('[App] Forcing backend process termination...');
        writeLog('[App] Forcing backend process termination...');
        backendProcess.kill('SIGKILL');
      }
    }, 5000);
  } else {
    console.log('[App] stopBackend called but backendProcess is null or already killed');
    writeLog('[App] stopBackend called but backendProcess is null or already killed');
  }
}

app.on('window-all-closed', () => {
  console.log('[App] window-all-closed event fired');
  writeLog('[App] window-all-closed event fired');
  stopBackend();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', (event) => {
  console.log('[App] before-quit event fired');
  writeLog('[App] before-quit event fired');
  if (backendProcess && !backendProcess.killed) {
    event.preventDefault();
    stopBackend();
    
    // Wait a bit for graceful shutdown, then quit
    setTimeout(() => {
      app.exit(0);
    }, 1000);
  }
});
