import { useState } from 'react';
import Modal from '../Modal';
import {
  useItemSuppliers,
  useLinkItemSupplier,
  useUnlinkItemSupplier,
  useSetPrimarySupplier,
  useCreateSupplier,
  ItemSupplier,
  LinkItemSupplierDto,
  CreateSupplierDto,
} from '../../lib/api/logistics';
import { useQuery } from '@tanstack/react-query';
import axios from '../../lib/axios';

interface ProductSuppliersProps {
  itemId: string;
  showHeader?: boolean;
}

export default function ProductSuppliers({ itemId, showHeader = true }: ProductSuppliersProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isCreateSupplierModalOpen, setIsCreateSupplierModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { data: itemSuppliers, isLoading, refetch } = useItemSuppliers(itemId);

  const { data: suppliersData, refetch: refetchSuppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await axios.get('/api/logistics/suppliers?skip=0&take=1000');
      return response.data;
    },
  });

  const linkSupplier = useLinkItemSupplier();
  const unlinkSupplier = useUnlinkItemSupplier();
  const setPrimary = useSetPrimarySupplier();
  const createSupplier = useCreateSupplier();

  const [linkFormData, setLinkFormData] = useState<LinkItemSupplierDto>({
    supplierId: '',
    beszerzesiAr: undefined,
    minMennyiseg: undefined,
    szallitasiIdo: undefined,
    megjegyzesek: '',
    isPrimary: false,
  });

  const [createSupplierFormData, setCreateSupplierFormData] = useState<CreateSupplierDto>({
    nev: '',
    adoszam: '',
    cim: '',
    email: '',
    telefon: '',
    aktiv: true,
  });

  const handleOpenLinkModal = () => {
    setLinkFormData({
      supplierId: '',
      beszerzesiAr: undefined,
      minMennyiseg: undefined,
      szallitasiIdo: undefined,
      megjegyzesek: '',
      isPrimary: false,
    });
    setError('');
    setSuccess('');
    setIsLinkModalOpen(true);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setError('');
    setSuccess('');
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling to parent form
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await linkSupplier.mutateAsync({
        itemId,
        supplierId: linkFormData.supplierId,
        data: linkFormData,
      });
      setSuccess('Szállító sikeresen hozzáadva!');
      setTimeout(() => {
        handleCloseLinkModal();
        refetch();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a kapcsolat létrehozása során');
    } finally {
      setSaving(false);
    }
  };

  const handleUnlink = async (supplierId: string) => {
    if (!confirm('Biztosan eltávolítja ezt a szállítót?')) return;

    try {
      await unlinkSupplier.mutateAsync({ itemId, supplierId });
      setSuccess('Szállító sikeresen eltávolítva!');
      refetch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt az eltávolítás során');
    }
  };

  const handleSetPrimary = async (supplierId: string) => {
    try {
      await setPrimary.mutateAsync({ itemId, supplierId });
      setSuccess('Elsődleges szállító beállítva!');
      refetch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a beállítás során');
    }
  };

  // Get already linked supplier IDs
  const linkedSupplierIds = itemSuppliers?.map((is: ItemSupplier) => is.supplierId) || [];

  return (
    <div>
      {showHeader && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Szállítók</h3>
          <button
            onClick={handleOpenLinkModal}
            className="bg-mbit-blue text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            + Szállító hozzáadása
          </button>
        </div>
      )}
      {!showHeader && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleOpenLinkModal}
            className="bg-mbit-blue text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            + Szállító hozzáadása
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
          {success}
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-500">Betöltés...</p>
      ) : itemSuppliers && itemSuppliers.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Szállító
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Beszerzési ár
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Min. mennyiség
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Szállítási idő
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Elsődleges
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Műveletek
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {itemSuppliers.map((itemSupplier: ItemSupplier) => (
                <tr
                  key={itemSupplier.id}
                  className={itemSupplier.isPrimary ? 'bg-blue-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {itemSupplier.supplier?.nev}
                    {itemSupplier.isPrimary && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                        Elsődleges
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {itemSupplier.beszerzesiAr
                      ? `${itemSupplier.beszerzesiAr.toLocaleString('hu-HU')} HUF`
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-500">
                    {itemSupplier.minMennyiseg || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-500">
                    {itemSupplier.szallitasiIdo ? `${itemSupplier.szallitasiIdo} nap` : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {itemSupplier.isPrimary ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetPrimary(itemSupplier.supplierId)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Beállítás
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium">
                    <button
                      onClick={() => handleUnlink(itemSupplier.supplierId)}
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
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Nincs szállító kapcsolva ehhez az áruhoz.</p>
      )}

      {/* Link Supplier Modal */}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        title="Szállító hozzáadása"
        size="md"
        zIndex={60}
      >
        <form onSubmit={handleLinkSubmit} onClick={(e) => e.stopPropagation()} className="space-y-4">
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Szállító <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCreateSupplierModalOpen(true)}
                className="text-sm text-mbit-blue hover:text-blue-800 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Új szállító létrehozása
              </button>
            </div>
            <select
              value={linkFormData.supplierId}
              onChange={(e) =>
                setLinkFormData({ ...linkFormData, supplierId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Válasszon szállítót</option>
              {suppliersData?.items
                ?.filter((s: any) => s.aktiv && !linkedSupplierIds.includes(s.id))
                .map((supplier: any) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.nev}
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
              onClick={handleCloseLinkModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-mbit-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Hozzáadás...' : 'Hozzáadás'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Supplier Modal */}
      <Modal
        isOpen={isCreateSupplierModalOpen}
        onClose={() => {
          setIsCreateSupplierModalOpen(false);
          setCreateSupplierFormData({
            nev: '',
            adoszam: '',
            cim: '',
            email: '',
            telefon: '',
            aktiv: true,
          });
          setError('');
        }}
        title="Új szállító létrehozása"
        size="md"
        zIndex={70}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            setSuccess('');

            if (!createSupplierFormData.nev.trim()) {
              setError('A név megadása kötelező');
              return;
            }

            try {
              const newSupplier = await createSupplier.mutateAsync(createSupplierFormData);
              setSuccess('Szállító sikeresen létrehozva!');
              
              // Refresh suppliers list
              await refetchSuppliers();
              
              // Auto-select the newly created supplier
              setLinkFormData({ ...linkFormData, supplierId: newSupplier.id });
              
              // Close create modal
              setIsCreateSupplierModalOpen(false);
              
              setTimeout(() => {
                setSuccess('');
              }, 2000);
            } catch (err: any) {
              setError(err.response?.data?.message || 'Hiba történt a szállító létrehozásakor');
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="space-y-4"
        >
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
              Név <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={createSupplierFormData.nev}
              onChange={(e) =>
                setCreateSupplierFormData({ ...createSupplierFormData, nev: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adószám</label>
            <input
              type="text"
              value={createSupplierFormData.adoszam}
              onChange={(e) =>
                setCreateSupplierFormData({ ...createSupplierFormData, adoszam: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cím</label>
            <input
              type="text"
              value={createSupplierFormData.cim}
              onChange={(e) =>
                setCreateSupplierFormData({ ...createSupplierFormData, cim: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={createSupplierFormData.email}
              onChange={(e) =>
                setCreateSupplierFormData({ ...createSupplierFormData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="tel"
              value={createSupplierFormData.telefon}
              onChange={(e) =>
                setCreateSupplierFormData({ ...createSupplierFormData, telefon: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateSupplierModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={createSupplier.isPending}
              className="px-4 py-2 bg-mbit-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {createSupplier.isPending ? 'Létrehozás...' : 'Létrehozás'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

