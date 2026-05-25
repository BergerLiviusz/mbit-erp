import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import {
  useOrders,
  useCreateOrder,
  useUpdateOrder,
  useOrderStatusChange,
  useCancelOrder,
  useDeleteOrder,
  Order,
  CreateOrderDto,
  OrderFilters,
} from '../lib/api/crm';
import { apiFetch } from '../lib/api';

interface Account {
  id: string;
  nev: string;
  azonosito: string;
}

interface Quote {
  id: string;
  azonosito: string;
  allapot: string;
  items: Array<{
    itemId: string;
    mennyiseg: number;
    egysegAr: number;
    kedvezmeny: number;
    item: {
      id: string;
      nev: string;
      azonosito: string;
    };
  }>;
}

interface Item {
  id: string;
  nev: string;
  azonosito: string;
  eladasiAr: number;
}

interface OrderItem {
  itemId: string;
  mennyiseg: string;
  egysegAr: string;
  kedvezmeny: string;
}

const ORDER_STATUSES = [
  { kod: 'NEW', nev: 'Új', szin: 'bg-blue-100 text-blue-800' },
  { kod: 'IN_PROCESS', nev: 'Feldolgozás alatt', szin: 'bg-yellow-100 text-yellow-800' },
  { kod: 'SHIPPED', nev: 'Szállítva', szin: 'bg-purple-100 text-purple-800' },
  { kod: 'COMPLETED', nev: 'Teljesítve', szin: 'bg-green-100 text-green-800' },
  { kod: 'CANCELLED', nev: 'Visszavonva', szin: 'bg-red-100 text-red-800' },
];

