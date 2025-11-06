import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [accounts, items, documents] = await Promise.all([
        axios.get('/api/crm/accounts?take=1'),
        axios.get('/api/logistics/items?take=1'),
        axios.get('/api/dms/documents?take=1'),
      ]);
      return {
        accounts: accounts.data.total || 0,
        items: items.data.total || 0,
        documents: documents.data.total || 0,
      };
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Főoldal - Irányítópult</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm uppercase">Ügyfelek</h3>
          <p className="text-4xl font-bold text-blue-900">{stats?.accounts || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm uppercase">Cikkek</h3>
          <p className="text-4xl font-bold text-green-900">{stats?.items || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm uppercase">Dokumentumok</h3>
          <p className="text-4xl font-bold text-purple-900">{stats?.documents || 0}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Üdvözöljük az Audit Institute ERP rendszerben!</h2>
        <p className="text-gray-700 mb-4">
          Ez a modular vállalati alkalmazás CRM, DMS és logisztikai funkciókkal rendelkezik.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold mb-2">CRM Modul</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ügyfélkapcsolat-kezelés</li>
              <li>• Kampánymenedzsment</li>
              <li>• Értékesítési folyamat</li>
              <li>• Reklamációkezelés</li>
            </ul>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-bold mb-2">DMS Modul</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Iratkezelés & iktatás</li>
              <li>• OCR feldolgozás</li>
              <li>• Archiválás</li>
              <li>• Dokumentum keresés</li>
            </ul>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-bold mb-2">Logisztika Modul</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Cikktörzs kezelés</li>
              <li>• Raktárkezelés</li>
              <li>• Készletfigyelés</li>
              <li>• Árlista menedzsment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
