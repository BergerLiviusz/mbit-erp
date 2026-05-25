import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

interface DiscountRule {
  id: string;
  nev: string;
  tipus: string;
  ertek: number;
  mennyisegiHatar?: number;
  ertekHatar?: number;
  prioritas: number;
  leiras?: string;
}

const TIPUS_LABEL: Record<string, string> = {
  MENNYISEGI: 'Mennyiségi',
  EGYEDI_AR: 'Egyedi ár',
  ERTEKHATAR: 'Értékhatár',
  IDOSZAKI: 'Időszaki',
};

export default function Discounts() {
  const [rules, setRules] = useState<DiscountRule[]>([]);
  const [form, setForm] = useState({
    nev: '',
    tipus: 'MENNYISEGI',
    ertek: '5',
    mennyisegiHatar: '10',
    ertekHatar: '',
    prioritas: '100',
  });

  const load = async () => {
    const res = await apiFetch('/crm/discount-rules');
    if (res.ok) setRules(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/crm/discount-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nev: form.nev,
        tipus: form.tipus,
        ertek: parseFloat(form.ertek),
        mennyisegiHatar: form.mennyisegiHatar ? parseFloat(form.mennyisegiHatar) : undefined,
        ertekHatar: form.ertekHatar ? parseFloat(form.ertekHatar) : undefined,
        prioritas: parseInt(form.prioritas, 10),
      }),
    });
    setForm({ nev: '', tipus: 'MENNYISEGI', ertek: '5', mennyisegiHatar: '10', ertekHatar: '', prioritas: '100' });
    load();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kedvezménystruktúra</h1>
      <p className="text-gray-600 mb-4">
        Prioritás: alacsonyabb szám = előbb alkalmazódik. Típusok: mennyiségi, egyedi ár, értékhatár, időszaki.
      </p>

      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <input
          className="border px-2 py-1 rounded"
          placeholder="Név"
          value={form.nev}
          onChange={(e) => setForm({ ...form, nev: e.target.value })}
          required
        />
        <select
          className="border px-2 py-1 rounded"
          value={form.tipus}
          onChange={(e) => setForm({ ...form, tipus: e.target.value })}
        >
          {Object.entries(TIPUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <input
          className="border px-2 py-1 rounded"
          type="number"
          placeholder="Érték"
          value={form.ertek}
          onChange={(e) => setForm({ ...form, ertek: e.target.value })}
        />
        <button type="submit" className="bg-mbit-blue text-white px-4 py-2 rounded">
          + Szabály
        </button>
      </form>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-3">Név</th>
            <th className="text-left p-3">Típus</th>
            <th className="text-right p-3">Érték</th>
            <th className="text-right p-3">Prioritás</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.nev}</td>
              <td className="p-3">{TIPUS_LABEL[r.tipus] || r.tipus}</td>
              <td className="p-3 text-right">{r.ertek}</td>
              <td className="p-3 text-right">{r.prioritas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
