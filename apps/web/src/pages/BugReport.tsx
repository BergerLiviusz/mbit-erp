import { useState } from 'react';

export default function BugReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOpenEmailClient = () => {
    const recipient = 'contact@mbit.hu';
    const subject = 'MBit ERP Hibabejelentés';
    const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoUrl;
  };


  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hibabejelentés</h1>
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

      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-4">Hibabejelentés küldése</h2>
          <p className="text-gray-600 mb-6">
            Ha hibát talált az alkalmazásban, kérjük, kattintson az alábbi gombra, hogy megnyissa az email klienst és küldje el a hibabejelentést.
          </p>
          <button
            onClick={handleOpenEmailClient}
            className="bg-mbit-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg font-medium"
          >
            📧 Email kliens megnyitása
          </button>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Címzett:</strong> contact@mbit.hu<br />
            <strong>Tárgy:</strong> MBit ERP Hibabejelentés
          </p>
        </div>
      </div>
    </div>
  );
}

