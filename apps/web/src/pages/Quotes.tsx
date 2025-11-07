import { useState, useEffect } from 'react';

interface Quote {
  id: string;
  azonosito: string;
  ervenyessegDatum: string;
  osszeg: number;
  afa: number;
  vegosszeg: number;
  allapot: string;
  account: {
    id: string;
    nev: string;
    azonosito: string;
  };
  opportunity: {
    id: string;
    nev: string;
  } | null;
  createdAt: string;
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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    loadQuotes();
  }, [selectedAllapot]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = selectedAllapot
        ? `${API_URL}/crm/quotes?allapot=${selectedAllapot}&skip=0&take=100`
        : `${API_URL}/crm/quotes?skip=0&take=100`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
        <button className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600">
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
              </tr>
            </thead>
            <tbody className="divide-y">
              {quotes.map(quote => (
                <tr key={quote.id} className="hover:bg-gray-50 cursor-pointer">
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
