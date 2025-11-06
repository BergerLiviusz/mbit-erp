import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import CRM from './pages/CRM';
import DMS from './pages/DMS';
import Logistics from './pages/Logistics';
import Settings from './pages/Settings';
import Opportunities from './pages/Opportunities';
import Quotes from './pages/Quotes';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('token')
  );

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">Mbit ERP</h1>
              <div className="flex space-x-4">
                <Link to="/" className="hover:bg-blue-800 px-3 py-2 rounded">
                  Főoldal
                </Link>
                <Link to="/crm" className="hover:bg-blue-800 px-3 py-2 rounded">
                  CRM
                </Link>
                <Link to="/opportunities" className="hover:bg-blue-800 px-3 py-2 rounded">
                  Lehetőségek
                </Link>
                <Link to="/quotes" className="hover:bg-blue-800 px-3 py-2 rounded">
                  Árajánlatok
                </Link>
                <Link to="/dms" className="hover:bg-blue-800 px-3 py-2 rounded">
                  DMS
                </Link>
                <Link to="/logistics" className="hover:bg-blue-800 px-3 py-2 rounded">
                  Logisztika
                </Link>
                <Link to="/settings" className="hover:bg-blue-800 px-3 py-2 rounded">
                  Beállítások
                </Link>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
              }}
              className="hover:bg-blue-800 px-4 py-2 rounded"
            >
              Kijelentkezés
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/dms" element={<DMS />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
