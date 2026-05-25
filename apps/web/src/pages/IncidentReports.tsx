import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import Modal from '../components/Modal';
import { usePermissions } from '../hooks/usePermissions';

const KATEGORIAK = [
  { kod: 'SOFTWARE', nev: 'Szoftverhiba' },
  { kod: 'USER_QUESTION', nev: 'Felhasználói kérdés' },
  { kod: 'INFOSEC', nev: 'Információbiztonsági incidens' },
  { kod: 'GDPR', nev: 'Adatvédelmi incidens' },
  { kod: 'SYSTEM', nev: 'Rendszer' },
  { kod: 'OTHER', nev: 'Egyéb' },
];

const PRIORITASOK = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const ALLAPOTOK = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

interface BugReport {
  id: string;
  cim: string;
  leiras: string;
  prioritas: string;
  allapot: string;
  kategoria?: string | null;
  modul?: string | null;
  createdAt: string;
  user?: { nev: string; email: string };
}

export default function IncidentReports() {
  const perms = usePermissions();
  const [items, setItems] = useState<BugReport[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<BugReport | null>(null);
  const [filters, setFilters] = useState({ allapot: '', prioritas: '', kategoria: '' });
  const [form, setForm] = useState({
    cim: '',
    leiras: '',
    lepesek: '',
    prioritas: 'MEDIUM',
    kategoria: 'SOFTWARE',
    modul: '',
  });

  const load = async () => {
    const q = new URLSearchParams();
    if (filters.allapot) q.append('allapot', filters.allapot);
    if (filters.prioritas) q.append('prioritas', filters.prioritas);
    if (filters.kategoria) q.append('kategoria', filters.kategoria);
    const res = await apiFetch(`/system/bug-reports?${q.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || data || []);
    }
  };

  useEffect(() => {
    load();
  }, [filters]);

  const createReport = async () => {
    if (!form.cim.trim() || !form.leiras.trim()) {
      setError('Cím és leírás kötelező');
      return;
    }
    setError('');
    const res = await apiFetch('/system/bug-reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        operaciosRendszer: 'Windows Desktop',
        bongeszo: 'Electron',
      }),
    });
    if (!res.ok) {
      setError('Hibabejelentés rögzítése sikertelen');
      return;
    }
    setSuccess('Hibabejelentés rögzítve');
    setShowForm(false);
    setForm({
      cim: '',
      leiras: '',
      lepesek: '',
      prioritas: 'MEDIUM',
      kategoria: 'SOFTWARE',
      modul: '',
    });
    load();
  };

  const updateReport = async (id: string, patch: Record<string, string>) => {
    if (!perms.has('system:diagnostics')) {
      setError('Nincs jogosultság a módosításhoz');
      return;
    }
    const res = await apiFetch(`/system/bug-reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      setSuccess('Frissítve');
      load();
      if (selected?.id === id) {
        const detail = await apiFetch(`/system/bug-reports/${id}`);
        if (detail.ok) setSelected(await detail.json());
      }
    }
  };

  const exportCsv = async () => {
    const header = 'Cim;Prioritas;Allapot;Kategoria;Modul;Letrehozva';
    const rows = items.map((i) =>
      [i.cim, i.prioritas, i.allapot, i.kategoria, i.modul, i.createdAt].join(';'),
    );
    const blob = new Blob(['\ufeff' + [header, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hibabejelentesek.csv';
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Hibabejelentés / incidens</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="border px-3 py-1 rounded text-sm"
            onClick={exportCsv}
          >
            Export CSV
          </button>
          <button
            type="button"
            className="bg-mbit-blue text-white px-3 py-1 rounded text-sm"
            onClick={() => setShowForm(true)}
          >
            + Új bejelentés
          </button>
        </div>
      </div>

      {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}
      {success && <div className="mb-2 text-green-600 text-sm">{success}</div>}

      <div className="grid grid-cols-3 gap-2 mb-4">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filters.allapot}
          onChange={(e) => setFilters({ ...filters, allapot: e.target.value })}
        >
          <option value="">Minden állapot</option>
          {ALLAPOTOK.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filters.prioritas}
          onChange={(e) => setFilters({ ...filters, prioritas: e.target.value })}
        >
          <option value="">Minden prioritás</option>
          {PRIORITASOK.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filters.kategoria}
          onChange={(e) => setFilters({ ...filters, kategoria: e.target.value })}
        >
          <option value="">Minden kategória</option>
          {KATEGORIAK.map((k) => (
            <option key={k.kod} value={k.kod}>
              {k.nev}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full text-sm bg-white rounded shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2">Cím</th>
            <th className="text-left p-2">Kategória</th>
            <th className="text-left p-2">Prioritás</th>
            <th className="text-left p-2">Állapot</th>
            <th className="text-left p-2">Dátum</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr
              key={i.id}
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={async () => {
                const res = await apiFetch(`/system/bug-reports/${i.id}`);
                if (res.ok) setSelected(await res.json());
              }}
            >
              <td className="p-2">{i.cim}</td>
              <td className="p-2">{i.kategoria || '—'}</td>
              <td className="p-2">{i.prioritas}</td>
              <td className="p-2">{i.allapot}</td>
              <td className="p-2">{new Date(i.createdAt).toLocaleDateString('hu-HU')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Új hibabejelentés">
        <div className="space-y-3 text-sm">
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Cím *"
            value={form.cim}
            onChange={(e) => setForm({ ...form, cim: e.target.value })}
          />
          <select
            className="w-full border rounded px-2 py-1"
            value={form.kategoria}
            onChange={(e) => setForm({ ...form, kategoria: e.target.value })}
          >
            {KATEGORIAK.map((k) => (
              <option key={k.kod} value={k.kod}>
                {k.nev}
              </option>
            ))}
          </select>
          <textarea
            className="w-full border rounded px-2 py-1"
            rows={4}
            placeholder="Leírás *"
            value={form.leiras}
            onChange={(e) => setForm({ ...form, leiras: e.target.value })}
          />
          <button
            type="button"
            className="bg-mbit-blue text-white px-4 py-2 rounded"
            onClick={createReport}
          >
            Beküldés
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.cim || 'Részletek'}
      >
        {selected && (
          <div className="space-y-3 text-sm">
            <p>{selected.leiras}</p>
            {perms.has('system:diagnostics') && (
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="border rounded px-2 py-1"
                  value={selected.allapot}
                  onChange={(e) => updateReport(selected.id, { allapot: e.target.value })}
                >
                  {ALLAPOTOK.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <select
                  className="border rounded px-2 py-1"
                  value={selected.prioritas}
                  onChange={(e) => updateReport(selected.id, { prioritas: e.target.value })}
                >
                  {PRIORITASOK.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
