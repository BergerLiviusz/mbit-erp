import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import CRM from './pages/CRM';
import Documents from './pages/Documents';
import Warehouses from './pages/Warehouses';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Opportunities from './pages/Opportunities';
import Quotes from './pages/Quotes';
import Login from './pages/Login';
import { BackendStatus } from './components/BackendStatus';
import { DebugPanel } from './components/DebugPanel';
import MbitLogo from './assets/logo.svg';

function DropdownMenu({ title, items }: { title: string; items: Array<{ to: string; label: string }> }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="hover:bg-gray-800 px-3 py-2 rounded flex items-center gap-1">
        {title}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 bg-mbit-dark border border-gray-700 rounded shadow-lg min-w-[200px] z-50">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block px-4 py-2 hover:bg-gray-800 text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  // Check if running in Electron desktop mode
  const isElectron = !!(window as any).electron || (navigator.userAgent.includes('Electron'));
  
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => {
      // In Electron desktop mode, always consider authenticated (auth is bypassed on backend)
      if (isElectron) {
        return true;
      }
      return !!localStorage.getItem('token');
    }
  );

  // Skip login screen in Electron desktop mode
  if (!isAuthenticated && !isElectron) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-mbit-dark text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center">
                <img src={MbitLogo} alt="Mbit Logo" className="h-10 w-auto" />
              </Link>
              <div className="flex space-x-4">
                <Link to="/" className="hover:bg-gray-800 px-3 py-2 rounded">
                  Főoldal
                </Link>
                <DropdownMenu 
                  title="Ügyfélkezelés"
                  items={[
                    { to: '/crm', label: 'Partnerek' },
                    { to: '/opportunities', label: 'Lehetőségek' },
                    { to: '/quotes', label: 'Árajánlatok' }
                  ]}
                />
                <Link to="/documents" className="hover:bg-gray-800 px-3 py-2 rounded">
                  Dokumentumok
                </Link>
                <DropdownMenu 
                  title="Logisztika"
                  items={[
                    { to: '/warehouses', label: 'Raktárak' },
                    { to: '/products', label: 'Termékek' }
                  ]}
                />
                <Link to="/settings" className="hover:bg-gray-800 px-3 py-2 rounded">
                  Beállítások
                </Link>
              </div>
            </div>
            {!isElectron && (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  setIsAuthenticated(false);
                }}
                className="hover:bg-gray-800 px-4 py-2 rounded"
              >
                Kijelentkezés
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {isElectron && <BackendStatus />}
        {isElectron && <DebugPanel />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/products" element={<Products />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
