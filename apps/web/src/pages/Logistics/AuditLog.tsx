import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

const LOGISTICS_ENTITIES = [
  'Item',
  'ProductCategory',
  'StockMove',
  'StockLevel',
  'purchase_order',
  'Return',
  'PriceList',
  'LogisticsReport',
  'InventorySheet',
  'Warehouse',
];

export default function LogisticsAuditLog() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/system/audit?limit=300').then(async (res) => {
      if (!res.ok) return;
      const data = await res.json();
      setLogs(data.filter((l: { entitas: string }) => LOGISTICS_ENTITIES.includes(l.entitas)));
    });
  }, []);

  const download = async (format: 'csv' | 'excel') => {
    const res = await apiFetch(`/system/audit/export/${format}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `logisztika_audit.${format === 'csv' ? 'csv' : 'xlsx'}`;
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Logisztika audit napló</h1>
        <div className="flex gap-2">
          <button type="button" className="text-sm border px-3 py-1 rounded" onClick={() => download('csv')}>
            CSV
          </button>
          <button type="button" className="text-sm border px-3 py-1 rounded" onClick={() => download('excel')}>
            XLSX
          </button>
        </div>
      </div>
      {logs.length === 0 ? (
        <p className="text-gray-600">Még nincs logisztikai audit bejegyzés. Műveletek után automatikusan megjelennek.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Idő</th>
              <th className="px-3 py-2 text-left">Esemény</th>
              <th className="px-3 py-2 text-left">Entitás</th>
              <th className="px-3 py-2 text-left">Felhasználó</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-3 py-2">{new Date(l.createdAt).toLocaleString('hu-HU')}</td>
                <td className="px-3 py-2">{l.esemeny}</td>
                <td className="px-3 py-2">
                  {l.entitas} {l.entitasId ? `(${l.entitasId.slice(0, 8)}…)` : ''}
                </td>
                <td className="px-3 py-2">{l.user?.nev || l.user?.email || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
