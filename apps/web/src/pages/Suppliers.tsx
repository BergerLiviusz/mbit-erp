import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import {
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
  useSupplierItems,
  useLinkItemSupplier,
  useUnlinkItemSupplier,
  Supplier,
  CreateSupplierDto,
  LinkItemSupplierDto,
} from '../lib/api/logistics';
import { apiFetch } from '../lib/api';

interface Item {
  id: string;
  azonosito: string;
  nev: string;
  egyseg: string;
}

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [isLinkItemModalOpen, setIsLinkItemModalOpen] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [saving, setSaving] = useState(false);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { data: suppliersData, isLoading, refetch } = useSuppliers(searchTerm, 0, 100);

  const { data: supplierItems, refetch: refetchSupplierItems } = useSupplierItems(selectedSupplierId || '');

  const linkItemSupplier = useLinkItemSupplier();
  const unlinkItemSupplier = useUnlinkItemSupplier();

  const [linkFormData, setLinkFormData] = useState<LinkItemSupplierDto & { itemId: string }>({
    supplierId: '',
    itemId: '',
    beszerzesiAr: undefined,
    minMennyiseg: undefined,
    szallitasiIdo: undefined,
    megjegyzesek: '',
    isPrimary: false,
  });

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const [formData, setFormData] = useState<CreateSupplierDto>({
    nev: '',
    adoszam: '',
    cim: '',
    email: '',
    telefon: '',
    aktiv: true,
  });

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplierId(supplier.id);
      setFormData({
        nev: supplier.nev,
        adoszam: supplier.adoszam || '',
        cim: supplier.cim || '',
        email: supplier.email || '',
        telefon: supplier.telefon || '',
        aktiv: supplier.aktiv,
      });
    } else {
      setEditingSupplierId(null);
      setFormData({
        nev: '',
        adoszam: '',
        cim: '',
        email: '',
        telefon: '',
        aktiv: true,
      });
    }
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplierId(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (editingSupplierId) {
        await updateSupplier.mutateAsync({
          id: editingSupplierId,
          data: formData,
        });
        setSuccess('Szállító sikeresen frissítve!');
      } else {
        await createSupplier.mutateAsync(formData);
        setSuccess('Szállító sikeresen létrehozva!');
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

  const handleDelete = async (id: string) => {
    if (!confirm('Biztosan törli ezt a szállítót?')) return;

    try {
      await deleteSupplier.mutateAsync(id);
      setSuccess('Szállító sikeresen törölve!');
      refetch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a törlés során');
    }
  };

  useEffect(() => {
    if (isItemsModalOpen && selectedSupplierId) {
      loadItems();
    }
  }, [isItemsModalOpen, selectedSupplierId]);

  const loadItems = async () => {
    try {
      const response = await apiFetch('/logistics/items?skip=0&take=1000');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Hiba a termékek betöltésekor:', error);
    }
  };

  const handleViewItems = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setIsItemsModalOpen(true);
  };

  const handleOpenLinkItemModal = () => {
    if (!selectedSupplierId) return;
    setLinkFormData({
      supplierId: selectedSupplierId,
      itemId: '',
      beszerzesiAr: undefined,
      minMennyiseg: undefined,
      szallitasiIdo: undefined,
      megjegyzesek: '',
      isPrimary: false,
    });
    setError('');
    setSuccess('');
    setIsLinkItemModalOpen(true);
  };

  const handleLinkItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || !linkFormData.itemId) return;

    setLinking(true);
    setError('');
    setSuccess('');

    try {
      await linkItemSupplier.mutateAsync({
        itemId: linkFormData.itemId,
        supplierId: selectedSupplierId,
        data: {
          supplierId: selectedSupplierId,
          beszerzesiAr: linkFormData.beszerzesiAr,
          minMennyiseg: linkFormData.minMennyiseg,
          szallitasiIdo: linkFormData.szallitasiIdo,
          megjegyzesek: linkFormData.megjegyzesek,
          isPrimary: linkFormData.isPrimary,
        },
      });
      setSuccess('Termék sikeresen hozzárendelve!');
      setIsLinkItemModalOpen(false);
      refetchSupplierItems();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a hozzárendelés során');
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkItem = async (itemId: string) => {
    if (!selectedSupplierId) return;
    if (!confirm('Biztosan eltávolítja ezt a terméket a szállítótól?')) return;

    try {
      await unlinkItemSupplier.mutateAsync({
        itemId,
        supplierId: selectedSupplierId,
      });
      setSuccess('Termék sikeresen eltávolítva!');
      refetchSupplierItems();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt az eltávolítás során');
    }
  };

  const handleExportCSV = () => {
    if (!suppliersData?.suppliers || suppliersData.suppliers.length === 0) {
      alert('Nincs exportálandó adat!');
      return;
    }

    const headers = ['Név', 'Adószám', 'Cím', 'Email', 'Telefon', 'Aktív', 'Létrehozva'];

    const rows = suppliersData.suppliers.map((s: Supplier) => [
      s.nev,
      s.adoszam || '-',
      s.cim || '-',
      s.email || '-',
      s.telefon || '-',
      s.aktiv ? 'Igen' : 'Nem',
      new Date(s.createdAt).toLocaleDateString('hu-HU'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `szallitok_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Szállítók Kezelése</h1>
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
            + Új szállító
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

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Keresés név, adószám vagy email alapján..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Szállítók ({suppliersData?.total || 0})</h2>
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
                  Adószám
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cím
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Telefon
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Státusz
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Műveletek
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliersData?.items?.map((supplier: Supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {supplier.nev}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.adoszam || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{supplier.cim || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.telefon || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        supplier.aktiv
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {supplier.aktiv ? 'Aktív' : 'Inaktív'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleViewItems(supplier.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Árui"
                      >
                        📦
                      </button>
                      <button
                        onClick={() => handleOpenModal(supplier)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Szerkesztés"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
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
        title={editingSupplierId ? 'Szállító szerkesztése' : 'Új szállító'}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adószám</label>
            <input
              type="text"
              value={formData.adoszam}
              onChange={(e) => setFormData({ ...formData, adoszam: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cím</label>
            <input
              type="text"
              value={formData.cim}
              onChange={(e) => setFormData({ ...formData, cim: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="tel"
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.aktiv}
                onChange={(e) => setFormData({ ...formData, aktiv: e.target.checked })}
                className="mr-2"
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
              disabled={saving}
              className="px-4 py-2 bg-mbit-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Mentés...' : editingSupplierId ? 'Frissítés' : 'Létrehozás'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Supplier Items Modal */}
      <Modal
        isOpen={isItemsModalOpen}
        onClose={() => {
          setIsItemsModalOpen(false);
          setSelectedSupplierId(null);
          setError('');
          setSuccess('');
        }}
        title="Szállító árui"
        size="lg"
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
              {success}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleOpenLinkItemModal}
              className="bg-mbit-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              + Termék hozzáadása
            </button>
          </div>

          {supplierItems && supplierItems.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Áru azonosító
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Név
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Egység
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Elsődleges
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Műveletek
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {supplierItems.map((itemSupplier: any) => (
                  <tr key={itemSupplier.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {itemSupplier.item?.azonosito}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {itemSupplier.item?.nev}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {itemSupplier.item?.egyseg}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {itemSupplier.isPrimary ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          ✓
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleUnlinkItem(itemSupplier.itemId)}
                        className="text-red-600 hover:text-red-900"
                        title="Eltávolítás"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Nincs áru kapcsolva ehhez a szállítóhoz.</p>
          )}
        </div>
      </Modal>

      {/* Link Item Modal */}
      <Modal
        isOpen={isLinkItemModalOpen}
        onClose={() => {
          setIsLinkItemModalOpen(false);
          setError('');
          setSuccess('');
        }}
        title="Termék hozzáadása szállítóhoz"
        size="md"
        zIndex={60}
      >
        <form onSubmit={handleLinkItemSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Termék <span className="text-red-500">*</span>
            </label>
            <select
              value={linkFormData.itemId}
              onChange={(e) =>
                setLinkFormData({ ...linkFormData, itemId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Válasszon terméket</option>
              {items
                .filter(
                  (item) =>
                    !supplierItems?.some(
                      (si: any) => si.itemId === item.id,
                    ),
                )
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.azonosito} - {item.nev}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beszerzési ár (HUF)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={linkFormData.beszerzesiAr || ''}
              onChange={(e) =>
                setLinkFormData({
                  ...linkFormData,
                  beszerzesiAr: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum rendelési mennyiség
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={linkFormData.minMennyiseg || ''}
              onChange={(e) =>
                setLinkFormData({
                  ...linkFormData,
                  minMennyiseg: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Szállítási idő (nap)
            </label>
            <input
              type="number"
              min="0"
              value={linkFormData.szallitasiIdo || ''}
              onChange={(e) =>
                setLinkFormData({
                  ...linkFormData,
                  szallitasiIdo: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Megjegyzések</label>
            <textarea
              value={linkFormData.megjegyzesek}
              onChange={(e) =>
                setLinkFormData({ ...linkFormData, megjegyzesek: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={linkFormData.isPrimary}
                onChange={(e) =>
                  setLinkFormData({ ...linkFormData, isPrimary: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Elsődleges szállító</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsLinkItemModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={linking}
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={linking}
              className="px-4 py-2 bg-mbit-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {linking ? 'Hozzáadás...' : 'Hozzáadás'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

