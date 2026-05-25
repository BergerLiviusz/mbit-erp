import { useState } from 'react';
import { apiFetch } from '../../lib/api';

interface PreviewResult {
  valid: Array<{ azonosito: string; nev: string }>;
  duplicates: Array<{ row: { azonosito: string; nev: string }; existingId: string }>;
  errors: Array<{ row: number; message: string }>;
}

export default function AccountImport() {
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setContent(String(reader.result || ''));
    reader.readAsText(file);
  };

  const runPreview = async () => {
    setLoading(true);
    setResult('');
    const res = await apiFetch('/crm/accounts/import/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (res.ok) setPreview(await res.json());
    setLoading(false);
  };

  const runImport = async () => {
    setLoading(true);
    const res = await apiFetch('/crm/accounts/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, updateDuplicates: true }),
    });
    if (res.ok) {
      const data = await res.json();
      setResult(`Létrehozva: ${data.created}, frissítve: ${data.updated}, kihagyva: ${data.skipped}`);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Ügyfél import (CSV)</h1>
      <p className="text-gray-600 mb-4 text-sm">
        Kötelező oszlopok: azonosito, nev. Opcionális: email, telefon, szamlazasicim, szallitasicim,
        kapcsolatnev.
      </p>
      <input
        type="file"
        accept=".csv,.txt"
        className="mb-3"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <textarea
        className="w-full border rounded p-2 h-32 font-mono text-sm mb-3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="azonosito,nev,email&#10;U-100,Új Kft.,info@uj.hu"
      />
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={runPreview}
          disabled={!content || loading}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Előnézet
        </button>
        <button
          type="button"
          onClick={runImport}
          disabled={!content || loading}
          className="px-4 py-2 bg-mbit-blue text-white rounded"
        >
          Import véglegesítése
        </button>
      </div>
      {result && <div className="p-3 bg-green-50 border border-green-200 rounded mb-4">{result}</div>}
      {preview && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Új ({preview.valid.length})</h3>
            <ul className="text-sm max-h-48 overflow-y-auto">
              {preview.valid.map((r, i) => (
                <li key={i}>
                  {r.azonosito} – {r.nev}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2 text-amber-700">
              Duplikátum ({preview.duplicates.length})
            </h3>
            <ul className="text-sm max-h-48 overflow-y-auto">
              {preview.duplicates.map((d, i) => (
                <li key={i}>
                  {d.row.azonosito} – frissítés
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2 text-red-700">Hibák ({preview.errors.length})</h3>
            <ul className="text-sm max-h-48 overflow-y-auto">
              {preview.errors.map((e, i) => (
                <li key={i}>
                  Sor {e.row}: {e.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
