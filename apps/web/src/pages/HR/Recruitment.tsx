import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function HrRecruitment() {
  const [postings, setPostings] = useState<any[]>([]);
  const [detail, setDetail] = useState<any | null>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [jobPositions, setJobPositions] = useState<any[]>([]);

  const load = async () => {
    const p = await apiFetch('/hr/recruitment/postings');
    if (p.ok) setPostings(await p.json());
    const a = await apiFetch('/hr/recruitment/analytics/status');
    if (a.ok) setAnalytics(await a.json());
    const j = await apiFetch('/hr/job-positions?skip=0&take=100');
    if (j.ok) {
      const d = await j.json();
      setJobPositions(d.items || []);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Toborzás</h1>

      <section className="border rounded p-4 bg-white space-y-3">
        <h2 className="font-medium">Új álláshirdetés</h2>
        <form
          className="grid sm:grid-cols-2 gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target as HTMLFormElement);
            await apiFetch('/hr/recruitment/postings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cim: fd.get('cim'),
                leiras: fd.get('leiras') || undefined,
                jobPositionId: fd.get('jobPositionId') || undefined,
                allapot: 'PISZKOZAT',
              }),
            });
            load();
            (e.target as HTMLFormElement).reset();
          }}
        >
          <input name="cim" placeholder="Cím" className="border rounded px-2 py-2 sm:col-span-2" required />
          <textarea name="leiras" placeholder="Leírás" className="border rounded px-2 py-2 sm:col-span-2" rows={3} />
          <select name="jobPositionId" className="border rounded px-2 py-2">
            <option value="">Kapcsolt munkakör</option>
            {jobPositions.map((jp) => <option key={jp.id} value={jp.id}>{jp.nev}</option>)}
          </select>
          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded">Létrehozás</button>
        </form>
      </section>

      <section className="border rounded p-4 bg-white">
        <h2 className="font-medium mb-2">Státusz szerint (pályázatok)</h2>
        <ul className="text-sm">
          {analytics.map((r) => (
            <li key={r.allapot}>
              {r.allapot}: {typeof r._count?.allapot === 'number' ? r._count.allapot : (r.db ?? '—')}
            </li>
          ))}
        </ul>
      </section>

      <ul className="space-y-2">
        {postings.map((p) => (
          <li key={p.id} className="border rounded p-3 bg-white flex flex-wrap justify-between gap-2">
            <div>
              <button type="button" className="text-left font-medium text-blue-800" onClick={async () => {
                const r = await apiFetch(`/hr/recruitment/postings/${p.id}`);
                if (r.ok) setDetail(await r.json());
              }}>{p.cim}</button>
              <div className="text-sm text-gray-600">{p.allapot} · jelentkezés: {p._count?.applications ?? 0}</div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-sm px-2 py-1 border rounded"
                onClick={async () => {
                  await apiFetch(`/hr/recruitment/postings/${p.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ allapot: 'PUBLIKALT' }),
                  });
                  load();
                }}
              >
                Publikál
              </button>
            </div>
          </li>
        ))}
      </ul>

      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[85vh] overflow-y-auto p-4 space-y-3">
            <div className="flex justify-between">
              <h3 className="font-medium">{detail.cim}</h3>
              <button type="button" onClick={() => setDetail(null)} className="text-gray-600">✕</button>
            </div>
            <p className="text-sm whitespace-pre-wrap">{detail.leiras}</p>
            <h4 className="text-sm font-medium">Pályázatok</h4>
            <ul className="text-sm space-y-2">
              {detail.applications?.map((a: any) => (
                <li key={a.id} className="border rounded p-2">
                  {a.jelentkezoNev} · {a.email} · {a.allapot}
                  <div className="mt-1 flex gap-1 flex-wrap">
                    {['SZURT', 'INTERJU', 'FELVETEL', 'ELUTASITVA'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        className="text-xs px-2 py-0.5 border rounded"
                        onClick={async () => {
                          await apiFetch(`/hr/recruitment/applications/${a.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ allapot: st }),
                          });
                          const r = await apiFetch(`/hr/recruitment/postings/${detail.id}`);
                          if (r.ok) setDetail(await r.json());
                        }}
                      >{st}</button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <form
              className="border-t pt-3 space-y-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.target as HTMLFormElement);
                const file = fd.get('cv') as File;
                const form = new FormData();
                form.append('jelentkezoNev', String(fd.get('nev')));
                form.append('email', String(fd.get('email')));
                form.append('telefon', String(fd.get('telefon') || ''));
                if (file && file.size) form.append('cv', file);
                await apiFetch(`/hr/recruitment/postings/${detail.id}/applications`, { method: 'POST', body: form });
                const r = await apiFetch(`/hr/recruitment/postings/${detail.id}`);
                if (r.ok) setDetail(await r.json());
                (e.target as HTMLFormElement).reset();
              }}
            >
              <div className="text-sm font-medium">Új jelentkezés (+ CV)</div>
              <input name="nev" placeholder="Név" className="w-full border rounded px-2 py-1" required />
              <input name="email" type="email" placeholder="Email" className="w-full border rounded px-2 py-1" required />
              <input name="telefon" placeholder="Telefon" className="w-full border rounded px-2 py-1" />
              <input name="cv" type="file" accept=".pdf,.doc,.docx" className="w-full text-sm" />
              <button type="submit" className="w-full py-2 bg-blue-700 text-white rounded">Beküldés</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
