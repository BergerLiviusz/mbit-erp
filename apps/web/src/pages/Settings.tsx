import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';

interface SystemSetting {
  id: number;
  kulcs: string;
  ertek: string;
  tipus: string;
  kategoria: string;
  leiras: string;
}

interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  database: { status: string; latency: number };
  storage: { status: string; dataDir: string; available: boolean };
}

import UsersTab from './UsersTab';

type TabType = 'organization' | 'backup' | 'system' | 'users';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabType>('organization');
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [systemLoading, setSystemLoading] = useState(false);
  const [healthError, setHealthError] = useState<string>('');
  const [message, setMessage] = useState('');
  const [orgData, setOrgData] = useState<Record<string, string>>({});


  useEffect(() => {
    loadSettings();
    if (activeTab === 'system') {
      loadHealth();
    }
  }, [activeTab]);

  useEffect(() => {
    initializeDefaults();
  }, []);

  useEffect(() => {
    const orgSettings = settings.filter(s => s.kategoria === 'organization');
    const data: Record<string, string> = {};
    orgSettings.forEach(s => {
      data[s.kulcs] = s.ertek;
    });
    setOrgData(data);
  }, [settings]);

  const loadSettings = async () => {
    try {
      const response = await apiFetch(`/system/settings`, {
        
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Hiba a beállítások betöltésekor:', error);
    }
  };

  const initializeDefaults = async () => {
    try {
      await apiFetch(`/system/settings/initialize`, {
        method: 'POST',
        
      });
    } catch (error) {
      console.error('Hiba az alapértelmezett beállítások inicializálásakor:', error);
    }
  };

  const loadHealth = async () => {
    setSystemLoading(true);
    setHealthError('');
    try {
      const response = await apiFetch(`/health/detailed`, {
        
      });
      
      if (response.ok) {
        const data = await response.json();
        setHealth(data);
      } else if (response.status === 401) {
        setHealthError('Nincs hitelesítve. Kérem jelentkezzen be újra.');
      } else if (response.status === 403) {
        setHealthError('Nincs jogosultsága a rendszerinformációk megtekintéséhez.');
      } else {
        setHealthError('Hiba a rendszerinformációk betöltésekor.');
      }
    } catch (error) {
      console.error('Hiba a rendszerinformációk betöltésekor:', error);
      setHealthError('Nem sikerült kapcsolódni a szerverhez.');
    } finally {
      setSystemLoading(false);
    }
  };

  const updateSetting = async (kulcs: string, ertek: string) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await apiFetch(`/system/settings/${kulcs}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ertek }),
      });

      if (response.ok) {
        setMessage('Beállítás mentve!');
        await loadSettings();
      } else {
        setMessage('Hiba a mentés során.');
      }
    } catch (error) {
      setMessage('Hiba történt.');
      console.error(error);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const createBackup = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await apiFetch(`/system/diagnostics/backup/now`, {
        method: 'POST',
        
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Mentés elkészült: ${data.filename}`);
      } else {
        setMessage('Hiba a mentés során.');
      }
    } catch (error) {
      setMessage('Hiba történt.');
      console.error(error);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.kategoria === category);
  };

  const handleOrgSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const updates = Object.entries(orgData).map(([kulcs, ertek]) => ({
        kulcs,
        ertek,
      }));

      const results = await Promise.all(
        updates.map(update => 
          apiFetch(`/system/settings/${update.kulcs}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ertek: update.ertek }),
          })
        )
      );

      const failedUpdates = results.filter(r => !r.ok);
      
      if (failedUpdates.length > 0) {
        const firstFailed = failedUpdates[0];
        if (firstFailed.status === 401) {
          setMessage('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (firstFailed.status === 403) {
          setMessage('Nincs jogosultsága a beállítások módosításához.');
        } else {
          setMessage(`Hiba a mentés során. ${failedUpdates.length} beállítás mentése sikertelen.`);
        }
      } else {
        setMessage('Szervezeti adatok sikeresen mentve!');
        await loadSettings();
      }
    } catch (error) {
      setMessage('Hiba a mentés során.');
      console.error(error);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const renderOrganizationTab = () => {
    const orgFields = [
      { kulcs: 'organization.name', leiras: 'Szervezet neve' },
      { kulcs: 'organization.address', leiras: 'Cím' },
      { kulcs: 'organization.tax_number', leiras: 'Adószám' },
      { kulcs: 'organization.email', leiras: 'Email' },
      { kulcs: 'organization.phone', leiras: 'Telefon' },
      { kulcs: 'organization.registration_number', leiras: 'Cégjegyzékszám' },
      { kulcs: 'organization.website', leiras: 'Weboldal' }
    ];
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Szervezeti adatok</h3>
        <p className="text-sm text-gray-600 mb-6">
          Adja meg a szervezet alapvető adatait. Ezek az információk megjelenhetnek dokumentumokon és egyéb helyeken.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orgFields.map(field => (
            <div key={field.kulcs} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                {field.leiras}
              </label>
              <input
                type="text"
                value={orgData[field.kulcs] || ''}
                onChange={(e) => {
                  setOrgData(prev => ({
                    ...prev,
                    [field.kulcs]: e.target.value
                  }));
                }}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mbit-blue"
                placeholder={`Adja meg: ${field.leiras.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleOrgSave}
            disabled={loading}
            className="bg-mbit-blue text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Mentés...' : 'Mentés'}
          </button>
        </div>

        {message && (
          <div className={`text-center py-2 ${message.includes('sikeres') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}
      </div>
    );
  };

  const renderBackupTab = () => {
    const backupSettings = getSettingsByCategory('backup');
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Biztonsági mentések</h3>
          <button
            onClick={createBackup}
            disabled={loading}
            className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Mentés folyamatban...' : 'Azonnali mentés létrehozása'}
          </button>
        </div>

        <div className="space-y-4 mt-6">
          <h4 className="font-medium">Ütemezett mentések</h4>
          {backupSettings.map(setting => (
            <div key={setting.id} className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 w-64">
                {setting.leiras}
              </label>
              {setting.tipus === 'boolean' ? (
                <input
                  type="checkbox"
                  defaultChecked={setting.ertek === 'true'}
                  className="w-5 h-5"
                  onChange={(e) => {
                    updateSetting(setting.kulcs, e.target.checked.toString());
                  }}
                />
              ) : setting.kulcs.includes('schedule') ? (
                <input
                  type="time"
                  defaultValue={setting.ertek.includes(':') ? setting.ertek : '02:00'}
                  className="border border-gray-300 rounded px-3 py-2"
                  onBlur={(e) => {
                    if (e.target.value !== setting.ertek) {
                      updateSetting(setting.kulcs, e.target.value);
                    }
                  }}
                />
              ) : (
                <input
                  type="text"
                  defaultValue={setting.ertek}
                  className="border border-gray-300 rounded px-3 py-2 flex-1"
                  onBlur={(e) => {
                    if (e.target.value !== setting.ertek) {
                      updateSetting(setting.kulcs, e.target.value);
                    }
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSystemTab = () => {
    if (systemLoading) {
      return <div className="text-gray-500 text-center py-8">Betöltés...</div>;
    }

    if (healthError) {
      return (
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">{healthError}</div>
          <button
            onClick={loadHealth}
            className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600"
          >
            Újrapróbálás
          </button>
        </div>
      );
    }

    if (!health) {
      return <div className="text-gray-500 text-center py-8">Nincs adat</div>;
    }

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Rendszerinformációk</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">Verzió</div>
            <div className="text-lg font-semibold">{health.version}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">Állapot</div>
            <div className="text-lg font-semibold">
              <span className={health.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                {health.status === 'ok' ? 'Működik' : 'Hiba'}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">Adatbázis</div>
            <div className="text-lg font-semibold">
              <span className={health.database?.status === 'healthy' ? 'text-green-600' : 'text-red-600'}>
                {health.database?.status === 'healthy' ? 'Elérhető' : 'Nem elérhető'}
              </span>
              <div className="text-sm text-gray-500">
                {health.database?.latency}ms késleltetés
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">Tárhely</div>
            <div className="text-lg font-semibold">
              <span className={health.storage?.available ? 'text-green-600' : 'text-red-600'}>
                {health.storage?.available ? 'Elérhető' : 'Nem elérhető'}
              </span>
              <div className="text-sm text-gray-500 break-all">
                {health.storage?.dataDir}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={loadHealth}
            className="text-mbit-blue hover:text-blue-800 text-sm"
          >
            ↻ Frissítés
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Beállítások</h2>

      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('Hiba') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('organization')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'organization'
                ? 'border-mbit-blue text-mbit-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Szervezet
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'backup'
                ? 'border-mbit-blue text-mbit-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Biztonsági mentések
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'system'
                ? 'border-mbit-blue text-mbit-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Rendszer
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-mbit-blue text-mbit-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Felhasználók
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'organization' && renderOrganizationTab()}
        {activeTab === 'backup' && renderBackupTab()}
        {activeTab === 'system' && renderSystemTab()}
        {activeTab === 'users' && (
          <UsersTab
            currentUserId={JSON.parse(localStorage.getItem('user') || '{}')?.id}
            isAdmin={JSON.parse(localStorage.getItem('user') || '{}')?.roles?.includes('Admin')}
          />
        )}
      </div>
    </div>
  );
}
