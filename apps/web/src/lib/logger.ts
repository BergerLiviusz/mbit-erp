/**
 * Logger utility for Electron desktop app
 * Writes logs to file in %appdata%/roaming/@mbit-erp/data/logs/app.log
 * Falls back to console.log in browser environment
 */

const isElectron = !!(window as any).electron || (navigator.userAgent.includes('Electron'));

export function writeLog(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
  // Always log to console for immediate debugging
  const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  consoleMethod(message);

  // In Electron, also write to log file
  if (isElectron && (window as any).electron?.writeLog) {
    try {
      (window as any).electron.writeLog(message, level).catch((err: any) => {
        console.error('[Logger] Failed to write to log file:', err);
      });
    } catch (error) {
      console.error('[Logger] Error calling writeLog:', error);
    }
  }
}

export function logInfo(message: string): void {
  writeLog(message, 'info');
}

export function logWarn(message: string): void {
  writeLog(message, 'warn');
}

export function logError(message: string): void {
  writeLog(message, 'error');
}

