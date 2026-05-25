import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

interface AuditEntry {
  id: string;
  esemeny: string;
  entitas: string;
  entitasId?: string;
  createdAt: string;
  user?: { nev: string; email: string };
}

const MODULE_ENTITIES: Record<string, string[]> = {
  CRM: ['Account', 'Campaign', 'Lead', 'Quote', 'Order', 'Ticket', 'Message', 'CustomerInteraction'],
  DMS: ['Document', 'DocumentCategory'],
  SYSTEM: ['User', 'Role'],
};

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [modul, setModul] = useState<string>('');

  const load = async () => {
    const params = new URLSearchParams({ limit: '200' });
    const res = await apiFetch(`/system/audit?${params}`);
    if (!res.ok) return;
    let data: AuditEntry[] = await res.json();
    if (modul && MODULE_ENTITIES[modul]) {
      const allowed = MODULE_ENTITIES[modul];
      data = data.filter((l) => allowed.includes(l.entitas));
    }
    setLogs(data);
  };

  useEffect(() => {
    load();
  }, [modul]);

  const downloadExport = async (format: 'csv' | 'excel') => {
    const entitas = modul === 'DMS' ? 'Document' : modul === 'CRM' ? 'Account' : '';
    const q = entitas ? `?entitas=${entitas}` : '';
    const res = await apiFetch(`/system/audit/export/${format}${q}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_${modul || 'all'}.${format === 'csv' ? 'csv' : 'xlsx'}`;
    a.click();
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">Audit napló</h1>
        <div className="flex gap-2 items-center">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={modul}
            onChange={(e) => setModul(e.target.value)}
          >
            <option value="">Minden modul</option>
            <option value="CRM">CRM</option>
            <option value="DMS">DMS</option>
            <option value="SYSTEM">Rendszer</option>
          </select>
          <button
            type="button"
            onClick={() => downloadExport('csv')}
            className="text-sm px-3 py-1 border rounded"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => downloadExport('excel')}
            className="text-sm px-3 py-1 border rounded"
          >
            Export XLSX
          </button>
        </div>
      </div>
      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-3">Időpont</th>
            <th className="text-left p-3">Felhasználó</th>
            <th className="text-left p-3">Esemény</th>
            <th className="text-left p-3">Entitás</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-3">{new Date(l.createdAt).toLocaleString('hu-HU')}</td>
              <td className="p-3">{l.user?.nev || l.user?.email || '-'}</td>
              <td className="p-3">{l.esemeny}</td>
              <td className="p-3">
                {l.entitas} {l.entitasId ? `(${l.entitasId.slice(0, 8)}…)` : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
