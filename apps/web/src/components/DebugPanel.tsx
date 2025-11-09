import { useEffect, useState } from 'react';

interface LogEntry {
  timestamp: string;
  type: 'info' | 'error' | 'warning' | 'success';
  message: string;
  details?: any;
}

const isElectron = !!(window as any).electron || (navigator.userAgent.includes('Electron'));

// Global log store
const logs: LogEntry[] = [];
const listeners: Array<() => void> = [];

export function addLog(type: LogEntry['type'], message: string, details?: any) {
  if (!isElectron) return; // Only log in Electron mode
  
  const entry: LogEntry = {
    timestamp: new Date().toLocaleTimeString(),
    type,
    message,
    details,
  };
  
  logs.push(entry);
  
  // Keep only last 50 logs
  if (logs.length > 50) {
    logs.shift();
  }
  
  // Notify listeners
  listeners.forEach(listener => listener());
  
  // Also log to console
  console.log(`[DebugPanel] ${type.toUpperCase()}:`, message, details || '');
}

export function getLogs(): LogEntry[] {
  return [...logs];
}

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  
  useEffect(() => {
    if (!isElectron) return;
    
    const updateLogs = () => {
      setLogEntries(getLogs());
    };
    
    listeners.push(updateLogs);
    updateLogs();
    
    // Poll for updates every 500ms
    const interval = setInterval(updateLogs, 500);
    
    return () => {
      const index = listeners.indexOf(updateLogs);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      clearInterval(interval);
    };
  }, []);
  
  if (!isElectron) return null;
  
  const errorCount = logEntries.filter(l => l.type === 'error').length;
  const warningCount = logEntries.filter(l => l.type === 'warning').length;
  
  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 flex items-center gap-2"
        style={{ zIndex: 9999 }}
      >
        <span>🐛 Debug</span>
        {errorCount > 0 && (
          <span className="bg-white text-red-600 rounded-full px-2 py-0.5 text-xs font-bold">
            {errorCount}
          </span>
        )}
        {warningCount > 0 && errorCount === 0 && (
          <span className="bg-yellow-400 text-yellow-900 rounded-full px-2 py-0.5 text-xs font-bold">
            {warningCount}
          </span>
        )}
      </button>
      
      {/* Debug panel */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 w-96 h-96 bg-white border-2 border-gray-400 rounded-lg shadow-2xl z-50 flex flex-col"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between rounded-t-lg">
            <h3 className="font-bold">Debug Panel</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 text-xs font-mono">
            {logEntries.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No logs yet...</div>
            ) : (
              logEntries.map((entry, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded border-l-4 ${
                    entry.type === 'error'
                      ? 'bg-red-50 border-red-500'
                      : entry.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-500'
                      : entry.type === 'success'
                      ? 'bg-green-50 border-green-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-gray-700">{entry.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      entry.type === 'error'
                        ? 'bg-red-200 text-red-800'
                        : entry.type === 'warning'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {entry.type}
                    </span>
                  </div>
                  <div className="mt-1 text-gray-800">{entry.message}</div>
                  {entry.details && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-gray-600">Details</summary>
                      <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(entry.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="bg-gray-100 px-4 py-2 border-t border-gray-300 rounded-b-lg flex items-center justify-between text-xs">
            <span>Total: {logEntries.length}</span>
            <button
              onClick={() => {
                logs.length = 0;
                setLogEntries([]);
              }}
              className="text-red-600 hover:text-red-800"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </>
  );
}

