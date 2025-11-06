import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import CRM from './pages/CRM';
import DMS from './pages/DMS';
import Logistics from './pages/Logistics';
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
              <h1 className="text-xl font-bold">Audit Institute ERP</h1>
              <div className="flex space-x-4">
                <Link to="/" className="hover:bg-blue-800 px-3 py-2 rounded">
                  Főoldal
                </Link>
                <Link to="/crm" className="hover:bg-blue-800 px-3 py-2 rounded">
                  CRM
                </Link>
                <Link to="/dms" className="hover:bg-blue-800 px-3 py-2 rounded">
                  DMS
                </Link>
                <Link to="/logistics" className="hover:bg-blue-800 px-3 py-2 rounded">
                  Logisztika
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
          <Route path="/dms" element={<DMS />} />
          <Route path="/logistics" element={<Logistics />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
