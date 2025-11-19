import { useState } from 'react';
import Modal from '../components/Modal';
import {
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
  useSupplierItems,
  Supplier,
  CreateSupplierDto,
} from '../lib/api/logistics';

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { data: suppliersData, isLoading, refetch } = useSuppliers(searchTerm, 0, 100);

  const { data: supplierItems } = useSupplierItems(selectedSupplierId || '');

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

  const handleViewItems = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setIsItemsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Szállítók Kezelése</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-mbit-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Új szállító
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
        }}
        title="Szállító árui"
        size="lg"
      >
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
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Nincs áru kapcsolva ehhez a szállítóhoz.</p>
        )}
      </Modal>
    </div>
  );
}

