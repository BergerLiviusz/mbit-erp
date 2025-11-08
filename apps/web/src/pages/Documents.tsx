import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import FileUpload from '../components/FileUpload';
import { apiFetch } from '../lib/api';

interface Document {
  id: string;
  iktatoSzam: string;
  nev: string;
  tipus: string;
  fajlNev: string;
  fajlMeret: number;
  allapot: string;
  tartalom?: string | null;
  ervenyessegKezdet?: string | null;
  ervenyessegVeg?: string | null;
  category?: {
    id: string;
    nev: string;
  } | null;
  account?: {
    id: string;
    nev: string;
  } | null;
  createdAt: string;
}

interface Category {
  id: string;
  nev: string;
}

interface Account {
  id: string;
  nev: string;
}

const TIPUSOK = [
  { kod: 'szerzodes', nev: 'Szerződés', szin: 'bg-blue-100 text-mbit-blue' },
  { kod: 'szamla', nev: 'Számla', szin: 'bg-green-100 text-green-800' },
  { kod: 'jelentes', nev: 'Jelentés', szin: 'bg-purple-100 text-purple-800' },
  { kod: 'egyeb', nev: 'Egyéb', szin: 'bg-gray-100 text-gray-800' },
];

const ALLAPOTOK = [
  { kod: 'aktiv', nev: 'Aktív', szin: 'bg-green-100 text-green-800' },
  { kod: 'archivalva', nev: 'Archivált', szin: 'bg-yellow-100 text-yellow-800' },
  { kod: 'torolve', nev: 'Törölve', szin: 'bg-red-100 text-red-800' },
];

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAllapot, setSelectedAllapot] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [ocrLoading, setOcrLoading] = useState<Record<string, boolean>>({});
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [formData, setFormData] = useState({
    nev: '',
    tipus: 'szerzodes',
    categoryId: '',
    accountId: '',
    allapot: 'aktiv',
    ervenyessegKezdet: '',
    ervenyessegVeg: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  useEffect(() => {
    loadDocuments();
  }, [selectedAllapot]);

  useEffect(() => {
    if (isModalOpen) {
      loadCategories();
      loadAccounts();
    }
  }, [isModalOpen]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const url = selectedAllapot
        ? `/dms/documents?allapot=${selectedAllapot}&skip=0&take=100`
        : `/dms/documents?skip=0&take=100`;

      const response = await apiFetch(url);

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data || []);
      }
    } catch (error) {
      console.error('Hiba a dokumentumok betöltésekor:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch(`/dms/categories?skip=0&take=100`, {
        
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Hiba a kategóriák betöltésekor:', error);
    }
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Kérem adja meg a kategória nevét!');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch(`/dms/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nev: newCategoryName.trim(),
          leiras: '',
        }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setSuccess('Kategória sikeresen létrehozva!');
        setNewCategoryName('');
        setIsCategoryModalOpen(false);
        await loadCategories();
        setFormData({ ...formData, categoryId: newCategory.id });
        setTimeout(() => setSuccess(''), 3000);
      } else if (response.status === 401) {
        setError('Nincs hitelesítve. Kérem jelentkezzen be újra.');
      } else if (response.status === 403) {
        setError('Nincs jogosultsága új kategória létrehozásához.');
      } else {
        setError('Hiba a kategória létrehozásakor.');
      }
    } catch (error) {
      setError('Hiba történt a kategória létrehozásakor.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const loadAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch(`/crm/accounts?skip=0&take=100`, {
        
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data.items || []);
      }
    } catch (error) {
      console.error('Hiba az ügyfelek betöltésekor:', error);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      nev: '',
      tipus: 'szerzodes',
      categoryId: '',
      accountId: '',
      allapot: 'aktiv',
      ervenyessegKezdet: '',
      ervenyessegVeg: '',
    });
    setSelectedFile(null);
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      nev: '',
      tipus: 'szerzodes',
      categoryId: '',
      accountId: '',
      allapot: 'aktiv',
      ervenyessegKezdet: '',
      ervenyessegVeg: '',
    });
    setSelectedFile(null);
    setError('');
    setSuccess('');
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nev.trim()) {
      setError('A név megadása kötelező');
      return;
    }

    if (!selectedFile) {
      setError('Kérem válasszon ki egy fájlt');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      const documentData = {
        nev: formData.nev,
        tipus: formData.tipus,
        categoryId: formData.categoryId || undefined,
        accountId: formData.accountId || undefined,
        allapot: formData.allapot,
        fajlNev: selectedFile.name,
        fajlMeret: selectedFile.size,
        mimeType: selectedFile.type,
        ervenyessegKezdet: formData.ervenyessegKezdet || undefined,
        ervenyessegVeg: formData.ervenyessegVeg || undefined,
      };

      const createResponse = await apiFetch(`/dms/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(documentData),
      });

      if (!createResponse.ok) {
        if (createResponse.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (createResponse.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (createResponse.status === 400) {
          const errorData = await createResponse.json();
          throw new Error(errorData.message || 'Hibás adatok.');
        } else if (createResponse.status >= 500) {
          throw new Error('Szerver hiba. Kérem próbálja újra később.');
        } else {
          const errorData = await createResponse.json();
          throw new Error(errorData.message || 'Hiba a dokumentum létrehozásakor');
        }
      }

      const createdDocument = await createResponse.json();

      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);

      const uploadResponse = await apiFetch(`/dms/documents/${createdDocument.id}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        if (uploadResponse.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (uploadResponse.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (uploadResponse.status === 400) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Hibás adatok.');
        } else if (uploadResponse.status >= 500) {
          throw new Error('Szerver hiba. Kérem próbálja újra később.');
        } else {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Hiba a fájl feltöltésekor');
        }
      }

      setSuccess('Dokumentum sikeresen létrehozva!');
      setTimeout(() => {
        handleCloseModal();
        loadDocuments();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('hu-HU');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTipusBadge = (tipus: string) => {
    const t = TIPUSOK.find(t => t.kod === tipus);
    if (!t) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{tipus}</span>;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.szin}`}>
        {t.nev}
      </span>
    );
  };

  const getAllapotBadge = (allapot: string) => {
    const a = ALLAPOTOK.find(a => a.kod === allapot);
    if (!a) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{allapot}</span>;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.szin}`}>
        {a.nev}
      </span>
    );
  };

  const countByAllapot = (allapot: string) => {
    return documents.filter(d => d.allapot === allapot).length;
  };

  const handleOcrTrigger = async (documentId: string) => {
    setOcrLoading(prev => ({ ...prev, [documentId]: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch(`/dms/documents/${documentId}/ocr`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMsg = response.status === 401 
          ? 'Nincs hitelesítve' 
          : response.status === 403 
            ? 'Nincs jogosultsága ehhez a művelethez'
            : 'OCR feldolgozás indítása sikertelen';
        setError(errorMsg);
        setOcrLoading(prev => ({ ...prev, [documentId]: false }));
        return;
      }

      setTimeout(async () => {
        try {
          const docResponse = await apiFetch(`/dms/documents/${documentId}`, {
            
          });
          
          if (docResponse.ok) {
            const updatedDoc = await docResponse.json();
            setDocuments(docs => 
              docs.map(d => d.id === documentId ? { ...d, tartalom: updatedDoc.tartalom } : d)
            );
            setExpandedDoc(documentId);
          } else {
            setError('Nem sikerült betölteni az OCR eredményt');
          }
        } catch (err) {
          setError('Hiba történt az OCR eredmény lekérésekor');
        }
        setOcrLoading(prev => ({ ...prev, [documentId]: false }));
      }, 3000);
    } catch (error) {
      console.error('OCR hiba:', error);
      setError('Hiba történt az OCR feldolgozás során');
      setOcrLoading(prev => ({ ...prev, [documentId]: false }));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dokumentumok</h1>
        <button 
          onClick={handleOpenModal}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új dokumentum
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Összes dokumentum</div>
          <div className="text-2xl font-bold">{documents.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Aktív dokumentumok</div>
          <div className="text-2xl font-bold text-green-600">
            {countByAllapot('aktiv')}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Archivált</div>
          <div className="text-2xl font-bold text-yellow-600">
            {countByAllapot('archivalva')}
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedAllapot('')}
          className={`px-4 py-2 rounded ${
            selectedAllapot === ''
              ? 'bg-mbit-blue text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Összes
        </button>
        {ALLAPOTOK.map(all => (
          <button
            key={all.kod}
            onClick={() => setSelectedAllapot(all.kod)}
            className={`px-4 py-2 rounded ${
              selectedAllapot === all.kod
                ? 'bg-mbit-blue text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {all.nev}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs dokumentum</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Iktatószám</th>
                  <th className="text-left p-4 font-medium text-gray-700">Név</th>
                  <th className="text-left p-4 font-medium text-gray-700">Típus</th>
                  <th className="text-left p-4 font-medium text-gray-700">Kategória</th>
                  <th className="text-left p-4 font-medium text-gray-700">Ügyfél</th>
                  <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                  <th className="text-left p-4 font-medium text-gray-700">Érvényesség</th>
                  <th className="text-left p-4 font-medium text-gray-700">Létrehozva</th>
                  <th className="text-left p-4 font-medium text-gray-700">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {documents.map(doc => (
                  <>
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-mbit-blue">{doc.iktatoSzam}</div>
                        <div className="text-xs text-gray-500">{formatFileSize(doc.fajlMeret)}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{doc.nev}</div>
                        <div className="text-xs text-gray-500">{doc.fajlNev}</div>
                      </td>
                      <td className="p-4">{getTipusBadge(doc.tipus)}</td>
                      <td className="p-4 text-sm">
                        {doc.category ? doc.category.nev : '-'}
                      </td>
                      <td className="p-4 text-sm">
                        {doc.account ? doc.account.nev : '-'}
                      </td>
                      <td className="p-4">{getAllapotBadge(doc.allapot)}</td>
                      <td className="p-4 text-sm">
                        {doc.ervenyessegKezdet || doc.ervenyessegVeg ? (
                          <div>
                            {formatDate(doc.ervenyessegKezdet)} - {formatDate(doc.ervenyessegVeg)}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-500">{formatDate(doc.createdAt)}</td>
                      <td className="p-4">
                        {doc.fajlNev && (
                          <button
                            onClick={() => handleOcrTrigger(doc.id)}
                            disabled={ocrLoading[doc.id]}
                            className={`px-3 py-1 rounded text-sm ${
                              ocrLoading[doc.id]
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-mbit-blue text-white hover:bg-blue-600'
                            }`}
                          >
                            {ocrLoading[doc.id] ? 'Feldolgozás...' : 'Szövegkinyerés'}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedDoc === doc.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={9} className="p-4">
                          <div className="border border-gray-200 rounded-lg bg-white p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="font-semibold text-gray-800">OCR Eredmény</h3>
                              <button
                                onClick={() => setExpandedDoc(null)}
                                className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 border border-gray-300 rounded"
                              >
                                Bezárás
                              </button>
                            </div>
                            {doc.tartalom ? (
                              <div className="bg-gray-100 p-3 rounded border border-gray-200 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                                {doc.tartalom}
                              </div>
                            ) : (
                              <div className="text-gray-500 italic text-center py-4">
                                Még nincs OCR eredmény
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Új dokumentum" size="lg">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Kategória
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-sm text-mbit-blue hover:text-blue-800 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Új kategória
                </button>
              </div>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Válasszon --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nev}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ügyfél
              </label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Válasszon --</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.nev}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Állapot <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.allapot}
                onChange={(e) => setFormData({ ...formData, allapot: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="aktiv">Aktív</option>
                <option value="archivalva">Archivált</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Érvényesség kezdete
                </label>
                <input
                  type="date"
                  value={formData.ervenyessegKezdet}
                  onChange={(e) => setFormData({ ...formData, ervenyessegKezdet: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Érvényesség vége
                </label>
                <input
                  type="date"
                  value={formData.ervenyessegVeg}
                  onChange={(e) => setFormData({ ...formData, ervenyessegVeg: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fájl <span className="text-red-500">*</span>
              </label>
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Mégse
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Creation Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setNewCategoryName('');
        }}
        title="Új kategória hozzáadása"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategória neve <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  createCategory();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pl. Számlák, Szerződések, stb."
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsCategoryModalOpen(false);
                setNewCategoryName('');
              }}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Mégse
            </button>
            <button
              type="button"
              onClick={createCategory}
              className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={saving || !newCategoryName.trim()}
            >
              {saving ? 'Létrehozás...' : 'Létrehozás'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
