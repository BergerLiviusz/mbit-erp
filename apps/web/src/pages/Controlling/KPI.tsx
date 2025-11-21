import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import Modal from '../../components/Modal';

interface KPI {
  id: string;
  azonosito: string;
  nev: string;
  leiras?: string | null;
  tipus: string;
  formula?: string | null;
  parameterek?: string | null;
  egyseg?: string | null;
  celErtek?: number | null;
  aktualisErtek?: number | null;
  utolsoFrissites?: string | null;
  aktiv: boolean;
  createdAt: string;
  updatedAt: string;
}

const TIPUSOK = [
  { kod: 'NUMBER', nev: 'Szám' },
  { kod: 'PERCENTAGE', nev: 'Százalék' },
  { kod: 'CURRENCY', nev: 'Pénznem' },
  { kod: 'NATURAL', nev: 'Naturália' },
];

export default function KPI() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [calculatingId, setCalculatingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    azonosito: '',
    nev: '',
    leiras: '',
    tipus: 'NUMBER',
    formula: '',
    parameterek: '',
    egyseg: '',
    celErtek: '',
  });

  const [filters, setFilters] = useState({
    aktiv: '',
    tipus: '',
  });

  useEffect(() => {
    loadKPIs();
  }, [filters]);

  const loadKPIs = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.aktiv) queryParams.append('aktiv', filters.aktiv);
      if (filters.tipus) queryParams.append('tipus', filters.tipus);

      const response = await apiFetch(`/controlling/kpi?skip=0&take=100&${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setKpis(data.items || []);
      } else {
        throw new Error('Hiba a KPI-k betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (kpi?: KPI) => {
    if (kpi) {
      setEditingId(kpi.id);
      setFormData({
        azonosito: kpi.azonosito,
        nev: kpi.nev,
        leiras: kpi.leiras || '',
        tipus: kpi.tipus,
        formula: kpi.formula || '',
        parameterek: kpi.parameterek || '',
        egyseg: kpi.egyseg || '',
        celErtek: kpi.celErtek?.toString() || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        azonosito: '',
        nev: '',
        leiras: '',
        tipus: 'NUMBER',
        formula: '',
        parameterek: '',
        egyseg: '',
        celErtek: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.azonosito.trim() || !formData.nev.trim()) {
      setError('Az azonosító és név megadása kötelező');
      return;
    }

    try {
      const url = editingId
        ? `/controlling/kpi/${editingId}`
        : '/controlling/kpi';
      const method = editingId ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingId ? {
          nev: formData.nev,
          leiras: formData.leiras || undefined,
          tipus: formData.tipus,
          formula: formData.formula || undefined,
          parameterek: formData.parameterek || undefined,
          egyseg: formData.egyseg || undefined,
          celErtek: formData.celErtek ? parseFloat(formData.celErtek) : undefined,
        } : {
          azonosito: formData.azonosito,
          nev: formData.nev,
          leiras: formData.leiras || undefined,
          tipus: formData.tipus,
          formula: formData.formula || undefined,
          parameterek: formData.parameterek || undefined,
          egyseg: formData.egyseg || undefined,
          celErtek: formData.celErtek ? parseFloat(formData.celErtek) : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a mentés során');
      }

      setSuccess(editingId ? 'KPI sikeresen frissítve!' : 'KPI sikeresen létrehozva!');
      setTimeout(() => {
        setIsModalOpen(false);
        loadKPIs();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    }
  };

  const handleCalculate = async (id: string) => {
    setCalculatingId(id);
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch(`/controlling/kpi/${id}/calculate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Hiba a számítás során');
      }

      const result = await response.json();
      setSuccess(`KPI értéke: ${result}`);
      loadKPIs();
    } catch (err: any) {
      setError(err.message || 'Hiba a számítás során');
    } finally {
      setCalculatingId(null);
    }
  };

  const handleDelete = async (id: string, nev: string) => {
    if (!confirm(`Biztosan törölni szeretné a "${nev}" KPI-t?`)) {
      return;
    }

    try {
      const response = await apiFetch(`/controlling/kpi/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hiba a törlés során');
      }

      setSuccess('KPI sikeresen törölve!');
      loadKPIs();
    } catch (err: any) {
      setError(err.message || 'Hiba történt a törlés során');
    }
  };

  const handleToggleActive = async (kpi: KPI) => {
    try {
      const response = await apiFetch(`/controlling/kpi/${kpi.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aktiv: !kpi.aktiv,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba az állapot módosításakor');
      }

      setSuccess(`KPI ${!kpi.aktiv ? 'aktiválva' : 'deaktiválva'}!`);
      loadKPIs();
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">KPI (Kulcsfontosságú Mutatószámok)</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új KPI
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Típus</label>
            <select
              value={filters.tipus}
              onChange={(e) => setFilters({ ...filters, tipus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {TIPUSOK.map(t => (
                <option key={t.kod} value={t.kod}>{t.nev}</option>
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

      {/* KPI lista */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : kpis.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs KPI</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Azonosító</th>
                  <th className="text-left p-4 font-medium text-gray-700">Név</th>
                  <th className="text-left p-4 font-medium text-gray-700">Típus</th>
                  <th className="text-left p-4 font-medium text-gray-700">Célérték</th>
                  <th className="text-left p-4 font-medium text-gray-700">Aktuális érték</th>
                  <th className="text-left p-4 font-medium text-gray-700">Mértékegység</th>
                  <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {kpis.map((kpi) => (
                  <tr key={kpi.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{kpi.azonosito}</td>
                    <td className="p-4 font-medium text-gray-900">{kpi.nev}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {TIPUSOK.find(t => t.kod === kpi.tipus)?.nev || kpi.tipus}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {kpi.celErtek !== null && kpi.celErtek !== undefined ? kpi.celErtek.toLocaleString('hu-HU') : '-'}
                    </td>
                    <td className="p-4 text-sm font-medium">
                      {kpi.aktualisErtek !== null && kpi.aktualisErtek !== undefined ? (
                        <span className={kpi.celErtek !== null && kpi.celErtek !== undefined && kpi.aktualisErtek >= kpi.celErtek ? 'text-green-600' : 'text-gray-600'}>
                          {kpi.aktualisErtek.toLocaleString('hu-HU')}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{kpi.egyseg || '-'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleCalculate(kpi.id)}
                        disabled={calculatingId === kpi.id || !kpi.formula}
                        className="text-blue-600 hover:text-blue-800 text-sm mr-2 disabled:text-gray-400"
                      >
                        {calculatingId === kpi.id ? 'Számítás...' : 'Számítás'}
                      </button>
                      <button
                        onClick={() => handleToggleActive(kpi)}
                        className={`text-sm mr-2 ${
                          kpi.aktiv
                            ? 'text-yellow-600 hover:text-yellow-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {kpi.aktiv ? 'Deaktiválás' : 'Aktiválás'}
                      </button>
                      <button
                        onClick={() => handleOpenModal(kpi)}
                        className="text-mbit-blue hover:text-blue-600 text-sm mr-2"
                      >
                        Szerkesztés
                      </button>
                      <button
                        onClick={() => handleDelete(kpi.id, kpi.nev)}
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
        title={editingId ? 'KPI szerkesztése' : 'Új KPI'}
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
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Mértékegység</label>
                <input
                  type="text"
                  value={formData.egyseg}
                  onChange={(e) => setFormData({ ...formData, egyseg: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="pl. HUF, %, db"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Képlet</label>
              <textarea
                value={formData.formula}
                onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="pl. SUM(revenue) / COUNT(orders)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Célérték</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.celErtek}
                  onChange={(e) => setFormData({ ...formData, celErtek: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paraméterek (JSON)</label>
                <input
                  type="text"
                  value={formData.parameterek}
                  onChange={(e) => setFormData({ ...formData, parameterek: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder='{"param1": "value1"}'
                />
              </div>
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

