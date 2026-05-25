import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import { apiFetch } from '../../lib/api';
import { usePermissions } from '../../hooks/usePermissions';

interface PurchaseOrder {
  id: string;
  azonosito: string;
  allapot: string;
  vegosszeg: number;
  szallitasiDatum?: string;
  supplier?: { id: string; nev: string };
  items?: Array<{
    itemId: string;
    mennyiseg: number;
    egysegAr: number;
    item?: { nev: string; azonosito: string };
  }>;
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Piszkozat',
  approved: 'Jóváhagyva',
  ordered: 'Megrendelve',
  partial: 'Részleges',
  received: 'Beérkezett',
  closed: 'Lezárva',
  DRAFT: 'Piszkozat',
  APPROVED: 'Jóváhagyva',
  ORDERED: 'Megrendelve',
  BEEERKEZETT: 'Beérkezett',
  LEZARVA: 'Lezárva',
};

export default function PurchaseOrders() {
  const { hasAny, loading: permLoading } = usePermissions();
  const canCreate = hasAny('purchase_order:create', 'purchase:manage');
  const canReceive = hasAny('purchase_order:receive', 'purchase:manage');
  const canApprove = hasAny('purchase_order:approve', 'purchase:manage');
  const canClose = hasAny('purchase_order:edit', 'purchase:manage');

  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; nev: string }>>([]);
  const [items, setItems] = useState<Array<{ id: string; nev: string; azonosito: string; beszerzesiAr: number }>>([]);
  const [warehouses, setWarehouses] = useState<Array<{ id: string; nev: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [receiveOrder, setReceiveOrder] = useState<PurchaseOrder | null>(null);
  const [receiveWarehouseId, setReceiveWarehouseId] = useState('');
  const [receiveQty, setReceiveQty] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    supplierId: '',
    szallitasiDatum: '',
    megjegyzesek: '',
    lines: [{ itemId: '', mennyiseg: '1', egysegAr: '0' }],
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const q = filterStatus ? `?allapot=${filterStatus}` : '';
      const [poRes, supRes, itemRes, whRes] = await Promise.all([
        apiFetch(`/logistics/purchase-orders${q}`),
        apiFetch('/logistics/suppliers?take=200'),
        apiFetch('/logistics/items?take=200'),
        apiFetch('/logistics/warehouses'),
      ]);
      if (poRes.ok) {
        const data = await poRes.json();
        setOrders(data.data || []);
      }
      if (supRes.ok) {
        const s = await supRes.json();
        setSuppliers(s.data || s.items || s || []);
      }
      if (itemRes.ok) {
        const i = await itemRes.json();
        setItems(i.items || []);
      }
      if (whRes.ok) setWarehouses(await whRes.json());
    } catch {
      setError('Betöltési hiba');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filterStatus]);

  const createOrder = async () => {
    if (!canCreate) return;
    setError('');
    const lines = form.lines.filter((l) => l.itemId);
    if (!form.supplierId || lines.length === 0) {
      setError('Szállító és legalább egy tétel kötelező');
      return;
    }
    let osszeg = 0;
    const itemsPayload = lines.map((l) => {
      const mennyiseg = parseFloat(l.mennyiseg) || 0;
      const egysegAr = parseFloat(l.egysegAr) || 0;
      const lineSum = mennyiseg * egysegAr;
      osszeg += lineSum;
      return { itemId: l.itemId, mennyiseg, egysegAr, osszeg: lineSum };
    });
    const afa = osszeg * 0.27;
    const res = await apiFetch('/logistics/purchase-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supplierId: form.supplierId,
        allapot: 'draft',
        szallitasiDatum: form.szallitasiDatum || undefined,
        megjegyzesek: form.megjegyzesek || undefined,
        osszeg,
        afa,
        vegosszeg: osszeg + afa,
        items: itemsPayload,
      }),
    });
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).message || 'Mentés sikertelen');
      return;
    }
    setSuccess('Beszerzési rendelés létrehozva');
    setIsCreateOpen(false);
    load();
  };

  const action = async (id: string, path: string) => {
    const res = await apiFetch(`/logistics/purchase-orders/${id}/${path}`, { method: 'POST' });
    if (!res.ok) {
      setError('Művelet sikertelen');
      return;
    }
    setSuccess('Státusz frissítve');
    load();
  };

  const submitReceive = async () => {
    if (!receiveOrder || !receiveWarehouseId) return;
    const receivedItems = (receiveOrder.items || [])
      .map((it) => ({
        itemId: it.itemId,
        mennyiseg: parseFloat(receiveQty[it.itemId] || '0'),
      }))
      .filter((r) => r.mennyiseg > 0);
    if (receivedItems.length === 0) {
      setError('Adjon meg beérkezett mennyiséget');
      return;
    }
    const res = await apiFetch(`/logistics/purchase-orders/${receiveOrder.id}/receive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ warehouseId: receiveWarehouseId, receivedItems }),
    });
    if (!res.ok) {
      setError('Beérkezés rögzítése sikertelen');
      return;
    }
    setSuccess('Beérkezés rögzítve, készlet frissítve');
    setReceiveOrder(null);
    load();
  };

  if (permLoading) return <div className="p-6">Betöltés...</div>;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">Beszerzések</h1>
        {canCreate && (
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="bg-mbit-blue text-white px-4 py-2 rounded"
          >
            Rendelés létrehozása
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-800 rounded">{error}</div>}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-800 rounded" onAnimationEnd={() => setSuccess('')}>
          {success}
        </div>
      )}

      <div className="mb-4">
        <select
          className="border rounded px-3 py-2"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Minden állapot</option>
          {Object.entries(STATUS_LABELS).filter(([k]) => k === k.toLowerCase()).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Betöltés...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">Nincs beszerzési rendelés. Hozzon létre újat a fenti gombbal.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Azonosító</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Szállító</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Állapot</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Összeg</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Műveletek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 text-sm font-medium">{o.azonosito}</td>
                  <td className="px-4 py-3 text-sm">{o.supplier?.nev || '-'}</td>
                  <td className="px-4 py-3 text-sm">{STATUS_LABELS[o.allapot] || o.allapot}</td>
                  <td className="px-4 py-3 text-sm text-right">{o.vegosszeg?.toLocaleString('hu-HU')} Ft</td>
                  <td className="px-4 py-3 text-sm flex flex-wrap gap-1">
                    {canApprove && ['draft', 'DRAFT'].includes(o.allapot) && (
                      <button type="button" className="text-xs px-2 py-1 border rounded" onClick={() => action(o.id, 'approve')}>
                        Jóváhagyás
                      </button>
                    )}
                    {canCreate && ['approved', 'APPROVED'].includes(o.allapot) && (
                      <button type="button" className="text-xs px-2 py-1 border rounded" onClick={() => action(o.id, 'order')}>
                        Megrendelés
                      </button>
                    )}
                    {canReceive && !['closed', 'CLOSED', 'LEZARVA'].includes(o.allapot) && (
                      <button
                        type="button"
                        className="text-xs px-2 py-1 bg-green-100 rounded"
                        onClick={() => {
                          setReceiveOrder(o);
                          const q: Record<string, string> = {};
                          o.items?.forEach((it) => {
                            q[it.itemId] = String(it.mennyiseg);
                          });
                          setReceiveQty(q);
                        }}
                      >
                        Beérkezés rögzítése
                      </button>
                    )}
                    {canClose && !['closed', 'CLOSED'].includes(o.allapot) && (
                      <button type="button" className="text-xs px-2 py-1 border rounded" onClick={() => action(o.id, 'close')}>
                        Lezárás
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Új beszerzési rendelés">
        <div className="space-y-3">
          <label className="block text-sm font-medium">Szállító</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={form.supplierId}
            onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
          >
            <option value="">Válasszon...</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nev}
              </option>
            ))}
          </select>
          <label className="block text-sm font-medium">Várható beérkezés</label>
          <input
            type="date"
            className="w-full border rounded px-2 py-1"
            value={form.szallitasiDatum}
            onChange={(e) => setForm({ ...form, szallitasiDatum: e.target.value })}
          />
          {form.lines.map((line, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2">
              <select
                className="border rounded px-2 py-1 col-span-2"
                value={line.itemId}
                onChange={(e) => {
                  const next = [...form.lines];
                  next[idx].itemId = e.target.value;
                  const item = items.find((i) => i.id === e.target.value);
                  if (item) next[idx].egysegAr = String(item.beszerzesiAr);
                  setForm({ ...form, lines: next });
                }}
              >
                <option value="">Cikk...</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.azonosito} – {i.nev}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="border rounded px-2 py-1"
                placeholder="Db"
                value={line.mennyiseg}
                onChange={(e) => {
                  const next = [...form.lines];
                  next[idx].mennyiseg = e.target.value;
                  setForm({ ...form, lines: next });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-mbit-blue"
            onClick={() => setForm({ ...form, lines: [...form.lines, { itemId: '', mennyiseg: '1', egysegAr: '0' }] })}
          >
            + Tétel
          </button>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setIsCreateOpen(false)}>
              Mégse
            </button>
            <button type="button" className="px-4 py-2 bg-mbit-blue text-white rounded" onClick={createOrder}>
              Mentés
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!receiveOrder}
        onClose={() => setReceiveOrder(null)}
        title={`Beérkezés – ${receiveOrder?.azonosito}`}
      >
        <label className="block text-sm font-medium mb-1">Raktár</label>
        <select
          className="w-full border rounded px-2 py-1 mb-3"
          value={receiveWarehouseId}
          onChange={(e) => setReceiveWarehouseId(e.target.value)}
        >
          <option value="">Válasszon raktárat...</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.nev}
            </option>
          ))}
        </select>
        {receiveOrder?.items?.map((it) => (
          <div key={it.itemId} className="flex justify-between items-center mb-2 text-sm">
            <span>{it.item?.nev || it.itemId}</span>
            <input
              type="number"
              className="border rounded w-24 px-2 py-1"
              value={receiveQty[it.itemId] || ''}
              onChange={(e) => setReceiveQty({ ...receiveQty, [it.itemId]: e.target.value })}
            />
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="px-4 py-2 border rounded" onClick={() => setReceiveOrder(null)}>
            Mégse
          </button>
          <button type="button" className="px-4 py-2 bg-green-600 text-white rounded" onClick={submitReceive}>
            Készletre vétel
          </button>
        </div>
      </Modal>
    </div>
  );
}
