import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';

const DOC_TYPE_SUGGESTIONS: Record<string, string> = {
  munkaszerzodes: 'Munkaszerződés',
  munkakori_leiras: 'Munkaköri leírás',
  vegzettseg: 'Végzettségi dokumentum',
  orvosi: 'Orvosi alkalmassági',
  tanulmanyi: 'Tanulmányi szerződés',
  egyeb: 'HR dokumentum',
};

interface DmsDoc {
  id: string;
  nev: string;
  iktatoSzam?: string | null;
  fajlNev?: string;
}

interface Props {
  label: string;
  documentId?: string | null;
  suggestionKey?: keyof typeof DOC_TYPE_SUGGESTIONS;
  onLinked: (documentId: string | null) => void;
  disabled?: boolean;
}

export default function DmsDocumentLinker({
  label,
  documentId,
  suggestionKey = 'egyeb',
  onLinked,
  disabled,
}: Props) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<DmsDoc[]>([]);
  const [linkedDoc, setLinkedDoc] = useState<DmsDoc | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!documentId) {
      setLinkedDoc(null);
      return;
    }
    (async () => {
      const res = await apiFetch(`/dms/documents/${documentId}`);
      if (res.ok) setLinkedDoc(await res.json());
    })();
  }, [documentId]);

  const searchDocs = async () => {
    if (!search.trim()) return;
    const res = await apiFetch(
      `/dms/documents?search=${encodeURIComponent(search)}&take=15`,
    );
    if (res.ok) {
      const data = await res.json();
      setResults(data.items || data || []);
    }
  };

  const uploadNew = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const tipus = DOC_TYPE_SUGGESTIONS[suggestionKey] || 'HR dokumentum';
      const createRes = await apiFetch('/dms/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nev: file.name,
          tipus,
          irany: 'bejovo',
          allapot: 'beerkezett',
          fajlNev: file.name,
          fajlMeret: file.size,
          mimeType: file.type || 'application/octet-stream',
        }),
      });
      if (!createRes.ok) throw new Error('Iktatás sikertelen');
      const doc = await createRes.json();
      const fd = new FormData();
      fd.append('file', file);
      const up = await apiFetch(`/dms/documents/${doc.id}/upload`, {
        method: 'POST',
        body: fd,
      });
      if (!up.ok) throw new Error('Feltöltés sikertelen');
      setLinkedDoc(doc);
      onLinked(doc.id);
      setSuccessMsg('Dokumentum feltöltve és csatolva.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Hiba a feltöltéskor');
    } finally {
      setUploading(false);
    }
  };

  const [successMsg, setSuccessMsg] = useState('');

  return (
    <div className="border rounded p-3 bg-gray-50 space-y-2">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {successMsg && <p className="text-xs text-green-600">{successMsg}</p>}

      {linkedDoc ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span>
            {linkedDoc.nev}
            {linkedDoc.iktatoSzam ? ` (${linkedDoc.iktatoSzam})` : ''}
          </span>
          <button
            type="button"
            className="text-blue-600 underline"
            disabled={disabled}
            onClick={async () => {
              const res = await apiFetch(`/dms/documents/${linkedDoc.id}/download`);
              if (res.ok) {
                const blob = await res.blob();
                window.open(URL.createObjectURL(blob), '_blank');
              } else {
                setError('A fájl nem nyitható meg.');
              }
            }}
          >
            Megnyitás
          </button>
          <button
            type="button"
            className="text-red-600 text-xs"
            disabled={disabled}
            onClick={() => {
              onLinked(null);
              setLinkedDoc(null);
              setSuccessMsg('');
            }}
          >
            Leválasztás
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Keresés iktatószám / név..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={disabled}
            />
            <button
              type="button"
              className="px-2 py-1 border rounded text-sm"
              onClick={searchDocs}
              disabled={disabled}
            >
              Keresés
            </button>
          </div>
          {results.length > 0 && (
            <ul className="max-h-32 overflow-y-auto border rounded bg-white text-sm">
              {results.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    className="w-full text-left px-2 py-1 hover:bg-gray-100"
                    onClick={() => {
                      onLinked(d.id);
                      setLinkedDoc(d);
                      setResults([]);
                      setSuccessMsg('Dokumentum csatolva.');
                    }}
                  >
                    {d.nev} {d.iktatoSzam ? `– ${d.iktatoSzam}` : ''}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div>
            <label className="text-xs text-gray-600">
              Új feltöltés ({DOC_TYPE_SUGGESTIONS[suggestionKey]})
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="block w-full text-xs mt-1"
              disabled={disabled || uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadNew(f);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
