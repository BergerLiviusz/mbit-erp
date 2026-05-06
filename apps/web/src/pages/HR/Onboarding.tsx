import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { isModuleEnabled } from '../../config/modules';

export default function HrOnboarding() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [instances, setInstances] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);

  const load = async () => {
    const t = await apiFetch('/hr/onboarding/templates?aktiv=true');
    if (t.ok) setTemplates(await t.json());
    const i = await apiFetch('/hr/onboarding/instances');
    if (i.ok) setInstances(await i.json());
    const e = await apiFetch('/hr/employees?skip=0&take=500&aktiv=true');
    if (e.ok) setEmployees((await e.json()).items || []);
    if (isModuleEnabled('team')) {
      const w = await apiFetch('/team/workflows');
      if (w.ok) setWorkflows(await w.json());
    } else {
      setWorkflows([]);
    }
    const a = await apiFetch('/hr/onboarding/analytics');
    if (a.ok) setAnalytics(await a.json());
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Beléptetés</h1>
      <p className="text-sm text-gray-600">Sablonok, dokumentumlista (JSON), e-mail értesítés (SMTP: rendszerbeállítás hr.smtp.*). Opcionális workflow kapcsolás.</p>
      {!isModuleEnabled('team') && (
        <div className="text-sm bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded">
          A workflow kapcsolás ebben a csomagban nem elérhető (Team modul kikapcsolva).
        </div>
      )}

      <div className="text-sm flex flex-wrap gap-3">
        {analytics.map((x) => <span key={x.allapot}>{x.allapot}: {x._count?.allapot ?? x.count}</span>)}
      </div>

      <section className="border rounded p-4 bg-white space-y-3">
        <h2 className="font-medium">Új sablon</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target as HTMLFormElement);
            await apiFetch('/hr/onboarding/templates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nev: fd.get('nev'),
                leiras: fd.get('leiras') || undefined,
                dokLista: fd.get('dokLista') || undefined,
              }),
            });
            load();
          }}
          className="space-y-2"
        >
          <input name="nev" placeholder="Sablon neve" className="w-full border rounded px-2 py-2" required />
          <textarea name="leiras" placeholder="Leírás" className="w-full border rounded px-2 py-2" rows={2} />
          <textarea name="dokLista" placeholder="Dokumentumok JSON vagy szabad szöveg" className="w-full border rounded px-2 py-2 text-sm font-mono" rows={3} />
          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded">Mentés</button>
        </form>
      </section>

      <section className="border rounded p-4 bg-white space-y-3">
        <h2 className="font-medium">Beléptetés indítása</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target as HTMLFormElement);
            await apiFetch('/hr/onboarding/instances', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                employeeId: fd.get('employeeId'),
                templateId: fd.get('templateId'),
                workflowId: fd.get('workflowId') || undefined,
              }),
            });
            load();
          }}
          className="grid sm:grid-cols-2 gap-2"
        >
          <select name="employeeId" className="border rounded px-2 py-2" required>
            {employees.map((x) => <option key={x.id} value={x.id}>{x.azonosito}</option>)}
          </select>
          <select name="templateId" className="border rounded px-2 py-2" required>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.nev}</option>)}
          </select>
          <select name="workflowId" className="border rounded px-2 py-2 sm:col-span-2">
            <option value="">Workflow (opcionális)</option>
            {isModuleEnabled('team')
              ? workflows.map((w) => <option key={w.id} value={w.id}>{w.nev}</option>)
              : null}
          </select>
          <button type="submit" className="sm:col-span-2 py-2 bg-green-800 text-white rounded">Indítás</button>
        </form>
      </section>

      <ul className="space-y-2">
        {instances.map((i) => (
          <li key={i.id} className="border rounded p-3 bg-white flex flex-wrap justify-between gap-2 text-sm">
            <div>
              {i.employee?.vezetekNev} {i.employee?.keresztNev} – {i.template?.nev} – <strong>{i.allapot}</strong>
              {i.workflowInstance && <span className="text-gray-600"> · WF: {i.workflowInstance.nev}</span>}
            </div>
            {i.allapot !== 'BEFEJEZVE' && (
              <button
                type="button"
                className="px-2 py-1 border rounded"
                onClick={async () => { await apiFetch(`/hr/onboarding/instances/${i.id}/complete`, { method: 'POST' }); load(); }}
              >
                Lezárás
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
