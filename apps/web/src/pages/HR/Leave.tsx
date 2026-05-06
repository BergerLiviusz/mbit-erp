import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function HrLeave() {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser?.id as string | undefined;

  const [employees, setEmployees] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [summary, setSummary] = useState<any[]>([]);

  const load = async () => {
    const e = await apiFetch('/hr/employees?skip=0&take=500&aktiv=true');
    if (e.ok) setEmployees((await e.json()).items || []);
    const u = await apiFetch('/system/users?take=200');
    if (u.ok) setUsers((await u.json()).items || []);
    const r = await apiFetch('/hr/leave/requests');
    if (r.ok) setRequests(await r.json());
    const s = await apiFetch('/hr/leave/analytics/summary');
    if (s.ok) setSummary(await s.json());
    if (currentUserId) {
      const p = await apiFetch('/hr/leave/pending/my');
      if (p.ok) setPending(await p.json());
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Távollétek</h1>

      <section className="border rounded p-4 bg-white">
        <h2 className="font-medium mb-2">Összesítés</h2>
        <ul className="text-sm flex flex-wrap gap-3">
          {summary.map((s) => <li key={s.allapot}>{s.allapot}: {s.db}</li>)}
        </ul>
      </section>

      <section className="border rounded p-4 bg-white space-y-3">
        <h2 className="font-medium">Új kérelem</h2>
        <form
          className="grid sm:grid-cols-2 gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target as HTMLFormElement);
            const msel = (e.target as HTMLFormElement).elements.namedItem('approversList') as HTMLSelectElement;
            const approverUserIds = msel ? Array.from(msel.selectedOptions).map((o) => o.value) : [];
            await apiFetch('/hr/leave/requests', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                employeeId: fd.get('employeeId'),
                tipus: fd.get('tipus'),
                kezdet: fd.get('kezdet'),
                veg: fd.get('veg'),
                indoklas: fd.get('indoklas') || undefined,
                approverUserIds,
              }),
            });
            load();
          }}
        >
          <select name="employeeId" className="border rounded px-2 py-2" required>
            {employees.map((x) => <option key={x.id} value={x.id}>{x.azonosito}</option>)}
          </select>
          <select name="tipus" className="border rounded px-2 py-2">
            <option value="SZABADSAG">Szabadság</option>
            <option value="TAPPENZ">Táppénz</option>
            <option value="EGYEB">Egyéb</option>
          </select>
          <input name="kezdet" type="date" className="border rounded px-2 py-2" required />
          <input name="veg" type="date" className="border rounded px-2 py-2" required />
          <textarea name="indoklas" placeholder="Indoklás" className="border rounded px-2 py-2 sm:col-span-2" rows={2} />
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-600">Jóváhagyók (Ctrl/Cmd + kattintás – több is)</label>
            <select multiple className="w-full border rounded px-2 py-2 h-28" name="approversList">
              {users.map((us) => <option key={us.id} value={us.id}>{us.nev} ({us.email})</option>)}
            </select>
          </div>
          <button type="submit" className="sm:col-span-2 py-2 bg-green-800 text-white rounded">
            Beküldés
          </button>
        </form>
        <p className="text-xs text-gray-500">Több jóváhagyó: Ctrl/Cmd + kattintás a listán.</p>
      </section>

      {pending.length > 0 && (
        <section className="border rounded p-4 bg-amber-50 space-y-2">
          <h2 className="font-medium">Rám váró jóváhagyások</h2>
          {pending.map((p) => (
            <div key={p.id} className="border rounded p-2 bg-white flex flex-wrap justify-between gap-2">
              <div className="text-sm">
                <strong>{p.employee?.vezetekNev} {p.employee?.keresztNev}</strong> · {p.tipus} · {p.kezdet?.slice(0, 10)} – {p.veg?.slice(0, 10)}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-green-700 text-white rounded text-sm"
                  onClick={async () => { await apiFetch(`/hr/leave/requests/${p.id}/decide`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ elfogadva: true }) }); load(); }}
                >Jóváhagy</button>
                <button
                  type="button"
                  className="px-3 py-1 bg-red-700 text-white rounded text-sm"
                  onClick={async () => { await apiFetch(`/hr/leave/requests/${p.id}/decide`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ elfogadva: false }) }); load(); }}
                >Elutasít</button>
              </div>
            </div>
          ))}
        </section>
      )}

      <div className="border rounded overflow-x-auto bg-white">
        <table className="min-w-full text-sm">
          <thead><tr className="bg-gray-100"><th className="p-2 text-left">Dolgozó</th><th className="p-2">Típus</th><th className="p-2">Kezdet–Vég</th><th className="p-2">Állapot</th></tr></thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.employee ? `${r.employee.azonosito}` : '—'}</td>
                <td className="p-2">{r.tipus}</td>
                <td className="p-2">{r.kezdet?.slice(0, 10)} – {r.veg?.slice(0, 10)}</td>
                <td className="p-2">{r.allapot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
