import { useState } from 'react';
import { apiFetch } from '../../lib/api';

interface Props {
  accountId: string;
  onSaved?: () => void;
}

export default function CustomerCommunications({ accountId, onSaved }: Props) {
  const [channel, setChannel] = useState<'EMAIL' | 'CHAT'>('EMAIL');
  const [targy, setTargy] = useState('');
  const [szoveg, setSzoveg] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiFetch('/crm/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, channel, targy, szoveg, tipus: 'KIMENO' }),
    });
    if (res.ok) {
      setMsg('Mentve');
      setTargy('');
      setSzoveg('');
      onSaved?.();
    }
  };

  return (
    <form onSubmit={submit} className="border rounded p-3 bg-gray-50 space-y-2">
      <h4 className="font-medium text-sm">Új kommunikáció rögzítése</h4>
      <select
        className="border rounded px-2 py-1 text-sm w-full"
        value={channel}
        onChange={(e) => setChannel(e.target.value as 'EMAIL' | 'CHAT')}
      >
        <option value="EMAIL">E-mail (lokális napló)</option>
        <option value="CHAT">Chat / belső üzenet</option>
      </select>
      <input
        className="border rounded px-2 py-1 text-sm w-full"
        placeholder="Tárgy"
        value={targy}
        onChange={(e) => setTargy(e.target.value)}
      />
      <textarea
        className="border rounded px-2 py-1 text-sm w-full"
        rows={3}
        placeholder="Üzenet tartalma"
        value={szoveg}
        onChange={(e) => setSzoveg(e.target.value)}
        required
      />
      <button type="submit" className="text-sm bg-mbit-blue text-white px-3 py-1 rounded">
        Mentés
      </button>
      {msg && <span className="text-green-700 text-xs">{msg}</span>}
    </form>
  );
}
