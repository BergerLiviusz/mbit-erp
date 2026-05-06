import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { isModuleEnabled } from '../../config/modules';

export default function HrPerformance() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [empId, setEmpId] = useState('');
  const [goals, setGoals] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);

  const loadEmps = async () => {
    const e = await apiFetch('/hr/employees?skip=0&take=500&aktiv=true');
    if (e.ok) setEmployees((await e.json()).items || []);
  };

  const loadGoals = async () => {
    if (!empId) return;
    const r = await apiFetch(`/hr/performance/goals?employeeId=${empId}`);
    if (r.ok) setGoals(await r.json());
  };

  const loadMeta = async () => {
    const a = await apiFetch('/hr/performance/analytics/goals');
    if (a.ok) setAnalytics(await a.json());
    if (isModuleEnabled('team')) {
      const w = await apiFetch('/team/workflows');
      if (w.ok) setWorkflows(await w.json());
    } else {
      setWorkflows([]);
    }
  };

  useEffect(() => { loadEmps(); loadMeta(); }, []);
  useEffect(() => { loadGoals(); }, [empId]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Teljesítmény és célok</h1>
      <div className="text-sm flex flex-wrap gap-3">
        {analytics.map((x) => <span key={x.allapot}>{x.allapot}: {x.db}</span>)}
      </div>

      <section className="border rounded p-4 bg-white space-y-3">
        <select className="border rounded px-2 py-2 w-full max-w-md" value={empId} onChange={(e) => setEmpId(e.target.value)}>
          <option value="">Válasszon dolgozót</option>
          {employees.map((x) => <option key={x.id} value={x.id}>{x.azonosito} – {x.vezetekNev} {x.keresztNev}</option>)}
        </select>

        <form
          className="grid sm:grid-cols-2 gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target as HTMLFormElement);
            await apiFetch('/hr/performance/goals', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                employeeId: empId,
                cim: fd.get('cim'),
                leiras: fd.get('leiras') || undefined,
                celErtek: fd.get('celErtek') || undefined,
                hatarido: fd.get('hatarido') || undefined,
                startWorkflowId: fd.get('wf') || undefined,
              }),
            });
            loadGoals();
          }}
        >
          <input name="cim" placeholder="Cél megnevezése" className="border rounded px-2 py-2 sm:col-span-2" required />
          <textarea name="leiras" placeholder="Leírás" className="border rounded px-2 py-2 sm:col-span-2" rows={2} />
          <input name="celErtek" placeholder="Célérték (szöveg)" className="border rounded px-2 py-2" />
          <input name="hatarido" type="date" className="border rounded px-2 py-2" />
          <select name="wf" className="border rounded px-2 py-2 sm:col-span-2">
            <option value="">Opcionális workflow indítása</option>
            {isModuleEnabled('team')
              ? workflows.map((w) => <option key={w.id} value={w.id}>{w.nev}</option>)
              : null}
          </select>
          <button type="submit" disabled={!empId} className="sm:col-span-2 py-2 bg-gray-900 text-white rounded">Cél létrehozása</button>
        </form>
      </section>

      <ul className="space-y-3">
        {goals.map((g) => (
          <li key={g.id} className="border rounded p-3 bg-white">
            <div className="font-medium">{g.cim} <span className="text-sm text-gray-500">({g.allapot})</span></div>
            <p className="text-sm text-gray-700">{g.leiras}</p>
            <form
              className="mt-2 flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.target as HTMLFormElement);
                await apiFetch(`/hr/performance/goals/${g.id}/activities`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ megjegyzes: fd.get('txt') }),
                });
                loadGoals();
                (e.target as HTMLFormElement).reset();
              }}
            >
              <input name="txt" placeholder="Tevékenység / megjegyzés" className="flex-1 border rounded px-2 py-1 text-sm" />
              <button type="submit" className="px-2 py-1 bg-blue-800 text-white rounded text-sm">+</button>
            </form>
            <ul className="mt-2 text-xs text-gray-600 space-y-1">
              {(g.activities || []).map((x: any) => <li key={x.id}>{x.datum?.slice(0, 10)}: {x.megjegyzes}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
