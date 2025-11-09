import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { apiFetch } from '../lib/api';

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

interface Account {
  id: string;
  nev: string;
  azonosito: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpportunityId, setEditingOpportunityId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formData, setFormData] = useState({
    nev: '',
    accountId: '',
    szakasz: 'uj',
    ertek: '',
    valoszinuseg: '50',
    zarvasDatum: '',
  });


  useEffect(() => {
    loadOpportunities();
  }, [selectedSzakasz]);

  useEffect(() => {
    if (isModalOpen) {
      loadAccounts();
    }
  }, [isModalOpen]);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const url = selectedSzakasz
        ? `/crm/opportunities?szakasz=${selectedSzakasz}&skip=0&take=100`
        : `/crm/opportunities?skip=0&take=100`;

      const response = await apiFetch(url);

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

  const loadAccounts = async () => {
    try {
      const response = await apiFetch('/crm/accounts?skip=0&take=100');

      if (response.ok) {
        const data = await response.json();
        setAccounts(data.items || data.data || []);
      }
    } catch (error) {
      console.error('Hiba az ügyfelek betöltésekor:', error);
    }
  };

  const handleOpenModal = (opportunity?: Opportunity) => {
    setError('');
    setSuccess('');
    if (opportunity) {
      setEditingOpportunityId(opportunity.id);
      setFormData({
        nev: opportunity.nev,
        accountId: opportunity.account.id,
        szakasz: opportunity.szakasz,
        ertek: opportunity.ertek.toString(),
        valoszinuseg: opportunity.valoszinuseg.toString(),
        zarvasDatum: opportunity.zarvasDatum ? new Date(opportunity.zarvasDatum).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingOpportunityId(null);
      setFormData({
        nev: '',
        accountId: '',
        szakasz: 'uj',
        ertek: '',
        valoszinuseg: '50',
        zarvasDatum: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOpportunityId(null);
    setFormData({
      nev: '',
      accountId: '',
      szakasz: 'uj',
      ertek: '',
      valoszinuseg: '50',
      zarvasDatum: '',
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

    if (!formData.accountId) {
      setError('Az ügyfél kiválasztása kötelező');
      return;
    }

    const ertekNum = parseFloat(formData.ertek);
    if (isNaN(ertekNum) || ertekNum < 0) {
      setError('Az érték nem lehet negatív');
      return;
    }

    const valoszinusegNum = parseInt(formData.valoszinuseg);
    if (isNaN(valoszinusegNum) || valoszinusegNum < 0 || valoszinusegNum > 100) {
      setError('A valószínűség 0 és 100 között kell legyen');
      return;
    }

    setSaving(true);

    try {

      // Parse and validate date
      let zarvasDatum: Date | undefined = undefined;
      if (formData.zarvasDatum) {
        const date = new Date(formData.zarvasDatum);
        if (!isNaN(date.getTime())) {
          // Check if year is reasonable (between 1900 and 2100)
          const year = date.getFullYear();
          if (year >= 1900 && year <= 2100) {
            zarvasDatum = date;
          } else {
            console.warn(`Invalid year in date: ${formData.zarvasDatum}, ignoring date`);
          }
        }
      }

      const opportunityData = {
        nev: formData.nev,
        accountId: formData.accountId,
        szakasz: formData.szakasz,
        ertek: ertekNum,
        valoszinuseg: valoszinusegNum,
        zarvasDatum: zarvasDatum,
      };

      const url = editingOpportunityId 
        ? `/crm/opportunities/${editingOpportunityId}`
        : '/crm/opportunities';
      const method = editingOpportunityId ? 'PUT' : 'POST';

      // For PUT requests, don't send accountId (it's not in UpdateOpportunityDto)
      const requestData = editingOpportunityId 
        ? {
            nev: opportunityData.nev,
            szakasz: opportunityData.szakasz,
            ertek: opportunityData.ertek,
            valoszinuseg: opportunityData.valoszinuseg,
            zarvasDatum: opportunityData.zarvasDatum,
          }
        : opportunityData;

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
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
          throw new Error(errorData.message || `Hiba a lehetőség ${editingOpportunityId ? 'frissítésekor' : 'létrehozásakor'}`);
        }
      }

      setSuccess(editingOpportunityId ? 'Lehetőség sikeresen frissítve!' : 'Lehetőség sikeresen létrehozva!');
      setTimeout(() => {
        handleCloseModal();
        loadOpportunities();
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
        <button 
          onClick={handleOpenModal}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
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
                <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {opportunities.map(opp => (
                <tr key={opp.id} className="hover:bg-gray-50">
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
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenModal(opp)}
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingOpportunityId ? "Lehetőség szerkesztése" : "Új lehetőség"} size="lg">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Név <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nev}
                onChange={(e) => setFormData({ ...formData, nev: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ügyfél <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!!editingOpportunityId}
              >
                <option value="">-- Válasszon --</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.nev} ({a.azonosito})</option>
                ))}
              </select>
              {editingOpportunityId && (
                <p className="mt-1 text-xs text-gray-500">Az ügyfél nem módosítható szerkesztéskor</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Szakasz <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.szakasz}
                onChange={(e) => setFormData({ ...formData, szakasz: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {SZAKASZOK.map(sz => (
                  <option key={sz.kod} value={sz.kod}>{sz.nev}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Érték (HUF) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.ertek}
                  onChange={(e) => setFormData({ ...formData, ertek: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valószínűség (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.valoszinuseg}
                  onChange={(e) => setFormData({ ...formData, valoszinuseg: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tervezett zárás dátuma
              </label>
              <input
                type="date"
                value={formData.zarvasDatum}
                onChange={(e) => setFormData({ ...formData, zarvasDatum: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              {saving ? 'Mentés...' : (editingOpportunityId ? 'Frissítés' : 'Mentés')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
