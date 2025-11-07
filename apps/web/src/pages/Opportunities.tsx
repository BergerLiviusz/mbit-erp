import { useState, useEffect } from 'react';

interface Opportunity {
  id: string;
  nev: string;
  szakasz: string;
  ertek: number;
  valoszinuseg: number;
  zarvasDatum: string | null;
  account: {
    id: string;
    nev: string;
    azonosito: string;
  };
  createdAt: string;
}

const SZAKASZOK = [
  { kod: 'uj', nev: 'Új', szin: 'bg-blue-100 text-blue-800' },
  { kod: 'kapcsolatfelvetel', nev: 'Kapcsolatfelvétel', szin: 'bg-purple-100 text-purple-800' },
  { kod: 'ajanlatadas', nev: 'Árajánlatadás', szin: 'bg-yellow-100 text-yellow-800' },
  { kod: 'targyalas', nev: 'Tárgyalás', szin: 'bg-orange-100 text-orange-800' },
  { kod: 'lezarva_nyert', nev: 'Lezárva (Nyert)', szin: 'bg-green-100 text-green-800' },
  { kod: 'lezarva_veszett', nev: 'Lezárva (Veszett)', szin: 'bg-red-100 text-red-800' },
];

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSzakasz, setSelectedSzakasz] = useState<string>('');

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    loadOpportunities();
  }, [selectedSzakasz]);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = selectedSzakasz
        ? `${API_URL}/crm/opportunities?szakasz=${selectedSzakasz}&skip=0&take=100`
        : `${API_URL}/crm/opportunities?skip=0&take=100`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOpportunities(data.data || []);
      }
    } catch (error) {
      console.error('Hiba a lehetőségek betöltésekor:', error);
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('hu-HU');
  };

  const getSzakaszBadge = (szakasz: string) => {
    const sz = SZAKASZOK.find(s => s.kod === szakasz);
    if (!sz) return null;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${sz.szin}`}>
        {sz.nev}
      </span>
    );
  };

  const calculateTotalValue = () => {
    return opportunities
      .filter(o => o.szakasz !== 'lezarva_veszett')
      .reduce((sum, o) => sum + (o.ertek * o.valoszinuseg) / 100, 0);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lehetőségek</h1>
        <button className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600">
          + Új lehetőség
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Összes lehetőség</div>
          <div className="text-2xl font-bold">{opportunities.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Összes érték</div>
          <div className="text-2xl font-bold text-mbit-blue">
            {formatCurrency(opportunities.reduce((sum, o) => sum + o.ertek, 0))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Várható érték</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(calculateTotalValue())}
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedSzakasz('')}
          className={`px-4 py-2 rounded ${
            selectedSzakasz === ''
              ? 'bg-mbit-blue text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Összes
        </button>
        {SZAKASZOK.map(sz => (
          <button
            key={sz.kod}
            onClick={() => setSelectedSzakasz(sz.kod)}
            className={`px-4 py-2 rounded ${
              selectedSzakasz === sz.kod
                ? 'bg-mbit-blue text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {sz.nev}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : opportunities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs lehetőség</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Név</th>
                <th className="text-left p-4 font-medium text-gray-700">Ügyfél</th>
                <th className="text-left p-4 font-medium text-gray-700">Szakasz</th>
                <th className="text-right p-4 font-medium text-gray-700">Érték</th>
                <th className="text-center p-4 font-medium text-gray-700">Valószínűség</th>
                <th className="text-right p-4 font-medium text-gray-700">Várható</th>
                <th className="text-left p-4 font-medium text-gray-700">Zárás</th>
                <th className="text-left p-4 font-medium text-gray-700">Létrehozva</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {opportunities.map(opp => (
                <tr key={opp.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="p-4">
                    <div className="font-medium text-mbit-blue">{opp.nev}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{opp.account.nev}</div>
                    <div className="text-xs text-gray-500">{opp.account.azonosito}</div>
                  </td>
                  <td className="p-4">{getSzakaszBadge(opp.szakasz)}</td>
                  <td className="p-4 text-right font-medium">
                    {formatCurrency(opp.ertek)}
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {opp.valoszinuseg}%
                    </span>
                  </td>
                  <td className="p-4 text-right text-gray-600">
                    {formatCurrency((opp.ertek * opp.valoszinuseg) / 100)}
                  </td>
                  <td className="p-4 text-sm">{formatDate(opp.zarvasDatum)}</td>
                  <td className="p-4 text-sm text-gray-500">{formatDate(opp.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
