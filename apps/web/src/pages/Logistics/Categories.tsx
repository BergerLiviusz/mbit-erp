import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import { apiFetch } from '../../lib/api';
import { usePermissions } from '../../hooks/usePermissions';

export default function Categories() {
  const { hasAny, canExportLogistics } = usePermissions();
  const canCreate = hasAny('logistics:create', 'product:create');
  const [tree, setTree] = useState<any[]>([]);
  const [flat, setFlat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nev: '', leiras: '', parentId: '' });
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const [tRes, fRes] = await Promise.all([
      apiFetch('/logistics/categories?tree=true'),
      apiFetch('/logistics/categories'),
    ]);
    if (tRes.ok) setTree(await tRes.json());
    if (fRes.ok) {
      const d = await fRes.json();
      setFlat(d.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    const res = await apiFetch('/logistics/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nev: form.nev,
        leiras: form.leiras || undefined,
        parentId: form.parentId || undefined,
      }),
    });
    if (!res.ok) {
      setError('Mentés sikertelen');
      return;
    }
    setOpen(false);
    setForm({ nev: '', leiras: '', parentId: '' });
    load();
  };

  const renderNode = (node: any, depth = 0) => (
    <div key={node.id} style={{ paddingLeft: depth * 16 }} className="py-1 text-sm">
      <span className="font-medium">{node.nev}</span>
      <span className="text-gray-500 ml-2">({node._count?.items ?? 0} cikk)</span>
      {node.children?.map((c: any) => renderNode(c, depth + 1))}
    </div>
  );

  const exportReport = async (format: 'csv' | 'xlsx') => {
    const res = await apiFetch(`/logistics/categories/export/${format}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `kategoriak.${format === 'csv' ? 'csv' : 'xlsx'}`;
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kategóriák</h1>
        <div className="flex gap-2">
          {canExportLogistics && (
            <button type="button" className="text-sm border px-3 py-1 rounded" onClick={() => exportReport('xlsx')}>
              Export
            </button>
          )}
          {canCreate && (
            <button type="button" className="bg-mbit-blue text-white px-4 py-2 rounded" onClick={() => setOpen(true)}>
              Új kategória
            </button>
          )}
        </div>
      </div>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-800 rounded">{error}</div>}
      {loading ? (
        <p>Betöltés...</p>
      ) : tree.length === 0 ? (
        <p className="text-gray-600">Nincs kategória. Hozzon létre hierarchikus kategóriákat a cikkek csoportosításához.</p>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">{tree.map((n) => renderNode(n))}</div>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Új kategória">
        <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Név" value={form.nev} onChange={(e) => setForm({ ...form, nev: e.target.value })} />
        <textarea className="w-full border rounded px-2 py-1 mb-2" placeholder="Leírás" value={form.leiras} onChange={(e) => setForm({ ...form, leiras: e.target.value })} />
        <select className="w-full border rounded px-2 py-1 mb-2" value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
          <option value="">Nincs szülő (gyökér)</option>
          {flat.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nev}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button type="button" className="px-4 py-2 border rounded" onClick={() => setOpen(false)}>
            Mégse
          </button>
          <button type="button" className="px-4 py-2 bg-mbit-blue text-white rounded" onClick={save}>
            Mentés
          </button>
        </div>
      </Modal>
    </div>
  );
}
