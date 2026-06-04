import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { apiFetch } from '../lib/api';

interface PurchaseOrderItem {
  id?: string;
  itemId: string;
  mennyiseg: number;
  egysegAr: number;
  osszeg: number;
  item?: { id: string; nev: string; azonosito: string; beszerzesiAr?: number };
}

interface PurchaseOrder {
  id: string;
  azonosito: string;
  supplierId: string;
  rendelesiDatum: string;
  szallitasiDatum?: string | null;
  osszeg: number;
  afa: number;
  vegosszeg: number;
  allapot: string;
  megjegyzesek?: string | null;
  supplier?: { id: string; nev: string };
  items?: PurchaseOrderItem[];
}

interface Supplier {
  id: string;
  nev: string;
}

interface Item {
  id: string;
  nev: string;
  azonosito: string;
  beszerzesiAr: number;
}

const ALLAPOTOK = [
  { kod: 'DRAFT', nev: 'Tervezet', szin: 'bg-yellow-100 text-yellow-800' },
  { kod: 'APPROVED', nev: 'Jóváhagyva', szin: 'bg-blue-100 text-blue-800' },
  { kod: 'ORDERED', nev: 'Rendelve', szin: 'bg-purple-100 text-purple-800' },
  { kod: 'BEEERKEZETT', nev: 'Beérkezett', szin: 'bg-green-100 text-green-800' },
  { kod: 'LEZARVA', nev: 'Lezárva', szin: 'bg-gray-100 text-gray-800' },
];

const isDraft = (allapot: string) => ['DRAFT', 'TERVEZET', 'NYITOTT'].includes(allapot?.toUpperCase?.() ?? allapot);
const isClosed = (allapot: string) => ['BEEERKEZETT', 'RECEIVED', 'LEZARVA', 'CLOSED'].includes(allapot?.toUpperCase?.() ?? allapot);

