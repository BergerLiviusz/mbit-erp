import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { apiFetch } from '../lib/api';

interface Quote {
  id: string;
  azonosito: string;
  ervenyessegDatum: string;
  osszeg: number;
  afa: number;
  vegosszeg: number;
  allapot: string;
  megjegyzesek?: string | null;
  account: {
    id: string;
    nev: string;
    azonosito: string;
  };
  opportunity: {
    id: string;
    nev: string;
  } | null;
  items?: Array<{
    id: string;
    itemId: string;
    mennyiseg: number;
    egysegAr: number;
    kedvezmeny: number;
    item: {
      id: string;
      nev: string;
      azonosito: string;
      eladasiAr: number;
    };
  }>;
  createdAt: string;
}

interface Account {
  id: string;
  nev: string;
  azonosito: string;
}

interface Opportunity {
  id: string;
  nev: string;
  szakasz: string;
}

interface Item {
  id: string;
  nev: string;
  azonosito: string;
  eladasiAr: number;
}

interface QuoteItem {
  itemId: string;
  mennyiseg: string;
  egysegAr: string;
  kedvezmeny: string;
}

const ALLAPOTOK = [
  { kod: 'tervezet', nev: 'Tervezet', szin: 'bg-gray-100 text-gray-800' },
  { kod: 'elkuldve', nev: 'Elküldve', szin: 'bg-blue-100 text-blue-800' },
  { kod: 'jovahagyasra_var', nev: 'Jóváhagyásra vár', szin: 'bg-yellow-100 text-yellow-800' },
  { kod: 'jovahagyott', nev: 'Jóváhagyott', szin: 'bg-green-100 text-green-800' },
  { kod: 'elutasitott', nev: 'Elutasított', szin: 'bg-red-100 text-red-800' },
  { kod: 'lejart', nev: 'Lejárt', szin: 'bg-gray-100 text-gray-600' },
];

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAllapot, setSelectedAllapot] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formData, setFormData] = useState({
    accountId: '',
    opportunityId: '',
    ervenyessegDatum: '',
    allapot: 'tervezet',
    megjegyzesek: '',
    items: [{ itemId: '', mennyiseg: '1', egysegAr: '0', kedvezmeny: '0' }] as QuoteItem[],
  });

  useEffect(() => {
    loadQuotes();
  }, [selectedAllapot]);

  useEffect(() => {
    if (isModalOpen) {
      loadAccounts();
      loadOpportunities();
      loadItems();
    }
  }, [isModalOpen]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const url = selectedAllapot
        ? `/crm/quotes?allapot=${selectedAllapot}&skip=0&take=100`
        : `/crm/quotes?skip=0&take=100`;

      const response = await apiFetch(url);

      if (response.ok) {
        const data = await response.json();
        setQuotes(data.data || []);
      }
    } catch (error) {
      console.error('Hiba az árajánlatok betöltésekor:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAccounts = async () => {
    try {
      const response = await apiFetch('/crm/accounts?skip=0&take=100');

      if (response.ok) {
        const data = await response.json();
        // Handle both possible response formats
        const accountsList = data.items || data.data || [];
        console.log('Loaded accounts:', accountsList.length);
        setAccounts(accountsList);
        if (accountsList.length === 0) {
          console.warn('No accounts found. Response data:', data);
        }
      } else {
        console.error('Failed to load accounts:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Hiba az ügyfelek betöltésekor:', error);
    }
  };

  const loadOpportunities = async () => {
    try {
      const response = await apiFetch('/crm/opportunities?skip=0&take=100');

      if (response.ok) {
        const data = await response.json();
        setOpportunities(data.data || []);
      }
    } catch (error) {
      console.error('Hiba a lehetőségek betöltésekor:', error);
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

  const handleOpenModal = async (quote?: Quote) => {
    setError('');
    setSuccess('');
    if (quote) {
      setEditingQuoteId(quote.id);
      // Load full quote details including items
      try {
        const response = await apiFetch(`/crm/quotes/${quote.id}`);
        if (response.ok) {
          const fullQuote = await response.json();
          setFormData({
            accountId: fullQuote.account.id,
            opportunityId: fullQuote.opportunity?.id || '',
            ervenyessegDatum: new Date(fullQuote.ervenyessegDatum).toISOString().split('T')[0],
            allapot: fullQuote.allapot,
            megjegyzesek: fullQuote.megjegyzesek || '',
            items: fullQuote.items && fullQuote.items.length > 0
              ? fullQuote.items.map((item: any) => ({
                  itemId: item.itemId,
                  mennyiseg: item.mennyiseg.toString(),
                  egysegAr: item.egysegAr.toString(),
                  kedvezmeny: item.kedvezmeny.toString(),
                }))
              : [{ itemId: '', mennyiseg: '1', egysegAr: '0', kedvezmeny: '0' }],
          });
        } else {
          setError('Hiba az árajánlat betöltésekor');
        }
      } catch (error) {
        console.error('Error loading quote details:', error);
        setError('Hiba az árajánlat betöltésekor');
      }
    } else {
      setEditingQuoteId(null);
      setFormData({
        accountId: '',
        opportunityId: '',
        ervenyessegDatum: '',
        allapot: 'tervezet',
        megjegyzesek: '',
        items: [{ itemId: '', mennyiseg: '1', egysegAr: '0', kedvezmeny: '0' }],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuoteId(null);
    setFormData({
      accountId: '',
      opportunityId: '',
      ervenyessegDatum: '',
      allapot: 'tervezet',
      megjegyzesek: '',
      items: [{ itemId: '', mennyiseg: '1', egysegAr: '0', kedvezmeny: '0' }],
    });
    setError('');
    setSuccess('');
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemId: '', mennyiseg: '1', egysegAr: '0', kedvezmeny: '0' }],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleItemChange = (index: number, field: keyof QuoteItem, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'itemId') {
      const selectedItem = items.find(item => item.id === value);
      if (selectedItem && selectedItem.eladasiAr) {
        newItems[index].egysegAr = selectedItem.eladasiAr.toString();
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.accountId) {
      setError('Az ügyfél kiválasztása kötelező');
      return;
    }

    if (!formData.ervenyessegDatum) {
      setError('Az érvényesség dátuma kötelező');
      return;
    }

    const ervenyessegDate = new Date(formData.ervenyessegDatum);
    if (isNaN(ervenyessegDate.getTime())) {
      setError('Érvénytelen dátum formátum');
      return;
    }

    if (formData.items.length === 0) {
      setError('Legalább egy tétel megadása kötelező');
      return;
    }

    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      
      if (!item.itemId) {
        setError(`${i + 1}. tétel: Termék kiválasztása kötelező`);
        return;
      }

      const mennyiseg = parseFloat(item.mennyiseg);
      if (isNaN(mennyiseg) || mennyiseg <= 0) {
        setError(`${i + 1}. tétel: A mennyiség pozitív szám kell legyen`);
        return;
      }

      const egysegAr = parseFloat(item.egysegAr);
      if (isNaN(egysegAr) || egysegAr < 0) {
        setError(`${i + 1}. tétel: Az egységár nem lehet negatív`);
        return;
      }

      const kedvezmeny = parseFloat(item.kedvezmeny);
      if (isNaN(kedvezmeny) || kedvezmeny < 0 || kedvezmeny > 100) {
        setError(`${i + 1}. tétel: A kedvezmény 0 és 100 között kell legyen`);
        return;
      }
    }

    setSaving(true);

    try {
      const url = editingQuoteId 
        ? `/crm/quotes/${editingQuoteId}`
        : '/crm/quotes';
      const method = editingQuoteId ? 'PUT' : 'POST';

      if (editingQuoteId) {
        // For PUT requests, only send updatable fields
        const updateData = {
          ervenyessegDatum: ervenyessegDate.toISOString(),
          allapot: formData.allapot,
          megjegyzesek: formData.megjegyzesek || undefined,
        };

        const response = await apiFetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
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
            throw new Error(errorData.message || 'Hiba az árajánlat frissítésekor');
          }
        }

        setSuccess('Árajánlat sikeresen frissítve!');
      } else {
        // For POST requests, send full quote data
        const quoteData = {
          accountId: formData.accountId,
          opportunityId: formData.opportunityId || undefined,
          ervenyessegDatum: ervenyessegDate.toISOString(),
          megjegyzesek: formData.megjegyzesek || undefined,
          items: formData.items.map(item => ({
            itemId: item.itemId,
            mennyiseg: parseFloat(item.mennyiseg),
            egysegAr: parseFloat(item.egysegAr),
            kedvezmeny: parseFloat(item.kedvezmeny),
          })),
        };

        const response = await apiFetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quoteData),
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
            throw new Error(errorData.message || 'Hiba az árajánlat létrehozásakor');
          }
        }

        setSuccess('Árajánlat sikeresen létrehozva!');
      }

      setTimeout(() => {
        handleCloseModal();
        loadQuotes();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU');
  };

  const getAllapotBadge = (allapot: string) => {
    const all = ALLAPOTOK.find(a => a.kod === allapot);
    if (!all) return null;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${all.szin}`}>
        {all.nev}
      </span>
    );
  };

  const calculateTotalValue = () => {
    return quotes
      .filter(q => q.allapot === 'jovahagyott' || q.allapot === 'elkuldve')
      .reduce((sum, q) => sum + q.vegosszeg, 0);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Árajánlatok</h1>
        <button 
          onClick={handleOpenModal}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új árajánlat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Összes árajánlat</div>
          <div className="text-2xl font-bold">{quotes.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Összes érték</div>
          <div className="text-2xl font-bold text-mbit-blue">
            {formatCurrency(quotes.reduce((sum, q) => sum + q.vegosszeg, 0))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Aktív érték</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(calculateTotalValue())}
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedAllapot('')}
          className={`px-4 py-2 rounded ${
            selectedAllapot === ''
              ? 'bg-mbit-blue text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Összes
        </button>
        {ALLAPOTOK.map(all => (
          <button
            key={all.kod}
            onClick={() => setSelectedAllapot(all.kod)}
            className={`px-4 py-2 rounded ${
              selectedAllapot === all.kod
                ? 'bg-mbit-blue text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {all.nev}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : quotes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs árajánlat</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Azonosító</th>
                <th className="text-left p-4 font-medium text-gray-700">Ügyfél</th>
                <th className="text-left p-4 font-medium text-gray-700">Lehetőség</th>
                <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                <th className="text-right p-4 font-medium text-gray-700">Összeg</th>
                <th className="text-right p-4 font-medium text-gray-700">ÁFA</th>
                <th className="text-right p-4 font-medium text-gray-700">Végösszeg</th>
                <th className="text-left p-4 font-medium text-gray-700">Érvényes</th>
                <th className="text-left p-4 font-medium text-gray-700">Létrehozva</th>
                <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quotes.map(quote => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-mbit-blue">{quote.azonosito}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{quote.account.nev}</div>
                    <div className="text-xs text-gray-500">{quote.account.azonosito}</div>
                  </td>
                  <td className="p-4 text-sm">
                    {quote.opportunity ? quote.opportunity.nev : '-'}
                  </td>
                  <td className="p-4">{getAllapotBadge(quote.allapot)}</td>
                  <td className="p-4 text-right">{formatCurrency(quote.osszeg)}</td>
                  <td className="p-4 text-right text-gray-600">{formatCurrency(quote.afa)}</td>
                  <td className="p-4 text-right font-medium">
                    {formatCurrency(quote.vegosszeg)}
                  </td>
                  <td className="p-4 text-sm">{formatDate(quote.ervenyessegDatum)}</td>
                  <td className="p-4 text-sm text-gray-500">{formatDate(quote.createdAt)}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenModal(quote)}
                      className="text-mbit-blue hover:text-blue-600 text-sm font-medium"
                    >
                      Szerkesztés
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingQuoteId ? "Árajánlat szerkesztése" : "Új árajánlat"} size="xl">
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ügyfél <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!!editingQuoteId}
                >
                  <option value="">-- Válasszon --</option>
                  {accounts.length === 0 ? (
                    <option value="" disabled>Nincs elérhető ügyfél</option>
                  ) : (
                    accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.nev} ({a.azonosito})</option>
                    ))
                  )}
                </select>
                {editingQuoteId && (
                  <p className="mt-1 text-xs text-gray-500">Az ügyfél nem módosítható szerkesztéskor</p>
                )}
                {accounts.length === 0 && !editingQuoteId && (
                  <p className="mt-1 text-xs text-yellow-600">Nincs elérhető ügyfél. Kérjük, először hozzon létre ügyfelet.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lehetőség (opcionális)
                </label>
                <select
                  value={formData.opportunityId}
                  onChange={(e) => setFormData({ ...formData, opportunityId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!!editingQuoteId}
                >
                  <option value="">-- Válasszon --</option>
                  {opportunities.map(o => (
                    <option key={o.id} value={o.id}>{o.nev}</option>
                  ))}
                </select>
                {editingQuoteId && (
                  <p className="mt-1 text-xs text-gray-500">A lehetőség nem módosítható szerkesztéskor</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Érvényesség dátuma <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.ervenyessegDatum}
                  onChange={(e) => setFormData({ ...formData, ervenyessegDatum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Állapot <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.allapot}
                  onChange={(e) => setFormData({ ...formData, allapot: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {ALLAPOTOK.map(all => (
                    <option key={all.kod} value={all.kod}>{all.nev}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Megjegyzések / Fizetési feltételek
              </label>
              <textarea
                value={formData.megjegyzesek}
                onChange={(e) => setFormData({ ...formData, megjegyzesek: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pl.: Fizetési határidő: 30 nap"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tételek <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  disabled={!!editingQuoteId}
                >
                  + Tétel hozzáadása
                </button>
              </div>
              {editingQuoteId && (
                <p className="mb-2 text-xs text-gray-500">A tételek nem módosíthatók szerkesztéskor</p>
              )}

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {formData.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded p-3 bg-gray-50">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Termék
                          </label>
                          <select
                            value={item.itemId}
                            onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                            disabled={!!editingQuoteId}
                          >
                            <option value="">-- Válasszon --</option>
                            {items.map(i => (
                              <option key={i.id} value={i.id}>{i.nev} ({i.eladasiAr} Ft)</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Mennyiség
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.mennyiseg}
                            onChange={(e) => handleItemChange(index, 'mennyiseg', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                            disabled={!!editingQuoteId}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Egységár (HUF)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={item.egysegAr}
                            onChange={(e) => handleItemChange(index, 'egysegAr', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                            disabled={!!editingQuoteId}
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
                            onChange={(e) => handleItemChange(index, 'kedvezmeny', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                            disabled={!!editingQuoteId}
                          />
                        </div>
                      </div>

                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="mt-5 text-red-500 hover:text-red-700"
                          title="Tétel törlése"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Mégse
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Mentés...' : (editingQuoteId ? 'Frissítés' : 'Mentés')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
