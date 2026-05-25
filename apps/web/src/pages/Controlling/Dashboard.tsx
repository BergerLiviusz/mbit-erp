import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { apiFetch } from '../../lib/api';
import { usePermissions } from '../../hooks/usePermissions';

const COLORS = ['#2563eb', '#16a34a', '#ca8a04', '#dc2626', '#7c3aed', '#0891b2'];

export default function ControllingDashboard() {
  const { canViewControlling, canExportControlling, loading: permLoading } = usePermissions();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    const q = module ? `?module=${module}` : '';
    const res = await apiFetch(`/controlling/dashboard${q}`);
    if (!res.ok) {
      setError('Dashboard betöltése sikertelen');
      setLoading(false);
      return;
    }
    setData(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    if (canViewControlling) load();
  }, [module, canViewControlling]);

  const exportQuick = async (kod: string) => {
    if (!canExportControlling) return;
    const res = await apiFetch(`/controlling/reports/templates/${kod}/run/xlsx`);
    if (!res.ok) return;
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${kod}.xlsx`;
    a.click();
  };

  if (permLoading) return <p className="p-6">Betöltés...</p>;
  if (!canViewControlling) {
    return <p className="p-6 text-red-700">Nincs jogosultsága a kontrolling modul megtekintéséhez.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">Kontrolling – Dashboard</h1>
        <div className="flex gap-2 items-center">
          <select
            className="border rounded px-3 py-2 text-sm"
            value={module}
            onChange={(e) => setModule(e.target.value)}
          >
            <option value="">Minden modul</option>
            <option value="CRM">CRM</option>
            <option value="DMS">DMS</option>
            <option value="HR">HR</option>
            <option value="LOGISTICS">Logisztika</option>
            <option value="SYSTEM">Rendszer</option>
          </select>
          <button type="button" className="border px-3 py-2 rounded text-sm" onClick={load}>
            Frissítés
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-800 rounded">{error}</div>}

      {loading ? (
        <p>Betöltés...</p>
      ) : !data?.kpis?.length ? (
        <p className="text-gray-600">Nincs KPI adat. A rendszer üres adatbázissal is működik – az értékek 0-k lesznek.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {data.kpis.map((k: any) => (
              <div
                key={k.code}
                className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                  k.status === 'critical'
                    ? 'border-red-500'
                    : k.status === 'warning'
                      ? 'border-amber-500'
                      : 'border-mbit-blue'
                }`}
              >
                <div className="text-xs text-gray-500 uppercase">{k.category}</div>
                <div className="text-sm font-medium text-gray-700 mt-1">{k.name}</div>
                <div className="text-2xl font-bold mt-2">
                  {typeof k.value === 'number' ? k.value.toLocaleString('hu-HU') : k.value}
                  {k.unit ? <span className="text-sm font-normal ml-1">{k.unit}</span> : null}
                </div>
              </div>
            ))}
          </div>

          {data.charts?.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {data.charts.map((chart: any, idx: number) => (
                <div key={chart.name} className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold mb-4">{chart.name}</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    {idx % 3 === 0 ? (
                      <PieChart>
                        <Pie data={chart.data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={90} label>
                          {chart.data.map((_: any, i: number) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    ) : idx % 3 === 1 ? (
                      <LineChart data={chart.data}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
                      </LineChart>
                    ) : (
                      <BarChart data={chart.data}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#2563eb" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          )}

          {canExportControlling && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Gyors export</h3>
              <div className="flex flex-wrap gap-2">
                {['crm.pipeline', 'dms.status', 'hr.employees', 'logistics.stock', 'system.audit'].map((k) => (
                  <button
                    key={k}
                    type="button"
                    className="text-sm border px-3 py-1 rounded bg-white"
                    onClick={() => exportQuick(k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
