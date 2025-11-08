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

export default axiosInstance;
