import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function HrTimeTracking() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [empId, setEmpId] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const loadEmps = async () => {
    const e = await apiFetch('/hr/employees?skip=0&take=500&aktiv=true');
    if (e.ok) {
      const d = await e.json();
      setEmployees(d.items || []);
    }
  };

  const loadEntries = async () => {
    if (!empId) return;
    const q = new URLSearchParams({ employeeId: empId });
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    const r = await apiFetch(`/hr/time/entries?${q}`);
    if (r.ok) setEntries(await r.json());
  };

  const loadBatches = async () => {
    const r = await apiFetch('/hr/time/import-batches');
    if (r.ok) setBatches(await r.json());
  };

  useEffect(() => { loadEmps(); loadBatches(); }, []);
  useEffect(() => { loadEntries(); }, [empId, from, to]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Időgazdálkodás</h1>
      <p className="text-sm text-gray-600">Önkiszolgáló munkaidő, CSV import (oszlopok: dolgozó_azonosito;yyyy-mm-dd;óra). Export: HR riportok.</p>

      <section className="border rounded p-4 bg-white space-y-3">
        <div className="grid sm:grid-cols-3 gap-2">
          <select className="border rounded px-2 py-2" value={empId} onChange={(e) => setEmpId(e.target.value)}>
            <option value="">Dolgozó</option>
            {employees.map((x) => <option key={x.id} value={x.id}>{x.azonosito}</option>)}
          </select>
          <input type="date" className="border rounded px-2 py-2" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input type="date" className="border rounded px-2 py-2" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <form
          className="flex flex-wrap gap-2 items-end"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target as HTMLFormElement);
            await apiFetch('/hr/time/entries', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                employeeId: fd.get('eid'),
                datum: fd.get('datum'),
                ora: parseFloat(String(fd.get('ora'))),
                tipus: fd.get('tipus') || 'NORMAL',
              }),
            });
            loadEntries();
          }}
        >
          <select name="eid" className="border rounded px-2 py-2" required>
            {employees.map((x) => <option key={x.id} value={x.id}>{x.azonosito}</option>)}
          </select>
          <input name="datum" type="date" className="border rounded px-2 py-2" required />
          <input name="ora" type="number" step="0.25" placeholder="óra" className="border rounded px-2 py-2 w-24" required />
          <select name="tipus" className="border rounded px-2 py-2">
            <option value="NORMAL">Normál</option>
            <option value="TULORA">Túlóra</option>
            <option value="KIEGESZITO">Kiegészítő</option>
          </select>
          <button type="submit" className="px-3 py-2 bg-gray-900 text-white rounded">Rögzítés</button>
        </form>
      </section>

      <section className="border rounded p-4 bg-white space-y-2">
        <h2 className="font-medium">Import (beléptető / CSV)</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData();
            const f = (e.target as HTMLFormElement).elements.namedItem('file') as HTMLInputElement;
            if (!f.files?.[0]) return;
            fd.append('file', f.files[0]);
            await apiFetch('/hr/time/import/access-csv', { method: 'POST', body: fd });
            loadBatches();
          }}
        >
          <input name="file" type="file" accept=".csv,.txt" className="text-sm" />
          <button type="submit" className="ml-2 px-3 py-1 bg-blue-800 text-white rounded text-sm">Feltöltés</button>
        </form>
        <ul className="text-xs text-gray-600">
          {batches.map((b) => <li key={b.id}>{b.fajlNev} – {b.sikeres ? `${b.rekordok} sor` : b.hibaUzenet}</li>)}
        </ul>
      </section>

      <div className="border rounded overflow-x-auto bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left"><th className="p-2">Dátum</th><th className="p-2">Óra</th><th className="p-2">Típus</th><th className="p-2">Forrás</th></tr>
          </thead>
          <tbody>
            {entries.map((en) => (
              <tr key={en.id} className="border-t">
                <td className="p-2">{en.datum?.slice(0, 10)}</td>
                <td className="p-2">{en.ora}</td>
                <td className="p-2">{en.tipus}</td>
                <td className="p-2">{en.forras}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
