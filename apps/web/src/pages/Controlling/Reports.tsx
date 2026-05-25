import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { usePermissions } from '../../hooks/usePermissions';

export default function ControllingReports() {
  const { canViewControlling, canExportControlling, loading: permLoading } = usePermissions();
  const [templates, setTemplates] = useState<any[]>([]);
  const [kategoria, setKategoria] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = kategoria ? `?kategoria=${kategoria}` : '';
    apiFetch(`/controlling/reports/templates${q}`).then(async (res) => {
      if (res.ok) setTemplates(await res.json());
      setLoading(false);
    });
  }, [kategoria]);

  const run = async (kod: string, format: 'csv' | 'xlsx') => {
    if (!canExportControlling) return;
    const res = await apiFetch(`/controlling/reports/templates/${kod}/run/${format}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${kod}.${format === 'csv' ? 'csv' : 'xlsx'}`;
    a.click();
  };

  if (permLoading) return <p className="p-6">Betöltés...</p>;
  if (!canViewControlling) {
    return <p className="p-6 text-red-700">Nincs jogosultság.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kontrolling – Riportok</h1>
      <select
        className="border rounded px-3 py-2 mb-4"
        value={kategoria}
        onChange={(e) => setKategoria(e.target.value)}
      >
        <option value="">Minden kategória</option>
        {['CRM', 'DMS', 'HR', 'LOGISTICS', 'SYSTEM'].map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      {loading ? (
        <p>Betöltés...</p>
      ) : templates.length === 0 ? (
        <p className="text-gray-600">Nincs riport sablon. Az első backend induláskor automatikusan létrejönnek.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Kód</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Név</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Kategória</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Export</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-2 text-sm">{t.kod}</td>
                <td className="px-4 py-2 text-sm">{t.nev}</td>
                <td className="px-4 py-2 text-sm">{t.kategoria}</td>
                <td className="px-4 py-2 text-sm flex gap-2">
                  {canExportControlling && (
                    <>
                      <button type="button" className="text-xs border px-2 py-1 rounded" onClick={() => run(t.kod, 'csv')}>
                        CSV
                      </button>
                      <button type="button" className="text-xs border px-2 py-1 rounded" onClick={() => run(t.kod, 'xlsx')}>
                        XLSX
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
