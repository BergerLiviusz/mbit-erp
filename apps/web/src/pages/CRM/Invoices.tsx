import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import Modal from '../../components/Modal';

interface Invoice {
  id: string;
  accountId: string;
  orderId?: string | null;
  szamlaSzam: string;
  kiallitasDatum: string;
  teljesitesDatum: string;
  fizetesiHataridoDatum: string;
  fizetesiDatum?: string | null;
  osszeg: number;
  afa: number;
  vegosszeg: number;
  tipus: string;
  allapot: string;
  fizetesiMod?: string | null;
  szamlaNyomtatva: boolean;
  navOnlineSzamlaId?: string | null;
  megjegyzesek?: string | null;
  createdAt: string;
  updatedAt: string;
  account?: {
    id: string;
    nev: string;
    azonosito: string;
  };
  order?: {
    id: string;
    azonosito: string;
  };
  items?: InvoiceItem[];
  payments?: InvoicePayment[];
  _count?: {
    items: number;
    payments: number;
  };
}

interface InvoiceItem {
  id: string;
  invoiceId: string;
  itemId?: string | null;
  nev: string;
  azonosito?: string | null;
  mennyiseg: number;
  egyseg: string;
  egysegAr: number;
  kedvezmeny: number;
  afaKulcs: number;
  nettoOsszeg: number;
  afaOsszeg: number;
  bruttoOsszeg: number;
  megjegyzes?: string | null;
  sorrend: number;
}

interface InvoicePayment {
  id: string;
  invoiceId: string;
  fizetesiDatum: string;
  osszeg: number;
  fizetesiMod: string;
  tranzakcioSzam?: string | null;
  megjegyzesek?: string | null;
  createdAt: string;
}

interface Account {
  id: string;
  nev: string;
  azonosito: string;
}

interface Order {
  id: string;
  azonosito: string;
}

interface Item {
  id: string;
  nev: string;
  azonosito: string;
  egyseg: string;
  eladasiAr: number;
  afaKulcs: number;
}

const TIPUSOK = [
  { kod: 'NORMAL', nev: 'Normál számla' },
  { kod: 'STORNO', nev: 'Stornó számla' },
  { kod: 'ELOSZAMLA', nev: 'Előszámla' },
  { kod: 'SZALLITASI', nev: 'Szállítási számla' },
];

const ALLAPOTOK = [
  { kod: 'VAZLAT', nev: 'Vázlat', szin: 'bg-gray-100 text-gray-800' },
  { kod: 'KIALLITVA', nev: 'Kiállítva', szin: 'bg-blue-100 text-blue-800' },
  { kod: 'ELKULDVE', nev: 'Elküldve', szin: 'bg-purple-100 text-purple-800' },
  { kod: 'KIFIZETVE', nev: 'Kifizetve', szin: 'bg-green-100 text-green-800' },
  { kod: 'STORNO', nev: 'Stornózva', szin: 'bg-red-100 text-red-800' },
  { kod: 'LEJART', nev: 'Lejárt', szin: 'bg-yellow-100 text-yellow-800' },
];

