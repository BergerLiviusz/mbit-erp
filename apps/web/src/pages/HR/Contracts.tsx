import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import Modal from '../../components/Modal';

interface EmploymentContract {
  id: string;
  employeeId: string;
  szerzodesSzam: string;
  tipus: string;
  kezdetDatum: string;
  vegDatum?: string | null;
  probaidoVege?: string | null;
  fizetes?: number | null;
  megjegyzesek?: string | null;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    azonosito: string;
    vezetekNev: string;
    keresztNev: string;
  };
  amendments?: ContractAmendment[];
  _count?: {
    amendments: number;
  };
}

interface ContractAmendment {
  id: string;
  employmentContractId: string;
  datum: string;
  tipus: string;
  leiras: string;
  ujFizetes?: number | null;
  ujVegDatum?: string | null;
  megjegyzesek?: string | null;
}

interface Employee {
  id: string;
  azonosito: string;
  vezetekNev: string;
  keresztNev: string;
}

const TIPUSOK = [
  { kod: 'HATAROZATLAN', nev: 'Határozatlan idejű' },
  { kod: 'HATAROZOTT', nev: 'Határozott idejű' },
  { kod: 'RESZIDOS', nev: 'Részidős' },
  { kod: 'DIJAZAS', nev: 'Díjazás' },
];

const AMENDMENT_TIPUSOK = [
  { kod: 'MODOSITAS', nev: 'Módosítás' },
  { kod: 'KIEGESZITES', nev: 'Kiegészítés' },
  { kod: 'MEGSZUNES', nev: 'Megszűnés' },
  { kod: 'FIZETESEMELES', nev: 'Fizetésemelés' },
  { kod: 'FIZETESCSOKKENES', nev: 'Fizetéscsökkenés' },
];

