import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import Modal from '../../components/Modal';

interface JobPosition {
  id: string;
  azonosito: string;
  nev: string;
  leiras?: string | null;
  feladatok?: string | null;
  hataskorok?: string | null;
  osztaly?: string | null;
  reszleg?: string | null;
  aktiv: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    employees: number;
  };
}

export default function JobPositions() {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    azonosito: '',
    nev: '',
    leiras: '',
    feladatok: '',
    hataskorok: '',
    osztaly: '',
    reszleg: '',
    aktiv: true,
  });

  const [filters, setFilters] = useState({
    osztaly: '',
    reszleg: '',
    aktiv: '',
  });

  useEffect(() => {
    loadJobPositions();
  }, [filters]);

  const loadJobPositions = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.osztaly) queryParams.append('osztaly', filters.osztaly);
      if (filters.reszleg) queryParams.append('reszleg', filters.reszleg);
      if (filters.aktiv) queryParams.append('aktiv', filters.aktiv);

      const response = await apiFetch(`/hr/job-positions?skip=0&take=100&${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setJobPositions(data.items || []);
      } else {
        throw new Error('Hiba a munkakörök betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (position?: JobPosition) => {
    if (position) {
      setEditingId(position.id);
      setFormData({
        azonosito: position.azonosito,
        nev: position.nev,
        leiras: position.leiras || '',
        feladatok: position.feladatok || '',
        hataskorok: position.hataskorok || '',
        osztaly: position.osztaly || '',
        reszleg: position.reszleg || '',
        aktiv: position.aktiv,
      });
    } else {
      setEditingId(null);
      setFormData({
        azonosito: '',
        nev: '',
        leiras: '',
        feladatok: '',
        hataskorok: '',
        osztaly: '',
        reszleg: '',
        aktiv: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.azonosito.trim()) {
      setError('Az azonosító megadása kötelező');
      return;
    }

    if (!formData.nev.trim()) {
      setError('A név megadása kötelező');
      return;
    }

    try {
      const url = editingId
        ? `/hr/job-positions/${editingId}`
        : '/hr/job-positions';
      const method = editingId ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingId ? {
          nev: formData.nev,
          leiras: formData.leiras || undefined,
          feladatok: formData.feladatok || undefined,
          hataskorok: formData.hataskorok || undefined,
          osztaly: formData.osztaly || undefined,
          reszleg: formData.reszleg || undefined,
          aktiv: formData.aktiv,
        } : formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a mentés során');
      }

      setSuccess(editingId ? 'Munkakör sikeresen frissítve!' : 'Munkakör sikeresen létrehozva!');
      setTimeout(() => {
        setIsModalOpen(false);
        loadJobPositions();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    }
  };

  const handleDelete = async (id: string, nev: string) => {
    if (!confirm(`Biztosan törölni szeretné a "${nev}" munkakört?`)) {
      return;
    }

    try {
      const response = await apiFetch(`/hr/job-positions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hiba a törlés során');
      }

      setSuccess('Munkakör sikeresen törölve!');
      loadJobPositions();
    } catch (err: any) {
      setError(err.message || 'Hiba történt a törlés során');
    }
  };

  const uniqueOsztalyok = Array.from(new Set(jobPositions.map(p => p.osztaly).filter(Boolean))) as string[];
  const uniqueReszlegek = Array.from(new Set(jobPositions.map(p => p.reszleg).filter(Boolean))) as string[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Munkakörök</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új munkakör
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Osztály</label>
            <select
              value={filters.osztaly}
              onChange={(e) => setFilters({ ...filters, osztaly: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {uniqueOsztalyok.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Részleg</label>
            <select
              value={filters.reszleg}
              onChange={(e) => setFilters({ ...filters, reszleg: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {uniqueReszlegek.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
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

      {/* Munkakörök lista */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : jobPositions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs munkakör</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Azonosító</th>
                  <th className="text-left p-4 font-medium text-gray-700">Név</th>
                  <th className="text-left p-4 font-medium text-gray-700">Osztály</th>
                  <th className="text-left p-4 font-medium text-gray-700">Részleg</th>
                  <th className="text-left p-4 font-medium text-gray-700">Dolgozók száma</th>
                  <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                  <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {jobPositions.map((position) => (
                  <tr key={position.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{position.azonosito}</td>
                    <td className="p-4">{position.nev}</td>
                    <td className="p-4 text-sm text-gray-600">{position.osztaly || '-'}</td>
                    <td className="p-4 text-sm text-gray-600">{position.reszleg || '-'}</td>
                    <td className="p-4 text-sm text-gray-600">{position._count?.employees || 0}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        position.aktiv ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {position.aktiv ? 'Aktív' : 'Inaktív'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenModal(position)}
                        className="text-mbit-blue hover:text-blue-600 text-sm mr-3"
                      >
                        Szerkesztés
                      </button>
                      <button
                        onClick={() => handleDelete(position.id, position.nev)}
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Munkakör szerkesztése' : 'Új munkakör'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Azonosító <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.azonosito}
                  onChange={(e) => setFormData({ ...formData, azonosito: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Leírás</label>
              <textarea
                value={formData.leiras}
                onChange={(e) => setFormData({ ...formData, leiras: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Feladatok</label>
              <textarea
                value={formData.feladatok}
                onChange={(e) => setFormData({ ...formData, feladatok: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A munkakör feladatai..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hatáskörök</label>
              <textarea
                value={formData.hataskorok}
                onChange={(e) => setFormData({ ...formData, hataskorok: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A munkakör hatáskörei..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Osztály</label>
                <input
                  type="text"
                  value={formData.osztaly}
                  onChange={(e) => setFormData({ ...formData, osztaly: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Részleg</label>
                <input
                  type="text"
                  value={formData.reszleg}
                  onChange={(e) => setFormData({ ...formData, reszleg: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {editingId && (
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.aktiv}
                    onChange={(e) => setFormData({ ...formData, aktiv: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Aktív</span>
                </label>
              </div>
            )}

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

