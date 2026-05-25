import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../lib/api';
import DmsDocumentLinker from './DmsDocumentLinker';
import { usePermissions } from '../../hooks/usePermissions';

type TabId =
  | 'alap'
  | 'jogviszony'
  | 'munkakor'
  | 'vegzettseg'
  | 'korabbi'
  | 'nyelv'
  | 'orvosi'
  | 'fegyelmi'
  | 'tanulmanyi'
  | 'szerzodes'
  | 'dokumentum'
  | 'audit';

const TABS: { id: TabId; label: string }[] = [
  { id: 'alap', label: 'Alapadatok' },
  { id: 'jogviszony', label: 'Jogviszony' },
  { id: 'munkakor', label: 'Munkakör / szervezet' },
  { id: 'vegzettseg', label: 'Végzettségek' },
  { id: 'korabbi', label: 'Korábbi munkahelyek' },
  { id: 'nyelv', label: 'Nyelvtudás' },
  { id: 'orvosi', label: 'Orvosi vizsgálatok' },
  { id: 'fegyelmi', label: 'Fegyelmi / kitüntetés' },
  { id: 'tanulmanyi', label: 'Tanulmányi szerződések' },
  { id: 'szerzodes', label: 'Munkaszerződések' },
  { id: 'dokumentum', label: 'Dokumentumok' },
  { id: 'audit', label: 'Audit / történet' },
];

interface JobPosition {
  id: string;
  nev: string;
  azonosito: string;
}

interface EmployeeFull {
  id: string;
  azonosito: string;
  vezetekNev: string;
  keresztNev: string;
  szuletesiDatum?: string | null;
  szuletesiHely?: string | null;
  szuletesiNev?: string | null;
  adoszam?: string | null;
  anyjaNeve?: string | null;
  allapot?: string | null;
  besorolas?: string | null;
  munkaido?: string | null;
  tajSzam?: string | null;
  szemelyiIgazolvanySzam?: string | null;
  lakcim?: string | null;
  tartozkodasiCim?: string | null;
  telefon?: string | null;
  email?: string | null;
  munkaviszonyKezdete?: string | null;
  munkaviszonyVege?: string | null;
  munkaviszonyTipusa?: string | null;
  jobPositionId?: string | null;
  osztaly?: string | null;
  reszleg?: string | null;
  aktiv: boolean;
  jobPosition?: JobPosition | null;
  educations?: any[];
  languageSkills?: any[];
  medicalExaminations?: any[];
  disciplinaryActions?: any[];
  studyContracts?: any[];
  employmentContracts?: any[];
  previousEmployments?: any[];
  awards?: any[];
}

