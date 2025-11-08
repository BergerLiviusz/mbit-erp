/**
 * API URL helper for Electron and web modes
 * In Electron: uses http://localhost:3000 (backend runs locally)
 * In web: uses /api (proxied through Vite dev server)
 */
const isElectron = !!(window as any).electron || (navigator.userAgent.includes('Electron'));

export const API_URL = isElectron ? 'http://localhost:3000' : (import.meta.env.VITE_API_URL || '/api');

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
    console.log('[apiFetch] Request:', {
      originalUrl: url,
      finalUrl,
      method: options?.method || 'GET',
      isElectron,
    });
  }
  
  try {
    const response = await fetch(finalUrl, {
      ...options,
      headers,
    });
    
    if (isElectron) {
      console.log('[apiFetch] Response:', {
        url: finalUrl,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
    }
    
    // Log error responses
    if (!response.ok && isElectron) {
      const errorText = await response.clone().text().catch(() => 'Unable to read error');
      console.error('[apiFetch] Error response:', {
        url: finalUrl,
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 200), // First 200 chars
      });
    }
    
    return response;
  } catch (error: any) {
    if (isElectron) {
      console.error('[apiFetch] Fetch error:', {
        url: finalUrl,
        error: error.message,
        code: error.code,
        stack: error.stack,
      });
    }
    throw error;
  }
}

