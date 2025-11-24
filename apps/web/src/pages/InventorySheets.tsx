import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

interface InventorySheet {
  id: string;
  warehouseId: string;
  azonosito: string;
  leltarDatum: string;
  allapot: string;
  megjegyzesek?: string | null;
  createdAt: string;
  updatedAt: string;
  warehouse?: {
    id: string;
    nev: string;
    azonosito: string;
  };
  createdBy?: {
    id: string;
    nev: string;
    email: string;
  } | null;
  approvedBy?: {
    id: string;
    nev: string;
    email: string;
  } | null;
  items?: InventorySheetItem[];
  _count?: {
    items: number;
  };
}

interface InventorySheetItem {
  id: string;
  inventorySheetId: string;
  itemId: string;
  locationId?: string | null;
  konyvKeszlet: number;
  tenylegesKeszlet?: number | null;
  kulonbseg?: number | null;
  megjegyzesek?: string | null;
  item?: {
    id: string;
    nev: string;
    azonosito: string;
    egyseg: string;
  };
  location?: {
    id: string;
    nev: string;
    azonosito: string;
  } | null;
}

interface Warehouse {
  id: string;
  nev: string;
  azonosito: string;
}

const ALLAPOTOK = [
  { kod: 'NYITOTT', nev: 'Nyitott', szin: 'bg-yellow-100 text-yellow-800' },
  { kod: 'FOLYAMATBAN', nev: 'Folyamatban', szin: 'bg-blue-100 text-blue-800' },
  { kod: 'BEFEJEZETT', nev: 'Befejezett', szin: 'bg-purple-100 text-purple-800' },
  { kod: 'JOVAHAGYVA', nev: 'Jóváhagyva', szin: 'bg-green-100 text-green-800' },
  { kod: 'LEZARVA', nev: 'Lezárva', szin: 'bg-gray-100 text-gray-800' },
];

