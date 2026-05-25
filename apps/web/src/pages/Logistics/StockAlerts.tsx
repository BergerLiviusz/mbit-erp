import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function StockAlerts() {
  const [alerts, setAlerts] = useState<{ belowMin: any[]; aboveMax: any[] }>({ belowMin: [], aboveMax: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await apiFetch('/logistics/stock-movements/alerts');
      if (res.ok) setAlerts(await res.json());
      setLoading(false);
    })();
  }, []);

  const exportLow = async (format: 'csv' | 'xlsx') => {
    const res = await apiFetch(`/logistics/reports/low-stock/export/${format}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `min_keszlet.${format === 'csv' ? 'csv' : 'xlsx'}`;
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Készlet riasztások</h1>
        <button type="button" className="text-sm border px-3 py-1 rounded" onClick={() => exportLow('xlsx')}>
          Export
        </button>
      </div>
      {loading ? (
        <p>Betöltés...</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Minimum alatt ({alerts.belowMin.length})</h2>
            {alerts.belowMin.length === 0 ? (
              <p className="text-gray-600 text-sm">Nincs minimum alatti tétel.</p>
            ) : (
              <ul className="bg-white shadow rounded divide-y">
                {alerts.belowMin.map((a) => (
                  <li key={a.id} className="px-4 py-2 text-sm flex justify-between">
                    <span>
                      {a.item?.nev} – {a.warehouse?.nev}
                    </span>
                    <span className="text-red-600">
                      {a.mennyiseg} / min {a.threshold}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-lg font-semibold text-amber-700 mb-2">Maximum felett ({alerts.aboveMax.length})</h2>
            {alerts.aboveMax.length === 0 ? (
              <p className="text-gray-600 text-sm">Nincs maximum feletti tétel.</p>
            ) : (
              <ul className="bg-white shadow rounded divide-y">
                {alerts.aboveMax.map((a) => (
                  <li key={a.id} className="px-4 py-2 text-sm flex justify-between">
                    <span>
                      {a.item?.nev} – {a.warehouse?.nev}
                    </span>
                    <span className="text-amber-600">
                      {a.mennyiseg} / max {a.threshold}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
