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
import Workflows from './pages/Workflows';
import Login from './pages/Login';
import BugReport from './pages/BugReport';
import InventorySheets from './pages/InventorySheets';
import JobPositions from './pages/HR/JobPositions';
import Employees from './pages/HR/Employees';
import Contracts from './pages/HR/Contracts';
import HrReports from './pages/HR/Reports';
import Intrastat from './pages/Intrastat';
import DatabaseConnections from './pages/Controlling/DatabaseConnections';
import KPI from './pages/Controlling/KPI';
import Queries from './pages/Controlling/Queries';
import Invoices from './pages/CRM/Invoices';
import Chat from './pages/CRM/Chat';
import StockValuation from './pages/Logistics/StockValuation';
import StockReservations from './pages/Logistics/StockReservations';
import { BackendStatus } from './components/BackendStatus';
import { NotificationPanel } from './components/NotificationPanel';
import { LoadingScreen } from './components/LoadingScreen';
import { ModuleRouteGuard } from './components/ModuleRouteGuard';
import MbitLogo from './assets/logo.svg';
import axios from './lib/axios';
import { isModuleEnabled, getModuleMenuItems, isHrModuleEnabled, getActivePackage } from './config/modules';

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
                {/* Ügyfélkezelés - csak ha CRM modul engedélyezve */}
                {isModuleEnabled('crm') && (
                  <DropdownMenu 
                    title="Ügyfélkezelés"
                    items={getModuleMenuItems('crm')}
                  />
                )}
                {/* Dokumentumok - mindig látható */}
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
                {/* Csapat kommunikáció - csak ha Team modul engedélyezve */}
                {isModuleEnabled('team') && (
                  <>
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
                    <Link 
                      to="/workflows" 
                      className="hover:bg-gray-800 px-3 py-2 rounded"
                      onClick={() => {
                        if (isElectron) {
                          import('./components/DebugPanel').then(module => {
                            module.addLog('info', 'Navigation: Clicked Folyamatleltár', { to: '/workflows' });
                          }).catch(() => {});
                        }
                      }}
                    >
                      Folyamatleltár
                    </Link>
                  </>
                )}
                {/* Logisztika - csak ha Logistics modul engedélyezve */}
                {isModuleEnabled('logistics') && (
                  <DropdownMenu 
                    title="Logisztika"
                    items={getModuleMenuItems('logistics')}
                  />
                )}
                {/* HR - csak ha engedélyezve (nem package-5-ben) */}
                {isHrModuleEnabled() && (
                  <DropdownMenu 
                    title="HR"
                    items={[
                      { to: '/hr/job-positions', label: 'Munkakörök' },
                      { to: '/hr/employees', label: 'Dolgozók' },
                      { to: '/hr/contracts', label: 'Munkaszerződések' },
                      { to: '/hr/reports', label: 'Riportok' }
                    ]}
                  />
                )}
                {/* Kontrolling - csak ha Controlling modul engedélyezve */}
                {isModuleEnabled('controlling') && (
                  <DropdownMenu 
                    title="Kontrolling"
                    items={getModuleMenuItems('controlling')}
                  />
                )}
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
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {isElectron && <BackendStatus />}
        {isElectron && <NotificationPanel />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* CRM routes - csak ha engedélyezve */}
          {isModuleEnabled('crm') ? (
            <>
              <Route path="/crm" element={<ModuleRouteGuard module="crm"><CRM /></ModuleRouteGuard>} />
              {/* Package-5-ben csak a Partnerek elérhető, a többi CRM route elrejtve */}
              {getActivePackage() !== 'package-5' && (
                <>
                  <Route path="/opportunities" element={<ModuleRouteGuard module="crm"><Opportunities /></ModuleRouteGuard>} />
                  <Route path="/quotes" element={<ModuleRouteGuard module="crm"><Quotes /></ModuleRouteGuard>} />
                  <Route path="/orders" element={<ModuleRouteGuard module="crm"><Orders /></ModuleRouteGuard>} />
                  <Route path="/crm/invoices" element={<ModuleRouteGuard module="crm"><Invoices /></ModuleRouteGuard>} />
                  <Route path="/crm/chat" element={<ModuleRouteGuard module="crm"><Chat /></ModuleRouteGuard>} />
                </>
              )}
            </>
          ) : null}
          
          {/* Dokumentumok - mindig elérhető */}
          <Route path="/documents" element={<Documents />} />
          
          {/* Team route - csak ha engedélyezve */}
          {isModuleEnabled('team') ? (
            <>
              <Route path="/team" element={<ModuleRouteGuard module="team"><Team /></ModuleRouteGuard>} />
              <Route path="/workflows" element={<ModuleRouteGuard module="team"><Workflows /></ModuleRouteGuard>} />
            </>
          ) : null}
          
          {/* Logistics routes - csak ha engedélyezve */}
          {isModuleEnabled('logistics') ? (
            <>
              <Route path="/warehouses" element={<ModuleRouteGuard module="logistics"><Warehouses /></ModuleRouteGuard>} />
              <Route path="/products" element={<ModuleRouteGuard module="logistics"><Products /></ModuleRouteGuard>} />
              <Route path="/returns" element={<ModuleRouteGuard module="logistics"><Returns /></ModuleRouteGuard>} />
              <Route path="/suppliers" element={<ModuleRouteGuard module="logistics"><Suppliers /></ModuleRouteGuard>} />
              <Route path="/orders-logistics" element={<ModuleRouteGuard module="logistics"><OrdersLogistics /></ModuleRouteGuard>} />
              <Route path="/inventory-sheets" element={<ModuleRouteGuard module="logistics"><InventorySheets /></ModuleRouteGuard>} />
              <Route path="/intrastat" element={<ModuleRouteGuard module="logistics"><Intrastat /></ModuleRouteGuard>} />
              <Route path="/logistics/stock-valuation" element={<ModuleRouteGuard module="logistics"><StockValuation /></ModuleRouteGuard>} />
              <Route path="/logistics/stock-reservations" element={<ModuleRouteGuard module="logistics"><StockReservations /></ModuleRouteGuard>} />
            </>
          ) : null}
          
          {/* HR routes - csak ha engedélyezve (nem package-5-ben) */}
          {isHrModuleEnabled() ? (
            <>
              <Route path="/hr/job-positions" element={<JobPositions />} />
              <Route path="/hr/employees" element={<Employees />} />
              <Route path="/hr/contracts" element={<Contracts />} />
              <Route path="/hr/reports" element={<HrReports />} />
            </>
          ) : null}
          
          {/* Controlling routes - csak ha engedélyezve */}
          {isModuleEnabled('controlling') ? (
            <>
              <Route path="/controlling/database-connections" element={<ModuleRouteGuard module="controlling"><DatabaseConnections /></ModuleRouteGuard>} />
              <Route path="/controlling/kpi" element={<ModuleRouteGuard module="controlling"><KPI /></ModuleRouteGuard>} />
              <Route path="/controlling/queries" element={<ModuleRouteGuard module="controlling"><Queries /></ModuleRouteGuard>} />
            </>
          ) : null}
          
          {/* Mindig elérhető */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/bug-report" element={<BugReport />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
