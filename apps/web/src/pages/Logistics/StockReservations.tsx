import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import Modal from '../../components/Modal';

interface StockReservation {
  id: string;
  itemId: string;
  warehouseId: string;
  locationId?: string | null;
  orderId?: string | null;
  purchaseOrderId?: string | null;
  mennyiseg: number;
  allapot: string;
  megjegyzesek?: string | null;
  createdAt: string;
  updatedAt: string;
  item?: {
    id: string;
    nev: string;
    azonosito: string;
    egyseg: string;
  };
  warehouse?: {
    id: string;
    nev: string;
    azonosito: string;
  };
}

interface ExpectedReceipt {
  id: string;
  warehouseId: string;
  purchaseOrderId?: string | null;
  vartBeerkezes: string;
  allapot: string;
  megjegyzesek?: string | null;
  createdAt: string;
  updatedAt: string;
  warehouse?: {
    id: string;
    nev: string;
    azonosito: string;
  };
  items?: ExpectedReceiptItem[];
  _count?: {
    items: number;
  };
}

interface ExpectedReceiptItem {
  id: string;
  expectedReceiptId: string;
  itemId: string;
  mennyiseg: number;
  egysegAr?: number | null;
  megjegyzesek?: string | null;
  item?: {
    id: string;
    nev: string;
    azonosito: string;
  };
}

interface Item {
  id: string;
  nev: string;
  azonosito: string;
  egyseg: string;
}

interface Warehouse {
  id: string;
  nev: string;
  azonosito: string;
}

const ALLAPOTOK = [
  { kod: 'FOGLALT', nev: 'Foglalt', szin: 'bg-blue-100 text-blue-800' },
  { kod: 'KISZALLITVA', nev: 'Kiszállítva', szin: 'bg-green-100 text-green-800' },
  { kod: 'TOROLVE', nev: 'Törölve', szin: 'bg-red-100 text-red-800' },
];

const ERKEZES_ALLAPOTOK = [
  { kod: 'VAR', nev: 'Várható', szin: 'bg-yellow-100 text-yellow-800' },
  { kod: 'ERKEZETT', nev: 'Beérkezett', szin: 'bg-green-100 text-green-800' },
  { kod: 'TOROLVE', nev: 'Törölve', szin: 'bg-red-100 text-red-800' },
];

