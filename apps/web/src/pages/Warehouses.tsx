import { useState, useEffect } from 'react';

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

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    loadWarehouses();
    loadLowStockAlerts();
  }, []);

  const loadWarehouses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/logistics/warehouses?skip=0&take=100`, {
        headers: { Authorization: `Bearer ${token}` },
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
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/logistics/inventory/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const countActiveWarehouses = () => {
    return warehouses.filter(w => w.aktiv).length;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Raktárak</h1>
        <button className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600">
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
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {warehouses.map(warehouse => (
                    <tr key={warehouse.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="p-4">
                        <div className="font-medium text-mbit-blue">{warehouse.nev}</div>
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
    </div>
  );
}
