import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export default function Logistics() {
  const [activeTab, setActiveTab] = useState<'items' | 'warehouses' | 'stock'>('items');

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const response = await axios.get('/api/logistics/items');
      return response.data;
    },
    enabled: activeTab === 'items',
  });

  const { data: warehouses, isLoading: warehousesLoading } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const response = await axios.get('/api/logistics/warehouses');
      return response.data;
    },
    enabled: activeTab === 'warehouses',
  });

  const { data: stock, isLoading: stockLoading } = useQuery({
    queryKey: ['stock'],
    queryFn: async () => {
      const response = await axios.get('/api/logistics/stock');
      return response.data;
    },
    enabled: activeTab === 'stock',
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Logisztika - Raktár & Készletkezelés</h1>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('items')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'items'
                ? 'border-mbit-blue text-mbit-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Cikktörzs ({items?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab('warehouses')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'warehouses'
                ? 'border-mbit-blue text-mbit-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Raktárak ({warehouses?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stock'
                ? 'border-mbit-blue text-mbit-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Készletek ({stock?.total || 0})
          </button>
        </nav>
      </div>

      {activeTab === 'items' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Cikktörzs Nyilvántartás</h2>
          </div>
          {itemsLoading ? (
            <div className="p-6">Betöltés...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azonosító</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Név</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Csoport</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Egység</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Beszerzési Ár</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Eladási Ár</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">ÁFA %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items?.items?.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.azonosito}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.nev}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.itemGroup?.nev || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.egyseg}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {item.beszerzesiAr.toLocaleString('hu-HU')} HUF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {item.eladasiAr.toLocaleString('hu-HU')} HUF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {item.afaKulcs}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'warehouses' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Raktár Nyilvántartás</h2>
          </div>
          {warehousesLoading ? (
            <div className="p-6">Betöltés...</div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {warehouses?.map((warehouse: any) => (
                <div key={warehouse.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{warehouse.nev}</h3>
                      <p className="text-sm text-gray-600">{warehouse.azonosito}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      warehouse.aktiv ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {warehouse.aktiv ? 'Aktív' : 'Inaktív'}
                    </span>
                  </div>
                  {warehouse.cim && (
                    <p className="text-sm text-gray-700 mb-2">{warehouse.cim}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Készlettételek: {warehouse.stockLots?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'stock' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Készlet Áttekintés</h2>
          </div>
          {stockLoading ? (
            <div className="p-6">Betöltés...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cikk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raktár</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Mennyiség</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Min. készlet</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Max. készlet</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Riasztás</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stock?.items?.map((lot: any) => (
                  <tr key={lot.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{lot.item?.nev}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lot.warehouse?.nev}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {lot.mennyiseg} {lot.item?.egyseg}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {lot.minKeszlet}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {lot.maxKeszlet || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {lot.mennyiseg <= lot.minKeszlet && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Alacsony
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4">
        <h3 className="font-bold mb-2">Logisztika Modul Funkciók:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Cikktörzs menedzsment cikkcsoportokkal</li>
          <li>• Többraktáros készletkezelés</li>
          <li>• Min/Max készletszint riasztások</li>
          <li>• Sarzs/gyártási szám nyomon követés</li>
          <li>• Árlista kezelés szállítónként</li>
          <li>• Beszerzési folyamat támogatás</li>
        </ul>
      </div>
    </div>
  );
}
