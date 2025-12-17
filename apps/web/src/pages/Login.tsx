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
  const [rememberLogin, setRememberLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  // Load admin email and determine default email on mount
  useEffect(() => {
    const loadDefaultEmail = async () => {
      try {
        // Always fetch current admin email from API
        let currentAdminEmail = 'admin@mbit.hu';
        try {
          const response = await axios.get('/api/auth/admin-email');
          if (response.data?.email) {
            currentAdminEmail = response.data.email;
            setAdminEmail(currentAdminEmail);
          }
        } catch (err) {
          console.error('Failed to fetch admin email:', err);
        }

        // Check if user wants to remember login
        const rememberLoginSetting = localStorage.getItem('rememberLogin') === 'true';
        setRememberLogin(rememberLoginSetting);

        if (rememberLoginSetting) {
          // If remember login is enabled, use last login email
          const lastLoginEmail = localStorage.getItem('lastLoginEmail');
          if (lastLoginEmail) {
            setEmail(lastLoginEmail);
          } else {
            // If no last login email, use admin email
            setEmail(currentAdminEmail);
          }
        } else {
          // If remember login is disabled, always use current admin email
          setEmail(currentAdminEmail);
          
          // Also update localStorage admin email for future reference
          localStorage.setItem('adminEmail', currentAdminEmail);
        }
      } catch (err) {
        // Fallback to default
        setEmail('admin@mbit.hu');
        setAdminEmail('admin@mbit.hu');
      } finally {
        setIsLoadingAdminEmail(false);
      }
    };

    loadDefaultEmail();
  }, []);

  const handleRememberLoginChange = (checked: boolean) => {
    setRememberLogin(checked);
    localStorage.setItem('rememberLogin', checked.toString());
    
    if (checked) {
      // If enabling remember login, use last login email or current email
      const lastLoginEmail = localStorage.getItem('lastLoginEmail');
      if (lastLoginEmail) {
        setEmail(lastLoginEmail);
      } else {
        // Save current email as last login email
        localStorage.setItem('lastLoginEmail', email);
      }
    } else {
      // If disabling remember login, switch to admin email
      setEmail(adminEmail || 'admin@mbit.hu');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Save email for next login if remember login is enabled
      if (rememberLogin) {
        localStorage.setItem('lastLoginEmail', email);
      }
      
      // Always update admin email reference
      if (adminEmail) {
        localStorage.setItem('adminEmail', adminEmail);
      }
      
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

          <div className="mb-4">
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

          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberLogin}
                onChange={(e) => handleRememberLoginChange(e.target.checked)}
                className="w-4 h-4 text-mbit-blue border-gray-300 rounded focus:ring-mbit-blue"
                disabled={loading}
              />
              <span className="text-sm text-gray-700">Bejelentkezés megjegyzése</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              {rememberLogin 
                ? 'Az utolsó bejelentkezési email cím lesz használva' 
                : 'Az alapértelmezett rendszergazda email cím lesz használva'}
            </p>
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
