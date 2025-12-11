import axios from 'axios';

const isElectron = !!(window as any).electron || (navigator.userAgent.includes('Electron'));

const axiosInstance = axios.create({
  baseURL: isElectron ? 'http://localhost:3000' : '',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (isElectron && config.url?.startsWith('/api/')) {
      config.url = config.url.replace('/api/', '/');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to log errors for debugging and handle 401 (unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isElectron) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        code: error.code,
      });
    }
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login by reloading the page
      // This will trigger the App.tsx to show the login screen
      if (window.location.pathname !== '/login') {
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
