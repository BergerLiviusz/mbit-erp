import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { apiFetch } from '../lib/api';
import ProductSuppliers from '../components/logistics/ProductSuppliers';

interface Warehouse {
  id: string;
  azonosito: string;
  nev: string;
  aktiv: boolean;
}

interface Product {
  id: string;
  azonosito: string;
  nev: string;
  leiras?: string | null;
  egyseg: string;
  beszerzesiAr: number;
  eladasiAr: number;
  afaKulcs: number;
  aktiv: boolean;
  szavatossagiIdoNap?: number | null;
  stockLevels?: Array<{
    id: string;
    warehouseId: string;
    mennyiseg: number;
    minimum?: number | null;
    maximum?: number | null;
    warehouse?: {
      id: string;
      nev: string;
      azonosito: string;
    };
  }>;
  createdAt: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuppliersModalOpen, setIsSuppliersModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formData, setFormData] = useState({
    nev: '',
    azonosito: '',
    leiras: '',
    egyseg: 'db',
    beszerzesiAr: '0',
    eladasiAr: '0',
    afaKulcs: '27',
    aktiv: true,
    szavatossagiIdoNap: '',
    warehouses: [] as Array<{ warehouseId: string; mennyiseg: string; minimum: string; maximum: string }>,
  });


  useEffect(() => {
    loadProducts();
    loadWarehouses();
  }, [searchTerm]);

  // Listen for products updated events from other components (like Warehouses)
  useEffect(() => {
    const handleProductsUpdated = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, []);

  const loadWarehouses = async () => {
    try {
      const response = await apiFetch('/logistics/warehouses?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setWarehouses((data.data || []).filter((w: Warehouse) => w.aktiv));
      }
    } catch (error) {
      console.error('Hiba a raktárak betöltésekor:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const url = searchTerm
        ? `/logistics/items?skip=0&take=100&search=${encodeURIComponent(searchTerm)}`
        : `/logistics/items?skip=0&take=100`;

      const response = await apiFetch(url);

      if (response.ok) {
        const data = await response.json();
        setProducts(data.items || []);
      }
    } catch (error) {
      console.error('Hiba a termékek betöltésekor:', error);
    } finally {
      setLoading(false);
    }
  };

  const countActiveProducts = () => {
    return products.filter(p => p.aktiv).length;
  };

  const calculateTotalValue = () => {
    // Calculate inventory value: purchase price × stock quantity
    return products
      .filter(p => p.aktiv)
      .reduce((sum, p) => {
        // Ensure beszerzesiAr is a valid number
        const beszerzesiAr = p.beszerzesiAr || 0;
        
        // If stockLevels exist, calculate inventory value
        if (p.stockLevels && p.stockLevels.length > 0) {
          const totalStock = p.stockLevels.reduce((stockSum, level) => {
            const mennyiseg = level.mennyiseg || 0;
            return stockSum + mennyiseg;
          }, 0);
          return sum + (beszerzesiAr * totalStock);
        }
        // If no stock data, return 0 for this product
        return sum;
      }, 0);
  };

  const handleOpenModal = async (product?: Product) => {
    if (product) {
      setEditingProductId(product.id);
      setFormData({
        nev: product.nev || '',
        azonosito: product.azonosito || '',
        leiras: product.leiras || '',
        egyseg: product.egyseg || 'db',
        beszerzesiAr: product.beszerzesiAr?.toString() || '0',
        eladasiAr: product.eladasiAr?.toString() || '0',
        afaKulcs: product.afaKulcs?.toString() || '27',
        aktiv: product.aktiv ?? true,
        szavatossagiIdoNap: product.szavatossagiIdoNap?.toString() || '',
        warehouses: product.stockLevels?.map(sl => ({
          warehouseId: sl.warehouseId,
          mennyiseg: sl.mennyiseg.toString(),
          minimum: sl.minimum?.toString() || '',
          maximum: sl.maximum?.toString() || '',
        })) || [],
      });
    } else {
      setEditingProductId(null);
      setFormData({
        nev: '',
        azonosito: '',
        leiras: '',
        egyseg: 'db',
        beszerzesiAr: '0',
        eladasiAr: '0',
        afaKulcs: '27',
        aktiv: true,
        szavatossagiIdoNap: '',
        warehouses: [],
      });
    }
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    setFormData({
      nev: '',
      azonosito: '',
      leiras: '',
      egyseg: 'db',
      beszerzesiAr: '0',
      eladasiAr: '0',
      afaKulcs: '27',
      aktiv: true,
      szavatossagiIdoNap: '',
      warehouses: [],
    });
    setError('');
    setSuccess('');
  };

  const handleAddWarehouse = () => {
    setFormData({
      ...formData,
      warehouses: [...formData.warehouses, { warehouseId: '', mennyiseg: '0', minimum: '', maximum: '' }],
    });
  };

  const handleRemoveWarehouse = (index: number) => {
    setFormData({
      ...formData,
      warehouses: formData.warehouses.filter((_, i) => i !== index),
    });
  };

  const handleWarehouseChange = (index: number, field: 'warehouseId' | 'mennyiseg' | 'minimum' | 'maximum', value: string) => {
    const newWarehouses = [...formData.warehouses];
    newWarehouses[index] = { ...newWarehouses[index], [field]: value };
    setFormData({ ...formData, warehouses: newWarehouses });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nev.trim()) {
      setError('A név megadása kötelező');
      return;
    }

    if (!formData.egyseg.trim()) {
      setError('Az egység megadása kötelező');
      return;
    }

    const beszerzesiAr = parseFloat(formData.beszerzesiAr);
    if (isNaN(beszerzesiAr) || beszerzesiAr < 0) {
      setError('A beszerzési ár nem lehet negatív');
      return;
    }

    const eladasiAr = parseFloat(formData.eladasiAr);
    if (isNaN(eladasiAr) || eladasiAr < 0) {
      setError('Az eladási ár nem lehet negatív');
      return;
    }

    const afaKulcs = parseFloat(formData.afaKulcs);
    if (isNaN(afaKulcs) || afaKulcs < 0 || afaKulcs > 100) {
      setError('Az ÁFA kulcs 0 és 100 között kell legyen');
      return;
    }

    setSaving(true);

    try {
      const url = editingProductId 
        ? `/logistics/items/${editingProductId}`
        : '/logistics/items';
      const method = editingProductId ? 'PUT' : 'POST';

      const szavatossagiIdoNap = formData.szavatossagiIdoNap ? parseInt(formData.szavatossagiIdoNap) : null;

      const productData = {
        nev: formData.nev,
        azonosito: formData.azonosito || (editingProductId ? undefined : `PROD-${Date.now()}`),
        leiras: formData.leiras || undefined,
        egyseg: formData.egyseg,
        beszerzesiAr: beszerzesiAr,
        eladasiAr: eladasiAr,
        afaKulcs: afaKulcs,
        aktiv: formData.aktiv,
        szavatossagiIdoNap: szavatossagiIdoNap && !isNaN(szavatossagiIdoNap) ? szavatossagiIdoNap : null,
      };

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
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
          throw new Error(errorData.message || `Hiba a termék ${editingProductId ? 'frissítésekor' : 'létrehozásakor'}`);
        }
      }

      const productResponse = await response.json();
      const productId = editingProductId || productResponse.id;

      setSuccess(editingProductId ? 'Termék sikeresen frissítve!' : 'Termék sikeresen létrehozva!');
      
      // Handle warehouse assignments
      if (formData.warehouses.length > 0) {
        const stockLevelPromises = formData.warehouses
          .filter(w => w.warehouseId && w.mennyiseg)
          .map(w => {
            const mennyiseg = parseFloat(w.mennyiseg);
            if (isNaN(mennyiseg) || mennyiseg < 0) return null;
            
            const minimum = w.minimum ? parseFloat(w.minimum) : null;
            const maximum = w.maximum ? parseFloat(w.maximum) : null;
            
            return apiFetch('/logistics/inventory/stock-levels', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                itemId: productId,
                warehouseId: w.warehouseId,
                mennyiseg: mennyiseg,
                minimum: minimum !== null && !isNaN(minimum) ? minimum : null,
                maximum: maximum !== null && !isNaN(maximum) ? maximum : null,
              }),
            }).catch(err => {
              console.error('Hiba a készletszint létrehozásakor:', err);
              return null;
            });
          })
          .filter(p => p !== null);

        await Promise.all(stockLevelPromises);
      }

      // Reload products to get updated stockLevels data
      await loadProducts();
      
      // Dispatch custom event to notify other components (like Warehouses) to refresh
      window.dispatchEvent(new CustomEvent('productsUpdated'));

      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Biztosan törölni szeretné a terméket: ${productName}?`)) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch(`/logistics/items/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (response.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (response.status >= 500) {
          throw new Error('Szerver hiba. Kérem próbálja újra később.');
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Hiba történt a törlés során');
        }
      }

      setSuccess('Termék sikeresen törölve!');
      setTimeout(() => {
        setSuccess('');
        loadProducts();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a törlés során');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Termékek</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új termék
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Összes termék</div>
          <div className="text-2xl font-bold">{products.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Aktív termékek</div>
          <div className="text-2xl font-bold text-green-600">
            {countActiveProducts()}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Összesített készletérték</div>
          <div className="text-2xl font-bold text-blue-600">
            {calculateTotalValue().toLocaleString('hu-HU')} Ft
          </div>
          <div className="text-xs text-gray-500 mt-1">Beszerzési ár × készletmennyiség</div>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Keresés név vagy azonosító alapján..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mbit-blue"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Termékek listája</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Betöltés...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nincs termék</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Azonosító</th>
                    <th className="text-left p-4 font-medium text-gray-700">Név</th>
                    <th className="text-left p-4 font-medium text-gray-700">Egység</th>
                    <th className="text-right p-4 font-medium text-gray-700">Eladási ár</th>
                    <th className="text-center p-4 font-medium text-gray-700">ÁFA (%)</th>
                    <th className="text-center p-4 font-medium text-gray-700">Aktív</th>
                    <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="p-4 text-sm text-gray-900">{product.azonosito}</td>
                      <td className="p-4 text-sm font-medium text-gray-900">{product.nev}</td>
                      <td className="p-4 text-sm text-gray-600">{product.egyseg}</td>
                      <td className="p-4 text-sm text-right text-gray-900">
                        {product.eladasiAr.toLocaleString('hu-HU')} Ft
                      </td>
                      <td className="p-4 text-sm text-center text-gray-600">{product.afaKulcs}%</td>
                      <td className="p-4 text-center">
                        {product.aktiv ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Aktív
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inaktív
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="text-mbit-blue hover:text-blue-600 mr-3"
                        >
                          Szerkesztés
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProductId(product.id);
                            setIsSuppliersModalOpen(true);
                          }}
                          className="text-green-600 hover:text-green-800 mr-3"
                          title="Szállítók kezelése"
                        >
                          Szállítók
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.nev)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Törlés
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProductId ? "Termék szerkesztése" : "Új termék létrehozása"}>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mbit-blue"
              placeholder="Termék neve"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Azonosító
            </label>
            <input
              type="text"
              value={formData.azonosito}
              onChange={(e) => setFormData({ ...formData, azonosito: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mbit-blue"
              placeholder="Automatikusan generálva, ha üresen hagyja"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leírás
            </label>
            <textarea
              value={formData.leiras}
              onChange={(e) => setFormData({ ...formData, leiras: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mbit-blue"
              placeholder="Termék leírása"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Egység <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.egyseg}
              onChange={(e) => setFormData({ ...formData, egyseg: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mbit-blue"
              placeholder="pl. db, kg, liter"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beszerzési ár (Ft) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.beszerzesiAr}
                onChange={(e) => setFormData({ ...formData, beszerzesiAr: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mbit-blue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Eladási ár (Ft) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.eladasiAr}
                onChange={(e) => setFormData({ ...formData, eladasiAr: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mbit-blue"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ÁFA kulcs (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={formData.afaKulcs}
              onChange={(e) => setFormData({ ...formData, afaKulcs: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mbit-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Szavatossági idő (nap)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.szavatossagiIdoNap}
              onChange={(e) => setFormData({ ...formData, szavatossagiIdoNap: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mbit-blue"
              placeholder="pl. 365"
            />
            <p className="mt-1 text-xs text-gray-500">A termék szavatossági ideje napokban</p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="aktiv"
              checked={formData.aktiv}
              onChange={(e) => setFormData({ ...formData, aktiv: e.target.checked })}
              className="h-4 w-4 text-mbit-blue focus:ring-mbit-blue border-gray-300 rounded"
            />
            <label htmlFor="aktiv" className="ml-2 block text-sm text-gray-700">
              Aktív
            </label>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Raktárak hozzárendelése (opcionális)
              </label>
              <button
                type="button"
                onClick={handleAddWarehouse}
                className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                + Raktár hozzáadása
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {formData.warehouses.map((warehouse, index) => (
                <div key={index} className="flex gap-2 items-start border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Raktár
                      </label>
                      <select
                        value={warehouse.warehouseId}
                        onChange={(e) => handleWarehouseChange(index, 'warehouseId', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">-- Válasszon --</option>
                        {warehouses.map(w => (
                          <option key={w.id} value={w.id}>{w.nev} ({w.azonosito})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Készletmennyiség
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={warehouse.mennyiseg}
                        onChange={(e) => handleWarehouseChange(index, 'mennyiseg', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Minimum készlet
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={warehouse.minimum}
                        onChange={(e) => handleWarehouseChange(index, 'minimum', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Maximum készlet
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={warehouse.maximum}
                        onChange={(e) => handleWarehouseChange(index, 'maximum', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveWarehouse(index)}
                    className="mt-5 text-red-500 hover:text-red-700"
                    title="Raktár eltávolítása"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {formData.warehouses.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  Nincs hozzárendelt raktár. Kattintson a "+ Raktár hozzáadása" gombra.
                </p>
              )}
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
              {saving ? 'Mentés...' : (editingProductId ? 'Frissítés' : 'Létrehozás')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Suppliers Modal - Separate from product form */}
      {selectedProductId && (
        <Modal
          isOpen={isSuppliersModalOpen}
          onClose={() => {
            setIsSuppliersModalOpen(false);
            setSelectedProductId(null);
          }}
          title="Termék szállítói"
          size="lg"
        >
          <ProductSuppliers itemId={selectedProductId} showHeader={false} />
        </Modal>
      )}
    </div>
  );
}
