import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function HrCafeteria() {
  const [groups, setGroups] = useState<any[]>([]);
  const [employees, setEmployees] = useState<{ id: string; azonosito: string; vezetekNev: string; keresztNev: string }[]>([]);
  const [ev, setEv] = useState(new Date().getFullYear());
  const [selEmp, setSelEmp] = useState('');
  const [selItem, setSelItem] = useState('');
  const [darab, setDarab] = useState(1);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const g = await apiFetch('/hr/cafeteria/groups?aktiv=true');
    if (g.ok) setGroups(await g.json());
    const e = await apiFetch('/hr/employees?skip=0&take=500&aktiv=true');
    if (e.ok) {
      const d = await e.json();
      setEmployees(d.items || []);
    }
  };

  useEffect(() => { load(); }, []);

  const flatItems = groups.flatMap((gr) => (gr.items || []).map((it: any) => ({ ...it, groupNev: gr.nev })));

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Cafeteria (béren kívüli juttatások)</h1>
      <p className="text-gray-600 text-sm">Juttatási csoportok és elemek, dolgozói választások. Export: HR → Riportok → Bérszámfejtő (cafeteria).</p>

      <section className="border rounded-lg p-4 space-y-3 bg-white">
        <h2 className="font-medium">Új csoport / elem (admin)</h2>
        <form
          className="flex flex-wrap gap-2 items-end"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target as HTMLFormElement);
            const nev = fd.get('gnev') as string;
            const r = await apiFetch('/hr/cafeteria/groups', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nev, ev: parseInt(String(fd.get('gev')), 10) }),
            });
            if (r.ok) {
              setMsg('Csoport létrehozva');
              load();
            }
          }}
        >
          <input name="gnev" placeholder="Csoport neve" className="border rounded px-2 py-1 flex-1 min-w-[160px]" required />
          <input name="gev" type="number" defaultValue={ev} className="border rounded px-2 py-1 w-24" />
          <button type="submit" className="px-3 py-1 bg-gray-900 text-white rounded">Csoport</button>
        </form>
        <form
          className="flex flex-wrap gap-2 items-end"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target as HTMLFormElement);
            const groupId = fd.get('gid') as string;
            const nev = fd.get('inev') as string;
            const kod = fd.get('ikod') as string;
            await apiFetch(`/hr/cafeteria/groups/${groupId}/items`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nev, kod: kod || undefined }),
            });
            load();
          }}
        >
          <select name="gid" className="border rounded px-2 py-1" required>
            <option value="">— csoport —</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.nev}</option>)}
          </select>
          <input name="inev" placeholder="Elem neve" className="border rounded px-2 py-1" required />
          <input name="ikod" placeholder="Bérszámfejtő kód" className="border rounded px-2 py-1" />
          <button type="submit" className="px-3 py-1 bg-blue-700 text-white rounded">Elem</button>
        </form>
      </section>

      <section className="border rounded-lg p-4 space-y-3 bg-white">
        <h2 className="font-medium">Dolgozó választás</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Dolgozó</label>
            <select className="w-full border rounded px-2 py-2" value={selEmp} onChange={(e) => setSelEmp(e.target.value)}>
              <option value="">—</option>
              {employees.map((x) => <option key={x.id} value={x.id}>{x.azonosito} – {x.vezetekNev} {x.keresztNev}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Juttatás elem</label>
            <select className="w-full border rounded px-2 py-2" value={selItem} onChange={(e) => setSelItem(e.target.value)}>
              <option value="">—</option>
              {flatItems.map((it: any) => <option key={it.id} value={it.id}>{it.groupNev}: {it.nev}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Év</label>
            <input type="number" className="w-full border rounded px-2 py-2" value={ev} onChange={(e) => setEv(parseInt(e.target.value, 10))} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Darab</label>
            <input type="number" min={1} className="w-full border rounded px-2 py-2" value={darab} onChange={(e) => setDarab(parseInt(e.target.value, 10))} />
          </div>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-green-700 text-white rounded w-full sm:w-auto"
          disabled={!selEmp || !selItem}
          onClick={async () => {
            const r = await apiFetch('/hr/cafeteria/selections', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ employeeId: selEmp, benefitItemId: selItem, ev, darab }),
            });
            setMsg(r.ok ? 'Választás mentve' : 'Hiba');
          }}
        >
          Mentés
        </button>
        {msg && <p className="text-sm text-green-700">{msg}</p>}
      </section>

      <ul className="text-sm space-y-1">
        {groups.map((g) => (
          <li key={g.id} className="border rounded p-2 bg-gray-50">
            <strong>{g.nev}</strong> ({g.ev})
            <ul className="ml-4 mt-1">
              {(g.items || []).map((it: any) => <li key={it.id}>{it.nev} {it.kod ? `(${it.kod})` : ''}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
