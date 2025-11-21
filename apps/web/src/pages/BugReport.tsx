export default function BugReport() {
  const handleOpenEmailClient = async () => {
    const subject = 'Mbit ERP hibajelentés';
    const body = 'Kérem írja le részletesen a hibát:\n\n' +
                 '1. Mi történt?\n' +
                 '2. Mit várt?\n' +
                 '3. Mit tapasztalt?\n' +
                 '4. Milyen lépéseket követett?\n' +
                 '5. Melyik modulban/oldalon jelentkezett a hiba?\n\n' +
                 'Köszönjük a részletes leírást!';

    // Check if we're in Electron
    if (window.electron && window.electron.openEmailClient) {
      try {
        await window.electron.openEmailClient('contact@mbit.hu', subject, body);
      } catch (error) {
        console.error('Hiba az email kliens megnyitásakor:', error);
        // Fallback to mailto link
        const mailtoUrl = `mailto:contact@mbit.hu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
      }
    } else {
      // Fallback to mailto link for web browsers
      const mailtoUrl = `mailto:contact@mbit.hu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hibabejelentés</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-mbit-blue"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Hibabejelentés küldése</h2>
          <p className="text-gray-600 mb-6">
            Ha hibát talált az alkalmazásban, kérjük küldje el részletes leírását emailben.
            A gombra kattintva megnyílik az email kliens előre kitöltött adatokkal.
          </p>
          <button
            onClick={handleOpenEmailClient}
            className="bg-mbit-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg font-medium shadow-md hover:shadow-lg transition-all"
          >
            📧 Hibabejelentés küldése
          </button>
          <div className="mt-6 text-sm text-gray-500">
            <p>Címzett: <strong>contact@mbit.hu</strong></p>
            <p>Tárgy: <strong>Mbit ERP hibajelentés</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
