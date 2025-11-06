import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export default function CRM() {
  const [activeTab, setActiveTab] = useState<'accounts' | 'campaigns' | 'tickets'>('accounts');

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">CRM - Ügyfélkapcsolat Kezelés</h1>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'accounts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ügyfelek ({accounts?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Kampányok ({campaigns?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tickets'
                ? 'border-blue-500 text-blue-600'
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
              {campaigns?.items?.map((campaign: any) => (
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
              ))}
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
    </div>
  );
}
