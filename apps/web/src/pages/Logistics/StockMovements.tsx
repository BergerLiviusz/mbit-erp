import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import { apiFetch } from '../../lib/api';
import { usePermissions } from '../../hooks/usePermissions';

const TIPUSOK = [
  { value: 'BEVETEL', label: 'Bevételezés' },
  { value: 'KIADAS', label: 'Kiadás' },
  { value: 'KORREKCIO', label: 'Korrekció' },
  { value: 'ATMOZGATAS', label: 'Raktárközi átmozgatás' },
];

export default function StockMovements() {
  const { hasAny, canExportLogistics, loading: permLoading } = usePermissions();
  const canMove = hasAny('stock:move', 'inventory:manage', 'logistics:edit');

  const [movements, setMovements] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    tipus: 'BEVETEL',
    itemId: '',
    warehouseId: '',
    forrasRaktarId: '',
    celRaktarId: '',
    mennyiseg: '',
    sarzsGyartasiSzam: '',
    megjegyzesek: '',
    referenciaAzonosito: '',
  });

  const load = async () => {
    setLoading(true);
    const [mRes, iRes, wRes] = await Promise.all([
      apiFetch('/logistics/stock-movements?take=200'),
      apiFetch('/logistics/items?take=300'),
      apiFetch('/logistics/warehouses'),
    ]);
    if (mRes.ok) {
      const d = await mRes.json();
      setMovements(d.movements || []);
    }
    if (iRes.ok) {
      const d = await iRes.json();
      setItems(d.items || []);
    }
    if (wRes.ok) setWarehouses(await wRes.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!canMove) return;
    const body: Record<string, unknown> = {
      tipus: form.tipus,
      itemId: form.itemId,
      warehouseId: form.warehouseId || form.forrasRaktarId,
      mennyiseg: parseFloat(form.mennyiseg),
      sarzsGyartasiSzam: form.sarzsGyartasiSzam || undefined,
      megjegyzesek: form.megjegyzesek || undefined,
      referenciaAzonosito: form.referenciaAzonosito || undefined,
      referenciaTipus: 'MANUAL',
    };
    if (form.tipus === 'ATMOZGATAS') {
      body.forrasRaktarId = form.forrasRaktarId;
      body.celRaktarId = form.celRaktarId;
      body.warehouseId = form.forrasRaktarId;
    }
    const res = await apiFetch('/logistics/stock-movements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.message || 'Mozgás rögzítése sikertelen');
      return;
    }
    setOpen(false);
    setError('');
    load();
  };

  const downloadExport = async (format: 'csv' | 'xlsx') => {
    const res = await apiFetch(`/logistics/reports/stock-movements/export/${format}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keszletmozgasok.${format === 'csv' ? 'csv' : 'xlsx'}`;
    a.click();
  };

  if (permLoading) return <p className="p-6">Betöltés...</p>;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">Készletmozgások</h1>
        <div className="flex gap-2">
          {canExportLogistics && (
            <>
              <button type="button" className="text-sm border px-3 py-1 rounded" onClick={() => downloadExport('csv')}>
                Export CSV
              </button>
              <button type="button" className="text-sm border px-3 py-1 rounded" onClick={() => downloadExport('xlsx')}>
                Export XLSX
              </button>
            </>
          )}
          {canMove && (
            <button type="button" className="bg-mbit-blue text-white px-4 py-2 rounded" onClick={() => setOpen(true)}>
              Új mozgás
            </button>
          )}
        </div>
      </div>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-800 rounded">{error}</div>}
      {loading ? (
        <p>Betöltés...</p>
      ) : movements.length === 0 ? (
        <p className="text-gray-600">Még nincs készletmozgás rögzítve.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Dátum</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Típus</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Cikk</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Raktár</th>
              <th className="px-4 py-2 text-right text-xs text-gray-500">Mennyiség</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Sarzs</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} className="divide-y">
                <td className="px-4 py-2 text-sm">{new Date(m.createdAt).toLocaleString('hu-HU')}</td>
                <td className="px-4 py-2 text-sm">{m.tipus}</td>
                <td className="px-4 py-2 text-sm">{m.item?.nev}</td>
                <td className="px-4 py-2 text-sm">{m.warehouse?.nev}</td>
                <td className="px-4 py-2 text-sm text-right">{m.mennyiseg}</td>
                <td className="px-4 py-2 text-sm">{m.sarzsGyartasiSzam || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Készletmozgás rögzítése">
        <div className="space-y-3">
          <select className="w-full border rounded px-2 py-1" value={form.tipus} onChange={(e) => setForm({ ...form, tipus: e.target.value })}>
            {TIPUSOK.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <select className="w-full border rounded px-2 py-1" value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })}>
            <option value="">Cikk...</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.azonosito} – {i.nev}
              </option>
            ))}
          </select>
          {form.tipus === 'ATMOZGATAS' ? (
            <>
              <select className="w-full border rounded px-2 py-1" value={form.forrasRaktarId} onChange={(e) => setForm({ ...form, forrasRaktarId: e.target.value })}>
                <option value="">Forrás raktár...</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nev}
                  </option>
                ))}
              </select>
              <select className="w-full border rounded px-2 py-1" value={form.celRaktarId} onChange={(e) => setForm({ ...form, celRaktarId: e.target.value })}>
                <option value="">Cél raktár...</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nev}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <select className="w-full border rounded px-2 py-1" value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })}>
              <option value="">Raktár...</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.nev}
                </option>
              ))}
            </select>
          )}
          <input type="number" className="w-full border rounded px-2 py-1" placeholder="Mennyiség" value={form.mennyiseg} onChange={(e) => setForm({ ...form, mennyiseg: e.target.value })} />
          <input type="text" className="w-full border rounded px-2 py-1" placeholder="Sarzs (opcionális)" value={form.sarzsGyartasiSzam} onChange={(e) => setForm({ ...form, sarzsGyartasiSzam: e.target.value })} />
          <input type="text" className="w-full border rounded px-2 py-1" placeholder="Referencia bizonylat" value={form.referenciaAzonosito} onChange={(e) => setForm({ ...form, referenciaAzonosito: e.target.value })} />
          <textarea className="w-full border rounded px-2 py-1" placeholder="Megjegyzés" value={form.megjegyzesek} onChange={(e) => setForm({ ...form, megjegyzesek: e.target.value })} />
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setOpen(false)}>
              Mégse
            </button>
            <button type="button" className="px-4 py-2 bg-mbit-blue text-white rounded" onClick={submit}>
              Rögzítés
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
