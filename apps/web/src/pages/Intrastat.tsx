import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import Modal from '../components/Modal';

interface IntrastatDeclaration {
  id: string;
  ev: number;
  honap: number;
  allapot: string;
  kuldesDatuma?: string | null;
  visszaigazolasDatuma?: string | null;
  megjegyzesek?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: IntrastatItem[];
  _count?: {
    items: number;
  };
}

interface IntrastatItem {
  id: string;
  intrastatDeclarationId: string;
  itemId?: string | null;
  irany: string;
  partnerOrszagKod: string;
  szallitasiMod: string;
  statisztikaiErtek: number;
  nettoSuly?: number | null;
  kiegeszitoEgység?: string | null;
  kiegeszitoMennyiseg?: number | null;
  termekkod?: string | null;
  megjegyzesek?: string | null;
  item?: {
    id: string;
    nev: string;
    azonosito: string;
  } | null;
}

interface Item {
  id: string;
  nev: string;
  azonosito: string;
}

const ALLAPOTOK = [
  { kod: 'NYITOTT', nev: 'Nyitott', szin: 'bg-yellow-100 text-yellow-800' },
  { kod: 'KULDESRE_KESZ', nev: 'Küldésre kész', szin: 'bg-blue-100 text-blue-800' },
  { kod: 'KULDOOTT', nev: 'Elküldött', szin: 'bg-purple-100 text-purple-800' },
  { kod: 'VISSZAIGAZOLT', nev: 'Visszaigazolt', szin: 'bg-green-100 text-green-800' },
];

const IRANYOK = [
  { kod: 'BEVETEL', nev: 'Bevétel' },
  { kod: 'KIVETEL', nev: 'Kivétel' },
];

const SZALLITASI_MODOK = [
  { kod: '1', nev: '1 - Tengeri hajózás' },
  { kod: '2', nev: '2 - Vasúti közlekedés' },
  { kod: '3', nev: '3 - Közúti közlekedés' },
  { kod: '4', nev: '4 - Légi közlekedés' },
  { kod: '5', nev: '5 - Postai küldemény' },
  { kod: '7', nev: '7 - Vízutak' },
  { kod: '8', nev: '8 - Vezetékek' },
  { kod: '9', nev: '9 - Önvezető' },
];

