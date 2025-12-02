import { useEffect, useState } from 'react';
import { getExpiringProducts, getLowStockItems, getUpcomingTaskDeadlines, getExpiringDocuments, ExpiringProduct, LowStockItem, UpcomingTask, ExpiringDocument } from '../lib/api/notifications';

const isElectron = !!(window as any).electron || (navigator.userAgent.includes('Electron'));

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [expiringProducts, setExpiringProducts] = useState<ExpiringProduct[]>([]);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);
  const [expiringDocuments, setExpiringDocuments] = useState<ExpiringDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    if (!isElectron) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [products, stock, tasks, documents] = await Promise.all([
        getExpiringProducts(30).catch(() => []),
        getLowStockItems().catch(() => []),
        getUpcomingTaskDeadlines(7).catch(() => []),
        getExpiringDocuments().catch(() => []),
      ]);
      
      setExpiringProducts(products);
      setLowStockItems(stock);
      setUpcomingTasks(tasks);
      setExpiringDocuments(documents);

      // Show Windows notifications for urgent items
      if (isElectron && (window as any).electron?.showNotification) {
        const urgentDocs = documents.filter(d => d.napokHatra <= 3);
        if (urgentDocs.length > 0) {
          const doc = urgentDocs[0];
          (window as any).electron.showNotification(
            'Lejáró dokumentum',
            `${doc.documentNev} ${doc.napokHatra} nap múlva lejár${urgentDocs.length > 1 ? ` (+${urgentDocs.length - 1} további)` : ''}`,
            { urgency: 'critical' }
          );
        }
      }
    } catch (err: any) {
      setError(err.message || 'Hiba az értesítések betöltésekor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isElectron) return;
    
    loadNotifications();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isElectron) return null;

  const totalNotifications = expiringProducts.length + lowStockItems.length + upcomingTasks.length + expiringDocuments.length;
  const urgentCount = expiringProducts.filter(p => p.daysUntilExpiration <= 7).length +
                     upcomingTasks.filter(t => t.daysUntilDeadline !== null && t.daysUntilDeadline <= 3).length +
                     expiringDocuments.filter(d => d.napokHatra <= 3).length;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2"
        style={{ zIndex: 9999 }}
        title="Értesítések"
      >
        <span>🔔</span>
        {totalNotifications > 0 && (
          <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
            {totalNotifications}
          </span>
        )}
        {urgentCount > 0 && totalNotifications === 0 && (
          <span className="bg-yellow-400 text-yellow-900 rounded-full px-2 py-0.5 text-xs font-bold">
            {urgentCount}
          </span>
        )}
      </button>
      
      {/* Notification panel */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 w-96 h-[500px] bg-white border-2 border-gray-400 rounded-lg shadow-2xl z-50 flex flex-col"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between rounded-t-lg">
            <h3 className="font-bold">Értesítések</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Betöltés...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : totalNotifications === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nincsenek értesítések
              </div>
            ) : (
              <div className="space-y-4">
                {/* Expiring Products */}
                {expiringProducts.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-orange-500">⚠️</span>
                      Lejáró termékek ({expiringProducts.length})
                    </h4>
                    <div className="space-y-2">
                      {expiringProducts.slice(0, 5).map((product, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded text-xs border-l-4 ${
                            product.daysUntilExpiration <= 7
                              ? 'bg-red-50 border-red-500'
                              : product.daysUntilExpiration <= 14
                              ? 'bg-orange-50 border-orange-500'
                              : 'bg-yellow-50 border-yellow-500'
                          }`}
                        >
                          <div className="font-semibold">{product.itemName}</div>
                          <div className="text-gray-600">
                            {product.warehouseName} • {product.daysUntilExpiration} nap múlva lejár
                          </div>
                        </div>
                      ))}
                      {expiringProducts.length > 5 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{expiringProducts.length - 5} további...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Low Stock Items */}
                {lowStockItems.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-red-500">📦</span>
                      Alacsony készlet ({lowStockItems.length})
                    </h4>
                    <div className="space-y-2">
                      {lowStockItems.slice(0, 5).map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded text-xs bg-red-50 border-l-4 border-red-500"
                        >
                          <div className="font-semibold">{item.itemName}</div>
                          <div className="text-gray-600">
                            {item.warehouseName} • Készlet: {item.currentStock} (Min: {item.minimumStock})
                          </div>
                        </div>
                      ))}
                      {lowStockItems.length > 5 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{lowStockItems.length - 5} további...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Upcoming Task Deadlines */}
                {upcomingTasks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-blue-500">📋</span>
                      Közelgő határidők ({upcomingTasks.length})
                    </h4>
                    <div className="space-y-2">
                      {upcomingTasks.slice(0, 5).map((task, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded text-xs border-l-4 ${
                            task.daysUntilDeadline !== null && task.daysUntilDeadline <= 3
                              ? 'bg-red-50 border-red-500'
                              : 'bg-blue-50 border-blue-500'
                          }`}
                        >
                          <div className="font-semibold">{task.cim}</div>
                          <div className="text-gray-600">
                            {task.daysUntilDeadline !== null
                              ? `${task.daysUntilDeadline} nap múlva`
                              : 'Határidő nélkül'}
                            {task.assignedTo && ` • ${task.assignedTo.nev}`}
                          </div>
                        </div>
                      ))}
                      {upcomingTasks.length > 5 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{upcomingTasks.length - 5} további...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Expiring Documents */}
                {expiringDocuments.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-purple-500">📄</span>
                      Lejáró dokumentumok ({expiringDocuments.length})
                    </h4>
                    <div className="space-y-2">
                      {expiringDocuments.slice(0, 5).map((doc, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded text-xs border-l-4 ${
                            doc.napokHatra <= 3
                              ? 'bg-red-50 border-red-500'
                              : doc.napokHatra <= 7
                              ? 'bg-orange-50 border-orange-500'
                              : 'bg-yellow-50 border-yellow-500'
                          }`}
                        >
                          <div className="font-semibold">{doc.documentNev}</div>
                          <div className="text-gray-600">
                            {doc.iktatoSzam && `${doc.iktatoSzam} • `}
                            {doc.napokHatra} nap múlva lejár
                            {doc.createdBy && ` • ${doc.createdBy.nev}`}
                          </div>
                        </div>
                      ))}
                      {expiringDocuments.length > 5 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{expiringDocuments.length - 5} további...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-gray-100 px-4 py-2 border-t border-gray-300 rounded-b-lg flex items-center justify-between text-xs">
            <span>Összesen: {totalNotifications}</span>
            <button
              onClick={loadNotifications}
              className="text-blue-600 hover:text-blue-800"
            >
              Frissítés
            </button>
          </div>
        </div>
      )}
    </>
  );
}

