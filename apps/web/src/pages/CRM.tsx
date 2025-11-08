import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';
import { useState } from 'react';
import Modal from '../components/Modal';

const isElectron = !!(window as any).electron || (navigator.userAgent.includes('Electron'));
const API_URL = isElectron ? 'http://localhost:3000' : '/api';

export default function CRM() {
  const [activeTab, setActiveTab] = useState<'accounts' | 'campaigns' | 'tickets'>('accounts');
  const queryClient = useQueryClient();

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const [accountFormData, setAccountFormData] = useState({
    nev: '',
    tipus: 'ugyfél',
    adoszam: '',
    cim: '',
    email: '',
    telefon: '',
    megjegyzesek: '',
  });

  const [campaignFormData, setCampaignFormData] = useState({
    nev: '',
    leiras: '',
    tipus: 'email',
    allapot: 'tervezett',
    kezdetDatum: '',
    befejezesDatum: '',
    koltsegvetes: '',
  });

  const [ticketFormData, setTicketFormData] = useState({
    targy: '',
    leiras: '',
    tipus: 'hibabejelentés',
    prioritas: 'közepes',
    allapot: 'új',
    accountId: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await axios.get('/api/crm/accounts');
      return response.data;
    },
    enabled: activeTab === 'accounts',
  });

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await axios.get('/api/crm/campaigns');
      return response.data;
    },
    enabled: activeTab === 'campaigns',
  });

  const { data: tickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const response = await axios.get('/api/crm/tickets');
      return response.data;
    },
    enabled: activeTab === 'tickets',
  });

  const { data: accountsForSelect } = useQuery({
    queryKey: ['accountsForSelect'],
    queryFn: async () => {
      const response = await axios.get('/api/crm/accounts?skip=0&take=100');
      return response.data;
    },
    enabled: isTicketModalOpen,
  });

  const handleOpenAccountModal = () => {
    setAccountFormData({
      nev: '',
      tipus: 'ugyfél',
      adoszam: '',
      cim: '',
      email: '',
      telefon: '',
      megjegyzesek: '',
    });
    setError('');
    setSuccess('');
    setIsAccountModalOpen(true);
  };

  const handleOpenCampaignModal = () => {
    setCampaignFormData({
      nev: '',
      leiras: '',
      tipus: 'email',
      allapot: 'tervezett',
      kezdetDatum: '',
      befejezesDatum: '',
      koltsegvetes: '',
    });
    setError('');
    setSuccess('');
    setIsCampaignModalOpen(true);
  };

  const handleOpenTicketModal = () => {
    setTicketFormData({
      targy: '',
      leiras: '',
      tipus: 'hibabejelentés',
      prioritas: 'közepes',
      allapot: 'új',
      accountId: '',
    });
    setError('');
    setSuccess('');
    setIsTicketModalOpen(true);
  };

  const validateEmail = (email: string) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!accountFormData.nev.trim()) {
      setError('A név megadása kötelező');
      return;
    }

    if (accountFormData.email && !validateEmail(accountFormData.email)) {
      setError('Kérem adjon meg érvényes email címet');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/crm/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(accountFormData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (response.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (response.status === 400) {
          const data = await response.json();
          throw new Error(data.message || 'Hibás adatok.');
        } else if (response.status >= 500) {
          throw new Error('Szerver hiba. Kérem próbálja újra később.');
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Hiba történt a mentés során');
        }
      }

      setSuccess('Ügyfél sikeresen létrehozva!');
      setTimeout(() => {
        setIsAccountModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!campaignFormData.nev.trim()) {
      setError('A név megadása kötelező');
      return;
    }

    setSaving(true);

    try {
      const dataToSend = {
        ...campaignFormData,
        koltsegvetes: campaignFormData.koltsegvetes ? parseFloat(campaignFormData.koltsegvetes) : undefined,
        kezdetDatum: campaignFormData.kezdetDatum || undefined,
        befejezesDatum: campaignFormData.befejezesDatum || undefined,
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/crm/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (response.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (response.status === 400) {
          const data = await response.json();
          throw new Error(data.message || 'Hibás adatok.');
        } else if (response.status >= 500) {
          throw new Error('Szerver hiba. Kérem próbálja újra később.');
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Hiba történt a mentés során');
        }
      }

      setSuccess('Kampány sikeresen létrehozva!');
      setTimeout(() => {
        setIsCampaignModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!ticketFormData.targy.trim()) {
      setError('A tárgy megadása kötelező');
      return;
    }

    setSaving(true);

    try {
      const dataToSend = {
        ...ticketFormData,
        accountId: ticketFormData.accountId || undefined,
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/crm/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (response.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (response.status === 400) {
          const data = await response.json();
          throw new Error(data.message || 'Hibás adatok.');
        } else if (response.status >= 500) {
          throw new Error('Szerver hiba. Kérem próbálja újra később.');
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Hiba történt a mentés során');
        }
      }

      setSuccess('Reklamáció sikeresen létrehozva!');
      setTimeout(() => {
        setIsTicketModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['tickets'] });
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
        <h1 className="text-3xl font-bold">CRM - Ügyfélkapcsolat Kezelés</h1>
        {activeTab === 'accounts' && (
          <button
            onClick={handleOpenAccountModal}
            className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Új ügyfél
          </button>
        )}
        {activeTab === 'campaigns' && (
          <button
            onClick={handleOpenCampaignModal}
            className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Új kampány
          </button>
        )}
        {activeTab === 'tickets' && (
          <button
            onClick={handleOpenTicketModal}
            className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Új reklamáció
          </button>
        )}
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'accounts'
                ? 'border-mbit-blue text-mbit-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ügyfelek ({accounts?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campaigns'
                ? 'border-mbit-blue text-mbit-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Kampányok ({campaigns?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tickets'
                ? 'border-mbit-blue text-mbit-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reklamációk ({tickets?.total || 0})
          </button>
        </nav>
      </div>

      {activeTab === 'accounts' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Ügyfélnyilvántartás</h2>
          </div>
          {accountsLoading ? (
            <div className="p-6">Betöltés...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azonosító</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Név</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Típus</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts?.items?.map((account: any) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {account.azonosito}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.nev}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.telefon}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.tipus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Kampánymenedzsment</h2>
          </div>
          {campaignsLoading ? (
            <div className="p-6">Betöltés...</div>
          ) : (
            <div className="p-6">
              {campaigns?.items?.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Nincs kampány</div>
              ) : (
                campaigns?.items?.map((campaign: any) => (
                  <div key={campaign.id} className="mb-4 p-4 border rounded">
                    <h3 className="font-bold text-lg">{campaign.nev}</h3>
                    <p className="text-gray-600 text-sm">{campaign.leiras}</p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="text-gray-500">Típus: {campaign.tipus}</span>
                      <span className="text-gray-500">Állapot: {campaign.allapot}</span>
                      {campaign.koltsegvetes && (
                        <span className="text-gray-500">Költségvetés: {campaign.koltsegvetes.toLocaleString('hu-HU')} HUF</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Reklamáció & Ticket Kezelés</h2>
          </div>
          {ticketsLoading ? (
            <div className="p-6">Betöltés...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azonosító</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tárgy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioritás</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Állapot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Típus</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets?.items?.map((ticket: any) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.azonosito}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{ticket.targy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        ticket.prioritas === 'magas' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ticket.prioritas}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.allapot}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.tipus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <Modal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} title="Új ügyfél" size="lg">
        <form onSubmit={handleSubmitAccount}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Név <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={accountFormData.nev}
                onChange={(e) => setAccountFormData({ ...accountFormData, nev: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Típus <span className="text-red-500">*</span>
              </label>
              <select
                value={accountFormData.tipus}
                onChange={(e) => setAccountFormData({ ...accountFormData, tipus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="partner">Partner</option>
                <option value="ugyfél">Ügyfél</option>
                <option value="szállító">Szállító</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adószám</label>
              <input
                type="text"
                value={accountFormData.adoszam}
                onChange={(e) => setAccountFormData({ ...accountFormData, adoszam: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cím</label>
              <input
                type="text"
                value={accountFormData.cim}
                onChange={(e) => setAccountFormData({ ...accountFormData, cim: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={accountFormData.email}
                onChange={(e) => setAccountFormData({ ...accountFormData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                type="tel"
                value={accountFormData.telefon}
                onChange={(e) => setAccountFormData({ ...accountFormData, telefon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Megjegyzések</label>
              <textarea
                value={accountFormData.megjegyzesek}
                onChange={(e) => setAccountFormData({ ...accountFormData, megjegyzesek: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAccountModalOpen(false)}
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
              {saving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isCampaignModalOpen} onClose={() => setIsCampaignModalOpen(false)} title="Új kampány" size="lg">
        <form onSubmit={handleSubmitCampaign}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Név <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={campaignFormData.nev}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, nev: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leírás</label>
              <textarea
                value={campaignFormData.leiras}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, leiras: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Típus <span className="text-red-500">*</span>
              </label>
              <select
                value={campaignFormData.tipus}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, tipus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="email">Email</option>
                <option value="telefon">Telefon</option>
                <option value="közösségi">Közösségi</option>
                <option value="esemény">Esemény</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Állapot <span className="text-red-500">*</span>
              </label>
              <select
                value={campaignFormData.allapot}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, allapot: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="tervezett">Tervezett</option>
                <option value="aktív">Aktív</option>
                <option value="befejezett">Befejezett</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kezdet dátum</label>
                <input
                  type="date"
                  value={campaignFormData.kezdetDatum}
                  onChange={(e) => setCampaignFormData({ ...campaignFormData, kezdetDatum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Befejezés dátum</label>
                <input
                  type="date"
                  value={campaignFormData.befejezesDatum}
                  onChange={(e) => setCampaignFormData({ ...campaignFormData, befejezesDatum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Költségvetés (HUF)</label>
              <input
                type="number"
                value={campaignFormData.koltsegvetes}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, koltsegvetes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="1"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCampaignModalOpen(false)}
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
              {saving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title="Új reklamáció" size="lg">
        <form onSubmit={handleSubmitTicket}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tárgy <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ticketFormData.targy}
                onChange={(e) => setTicketFormData({ ...ticketFormData, targy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leírás</label>
              <textarea
                value={ticketFormData.leiras}
                onChange={(e) => setTicketFormData({ ...ticketFormData, leiras: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Típus <span className="text-red-500">*</span>
              </label>
              <select
                value={ticketFormData.tipus}
                onChange={(e) => setTicketFormData({ ...ticketFormData, tipus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="hibabejelentés">Hibabejelentés</option>
                <option value="kérdés">Kérdés</option>
                <option value="funkciókérés">Funkciókérés</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioritás <span className="text-red-500">*</span>
              </label>
              <select
                value={ticketFormData.prioritas}
                onChange={(e) => setTicketFormData({ ...ticketFormData, prioritas: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="alacsony">Alacsony</option>
                <option value="közepes">Közepes</option>
                <option value="magas">Magas</option>
                <option value="sürgős">Sürgős</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Állapot <span className="text-red-500">*</span>
              </label>
              <select
                value={ticketFormData.allapot}
                onChange={(e) => setTicketFormData({ ...ticketFormData, allapot: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="új">Új</option>
                <option value="folyamatban">Folyamatban</option>
                <option value="megoldott">Megoldott</option>
                <option value="lezárt">Lezárt</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ügyfél</label>
              <select
                value={ticketFormData.accountId}
                onChange={(e) => setTicketFormData({ ...ticketFormData, accountId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Válasszon --</option>
                {accountsForSelect?.items?.map((account: any) => (
                  <option key={account.id} value={account.id}>{account.nev}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsTicketModalOpen(false)}
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
              {saving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