export default function Intrastat() {
  const [declarations, setDeclarations] = useState<IntrastatDeclaration[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState<IntrastatDeclaration | null>(null);
  const [selectedItem, setSelectedItem] = useState<IntrastatItem | null>(null);

  const [formData, setFormData] = useState({
    ev: new Date().getFullYear(),
    honap: new Date().getMonth() + 1,
    megjegyzesek: '',
  });

  const [itemFormData, setItemFormData] = useState({
    itemId: '',
    irany: 'BEVETEL',
    partnerOrszagKod: '',
    szallitasiMod: '3',
    statisztikaiErtek: '',
    nettoSuly: '',
    kiegeszitoEgység: '',
    kiegeszitoMennyiseg: '',
    termekkod: '',
    megjegyzesek: '',
  });

  const [filters, setFilters] = useState({
    ev: new Date().getFullYear().toString(),
    honap: '',
    allapot: '',
  });

  useEffect(() => {
    loadItems();
    loadDeclarations();
  }, [filters]);

  const loadItems = async () => {
    try {
      const response = await apiFetch('/logistics/items?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Hiba a termékek betöltésekor:', err);
    }
  };

  const loadDeclarations = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.ev) queryParams.append('ev', filters.ev);
      if (filters.honap) queryParams.append('honap', filters.honap);
      if (filters.allapot) queryParams.append('allapot', filters.allapot);

      const response = await apiFetch(`/logistics/intrastat?skip=0&take=100&${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDeclarations(data.items || []);
      } else {
        throw new Error('Hiba a bejelentések betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const loadDeclarationDetails = async (id: string) => {
    try {
      const response = await apiFetch(`/logistics/intrastat/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedDeclaration(data);
      }
    } catch (err: any) {
      setError(err.message || 'Hiba a részletek betöltésekor');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.ev || formData.ev < 2000 || formData.ev > 2100) {
      setError('Érvénytelen év');
      return;
    }

    if (!formData.honap || formData.honap < 1 || formData.honap > 12) {
      setError('Érvénytelen hónap');
      return;
    }

    try {
      const response = await apiFetch('/logistics/intrastat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ev: formData.ev,
          honap: formData.honap,
          megjegyzesek: formData.megjegyzesek || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a bejelentés létrehozásakor');
      }

      setSuccess('INTRASTAT bejelentés sikeresen létrehozva!');
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({
          ev: new Date().getFullYear(),
          honap: new Date().getMonth() + 1,
          megjegyzesek: '',
        });
        loadDeclarations();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    }
  };

  const handleOpenItemModal = (declaration: IntrastatDeclaration, item?: IntrastatItem) => {
    setSelectedDeclaration(declaration);
    if (item) {
      setSelectedItem(item);
      setItemFormData({
        itemId: item.itemId || '',
        irany: item.irany,
        partnerOrszagKod: item.partnerOrszagKod,
        szallitasiMod: item.szallitasiMod,
        statisztikaiErtek: item.statisztikaiErtek.toString(),
        nettoSuly: item.nettoSuly?.toString() || '',
        kiegeszitoEgység: item.kiegeszitoEgység || '',
        kiegeszitoMennyiseg: item.kiegeszitoMennyiseg?.toString() || '',
        termekkod: item.termekkod || '',
        megjegyzesek: item.megjegyzesek || '',
      });
    } else {
      setSelectedItem(null);
      setItemFormData({
        itemId: '',
        irany: 'BEVETEL',
        partnerOrszagKod: '',
        szallitasiMod: '3',
        statisztikaiErtek: '',
        nettoSuly: '',
        kiegeszitoEgység: '',
        kiegeszitoMennyiseg: '',
        termekkod: '',
        megjegyzesek: '',
      });
    }
    setIsItemModalOpen(true);
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedDeclaration) {
      setError('Nincs kiválasztott bejelentés');
      return;
    }

    if (!itemFormData.partnerOrszagKod || !/^[A-Z]{2}$/.test(itemFormData.partnerOrszagKod)) {
      setError('Érvénytelen országkód. Használjon ISO 3166-1 alpha-2 formátumot (pl. DE, FR)');
      return;
    }

    if (!itemFormData.statisztikaiErtek || isNaN(parseFloat(itemFormData.statisztikaiErtek))) {
      setError('Érvénytelen statisztikai érték');
      return;
    }

    try {
      const url = selectedItem
        ? `/logistics/intrastat/${selectedDeclaration.id}/items/${selectedItem.id}`
        : `/logistics/intrastat/${selectedDeclaration.id}/items`;
      const method = selectedItem ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedItem ? {
          partnerOrszagKod: itemFormData.partnerOrszagKod,
          szallitasiMod: itemFormData.szallitasiMod,
          statisztikaiErtek: parseFloat(itemFormData.statisztikaiErtek),
          nettoSuly: itemFormData.nettoSuly ? parseFloat(itemFormData.nettoSuly) : undefined,
          kiegeszitoEgység: itemFormData.kiegeszitoEgység || undefined,
          kiegeszitoMennyiseg: itemFormData.kiegeszitoMennyiseg ? parseFloat(itemFormData.kiegeszitoMennyiseg) : undefined,
          termekkod: itemFormData.termekkod || undefined,
          megjegyzesek: itemFormData.megjegyzesek || undefined,
        } : {
          itemId: itemFormData.itemId || undefined,
          irany: itemFormData.irany,
          partnerOrszagKod: itemFormData.partnerOrszagKod,
          szallitasiMod: itemFormData.szallitasiMod,
          statisztikaiErtek: parseFloat(itemFormData.statisztikaiErtek),
          nettoSuly: itemFormData.nettoSuly ? parseFloat(itemFormData.nettoSuly) : undefined,
          kiegeszitoEgység: itemFormData.kiegeszitoEgység || undefined,
          kiegeszitoMennyiseg: itemFormData.kiegeszitoMennyiseg ? parseFloat(itemFormData.kiegeszitoMennyiseg) : undefined,
          termekkod: itemFormData.termekkod || undefined,
          megjegyzesek: itemFormData.megjegyzesek || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a tétel mentésekor');
      }

      setSuccess(selectedItem ? 'Tétel sikeresen frissítve!' : 'Tétel sikeresen hozzáadva!');
      setTimeout(() => {
        setIsItemModalOpen(false);
        loadDeclarations();
        if (selectedDeclaration) {
          loadDeclarationDetails(selectedDeclaration.id);
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleMarkReady = async (id: string) => {
    try {
      const response = await apiFetch(`/logistics/intrastat/${id}/mark-ready`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Hiba az állapot módosításakor');
      }

      setSuccess('Bejelentés küldésre késznek jelölve!');
      loadDeclarations();
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleMarkSent = async (id: string) => {
    try {
      const response = await apiFetch(`/logistics/intrastat/${id}/mark-sent`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Hiba az állapot módosításakor');
      }

      setSuccess('Bejelentés elküldöttnek jelölve!');
      loadDeclarations();
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleExport = async (id: string, format: 'nav' | 'xml') => {
    try {
      const response = await apiFetch(`/logistics/intrastat/${id}/export/${format}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Hiba az exportálás során');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const declaration = declarations.find(d => d.id === id);
      const extension = format === 'nav' ? 'txt' : 'xml';
      a.download = `intrastat_${declaration?.ev || ''}_${declaration?.honap || ''}.${extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setSuccess('Exportálás sikeres!');
    } catch (err: any) {
      setError(err.message || 'Hiba az exportálás során');
    }
  };

  const handleDeleteItem = async (declarationId: string, itemId: string) => {
    if (!confirm('Biztosan törölni szeretné ezt a tételt?')) {
      return;
    }

    try {
      const response = await apiFetch(`/logistics/intrastat/${declarationId}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hiba a törlés során');
      }

      setSuccess('Tétel sikeresen törölve!');
      loadDeclarations();
      if (selectedDeclaration?.id === declarationId) {
        loadDeclarationDetails(declarationId);
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const getAllapotBadge = (allapot: string) => {
    const a = ALLAPOTOK.find(al => al.kod === allapot);
    return a || ALLAPOTOK[0];
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">INTRASTAT Bejelentések</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új bejelentés
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Szűrők */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Év</label>
            <input
              type="number"
              value={filters.ev}
              onChange={(e) => setFilters({ ...filters, ev: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              min="2000"
              max="2100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hónap</label>
            <select
              value={filters.honap}
              onChange={(e) => setFilters({ ...filters, honap: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m.toString()}>{m}. hónap</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Állapot</label>
            <select
              value={filters.allapot}
              onChange={(e) => setFilters({ ...filters, allapot: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {ALLAPOTOK.map(a => (
                <option key={a.kod} value={a.kod}>{a.nev}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bejelentések lista */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : declarations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs bejelentés</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Év/Hónap</th>
                  <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                  <th className="text-left p-4 font-medium text-gray-700">Tételek száma</th>
                  <th className="text-left p-4 font-medium text-gray-700">Küldés dátuma</th>
                  <th className="text-left p-4 font-medium text-gray-700">Létrehozva</th>
                  <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {declarations.map((declaration) => {
                  const allapotBadge = getAllapotBadge(declaration.allapot);
                  
                  return (
                    <tr key={declaration.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">
                        {declaration.ev}/{String(declaration.honap).padStart(2, '0')}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${allapotBadge.szin}`}>
                          {allapotBadge.nev}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {declaration._count?.items || declaration.items?.length || 0}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {declaration.kuldesDatuma
                          ? new Date(declaration.kuldesDatuma).toLocaleDateString('hu-HU')
                          : '-'}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(declaration.createdAt).toLocaleDateString('hu-HU')}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedDeclaration(declaration);
                            loadDeclarationDetails(declaration.id);
                          }}
                          className="text-mbit-blue hover:text-blue-600 text-sm mr-2"
                        >
                          Részletek
                        </button>
                        {declaration.allapot === 'NYITOTT' && (
                          <button
                            onClick={() => handleOpenItemModal(declaration)}
                            className="text-green-600 hover:text-green-800 text-sm mr-2"
                          >
                            Tétel hozzáadása
                          </button>
                        )}
                        {declaration.allapot === 'NYITOTT' && (
                          <button
                            onClick={() => handleMarkReady(declaration.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm mr-2"
                          >
                            Küldésre kész
                          </button>
                        )}
                        {declaration.allapot === 'KULDESRE_KESZ' && (
                          <button
                            onClick={() => handleMarkSent(declaration.id)}
                            className="text-purple-600 hover:text-purple-800 text-sm mr-2"
                          >
                            Elküldött
                          </button>
                        )}
                        {(declaration.allapot === 'KULDESRE_KESZ' || declaration.allapot === 'KULDOOTT') && (
                          <>
                            <button
                              onClick={() => handleExport(declaration.id, 'nav')}
                              className="text-orange-600 hover:text-orange-800 text-sm mr-2"
                            >
                              NAV export
                            </button>
                            <button
                              onClick={() => handleExport(declaration.id, 'xml')}
                              className="text-orange-600 hover:text-orange-800 text-sm"
                            >
                              XML export
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Új bejelentés modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Új INTRASTAT bejelentés" size="md">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Év <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.ev}
                  onChange={(e) => setFormData({ ...formData, ev: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="2000"
                  max="2100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hónap <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.honap}
                  onChange={(e) => setFormData({ ...formData, honap: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m}. hónap</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Megjegyzések</label>
              <textarea
                value={formData.megjegyzesek}
                onChange={(e) => setFormData({ ...formData, megjegyzesek: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600"
              >
                Létrehozás
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Tétel hozzáadása/szerkesztése modal */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title={selectedItem ? 'Tétel szerkesztése' : 'Új tétel hozzáadása'}
        size="lg"
      >
        <form onSubmit={handleSubmitItem}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Termék</label>
              <select
                value={itemFormData.itemId}
                onChange={(e) => setItemFormData({ ...itemFormData, itemId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Válasszon terméket...</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.nev} ({item.azonosito})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Irány <span className="text-red-500">*</span>
                </label>
                <select
                  value={itemFormData.irany}
                  onChange={(e) => setItemFormData({ ...itemFormData, irany: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {IRANYOK.map(i => (
                    <option key={i.kod} value={i.kod}>{i.nev}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner országkód <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={itemFormData.partnerOrszagKod}
                  onChange={(e) => setItemFormData({ ...itemFormData, partnerOrszagKod: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="DE, FR, IT..."
                  maxLength={2}
                  required
                />
                <div className="text-xs text-gray-500 mt-1">ISO 3166-1 alpha-2 formátum</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Szállítási mód <span className="text-red-500">*</span>
              </label>
              <select
                value={itemFormData.szallitasiMod}
                onChange={(e) => setItemFormData({ ...itemFormData, szallitasiMod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {SZALLITASI_MODOK.map(m => (
                  <option key={m.kod} value={m.kod}>{m.nev}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statisztikai érték (HUF) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={itemFormData.statisztikaiErtek}
                  onChange={(e) => setItemFormData({ ...itemFormData, statisztikaiErtek: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nettó súly (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={itemFormData.nettoSuly}
                  onChange={(e) => setItemFormData({ ...itemFormData, nettoSuly: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kiegészítő egység</label>
                <input
                  type="text"
                  value={itemFormData.kiegeszitoEgység}
                  onChange={(e) => setItemFormData({ ...itemFormData, kiegeszitoEgység: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="pl. db, m2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kiegészítő mennyiség</label>
                <input
                  type="number"
                  step="0.01"
                  value={itemFormData.kiegeszitoMennyiseg}
                  onChange={(e) => setItemFormData({ ...itemFormData, kiegeszitoMennyiseg: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Termékkód (CN8)</label>
              <input
                type="text"
                value={itemFormData.termekkod}
                onChange={(e) => setItemFormData({ ...itemFormData, termekkod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="pl. 12345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Megjegyzések</label>
              <textarea
                value={itemFormData.megjegyzesek}
                onChange={(e) => setItemFormData({ ...itemFormData, megjegyzesek: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600"
              >
                {selectedItem ? 'Mentés' : 'Hozzáadás'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Részletek modal */}
      <Modal
        isOpen={selectedDeclaration !== null && !isModalOpen && !isItemModalOpen}
        onClose={() => setSelectedDeclaration(null)}
        title={selectedDeclaration ? `INTRASTAT bejelentés: ${selectedDeclaration.ev}/${String(selectedDeclaration.honap).padStart(2, '0')}` : 'Részletek'}
        size="xl"
      >
        {selectedDeclaration && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Állapot</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAllapotBadge(selectedDeclaration.allapot).szin}`}>
                    {getAllapotBadge(selectedDeclaration.allapot).nev}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Tételek száma</div>
                <div className="font-medium">{selectedDeclaration.items?.length || 0}</div>
              </div>
            </div>

            {selectedDeclaration.megjegyzesek && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Megjegyzések</div>
                <div className="text-sm">{selectedDeclaration.megjegyzesek}</div>
              </div>
            )}

            {/* Tételek */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Tételek</h3>
                {selectedDeclaration.allapot === 'NYITOTT' && (
                  <button
                    onClick={() => handleOpenItemModal(selectedDeclaration)}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    + Tétel hozzáadása
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2 font-medium text-gray-700">Termék</th>
                      <th className="text-left p-2 font-medium text-gray-700">Irány</th>
                      <th className="text-left p-2 font-medium text-gray-700">Ország</th>
                      <th className="text-left p-2 font-medium text-gray-700">Szállítási mód</th>
                      <th className="text-right p-2 font-medium text-gray-700">Statisztikai érték</th>
                      <th className="text-right p-2 font-medium text-gray-700">Nettó súly</th>
                      <th className="text-left p-2 font-medium text-gray-700">Műveletek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedDeclaration.items && selectedDeclaration.items.length > 0 ? (
                      selectedDeclaration.items.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2">
                            {item.item ? (
                              <>
                                <div className="font-medium">{item.item.nev}</div>
                                <div className="text-xs text-gray-500">{item.item.azonosito}</div>
                              </>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="p-2 text-gray-600">
                            {IRANYOK.find(i => i.kod === item.irany)?.nev || item.irany}
                          </td>
                          <td className="p-2 text-gray-600">{item.partnerOrszagKod}</td>
                          <td className="p-2 text-gray-600">
                            {SZALLITASI_MODOK.find(m => m.kod === item.szallitasiMod)?.nev || item.szallitasiMod}
                          </td>
                          <td className="p-2 text-right">
                            {item.statisztikaiErtek.toLocaleString('hu-HU')} HUF
                          </td>
                          <td className="p-2 text-right">
                            {item.nettoSuly ? `${item.nettoSuly.toLocaleString('hu-HU')} kg` : '-'}
                          </td>
                          <td className="p-2">
                            {selectedDeclaration.allapot === 'NYITOTT' && (
                              <>
                                <button
                                  onClick={() => handleOpenItemModal(selectedDeclaration, item)}
                                  className="text-mbit-blue hover:text-blue-600 text-xs mr-2"
                                >
                                  Szerkesztés
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(selectedDeclaration.id, item.id)}
                                  className="text-red-600 hover:text-red-800 text-xs"
                                >
                                  Törlés
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-gray-500">
                          Nincsenek tételek
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