interface Props {
  employeeId: string;
  jobPositions: JobPosition[];
  onUpdated: () => void;
  onClose?: () => void;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function EmployeeDetailPanel({
  employeeId,
  jobPositions,
  onUpdated,
}: Props) {
  const perms = usePermissions();
  const [tab, setTab] = useState<TabId>('alap');
  const [emp, setEmp] = useState<EmployeeFull | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, string | boolean>>({});

  const load = useCallback(async () => {
    setError('');
    const res = await apiFetch(`/hr/employees/${employeeId}`);
    if (!res.ok) {
      setError('Dolgozó betöltése sikertelen');
      return;
    }
    const data = await res.json();
    setEmp(data);
    setForm({
      vezetekNev: data.vezetekNev,
      keresztNev: data.keresztNev,
      szuletesiDatum: data.szuletesiDatum?.split('T')[0] || '',
      szuletesiHely: data.szuletesiHely || '',
      szuletesiNev: data.szuletesiNev || '',
      adoszam: data.adoszam || '',
      anyjaNeve: data.anyjaNeve || '',
      allapot: data.allapot || 'ACTIVE',
      besorolas: data.besorolas || '',
      munkaido: data.munkaido || '',
      tajSzam: data.tajSzam || '',
      szemelyiIgazolvanySzam: data.szemelyiIgazolvanySzam || '',
      lakcim: data.lakcim || '',
      tartozkodasiCim: data.tartozkodasiCim || '',
      telefon: data.telefon || '',
      email: data.email || '',
      munkaviszonyKezdete: data.munkaviszonyKezdete?.split('T')[0] || '',
      munkaviszonyVege: data.munkaviszonyVege?.split('T')[0] || '',
      munkaviszonyTipusa: data.munkaviszonyTipusa || '',
      jobPositionId: data.jobPositionId || '',
      osztaly: data.osztaly || '',
      reszleg: data.reszleg || '',
      aktiv: data.aktiv,
    });
  }, [employeeId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (tab !== 'audit') return;
    (async () => {
      const res = await apiFetch(
        `/system/audit?entitas=Employee&entitasId=${employeeId}`,
      );
      if (res.ok) setAuditLogs(await res.json());
    })();
  }, [tab, employeeId]);

  const saveEmployee = async (payload: Record<string, unknown>) => {
    if (!perms.canEditHr) {
      setError('Nincs jogosultság a szerkesztéshez');
      return;
    }
    setError('');
    const res = await apiFetch(`/hr/employees/${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError((err as { message?: string }).message || 'Mentés sikertelen');
      return;
    }
    setSuccess('Mentve');
    await load();
    onUpdated();
    setTimeout(() => setSuccess(''), 2000);
  };

  const crud = async (
    method: string,
    url: string,
    body?: object,
  ): Promise<boolean> => {
    if (method === 'DELETE' && !perms.canDeleteHr) {
      setError('Nincs törlési jogosultság');
      return false;
    }
    if (method !== 'DELETE' && !perms.canEditHr && method !== 'POST') {
      setError('Nincs szerkesztési jogosultság');
      return false;
    }
    if (method === 'POST' && !perms.hasAny('hr:create', 'hr:edit')) {
      setError('Nincs létrehozási jogosultság');
      return false;
    }
    const res = await apiFetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError((err as { message?: string }).message || 'Művelet sikertelen');
      return false;
    }
    await load();
    onUpdated();
    return true;
  };

  if (!emp) {
    return <div className="p-4 text-gray-500">Betöltés...</div>;
  }

  const inputCls = 'w-full border rounded px-2 py-1 text-sm';

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      <div className="flex flex-wrap gap-1 border-b pb-2 mb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-2 py-1 text-xs rounded ${
              tab === t.id ? 'bg-mbit-blue text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-2 p-2 bg-red-50 text-red-700 text-sm rounded">{error}</div>
      )}
      {success && (
        <div className="mb-2 p-2 bg-green-50 text-green-700 text-sm rounded">{success}</div>
      )}

      <div className="flex-1 overflow-y-auto text-sm">
        {tab === 'alap' && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Vezetéknév *">
              <input
                className={inputCls}
                value={String(form.vezetekNev || '')}
                onChange={(e) => setForm({ ...form, vezetekNev: e.target.value })}
              />
            </Field>
            <Field label="Keresztnév *">
              <input
                className={inputCls}
                value={String(form.keresztNev || '')}
                onChange={(e) => setForm({ ...form, keresztNev: e.target.value })}
              />
            </Field>
            <Field label="Születési név">
              <input
                className={inputCls}
                value={String(form.szuletesiNev || '')}
                onChange={(e) => setForm({ ...form, szuletesiNev: e.target.value })}
              />
            </Field>
            <Field label="Anyja neve">
              <input
                className={inputCls}
                value={String(form.anyjaNeve || '')}
                onChange={(e) => setForm({ ...form, anyjaNeve: e.target.value })}
              />
            </Field>
            <Field label="Születési dátum">
              <input
                type="date"
                className={inputCls}
                value={String(form.szuletesiDatum || '')}
                onChange={(e) => setForm({ ...form, szuletesiDatum: e.target.value })}
              />
            </Field>
            <Field label="Születési hely">
              <input
                className={inputCls}
                value={String(form.szuletesiHely || '')}
                onChange={(e) => setForm({ ...form, szuletesiHely: e.target.value })}
              />
            </Field>
            <Field label="TAJ">
              <input
                className={inputCls}
                value={String(form.tajSzam || '')}
                onChange={(e) => setForm({ ...form, tajSzam: e.target.value })}
              />
            </Field>
            <Field label="Adóazonosító">
              <input
                className={inputCls}
                value={String(form.adoszam || '')}
                onChange={(e) => setForm({ ...form, adoszam: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                className={inputCls}
                value={String(form.email || '')}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <Field label="Telefon">
              <input
                className={inputCls}
                value={String(form.telefon || '')}
                onChange={(e) => setForm({ ...form, telefon: e.target.value })}
              />
            </Field>
            <Field label="Lakcím">
              <input
                className={inputCls}
                value={String(form.lakcim || '')}
                onChange={(e) => setForm({ ...form, lakcim: e.target.value })}
              />
            </Field>
            <Field label="Tartózkodási cím">
              <input
                className={inputCls}
                value={String(form.tartozkodasiCim || '')}
                onChange={(e) => setForm({ ...form, tartozkodasiCim: e.target.value })}
              />
            </Field>
            {perms.canEditHr && (
              <div className="col-span-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-mbit-blue text-white rounded"
                  onClick={() =>
                    saveEmployee({
                      vezetekNev: form.vezetekNev,
                      keresztNev: form.keresztNev,
                      szuletesiDatum: form.szuletesiDatum || undefined,
                      szuletesiHely: form.szuletesiHely || undefined,
                      szuletesiNev: form.szuletesiNev || undefined,
                      adoszam: form.adoszam || undefined,
                      anyjaNeve: form.anyjaNeve || undefined,
                      tajSzam: form.tajSzam || undefined,
                      lakcim: form.lakcim || undefined,
                      tartozkodasiCim: form.tartozkodasiCim || undefined,
                      telefon: form.telefon || undefined,
                      email: form.email || undefined,
                    })
                  }
                >
                  Alapadatok mentése
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'jogviszony' && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Jogviszony kezdete">
              <input
                type="date"
                className={inputCls}
                value={String(form.munkaviszonyKezdete || '')}
                onChange={(e) =>
                  setForm({ ...form, munkaviszonyKezdete: e.target.value })
                }
              />
            </Field>
            <Field label="Jogviszony vége">
              <input
                type="date"
                className={inputCls}
                value={String(form.munkaviszonyVege || '')}
                onChange={(e) => setForm({ ...form, munkaviszonyVege: e.target.value })}
              />
            </Field>
            <Field label="Típus">
              <select
                className={inputCls}
                value={String(form.munkaviszonyTipusa || '')}
                onChange={(e) =>
                  setForm({ ...form, munkaviszonyTipusa: e.target.value })
                }
              >
                <option value="">—</option>
                <option value="HATAROZATLAN">Határozatlan</option>
                <option value="HATAROZOTT">Határozott</option>
                <option value="RESZIDOS">Részidős</option>
              </select>
            </Field>
            <Field label="Állapot">
              <select
                className={inputCls}
                value={String(form.allapot || 'ACTIVE')}
                onChange={(e) => setForm({ ...form, allapot: e.target.value })}
              >
                <option value="ACTIVE">Aktív</option>
                <option value="INACTIVE">Inaktív</option>
                <option value="TERMINATED">Megszűnt</option>
              </select>
            </Field>
            <Field label="Besorolás">
              <input
                className={inputCls}
                value={String(form.besorolas || '')}
                onChange={(e) => setForm({ ...form, besorolas: e.target.value })}
              />
            </Field>
            <Field label="Munkaidő">
              <input
                className={inputCls}
                value={String(form.munkaido || '')}
                onChange={(e) => setForm({ ...form, munkaido: e.target.value })}
              />
            </Field>
            {perms.canEditHr && (
              <div className="col-span-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-mbit-blue text-white rounded"
                  onClick={() =>
                    saveEmployee({
                      munkaviszonyKezdete: form.munkaviszonyKezdete || undefined,
                      munkaviszonyVege: form.munkaviszonyVege || undefined,
                      munkaviszonyTipusa: form.munkaviszonyTipusa || undefined,
                      allapot: form.allapot,
                      besorolas: form.besorolas || undefined,
                      munkaido: form.munkaido || undefined,
                      aktiv: form.aktiv,
                    })
                  }
                >
                  Jogviszony mentése
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'munkakor' && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Munkakör">
              <select
                className={inputCls}
                value={String(form.jobPositionId || '')}
                onChange={(e) => setForm({ ...form, jobPositionId: e.target.value })}
              >
                <option value="">—</option>
                {jobPositions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nev}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Osztály">
              <input
                className={inputCls}
                value={String(form.osztaly || '')}
                onChange={(e) => setForm({ ...form, osztaly: e.target.value })}
              />
            </Field>
            <Field label="Részleg">
              <input
                className={inputCls}
                value={String(form.reszleg || '')}
                onChange={(e) => setForm({ ...form, reszleg: e.target.value })}
              />
            </Field>
            {perms.canEditHr && (
              <div className="col-span-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-mbit-blue text-white rounded"
                  onClick={() =>
                    saveEmployee({
                      jobPositionId: form.jobPositionId || undefined,
                      osztaly: form.osztaly || undefined,
                      reszleg: form.reszleg || undefined,
                    })
                  }
                >
                  Mentés
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'vegzettseg' && (
          <SubList
            items={emp.educations || []}
            columns={['tipus', 'iskolaNev', 'szak', 'vegzesEve']}
            labels={['Típus', 'Intézmény', 'Szak', 'Év']}
            onDelete={(id) =>
              crud('DELETE', `/hr/employees/educations/${id}`)
            }
            formFields={[
              { key: 'tipus', label: 'Típus', required: true },
              { key: 'iskolaNev', label: 'Intézmény', required: true },
              { key: 'szak', label: 'Szak' },
              { key: 'vegzesEve', label: 'Végzés éve', type: 'number' },
            ]}
            onAdd={(body) =>
              crud('POST', `/hr/employees/${employeeId}/educations`, body)
            }
            canEdit={perms.canEditHr}
          />
        )}

        {tab === 'korabbi' && (
          <SubList
            items={emp.previousEmployments || []}
            columns={['munkaadoNev', 'munkakor', 'kezdet', 'veg']}
            labels={['Munkáltató', 'Munkakör', 'Kezdet', 'Vég']}
            onDelete={(id) =>
              crud('DELETE', `/hr/employees/previous-employments/${id}`)
            }
            formFields={[
              { key: 'munkaadoNev', label: 'Munkáltató', required: true },
              { key: 'munkakor', label: 'Munkakör' },
              { key: 'kezdet', label: 'Kezdet', type: 'date' },
              { key: 'veg', label: 'Vég', type: 'date' },
            ]}
            onAdd={(body) =>
              crud('POST', `/hr/employees/${employeeId}/previous-employments`, body)
            }
            canEdit={perms.canEditHr}
          />
        )}

        {tab === 'nyelv' && (
          <SubList
            items={emp.languageSkills || []}
            columns={['nyelv', 'szint', 'nyelvvizsga']}
            labels={['Nyelv', 'Szint', 'Vizsga']}
            onDelete={(id) =>
              crud('DELETE', `/hr/employees/language-skills/${id}`)
            }
            formFields={[
              { key: 'nyelv', label: 'Nyelv', required: true },
              { key: 'szint', label: 'Szint', required: true },
              { key: 'nyelvvizsga', label: 'Nyelvvizsga' },
            ]}
            onAdd={(body) =>
              crud('POST', `/hr/employees/${employeeId}/language-skills`, body)
            }
            canEdit={perms.canEditHr}
          />
        )}

        {tab === 'orvosi' && (
          <SubList
            items={emp.medicalExaminations || []}
            columns={['vizsgalatTipusa', 'vizsgalatDatuma', 'ervenyessegVege', 'eredmeny']}
            labels={['Típus', 'Dátum', 'Érvényes', 'Eredmény']}
            dateKeys={['vizsgalatDatuma', 'ervenyessegVege']}
            onDelete={(id) =>
              crud('DELETE', `/hr/employees/medical-examinations/${id}`)
            }
            formFields={[
              { key: 'vizsgalatTipusa', label: 'Típus', required: true },
              { key: 'vizsgalatDatuma', label: 'Dátum', type: 'date', required: true },
              { key: 'ervenyessegVege', label: 'Érvényesség vége', type: 'date' },
              { key: 'eredmeny', label: 'Eredmény' },
            ]}
            onAdd={(body) =>
              crud('POST', `/hr/employees/${employeeId}/medical-examinations`, body)
            }
            canEdit={perms.canEditHr}
          />
        )}

        {tab === 'fegyelmi' && (
          <>
            <h4 className="font-medium mb-2">Fegyelmi</h4>
            <SubList
              items={emp.disciplinaryActions || []}
              columns={['datum', 'tipus', 'indok']}
              labels={['Dátum', 'Típus', 'Indok']}
              dateKeys={['datum']}
              onDelete={(id) =>
                crud('DELETE', `/hr/employees/disciplinary-actions/${id}`)
              }
              formFields={[
                { key: 'datum', label: 'Dátum', type: 'date', required: true },
                { key: 'tipus', label: 'Típus', required: true },
                { key: 'indok', label: 'Indok', required: true },
              ]}
              onAdd={(body) =>
                crud('POST', `/hr/employees/${employeeId}/disciplinary-actions`, body)
              }
              canEdit={perms.canEditHr}
            />
            <h4 className="font-medium mt-4 mb-2">Kitüntetések</h4>
            <SubList
              items={emp.awards || []}
              columns={['megnevezes', 'datum', 'intezmeny']}
              labels={['Megnevezés', 'Dátum', 'Intézmény']}
              dateKeys={['datum']}
              onDelete={(id) => crud('DELETE', `/hr/employees/awards/${id}`)}
              formFields={[
                { key: 'megnevezes', label: 'Megnevezés', required: true },
                { key: 'datum', label: 'Dátum', type: 'date', required: true },
                { key: 'intezmeny', label: 'Intézmény' },
              ]}
              onAdd={(body) => crud('POST', `/hr/employees/${employeeId}/awards`, body)}
              canEdit={perms.canEditHr}
            />
          </>
        )}

        {tab === 'tanulmanyi' && (
          <SubList
            items={emp.studyContracts || []}
            columns={['szerzodesSzam', 'tanulmanyiIntezmeny', 'kezdetDatum', 'vegDatum']}
            labels={['Szám', 'Intézmény', 'Kezdet', 'Vég']}
            dateKeys={['kezdetDatum', 'vegDatum']}
            onDelete={(id) =>
              crud('DELETE', `/hr/employees/study-contracts/${id}`)
            }
            formFields={[
              { key: 'szerzodesSzam', label: 'Szerződésszám', required: true },
              { key: 'tanulmanyiIntezmeny', label: 'Intézmény', required: true },
              { key: 'kezdetDatum', label: 'Kezdet', type: 'date', required: true },
              { key: 'vegDatum', label: 'Vég', type: 'date' },
              { key: 'koltseg', label: 'Költség', type: 'number' },
            ]}
            onAdd={(body) =>
              crud('POST', `/hr/employees/${employeeId}/study-contracts`, {
                ...body,
                visszafizetesiKotelezettseg: false,
              })
            }
            canEdit={perms.canEditHr}
          />
        )}

        {tab === 'szerzodes' && (
          <div className="space-y-2">
            {(emp.employmentContracts || []).map((c: any) => (
              <div
                key={c.id}
                className="border rounded p-2 flex justify-between items-start"
              >
                <div>
                  <div className="font-medium">
                    {c.szerzodesSzam}{' '}
                    {c.aktiv && (
                      <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                        aktív
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    {c.tipus} · {c.kezdetDatum?.slice(0, 10)}
                    {c.amendments?.length
                      ? ` · ${c.amendments.length} módosítás`
                      : ''}
                  </div>
                </div>
                {perms.canManageContracts && (
                  <button
                    type="button"
                    className="text-xs text-blue-600"
                    onClick={async () => {
                      await apiFetch(`/hr/contracts/${c.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ aktiv: true }),
                      });
                      load();
                    }}
                  >
                    Aktívvá tétel
                  </button>
                )}
              </div>
            ))}
            <p className="text-xs text-gray-500">
              Új szerződés: HR → Szerződések menü
            </p>
          </div>
        )}

        {tab === 'dokumentum' && perms.canViewDms && (
          <div className="space-y-4">
            <p className="text-xs text-gray-600">
              HR dokumentumok a központi DMS-ben tárolódnak. Csatoljon munkaszerződést a
              Szerződések menüben, munkaköri leírást a Munkakörök szerkesztésénél.
            </p>
            <DmsDocumentLinker
              label="Végzettségi dokumentum (példa – mentés külön rekordhoz DMS-ben)"
              suggestionKey="vegzettseg"
              onLinked={() => undefined}
            />
          </div>
        )}

        {tab === 'audit' && (
          <div>
            {!perms.canViewAudit ? (
              <p className="text-gray-500">Nincs audit megtekintési jogosultság.</p>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-1">Időpont</th>
                    <th className="text-left p-1">Esemény</th>
                    <th className="text-left p-1">Felhasználó</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((l: any) => (
                    <tr key={l.id} className="border-b">
                      <td className="p-1">
                        {new Date(l.createdAt).toLocaleString('hu-HU')}
                      </td>
                      <td className="p-1">{l.esemeny}</td>
                      <td className="p-1">{l.user?.nev || l.user?.email || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SubList({
  items,
  columns,
  labels,
  dateKeys = [],
  formFields,
  onAdd,
  onDelete,
  canEdit,
}: {
  items: any[];
  columns: string[];
  labels: string[];
  dateKeys?: string[];
  formFields: {
    key: string;
    label: string;
    required?: boolean;
    type?: string;
  }[];
  onAdd: (body: Record<string, unknown>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  canEdit: boolean;
}) {
  const [draft, setDraft] = useState<Record<string, string>>({});

  const fmt = (row: any, key: string) => {
    const v = row[key];
    if (!v) return '—';
    if (dateKeys.includes(key)) return String(v).slice(0, 10);
    return String(v);
  };

  return (
    <div>
      <table className="w-full text-xs mb-3">
        <thead>
          <tr className="border-b bg-gray-50">
            {labels.map((l) => (
              <th key={l} className="text-left p-1">
                {l}
              </th>
            ))}
            {canEdit && <th className="p-1 w-16" />}
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id} className="border-b">
              {columns.map((c) => (
                <td key={c} className="p-1">
                  {fmt(row, c)}
                </td>
              ))}
              {canEdit && (
                <td className="p-1">
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() => {
                      if (confirm('Törlés?')) onDelete(row.id);
                    }}
                  >
                    Törlés
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {canEdit && (
        <div className="border rounded p-2 bg-gray-50 space-y-2">
          <div className="font-medium text-xs">Új elem</div>
          <div className="grid grid-cols-2 gap-2">
            {formFields.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-gray-600">{f.label}</label>
                <input
                  type={f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text'}
                  className="w-full border rounded px-1 py-0.5 text-sm"
                  value={draft[f.key] || ''}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="px-3 py-1 bg-gray-800 text-white rounded text-xs"
            onClick={async () => {
              for (const f of formFields) {
                if (f.required && !draft[f.key]?.trim()) return;
              }
              const body: Record<string, unknown> = {};
              formFields.forEach((f) => {
                if (draft[f.key]) {
                  body[f.key] =
                    f.type === 'number' ? Number(draft[f.key]) : draft[f.key];
                }
              });
              const ok = await onAdd(body);
              if (ok) setDraft({});
            }}
          >
            Hozzáadás
          </button>
        </div>
      )}
    </div>
  );
}
