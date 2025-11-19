import { useState } from 'react';
import Modal from '../components/Modal';
import {
  useOrders,
  useOrderStatusChange,
  Order,
  OrderFilters,
} from '../lib/api/crm';
import { useReturns } from '../lib/api/logistics';
import { apiFetch } from '../lib/api';
import { Link } from 'react-router-dom';

const ORDER_STATUSES = [
  { kod: 'NEW', nev: 'Új', szin: 'bg-blue-100 text-blue-800' },
  { kod: 'IN_PROCESS', nev: 'Feldolgozás alatt', szin: 'bg-yellow-100 text-yellow-800' },
  { kod: 'SHIPPED', nev: 'Szállítva', szin: 'bg-purple-100 text-purple-800' },
  { kod: 'COMPLETED', nev: 'Teljesítve', szin: 'bg-green-100 text-green-800' },
  { kod: 'CANCELLED', nev: 'Visszavonva', szin: 'bg-red-100 text-red-800' },
];

export default function OrdersLogistics() {
  const [filters, setFilters] = useState<OrderFilters>({
    allapot: 'IN_PROCESS', // Default: only show orders in process
  });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { data: ordersData, isLoading, refetch } = useOrders(filters, 0, 100);

  // Get returns for selected order
  const { data: returnsData } = useReturns(
    selectedOrder ? { orderId: selectedOrder.id, skip: 0, take: 100 } : undefined,
  );

  const changeStatus = useOrderStatusChange();

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!confirm(`Biztosan megváltoztatja a rendelés státuszát ${getStatusLabel(newStatus)}-re?`)) {
      return;
    }

    try {
      await changeStatus.mutateAsync({
        id,
        data: { allapot: newStatus },
      });
      setSuccess('Státusz sikeresen megváltoztatva!');
      refetch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a státusz változtatás során');
    }
  };

  const getStatusLabel = (status: string) => {
    return ORDER_STATUSES.find((s) => s.kod === status)?.nev || status;
  };

  const getStatusBadge = (status: string) => {
    const statusInfo = ORDER_STATUSES.find((s) => s.kod === status) || {
      kod: status,
      nev: status,
      szin: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.szin}`}>
        {statusInfo.nev}
      </span>
    );
  };

  const handleViewDetails = async (order: Order) => {
    try {
      const response = await apiFetch(`/crm/orders/${order.id}`);
      if (response.ok) {
        const fullOrder = await response.json();
        setSelectedOrder(fullOrder);
        setIsDetailsModalOpen(true);
      }
    } catch (err) {
      console.error('Hiba a rendelés betöltésekor:', err);
    }
  };

  const handleExportCSV = () => {
    if (!ordersData?.data || ordersData.data.length === 0) {
      alert('Nincs exportálandó adat!');
      return;
    }

    const headers = [
      'Rendelés azonosító',
      'Ügyfél',
      'Rendelés dátuma',
      'Szállítási dátum',
      'Teljesítési dátum',
      'Összeg',
      'Végösszeg',
      'Állapot',
      'Visszárúk száma',
    ];

    const rows = ordersData.data.map((order: Order) => [
      order.azonosito,
      order.account?.nev || '-',
      new Date(order.rendelesiDatum).toLocaleDateString('hu-HU'),
      order.szallitasiDatum ? new Date(order.szallitasiDatum).toLocaleDateString('hu-HU') : '-',
      order.teljesitesiDatum ? new Date(order.teljesitesiDatum).toLocaleDateString('hu-HU') : '-',
      order.osszeg.toLocaleString('hu-HU'),
      order.vegosszeg.toLocaleString('hu-HU'),
      getStatusLabel(order.allapot),
      String(order.returns?.length || 0),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: (string | number)[]) => row.map((cell: string | number) => `"${String(cell)}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rendelesek_logisztika_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rendelések - Logisztikai nézet</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
            title="CSV export"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Szűrők</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Állapot</label>
            <select
              value={filters.allapot || ''}
              onChange={(e) =>
                setFilters({ ...filters, allapot: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Összes</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status.kod} value={status.kod}>
                  {status.nev}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kezdő dátum</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vég dátum</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Szűrők törlése
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Rendelések ({ordersData?.total || 0}) - Logisztikai nézet
          </h2>
        </div>
        {isLoading ? (
          <div className="p-6">Betöltés...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Azonosító
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ügyfél
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rendelés dátuma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Szállítási dátum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Teljesítési dátum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Végösszeg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Állapot
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Visszárúk
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Műveletek
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordersData?.data?.map((order: Order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.azonosito}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.account?.nev || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.rendelesiDatum).toLocaleDateString('hu-HU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.szallitasiDatum
                      ? new Date(order.szallitasiDatum).toLocaleDateString('hu-HU')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.teljesitesiDatum
                      ? new Date(order.teljesitesiDatum).toLocaleDateString('hu-HU')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {order.vegosszeg.toLocaleString('hu-HU')} Ft
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.allapot)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {order.returns && order.returns.length > 0 ? (
                      <Link
                        to={`/returns?orderId=${order.id}`}
                        className="text-orange-600 hover:text-orange-900 font-medium"
                      >
                        {order.returns.length} db
                      </Link>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Részletek"
                      >
                        👁
                      </button>
                      {order.allapot === 'IN_PROCESS' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'SHIPPED')}
                          className="text-purple-600 hover:text-purple-900"
                          title="Szállítva"
                        >
                          🚚
                        </button>
                      )}
                      {order.allapot === 'SHIPPED' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                          className="text-green-600 hover:text-green-900"
                          title="Teljesítve"
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        title={`Rendelés részletei: ${selectedOrder?.azonosito}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ügyfél</label>
                <p className="text-sm text-gray-900">{selectedOrder.account?.nev}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Állapot</label>
                <div className="mt-1">{getStatusBadge(selectedOrder.allapot)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rendelés dátuma</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedOrder.rendelesiDatum).toLocaleDateString('hu-HU')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Szállítási dátum</label>
                <p className="text-sm text-gray-900">
                  {selectedOrder.szallitasiDatum
                    ? new Date(selectedOrder.szallitasiDatum).toLocaleDateString('hu-HU')
                    : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teljesítési dátum</label>
                <p className="text-sm text-gray-900">
                  {selectedOrder.teljesitesiDatum
                    ? new Date(selectedOrder.teljesitesiDatum).toLocaleDateString('hu-HU')
                    : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Végösszeg</label>
                <p className="text-sm text-gray-900 font-semibold">
                  {selectedOrder.vegosszeg.toLocaleString('hu-HU')} Ft
                </p>
              </div>
            </div>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rendelés tételek
                </label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left text-xs font-medium text-gray-600 pb-2">
                          Termék
                        </th>
                        <th className="text-right text-xs font-medium text-gray-600 pb-2">
                          Mennyiség
                        </th>
                        <th className="text-right text-xs font-medium text-gray-600 pb-2">
                          Egységár
                        </th>
                        <th className="text-right text-xs font-medium text-gray-600 pb-2">
                          Összeg
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="text-sm text-gray-900 py-2">
                            {item.item?.azonosito} - {item.item?.nev}
                          </td>
                          <td className="text-sm text-right text-gray-900 py-2">
                            {item.mennyiseg}
                          </td>
                          <td className="text-sm text-right text-gray-900 py-2">
                            {item.egysegAr.toLocaleString('hu-HU')} Ft
                          </td>
                          <td className="text-sm text-right text-gray-900 font-medium py-2">
                            {item.osszeg.toLocaleString('hu-HU')} Ft
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {returnsData?.items && returnsData.items.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visszárúk ({returnsData.items.length})
                </label>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {returnsData.items.map((returnItem: any) => (
                      <div
                        key={returnItem.id}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {returnItem.item?.azonosito} - {returnItem.item?.nev}
                          </p>
                          <p className="text-xs text-gray-600">
                            Mennyiség: {returnItem.mennyiseg} | Raktár: {returnItem.warehouse?.nev}
                          </p>
                        </div>
                        <Link
                          to={`/returns`}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Részletek →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedOrder.megjegyzesek && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Megjegyzések
                </label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedOrder.megjegyzesek}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

