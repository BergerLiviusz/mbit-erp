import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import InventoryReportModal from '../components/logistics/InventoryReportModal';

interface Warehouse {
  id: string;
  azonosito: string;
  nev: string;
  cim?: string | null;
  tipus?: string | null;
  aktiv: boolean;
  capacity?: number | null;
  createdAt: string;
}

interface LowStockAlert {
  id: string;
  itemId: string;
  warehouseId: string;
  mennyiseg: number;
  minimum: number | null;
  item?: {
    id: string;
    cikkszam: string;
    nev: string;
  };
  warehouse?: {
    id: string;
    nev: string;
  };
}

interface Item {
  id: string;
  azonosito: string;
  nev: string;
  egyseg: string;
  aktiv?: boolean;
}

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
  const [editingWarehouseId, setEditingWarehouseId] = useState<string | null>(null);
  const [warehouseStock, setWarehouseStock] = useState<any[]>([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [productError, setProductError] = useState<string>('');
  const [productSuccess, setProductSuccess] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nev: '',
    azonosito: '',
    iranyitoszam: '',
    telepules: '',
    utca: '',
    aktiv: true,
  });

  const [productFormData, setProductFormData] = useState({
    itemId: '',
    mennyiseg: '0',
  });


  useEffect(() => {
    loadWarehouses();
    loadLowStockAlerts();
  }, []);

  useEffect(() => {
    if (isProductModalOpen) {
      loadItems();
    }
  }, [isProductModalOpen]);

  const loadItems = async () => {
    try {
      const response = await apiFetch('/logistics/items?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Hiba a termékek betöltésekor:', error);
    }
  };

  const loadWarehouses = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/logistics/warehouses?skip=0&take=100`, {
        
      });

      if (response.ok) {
        const data = await response.json();
        setWarehouses(data.data || []);
      }
    } catch (error) {
      console.error('Hiba a raktárak betöltésekor:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLowStockAlerts = async () => {
    setAlertsLoading(true);
    try {
      const response = await apiFetch(`/logistics/inventory/alerts`, {
        
      });

      if (response.ok) {
        const data = await response.json();
        setLowStockAlerts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Hiba a low-stock riasztások betöltésekor:', error);
    } finally {
      setAlertsLoading(false);
    }
  };

  const loadWarehouseStock = async (warehouseId: string) => {
    setStockLoading(true);
    try {
      const response = await apiFetch(`/logistics/inventory/warehouse/${warehouseId}`, {
        
      });

      if (response.ok) {
        const data = await response.json();
        setWarehouseStock(Array.isArray(data) ? data : []);
        setSelectedWarehouseId(warehouseId);
      }
    } catch (error) {
      console.error('Hiba a raktár készletének betöltésekor:', error);
    } finally {
      setStockLoading(false);
    }
  };

  const handleCloseWarehouseDetail = () => {
    setSelectedWarehouseId(null);
    setWarehouseStock([]);
  };

  const handleDownloadInventorySheetPdf = async (warehouseId: string) => {
    try {
      const response = await apiFetch(`/logistics/inventory/warehouse/${warehouseId}/inventory-sheet/pdf`);
      if (!response.ok) {
        throw new Error('Hiba a PDF generálása során');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leltar_${warehouses.find(w => w.id === warehouseId)?.azonosito || warehouseId}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      setError(error.message || 'Hiba a PDF letöltése során');
    }
  };

  const handleDownloadInventorySheetExcel = async (warehouseId: string) => {
    try {
      const response = await apiFetch(`/logistics/inventory/warehouse/${warehouseId}/inventory-sheet/excel`);
      if (!response.ok) {
        throw new Error('Hiba az Excel generálása során');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leltar_${warehouses.find(w => w.id === warehouseId)?.azonosito || warehouseId}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      setError(error.message || 'Hiba az Excel letöltése során');
    }
  };

  const handleOpenProductModal = () => {
    if (!selectedWarehouseId) {
      setProductError('Először válasszon ki egy raktárt!');
      return;
    }
    setProductError('');
    setProductSuccess('');
    setProductFormData({
      itemId: '',
      mennyiseg: '0',
    });
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setProductFormData({
      itemId: '',
      mennyiseg: '0',
    });
    setProductError('');
    setProductSuccess('');
  };

  const handleAddProductToWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductError('');
    setProductSuccess('');

    if (!selectedWarehouseId) {
      setProductError('Nincs kiválasztott raktár');
      return;
    }

    if (!productFormData.itemId) {
      setProductError('Válasszon ki egy terméket');
      return;
    }

    const mennyiseg = parseFloat(productFormData.mennyiseg);
    if (isNaN(mennyiseg) || mennyiseg < 0) {
      setProductError('A mennyiség nem lehet negatív');
      return;
    }

    setSaving(true);

    try {
      const response = await apiFetch('/logistics/inventory/stock-levels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: productFormData.itemId,
          warehouseId: selectedWarehouseId,
          mennyiseg: mennyiseg,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (response.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Hibás adatok.');
        } else if (response.status >= 500) {
          throw new Error('Szerver hiba. Kérem próbálja újra később.');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Hiba a termék hozzárendelésekor');
        }
      }

      setProductSuccess('Termék sikeresen hozzárendelve a raktárhoz!');
      
      // Reload warehouse stock to show the new product
      if (selectedWarehouseId) {
        await loadWarehouseStock(selectedWarehouseId);
      }
      
      // Dispatch custom event to notify Products component to refresh
      window.dispatchEvent(new CustomEvent('productsUpdated'));

      setTimeout(() => {
        handleCloseProductModal();
      }, 1500);
    } catch (err: any) {
      setProductError(err.message || 'Hiba történt a mentés során');
    } finally {
      setSaving(false);
    }
  };

  const countActiveWarehouses = () => {
    return warehouses.filter(w => w.aktiv).length;
  };

  const handleOpenModal = (warehouse?: Warehouse) => {
    setError('');
    setSuccess('');
    if (warehouse) {
      setEditingWarehouseId(warehouse.id);
      // Parse address if it exists
      let iranyitoszam = '';
      let telepules = '';
      let utca = '';
      if (warehouse.cim) {
        const parts = warehouse.cim.split(', ');
        if (parts.length >= 1 && /^\d{4}$/.test(parts[0])) {
          iranyitoszam = parts[0];
        }
        if (parts.length >= 2) {
          telepules = parts[1];
        }
        if (parts.length >= 3) {
          utca = parts.slice(2).join(', ');
        }
      }
      setFormData({
        nev: warehouse.nev,
        azonosito: warehouse.azonosito,
        iranyitoszam: iranyitoszam,
        telepules: telepules,
        utca: utca,
        aktiv: warehouse.aktiv,
      });
    } else {
      setEditingWarehouseId(null);
      setFormData({
        nev: '',
        azonosito: '',
        iranyitoszam: '',
        telepules: '',
        utca: '',
        aktiv: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWarehouseId(null);
    setFormData({
      nev: '',
      azonosito: '',
      iranyitoszam: '',
      telepules: '',
      utca: '',
      aktiv: true,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nev.trim()) {
      setError('A név megadása kötelező');
      return;
    }

    if (!formData.azonosito.trim()) {
      setError('Az azonosító megadása kötelező');
      return;
    }

    if (formData.iranyitoszam && !/^\d{4}$/.test(formData.iranyitoszam)) {
      setError('Az irányítószám 4 számjegyből kell álljon');
      return;
    }

    setSaving(true);

    try {

      let cim = '';
      if (formData.iranyitoszam || formData.telepules || formData.utca) {
        const parts = [];
        if (formData.iranyitoszam) parts.push(formData.iranyitoszam);
        if (formData.telepules) parts.push(formData.telepules);
        if (formData.utca) parts.push(formData.utca);
        cim = parts.join(', ');
      }

      const warehouseData = {
        nev: formData.nev,
        azonosito: formData.azonosito,
        cim: cim || undefined,
        aktiv: formData.aktiv,
      };

      const url = editingWarehouseId
        ? `/logistics/warehouses/${editingWarehouseId}`
        : `/logistics/warehouses`;
      const method = editingWarehouseId ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(warehouseData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (response.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Hibás adatok.');
        } else if (response.status >= 500) {
          throw new Error('Szerver hiba. Kérem próbálja újra később.');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || (editingWarehouseId ? 'Hiba a raktár módosításakor' : 'Hiba a raktár létrehozásakor'));
        }
      }

      setSuccess(editingWarehouseId ? 'Raktár sikeresen módosítva!' : 'Raktár sikeresen létrehozva!');
      setTimeout(() => {
        handleCloseModal();
        loadWarehouses();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Raktárak</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új raktár
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Összes raktár</div>
          <div className="text-2xl font-bold">{warehouses.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Aktív raktárak</div>
          <div className="text-2xl font-bold text-green-600">
            {countActiveWarehouses()}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Low-stock riasztások</div>
          <div className="text-2xl font-bold text-red-600">
            {lowStockAlerts.length}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Raktárak listája</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Betöltés...</div>
          ) : warehouses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nincs raktár</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Név</th>
                    <th className="text-left p-4 font-medium text-gray-700">Cím</th>
                    <th className="text-left p-4 font-medium text-gray-700">Típus</th>
                    <th className="text-right p-4 font-medium text-gray-700">Kapacitás</th>
                    <th className="text-center p-4 font-medium text-gray-700">Státusz</th>
                    <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {warehouses.map(warehouse => (
                    <tr key={warehouse.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-mbit-blue cursor-pointer" onClick={() => loadWarehouseStock(warehouse.id)}>
                          {warehouse.nev}
                        </div>
                        <div className="text-xs text-gray-500">{warehouse.azonosito}</div>
                      </td>
                      <td className="p-4 text-sm">
                        {warehouse.cim || '-'}
                      </td>
                      <td className="p-4">
                        {warehouse.tipus ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {warehouse.tipus}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4 text-right text-sm">
                        {warehouse.capacity ? warehouse.capacity.toLocaleString('hu-HU') : '-'}
                      </td>
                      <td className="p-4 text-center">
                        {warehouse.aktiv ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Aktív
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inaktív
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleOpenModal(warehouse)}
                            className="px-3 py-1 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Szerkesztés
                          </button>
                          <button
                            onClick={() => loadWarehouseStock(warehouse.id)}
                            className="text-mbit-blue hover:text-blue-600 text-sm cursor-pointer underline"
                          >
                            Részletek
                          </button>
                          <button
                            onClick={() => handleDownloadInventorySheetPdf(warehouse.id)}
                            className="px-2 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700"
                            title="Leltár ív PDF letöltése"
                          >
                            📄 PDF
                          </button>
                          <button
                            onClick={() => handleDownloadInventorySheetExcel(warehouse.id)}
                            className="px-2 py-1 rounded text-sm bg-green-600 text-white hover:bg-green-700"
                            title="Leltár ív Excel letöltése"
                          >
                            📊 Excel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Low-stock riasztások</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {alertsLoading ? (
            <div className="p-8 text-center text-gray-500">Betöltés...</div>
          ) : lowStockAlerts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nincs low-stock riasztás
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Cikkszám</th>
                    <th className="text-left p-4 font-medium text-gray-700">Név</th>
                    <th className="text-left p-4 font-medium text-gray-700">Raktár</th>
                    <th className="text-right p-4 font-medium text-gray-700">Készlet</th>
                    <th className="text-right p-4 font-medium text-gray-700">Min. készlet</th>
                    <th className="text-center p-4 font-medium text-gray-700">Állapot</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {lowStockAlerts.map(alert => (
                    <tr key={alert.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="p-4">
                        <div className="font-medium text-mbit-blue">
                          {alert.item?.cikkszam || '-'}
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        {alert.item?.nev || '-'}
                      </td>
                      <td className="p-4 text-sm">
                        {alert.warehouse?.nev || '-'}
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-medium text-red-600">
                          {alert.mennyiseg.toLocaleString('hu-HU')}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-600">
                        {alert.minimum !== null ? alert.minimum.toLocaleString('hu-HU') : '-'}
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Alacsony készlet
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedWarehouseId && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              Raktár részletek: {warehouses.find(w => w.id === selectedWarehouseId)?.nev}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownloadInventorySheetPdf(selectedWarehouseId!)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
              >
                📄 PDF letöltése
              </button>
              <button
                onClick={() => handleDownloadInventorySheetExcel(selectedWarehouseId!)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
              >
                📊 Excel letöltése
              </button>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
              >
                📄 Leltárív nyomtatása
              </button>
              <button
                onClick={handleOpenProductModal}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
              >
                + Termék hozzáadása
              </button>
              <button
                onClick={handleCloseWarehouseDetail}
                className="text-gray-600 hover:text-gray-800"
              >
                Bezárás
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {stockLoading ? (
              <div className="p-8 text-center text-gray-500">Betöltés...</div>
            ) : warehouseStock.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Nincs készlet ebben a raktárban</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700">Termék</th>
                      <th className="text-left p-4 font-medium text-gray-700">Azonosító</th>
                      <th className="text-right p-4 font-medium text-gray-700">Mennyiség</th>
                      <th className="text-right p-4 font-medium text-gray-700">Min. készlet</th>
                      <th className="text-right p-4 font-medium text-gray-700">Max. készlet</th>
                      <th className="text-left p-4 font-medium text-gray-700">Hely</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {warehouseStock.map((stock: any) => (
                      <tr key={stock.id} className="hover:bg-gray-50">
                        <td className="p-4 text-sm font-medium text-gray-900">
                          {stock.item?.nev || '-'}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {stock.item?.azonosito || '-'}
                        </td>
                        <td className="p-4 text-right text-sm text-gray-900">
                          {stock.mennyiseg?.toLocaleString('hu-HU') || '0'} {stock.item?.egyseg || ''}
                        </td>
                        <td className="p-4 text-right text-sm text-gray-600">
                          {stock.minimum !== null && stock.minimum !== undefined ? stock.minimum.toLocaleString('hu-HU') : '-'}
                        </td>
                        <td className="p-4 text-right text-sm text-gray-600">
                          {stock.maximum !== null && stock.maximum !== undefined ? stock.maximum.toLocaleString('hu-HU') : '-'}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {stock.location?.nev || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={isProductModalOpen} onClose={handleCloseProductModal} title="Termék hozzáadása raktárhoz" size="md">
        {productError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {productError}
          </div>
        )}
        {productSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {productSuccess}
          </div>
        )}

        <form onSubmit={handleAddProductToWarehouse}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raktár <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={warehouses.find(w => w.id === selectedWarehouseId)?.nev || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Termék <span className="text-red-500">*</span>
              </label>
              <select
                value={productFormData.itemId}
                onChange={(e) => setProductFormData({ ...productFormData, itemId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Válasszon terméket --</option>
                {items.filter(item => item.aktiv !== false).map(item => (
                  <option key={item.id} value={item.id}>
                    {item.nev} ({item.azonosito}) - {item.egyseg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Készletmennyiség <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={productFormData.mennyiseg}
                onChange={(e) => setProductFormData({ ...productFormData, mennyiseg: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="0"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseProductModal}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Mégse
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Hozzáadás...' : 'Hozzáadás'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingWarehouseId ? "Raktár szerkesztése" : "Új raktár"} size="lg">
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Név <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nev}
                onChange={(e) => setFormData({ ...formData, nev: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Azonosító <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.azonosito}
                onChange={(e) => setFormData({ ...formData, azonosito: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Pl.: RKT-001"
                required
                disabled={!!editingWarehouseId}
              />
              {editingWarehouseId && (
                <p className="mt-1 text-xs text-gray-500">Az azonosító nem módosítható</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cím (opcionális)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Irányítószám</label>
                  <input
                    type="text"
                    value={formData.iranyitoszam}
                    onChange={(e) => setFormData({ ...formData, iranyitoszam: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1234"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Település</label>
                  <input
                    type="text"
                    value={formData.telepules}
                    onChange={(e) => setFormData({ ...formData, telepules: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Budapest"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Utca, házszám</label>
                  <input
                    type="text"
                    value={formData.utca}
                    onChange={(e) => setFormData({ ...formData, utca: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Fő utca 1."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.aktiv}
                  onChange={(e) => setFormData({ ...formData, aktiv: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Aktív raktár</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Mégse
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </form>
      </Modal>

      <InventoryReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultWarehouseId={selectedWarehouseId || undefined}
      />
    </div>
  );
}