export default function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const [formData, setFormData] = useState({
    supplierId: '',
    szallitasiDatum: '',
    megjegyzesek: '',
    allapot: 'DRAFT',
    items: [{ itemId: '', mennyiseg: '1', egysegAr: '0' }],
  });

  useEffect(() => {
    loadOrders();
    loadSuppliers();
    loadItems();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/logistics/purchase-orders?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Hiba a rendelések betöltésekor');
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    const response = await apiFetch('/logistics/suppliers?skip=0&take=200');
    if (response.ok) {
      const data = await response.json();
      setSuppliers(data.data || data.items || []);
    }
  };

  const loadItems = async () => {
    const response = await apiFetch('/logistics/items?skip=0&take=500');
    if (response.ok) {
      const data = await response.json();
      setItems(data.items || []);
    }
  };

  const getStatusBadge = (allapot: string) => {
    const info = ALLAPOTOK.find((a) => a.kod === allapot?.toUpperCase()) || {
      kod: allapot,
      nev: allapot,
      szin: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${info.szin}`}>{info.nev}</span>
    );
  };

  const calcTotals = (lineItems: typeof formData.items) => {
    let osszeg = 0;
    const mapped = lineItems
      .filter((i) => i.itemId)
      .map((i) => {
        const mennyiseg = parseFloat(i.mennyiseg) || 0;
        const egysegAr = parseFloat(i.egysegAr) || 0;
        const rowOsszeg = mennyiseg * egysegAr;
        osszeg += rowOsszeg;
        return { itemId: i.itemId, mennyiseg, egysegAr, osszeg: rowOsszeg };
      });
    const afa = osszeg * 0.27;
    return { items: mapped, osszeg, afa, vegosszeg: osszeg + afa };
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      supplierId: '',
      szallitasiDatum: '',
      megjegyzesek: '',
      allapot: 'DRAFT',
      items: [{ itemId: '', mennyiseg: '1', egysegAr: '0' }],
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (order: PurchaseOrder) => {
    if (!isDraft(order.allapot)) {
      setError('Csak tervezet állapotú rendelés szerkeszthető teljes körűen.');
      return;
    }
    const response = await apiFetch(`/logistics/purchase-orders/${order.id}`);
    const full = response.ok ? await response.json() : order;
    setEditingId(order.id);
    setFormData({
      supplierId: full.supplierId,
      szallitasiDatum: full.szallitasiDatum ? full.szallitasiDatum.split('T')[0] : '',
      megjegyzesek: full.megjegyzesek || '',
      allapot: full.allapot,
      items: full.items?.map((i: PurchaseOrderItem) => ({
        itemId: i.itemId,
        mennyiseg: i.mennyiseg.toString(),
        egysegAr: i.egysegAr.toString(),
      })) || [{ itemId: '', mennyiseg: '1', egysegAr: '0' }],
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const totals = calcTotals(formData.items);
      if (!formData.supplierId) throw new Error('Szállító kiválasztása kötelező');
      if (totals.items.length === 0) throw new Error('Legalább egy tétel szükséges');

      const payload = {
        supplierId: formData.supplierId,
        szallitasiDatum: formData.szallitasiDatum || undefined,
        megjegyzesek: formData.megjegyzesek || undefined,
        allapot: formData.allapot,
        ...totals,
      };

      const url = editingId
        ? `/logistics/purchase-orders/${editingId}`
        : '/logistics/purchase-orders';
      const method = editingId ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Mentés sikertelen');
      }

      setSuccess(editingId ? 'Rendelés frissítve!' : 'Rendelés létrehozva!');
      setIsModalOpen(false);
      loadOrders();
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (order: PurchaseOrder) => {
    if (!isDraft(order.allapot)) {
      setError('Csak tervezet (DRAFT) állapotú rendelés törölhető.');
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: 'Rendelés törlése',
      message: `Biztosan törli a rendelést: ${order.azonosito}?`,
      onConfirm: async () => {
        try {
          const response = await apiFetch(`/logistics/purchase-orders/${order.id}`, { method: 'DELETE' });
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Törlés sikertelen');
          }
          setSuccess('Rendelés törölve.');
          loadOrders();
        } catch (err: any) {
          setError(err.message || 'Törlés sikertelen');
        }
      },
    });
  };

  const handleArchive = (order: PurchaseOrder) => {
    setConfirmModal({
      isOpen: true,
      title: 'Rendelés archiválása',
      message: `Biztosan archiválja (lezárja) a rendelést: ${order.azonosito}?`,
      onConfirm: async () => {
        try {
          const response = await apiFetch(`/logistics/purchase-orders/${order.id}/archive`, { method: 'POST' });
          if (!response.ok) throw new Error('Archiválás sikertelen');
          setSuccess('Rendelés archiválva.');
          loadOrders();
        } catch (err: any) {
          setError(err.message || 'Archiválás sikertelen');
        }
      },
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Beszerzési rendelések</h1>
        <button onClick={handleOpenCreate} className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600">
          + Új rendelés
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs beszerzési rendelés</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium">Azonosító</th>
                <th className="text-left p-4 font-medium">Szállító</th>
                <th className="text-left p-4 font-medium">Dátum</th>
                <th className="text-right p-4 font-medium">Végösszeg</th>
                <th className="text-left p-4 font-medium">Állapot</th>
                <th className="text-right p-4 font-medium">Műveletek</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{order.azonosito}</td>
                  <td className="p-4 text-sm">{order.supplier?.nev || '-'}</td>
                  <td className="p-4 text-sm">{new Date(order.rendelesiDatum).toLocaleDateString('hu-HU')}</td>
                  <td className="p-4 text-right">{order.vegosszeg.toLocaleString('hu-HU')} Ft</td>
                  <td className="p-4">{getStatusBadge(order.allapot)}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={async () => {
                        const res = await apiFetch(`/logistics/purchase-orders/${order.id}`);
                        if (res.ok) {
                          setSelectedOrder(await res.json());
                          setIsDetailOpen(true);
                        }
                      }}
                      className="text-gray-600 hover:text-gray-900 text-sm"
                    >
                      Megtekintés
                    </button>
                    {isDraft(order.allapot) && (
                      <>
                        <button onClick={() => handleOpenEdit(order)} className="text-mbit-blue text-sm">
                          Szerkesztés
                        </button>
                        <button onClick={() => handleDelete(order)} className="text-red-600 text-sm">
                          Törlés
                        </button>
                      </>
                    )}
                    {!isDraft(order.allapot) && !isClosed(order.allapot) && (
                      <button onClick={() => handleArchive(order)} className="text-gray-600 text-sm">
                        Archiválás
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Rendelés szerkesztése' : 'Új beszerzési rendelés'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Szállító *</label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Válasszon...</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.nev}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Szállítási dátum</label>
              <input
                type="date"
                value={formData.szallitasiDatum}
                onChange={(e) => setFormData({ ...formData, szallitasiDatum: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Megjegyzések</label>
            <textarea
              value={formData.megjegyzesek}
              onChange={(e) => setFormData({ ...formData, megjegyzesek: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={2}
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Tételek</label>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    items: [...formData.items, { itemId: '', mennyiseg: '1', egysegAr: '0' }],
                  })
                }
                className="text-sm text-green-600"
              >
                + Tétel
              </button>
            </div>
            {formData.items.map((line, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                <select
                  value={line.itemId}
                  onChange={(e) => {
                    const newItems = [...formData.items];
                    newItems[idx].itemId = e.target.value;
                    const item = items.find((i) => i.id === e.target.value);
                    if (item) newItems[idx].egysegAr = (item.beszerzesiAr || 0).toString();
                    setFormData({ ...formData, items: newItems });
                  }}
                  className="border rounded px-2 py-1 col-span-2"
                  required
                >
                  <option value="">Termék...</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>{i.azonosito} – {i.nev}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={line.mennyiseg}
                  onChange={(e) => {
                    const newItems = [...formData.items];
                    newItems[idx].mennyiseg = e.target.value;
                    setFormData({ ...formData, items: newItems });
                  }}
                  className="border rounded px-2 py-1"
                  placeholder="Menny."
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={line.egysegAr}
                  onChange={(e) => {
                    const newItems = [...formData.items];
                    newItems[idx].egysegAr = e.target.value;
                    setFormData({ ...formData, items: newItems });
                  }}
                  className="border rounded px-2 py-1"
                  placeholder="Egységár"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">
              Mégse
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-mbit-blue text-white rounded disabled:opacity-50">
              {saving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title={selectedOrder ? `Rendelés: ${selectedOrder.azonosito}` : ''} size="lg">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-600">Szállító:</span> {selectedOrder.supplier?.nev}</div>
              <div><span className="text-gray-600">Állapot:</span> {getStatusBadge(selectedOrder.allapot)}</div>
              <div><span className="text-gray-600">Végösszeg:</span> {selectedOrder.vegosszeg.toLocaleString('hu-HU')} Ft</div>
            </div>
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Termék</th>
                    <th className="text-right p-2">Menny.</th>
                    <th className="text-right p-2">Egységár</th>
                    <th className="text-right p-2">Összeg</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id || item.itemId} className="border-t">
                      <td className="p-2">{item.item?.nev || item.itemId}</td>
                      <td className="p-2 text-right">{item.mennyiseg}</td>
                      <td className="p-2 text-right">{item.egysegAr.toLocaleString('hu-HU')} Ft</td>
                      <td className="p-2 text-right">{item.osszeg.toLocaleString('hu-HU')} Ft</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
}
