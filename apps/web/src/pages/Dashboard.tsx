import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';
import { isModuleEnabled } from '../config/modules';

export default function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const [accounts, items, documents, returns, suppliers] = await Promise.all([
          axios.get('/api/crm/accounts?skip=0&take=1').catch(() => ({ data: { total: 0 } })),
          axios.get('/api/logistics/items?skip=0&take=1').catch(() => ({ data: { total: 0 } })),
          axios.get('/api/dms/documents?skip=0&take=1').catch(() => ({ data: { total: 0 } })),
          axios.get('/api/logistics/returns?skip=0&take=1').catch(() => ({ data: { total: 0 } })),
          axios.get('/api/logistics/suppliers?skip=0&take=1').catch(() => ({ data: { total: 0 } })),
        ]);
        return {
          accounts: accounts.data?.total || 0,
          items: items.data?.total || 0,
          documents: documents.data?.total || 0,
          returns: returns.data?.total || 0,
          suppliers: suppliers.data?.total || 0,
        };
      } catch (error) {
        console.error('Dashboard stats error:', error);
        // Return default values on error
        return {
          accounts: 0,
          items: 0,
          documents: 0,
          returns: 0,
          suppliers: 0,
        };
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 30000, // 30 seconds - refresh stats every 30 seconds
  });

  // Dinamikus modul lista generálása a bevezető szöveghez
  const enabledModuleNames: string[] = [];
  if (isModuleEnabled('documents')) enabledModuleNames.push('DMS');
  if (isModuleEnabled('crm')) enabledModuleNames.push('CRM');
  if (isModuleEnabled('logistics')) enabledModuleNames.push('logisztikai');
  if (isModuleEnabled('team')) enabledModuleNames.push('csapatmunka');
  if (isModuleEnabled('controlling')) enabledModuleNames.push('kontrolling');

  // Bevezető szöveg összeállítása
  let welcomeText = 'Ez a moduláris vállalati alkalmazás';
  if (enabledModuleNames.length > 0) {
    if (enabledModuleNames.length === 1) {
      welcomeText += ` ${enabledModuleNames[0]} funkciókkal rendelkezik.`;
    } else if (enabledModuleNames.length === 2) {
      welcomeText += ` ${enabledModuleNames[0]} és ${enabledModuleNames[1]} funkciókkal rendelkezik.`;
    } else {
      const lastModule = enabledModuleNames[enabledModuleNames.length - 1];
      const otherModules = enabledModuleNames.slice(0, -1);
      welcomeText += ` ${otherModules.join(', ')} és ${lastModule} funkciókkal rendelkezik.`;
    }
  } else {
    welcomeText += '.';
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Főoldal - Irányítópult</h1>
      
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Figyelem:</p>
          <p>Az adatok betöltése során hiba történt. Az alkalmazás továbbra is használható.</p>
        </div>
      )}
      
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Adatok betöltése...</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {isModuleEnabled('crm') && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm uppercase">Ügyfelek</h3>
            <p className="text-4xl font-bold text-blue-900">{stats?.accounts || 0}</p>
          </div>
        )}
        {isModuleEnabled('logistics') && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm uppercase">Cikkek</h3>
            <p className="text-4xl font-bold text-green-900">{stats?.items || 0}</p>
          </div>
        )}
        {isModuleEnabled('documents') && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm uppercase">Dokumentumok</h3>
            <p className="text-4xl font-bold text-purple-900">{stats?.documents || 0}</p>
          </div>
        )}
        {isModuleEnabled('logistics') && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm uppercase">Visszárúk</h3>
            <p className="text-4xl font-bold text-orange-900">{stats?.returns || 0}</p>
          </div>
        )}
        {isModuleEnabled('logistics') && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm uppercase">Szállítók</h3>
            <p className="text-4xl font-bold text-indigo-900">{stats?.suppliers || 0}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Üdvözöljük az Mbit ERP rendszerben!</h2>
        <p className="text-gray-700 mb-4">
          {welcomeText}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {isModuleEnabled('crm') && (
            <div className="border-l-4 border-mbit-blue pl-4">
              <h3 className="font-bold mb-2">CRM Modul</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ügyfélkapcsolat-kezelés</li>
                <li>• Kampánymenedzsment</li>
                <li>• Értékesítési folyamat</li>
                <li>• Reklamációkezelés</li>
              </ul>
            </div>
          )}
          {isModuleEnabled('documents') && (
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-bold mb-2">DMS Modul</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Iratkezelés & iktatás</li>
                <li>• OCR feldolgozás</li>
                <li>• Archiválás</li>
                <li>• Dokumentum keresés</li>
              </ul>
            </div>
          )}
          {isModuleEnabled('logistics') && (
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold mb-2">Logisztika Modul</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cikktörzs kezelés</li>
                <li>• Raktárkezelés</li>
                <li>• Készletfigyelés</li>
                <li>• Visszárú kezelés</li>
                <li>• Szállítók kezelése</li>
                <li>• Leltárív nyomtatás (PDF/CSV/Excel)</li>
                <li>• Áru-szállító kapcsolatok</li>
              </ul>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isModuleEnabled('team') && (
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-bold mb-2">Csapat kommunikáció</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Kanban board-ok</li>
                <li>• Feladatkezelés</li>
                <li>• Email értesítések</li>
                <li>• Kommentek és tevékenységek</li>
              </ul>
            </div>
          )}
          {isModuleEnabled('controlling') && (
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="font-bold mb-2">Kontrolling Modul</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Adatbázis kapcsolatok</li>
                <li>• KPI mutatószámok</li>
                <li>• Lekérdezések</li>
                <li>• Monitoring és riportok</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
