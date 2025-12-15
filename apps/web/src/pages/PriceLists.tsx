import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import {
  usePriceLists,
  usePriceList,
  useCreatePriceList,
  useUpdatePriceList,
  useDeletePriceList,
  useAddPriceListItem,
  useUpdatePriceListItem,
  useRemovePriceListItem,
  importPriceListFromExcel,
  exportPriceListToExcel,
  PriceList,
  PriceListItem,
  CreatePriceListDto,
  AddPriceListItemDto,
} from '../lib/api/logistics';
import { useSuppliers } from '../lib/api/logistics';
import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';

export default function PriceLists() {
  const [filters, setFilters] = useState<{
    supplierId?: string;
    aktiv?: boolean;
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedPriceList, setSelectedPriceList] = useState<PriceList | null>(null);
  const [editingPriceListId, setEditingPriceListId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const { data: priceListsData, isLoading, refetch } = usePriceLists({
    ...filters,
    skip: 0,
    take: 100,
  });

  const { data: suppliersData } = useSuppliers('', 0, 1000);

  // Load full price list details when selected
  const { data: selectedPriceListDetails } = usePriceList(
    selectedPriceList?.id || '',
  );

  useEffect(() => {
    if (selectedPriceList && selectedPriceListDetails) {
      setSelectedPriceList(selectedPriceListDetails);
    }
  }, [selectedPriceListDetails]);

  const { data: itemsData } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const response = await axios.get('/api/logistics/items?skip=0&take=1000');
      return response.data;
    },
  });

  const createPriceList = useCreatePriceList();
  const updatePriceList = useUpdatePriceList();
  const deletePriceList = useDeletePriceList();
  const addItem = useAddPriceListItem();
  const updateItem = useUpdatePriceListItem();
  const removeItem = useRemovePriceListItem();

  const [formData, setFormData] = useState<CreatePriceListDto>({
    supplierId: '',
    nev: '',
    ervenyessegKezdet: new Date().toISOString().split('T')[0],
    ervenyessegVeg: '',
    aktiv: true,
  });

  const [itemFormData, setItemFormData] = useState<AddPriceListItemDto>({
    itemId: '',
    ar: 0,
    valuta: 'HUF',
  });

  const handleOpenModal = (priceList?: PriceList) => {
    if (priceList) {
      setEditingPriceListId(priceList.id);
      setFormData({
        supplierId: priceList.supplierId,
        nev: priceList.nev,
        ervenyessegKezdet: priceList.ervenyessegKezdet.split('T')[0],
        ervenyessegVeg: priceList.ervenyessegVeg ? priceList.ervenyessegVeg.split('T')[0] : '',
        aktiv: priceList.aktiv,
      });
    } else {
      setEditingPriceListId(null);
      setFormData({
        supplierId: '',
        nev: '',
        ervenyessegKezdet: new Date().toISOString().split('T')[0],
        ervenyessegVeg: '',
        aktiv: true,
      });
    }
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPriceListId(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields - check supplierId first
    const supplierIdValue = formData.supplierId;
    console.log('[handleSubmit] Initial supplierId:', supplierIdValue, 'Type:', typeof supplierIdValue);
    
    if (!supplierIdValue || (typeof supplierIdValue === 'string' && supplierIdValue.trim() === '')) {
      console.log('[handleSubmit] Validation failed: supplierId is empty');
      setError('Kérem válasszon szállítót!');
      return;
    }

    if (!formData.nev || formData.nev.trim() === '') {
      setError('Kérem adja meg az árlista nevét!');
      return;
    }

    try {
      if (editingPriceListId) {
        await updatePriceList.mutateAsync({
          id: editingPriceListId,
          data: formData,
        });
        setSuccess('Árlista sikeresen frissítve!');
      } else {
        // Ensure supplierId is not empty string before sending
        const trimmedSupplierId = typeof supplierIdValue === 'string' ? supplierIdValue.trim() : supplierIdValue;
        
        console.log('[handleSubmit] formData:', JSON.stringify(formData, null, 2));
        console.log('[handleSubmit] trimmedSupplierId:', trimmedSupplierId);
        
        if (!trimmedSupplierId || (typeof trimmedSupplierId === 'string' && trimmedSupplierId === '')) {
          console.log('[handleSubmit] Validation failed: trimmedSupplierId is empty');
          setError('Kérem válasszon szállítót!');
          return;
        }
        
        const submitData: CreatePriceListDto = {
          supplierId: trimmedSupplierId as string,
          nev: formData.nev.trim(),
          ervenyessegKezdet: formData.ervenyessegKezdet,
          ervenyessegVeg: formData.ervenyessegVeg || undefined,
          aktiv: formData.aktiv ?? true,
        };
        
        console.log('[handleSubmit] submitData:', JSON.stringify(submitData, null, 2));
        console.log('[handleSubmit] About to call createPriceList.mutateAsync');
        
        await createPriceList.mutateAsync(submitData);
        setSuccess('Árlista sikeresen létrehozva!');
      }

      setTimeout(() => {
        handleCloseModal();
        refetch();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a mentés során');
    }
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Árlista törlése',
      message: 'Biztosan törölni szeretnéd ezt az árlistát?',
      confirmText: 'Törlés',
      cancelText: 'Mégse',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700',
      onConfirm: async () => {
        try {
          await deletePriceList.mutateAsync(id);
          setSuccess('Árlista sikeresen törölve!');
          refetch();
        } catch (err: any) {
          setError(err.response?.data?.message || 'Hiba történt a törlés során');
        }
      },
    });
  };

  const handleOpenItemModal = (priceList: PriceList, item?: PriceListItem) => {
    setSelectedPriceList(priceList);
    if (item) {
      setEditingItemId(item.itemId);
      setItemFormData({
        itemId: item.itemId,
        ar: item.ar,
        valuta: item.valuta,
      });
    } else {
      setEditingItemId(null);
      setItemFormData({
        itemId: '',
        ar: 0,
        valuta: 'HUF',
      });
    }
    setError('');
    setSuccess('');
    setIsItemModalOpen(true);
  };

  const handleCloseItemModal = () => {
    setIsItemModalOpen(false);
    setSelectedPriceList(null);
    setEditingItemId(null);
    setError('');
    setSuccess('');
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPriceList) return;

    setError('');
    setSuccess('');

    try {
      if (editingItemId) {
        await updateItem.mutateAsync({
          priceListId: selectedPriceList.id,
          itemId: editingItemId,
          data: itemFormData,
        });
        setSuccess('Árlista tétel sikeresen frissítve!');
      } else {
        await addItem.mutateAsync({
          priceListId: selectedPriceList.id,
          data: itemFormData,
        });
        setSuccess('Árlista tétel sikeresen hozzáadva!');
      }

      setTimeout(() => {
        handleCloseItemModal();
        refetch();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a mentés során');
    }
  };

  const handleRemoveItem = (priceListId: string, itemId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Árlista tétel eltávolítása',
      message: 'Biztosan eltávolítod ezt a tételt az árlistából?',
      confirmText: 'Eltávolítás',
      cancelText: 'Mégse',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700',
      onConfirm: async () => {
        try {
          await removeItem.mutateAsync({ priceListId, itemId });
          setSuccess('Árlista tétel sikeresen eltávolítva!');
          refetch();
        } catch (err: any) {
          setError(err.response?.data?.message || 'Hiba történt az eltávolítás során');
        }
      },
    });
  };

  const handleImport = async () => {
    if (!importFile || !selectedPriceList) return;

    setImporting(true);
    setError('');
    setSuccess('');

    try {
      const result = await importPriceListFromExcel(selectedPriceList.id, importFile);
      setSuccess(`Importálás sikeres! ${result.success} tétel importálva.${result.errors.length > 0 ? ` ${result.errors.length} hiba történt.` : ''}`);
      if (result.errors.length > 0) {
        console.error('Import hibák:', result.errors);
      }
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportFile(null);
        refetch();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt az importálás során');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async (priceListId: string) => {
    try {
      await exportPriceListToExcel(priceListId);
      setSuccess('Exportálás sikeres!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt az exportálás során');
    }
  };

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Árlisták</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-mbit-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Új árlista
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Szállító</label>
            <select
              value={filters.supplierId || ''}
              onChange={(e) => setFilters({ ...filters, supplierId: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Összes</option>
              {suppliersData?.items?.map((supplier: any) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.nev}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Állapot</label>
            <select
              value={filters.aktiv === undefined ? '' : filters.aktiv ? 'true' : 'false'}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  aktiv: e.target.value === '' ? undefined : e.target.value === 'true',
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Összes</option>
              <option value="true">Aktív</option>
              <option value="false">Inaktív</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price Lists Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Árlisták ({priceListsData?.total || 0})</h2>
        </div>
        {isLoading ? (
          <div className="p-6">Betöltés...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Név
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Szállító
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Érvényesség kezdete
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Érvényesség vége
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tételek száma
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
              {priceListsData?.items?.map((priceList: PriceList) => (
                <tr key={priceList.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {priceList.nev}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {priceList.supplier?.nev || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(priceList.ervenyessegKezdet).toLocaleDateString('hu-HU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {priceList.ervenyessegVeg
                      ? new Date(priceList.ervenyessegVeg).toLocaleDateString('hu-HU')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {priceList._count?.items || priceList.items?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        priceList.aktiv
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {priceList.aktiv ? 'Aktív' : 'Inaktív'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={async () => {
                          const response = await axios.get(`/api/logistics/price-lists/${priceList.id}`);
                          setSelectedPriceList(response.data);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Részletek"
                      >
                        👁
                      </button>
                      <button
                        onClick={() => handleOpenModal(priceList)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Szerkesztés"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleExport(priceList.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Export"
                      >
                        📥
                      </button>
                      <button
                        onClick={() => handleDelete(priceList.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Törlés"
                      >
                        🗑
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
        title={editingPriceListId ? 'Árlista szerkesztése' : 'Új árlista'}
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
              Szállító <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.supplierId || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                console.log('Select onChange - new value:', newValue);
                setFormData((prev) => {
                  const updated = { ...prev, supplierId: newValue };
                  console.log('Select onChange - updated formData:', updated);
                  return updated;
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              disabled={!!editingPriceListId}
            >
              <option value="">Válasszon szállítót</option>
              {suppliersData?.items?.map((supplier: any) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.nev}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Név <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nev}
              onChange={(e) => setFormData({ ...formData, nev: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Érvényesség kezdete <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.ervenyessegKezdet}
                onChange={(e) => setFormData({ ...formData, ervenyessegKezdet: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Érvényesség vége
              </label>
              <input
                type="date"
                value={formData.ervenyessegVeg || ''}
                onChange={(e) =>
                  setFormData({ ...formData, ervenyessegVeg: e.target.value || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.aktiv}
                onChange={(e) => setFormData({ ...formData, aktiv: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Aktív</span>
            </label>
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
              className="px-4 py-2 bg-mbit-blue text-white rounded-lg hover:bg-blue-700"
            >
              {editingPriceListId ? 'Frissítés' : 'Létrehozás'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Price List Details Modal */}
      {selectedPriceList && (
        <Modal
          isOpen={!!selectedPriceList}
          onClose={() => setSelectedPriceList(null)}
          title={`Árlista: ${selectedPriceList.nev}`}
          size="xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-600">Szállító</div>
                <div className="font-medium">{selectedPriceList.supplier?.nev || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Állapot</div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedPriceList.aktiv
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {selectedPriceList.aktiv ? 'Aktív' : 'Inaktív'}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Érvényesség kezdete</div>
                <div className="font-medium">
                  {new Date(selectedPriceList.ervenyessegKezdet).toLocaleDateString('hu-HU')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Érvényesség vége</div>
                <div className="font-medium">
                  {selectedPriceList.ervenyessegVeg
                    ? new Date(selectedPriceList.ervenyessegVeg).toLocaleDateString('hu-HU')
                    : '-'}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={() => {
                  setIsImportModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                📤 Import Excel
              </button>
              <button
                onClick={() => handleExport(selectedPriceList.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                📥 Export Excel
              </button>
              <button
                onClick={() => handleOpenItemModal(selectedPriceList)}
                className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-700"
              >
                + Tétel hozzáadása
              </button>
            </div>

            {/* Items Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cikk azonosító
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cikk név
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Ár
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Valuta
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Műveletek
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedPriceList.items?.map((item: PriceListItem) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.item?.azonosito || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.item?.nev || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {item.ar.toLocaleString('hu-HU')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {item.valuta}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenItemModal(selectedPriceList, item)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Szerkesztés"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleRemoveItem(selectedPriceList.id, item.itemId)}
                            className="text-red-600 hover:text-red-900"
                            title="Eltávolítás"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {/* Add/Edit Item Modal */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={handleCloseItemModal}
        title={editingItemId ? 'Árlista tétel szerkesztése' : 'Tétel hozzáadása'}
        size="md"
      >
        <form onSubmit={handleItemSubmit} className="space-y-4">
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
              Cikk <span className="text-red-500">*</span>
            </label>
            <select
              value={itemFormData.itemId}
              onChange={(e) => setItemFormData({ ...itemFormData, itemId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              disabled={!!editingItemId}
            >
              <option value="">Válasszon cikket</option>
              {itemsData?.items?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.azonosito} - {item.nev}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ár <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={itemFormData.ar}
                onChange={(e) =>
                  setItemFormData({ ...itemFormData, ar: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valuta <span className="text-red-500">*</span>
              </label>
              <select
                value={itemFormData.valuta}
                onChange={(e) => setItemFormData({ ...itemFormData, valuta: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="HUF">HUF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={handleCloseItemModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Mégse
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-mbit-blue text-white rounded-lg hover:bg-blue-700"
            >
              {editingItemId ? 'Frissítés' : 'Hozzáadás'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportFile(null);
        }}
        title="Excel import"
        size="md"
      >
        <div className="space-y-4">
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
              Excel fájl <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="mt-1 text-xs text-gray-500">
              Várható formátum: Cikk azonosító (A oszlop), Ár (B oszlop), Valuta (C oszlop,
              opcionális, alapértelmezett: HUF)
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsImportModalOpen(false);
                setImportFile(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Mégse
            </button>
            <button
              onClick={handleImport}
              disabled={!importFile || importing}
              className="px-4 py-2 bg-mbit-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {importing ? 'Importálás...' : 'Import'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmButtonClass={confirmModal.confirmButtonClass}
      />
    </div>
  );
}

