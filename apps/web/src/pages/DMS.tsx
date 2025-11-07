import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export default function DMS() {
  const [search, setSearch] = useState('');

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents', search],
    queryFn: async () => {
      const response = await axios.get(`/api/dms/documents?search=${search}`);
      return response.data;
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">DMS - Dokumentumkezelés & Iratkezelés</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Keresés dokumentumok között..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">
            Új Dokumentum
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Dokumentum Archívum</h2>
          <p className="text-sm text-gray-600">Összesen: {documents?.total || 0} dokumentum</p>
        </div>
        
        {isLoading ? (
          <div className="p-6">Betöltés...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Iktatószám</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokumentum Név</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Típus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Állapot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Felelős</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">OCR</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents?.items?.map((doc: any) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-mbit-blue">
                    {doc.iktatoSzam}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.nev}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.tipus}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      doc.allapot === 'aktiv' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {doc.allapot}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.felelős || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.ocrJob ? (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {doc.ocrJob.allapot}
                      </span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border-l-4 border-mbit-blue p-4">
        <h3 className="font-bold mb-2">DMS Modul Funkciók:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Iktatási rendszer automatikus iktatószám generálással</li>
          <li>• OCR feldolgozás magyar nyelven (Tesseract)</li>
          <li>• Dokumentum verziók nyomon követése</li>
          <li>• Szerepkör-alapú hozzáférés kezelés</li>
          <li>• Teljes szöveges keresés az archívumban</li>
          <li>• Audit napló minden művelethez</li>
        </ul>
      </div>
    </div>
  );
}
