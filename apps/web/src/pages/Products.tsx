import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { apiFetch } from '../lib/api';

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
  createdAt: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  });


  useEffect(() => {
    loadProducts();
  }, [searchTerm]);

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
    return products
      .filter(p => p.aktiv)
      .reduce((sum, p) => sum + p.eladasiAr, 0);
  };

  const handleOpenModal = () => {
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      nev: '',
      azonosito: '',
      leiras: '',
      egyseg: 'db',
      beszerzesiAr: '0',
      eladasiAr: '0',
      afaKulcs: '27',
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

      const productData = {
        nev: formData.nev,
        azonosito: formData.azonosito || `PROD-${Date.now()}`,
        leiras: formData.leiras || undefined,
        egyseg: formData.egyseg,
        beszerzesiAr: beszerzesiAr,
        eladasiAr: eladasiAr,
        afaKulcs: afaKulcs,
        aktiv: formData.aktiv,
      };

      const response = await apiFetch(`/logistics/items`, {
        method: 'POST',
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
          throw new Error(errorData.message || 'Hiba a termék létrehozásakor');
        }
      }

      setSuccess('Termék sikeresen létrehozva!');
      setTimeout(() => {
        handleCloseModal();
        loadProducts();
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
        <h1 className="text-3xl font-bold">Termékek</h1>
        <button 
          onClick={handleOpenModal}
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
          <div className="text-sm text-gray-600">Összesített érték</div>
          <div className="text-2xl font-bold text-blue-600">
            {calculateTotalValue().toLocaleString('hu-HU')} Ft
          </div>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Új termék létrehozása">
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
              {saving ? 'Mentés...' : 'Létrehozás'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