export default function StockReservations() {
  const [activeTab, setActiveTab] = useState<'reservations' | 'expected-receipts'>('reservations');
  const [reservations, setReservations] = useState<StockReservation[]>([]);
  const [expectedReceipts, setExpectedReceipts] = useState<ExpectedReceipt[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ExpectedReceipt | null>(null);

  const [reservationFormData, setReservationFormData] = useState({
    itemId: '',
    warehouseId: '',
    locationId: '',
    orderId: '',
    mennyiseg: '',
    megjegyzesek: '',
  });

  const [receiptFormData, setReceiptFormData] = useState({
    warehouseId: '',
    purchaseOrderId: '',
    vartBeerkezes: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    megjegyzesek: '',
    items: [] as Array<{
      itemId: string;
      mennyiseg: string;
      egysegAr: string;
      megjegyzesek: string;
    }>,
  });

  const [filters, setFilters] = useState({
    itemId: '',
    warehouseId: '',
    orderId: '',
    allapot: '',
  });

  useEffect(() => {
    loadItems();
    loadWarehouses();
    if (activeTab === 'reservations') {
      loadReservations();
    } else {
      loadExpectedReceipts();
    }
  }, [activeTab, filters]);

  const loadItems = async () => {
    try {
      const response = await apiFetch('/logistics/items?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Hiba a termékek betöltésekor:', err);
    }
  };

  const loadWarehouses = async () => {
    try {
      const response = await apiFetch('/logistics/warehouses?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setWarehouses(data.data || []);
      }
    } catch (err) {
      console.error('Hiba a raktárak betöltésekor:', err);
    }
  };

  const loadReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.itemId) queryParams.append('itemId', filters.itemId);
      if (filters.warehouseId) queryParams.append('warehouseId', filters.warehouseId);
      if (filters.orderId) queryParams.append('orderId', filters.orderId);
      if (filters.allapot) queryParams.append('allapot', filters.allapot);

      const response = await apiFetch(`/logistics/stock-reservations?skip=0&take=100&${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReservations(data.items || []);
      } else {
        throw new Error('Hiba a foglaltságok betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const loadExpectedReceipts = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.warehouseId) queryParams.append('warehouseId', filters.warehouseId);

      const url = `/logistics/stock-reservations/expected-receipts?skip=0&take=100${queryParams.toString() ? '&' + queryParams.toString() : ''}`;
      const response = await apiFetch(url);
      if (response.ok) {
        const data = await response.json();
        setExpectedReceipts(data.items || []);
      } else {
        throw new Error('Hiba a várható beérkezések betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!reservationFormData.itemId || !reservationFormData.warehouseId || !reservationFormData.mennyiseg) {
      setError('A termék, raktár és mennyiség megadása kötelező');
      return;
    }

    try {
      const response = await apiFetch('/logistics/stock-reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: reservationFormData.itemId,
          warehouseId: reservationFormData.warehouseId,
          locationId: reservationFormData.locationId || undefined,
          orderId: reservationFormData.orderId || undefined,
          mennyiseg: parseFloat(reservationFormData.mennyiseg),
          megjegyzesek: reservationFormData.megjegyzesek || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a foglalás létrehozásakor');
      }

      setSuccess('Készletfoglalás sikeresen létrehozva!');
      setTimeout(() => {
        setIsReservationModalOpen(false);
        setReservationFormData({
          itemId: '',
          warehouseId: '',
          locationId: '',
          orderId: '',
          mennyiseg: '',
          megjegyzesek: '',
        });
        loadReservations();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleAddReceiptItem = () => {
    setReceiptFormData({
      ...receiptFormData,
      items: [
        ...receiptFormData.items,
        {
          itemId: '',
          mennyiseg: '1',
          egysegAr: '0',
          megjegyzesek: '',
        },
      ],
    });
  };

  const handleReceiptItemChange = (index: number, field: string, value: string) => {
    const newItems = [...receiptFormData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setReceiptFormData({ ...receiptFormData, items: newItems });
  };

  const handleRemoveReceiptItem = (index: number) => {
    setReceiptFormData({
      ...receiptFormData,
      items: receiptFormData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmitReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!receiptFormData.warehouseId || receiptFormData.items.length === 0) {
      setError('A raktár és legalább egy tétel megadása kötelező');
      return;
    }

    try {
      const response = await apiFetch('/logistics/stock-reservations/expected-receipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          warehouseId: receiptFormData.warehouseId,
          purchaseOrderId: receiptFormData.purchaseOrderId || undefined,
          vartBeerkezes: receiptFormData.vartBeerkezes,
          megjegyzesek: receiptFormData.megjegyzesek || undefined,
          items: receiptFormData.items.map(item => ({
            itemId: item.itemId,
            mennyiseg: parseFloat(item.mennyiseg),
            egysegAr: item.egysegAr ? parseFloat(item.egysegAr) : undefined,
            megjegyzesek: item.megjegyzesek || undefined,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a várható beérkezés létrehozásakor');
      }

      setSuccess('Várható beérkezés sikeresen létrehozva!');
      setTimeout(() => {
        setIsReceiptModalOpen(false);
        setReceiptFormData({
          warehouseId: '',
          purchaseOrderId: '',
          vartBeerkezes: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          megjegyzesek: '',
          items: [],
        });
        loadExpectedReceipts();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleMarkAsShipped = async (id: string) => {
    try {
      const response = await apiFetch(`/logistics/stock-reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allapot: 'KISZALLITVA',
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba az állapot módosításakor');
      }

      setSuccess('Foglalás kiszállítottként jelölve!');
      loadReservations();
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleMarkReceiptAsReceived = async (id: string) => {
    try {
      const response = await apiFetch(`/logistics/stock-reservations/expected-receipts/${id}/mark-received`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Hiba az állapot módosításakor');
      }

      setSuccess('Beérkezés rögzítve!');
      loadExpectedReceipts();
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (!confirm('Biztosan törölni szeretné ezt a foglalást?')) {
      return;
    }

    try {
      const response = await apiFetch(`/logistics/stock-reservations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hiba a törlés során');
      }

      setSuccess('Foglalás sikeresen törölve!');
      loadReservations();
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const getAllapotBadge = (allapot: string) => {
    return ALLAPOTOK.find(a => a.kod === allapot) || ALLAPOTOK[0];
  };

  const getErkezesAllapotBadge = (allapot: string) => {
    return ERKEZES_ALLAPOTOK.find(a => a.kod === allapot) || ERKEZES_ALLAPOTOK[0];
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Készletfoglaltság és Konszignáció</h1>
        <button
          onClick={() => {
            if (activeTab === 'reservations') {
              setIsReservationModalOpen(true);
            } else {
              setIsReceiptModalOpen(true);
            }
          }}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + {activeTab === 'reservations' ? 'Új foglalás' : 'Új várható beérkezés'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'reservations'
                ? 'border-b-2 border-mbit-blue text-mbit-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Készletfoglaltságok
          </button>
          <button
            onClick={() => setActiveTab('expected-receipts')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'expected-receipts'
                ? 'border-b-2 border-mbit-blue text-mbit-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Várható beérkezések
          </button>
        </div>
      </div>

      {/* Reservations */}
      {activeTab === 'reservations' && (
        <>
          {/* Szűrők */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Termék</label>
                <select
                  value={filters.itemId}
                  onChange={(e) => setFilters({ ...filters, itemId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Összes</option>
                  {items.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.nev} ({i.azonosito})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raktár</label>
                <select
                  value={filters.warehouseId}
                  onChange={(e) => setFilters({ ...filters, warehouseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Összes</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.nev} ({w.azonosito})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rendelés ID</label>
                <input
                  type="text"
                  value={filters.orderId}
                  onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Rendelés azonosító..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Állapot</label>
                <select
                  value={filters.allapot}
                  onChange={(e) => setFilters({ ...filters, allapot: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Összes</option>
                  {ALLAPOTOK.map(a => (
                    <option key={a.kod} value={a.kod}>{a.nev}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Foglaltságok lista */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Betöltés...</div>
            ) : reservations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Nincs foglaltság</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700">Termék</th>
                      <th className="text-left p-4 font-medium text-gray-700">Raktár</th>
                      <th className="text-right p-4 font-medium text-gray-700">Mennyiség</th>
                      <th className="text-left p-4 font-medium text-gray-700">Rendelés</th>
                      <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                      <th className="text-left p-4 font-medium text-gray-700">Létrehozva</th>
                      <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {reservations.map((reservation) => {
                      const allapotBadge = getAllapotBadge(reservation.allapot);
                      
                      return (
                        <tr key={reservation.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            {reservation.item
                              ? `${reservation.item.nev} (${reservation.item.azonosito})`
                              : '-'}
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {reservation.warehouse?.nev || '-'}
                          </td>
                          <td className="p-4 text-right font-medium">
                            {reservation.mennyiseg.toLocaleString('hu-HU')} {reservation.item?.egyseg || ''}
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {reservation.orderId || '-'}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${allapotBadge.szin}`}>
                              {allapotBadge.nev}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(reservation.createdAt).toLocaleDateString('hu-HU')}
                          </td>
                          <td className="p-4 text-right">
                            {reservation.allapot === 'FOGLALT' && (
                              <button
                                onClick={() => handleMarkAsShipped(reservation.id)}
                                className="text-green-600 hover:text-green-800 text-sm mr-2"
                              >
                                Kiszállítva
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReservation(reservation.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Törlés
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Expected Receipts */}
      {activeTab === 'expected-receipts' && (
        <>
          {/* Szűrők */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raktár</label>
                <select
                  value={filters.warehouseId}
                  onChange={(e) => setFilters({ ...filters, warehouseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Összes</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.nev} ({w.azonosito})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Várható beérkezések lista */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Betöltés...</div>
            ) : expectedReceipts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Nincs várható beérkezés</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700">Raktár</th>
                      <th className="text-left p-4 font-medium text-gray-700">Várható beérkezés</th>
                      <th className="text-left p-4 font-medium text-gray-700">Tételek száma</th>
                      <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                      <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {expectedReceipts.map((receipt) => {
                      const allapotBadge = getErkezesAllapotBadge(receipt.allapot);
                      
                      return (
                        <tr key={receipt.id} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">
                            {receipt.warehouse?.nev || '-'}
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(receipt.vartBeerkezes).toLocaleDateString('hu-HU')}
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {receipt._count?.items || receipt.items?.length || 0}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${allapotBadge.szin}`}>
                              {allapotBadge.nev}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedReceipt(receipt);
                                setIsDetailModalOpen(true);
                              }}
                              className="text-mbit-blue hover:text-blue-600 text-sm mr-2"
                            >
                              Részletek
                            </button>
                            {receipt.allapot === 'VAR' && (
                              <button
                                onClick={() => handleMarkReceiptAsReceived(receipt.id)}
                                className="text-green-600 hover:text-green-800 text-sm mr-2"
                              >
                                Beérkezett
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Foglalás modal */}
      <Modal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        title="Új készletfoglalás"
        size="md"
      >
        <form onSubmit={handleSubmitReservation}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Termék <span className="text-red-500">*</span>
              </label>
              <select
                value={reservationFormData.itemId}
                onChange={(e) => setReservationFormData({ ...reservationFormData, itemId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Válasszon terméket...</option>
                {items.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.nev} ({i.azonosito})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raktár <span className="text-red-500">*</span>
              </label>
              <select
                value={reservationFormData.warehouseId}
                onChange={(e) => setReservationFormData({ ...reservationFormData, warehouseId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Válasszon raktárt...</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.nev} ({w.azonosito})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mennyiség <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={reservationFormData.mennyiseg}
                  onChange={(e) => setReservationFormData({ ...reservationFormData, mennyiseg: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rendelés ID</label>
                <input
                  type="text"
                  value={reservationFormData.orderId}
                  onChange={(e) => setReservationFormData({ ...reservationFormData, orderId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Megjegyzések</label>
              <textarea
                value={reservationFormData.megjegyzesek}
                onChange={(e) => setReservationFormData({ ...reservationFormData, megjegyzesek: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsReservationModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600"
              >
                Létrehozás
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Várható beérkezés modal */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Új várható beérkezés"
        size="lg"
      >
        <form onSubmit={handleSubmitReceipt}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raktár <span className="text-red-500">*</span>
                </label>
                <select
                  value={receiptFormData.warehouseId}
                  onChange={(e) => setReceiptFormData({ ...receiptFormData, warehouseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Válasszon raktárt...</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.nev} ({w.azonosito})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Várható beérkezés <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={receiptFormData.vartBeerkezes}
                  onChange={(e) => setReceiptFormData({ ...receiptFormData, vartBeerkezes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Tételek */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tételek <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddReceiptItem}
                  className="text-sm text-mbit-blue hover:text-blue-600"
                >
                  + Tétel hozzáadása
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {receiptFormData.items.map((item, index) => (
                  <div key={index} className="border rounded p-3 bg-gray-50">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-4">
                        <select
                          value={item.itemId}
                          onChange={(e) => handleReceiptItemChange(index, 'itemId', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          required
                        >
                          <option value="">Válasszon terméket...</option>
                          {items.map(i => (
                            <option key={i.id} value={i.id}>
                              {i.nev} ({i.azonosito})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.mennyiseg}
                          onChange={(e) => handleReceiptItemChange(index, 'mennyiseg', e.target.value)}
                          placeholder="Menny."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.egysegAr}
                          onChange={(e) => handleReceiptItemChange(index, 'egysegAr', e.target.value)}
                          placeholder="Egységár"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={item.megjegyzesek}
                          onChange={(e) => handleReceiptItemChange(index, 'megjegyzesek', e.target.value)}
                          placeholder="Megjegyzés"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveReceiptItem(index)}
                          className="w-full px-2 py-1 text-sm text-red-600 hover:text-red-800"
                        >
                          Törlés
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Megjegyzések</label>
              <textarea
                value={receiptFormData.megjegyzesek}
                onChange={(e) => setReceiptFormData({ ...receiptFormData, megjegyzesek: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600"
              >
                Létrehozás
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Részletek modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReceipt(null);
        }}
        title={selectedReceipt ? `Várható beérkezés részletek` : 'Részletek'}
        size="lg"
      >
        {selectedReceipt && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Raktár</div>
                <div className="font-medium">{selectedReceipt.warehouse?.nev || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Várható beérkezés</div>
                <div className="font-medium">
                  {new Date(selectedReceipt.vartBeerkezes).toLocaleDateString('hu-HU')}
                </div>
              </div>
            </div>

            {selectedReceipt.items && selectedReceipt.items.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Tételek</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 font-medium text-gray-700">Termék</th>
                        <th className="text-right p-2 font-medium text-gray-700">Mennyiség</th>
                        <th className="text-right p-2 font-medium text-gray-700">Egységár</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedReceipt.items.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2">
                            {item.item?.nev} ({item.item?.azonosito})
                          </td>
                          <td className="p-2 text-right">{item.mennyiseg.toLocaleString('hu-HU')}</td>
                          <td className="p-2 text-right">
                            {item.egysegAr ? `${item.egysegAr.toLocaleString('hu-HU')} HUF` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

