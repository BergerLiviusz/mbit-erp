import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function LogisticsReports() {
  const [types, setTypes] = useState<Array<{ id: string; label: string }>>([]);
  const [selected, setSelected] = useState('stock-current');
  const [format, setFormat] = useState<'csv' | 'xlsx'>('xlsx');

  useEffect(() => {
    apiFetch('/logistics/reports/types').then(async (res) => {
      if (res.ok) setTypes(await res.json());
    });
  }, []);

  const download = async () => {
    const res = await apiFetch(`/logistics/reports/${selected}/export/${format}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${selected}.${format === 'csv' ? 'csv' : 'xlsx'}`;
    a.click();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Logisztika riportok</h1>
      <p className="text-gray-600 mb-4">Minden export audit naplóba kerül. A fájl a helyi letöltési mappába kerül (desktop).</p>
      <div className="bg-white shadow rounded p-6 max-w-lg space-y-4">
        <label className="block text-sm font-medium">Riport típus</label>
        <select className="w-full border rounded px-3 py-2" value={selected} onChange={(e) => setSelected(e.target.value)}>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <label className="block text-sm font-medium">Formátum</label>
        <select className="w-full border rounded px-3 py-2" value={format} onChange={(e) => setFormat(e.target.value as 'csv' | 'xlsx')}>
          <option value="xlsx">Excel (XLSX)</option>
          <option value="csv">CSV</option>
        </select>
        <button type="button" className="w-full bg-mbit-blue text-white py-2 rounded" onClick={download}>
          Export letöltése
        </button>
      </div>
    </div>
  );
}
