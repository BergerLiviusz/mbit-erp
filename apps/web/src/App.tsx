import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import CRM from './pages/CRM';
import Documents from './pages/Documents';
import Warehouses from './pages/Warehouses';
import Products from './pages/Products';
import Returns from './pages/Returns';
import Suppliers from './pages/Suppliers';
import Settings from './pages/Settings';
import Opportunities from './pages/Opportunities';
import Quotes from './pages/Quotes';
import Orders from './pages/Orders';
import OrdersLogistics from './pages/OrdersLogistics';
import Team from './pages/Team';
import Login from './pages/Login';
import { BackendStatus } from './components/BackendStatus';
import { NotificationPanel } from './components/NotificationPanel';
import { LoadingScreen } from './components/LoadingScreen';
import MbitLogo from './assets/logo.svg';
import axios from './lib/axios';

function DropdownMenu({ title, items }: { title: string; items: Array<{ to: string; label: string }> }) {
  const [isOpen, setIsOpen] = useState(false);
  const isElectron = !!(window as any).electron || (navigator.userAgent.includes('Electron'));

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
              onClick={() => {
                if (isElectron) {
                  import('./components/DebugPanel').then(module => {
                    module.addLog('info', `Navigation: Clicked ${item.label}`, { to: item.to });
                  }).catch(() => {});
                }
              }}
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
  const location = useLocation();
  
  // Log route changes
  useEffect(() => {
    if (isElectron) {
      import('./components/DebugPanel').then(module => {
        module.addLog('info', `Route changed: ${location.pathname}`, { 
          pathname: location.pathname,
          hash: location.hash,
          search: location.search,
        });
      }).catch(() => {});
    }
  }, [location, isElectron]);
  
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => {
      // Always check for token, even in Electron mode
      return !!localStorage.getItem('token');
    }
  );
  
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(true);

  // Check backend readiness on mount
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    const checkBackend = async () => {
      try {
        const response = await axios.get('/health');
        if (response.status === 200 && response.data?.status === 'ok') {
          setIsBackendReady(true);
          setIsCheckingBackend(false);
          if (intervalId) {
            clearInterval(intervalId);
          }
        } else {
          setIsBackendReady(false);
          setIsCheckingBackend(false);
        }
      } catch (err) {
        setIsBackendReady(false);
        setIsCheckingBackend(false);
      }
    };

    // Check immediately
    checkBackend();
    
    // Then check every 2 seconds until backend is ready
    intervalId = setInterval(() => {
      checkBackend();
    }, 2000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  // Show loading screen while checking backend or if backend is not ready
  if (isCheckingBackend || !isBackendReady) {
    return <LoadingScreen />;
  }

  // Always show login screen if not authenticated
  if (!isAuthenticated) {
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
                <Link 
                  to="/" 
                  className="hover:bg-gray-800 px-3 py-2 rounded"
                  onClick={() => {
                    if (isElectron) {
                      import('./components/DebugPanel').then(module => {
                        module.addLog('info', 'Navigation: Clicked Főoldal', { to: '/' });
                      }).catch(() => {});
                    }
                  }}
                >
                  Főoldal
                </Link>
                <DropdownMenu 
                  title="Ügyfélkezelés"
                  items={[
                    { to: '/crm', label: 'Partnerek' },
                    { to: '/opportunities', label: 'Lehetőségek' },
                    { to: '/quotes', label: 'Árajánlatok' },
                    { to: '/orders', label: 'Rendelések' }
                  ]}
                />
                <Link 
                  to="/documents" 
                  className="hover:bg-gray-800 px-3 py-2 rounded"
                  onClick={() => {
                    if (isElectron) {
                      import('./components/DebugPanel').then(module => {
                        module.addLog('info', 'Navigation: Clicked Dokumentumok', { to: '/documents' });
                      }).catch(() => {});
                    }
                  }}
                >
                  Dokumentumok
                </Link>
                <Link 
                  to="/team" 
                  className="hover:bg-gray-800 px-3 py-2 rounded"
                  onClick={() => {
                    if (isElectron) {
                      import('./components/DebugPanel').then(module => {
                        module.addLog('info', 'Navigation: Clicked Csapat kommunikáció', { to: '/team' });
                      }).catch(() => {});
                    }
                  }}
                >
                  Csapat kommunikáció
                </Link>
                <DropdownMenu 
                  title="Logisztika"
                  items={[
                    { to: '/warehouses', label: 'Raktárak' },
                    { to: '/products', label: 'Termékek' },
                    { to: '/returns', label: 'Visszárúk' },
                    { to: '/suppliers', label: 'Szállítók' },
                    { to: '/orders-logistics', label: 'Rendelések' }
                  ]}
                />
                <Link 
                  to="/settings" 
                  className="hover:bg-gray-800 px-3 py-2 rounded"
                  onClick={() => {
                    if (isElectron) {
                      import('./components/DebugPanel').then(module => {
                        module.addLog('info', 'Navigation: Clicked Beállítások', { to: '/settings' });
                      }).catch(() => {});
                    }
                  }}
                >
                  Beállítások
                </Link>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
              }}
              className="hover:bg-gray-800 px-4 py-2 rounded"
            >
              Kijelentkezés
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {isElectron && <BackendStatus />}
        {isElectron && <NotificationPanel />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/team" element={<Team />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/products" element={<Products />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/orders-logistics" element={<OrdersLogistics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
