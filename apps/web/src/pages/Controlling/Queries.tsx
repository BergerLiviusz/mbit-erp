import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import Modal from '../../components/Modal';

interface QueryTemplate {
  id: string;
  azonosito: string;
  nev: string;
  leiras?: string | null;
  query: string;
  parameterek?: string | null;
  kategoria?: string | null;
  aktiv: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdHocQuery {
  id: string;
  nev: string;
  leiras?: string | null;
  query: string;
  parameterek?: string | null;
  eredmeny?: string | null;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    nev: string;
    email: string;
  } | null;
}

export default function Queries() {
  const [activeTab, setActiveTab] = useState<'templates' | 'ad-hoc'>('templates');
  const [templates, setTemplates] = useState<QueryTemplate[]>([]);
  const [adHocQueries, setAdHocQueries] = useState<AdHocQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<QueryTemplate | null>(null);
  const [executing, setExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<any[]>([]);

  const [templateFormData, setTemplateFormData] = useState({
    azonosito: '',
    nev: '',
    leiras: '',
    query: '',
    parameterek: '',
    kategoria: '',
  });

  const [adHocFormData, setAdHocFormData] = useState({
    nev: '',
    leiras: '',
    query: '',
    parameterek: '',
  });

  const [executeFormData, setExecuteFormData] = useState({
    query: '',
    parameterek: '',
  });

  const [filters, setFilters] = useState({
    kategoria: '',
    aktiv: '',
  });

  useEffect(() => {
    if (activeTab === 'templates') {
      loadTemplates();
    } else {
      loadAdHocQueries();
    }
  }, [activeTab, filters]);

  const loadTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.kategoria) queryParams.append('kategoria', filters.kategoria);
      if (filters.aktiv) queryParams.append('aktiv', filters.aktiv);

      const response = await apiFetch(`/controlling/queries/templates?skip=0&take=100&${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.items || []);
      } else {
        throw new Error('Hiba a sablonok betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const loadAdHocQueries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiFetch('/controlling/queries/ad-hoc?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setAdHocQueries(data.items || []);
      } else {
        throw new Error('Hiba a lekérdezések betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTemplateModal = (template?: QueryTemplate) => {
    if (template) {
      setEditingId(template.id);
      setTemplateFormData({
        azonosito: template.azonosito,
        nev: template.nev,
        leiras: template.leiras || '',
        query: template.query,
        parameterek: template.parameterek || '',
        kategoria: template.kategoria || '',
      });
    } else {
      setEditingId(null);
      setTemplateFormData({
        azonosito: '',
        nev: '',
        leiras: '',
        query: '',
        parameterek: '',
        kategoria: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmitTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!templateFormData.azonosito.trim() || !templateFormData.nev.trim() || !templateFormData.query.trim()) {
      setError('Az azonosító, név és lekérdezés megadása kötelező');
      return;
    }

    try {
      const url = editingId
        ? `/controlling/queries/templates/${editingId}`
        : '/controlling/queries/templates';
      const method = editingId ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingId ? {
          nev: templateFormData.nev,
          leiras: templateFormData.leiras || undefined,
          query: templateFormData.query,
          parameterek: templateFormData.parameterek || undefined,
          kategoria: templateFormData.kategoria || undefined,
        } : {
          azonosito: templateFormData.azonosito,
          nev: templateFormData.nev,
          leiras: templateFormData.leiras || undefined,
          query: templateFormData.query,
          parameterek: templateFormData.parameterek || undefined,
          kategoria: templateFormData.kategoria || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a mentés során');
      }

      setSuccess(editingId ? 'Sablon sikeresen frissítve!' : 'Sablon sikeresen létrehozva!');
      setTimeout(() => {
        setIsModalOpen(false);
        loadTemplates();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    }
  };

  const handleSubmitAdHoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!adHocFormData.nev.trim() || !adHocFormData.query.trim()) {
      setError('A név és lekérdezés megadása kötelező');
      return;
    }

    try {
      const response = await apiFetch('/controlling/queries/ad-hoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nev: adHocFormData.nev,
          leiras: adHocFormData.leiras || undefined,
          query: adHocFormData.query,
          parameterek: adHocFormData.parameterek || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a mentés során');
      }

      setSuccess('Lekérdezés sikeresen létrehozva!');
      setTimeout(() => {
        setIsModalOpen(false);
        setAdHocFormData({
          nev: '',
          leiras: '',
          query: '',
          parameterek: '',
        });
        loadAdHocQueries();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    }
  };

  const handleExecuteQuery = async () => {
    setExecuting(true);
    setError('');
    setSuccess('');
    setQueryResult([]);

    try {
      const response = await apiFetch('/controlling/queries/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: executeFormData.query,
          parameterek: executeFormData.parameterek ? JSON.parse(executeFormData.parameterek) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba a lekérdezés végrehajtásakor');
      }

      const result = await response.json();
      setQueryResult(Array.isArray(result) ? result : [result]);
      setSuccess('Lekérdezés sikeresen végrehajtva!');
    } catch (err: any) {
      setError(err.message || 'Hiba történt a végrehajtás során');
    } finally {
      setExecuting(false);
    }
  };

  const handleDeleteTemplate = async (id: string, nev: string) => {
    if (!confirm(`Biztosan törölni szeretné a "${nev}" sablont?`)) {
      return;
    }

    try {
      const response = await apiFetch(`/controlling/queries/templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hiba a törlés során');
      }

      setSuccess('Sablon sikeresen törölve!');
      loadTemplates();
    } catch (err: any) {
      setError(err.message || 'Hiba történt a törlés során');
    }
  };

  const handleDeleteAdHoc = async (id: string) => {
    if (!confirm('Biztosan törölni szeretné ezt a lekérdezést?')) {
      return;
    }

    try {
      const response = await apiFetch(`/controlling/queries/ad-hoc/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hiba a törlés során');
      }

      setSuccess('Lekérdezés sikeresen törölve!');
      loadAdHocQueries();
    } catch (err: any) {
      setError(err.message || 'Hiba történt a törlés során');
    }
  };

  const handleOpenExecuteModal = (template?: QueryTemplate) => {
    if (template) {
      setSelectedTemplate(template);
      setExecuteFormData({
        query: template.query,
        parameterek: template.parameterek || '',
      });
    } else {
      setSelectedTemplate(null);
      setExecuteFormData({
        query: '',
        parameterek: '',
      });
    }
    setIsExecuteModalOpen(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lekérdezések</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenExecuteModal()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Lekérdezés végrehajtása
          </button>
          <button
            onClick={() => {
              if (activeTab === 'templates') {
                handleOpenTemplateModal();
              } else {
                setIsModalOpen(true);
              }
            }}
            className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + {activeTab === 'templates' ? 'Új sablon' : 'Új lekérdezés'}
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

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'templates'
                ? 'border-b-2 border-mbit-blue text-mbit-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Lekérdezés sablonok
          </button>
          <button
            onClick={() => setActiveTab('ad-hoc')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'ad-hoc'
                ? 'border-b-2 border-mbit-blue text-mbit-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Ad-hoc lekérdezések
          </button>
        </div>
      </div>

      {/* Templates */}
      {activeTab === 'templates' && (
        <>
          {/* Szűrők */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategória</label>
                <input
                  type="text"
                  value={filters.kategoria}
                  onChange={(e) => setFilters({ ...filters, kategoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Keresés kategória szerint..."
                />
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

          {/* Templates lista */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Betöltés...</div>
            ) : templates.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Nincs sablon</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700">Azonosító</th>
                      <th className="text-left p-4 font-medium text-gray-700">Név</th>
                      <th className="text-left p-4 font-medium text-gray-700">Kategória</th>
                      <th className="text-left p-4 font-medium text-gray-700">Lekérdezés</th>
                      <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {templates.map((template) => (
                      <tr key={template.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900">{template.azonosito}</td>
                        <td className="p-4 font-medium text-gray-900">{template.nev}</td>
                        <td className="p-4 text-sm text-gray-600">{template.kategoria || '-'}</td>
                        <td className="p-4 text-sm text-gray-600 font-mono max-w-md truncate">
                          {template.query}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleOpenExecuteModal(template)}
                            className="text-green-600 hover:text-green-800 text-sm mr-2"
                          >
                            Végrehajtás
                          </button>
                          <button
                            onClick={() => handleOpenTemplateModal(template)}
                            className="text-mbit-blue hover:text-blue-600 text-sm mr-2"
                          >
                            Szerkesztés
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id, template.nev)}
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
        </>
      )}

      {/* Ad-hoc Queries */}
      {activeTab === 'ad-hoc' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Betöltés...</div>
          ) : adHocQueries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nincs ad-hoc lekérdezés</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Név</th>
                    <th className="text-left p-4 font-medium text-gray-700">Lekérdezés</th>
                    <th className="text-left p-4 font-medium text-gray-700">Létrehozta</th>
                    <th className="text-left p-4 font-medium text-gray-700">Létrehozva</th>
                    <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {adHocQueries.map((query) => (
                    <tr key={query.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{query.nev}</td>
                      <td className="p-4 text-sm text-gray-600 font-mono max-w-md truncate">
                        {query.query}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {query.createdBy?.nev || '-'}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(query.createdAt).toLocaleDateString('hu-HU')}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setExecuteFormData({
                              query: query.query,
                              parameterek: query.parameterek || '',
                            });
                            setIsExecuteModalOpen(true);
                          }}
                          className="text-green-600 hover:text-green-800 text-sm mr-2"
                        >
                          Végrehajtás
                        </button>
                        <button
                          onClick={() => handleDeleteAdHoc(query.id)}
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
      )}

      {/* Template modal */}
      <Modal
        isOpen={isModalOpen && activeTab === 'templates'}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Sablon szerkesztése' : 'Új sablon'}
        size="lg"
      >
        <form onSubmit={handleSubmitTemplate}>
          <div className="space-y-4">
            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Azonosító <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateFormData.azonosito}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, azonosito: e.target.value })}
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
                value={templateFormData.nev}
                onChange={(e) => setTemplateFormData({ ...templateFormData, nev: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leírás</label>
              <textarea
                value={templateFormData.leiras}
                onChange={(e) => setTemplateFormData({ ...templateFormData, leiras: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategória</label>
                <input
                  type="text"
                  value={templateFormData.kategoria}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, kategoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paraméterek (JSON)</label>
                <input
                  type="text"
                  value={templateFormData.parameterek}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, parameterek: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder='{"param1": "type"}'
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lekérdezés <span className="text-red-500">*</span>
              </label>
              <textarea
                value={templateFormData.query}
                onChange={(e) => setTemplateFormData({ ...templateFormData, query: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                required
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

      {/* Ad-hoc modal */}
      <Modal
        isOpen={isModalOpen && activeTab === 'ad-hoc'}
        onClose={() => setIsModalOpen(false)}
        title="Új ad-hoc lekérdezés"
        size="lg"
      >
        <form onSubmit={handleSubmitAdHoc}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Név <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={adHocFormData.nev}
                onChange={(e) => setAdHocFormData({ ...adHocFormData, nev: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leírás</label>
              <textarea
                value={adHocFormData.leiras}
                onChange={(e) => setAdHocFormData({ ...adHocFormData, leiras: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paraméterek (JSON)</label>
              <input
                type="text"
                value={adHocFormData.parameterek}
                onChange={(e) => setAdHocFormData({ ...adHocFormData, parameterek: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder='{"param1": "value1"}'
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lekérdezés <span className="text-red-500">*</span>
              </label>
              <textarea
                value={adHocFormData.query}
                onChange={(e) => setAdHocFormData({ ...adHocFormData, query: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                required
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
                Létrehozás
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Execute modal */}
      <Modal
        isOpen={isExecuteModalOpen}
        onClose={() => setIsExecuteModalOpen(false)}
        title={selectedTemplate ? `Lekérdezés végrehajtása: ${selectedTemplate.nev}` : 'Lekérdezés végrehajtása'}
        size="xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lekérdezés <span className="text-red-500">*</span>
            </label>
            <textarea
              value={executeFormData.query}
              onChange={(e) => setExecuteFormData({ ...executeFormData, query: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paraméterek (JSON)</label>
            <textarea
              value={executeFormData.parameterek}
              onChange={(e) => setExecuteFormData({ ...executeFormData, parameterek: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder='{"param1": "value1"}'
            />
          </div>

          <button
            onClick={handleExecuteQuery}
            disabled={executing}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {executing ? 'Végrehajtás...' : 'Végrehajtás'}
          </button>

          {queryResult.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Eredmények ({queryResult.length} sor)</h3>
              <div className="overflow-x-auto max-h-96 border rounded">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {Object.keys(queryResult[0] || {}).map(key => (
                        <th key={key} className="text-left p-2 font-medium text-gray-700 border-b">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {Object.values(row).map((value: any, colIdx) => (
                          <td key={colIdx} className="p-2 border-b text-gray-600">
                            {value?.toString() || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