const FIZETESI_MODOK = [
  { kod: 'BANK', nev: 'Banki átutalás' },
  { kod: 'KESZPENZ', nev: 'Készpénz' },
  { kod: 'KARTYA', nev: 'Bankkártya' },
  { kod: 'ATUTALAS', nev: 'Átutalás' },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [formData, setFormData] = useState({
    accountId: '',
    orderId: '',
    kiallitasDatum: new Date().toISOString().split('T')[0],
    teljesitesDatum: new Date().toISOString().split('T')[0],
    fizetesiHataridoDatum: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tipus: 'NORMAL',
    fizetesiMod: '',
    megjegyzesek: '',
    items: [] as Array<{
      itemId: string;
      nev: string;
      azonosito: string;
      mennyiseg: string;
      egyseg: string;
      egysegAr: string;
      kedvezmeny: string;
      afaKulcs: string;
      megjegyzes: string;
    }>,
  });

  const [paymentFormData, setPaymentFormData] = useState({
    fizetesiDatum: new Date().toISOString().split('T')[0],
    osszeg: '',
    fizetesiMod: 'BANK',
    tranzakcioSzam: '',
    megjegyzesek: '',
  });

  const [filters, setFilters] = useState({
    accountId: '',
    orderId: '',
    allapot: '',
    tipus: '',
    kiallitasDatumFrom: '',
    kiallitasDatumTo: '',
  });

  useEffect(() => {
    loadAccounts();
    loadItems();
    loadInvoices();
  }, [filters]);

  const loadAccounts = async () => {
    try {
      const response = await apiFetch('/crm/accounts?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.items || []);
      }
    } catch (err) {
      console.error('Hiba a ügyfelek betöltésekor:', err);
    }
  };

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

  const loadOrders = async (accountId?: string) => {
    try {
      const queryParams = accountId ? `?accountId=${accountId}` : '';
      const response = await apiFetch(`/crm/orders${queryParams}&skip=0&take=100`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.items || []);
      }
    } catch (err) {
      console.error('Hiba a rendelések betöltésekor:', err);
    }
  };

  const loadInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.accountId) queryParams.append('accountId', filters.accountId);
      if (filters.orderId) queryParams.append('orderId', filters.orderId);
      if (filters.allapot) queryParams.append('allapot', filters.allapot);
      if (filters.tipus) queryParams.append('tipus', filters.tipus);
      if (filters.kiallitasDatumFrom) queryParams.append('kiallitasDatumFrom', filters.kiallitasDatumFrom);
      if (filters.kiallitasDatumTo) queryParams.append('kiallitasDatumTo', filters.kiallitasDatumTo);

      const response = await apiFetch(`/crm/invoices?skip=0&take=100&${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.items || []);
      } else {
        throw new Error('Hiba a számlák betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const loadInvoiceDetails = async (id: string) => {
    try {
      const response = await apiFetch(`/crm/invoices/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedInvoice(data);
        setIsDetailModalOpen(true);
      }
    } catch (err: any) {
      setError(err.message || 'Hiba a részletek betöltésekor');
    }
  };

  const handleOpenModal = (invoice?: Invoice, orderId?: string) => {
    if (invoice) {
      setEditingId(invoice.id);
      // Load invoice details for editing
      loadInvoiceDetails(invoice.id);
      return;
    }

    setEditingId(null);
    setFormData({
      accountId: '',
      orderId: orderId || '',
      kiallitasDatum: new Date().toISOString().split('T')[0],
      teljesitesDatum: new Date().toISOString().split('T')[0],
      fizetesiHataridoDatum: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tipus: 'NORMAL',
      fizetesiMod: '',
      megjegyzesek: '',
      items: [],
    });
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          itemId: '',
          nev: '',
          azonosito: '',
          mennyiseg: '1',
          egyseg: 'db',
          egysegAr: '0',
          kedvezmeny: '0',
          afaKulcs: '27',
          megjegyzes: '',
        },
      ],
    });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // If itemId changed, load item data
    if (field === 'itemId' && value) {
      const item = items.find(i => i.id === value);
      if (item) {
        newItems[index] = {
          ...newItems[index],
          nev: item.nev,
          azonosito: item.azonosito,
          egyseg: item.egyseg,
          egysegAr: item.eladasiAr.toString(),
          afaKulcs: item.afaKulcs.toString(),
        };
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.accountId) {
      setError('Az ügyfél kiválasztása kötelező');
      return;
    }

    if (formData.items.length === 0) {
      setError('Legalább egy tétel szükséges');
      return;
    }

    try {
      const url = editingId
        ? `/crm/invoices/${editingId}`
        : '/crm/invoices';
      const method = editingId ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: formData.accountId,
          orderId: formData.orderId || undefined,
          kiallitasDatum: formData.kiallitasDatum,
          teljesitesDatum: formData.teljesitesDatum,
          fizetesiHataridoDatum: formData.fizetesiHataridoDatum,
          tipus: formData.tipus,
          fizetesiMod: formData.fizetesiMod || undefined,
          megjegyzesek: formData.megjegyzesek || undefined,
          items: formData.items.map(item => ({
            itemId: item.itemId || undefined,
            nev: item.nev,
            azonosito: item.azonosito || undefined,
            mennyiseg: parseFloat(item.mennyiseg),
            egyseg: item.egyseg,
            egysegAr: parseFloat(item.egysegAr),
            kedvezmeny: parseFloat(item.kedvezmeny),
            afaKulcs: parseFloat(item.afaKulcs),
            megjegyzes: item.megjegyzes || undefined,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a mentés során');
      }

      setSuccess(editingId ? 'Számla sikeresen frissítve!' : 'Számla sikeresen létrehozva!');
      setTimeout(() => {
        setIsModalOpen(false);
        loadInvoices();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    }
  };

  // Note: handleCreateFromOrder is available for future use when order-to-invoice conversion is needed
  // Currently not used in the UI but kept for API compatibility

  const handleMarkAsIssued = async (id: string) => {
    try {
      const response = await apiFetch(`/crm/invoices/${id}/mark-issued`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Hiba az állapot módosításakor');
      }

      setSuccess('Számla kiállítva!');
      loadInvoices();
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleMarkAsSent = async (id: string) => {
    try {
      const response = await apiFetch(`/crm/invoices/${id}/mark-sent`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Hiba az állapot módosításakor');
      }

      setSuccess('Számla elküldöttnek jelölve!');
      loadInvoices();
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleOpenPaymentModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    const totalPaid = invoice.payments?.reduce((sum, p) => sum + p.osszeg, 0) || 0;
    const remaining = invoice.vegosszeg - totalPaid;
    setPaymentFormData({
      fizetesiDatum: new Date().toISOString().split('T')[0],
      osszeg: remaining > 0 ? remaining.toString() : '',
      fizetesiMod: 'BANK',
      tranzakcioSzam: '',
      megjegyzesek: '',
    });
    setIsPaymentModalOpen(true);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedInvoice) {
      setError('Nincs kiválasztott számla');
      return;
    }

    if (!paymentFormData.osszeg || parseFloat(paymentFormData.osszeg) <= 0) {
      setError('Érvényes fizetési összeg szükséges');
      return;
    }

    try {
      const response = await apiFetch(`/crm/invoices/${selectedInvoice.id}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fizetesiDatum: paymentFormData.fizetesiDatum,
          osszeg: parseFloat(paymentFormData.osszeg),
          fizetesiMod: paymentFormData.fizetesiMod,
          tranzakcioSzam: paymentFormData.tranzakcioSzam || undefined,
          megjegyzesek: paymentFormData.megjegyzesek || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a fizetés rögzítésekor');
      }

      setSuccess('Fizetés sikeresen rögzítve!');
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        loadInvoices();
        if (selectedInvoice) {
          loadInvoiceDetails(selectedInvoice.id);
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleStorno = async (id: string) => {
    const reason = prompt('Storno indoklása:');
    if (reason === null) return;

    try {
      const response = await apiFetch(`/crm/invoices/${id}/storno`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Hiba a stornózás során');
      }

      setSuccess('Számla stornózva!');
      loadInvoices();
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleDelete = async (id: string, szamlaSzam: string) => {
    if (!confirm(`Biztosan törölni szeretné a "${szamlaSzam}" számlát?`)) {
      return;
    }

    try {
      const response = await apiFetch(`/crm/invoices/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hiba a törlés során');
      }

      setSuccess('Számla sikeresen törölve!');
      loadInvoices();
    } catch (err: any) {
      setError(err.message || 'Hiba történt a törlés során');
    }
  };

  const getAllapotBadge = (allapot: string) => {
    return ALLAPOTOK.find(a => a.kod === allapot) || ALLAPOTOK[0];
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Számlák</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új számla
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Ügyfél</label>
            <select
              value={filters.accountId}
              onChange={(e) => {
                setFilters({ ...filters, accountId: e.target.value });
                if (e.target.value) {
                  loadOrders(e.target.value);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nev} ({a.azonosito})
                </option>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Típus</label>
            <select
              value={filters.tipus}
              onChange={(e) => setFilters({ ...filters, tipus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {TIPUSOK.map(t => (
                <option key={t.kod} value={t.kod}>{t.nev}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Számlák lista */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs számla</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Számlaszám</th>
                  <th className="text-left p-4 font-medium text-gray-700">Ügyfél</th>
                  <th className="text-left p-4 font-medium text-gray-700">Kiállítás</th>
                  <th className="text-left p-4 font-medium text-gray-700">Végösszeg</th>
                  <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                  <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map((invoice) => {
                  const allapotBadge = getAllapotBadge(invoice.allapot);
                  const totalPaid = invoice.payments?.reduce((sum, p) => sum + p.osszeg, 0) || 0;
                  
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{invoice.szamlaSzam}</td>
                      <td className="p-4">
                        {invoice.account
                          ? `${invoice.account.nev} (${invoice.account.azonosito})`
                          : '-'}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(invoice.kiallitasDatum).toLocaleDateString('hu-HU')}
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {invoice.vegosszeg.toLocaleString('hu-HU')} HUF
                        {totalPaid > 0 && (
                          <div className="text-xs text-gray-500">
                            Fizetve: {totalPaid.toLocaleString('hu-HU')} HUF
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${allapotBadge.szin}`}>
                          {allapotBadge.nev}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => loadInvoiceDetails(invoice.id)}
                          className="text-mbit-blue hover:text-blue-600 text-sm mr-2"
                        >
                          Részletek
                        </button>
                        {invoice.allapot === 'VAZLAT' && (
                          <>
                            <button
                              onClick={() => handleOpenModal(invoice)}
                              className="text-mbit-blue hover:text-blue-600 text-sm mr-2"
                            >
                              Szerkesztés
                            </button>
                            <button
                              onClick={() => handleMarkAsIssued(invoice.id)}
                              className="text-green-600 hover:text-green-800 text-sm mr-2"
                            >
                              Kiállítás
                            </button>
                          </>
                        )}
                        {invoice.allapot === 'KIALLITVA' && (
                          <button
                            onClick={() => handleMarkAsSent(invoice.id)}
                            className="text-purple-600 hover:text-purple-800 text-sm mr-2"
                          >
                            Elküldés
                          </button>
                        )}
                        {invoice.allapot !== 'KIFIZETVE' && invoice.allapot !== 'STORNO' && (
                          <button
                            onClick={() => handleOpenPaymentModal(invoice)}
                            className="text-green-600 hover:text-green-800 text-sm mr-2"
                          >
                            Fizetés
                          </button>
                        )}
                        {invoice.allapot !== 'STORNO' && invoice.allapot !== 'KIFIZETVE' && (
                          <button
                            onClick={() => handleStorno(invoice.id)}
                            className="text-red-600 hover:text-red-800 text-sm mr-2"
                          >
                            Storno
                          </button>
                        )}
                        {invoice.allapot === 'VAZLAT' && (
                          <button
                            onClick={() => handleDelete(invoice.id, invoice.szamlaSzam)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Törlés
                          </button>
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

      {/* Új/Szerkesztés modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Számla szerkesztése' : 'Új számla'}
        size="xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ügyfél <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.accountId}
                  onChange={(e) => {
                    setFormData({ ...formData, accountId: e.target.value });
                    if (e.target.value) {
                      loadOrders(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Válasszon ügyfelet...</option>
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.nev} ({a.azonosito})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rendelés (opcionális)</label>
                <select
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Nincs rendelés</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>{o.azonosito}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kiállítás dátuma <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.kiallitasDatum}
                  onChange={(e) => setFormData({ ...formData, kiallitasDatum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teljesítés dátuma <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.teljesitesDatum}
                  onChange={(e) => setFormData({ ...formData, teljesitesDatum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fizetési határidő <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fizetesiHataridoDatum}
                  onChange={(e) => setFormData({ ...formData, fizetesiHataridoDatum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Típus <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.tipus}
                  onChange={(e) => setFormData({ ...formData, tipus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {TIPUSOK.map(t => (
                    <option key={t.kod} value={t.kod}>{t.nev}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fizetési mód</label>
                <select
                  value={formData.fizetesiMod}
                  onChange={(e) => setFormData({ ...formData, fizetesiMod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Válasszon...</option>
                  {FIZETESI_MODOK.map(f => (
                    <option key={f.kod} value={f.kod}>{f.nev}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tételek */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tételek <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-sm text-mbit-blue hover:text-blue-600"
                >
                  + Tétel hozzáadása
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {formData.items.map((item, index) => (
                  <div key={index} className="border rounded p-3 bg-gray-50">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-4">
                        <select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="">Válasszon terméket...</option>
                          {items.map(i => (
                            <option key={i.id} value={i.id}>
                              {i.nev} ({i.azonosito})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={item.nev}
                          onChange={(e) => handleItemChange(index, 'nev', e.target.value)}
                          placeholder="Név"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        <input
                          type="number"
                          step="0.01"
                          value={item.mennyiseg}
                          onChange={(e) => handleItemChange(index, 'mennyiseg', e.target.value)}
                          placeholder="Menny."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        <input
                          type="text"
                          value={item.egyseg}
                          onChange={(e) => handleItemChange(index, 'egyseg', e.target.value)}
                          placeholder="Egység"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        <input
                          type="number"
                          step="0.01"
                          value={item.egysegAr}
                          onChange={(e) => handleItemChange(index, 'egysegAr', e.target.value)}
                          placeholder="Egységár"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        <input
                          type="number"
                          step="0.01"
                          value={item.kedvezmeny}
                          onChange={(e) => handleItemChange(index, 'kedvezmeny', e.target.value)}
                          placeholder="Kedv. %"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div className="col-span-1">
                        <input
                          type="number"
                          step="0.01"
                          value={item.afaKulcs}
                          onChange={(e) => handleItemChange(index, 'afaKulcs', e.target.value)}
                          placeholder="ÁFA %"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="w-full px-2 py-1 text-sm text-red-600 hover:text-red-800"
                        >
                          Törlés
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                {editingId ? 'Mentés' : 'Létrehozás'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Payment modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={selectedInvoice ? `Fizetés rögzítése: ${selectedInvoice.szamlaSzam}` : 'Fizetés rögzítése'}
        size="md"
      >
        <form onSubmit={handleSubmitPayment}>
          <div className="space-y-4">
            {selectedInvoice && (
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-sm">
                  <div>Végösszeg: <strong>{selectedInvoice.vegosszeg.toLocaleString('hu-HU')} HUF</strong></div>
                  <div>Fizetve: <strong>{(selectedInvoice.payments?.reduce((sum, p) => sum + p.osszeg, 0) || 0).toLocaleString('hu-HU')} HUF</strong></div>
                  <div>Fennmaradó: <strong>{(selectedInvoice.vegosszeg - (selectedInvoice.payments?.reduce((sum, p) => sum + p.osszeg, 0) || 0)).toLocaleString('hu-HU')} HUF</strong></div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fizetés dátuma <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={paymentFormData.fizetesiDatum}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, fizetesiDatum: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Összeg (HUF) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentFormData.osszeg}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, osszeg: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fizetési mód <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentFormData.fizetesiMod}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, fizetesiMod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {FIZETESI_MODOK.map(f => (
                    <option key={f.kod} value={f.kod}>{f.nev}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tranzakció szám</label>
              <input
                type="text"
                value={paymentFormData.tranzakcioSzam}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, tranzakcioSzam: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Megjegyzések</label>
              <textarea
                value={paymentFormData.megjegyzesek}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, megjegyzesek: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Rögzítés
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Detail modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedInvoice(null);
        }}
        title={selectedInvoice ? `Számla részletek: ${selectedInvoice.szamlaSzam}` : 'Részletek'}
        size="xl"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Ügyfél</div>
                <div className="font-medium">
                  {selectedInvoice.account?.nev} ({selectedInvoice.account?.azonosito})
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Rendelés</div>
                <div className="font-medium">
                  {selectedInvoice.order?.azonosito || '-'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Kiállítás dátuma</div>
                <div className="font-medium">
                  {new Date(selectedInvoice.kiallitasDatum).toLocaleDateString('hu-HU')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Fizetési határidő</div>
                <div className="font-medium">
                  {new Date(selectedInvoice.fizetesiHataridoDatum).toLocaleDateString('hu-HU')}
                </div>
              </div>
            </div>

            {/* Tételek */}
            {selectedInvoice.items && selectedInvoice.items.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Tételek</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 font-medium text-gray-700">Név</th>
                        <th className="text-right p-2 font-medium text-gray-700">Mennyiség</th>
                        <th className="text-right p-2 font-medium text-gray-700">Egységár</th>
                        <th className="text-right p-2 font-medium text-gray-700">Kedvezmény</th>
                        <th className="text-right p-2 font-medium text-gray-700">Nettó</th>
                        <th className="text-right p-2 font-medium text-gray-700">ÁFA</th>
                        <th className="text-right p-2 font-medium text-gray-700">Bruttó</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2">{item.nev}</td>
                          <td className="p-2 text-right">{item.mennyiseg} {item.egyseg}</td>
                          <td className="p-2 text-right">{item.egysegAr.toLocaleString('hu-HU')} HUF</td>
                          <td className="p-2 text-right">{item.kedvezmeny}%</td>
                          <td className="p-2 text-right">{item.nettoOsszeg.toLocaleString('hu-HU')} HUF</td>
                          <td className="p-2 text-right">{item.afaOsszeg.toLocaleString('hu-HU')} HUF</td>
                          <td className="p-2 text-right font-medium">{item.bruttoOsszeg.toLocaleString('hu-HU')} HUF</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={4} className="p-2 font-medium text-right">Összesen:</td>
                        <td className="p-2 text-right font-medium">{selectedInvoice.osszeg.toLocaleString('hu-HU')} HUF</td>
                        <td className="p-2 text-right font-medium">{selectedInvoice.afa.toLocaleString('hu-HU')} HUF</td>
                        <td className="p-2 text-right font-medium">{selectedInvoice.vegosszeg.toLocaleString('hu-HU')} HUF</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Fizetések */}
            {selectedInvoice.payments && selectedInvoice.payments.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Fizetések</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 font-medium text-gray-700">Dátum</th>
                        <th className="text-right p-2 font-medium text-gray-700">Összeg</th>
                        <th className="text-left p-2 font-medium text-gray-700">Mód</th>
                        <th className="text-left p-2 font-medium text-gray-700">Tranzakció</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedInvoice.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="p-2">{new Date(payment.fizetesiDatum).toLocaleDateString('hu-HU')}</td>
                          <td className="p-2 text-right font-medium">{payment.osszeg.toLocaleString('hu-HU')} HUF</td>
                          <td className="p-2">{FIZETESI_MODOK.find(f => f.kod === payment.fizetesiMod)?.nev || payment.fizetesiMod}</td>
                          <td className="p-2">{payment.tranzakcioSzam || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td className="p-2 font-medium">Összesen:</td>
                        <td className="p-2 text-right font-medium">
                          {selectedInvoice.payments.reduce((sum, p) => sum + p.osszeg, 0).toLocaleString('hu-HU')} HUF
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

