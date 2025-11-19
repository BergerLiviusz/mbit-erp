import { useState } from 'react';
import Modal from '../components/Modal';
import {
  useReturns,
  useCreateReturn,
  useUpdateReturn,
  useApproveReturn,
  useRejectReturn,
  useCompleteReturn,
  Return,
  CreateReturnDto,
} from '../lib/api/logistics';
import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';
import { apiFetch } from '../lib/api';

export default function Returns() {
  const [filters, setFilters] = useState<{
    orderId?: string;
    itemId?: string;
    warehouseId?: string;
    allapot?: string;
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReturnId, setEditingReturnId] = useState<string | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { data: returnsData, isLoading, refetch } = useReturns({
    ...filters,
    skip: 0,
    take: 100,
  });

  const { data: itemsData } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const response = await axios.get('/api/logistics/items?skip=0&take=1000');
      return response.data;
    },
  });

  const { data: warehousesData } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const response = await apiFetch('/logistics/warehouses?skip=0&take=100');
      return response.json();
    },
  });

  const { data: ordersData } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await axios.get('/api/crm/orders?skip=0&take=1000');
      return response.data;
    },
  });

  const createReturn = useCreateReturn();
  const updateReturn = useUpdateReturn();
  const approveReturn = useApproveReturn();
  const rejectReturn = useRejectReturn();
  const completeReturn = useCompleteReturn();

  const [formData, setFormData] = useState<CreateReturnDto>({
    orderId: '',
    itemId: '',
    warehouseId: '',
    mennyiseg: 0,
    ok: 'hibas',
    visszaruDatum: new Date().toISOString().split('T')[0],
    megjegyzesek: '',
  });

  const handleOpenModal = (returnItem?: Return) => {
    if (returnItem) {
      setEditingReturnId(returnItem.id);
      setFormData({
        orderId: returnItem.orderId || '',
        itemId: returnItem.itemId,
        warehouseId: returnItem.warehouseId,
        mennyiseg: returnItem.mennyiseg,
        ok: returnItem.ok,
        visszaruDatum: returnItem.visszaruDatum.split('T')[0],
        megjegyzesek: returnItem.megjegyzesek || '',
      });
    } else {
      setEditingReturnId(null);
      setFormData({
        orderId: '',
        itemId: '',
        warehouseId: '',
        mennyiseg: 0,
        ok: 'hibas',
        visszaruDatum: new Date().toISOString().split('T')[0],
        megjegyzesek: '',
      });
    }
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReturnId(null);
    setSelectedReturn(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const submitData = {
        ...formData,
        orderId: formData.orderId || undefined,
        megjegyzesek: formData.megjegyzesek || undefined,
      };

      if (editingReturnId) {
        await updateReturn.mutateAsync({
          id: editingReturnId,
          data: submitData,
        });
        setSuccess('Visszárú sikeresen frissítve!');
      } else {
        await createReturn.mutateAsync(submitData);
        setSuccess('Visszárú sikeresen létrehozva!');
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

  const handleApprove = async (id: string) => {
    if (!confirm('Biztosan jóváhagyja ezt a visszárút?')) return;

    try {
      await approveReturn.mutateAsync({ id, megjegyzesek: '' });
      setSuccess('Visszárú sikeresen jóváhagyva!');
      refetch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a jóváhagyás során');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Elutasítás oka:');
    if (reason === null) return;

    try {
      await rejectReturn.mutateAsync({ id, reason });
      setSuccess('Visszárú sikeresen elutasítva!');
      refetch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt az elutasítás során');
    }
  };

  const handleComplete = async (id: string) => {
    if (!confirm('Biztosan feldolgozza ezt a visszárút? A készlet vissza lesz írva.')) return;

    try {
      await completeReturn.mutateAsync(id);
      setSuccess('Visszárú sikeresen feldolgozva!');
      refetch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a feldolgozás során');
    }
  };

  const getStatusBadge = (allapot: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PENDING: { label: 'Függőben', className: 'bg-yellow-100 text-yellow-800' },
      APPROVED: { label: 'Jóváhagyva', className: 'bg-blue-100 text-blue-800' },
      REJECTED: { label: 'Elutasítva', className: 'bg-red-100 text-red-800' },
      COMPLETED: { label: 'Feldolgozva', className: 'bg-green-100 text-green-800' },
    };

    const status = statusMap[allapot] || { label: allapot, className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${status.className}`}>
        {status.label}
      </span>
    );
  };

  const getOkLabel = (ok: string) => {
    const okMap: Record<string, string> = {
      hibas: 'Hibás',
      sertett: 'Sérült',
      tulcsordulas: 'Túlcsordulás',
      egyeb: 'Egyéb',
    };
    return okMap[ok] || ok;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Visszárú Kezelés</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-mbit-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Új visszárú
        </button>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Rendelés</label>
            <select
              value={filters.orderId || ''}
              onChange={(e) => setFilters({ ...filters, orderId: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Összes</option>
              {ordersData?.items?.map((order: any) => (
                <option key={order.id} value={order.id}>
                  {order.azonosito}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Áru</label>
            <select
              value={filters.itemId || ''}
              onChange={(e) => setFilters({ ...filters, itemId: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Összes</option>
              {itemsData?.items?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.azonosito} - {item.nev}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raktár</label>
            <select
              value={filters.warehouseId || ''}
              onChange={(e) =>
                setFilters({ ...filters, warehouseId: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Összes</option>
              {warehousesData?.data?.map((warehouse: any) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.nev}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Állapot</label>
            <select
              value={filters.allapot || ''}
              onChange={(e) => setFilters({ ...filters, allapot: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Összes</option>
              <option value="PENDING">Függőben</option>
              <option value="APPROVED">Jóváhagyva</option>
              <option value="REJECTED">Elutasítva</option>
              <option value="COMPLETED">Feldolgozva</option>
            </select>
          </div>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Visszárúk ({returnsData?.total || 0})</h2>
        </div>
        {isLoading ? (
          <div className="p-6">Betöltés...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rendelés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Áru
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Raktár
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Mennyiség
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Állapot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dátum
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Műveletek
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returnsData?.items?.map((returnItem: Return) => (
                <tr key={returnItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {returnItem.order?.azonosito || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {returnItem.item?.azonosito} - {returnItem.item?.nev}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {returnItem.warehouse?.nev}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {returnItem.mennyiseg}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getOkLabel(returnItem.ok)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(returnItem.allapot)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(returnItem.visszaruDatum).toLocaleDateString('hu-HU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center gap-2">
                      {returnItem.allapot === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(returnItem.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Jóváhagyás"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleReject(returnItem.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Elutasítás"
                          >
                            ✗
                          </button>
                          <button
                            onClick={() => handleOpenModal(returnItem)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Szerkesztés"
                          >
                            ✎
                          </button>
                        </>
                      )}
                      {returnItem.allapot === 'APPROVED' && (
                        <button
                          onClick={() => handleComplete(returnItem.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Feldolgozás"
                        >
                          ✓✓
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedReturn(returnItem)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Részletek"
                      >
                        👁
                      </button>
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
        title={editingReturnId ? 'Visszárú szerkesztése' : 'Új visszárú'}
        size="lg"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rendelés (opcionális)
            </label>
            <select
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Nincs rendelés</option>
              {ordersData?.items?.map((order: any) => (
                <option key={order.id} value={order.id}>
                  {order.azonosito}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Áru <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.itemId}
              onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Válasszon árut</option>
              {itemsData?.items?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.azonosito} - {item.nev}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raktár <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.warehouseId}
              onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Válasszon raktárt</option>
              {warehousesData?.data?.map((warehouse: any) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.nev}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mennyiség <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.mennyiseg}
              onChange={(e) =>
                setFormData({ ...formData, mennyiseg: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visszárú ok <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.ok}
              onChange={(e) =>
                setFormData({ ...formData, ok: e.target.value as CreateReturnDto['ok'] })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="hibas">Hibás</option>
              <option value="sertett">Sérült</option>
              <option value="tulcsordulas">Túlcsordulás</option>
              <option value="egyeb">Egyéb</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dátum</label>
            <input
              type="date"
              value={formData.visszaruDatum}
              onChange={(e) => setFormData({ ...formData, visszaruDatum: e.target.value })}
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

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-mbit-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Mentés...' : editingReturnId ? 'Frissítés' : 'Létrehozás'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      {selectedReturn && (
        <Modal
          isOpen={!!selectedReturn}
          onClose={() => setSelectedReturn(null)}
          title="Visszárú részletei"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <strong>Rendelés:</strong> {selectedReturn.order?.azonosito || '-'}
            </div>
            <div>
              <strong>Áru:</strong> {selectedReturn.item?.azonosito} - {selectedReturn.item?.nev}
            </div>
            <div>
              <strong>Raktár:</strong> {selectedReturn.warehouse?.nev}
            </div>
            <div>
              <strong>Mennyiség:</strong> {selectedReturn.mennyiseg}
            </div>
            <div>
              <strong>Ok:</strong> {getOkLabel(selectedReturn.ok)}
            </div>
            <div>
              <strong>Állapot:</strong> {getStatusBadge(selectedReturn.allapot)}
            </div>
            <div>
              <strong>Dátum:</strong>{' '}
              {new Date(selectedReturn.visszaruDatum).toLocaleDateString('hu-HU')}
            </div>
            {selectedReturn.megjegyzesek && (
              <div>
                <strong>Megjegyzések:</strong> {selectedReturn.megjegyzesek}
              </div>
            )}
            {selectedReturn.createdBy && (
              <div>
                <strong>Létrehozta:</strong> {selectedReturn.createdBy.nev} (
                {selectedReturn.createdBy.email})
              </div>
            )}
            {selectedReturn.approvedBy && (
              <div>
                <strong>Jóváhagyta:</strong> {selectedReturn.approvedBy.nev} (
                {selectedReturn.approvedBy.email})
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

