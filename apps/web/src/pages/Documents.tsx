import { useState, useEffect } from 'react';

interface Document {
  id: string;
  iktatoSzam: string;
  nev: string;
  tipus: string;
  fajlNev: string;
  fajlMeret: number;
  allapot: string;
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

const TIPUSOK = [
  { kod: 'szerzodes', nev: 'Szerződés', szin: 'bg-blue-100 text-blue-800' },
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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    loadDocuments();
  }, [selectedAllapot]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = selectedAllapot
        ? `${API_URL}/dms/documents?allapot=${selectedAllapot}&skip=0&take=100`
        : `${API_URL}/dms/documents?skip=0&take=100`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dokumentumok</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
              ? 'bg-blue-600 text-white'
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
                ? 'bg-blue-600 text-white'
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
                </tr>
              </thead>
              <tbody className="divide-y">
                {documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="p-4">
                      <div className="font-medium text-blue-600">{doc.iktatoSzam}</div>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