export default function Orders() {
  const [filters, setFilters] = useState<OrderFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { data: ordersData, isLoading, refetch } = useOrders(filters, 0, 100);

  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const changeStatus = useOrderStatusChange();
  const cancelOrder = useCancelOrder();
  const deleteOrder = useDeleteOrder();

  const [formData, setFormData] = useState<CreateOrderDto>({
    accountId: '',
    quoteId: '',
    szallitasiDatum: '',
    megjegyzesek: '',
    items: [{ itemId: '', mennyiseg: 1, egysegAr: 0, kedvezmeny: 0 }],
  });

  useEffect(() => {
    if (isModalOpen) {
      loadAccounts();
      loadQuotes();
      loadItems();
    }
  }, [isModalOpen]);

  const loadAccounts = async () => {
    try {
      const response = await apiFetch('/crm/accounts?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.items || data.data || []);
      }
    } catch (error) {
      console.error('Hiba az ügyfelek betöltésekor:', error);
    }
  };

  const loadQuotes = async () => {
    try {
      const response = await apiFetch('/crm/quotes?allapot=jovahagyott&skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setQuotes(data.data || []);
      }
    } catch (error) {
      console.error('Hiba az árajánlatok betöltésekor:', error);
    }
  };

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

  const handleOpenModal = async (order?: Order) => {
    setError('');
    setSuccess('');
    if (order) {
      setEditingOrderId(order.id);
      try {
        const response = await apiFetch(`/crm/orders/${order.id}`);
        if (response.ok) {
          const fullOrder = await response.json();
          setFormData({
            accountId: fullOrder.accountId,
            quoteId: fullOrder.quoteId || '',
            szallitasiDatum: fullOrder.szallitasiDatum
              ? new Date(fullOrder.szallitasiDatum).toISOString().split('T')[0]
              : '',
            megjegyzesek: fullOrder.megjegyzesek || '',
            items:
              fullOrder.items && fullOrder.items.length > 0
                ? fullOrder.items.map((item: any) => ({
                    itemId: item.itemId,
                    mennyiseg: item.mennyiseg,
                    egysegAr: item.egysegAr,
                    kedvezmeny: item.kedvezmeny || 0,
                  }))
                : [{ itemId: '', mennyiseg: 1, egysegAr: 0, kedvezmeny: 0 }],
          });
        }
      } catch (err) {
        console.error('Hiba a rendelés betöltésekor:', err);
      }
    } else {
      setEditingOrderId(null);
      setFormData({
        accountId: '',
        quoteId: '',
        szallitasiDatum: '',
        megjegyzesek: '',
        items: [{ itemId: '', mennyiseg: 1, egysegAr: 0, kedvezmeny: 0 }],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrderId(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const submitData: CreateOrderDto = {
        ...formData,
        quoteId: formData.quoteId || undefined,
        szallitasiDatum: formData.szallitasiDatum || undefined,
        megjegyzesek: formData.megjegyzesek || undefined,
        items: formData.items.filter((item) => item.itemId),
      };

      if (editingOrderId) {
        await updateOrder.mutateAsync({
          id: editingOrderId,
          data: submitData,
        });
        setSuccess('Rendelés sikeresen frissítve!');
      } else {
        await createOrder.mutateAsync(submitData);
        setSuccess('Rendelés sikeresen létrehozva!');
      }

      setTimeout(() => {
        handleCloseModal();
        refetch();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a mentés során');
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemId: '', mennyiseg: 1, egysegAr: 0, kedvezmeny: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems.length > 0 ? newItems : [{ itemId: '', mennyiseg: 1, egysegAr: 0, kedvezmeny: 0 }] });
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Auto-fill price when item is selected
    if (field === 'itemId' && typeof value === 'string') {
      const selectedItem = items.find((item) => item.id === value);
      if (selectedItem) {
        newItems[index].egysegAr = selectedItem.eladasiAr;
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  const handleLoadFromQuote = (quoteId: string) => {
    const selectedQuote = quotes.find((q) => q.id === quoteId);
    if (selectedQuote && selectedQuote.items) {
      setFormData({
        ...formData,
        items: selectedQuote.items.map((item) => ({
          itemId: item.itemId,
          mennyiseg: item.mennyiseg,
          egysegAr: item.egysegAr,
          kedvezmeny: item.kedvezmeny || 0,
        })),
      });
    }
  };

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

  const handleCancel = async (id: string) => {
    const reason = prompt('Visszavonás oka:');
    if (reason === null) return;

    try {
      await cancelOrder.mutateAsync({ id, megjegyzesek: reason });
      setSuccess('Rendelés sikeresen visszavonva!');
      refetch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a visszavonás során');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Biztosan törli ezt a rendelést?')) return;

    try {
      await deleteOrder.mutateAsync(id);
      setSuccess('Rendelés sikeresen törölve!');
      refetch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a törlés során');
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

  const handleExportCSV = () => {
    if (!ordersData?.data || ordersData.data.length === 0) {
      alert('Nincs exportálandó adat!');
      return;
    }

    const headers = [
      'Rendelés azonosító',
      'Ügyfél',
      'Árajánlat',
      'Rendelés dátuma',
      'Szállítási dátum',
      'Teljesítési dátum',
      'Összeg',
      'ÁFA',
      'Végösszeg',
      'Állapot',
      'Megjegyzések',
    ];

    const rows = ordersData.data.map((order: Order) => [
      order.azonosito,
      order.account?.nev || '-',
      order.quote?.azonosito || '-',
      new Date(order.rendelesiDatum).toLocaleDateString('hu-HU'),
      order.szallitasiDatum ? new Date(order.szallitasiDatum).toLocaleDateString('hu-HU') : '-',
      order.teljesitesiDatum ? new Date(order.teljesitesiDatum).toLocaleDateString('hu-HU') : '-',
      order.osszeg.toLocaleString('hu-HU'),
      order.afa.toLocaleString('hu-HU'),
      order.vegosszeg.toLocaleString('hu-HU'),
      getStatusLabel(order.allapot),
      order.megjegyzesek || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rendelesek_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rendelések</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
            title="CSV export"
          >
            📥 Export CSV
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-mbit-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Új rendelés
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ügyfél</label>
            <select
              value={filters.accountId || ''}
              onChange={(e) =>
                setFilters({ ...filters, accountId: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Összes ügyfél</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.nev} ({account.azonosito})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Rendelések ({ordersData?.total || 0})</h2>
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
                  Árajánlat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rendelés dátuma
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Végösszeg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Állapot
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
                    {order.quote?.azonosito || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.rendelesiDatum).toLocaleDateString('hu-HU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {order.vegosszeg.toLocaleString('hu-HU')} Ft
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.allapot)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailsModalOpen(true);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                        title="Részletek"
                      >
                        👁
                      </button>
                      {order.allapot === 'NEW' && (
                        <>
                          <button
                            onClick={() => handleOpenModal(order)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Szerkesztés"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleStatusChange(order.id, 'IN_PROCESS')}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Feldolgozásba"
                          >
                            ⚙
                          </button>
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Visszavonás"
                          >
                            ✗
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Törlés"
                          >
                            🗑
                          </button>
                        </>
                      )}
                      {(order.allapot === 'NEW' || order.allapot === 'IN_PROCESS') && (
                        <button
                          onClick={async () => {
                            try {
                              const response = await apiFetch(`/crm/shipments/from-order/${order.id}`, { method: 'POST' });
                              if (response.ok) {
                                setSuccess('Szállítás létrehozva!');
                                setTimeout(() => setSuccess(''), 3000);
                              } else {
                                const error = await response.json();
                                setError(error.message || 'Hiba');
                              }
                            } catch (err: any) {
                              setError(err.message);
                            }
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Szállítás létrehozása rendelésből"
                        >
                          📦
                        </button>
                      )}
                      {order.allapot === 'IN_PROCESS' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(order.id, 'SHIPPED')}
                            className="text-purple-600 hover:text-purple-900"
                            title="Szállítva"
                          >
                            🚚
                          </button>
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Visszavonás"
                          >
                            ✗
                          </button>
                        </>
                      )}
                      {(order.allapot === 'NEW' || order.allapot === 'IN_PROCESS' || order.allapot === 'SHIPPED') && (
                        <button
                          onClick={async () => {
                            try {
                              const response = await apiFetch(`/crm/invoice-stubs/from-order/${order.id}`, { method: 'POST' });
                              if (response.ok) {
                                setSuccess('Számla-meta létrehozva!');
                                setTimeout(() => setSuccess(''), 3000);
                              } else {
                                const error = await response.json();
                                setError(error.message || 'Hiba');
                              }
                            } catch (err: any) {
                              setError(err.message);
                            }
                          }}
                          className="text-teal-600 hover:text-teal-900"
                          title="CRM számla-meta (bizonylati stub, nem NAV-számla)"
                        >
                          🧾 Meta
                        </button>
                      )}
                      {order.allapot === 'SHIPPED' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                            className="text-green-600 hover:text-green-900"
                            title="Teljesítve"
                          >
                            ✓
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const response = await apiFetch(`/crm/invoices/from-order/${order.id}`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                });
                                if (response.ok) {
                                  setSuccess('Számla sikeresen létrehozva!');
                                  setTimeout(() => setSuccess(''), 3000);
                                } else {
                                  const error = await response.json();
                                  setError(error.message || 'Hiba a számla létrehozásakor');
                                  setTimeout(() => setError(''), 5000);
                                }
                              } catch (err: any) {
                                setError(err.message || 'Hiba a számla létrehozásakor');
                                setTimeout(() => setError(''), 5000);
                              }
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Számla létrehozása"
                          >
                            📄
                          </button>
                        </>
                      )}
                      {(order.allapot === 'COMPLETED') && (
                        <button
                          onClick={async () => {
                            try {
                              const response = await apiFetch(`/crm/invoices/from-order/${order.id}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                              });
                              if (response.ok) {
                                setSuccess('Számla sikeresen létrehozva!');
                                setTimeout(() => setSuccess(''), 3000);
                              } else {
                                const error = await response.json();
                                setError(error.message || 'Hiba a számla létrehozásakor');
                                setTimeout(() => setError(''), 5000);
                              }
                            } catch (err: any) {
                              setError(err.message || 'Hiba a számla létrehozásakor');
                              setTimeout(() => setError(''), 5000);
                            }
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Számla létrehozása"
                        >
                          📄
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingOrderId ? 'Rendelés szerkesztése' : 'Új rendelés'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ügyfél <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Válasszon ügyfelet</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.nev} ({account.azonosito})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Árajánlat (opcionális)
              </label>
              <select
                value={formData.quoteId}
                onChange={(e) => {
                  setFormData({ ...formData, quoteId: e.target.value });
                  if (e.target.value) {
                    handleLoadFromQuote(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Nincs árajánlat</option>
                {quotes.map((quote) => (
                  <option key={quote.id} value={quote.id}>
                    {quote.azonosito}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Szállítási dátum
            </label>
            <input
              type="date"
              value={formData.szallitasiDatum}
              onChange={(e) =>
                setFormData({ ...formData, szallitasiDatum: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Megjegyzések</label>
            <textarea
              value={formData.megjegyzesek}
              onChange={(e) => setFormData({ ...formData, megjegyzesek: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Rendelés tételek</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                + Tétel hozzáadása
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-start border border-gray-200 rounded p-3 bg-gray-50"
                >
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Termék
                      </label>
                      <select
                        value={item.itemId}
                        onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      >
                        <option value="">-- Válasszon --</option>
                        {items.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.azonosito} - {i.nev}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Mennyiség
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.mennyiseg}
                        onChange={(e) =>
                          handleItemChange(index, 'mennyiseg', parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Egységár
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.egysegAr}
                        onChange={(e) =>
                          handleItemChange(index, 'egysegAr', parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Kedvezmény (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.kedvezmeny}
                        onChange={(e) =>
                          handleItemChange(index, 'kedvezmeny', parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="mt-5 text-red-500 hover:text-red-700"
                    title="Tétel eltávolítása"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Mégse
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-mbit-blue text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              disabled={saving}
            >
              {saving ? 'Mentés...' : editingOrderId ? 'Frissítés' : 'Létrehozás'}
            </button>
          </div>
        </form>
      </Modal>

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
                <label className="block text-sm font-medium text-gray-700">Árajánlat</label>
                <p className="text-sm text-gray-900">
                  {selectedOrder.quote?.azonosito || '-'}
                </p>
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
                <label className="block text-sm font-medium text-gray-700">Állapot</label>
                <div className="mt-1">{getStatusBadge(selectedOrder.allapot)}</div>
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

            {selectedOrder.returns && selectedOrder.returns.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visszárúk ({selectedOrder.returns.length})
                </label>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    {selectedOrder.returns.length} visszárú kapcsolódik ehhez a rendeléshez.
                  </p>
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

