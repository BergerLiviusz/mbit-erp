import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import Modal from '../components/Modal';

interface BugReport {
  id: string;
  cim: string;
  leiras: string;
  lepesek?: string | null;
  vartEredmeny?: string | null;
  tenylegesEredmeny?: string | null;
  prioritas: string;
  allapot: string;
  kategoria?: string | null;
  modul?: string | null;
  bongeszo?: string | null;
  operaciosRendszer?: string | null;
  screenshotUtvonal?: string | null;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    nev: string;
    email: string;
  } | null;
  comments?: BugReportComment[];
  _count?: {
    comments: number;
  };
}

interface BugReportComment {
  id: string;
  bugReportId: string;
  userId?: string | null;
  szoveg: string;
  createdAt: string;
  user?: {
    id: string;
    nev: string;
    email: string;
  } | null;
}

const PRIORITASOK = [
  { kod: 'LOW', nev: 'Alacsony', szin: 'bg-gray-100 text-gray-800' },
  { kod: 'MEDIUM', nev: 'Közepes', szin: 'bg-blue-100 text-blue-800' },
  { kod: 'HIGH', nev: 'Magas', szin: 'bg-orange-100 text-orange-800' },
  { kod: 'CRITICAL', nev: 'Kritikus', szin: 'bg-red-100 text-red-800' },
];

const ALLAPOTOK = [
  { kod: 'OPEN', nev: 'Nyitott', szin: 'bg-yellow-100 text-yellow-800' },
  { kod: 'IN_PROGRESS', nev: 'Folyamatban', szin: 'bg-blue-100 text-blue-800' },
  { kod: 'RESOLVED', nev: 'Megoldva', szin: 'bg-green-100 text-green-800' },
  { kod: 'CLOSED', nev: 'Lezárva', szin: 'bg-gray-100 text-gray-800' },
];

const KATEGORIAK = [
  'CRM',
  'DMS',
  'LOGISTICS',
  'HR',
  'CONTROLLING',
  'SYSTEM',
  'OTHER',
];