export default function Contracts() {
  const [contracts, setContracts] = useState<EmploymentContract[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAmendmentModalOpen, setIsAmendmentModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<EmploymentContract | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    szerzodesSzam: '',
    tipus: 'HATAROZATLAN',
    kezdetDatum: '',
    vegDatum: '',
    probaidoVege: '',
    fizetes: '',
    megjegyzesek: '',
  });

  const [amendmentFormData, setAmendmentFormData] = useState({
    datum: new Date().toISOString().split('T')[0],
    tipus: 'MODOSITAS',
    leiras: '',
    ujFizetes: '',
    ujVegDatum: '',
    megjegyzesek: '',
  });

  const [filters, setFilters] = useState({
    employeeId: '',
    tipus: '',
    aktiv: '',
  });

  useEffect(() => {
    loadEmployees();
    loadContracts();
  }, [filters]);

  const loadEmployees = async () => {
    try {
      const response = await apiFetch('/hr/employees?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.items || []);
      }
    } catch (err) {
      console.error('Hiba a dolgozók betöltésekor:', err);
    }
  };

  const loadContracts = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);
      if (filters.tipus) queryParams.append('tipus', filters.tipus);
      if (filters.aktiv) queryParams.append('aktiv', filters.aktiv);

      const response = await apiFetch(`/hr/contracts?skip=0&take=100&${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setContracts(data.items || []);
      } else {
        throw new Error('Hiba a szerződések betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const loadContractDetails = async (id: string) => {
    try {
      const response = await apiFetch(`/hr/contracts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedContract(data);
        setIsDetailModalOpen(true);
      }
    } catch (err: any) {
      setError(err.message || 'Hiba a részletek betöltésekor');
    }
  };

  const handleOpenModal = (contract?: EmploymentContract) => {
    if (contract) {
      setEditingId(contract.id);
      setFormData({
        employeeId: contract.employeeId,
        szerzodesSzam: contract.szerzodesSzam,
        tipus: contract.tipus,
        kezdetDatum: contract.kezdetDatum.split('T')[0],
        vegDatum: contract.vegDatum ? contract.vegDatum.split('T')[0] : '',
        probaidoVege: contract.probaidoVege ? contract.probaidoVege.split('T')[0] : '',
        fizetes: contract.fizetes?.toString() || '',
        megjegyzesek: contract.megjegyzesek || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        employeeId: '',
        szerzodesSzam: '',
        tipus: 'HATAROZATLAN',
        kezdetDatum: '',
        vegDatum: '',
        probaidoVege: '',
        fizetes: '',
        megjegyzesek: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.employeeId) {
      setError('A dolgozó kiválasztása kötelező');
      return;
    }

    if (!formData.szerzodesSzam.trim()) {
      setError('A szerződésszám megadása kötelező');
      return;
    }

    if (!formData.kezdetDatum) {
      setError('A kezdetdátum megadása kötelező');
      return;
    }

    try {
      const url = editingId
        ? `/hr/contracts/${editingId}`
        : '/hr/contracts';
      const method = editingId ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingId ? {
          tipus: formData.tipus,
          vegDatum: formData.vegDatum || undefined,
          probaidoVege: formData.probaidoVege || undefined,
          fizetes: formData.fizetes ? parseFloat(formData.fizetes) : undefined,
          megjegyzesek: formData.megjegyzesek || undefined,
        } : {
          employeeId: formData.employeeId,
          szerzodesSzam: formData.szerzodesSzam,
          tipus: formData.tipus,
          kezdetDatum: formData.kezdetDatum,
          vegDatum: formData.vegDatum || undefined,
          probaidoVege: formData.probaidoVege || undefined,
          fizetes: formData.fizetes ? parseFloat(formData.fizetes) : undefined,
          megjegyzesek: formData.megjegyzesek || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a mentés során');
      }

      setSuccess(editingId ? 'Szerződés sikeresen frissítve!' : 'Szerződés sikeresen létrehozva!');
      setTimeout(() => {
        setIsModalOpen(false);
        loadContracts();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    }
  };

  const handleOpenAmendmentModal = (contract: EmploymentContract) => {
    setSelectedContract(contract);
    setAmendmentFormData({
      datum: new Date().toISOString().split('T')[0],
      tipus: 'MODOSITAS',
      leiras: '',
      ujFizetes: '',
      ujVegDatum: '',
      megjegyzesek: '',
    });
    setIsAmendmentModalOpen(true);
  };

  const handleSubmitAmendment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedContract) {
      setError('Nincs kiválasztott szerződés');
      return;
    }

    if (!amendmentFormData.leiras.trim()) {
      setError('A leírás megadása kötelező');
      return;
    }

    try {
      const response = await apiFetch(`/hr/contracts/${selectedContract.id}/amendments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datum: amendmentFormData.datum,
          tipus: amendmentFormData.tipus,
          leiras: amendmentFormData.leiras,
          ujFizetes: amendmentFormData.ujFizetes ? parseFloat(amendmentFormData.ujFizetes) : undefined,
          ujVegDatum: amendmentFormData.ujVegDatum || undefined,
          megjegyzesek: amendmentFormData.megjegyzesek || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a módosítás hozzáadásakor');
      }

      setSuccess('Szerződés módosítás sikeresen hozzáadva!');
      setTimeout(() => {
        setIsAmendmentModalOpen(false);
        loadContracts();
        if (selectedContract) {
          loadContractDetails(selectedContract.id);
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleDelete = async (id: string, szerzodesSzam: string) => {
    if (!confirm(`Biztosan törölni szeretné a "${szerzodesSzam}" szerződést?`)) {
      return;
    }

    try {
      const response = await apiFetch(`/hr/contracts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hiba a törlés során');
      }

      setSuccess('Szerződés sikeresen törölve!');
      loadContracts();
    } catch (err: any) {
      setError(err.message || 'Hiba történt a törlés során');
    }
  };

  const loadExpiringContracts = async () => {
    try {
      const response = await apiFetch('/hr/contracts/expiring?days=30');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          alert(`${data.length} szerződés lejár 30 napon belül!`);
        }
      }
    } catch (err) {
      console.error('Hiba a lejáró szerződések betöltésekor:', err);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Munkaszerződések</h1>
        <div className="flex gap-2">
          <button
            onClick={loadExpiringContracts}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Lejáró szerződések
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Új szerződés
          </button>
        </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Dolgozó</label>
            <select
              value={filters.employeeId}
              onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.vezetekNev} {e.keresztNev} ({e.azonosito})
                </option>
              ))}
            </select>
          </div>
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
              <option value="false">Lejárt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Szerződések lista */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : contracts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs szerződés</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Szerződésszám</th>
                  <th className="text-left p-4 font-medium text-gray-700">Dolgozó</th>
                  <th className="text-left p-4 font-medium text-gray-700">Típus</th>
                  <th className="text-left p-4 font-medium text-gray-700">Kezdet</th>
                  <th className="text-left p-4 font-medium text-gray-700">Vég</th>
                  <th className="text-left p-4 font-medium text-gray-700">Fizetés</th>
                  <th className="text-left p-4 font-medium text-gray-700">Módosítások</th>
                  <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {contracts.map((contract) => {
                  const isActive = !contract.vegDatum || new Date(contract.vegDatum) > new Date();
                  
                  return (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{contract.szerzodesSzam}</td>
                      <td className="p-4">
                        {contract.employee
                          ? `${contract.employee.vezetekNev} ${contract.employee.keresztNev}`
                          : '-'}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {TIPUSOK.find(t => t.kod === contract.tipus)?.nev || contract.tipus}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(contract.kezdetDatum).toLocaleDateString('hu-HU')}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {contract.vegDatum
                          ? new Date(contract.vegDatum).toLocaleDateString('hu-HU')
                          : '-'}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {contract.fizetes
                          ? `${contract.fizetes.toLocaleString('hu-HU')} HUF`
                          : '-'}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {contract._count?.amendments || contract.amendments?.length || 0}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedContract(contract);
                            loadContractDetails(contract.id);
                          }}
                          className="text-mbit-blue hover:text-blue-600 text-sm mr-2"
                        >
                          Részletek
                        </button>
                        <button
                          onClick={() => handleOpenAmendmentModal(contract)}
                          className="text-green-600 hover:text-green-800 text-sm mr-2"
                        >
                          Módosítás
                        </button>
                        <button
                          onClick={() => handleOpenModal(contract)}
                          className="text-mbit-blue hover:text-blue-600 text-sm mr-2"
                        >
                          Szerkesztés
                        </button>
                        <button
                          onClick={() => handleDelete(contract.id, contract.szerzodesSzam)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Törlés
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Új/Szerkesztés modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Szerződés szerkesztése' : 'Új szerződés'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!editingId && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dolgozó <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Válasszon dolgozót...</option>
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.vezetekNev} {e.keresztNev} ({e.azonosito})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Szerződésszám <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.szerzodesSzam}
                    onChange={(e) => setFormData({ ...formData, szerzodesSzam: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )}

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kezdetdátum <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.kezdetDatum}
                  onChange={(e) => setFormData({ ...formData, kezdetDatum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Végdátum</label>
                <input
                  type="date"
                  value={formData.vegDatum}
                  onChange={(e) => setFormData({ ...formData, vegDatum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Próbaidő vége</label>
                <input
                  type="date"
                  value={formData.probaidoVege}
                  onChange={(e) => setFormData({ ...formData, probaidoVege: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fizetés (HUF)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.fizetes}
                  onChange={(e) => setFormData({ ...formData, fizetes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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

      {/* Módosítás modal */}
      <Modal
        isOpen={isAmendmentModalOpen}
        onClose={() => setIsAmendmentModalOpen(false)}
        title={selectedContract ? `Szerződés módosítás: ${selectedContract.szerzodesSzam}` : 'Szerződés módosítás'}
        size="lg"
      >
        <form onSubmit={handleSubmitAmendment}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dátum <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={amendmentFormData.datum}
                onChange={(e) => setAmendmentFormData({ ...amendmentFormData, datum: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Típus <span className="text-red-500">*</span>
              </label>
              <select
                value={amendmentFormData.tipus}
                onChange={(e) => setAmendmentFormData({ ...amendmentFormData, tipus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {AMENDMENT_TIPUSOK.map(t => (
                  <option key={t.kod} value={t.kod}>{t.nev}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leírás <span className="text-red-500">*</span>
              </label>
              <textarea
                value={amendmentFormData.leiras}
                onChange={(e) => setAmendmentFormData({ ...amendmentFormData, leiras: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Új fizetés (HUF)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amendmentFormData.ujFizetes}
                  onChange={(e) => setAmendmentFormData({ ...amendmentFormData, ujFizetes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Új végdátum</label>
                <input
                  type="date"
                  value={amendmentFormData.ujVegDatum}
                  onChange={(e) => setAmendmentFormData({ ...amendmentFormData, ujVegDatum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Megjegyzések</label>
              <textarea
                value={amendmentFormData.megjegyzesek}
                onChange={(e) => setAmendmentFormData({ ...amendmentFormData, megjegyzesek: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsAmendmentModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Hozzáadás
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Részletek modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedContract(null);
        }}
        title={selectedContract ? `Szerződés részletek: ${selectedContract.szerzodesSzam}` : 'Részletek'}
        size="lg"
      >
        {selectedContract && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Dolgozó</div>
                <div className="font-medium">
                  {selectedContract.employee
                    ? `${selectedContract.employee.vezetekNev} ${selectedContract.employee.keresztNev}`
                    : '-'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Típus</div>
                <div className="font-medium">
                  {TIPUSOK.find(t => t.kod === selectedContract.tipus)?.nev || selectedContract.tipus}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Kezdetdátum</div>
                <div className="font-medium">
                  {new Date(selectedContract.kezdetDatum).toLocaleDateString('hu-HU')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Végdátum</div>
                <div className="font-medium">
                  {selectedContract.vegDatum
                    ? new Date(selectedContract.vegDatum).toLocaleDateString('hu-HU')
                    : '-'}
                </div>
              </div>
              {selectedContract.probaidoVege && (
                <div>
                  <div className="text-sm text-gray-600">Próbaidő vége</div>
                  <div className="font-medium">
                    {new Date(selectedContract.probaidoVege).toLocaleDateString('hu-HU')}
                  </div>
                </div>
              )}
              {selectedContract.fizetes && (
                <div>
                  <div className="text-sm text-gray-600">Fizetés</div>
                  <div className="font-medium">
                    {selectedContract.fizetes.toLocaleString('hu-HU')} HUF
                  </div>
                </div>
              )}
            </div>

            {selectedContract.megjegyzesek && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Megjegyzések</div>
                <div className="text-sm">{selectedContract.megjegyzesek}</div>
              </div>
            )}

            {selectedContract.amendments && selectedContract.amendments.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Szerződés módosítások</h3>
                <div className="space-y-2">
                  {selectedContract.amendments.map((amendment) => (
                    <div key={amendment.id} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-sm">
                          {AMENDMENT_TIPUSOK.find(t => t.kod === amendment.tipus)?.nev || amendment.tipus}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(amendment.datum).toLocaleDateString('hu-HU')}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">{amendment.leiras}</div>
                      {(amendment.ujFizetes || amendment.ujVegDatum) && (
                        <div className="text-xs text-gray-500 mt-1">
                          {amendment.ujFizetes && `Új fizetés: ${amendment.ujFizetes.toLocaleString('hu-HU')} HUF`}
                          {amendment.ujFizetes && amendment.ujVegDatum && ' | '}
                          {amendment.ujVegDatum && `Új végdátum: ${new Date(amendment.ujVegDatum).toLocaleDateString('hu-HU')}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

