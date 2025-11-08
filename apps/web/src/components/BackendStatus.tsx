import { useEffect, useState } from 'react';
import axios from '../lib/axios';

export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get('/health');
        if (response.status === 200) {
          setStatus('connected');
          setError('');
        } else {
          setStatus('disconnected');
          setError('Backend responded with error');
        }
      } catch (err: any) {
        setStatus('disconnected');
        if (err.code === 'ECONNREFUSED') {
          setError('Backend szerver nem elérhető. Ellenőrizze, hogy fut-e a backend.');
        } else if (err.message?.includes('Network Error')) {
          setError('Hálózati hiba: Nem lehet csatlakozni a backend szerverhez.');
        } else {
          setError(`Hiba: ${err.message || 'Ismeretlen hiba'}`);
        }
      }
    };

    checkBackend();
    // Check every 5 seconds
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded mb-4 text-sm">
        🔄 Backend kapcsolat ellenőrzése...
      </div>
    );
  }

  if (status === 'disconnected') {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p className="font-bold">⚠️ Backend szerver nem elérhető</p>
        <p className="text-sm mt-1">{error}</p>
        <p className="text-sm mt-2">Kérjük, indítsa újra az alkalmazást.</p>
      </div>
    );
  }

  return null; // Don't show anything when connected
}

