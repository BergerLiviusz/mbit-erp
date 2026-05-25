import { useState } from 'react';
import { apiFetch } from '../../lib/api';
import { usePermissions } from '../../hooks/usePermissions';

const FIELD_OPTIONS: Record<string, string[]> = {
  CRM: ['Név', 'Ügyfél', 'Szakasz', 'Érték', 'Valószínűség'],
  DMS: ['Név', 'Állapot', 'Lejárat', 'Iktatószám'],
  HR: ['Azonosító', 'Név', 'Munkakör', 'Állapot'],
  LOGISTICS: ['Cikk', 'Raktár', 'Mennyiség'],
  SYSTEM: ['Idő', 'Esemény', 'Entitás', 'Felhasználó'],
};

export default function AdHocReport() {
  const { canExportControlling, loading: permLoading } = usePermissions();
  const [module, setModule] = useState('CRM');
  const [fields, setFields] = useState<string[]>([]);
  const [format, setFormat] = useState<'csv' | 'xlsx'>('xlsx');
  const [error, setError] = useState('');

  const toggleField = (f: string) => {
    setFields((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const run = async () => {
    if (!canExportControlling) return;
    setError('');
    const res = await apiFetch(`/controlling/reports/adhoc/run/${format}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module,
        fields: fields.length ? fields : FIELD_OPTIONS[module] || [],
      }),
    });
    if (!res.ok) {
      setError('Export sikertelen');
      return;
    }
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `adhoc_${module}.${format}`;
    a.click();
  };

  if (permLoading) return <p className="p-6">Betöltés...</p>;
  if (!canExportControlling) {
    return <p className="p-6 text-red-700">Nincs export jogosultság.</p>;
  }

  const available = FIELD_OPTIONS[module] || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ad-hoc riport</h1>
      <p className="text-gray-600 mb-4 text-sm">Minimál riport összeállító: modul, mezők, export. Nincs külső BI szolgáltatás.</p>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-800 rounded">{error}</div>}
      <div className="bg-white shadow rounded p-6 max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Modul</label>
          <select className="w-full border rounded px-3 py-2" value={module} onChange={(e) => { setModule(e.target.value); setFields([]); }}>
            {Object.keys(FIELD_OPTIONS).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mezők (üres = mind)</label>
          <div className="flex flex-wrap gap-2">
            {available.map((f) => (
              <label key={f} className="flex items-center gap-1 text-sm border rounded px-2 py-1">
                <input type="checkbox" checked={fields.includes(f)} onChange={() => toggleField(f)} />
                {f}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Formátum</label>
          <select className="w-full border rounded px-3 py-2" value={format} onChange={(e) => setFormat(e.target.value as 'csv' | 'xlsx')}>
            <option value="xlsx">XLSX</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        <button type="button" className="w-full bg-mbit-blue text-white py-2 rounded" onClick={run}>
          Export generálása
        </button>
      </div>
    </div>
  );
}
