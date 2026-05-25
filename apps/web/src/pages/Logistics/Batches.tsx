import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function Batches() {
  const [lots, setLots] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [days, setDays] = useState('30');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams({ take: '300' });
    if (search) params.set('sarzsGyartasiSzam', search);
    if (days) params.set('expiringWithinDays', days);
    const res = await apiFetch(`/logistics/stock-movements/lots?${params}`);
    if (res.ok) {
      const d = await res.json();
      setLots(d.lots || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const exportReport = async (type: string, format: 'csv' | 'xlsx') => {
    const q = days ? `?days=${days}` : '';
    const res = await apiFetch(`/logistics/reports/${type}/export/${format}${q}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${type}.${format === 'csv' ? 'csv' : 'xlsx'}`;
    a.click();
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">Sarzsok</h1>
        <div className="flex gap-2">
          <button type="button" className="text-sm border px-3 py-1 rounded" onClick={() => exportReport('batches', 'xlsx')}>
            Sarzs riport
          </button>
          <button type="button" className="text-sm border px-3 py-1 rounded" onClick={() => exportReport('batches-expiring', 'xlsx')}>
            Lejáró sarzs
          </button>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Sarzs keresés..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input type="number" className="border rounded px-3 py-2 w-32" value={days} onChange={(e) => setDays(e.target.value)} title="Lejárat napok" />
        <button type="button" className="px-4 py-2 border rounded" onClick={load}>
          Keresés
        </button>
      </div>
      {loading ? (
        <p>Betöltés...</p>
      ) : lots.length === 0 ? (
        <p className="text-gray-600">Nincs sarzs adat. Bevételezéskor adja meg a sarzs/gyártási számot.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Sarzs</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Cikk</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Raktár</th>
              <th className="px-4 py-2 text-right text-xs text-gray-500">Mennyiség</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Lejárat</th>
            </tr>
          </thead>
          <tbody>
            {lots.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-2 text-sm">{l.sarzsGyartasiSzam || '-'}</td>
                <td className="px-4 py-2 text-sm">{l.item?.nev}</td>
                <td className="px-4 py-2 text-sm">{l.warehouse?.nev}</td>
                <td className="px-4 py-2 text-sm text-right">{l.mennyiseg}</td>
                <td className="px-4 py-2 text-sm">
                  {l.lejarat ? new Date(l.lejarat).toLocaleDateString('hu-HU') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