export default function InventorySheets() {
  const [inventorySheets, setInventorySheets] = useState<InventorySheet[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<InventorySheet | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmButtonClass?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [formData, setFormData] = useState({
    warehouseId: '',
    leltarDatum: new Date().toISOString().split('T')[0],
    megjegyzesek: '',
  });

  const [filters, setFilters] = useState({
    warehouseId: '',
    allapot: '',
  });

  useEffect(() => {
    loadWarehouses();
    loadInventorySheets();
  }, [filters]);

  const loadWarehouses = async () => {
    try {
      const response = await apiFetch('/logistics/warehouses');
      if (response.ok) {
        const data = await response.json();
        // Handle both 'data' and 'items' response formats
        const warehousesList = data.items || data.data || [];
        setWarehouses(warehousesList);
      } else {
        console.error('Hiba a raktárak betöltésekor: HTTP error', response.status);
        setError('Nem sikerült betölteni a raktárakat');
      }
    } catch (err) {
      console.error('Hiba a raktárak betöltésekor:', err);
      setError('Hiba történt a raktárak betöltésekor');
    }
  };

  const loadInventorySheets = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.warehouseId) queryParams.append('warehouseId', filters.warehouseId);
      if (filters.allapot) queryParams.append('allapot', filters.allapot);

      const response = await apiFetch(`/logistics/inventory-sheets?skip=0&take=100&${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setInventorySheets(data.items || []);
      } else {
        throw new Error('Hiba a leltárívek betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const loadSheetDetails = async (id: string) => {
    try {
      const response = await apiFetch(`/logistics/inventory-sheets/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedSheet(data);
        setIsDetailModalOpen(true);
      }
    } catch (err: any) {
      setError(err.message || 'Hiba a részletek betöltésekor');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.warehouseId) {
      setError('A raktár kiválasztása kötelező');
      return;
    }

    try {
      const response = await apiFetch('/logistics/inventory-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          warehouseId: formData.warehouseId,
          leltarDatum: formData.leltarDatum || undefined,
          megjegyzesek: formData.megjegyzesek || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a leltárív létrehozásakor');
      }

      setSuccess('Leltárív sikeresen létrehozva!');
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({
          warehouseId: '',
          leltarDatum: new Date().toISOString().split('T')[0],
          megjegyzesek: '',
        });
        loadInventorySheets();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await apiFetch(`/logistics/inventory-sheets/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ allapot: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Hiba az állapot módosításakor');
      }

      setSuccess('Állapot sikeresen módosítva!');
      loadInventorySheets();
      if (selectedSheet?.id === id) {
        loadSheetDetails(id);
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleApprove = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Leltárív jóváhagyása',
      message: 'Biztosan jóváhagyja ezt a leltárívet? A készletszintek frissülnek.',
      confirmText: 'Jóváhagyás',
      cancelText: 'Mégse',
      confirmButtonClass: 'bg-green-600 hover:bg-green-700',
      onConfirm: async () => {
        try {
          const response = await apiFetch(`/logistics/inventory-sheets/${id}/approve`, {
            method: 'POST',
          });

          if (!response.ok) {
            throw new Error('Hiba a jóváhagyás során');
          }

          setSuccess('Leltárív sikeresen jóváhagyva!');
          loadInventorySheets();
          if (selectedSheet?.id === id) {
            loadSheetDetails(id);
          }
        } catch (err: any) {
          setError(err.message || 'Hiba történt');
        }
      },
    });
  };

  const handleClose = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Leltárív lezárása',
      message: 'Biztosan lezárja ezt a leltárívet?',
      confirmText: 'Lezárás',
      cancelText: 'Mégse',
      confirmButtonClass: 'bg-gray-600 hover:bg-gray-700',
      onConfirm: async () => {
        try {
          const response = await apiFetch(`/logistics/inventory-sheets/${id}/close`, {
            method: 'POST',
          });

          if (!response.ok) {
            throw new Error('Hiba a lezárás során');
          }

          setSuccess('Leltárív sikeresen lezárva!');
          loadInventorySheets();
          if (selectedSheet?.id === id) {
            loadSheetDetails(id);
          }
        } catch (err: any) {
          setError(err.message || 'Hiba történt');
        }
      },
    });
  };

  const handleRevertStatus = (id: string, newStatus: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Állapot visszaállítása',
      message: `Biztosan visszaállítja a leltárív állapotát "${getAllapotBadge(newStatus).nev}"-re?`,
      confirmText: 'Visszaállítás',
      cancelText: 'Mégse',
      confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700',
      onConfirm: async () => {
        try {
          const response = await apiFetch(`/logistics/inventory-sheets/${id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ allapot: newStatus }),
          });

          if (!response.ok) {
            throw new Error('Hiba az állapot visszaállításakor');
          }

          setSuccess('Állapot sikeresen visszaállítva!');
          loadInventorySheets();
          if (selectedSheet?.id === id) {
            loadSheetDetails(id);
          }
        } catch (err: any) {
          setError(err.message || 'Hiba történt');
        }
      },
    });
  };

  const handleRevertApproval = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Jóváhagyás visszavonása',
      message: 'Biztosan visszavonja a jóváhagyást? Ez visszaállítja a készletszinteket is.',
      confirmText: 'Visszavonás',
      cancelText: 'Mégse',
      confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700',
      onConfirm: async () => {
        try {
          const response = await apiFetch(`/logistics/inventory-sheets/${id}/revert-approval`, {
            method: 'POST',
          });

          if (!response.ok) {
            throw new Error('Hiba a jóváhagyás visszavonásakor');
          }

          setSuccess('Jóváhagyás sikeresen visszavonva!');
          loadInventorySheets();
          if (selectedSheet?.id === id) {
            loadSheetDetails(id);
          }
        } catch (err: any) {
          setError(err.message || 'Hiba történt');
        }
      },
    });
  };

  const handleUpdateItem = async (sheetId: string, itemId: string, tenylegesKeszlet: number) => {
    try {
      const response = await apiFetch(`/logistics/inventory-sheets/${sheetId}/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenylegesKeszlet,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba a tétel frissítésekor');
      }

      loadSheetDetails(sheetId);
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const getAllapotBadge = (allapot: string) => {
    const a = ALLAPOTOK.find(al => al.kod === allapot);
    return a || ALLAPOTOK[0];
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leltárívek</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új leltárív
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
                <option key={w.id} value={w.id}>{w.nev} ({w.azonosito})</option>
              ))}
            </select>
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

      {/* Leltárívek lista */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : inventorySheets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs leltárív</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Azonosító</th>
                  <th className="text-left p-4 font-medium text-gray-700">Raktár</th>
                  <th className="text-left p-4 font-medium text-gray-700">Leltár dátuma</th>
                  <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                  <th className="text-left p-4 font-medium text-gray-700">Tételek száma</th>
                  <th className="text-left p-4 font-medium text-gray-700">Létrehozva</th>
                  <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inventorySheets.map((sheet) => {
                  const allapotBadge = getAllapotBadge(sheet.allapot);
                  
                  return (
                    <tr key={sheet.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{sheet.azonosito}</td>
                      <td className="p-4 text-sm text-gray-600">
                        {sheet.warehouse?.nev || '-'}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(sheet.leltarDatum).toLocaleDateString('hu-HU')}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${allapotBadge.szin}`}>
                          {allapotBadge.nev}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {sheet._count?.items || sheet.items?.length || 0}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(sheet.createdAt).toLocaleDateString('hu-HU')}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => loadSheetDetails(sheet.id)}
                          className="text-mbit-blue hover:text-blue-600 text-sm mr-2"
                        >
                          Részletek
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

      {/* Új leltárív modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Új leltárív" size="lg">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raktár <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Válasszon raktárt...</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.nev} ({w.azonosito})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leltár dátuma
              </label>
              <input
                type="date"
                value={formData.leltarDatum}
                onChange={(e) => setFormData({ ...formData, leltarDatum: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Megjegyzések
              </label>
              <textarea
                value={formData.megjegyzesek}
                onChange={(e) => setFormData({ ...formData, megjegyzesek: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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
          setSelectedSheet(null);
        }}
        title={selectedSheet ? `Leltárív: ${selectedSheet.azonosito}` : 'Részletek'}
        size="xl"
      >
        {selectedSheet && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Raktár</div>
                <div className="font-medium">{selectedSheet.warehouse?.nev || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Leltár dátuma</div>
                <div className="font-medium">
                  {new Date(selectedSheet.leltarDatum).toLocaleDateString('hu-HU')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Állapot</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAllapotBadge(selectedSheet.allapot).szin}`}>
                    {getAllapotBadge(selectedSheet.allapot).nev}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Létrehozta</div>
                <div className="font-medium">{selectedSheet.createdBy?.nev || '-'}</div>
              </div>
            </div>

            {selectedSheet.megjegyzesek && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Megjegyzések</div>
                <div className="text-sm">{selectedSheet.megjegyzesek}</div>
              </div>
            )}

            {/* Műveletek */}
            <div className="flex gap-2 pt-2 border-t flex-wrap">
              {selectedSheet.allapot === 'NYITOTT' && (
                <button
                  onClick={() => handleUpdateStatus(selectedSheet.id, 'FOLYAMATBAN')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Folyamatban állapot
                </button>
              )}
              {selectedSheet.allapot === 'FOLYAMATBAN' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedSheet.id, 'BEFEJEZETT')}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                  >
                    Befejezett állapot
                  </button>
                  <button
                    onClick={() => handleRevertStatus(selectedSheet.id, 'NYITOTT')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                  >
                    Visszaállítás: Nyitott
                  </button>
                </>
              )}
              {selectedSheet.allapot === 'BEFEJEZETT' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedSheet.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Jóváhagyás
                  </button>
                  <button
                    onClick={() => handleRevertStatus(selectedSheet.id, 'FOLYAMATBAN')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                  >
                    Visszaállítás: Folyamatban
                  </button>
                </>
              )}
              {selectedSheet.allapot === 'JOVAHAGYVA' && (
                <>
                  <button
                    onClick={() => handleClose(selectedSheet.id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                  >
                    Lezárás
                  </button>
                  <button
                    onClick={() => handleRevertApproval(selectedSheet.id)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                  >
                    Visszavonás: Befejezett
                  </button>
                </>
              )}
              {selectedSheet.allapot === 'LEZARVA' && (
                <button
                  onClick={() => handleRevertStatus(selectedSheet.id, 'JOVAHAGYVA')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                >
                  Visszaállítás: Jóváhagyva
                </button>
              )}
            </div>

            {/* Tételek */}
            <div>
              <h3 className="font-medium mb-2">Leltárív tételek</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2 font-medium text-gray-700">Termék</th>
                      <th className="text-left p-2 font-medium text-gray-700">Hely</th>
                      <th className="text-right p-2 font-medium text-gray-700">Könyv szerinti</th>
                      <th className="text-right p-2 font-medium text-gray-700">Tényleges</th>
                      <th className="text-right p-2 font-medium text-gray-700">Különbség</th>
                      <th className="text-left p-2 font-medium text-gray-700">Művelet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedSheet.items && selectedSheet.items.length > 0 ? (
                      selectedSheet.items.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2">
                            <div className="font-medium">{item.item?.nev || '-'}</div>
                            <div className="text-xs text-gray-500">{item.item?.azonosito || '-'}</div>
                          </td>
                          <td className="p-2 text-gray-600">
                            {item.location?.nev || '-'}
                          </td>
                          <td className="p-2 text-right">
                            {item.konyvKeszlet.toLocaleString('hu-HU')} {item.item?.egyseg || ''}
                          </td>
                          <td className="p-2 text-right">
                            {selectedSheet.allapot !== 'LEZARVA' && selectedSheet.allapot !== 'JOVAHAGYVA' ? (
                              <input
                                type="number"
                                step="0.01"
                                value={item.tenylegesKeszlet || ''}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (!isNaN(value)) {
                                    handleUpdateItem(selectedSheet.id, item.itemId, value);
                                  }
                                }}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                                placeholder={item.konyvKeszlet.toString()}
                              />
                            ) : (
                              <span>
                                {item.tenylegesKeszlet !== null && item.tenylegesKeszlet !== undefined ? item.tenylegesKeszlet.toLocaleString('hu-HU') : '-'} {item.item?.egyseg || ''}
                              </span>
                            )}
                          </td>
                          <td className={`p-2 text-right font-medium ${
                            item.kulonbseg !== null && item.kulonbseg !== undefined && item.kulonbseg !== 0
                              ? item.kulonbseg > 0 ? 'text-green-600' : 'text-red-600'
                              : ''
                          }`}>
                            {item.kulonbseg !== null && item.kulonbseg !== undefined && item.kulonbseg !== 0
                              ? `${item.kulonbseg > 0 ? '+' : ''}${item.kulonbseg.toLocaleString('hu-HU')} ${item.item?.egyseg || ''}`
                              : '-'}
                          </td>
                          <td className="p-2">
                            {item.megjegyzesek && (
                              <div className="text-xs text-gray-500" title={item.megjegyzesek}>
                                ℹ️
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-gray-500">
                          Nincsenek tételek
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmButtonClass={confirmModal.confirmButtonClass}
      />
    </div>
  );
}

