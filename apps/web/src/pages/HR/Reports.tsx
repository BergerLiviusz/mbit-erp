import { useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function HrReports() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [navPayrollForm, setNavPayrollForm] = useState({
    ev: new Date().getFullYear(),
    honap: new Date().getMonth() + 1,
    employeeIds: [] as string[],
  });

  const [navTaxForm, setNavTaxForm] = useState({
    ev: new Date().getFullYear(),
    quarter: '',
  });

  const [kshForm, setKshForm] = useState({
    ev: new Date().getFullYear(),
    honap: '',
  });

  const [payrollExportForm, setPayrollExportForm] = useState({
    cafeteriaEv: new Date().getFullYear(),
    timeEv: new Date().getFullYear(),
    timeHonap: new Date().getMonth() + 1,
    leaveEvFrom: new Date().getFullYear(),
    leaveEvTo: '' as string,
  });

  const handleNavPayrollExport = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch('/hr/reports/nav/payroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ev: navPayrollForm.ev,
          honap: navPayrollForm.honap,
          employeeIds: navPayrollForm.employeeIds.length > 0 ? navPayrollForm.employeeIds : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba a riport generálásakor');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nav_berkifizetesi_${navPayrollForm.ev}_${navPayrollForm.honap}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setSuccess('NAV bérkifizetési jegyzék sikeresen exportálva!');
    } catch (err: any) {
      setError(err.message || 'Hiba az exportálás során');
    } finally {
      setLoading(false);
    }
  };

  const handleNavTaxExport = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch('/hr/reports/nav/tax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ev: navTaxForm.ev,
          quarter: navTaxForm.quarter ? parseInt(navTaxForm.quarter) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba a riport generálásakor');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = navTaxForm.quarter
        ? `nav_szja_${navTaxForm.ev}_Q${navTaxForm.quarter}.txt`
        : `nav_szja_${navTaxForm.ev}.txt`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setSuccess('NAV SZJA bevallás sikeresen exportálva!');
    } catch (err: any) {
      setError(err.message || 'Hiba az exportálás során');
    } finally {
      setLoading(false);
    }
  };

  const handleKshExport = async (reportType: 'EMPLOYMENT' | 'WAGE' | 'CONTRACT') => {
    setLoading(true);
    setError('');
    setSuccess('');

    const ev = kshForm.ev;
    const honap = kshForm.honap ? parseInt(kshForm.honap) : undefined;

    try {
      const endpoint =
        reportType === 'EMPLOYMENT'
          ? '/hr/reports/ksh/employment'
          : reportType === 'WAGE'
            ? '/hr/reports/ksh/wage'
            : '/hr/reports/ksh/contract';

      const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ev,
          honap,
          reportType,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba a riport generálásakor');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const reportName =
        reportType === 'EMPLOYMENT'
          ? 'foglalkoztatotti'
          : reportType === 'WAGE'
            ? 'berstatisztika'
            : 'szerzodes';
      const filename = kshForm.honap
        ? `ksh_${reportName}_${ev}_${kshForm.honap}.txt`
        : `ksh_${reportName}_${ev}.txt`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setSuccess('KSH riport sikeresen exportálva!');
    } catch (err: any) {
      setError(err.message || 'Hiba az exportálás során');
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = async (
    path: string,
    body: object,
    filename: string,
    successMsg: string,
  ) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await apiFetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Hiba az exportálás során');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setSuccess(successMsg);
    } catch (err: any) {
      setError(err.message || 'Hiba az exportálás során');
    } finally {
      setLoading(false);
    }
  };

  const handleCafeteriaPayrollExport = () =>
    downloadBlob(
      '/hr/reports/export/cafeteria-payroll',
      { ev: payrollExportForm.cafeteriaEv },
      `cafeteria_berszamfejto_${payrollExportForm.cafeteriaEv}.csv`,
      'Cafeteria bérszámfejtő CSV export kész.',
    );

  const handleTimePayrollExport = () =>
    downloadBlob(
      '/hr/reports/export/time-payroll',
      { ev: payrollExportForm.timeEv, honap: payrollExportForm.timeHonap },
      `munkaido_berszamfejto_${payrollExportForm.timeEv}_${payrollExportForm.timeHonap}.csv`,
      'Munkaidő bérszámfejtő CSV export kész.',
    );

  const handleLeaveAnalyticsExport = () =>
    downloadBlob(
      '/hr/reports/export/leave-analytics',
      {
        evFrom: payrollExportForm.leaveEvFrom,
        ...(payrollExportForm.leaveEvTo.trim()
          ? { evTo: parseInt(payrollExportForm.leaveEvTo, 10) }
          : {}),
      },
      `tavollet_riport_${payrollExportForm.leaveEvFrom}.csv`,
      'Távollét elemző CSV export kész.',
    );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">HR Riportok</h1>
        <p className="text-gray-600 mt-2">NAV és KSH törvényi kötelezettségek teljesítése</p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NAV Bérkifizetési jegyzék */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">NAV Bérkifizetési jegyzék</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Év</label>
                <input
                  type="number"
                  value={navPayrollForm.ev}
                  onChange={(e) => setNavPayrollForm({ ...navPayrollForm, ev: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  min="2000"
                  max="2100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hónap</label>
                <select
                  value={navPayrollForm.honap}
                  onChange={(e) => setNavPayrollForm({ ...navPayrollForm, honap: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m}. hónap</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleNavPayrollExport}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Generálás...' : 'Exportálás (TXT)'}
            </button>
          </div>
        </div>

        {/* NAV SZJA bevallás */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">NAV SZJA bevallás</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Év</label>
                <input
                  type="number"
                  value={navTaxForm.ev}
                  onChange={(e) => setNavTaxForm({ ...navTaxForm, ev: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  min="2000"
                  max="2100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Négyedév (opcionális)</label>
                <select
                  value={navTaxForm.quarter}
                  onChange={(e) => setNavTaxForm({ ...navTaxForm, quarter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Teljes év</option>
                  <option value="1">1. négyedév</option>
                  <option value="2">2. négyedév</option>
                  <option value="3">3. négyedév</option>
                  <option value="4">4. négyedév</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleNavTaxExport}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Generálás...' : 'Exportálás (TXT)'}
            </button>
          </div>
        </div>

        {/* KSH Foglalkoztatotti statisztika */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">KSH Foglalkoztatotti statisztika</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Év</label>
              <input
                type="number"
                value={kshForm.ev}
                onChange={(e) => setKshForm({ ...kshForm, ev: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                min="2000"
                max="2100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hónap (opcionális)</label>
              <select
                value={kshForm.honap}
                onChange={(e) => setKshForm({ ...kshForm, honap: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Teljes év</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m.toString()}>{m}. hónap</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => handleKshExport('EMPLOYMENT')}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Generálás...' : 'Exportálás (TXT)'}
            </button>
          </div>
        </div>

        {/* KSH Bérstatisztika */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">KSH Bérstatisztika</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Év</label>
              <input
                type="number"
                value={kshForm.ev}
                onChange={(e) => setKshForm({ ...kshForm, ev: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                min="2000"
                max="2100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hónap (opcionális)</label>
              <select
                value={kshForm.honap}
                onChange={(e) => setKshForm({ ...kshForm, honap: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Teljes év</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m.toString()}>{m}. hónap</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => handleKshExport('WAGE')}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Generálás...' : 'Exportálás (TXT)'}
            </button>
          </div>
        </div>

        {/* KSH Szerződés statisztika */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">KSH Szerződés statisztika</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Év</label>
              <input
                type="number"
                value={kshForm.ev}
                onChange={(e) => setKshForm({ ...kshForm, ev: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                min="2000"
                max="2100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hónap (opcionális)</label>
              <select
                value={kshForm.honap}
                onChange={(e) => setKshForm({ ...kshForm, honap: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Teljes év</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m.toString()}>{m}. hónap</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => handleKshExport('CONTRACT')}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Generálás...' : 'Exportálás (TXT)'}
            </button>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Bérszámfejtő és HR elemzés (CSV)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-3">Cafeteria – bérszámfejtő</h3>
              <label className="block text-sm font-medium text-gray-700 mb-1">Év (választások)</label>
              <input
                type="number"
                value={payrollExportForm.cafeteriaEv}
                onChange={(e) =>
                  setPayrollExportForm({ ...payrollExportForm, cafeteriaEv: parseInt(e.target.value, 10) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                min="2000"
                max="2100"
              />
              <button
                type="button"
                onClick={handleCafeteriaPayrollExport}
                disabled={loading}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900 disabled:bg-gray-400"
              >
                {loading ? 'Export...' : 'CSV letöltése'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-3">Munkaidő – bérszámfejtő</h3>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Év</label>
                  <input
                    type="number"
                    value={payrollExportForm.timeEv}
                    onChange={(e) =>
                      setPayrollExportForm({ ...payrollExportForm, timeEv: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    min="2000"
                    max="2100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hónap</label>
                  <select
                    value={payrollExportForm.timeHonap}
                    onChange={(e) =>
                      setPayrollExportForm({
                        ...payrollExportForm,
                        timeHonap: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m}. hónap
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={handleTimePayrollExport}
                disabled={loading}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900 disabled:bg-gray-400"
              >
                {loading ? 'Export...' : 'CSV letöltése'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-3">Távollétek – elemzés</h3>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Évtól</label>
                  <input
                    type="number"
                    value={payrollExportForm.leaveEvFrom}
                    onChange={(e) =>
                      setPayrollExportForm({
                        ...payrollExportForm,
                        leaveEvFrom: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    min="2000"
                    max="2100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Évig (opc.)</label>
                  <input
                    type="number"
                    value={payrollExportForm.leaveEvTo}
                    onChange={(e) =>
                      setPayrollExportForm({ ...payrollExportForm, leaveEvTo: e.target.value })
                    }
                    placeholder="Üres = csak évig"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    min="2000"
                    max="2100"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleLeaveAnalyticsExport}
                disabled={loading}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900 disabled:bg-gray-400"
              >
                {loading ? 'Export...' : 'CSV letöltése'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Megjegyzések</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>
            A NAV és KSH TXT exportok strukturált, belső összesítők: az első sor figyelmeztet a hatósági / bérszámfejtő
            formátum egyeztetésére. Ne tekintse őket önmagában bevallási fájlnak.
          </li>
          <li>A cafeteria és munkaidő CSV-k a bérszámfejtő partner által jóváhagyott oszlopokkal bővíthetők.</li>
          <li>Minden riport generálása audit naplóba kerül rögzítésre.</li>
          <li>A riportok alapértelmezés szerint az aktív dolgozók / érintett időszak adatait használják.</li>
        </ul>
      </div>
    </div>
  );
}

