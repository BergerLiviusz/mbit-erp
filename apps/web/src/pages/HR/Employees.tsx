import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import Modal from '../../components/Modal';

interface Employee {
  id: string;
  azonosito: string;
  vezetekNev: string;
  keresztNev: string;
  szuletesiDatum?: string | null;
  tajSzam?: string | null;
  email?: string | null;
  telefon?: string | null;
  munkaviszonyKezdete?: string | null;
  munkaviszonyTipusa?: string | null;
  jobPositionId?: string | null;
  osztaly?: string | null;
  reszleg?: string | null;
  aktiv: boolean;
  jobPosition?: {
    id: string;
    nev: string;
  } | null;
  _count?: {
    educations: number;
    languageSkills: number;
    medicalExaminations: number;
    disciplinaryActions: number;
    studyContracts: number;
    employmentContracts: number;
    previousEmployments?: number;
    awards?: number;
  };
  previousEmployments?: { id: string; munkaadoNev: string; munkakor?: string | null; kezdet?: string | null; veg?: string | null }[];
  awards?: { id: string; megnevezes: string; datum: string; intezmeny?: string | null }[];
}

interface JobPosition {
  id: string;
  nev: string;
  azonosito: string;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    azonosito: '',
    vezetekNev: '',
    keresztNev: '',
    szuletesiDatum: '',
    szuletesiHely: '',
    tajSzam: '',
    szemelyiIgazolvanySzam: '',
    lakcim: '',
    tartozkodasiCim: '',
    telefon: '',
    email: '',
    munkaviszonyKezdete: '',
    munkaviszonyVege: '',
    munkaviszonyTipusa: '',
    jobPositionId: '',
    osztaly: '',
    reszleg: '',
    aktiv: true,
  });

  const [filters, setFilters] = useState({
    jobPositionId: '',
    osztaly: '',
    reszleg: '',
    aktiv: '',
    search: '',
  });

  const [peForm, setPeForm] = useState({ munkaadoNev: '', munkakor: '', kezdet: '', veg: '' });
  const [awardForm, setAwardForm] = useState({ megnevezes: '', datum: '', intezmeny: '' });

  useEffect(() => {
    loadJobPositions();
    loadEmployees();
  }, [filters]);

  const loadJobPositions = async () => {
    try {
      const response = await apiFetch('/hr/job-positions?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setJobPositions(data.items || []);
      }
    } catch (err) {
      console.error('Hiba a munkakörök betöltésekor:', err);
    }
  };

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.jobPositionId) queryParams.append('jobPositionId', filters.jobPositionId);
      if (filters.osztaly) queryParams.append('osztaly', filters.osztaly);
      if (filters.reszleg) queryParams.append('reszleg', filters.reszleg);
      if (filters.aktiv) queryParams.append('aktiv', filters.aktiv);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await apiFetch(`/hr/employees?skip=0&take=100&${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.items || []);
      } else {
        throw new Error('Hiba a dolgozók betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeDetails = async (id: string) => {
    try {
      const response = await apiFetch(`/hr/employees/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedEmployee(data);
        setIsDetailModalOpen(true);
      }
    } catch (err: any) {
      setError(err.message || 'Hiba a részletek betöltésekor');
    }
  };

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingId(employee.id);
      setFormData({
        azonosito: employee.azonosito,
        vezetekNev: employee.vezetekNev,
        keresztNev: employee.keresztNev,
        szuletesiDatum: employee.szuletesiDatum ? employee.szuletesiDatum.split('T')[0] : '',
        szuletesiHely: '',
        tajSzam: employee.tajSzam || '',
        szemelyiIgazolvanySzam: '',
        lakcim: '',
        tartozkodasiCim: '',
        telefon: employee.telefon || '',
        email: employee.email || '',
        munkaviszonyKezdete: employee.munkaviszonyKezdete ? employee.munkaviszonyKezdete.split('T')[0] : '',
        munkaviszonyVege: '',
        munkaviszonyTipusa: employee.munkaviszonyTipusa || '',
        jobPositionId: employee.jobPositionId || '',
        osztaly: employee.osztaly || '',
        reszleg: employee.reszleg || '',
        aktiv: employee.aktiv,
      });
    } else {
      setEditingId(null);
      setFormData({
        azonosito: '',
        vezetekNev: '',
        keresztNev: '',
        szuletesiDatum: '',
        szuletesiHely: '',
        tajSzam: '',
        szemelyiIgazolvanySzam: '',
        lakcim: '',
        tartozkodasiCim: '',
        telefon: '',
        email: '',
        munkaviszonyKezdete: '',
        munkaviszonyVege: '',
        munkaviszonyTipusa: '',
        jobPositionId: '',
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

    if (!formData.vezetekNev.trim() || !formData.keresztNev.trim()) {
      setError('A név megadása kötelező');
      return;
    }

    try {
      const url = editingId
        ? `/hr/employees/${editingId}`
        : '/hr/employees';
      const method = editingId ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingId ? {
          vezetekNev: formData.vezetekNev,
          keresztNev: formData.keresztNev,
          szuletesiDatum: formData.szuletesiDatum || undefined,
          szuletesiHely: formData.szuletesiHely || undefined,
          tajSzam: formData.tajSzam || undefined,
          szemelyiIgazolvanySzam: formData.szemelyiIgazolvanySzam || undefined,
          lakcim: formData.lakcim || undefined,
          tartozkodasiCim: formData.tartozkodasiCim || undefined,
          telefon: formData.telefon || undefined,
          email: formData.email || undefined,
          munkaviszonyKezdete: formData.munkaviszonyKezdete || undefined,
          munkaviszonyVege: formData.munkaviszonyVege || undefined,
          munkaviszonyTipusa: formData.munkaviszonyTipusa || undefined,
          jobPositionId: formData.jobPositionId || undefined,
          osztaly: formData.osztaly || undefined,
          reszleg: formData.reszleg || undefined,
          aktiv: formData.aktiv,
        } : formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a mentés során');
      }

      setSuccess(editingId ? 'Dolgozó sikeresen frissítve!' : 'Dolgozó sikeresen létrehozva!');
      setTimeout(() => {
        setIsModalOpen(false);
        loadEmployees();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    }
  };

  const handleDelete = async (id: string, nev: string) => {
    if (!confirm(`Biztosan törölni szeretné a "${nev}" dolgozót?`)) {
      return;
    }

    try {
      const response = await apiFetch(`/hr/employees/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hiba a törlés során');
      }

      setSuccess('Dolgozó sikeresen törölve!');
      loadEmployees();
    } catch (err: any) {
      setError(err.message || 'Hiba történt a törlés során');
    }
  };

  const uniqueOsztalyok = Array.from(new Set(employees.map(e => e.osztaly).filter(Boolean))) as string[];
  const uniqueReszlegek = Array.from(new Set(employees.map(e => e.reszleg).filter(Boolean))) as string[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dolgozók</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új dolgozó
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
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keresés</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Név, azonosító..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Munkakör</label>
            <select
              value={filters.jobPositionId}
              onChange={(e) => setFilters({ ...filters, jobPositionId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {jobPositions.map(p => (
                <option key={p.id} value={p.id}>{p.nev}</option>
              ))}
            </select>
          </div>
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

      {/* Dolgozók lista */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs dolgozó</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Azonosító</th>
                  <th className="text-left p-4 font-medium text-gray-700">Név</th>
                  <th className="text-left p-4 font-medium text-gray-700">Munkakör</th>
                  <th className="text-left p-4 font-medium text-gray-700">Email</th>
                  <th className="text-left p-4 font-medium text-gray-700">Telefon</th>
                  <th className="text-left p-4 font-medium text-gray-700">Munkaviszony kezdete</th>
                  <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                  <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{employee.azonosito}</td>
                    <td className="p-4">
                      {employee.vezetekNev} {employee.keresztNev}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {employee.jobPosition?.nev || '-'}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{employee.email || '-'}</td>
                    <td className="p-4 text-sm text-gray-600">{employee.telefon || '-'}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {employee.munkaviszonyKezdete
                        ? new Date(employee.munkaviszonyKezdete).toLocaleDateString('hu-HU')
                        : '-'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.aktiv ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {employee.aktiv ? 'Aktív' : 'Inaktív'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => loadEmployeeDetails(employee.id)}
                        className="text-mbit-blue hover:text-blue-600 text-sm mr-3"
                      >
                        Részletek
                      </button>
                      <button
                        onClick={() => handleOpenModal(employee)}
                        className="text-mbit-blue hover:text-blue-600 text-sm mr-3"
                      >
                        Szerkesztés
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id, `${employee.vezetekNev} ${employee.keresztNev}`)}
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
        title={editingId ? 'Dolgozó szerkesztése' : 'Új dolgozó'}
        size="xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vezetéknév <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vezetekNev}
                  onChange={(e) => setFormData({ ...formData, vezetekNev: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keresztnév <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.keresztNev}
                  onChange={(e) => setFormData({ ...formData, keresztNev: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Születési dátum</label>
                <input
                  type="date"
                  value={formData.szuletesiDatum}
                  onChange={(e) => setFormData({ ...formData, szuletesiDatum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Születési hely</label>
                <input
                  type="text"
                  value={formData.szuletesiHely}
                  onChange={(e) => setFormData({ ...formData, szuletesiHely: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TAJ szám</label>
                <input
                  type="text"
                  value={formData.tajSzam}
                  onChange={(e) => setFormData({ ...formData, tajSzam: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Személyi igazolvány szám</label>
                <input
                  type="text"
                  value={formData.szemelyiIgazolvanySzam}
                  onChange={(e) => setFormData({ ...formData, szemelyiIgazolvanySzam: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lakcím</label>
              <input
                type="text"
                value={formData.lakcim}
                onChange={(e) => setFormData({ ...formData, lakcim: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tartózkodási cím</label>
              <input
                type="text"
                value={formData.tartozkodasiCim}
                onChange={(e) => setFormData({ ...formData, tartozkodasiCim: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Munkaviszony kezdete</label>
                <input
                  type="date"
                  value={formData.munkaviszonyKezdete}
                  onChange={(e) => setFormData({ ...formData, munkaviszonyKezdete: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Munkaviszony vége</label>
                <input
                  type="date"
                  value={formData.munkaviszonyVege}
                  onChange={(e) => setFormData({ ...formData, munkaviszonyVege: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Munkaviszony típusa</label>
                <select
                  value={formData.munkaviszonyTipusa}
                  onChange={(e) => setFormData({ ...formData, munkaviszonyTipusa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Válasszon...</option>
                  <option value="HATAROZATLAN">Határozatlan</option>
                  <option value="HATAROZOTT">Határozott</option>
                  <option value="RESZIDOS">Részidős</option>
                  <option value="DIJAZAS">Díjazás</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Munkakör</label>
                <select
                  value={formData.jobPositionId}
                  onChange={(e) => setFormData({ ...formData, jobPositionId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Válasszon...</option>
                  {jobPositions.map(p => (
                    <option key={p.id} value={p.id}>{p.nev}</option>
                  ))}
                </select>
              </div>
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

      {/* Részletek modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedEmployee(null);
        }}
        title={selectedEmployee ? `Dolgozó: ${selectedEmployee.vezetekNev} ${selectedEmployee.keresztNev}` : 'Részletek'}
        size="xl"
      >
        {selectedEmployee && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Azonosító</div>
                <div className="font-medium">{selectedEmployee.azonosito}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Munkakör</div>
                <div className="font-medium">{selectedEmployee.jobPosition?.nev || '-'}</div>
              </div>
            </div>

            {selectedEmployee._count && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-gray-600">Végzettségek</div>
                  <div className="font-medium">{selectedEmployee._count.educations || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Nyelvtudás</div>
                  <div className="font-medium">{selectedEmployee._count.languageSkills || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Orvosi vizsgálatok</div>
                  <div className="font-medium">{selectedEmployee._count.medicalExaminations || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Fegyelmi elemek</div>
                  <div className="font-medium">{selectedEmployee._count.disciplinaryActions || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Tanulmányi szerződések</div>
                  <div className="font-medium">{selectedEmployee._count.studyContracts || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Munkaszerződések</div>
                  <div className="font-medium">{selectedEmployee._count.employmentContracts || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Korábbi munkahelyek</div>
                  <div className="font-medium">{selectedEmployee._count.previousEmployments ?? 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Kitüntetések</div>
                  <div className="font-medium">{selectedEmployee._count.awards ?? 0}</div>
                </div>
              </div>
            )}

            {selectedEmployee.previousEmployments && selectedEmployee.previousEmployments.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Korábbi munkahelyek</h3>
                <ul className="text-sm space-y-1">
                  {selectedEmployee.previousEmployments.map((p) => (
                    <li key={p.id} className="flex justify-between gap-2 border-b border-gray-100 pb-1">
                      <span>{p.munkaadoNev} {p.munkakor ? `– ${p.munkakor}` : ''}</span>
                      <button
                        type="button"
                        className="text-red-600 text-xs"
                        onClick={async () => {
                          await apiFetch(`/hr/employees/previous-employments/${p.id}`, { method: 'DELETE' });
                          loadEmployeeDetails(selectedEmployee.id);
                        }}
                      >
                        Törlés
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedEmployee.awards && selectedEmployee.awards.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Kitüntetések</h3>
                <ul className="text-sm space-y-1">
                  {selectedEmployee.awards.map((a) => (
                    <li key={a.id} className="flex justify-between gap-2 border-b border-gray-100 pb-1">
                      <span>{a.megnevezes} ({a.datum?.slice(0, 10)})</span>
                      <button
                        type="button"
                        className="text-red-600 text-xs"
                        onClick={async () => {
                          await apiFetch(`/hr/employees/awards/${a.id}`, { method: 'DELETE' });
                          loadEmployeeDetails(selectedEmployee.id);
                        }}
                      >
                        Törlés
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t space-y-3">
              <h3 className="font-medium">Új korábbi munkahely</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <input
                  placeholder="Munkáltató"
                  className="border rounded px-2 py-1"
                  value={peForm.munkaadoNev}
                  onChange={(e) => setPeForm({ ...peForm, munkaadoNev: e.target.value })}
                />
                <input
                  placeholder="Munkakör"
                  className="border rounded px-2 py-1"
                  value={peForm.munkakor}
                  onChange={(e) => setPeForm({ ...peForm, munkakor: e.target.value })}
                />
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={peForm.kezdet}
                  onChange={(e) => setPeForm({ ...peForm, kezdet: e.target.value })}
                />
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={peForm.veg}
                  onChange={(e) => setPeForm({ ...peForm, veg: e.target.value })}
                />
              </div>
              <button
                type="button"
                className="px-3 py-1 bg-gray-800 text-white rounded text-sm"
                onClick={async () => {
                  if (!peForm.munkaadoNev.trim()) return;
                  const r = await apiFetch(`/hr/employees/${selectedEmployee.id}/previous-employments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      munkaadoNev: peForm.munkaadoNev,
                      munkakor: peForm.munkakor || undefined,
                      kezdet: peForm.kezdet || undefined,
                      veg: peForm.veg || undefined,
                    }),
                  });
                  if (r.ok) {
                    setPeForm({ munkaadoNev: '', munkakor: '', kezdet: '', veg: '' });
                    loadEmployeeDetails(selectedEmployee.id);
                  }
                }}
              >
                Hozzáadás
              </button>

              <h3 className="font-medium pt-2">Új kitüntetés</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <input
                  placeholder="Megnevezés"
                  className="border rounded px-2 py-1"
                  value={awardForm.megnevezes}
                  onChange={(e) => setAwardForm({ ...awardForm, megnevezes: e.target.value })}
                />
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={awardForm.datum}
                  onChange={(e) => setAwardForm({ ...awardForm, datum: e.target.value })}
                />
                <input
                  placeholder="Intézmény"
                  className="border rounded px-2 py-1 col-span-2"
                  value={awardForm.intezmeny}
                  onChange={(e) => setAwardForm({ ...awardForm, intezmeny: e.target.value })}
                />
              </div>
              <button
                type="button"
                className="px-3 py-1 bg-gray-800 text-white rounded text-sm"
                onClick={async () => {
                  if (!awardForm.megnevezes.trim() || !awardForm.datum) return;
                  const r = await apiFetch(`/hr/employees/${selectedEmployee.id}/awards`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      megnevezes: awardForm.megnevezes,
                      datum: awardForm.datum,
                      intezmeny: awardForm.intezmeny || undefined,
                    }),
                  });
                  if (r.ok) {
                    setAwardForm({ megnevezes: '', datum: '', intezmeny: '' });
                    loadEmployeeDetails(selectedEmployee.id);
                  }
                }}
              >
                Hozzáadás
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