export default function BugReport() {
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBugReport, setSelectedBugReport] = useState<BugReport | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  const [formData, setFormData] = useState({
    cim: '',
    leiras: '',
    lepesek: '',
    vartEredmeny: '',
    tenylegesEredmeny: '',
    prioritas: 'MEDIUM',
    kategoria: '',
    modul: '',
    bongeszo: navigator.userAgent,
    operaciosRendszer: navigator.platform,
  });

  const [filters, setFilters] = useState({
    allapot: '',
    prioritas: '',
    kategoria: '',
  });

  useEffect(() => {
    loadBugReports();
    loadStats();
  }, [filters]);

  const loadBugReports = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.allapot) queryParams.append('allapot', filters.allapot);
      if (filters.prioritas) queryParams.append('prioritas', filters.prioritas);
      if (filters.kategoria) queryParams.append('kategoria', filters.kategoria);

      const response = await apiFetch(`/system/bug-reports?skip=0&take=100&${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setBugReports(data.items || []);
      } else {
        throw new Error('Hiba a hibabejelentések betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiFetch('/system/bug-reports/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Hiba a statisztikák betöltésekor:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.cim.trim()) {
      setError('A cím megadása kötelező');
      return;
    }

    if (!formData.leiras.trim()) {
      setError('A leírás megadása kötelező');
      return;
    }

    try {
      const response = await apiFetch('/system/bug-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          kategoria: formData.kategoria || undefined,
          modul: formData.modul || undefined,
          lepesek: formData.lepesek || undefined,
          vartEredmeny: formData.vartEredmeny || undefined,
          tenylegesEredmeny: formData.tenylegesEredmeny || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a hibabejelentés létrehozásakor');
      }

      setSuccess('Hibabejelentés sikeresen elküldve!');
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({
          cim: '',
          leiras: '',
          lepesek: '',
          vartEredmeny: '',
          tenylegesEredmeny: '',
          prioritas: 'MEDIUM',
          kategoria: '',
          modul: '',
          bongeszo: navigator.userAgent,
          operaciosRendszer: navigator.platform,
        });
        loadBugReports();
        loadStats();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    }
  };

  const handleAddComment = async () => {
    if (!selectedBugReport || !commentText.trim()) {
      setError('A komment szövege nem lehet üres');
      return;
    }

    try {
      const response = await apiFetch(`/system/bug-reports/${selectedBugReport.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          szoveg: commentText,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba a komment hozzáadásakor');
      }

      setCommentText('');
      setIsCommentModalOpen(false);
      loadBugReports();
      if (selectedBugReport) {
        const updated = await apiFetch(`/system/bug-reports/${selectedBugReport.id}`);
        if (updated.ok) {
          const data = await updated.json();
          setSelectedBugReport(data);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const getPrioritasBadge = (prioritas: string) => {
    const p = PRIORITASOK.find(pr => pr.kod === prioritas);
    return p || PRIORITASOK[1];
  };

  const getAllapotBadge = (allapot: string) => {
    const a = ALLAPOTOK.find(al => al.kod === allapot);
    return a || ALLAPOTOK[0];
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hibabejelentés</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új hibabejelentés
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

      {/* Statisztikák */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Összes</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Nyitott</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Folyamatban</div>
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Megoldva</div>
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Lezárva</div>
          <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
        </div>
      </div>

      {/* Szűrők */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Állapot</label>
            <select
              value={filters.allapot}
              onChange={(e) => setFilters({ ...filters, allapot: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {ALLAPOTOK.map(a => (
                <option key={a.kod} value={a.kod}>{a.nev}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioritás</label>
            <select
              value={filters.prioritas}
              onChange={(e) => setFilters({ ...filters, prioritas: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {PRIORITASOK.map(p => (
                <option key={p.kod} value={p.kod}>{p.nev}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategória</label>
            <select
              value={filters.kategoria}
              onChange={(e) => setFilters({ ...filters, kategoria: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {KATEGORIAK.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hibabejelentések lista */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : bugReports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs hibabejelentés</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Cím</th>
                  <th className="text-left p-4 font-medium text-gray-700">Kategória</th>
                  <th className="text-left p-4 font-medium text-gray-700">Prioritás</th>
                  <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                  <th className="text-left p-4 font-medium text-gray-700">Beküldő</th>
                  <th className="text-left p-4 font-medium text-gray-700">Dátum</th>
                  <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bugReports.map((bugReport) => {
                  const prioritasBadge = getPrioritasBadge(bugReport.prioritas);
                  const allapotBadge = getAllapotBadge(bugReport.allapot);
                  
                  return (
                    <tr key={bugReport.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{bugReport.cim}</div>
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {bugReport.leiras}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {bugReport.kategoria || '-'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${prioritasBadge.szin}`}>
                          {prioritasBadge.nev}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${allapotBadge.szin}`}>
                          {allapotBadge.nev}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {bugReport.user?.nev || 'Anonim'}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(bugReport.createdAt).toLocaleDateString('hu-HU')}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedBugReport(bugReport);
                            setIsCommentModalOpen(true);
                          }}
                          className="text-mbit-blue hover:text-blue-600 text-sm mr-2"
                        >
                          Részletek
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

      {/* Új hibabejelentés modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Új hibabejelentés" size="lg">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cím <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cim}
                onChange={(e) => setFormData({ ...formData, cim: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leírás <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.leiras}
                onChange={(e) => setFormData({ ...formData, leiras: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lépések a hiba reprodukálásához
              </label>
              <textarea
                value={formData.lepesek}
                onChange={(e) => setFormData({ ...formData, lepesek: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1. Lépés..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Várt eredmény
                </label>
                <textarea
                  value={formData.vartEredmeny}
                  onChange={(e) => setFormData({ ...formData, vartEredmeny: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tényleges eredmény
                </label>
                <textarea
                  value={formData.tenylegesEredmeny}
                  onChange={(e) => setFormData({ ...formData, tenylegesEredmeny: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioritás
                </label>
                <select
                  value={formData.prioritas}
                  onChange={(e) => setFormData({ ...formData, prioritas: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PRIORITASOK.map(p => (
                    <option key={p.kod} value={p.kod}>{p.nev}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategória
                </label>
                <select
                  value={formData.kategoria}
                  onChange={(e) => setFormData({ ...formData, kategoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Válasszon...</option>
                  {KATEGORIAK.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modul/Oldal
                </label>
                <input
                  type="text"
                  value={formData.modul}
                  onChange={(e) => setFormData({ ...formData, modul: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="pl. CRM, Termékek"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Böngésző
                </label>
                <input
                  type="text"
                  value={formData.bongeszo}
                  onChange={(e) => setFormData({ ...formData, bongeszo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operációs rendszer
                </label>
                <input
                  type="text"
                  value={formData.operaciosRendszer}
                  onChange={(e) => setFormData({ ...formData, operaciosRendszer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                  readOnly
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
                Beküldés
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Részletek és kommentek modal */}
      <Modal
        isOpen={isCommentModalOpen}
        onClose={() => {
          setIsCommentModalOpen(false);
          setSelectedBugReport(null);
          setCommentText('');
        }}
        title={selectedBugReport ? `Hibabejelentés: ${selectedBugReport.cim}` : 'Részletek'}
        size="lg"
      >
        {selectedBugReport && (
          <div className="space-y-4">
            <div>
              <div className="flex gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioritasBadge(selectedBugReport.prioritas).szin}`}>
                  {getPrioritasBadge(selectedBugReport.prioritas).nev}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAllapotBadge(selectedBugReport.allapot).szin}`}>
                  {getAllapotBadge(selectedBugReport.allapot).nev}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Beküldve: {new Date(selectedBugReport.createdAt).toLocaleString('hu-HU')} 
                {selectedBugReport.user && ` - ${selectedBugReport.user.nev}`}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-1">Leírás</h3>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{selectedBugReport.leiras}</div>
            </div>

            {selectedBugReport.lepesek && (
              <div>
                <h3 className="font-medium mb-1">Lépések a reprodukáláshoz</h3>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{selectedBugReport.lepesek}</div>
              </div>
            )}

            {selectedBugReport.vartEredmeny && (
              <div>
                <h3 className="font-medium mb-1">Várt eredmény</h3>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{selectedBugReport.vartEredmeny}</div>
              </div>
            )}

            {selectedBugReport.tenylegesEredmeny && (
              <div>
                <h3 className="font-medium mb-1">Tényleges eredmény</h3>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{selectedBugReport.tenylegesEredmeny}</div>
              </div>
            )}

            {selectedBugReport.kategoria && (
              <div>
                <h3 className="font-medium mb-1">Kategória</h3>
                <div className="text-sm text-gray-700">{selectedBugReport.kategoria}</div>
              </div>
            )}

            {selectedBugReport.modul && (
              <div>
                <h3 className="font-medium mb-1">Modul</h3>
                <div className="text-sm text-gray-700">{selectedBugReport.modul}</div>
              </div>
            )}

            {/* Kommentek */}
            <div>
              <h3 className="font-medium mb-2">Kommentek ({selectedBugReport.comments?.length || 0})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedBugReport.comments && selectedBugReport.comments.length > 0 ? (
                  selectedBugReport.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-500 mb-1">
                        {comment.user?.nev || 'Anonim'} - {new Date(comment.createdAt).toLocaleString('hu-HU')}
                      </div>
                      <div className="text-sm text-gray-700">{comment.szoveg}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">Még nincsenek kommentek</div>
                )}
              </div>
            </div>

            {/* Új komment */}
            <div>
              <h3 className="font-medium mb-2">Új komment</h3>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Írja be a kommentjét..."
              />
              <button
                onClick={handleAddComment}
                className="mt-2 px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600"
              >
                Komment hozzáadása
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

