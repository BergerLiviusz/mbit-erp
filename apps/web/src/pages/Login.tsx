import { useState, useEffect } from 'react';
import axios from '../lib/axios';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingAdminEmail, setIsLoadingAdminEmail] = useState(true);

  // Load last login email or admin email on mount
  useEffect(() => {
    const loadDefaultEmail = async () => {
      try {
        // First, try to get last login email from localStorage
        const lastLoginEmail = localStorage.getItem('lastLoginEmail');
        
        if (lastLoginEmail) {
          setEmail(lastLoginEmail);
          setIsLoadingAdminEmail(false);
        } else {
          // If no last login email, fetch admin email from API
          try {
            const response = await axios.get('/api/auth/admin-email');
            if (response.data?.email) {
              setEmail(response.data.email);
            } else {
              // Fallback to default
              setEmail('admin@mbit.hu');
            }
          } catch (err) {
            // Fallback to default if API call fails
            setEmail('admin@mbit.hu');
          }
          setIsLoadingAdminEmail(false);
        }
      } catch (err) {
        // Fallback to default
        setEmail('admin@mbit.hu');
        setIsLoadingAdminEmail(false);
      }
    };

    loadDefaultEmail();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Save email for next login (but not password for security)
      localStorage.setItem('lastLoginEmail', email);
      onLogin();
    } catch (err: any) {
      // Better error handling - show proper error message
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Érvénytelen bejelentkezési adatok');
      } else if (err.response?.status === 0 || !err.response) {
        setError('Nem sikerült kapcsolódni a szerverhez. Kérem ellenőrizze a kapcsolatot.');
      } else {
        setError('Bejelentkezési hiba történt');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingAdminEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Mbit ERP</h1>
          <div className="text-center text-gray-600">Betöltés...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Mbit ERP</h1>
        <h2 className="text-lg mb-4 text-center text-gray-600">Bejelentkezés</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email cím</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mbit-blue"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Jelszó</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mbit-blue"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-mbit-blue text-white py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>
      </div>
    </div>
  );
}
