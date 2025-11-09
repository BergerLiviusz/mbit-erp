/**
 * API URL helper for Electron and web modes
 * In Electron: uses http://localhost:3000 (backend runs locally)
 * In web: uses /api (proxied through Vite dev server)
 */
const isElectron = !!(window as any).electron || (navigator.userAgent.includes('Electron'));

export const API_URL = isElectron ? 'http://localhost:3000' : (import.meta.env.VITE_API_URL || '/api');

// Import debug panel for logging
let addLog: ((type: 'info' | 'error' | 'warning' | 'success', message: string, details?: any) => void) | null = null;
if (isElectron) {
  // Dynamic import to avoid circular dependencies
  import('../components/DebugPanel').then(module => {
    addLog = module.addLog;
  }).catch(() => {
    // DebugPanel not available, use console only
  });
}

/**
 * Fetch wrapper that handles Electron mode automatically
 * Strips /api prefix in Electron mode since backend doesn't use it
 */
export async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  let finalUrl = url;
  
  // In Electron mode, strip /api prefix if present
  if (isElectron && url.startsWith('/api/')) {
    finalUrl = url.replace('/api/', '/');
  } else if (isElectron && url.startsWith('/api')) {
    finalUrl = url.replace('/api', '');
  }
  
  // If URL doesn't start with http, prepend API_URL
  if (!finalUrl.startsWith('http')) {
    finalUrl = `${API_URL}${finalUrl.startsWith('/') ? '' : '/'}${finalUrl}`;
  }
  
  // Add Authorization header if token exists (for Electron mode)
  const headers = new Headers(options?.headers);
  if (isElectron) {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  
  // Enhanced logging for debugging
  if (isElectron) {
    const logData = {
      originalUrl: url,
      finalUrl,
      method: options?.method || 'GET',
      isElectron,
    };
    console.log('[apiFetch] Request:', logData);
    if (addLog) {
      addLog('info', `API Request: ${options?.method || 'GET'} ${url}`, logData);
    }
  }
  
  try {
    const response = await fetch(finalUrl, {
      ...options,
      headers,
    });
    
    if (isElectron) {
      const responseData = {
        url: finalUrl,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      };
      console.log('[apiFetch] Response:', responseData);
      
      if (response.ok && addLog) {
        addLog('success', `API Success: ${response.status} ${url}`, responseData);
      } else if (!response.ok && addLog) {
        addLog('warning', `API Warning: ${response.status} ${url}`, responseData);
      }
    }
    
    // Log error responses
    if (!response.ok && isElectron) {
      const errorText = await response.clone().text().catch(() => 'Unable to read error');
      const errorData = {
        url: finalUrl,
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 200), // First 200 chars
      };
      console.error('[apiFetch] Error response:', errorData);
      if (addLog) {
        addLog('error', `API Error: ${response.status} ${response.statusText} - ${url}`, errorData);
      }
    }
    
    return response;
  } catch (error: any) {
    if (isElectron) {
      const errorData = {
        url: finalUrl,
        error: error.message,
        code: error.code,
        stack: error.stack,
      };
      console.error('[apiFetch] Fetch error:', errorData);
      if (addLog) {
        addLog('error', `Network Error: ${error.message} - ${url}`, errorData);
      }
    }
    throw error;
  }
}

