import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import Modal from '../../components/Modal';

interface DatabaseConnection {
  id: string;
  nev: string;
  tipus: string;
  host?: string | null;
  port?: number | null;
  database?: string | null;
  username?: string | null;
  password?: string | null;
  connectionString?: string | null;
  aktiv: boolean;
  megjegyzesek?: string | null;
  createdAt: string;
  updatedAt: string;
}

const TIPUSOK = [
  { kod: 'SQLITE', nev: 'SQLite' },
  { kod: 'POSTGRESQL', nev: 'PostgreSQL' },
  { kod: 'MYSQL', nev: 'MySQL' },
  { kod: 'MSSQL', nev: 'Microsoft SQL Server' },
  { kod: 'ORACLE', nev: 'Oracle' },
];

export default function DatabaseConnections() {
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nev: '',
    tipus: 'POSTGRESQL',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    connectionString: '',
    megjegyzesek: '',
  });

  const [filters, setFilters] = useState({
    aktiv: '',
  });

  useEffect(() => {
    loadConnections();
  }, [filters]);

  const loadConnections = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.aktiv) queryParams.append('aktiv', filters.aktiv);

      const response = await apiFetch(`/controlling/database-connections?skip=0&take=100&${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setConnections(data.items || []);
      } else {
        throw new Error('Hiba a kapcsolatok betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (connection?: DatabaseConnection) => {
    if (connection) {
      setEditingId(connection.id);
      setFormData({
        nev: connection.nev,
        tipus: connection.tipus,
        host: connection.host || '',
        port: connection.port?.toString() || '',
        database: connection.database || '',
        username: connection.username || '',
        password: '',
        connectionString: connection.connectionString || '',
        megjegyzesek: connection.megjegyzesek || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        nev: '',
        tipus: 'POSTGRESQL',
        host: '',
        port: '',
        database: '',
        username: '',
        password: '',
        connectionString: '',
        megjegyzesek: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nev.trim()) {
      setError('A név megadása kötelező');
      return;
    }

    try {
      const url = editingId
        ? `/controlling/database-connections/${editingId}`
        : '/controlling/database-connections';
      const method = editingId ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nev: formData.nev,
          tipus: formData.tipus,
          host: formData.host || undefined,
          port: formData.port ? parseInt(formData.port) : undefined,
          database: formData.database || undefined,
          username: formData.username || undefined,
          password: formData.password || undefined,
          connectionString: formData.connectionString || undefined,
          megjegyzesek: formData.megjegyzesek || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a mentés során');
      }

      setSuccess(editingId ? 'Kapcsolat sikeresen frissítve!' : 'Kapcsolat sikeresen létrehozva!');
      setTimeout(() => {
        setIsModalOpen(false);
        loadConnections();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    }
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch(`/controlling/database-connections/${id}/test`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Kapcsolati hiba');
      }

      const result = await response.json();
      if (result.success) {
        setSuccess('Kapcsolat sikeres!');
      } else {
        setError(result.message || 'Kapcsolati hiba');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba a kapcsolat tesztelésekor');
    } finally {
      setTestingId(null);
    }
  };

  const handleDelete = async (id: string, nev: string) => {
    if (!confirm(`Biztosan törölni szeretné a "${nev}" kapcsolatot?`)) {
      return;
    }

    try {
      const response = await apiFetch(`/controlling/database-connections/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hiba a törlés során');
      }

      setSuccess('Kapcsolat sikeresen törölve!');
      loadConnections();
    } catch (err: any) {
      setError(err.message || 'Hiba történt a törlés során');
    }
  };

  const handleToggleActive = async (connection: DatabaseConnection) => {
    try {
      const response = await apiFetch(`/controlling/database-connections/${connection.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aktiv: !connection.aktiv,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba az állapot módosításakor');
      }

      setSuccess(`Kapcsolat ${!connection.aktiv ? 'aktiválva' : 'deaktiválva'}!`);
      loadConnections();
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Adatbázis Kapcsolatok</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új kapcsolat
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Szűrők */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Állapot</label>
            <select
              value={filters.aktiv}
              onChange={(e) => setFilters({ ...filters, aktiv: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              <option value="true">Aktív</option>
              <option value="false">Inaktív</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kapcsolatok lista */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : connections.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs kapcsolat</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Név</th>
                  <th className="text-left p-4 font-medium text-gray-700">Típus</th>
                  <th className="text-left p-4 font-medium text-gray-700">Host/Database</th>
                  <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                  <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {connections.map((connection) => (
                  <tr key={connection.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{connection.nev}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {TIPUSOK.find(t => t.kod === connection.tipus)?.nev || connection.tipus}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {connection.connectionString
                        ? 'Connection String'
                        : `${connection.host || '-'}${connection.database ? `/${connection.database}` : ''}`}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        connection.aktiv
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {connection.aktiv ? 'Aktív' : 'Inaktív'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleTest(connection.id)}
                        disabled={testingId === connection.id}
                        className="text-blue-600 hover:text-blue-800 text-sm mr-2 disabled:text-gray-400"
                      >
                        {testingId === connection.id ? 'Tesztelés...' : 'Tesztelés'}
                      </button>
                      <button
                        onClick={() => handleToggleActive(connection)}
                        className={`text-sm mr-2 ${
                          connection.aktiv
                            ? 'text-yellow-600 hover:text-yellow-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {connection.aktiv ? 'Deaktiválás' : 'Aktiválás'}
                      </button>
                      <button
                        onClick={() => handleOpenModal(connection)}
                        className="text-mbit-blue hover:text-blue-600 text-sm mr-2"
                      >
                        Szerkesztés
                      </button>
                      <button
                        onClick={() => handleDelete(connection.id, connection.nev)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Törlés
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Új/Szerkesztés modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Kapcsolat szerkesztése' : 'Új kapcsolat'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Név <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nev}
                onChange={(e) => setFormData({ ...formData, nev: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Típus <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tipus}
                onChange={(e) => setFormData({ ...formData, tipus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {TIPUSOK.map(t => (
                  <option key={t.kod} value={t.kod}>{t.nev}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Connection String (vagy egyedi beállítások)</label>
              <textarea
                value={formData.connectionString}
                onChange={(e) => setFormData({ ...formData, connectionString: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="pl. postgresql://user:password@host:port/database"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                <input
                  type="text"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                <input
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Database</label>
                <input
                  type="text"
                  value={formData.database}
                  onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={editingId ? 'Hagyja üresen, ha nem változtat' : ''}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Megjegyzések</label>
              <textarea
                value={formData.megjegyzesek}
                onChange={(e) => setFormData({ ...formData, megjegyzesek: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600"
              >
                {editingId ? 'Mentés' : 'Létrehozás'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

