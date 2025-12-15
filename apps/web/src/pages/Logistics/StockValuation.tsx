import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import Modal from '../../components/Modal';

interface StockValuationResult {
  itemId: string;
  itemNev: string;
  warehouseId: string;
  warehouseNev: string;
  mennyiseg: number;
  ertekelesMod: string;
  készletérték: number;
  atlagBeszerzesiAr: number;
  lotDetails: Array<{
    lotId: string;
    sarzsGyartasiSzam?: string | null;
    mennyiseg: number;
    beszerzesiAr: number;
    ertek: number;
    createdAt: string;
  }>;
}

interface Warehouse {
  id: string;
  azonosito: string;
  nev: string;
  ertekelesMod: string;
}

interface ItemGroup {
  id: string;
  nev: string;
  leiras?: string | null;
}

const ERTEKELESI_MODOK = [
  { kod: 'FIFO', nev: 'FIFO (First In First Out)' },
  { kod: 'LIFO', nev: 'LIFO (Last In First Out)' },
  { kod: 'AVG', nev: 'Átlag (Average)' },
];

export default function StockValuation() {
  const [valuations, setValuations] = useState<StockValuationResult[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [selectedValuation, setSelectedValuation] = useState<StockValuationResult | null>(null);

  const [filters, setFilters] = useState({
    warehouseId: '',
    ertekelesMod: '',
    itemGroupId: '',
  });

  useEffect(() => {
    loadWarehouses();
    loadItemGroups();
    loadValuations();
  }, [filters]);

  const loadWarehouses = async () => {
    try {
      const response = await apiFetch('/logistics/warehouses?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setWarehouses(data.data || []);
      }
    } catch (err) {
      console.error('Hiba a raktárak betöltésekor:', err);
    }
  };

  const loadItemGroups = async () => {
    try {
      const response = await apiFetch('/logistics/item-groups?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setItemGroups(data.data || []);
      }
    } catch (err) {
      console.error('Hiba a cikkcsoportok betöltésekor:', err);
    }
  };

  const loadValuations = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.warehouseId) queryParams.append('warehouseId', filters.warehouseId);
      if (filters.ertekelesMod) queryParams.append('ertekelesMod', filters.ertekelesMod);
      if (filters.itemGroupId) queryParams.append('itemGroupId', filters.itemGroupId);

      const response = await apiFetch(`/logistics/stock-valuation/report?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setValuations(data || []);
      } else {
        throw new Error('Hiba a készletértékek betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMethodModal = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsMethodModalOpen(true);
  };

  const handleUpdateMethod = async (ertekelesMod: string) => {
    if (!selectedWarehouse) return;

    setError('');
    setSuccess('');

    try {
      const response = await apiFetch(`/logistics/stock-valuation/warehouse/${selectedWarehouse.id}/method`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ertekelesMod }),
      });

      if (!response.ok) {
        throw new Error('Hiba az értékelési módszer módosításakor');
      }

      setSuccess('Értékelési módszer sikeresen frissítve!');
      setTimeout(() => {
        setIsMethodModalOpen(false);
        loadWarehouses();
        loadValuations();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const totalValue = valuations.reduce((sum, v) => sum + v.készletérték, 0);
  const totalQuantity = valuations.reduce((sum, v) => sum + v.mennyiseg, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Készletérték Értékelés</h1>
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

      {/* Szűrők */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raktár</label>
            <select
              value={filters.warehouseId}
              onChange={(e) => setFilters({ ...filters, warehouseId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes raktár</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>
                  {w.nev} ({w.azonosito})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cikkcsoport</label>
            <select
              value={filters.itemGroupId}
              onChange={(e) => setFilters({ ...filters, itemGroupId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes cikkcsoport</option>
              {itemGroups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.nev}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Értékelési módszer</label>
            <select
              value={filters.ertekelesMod}
              onChange={(e) => setFilters({ ...filters, ertekelesMod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Összes</option>
              {ERTEKELESI_MODOK.map(m => (
                <option key={m.kod} value={m.kod}>{m.nev}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Raktárak értékelési módszerei */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Raktárak értékelési módszerei</h2>
        <div className="grid grid-cols-3 gap-4">
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="border rounded p-3">
              <div className="font-medium">{warehouse.nev}</div>
              <div className="text-sm text-gray-600 mt-1">
                Módszer: <span className="font-medium">
                  {ERTEKELESI_MODOK.find(m => m.kod === warehouse.ertekelesMod)?.nev || warehouse.ertekelesMod}
                </span>
              </div>
              <button
                onClick={() => handleOpenMethodModal(warehouse)}
                className="mt-2 text-sm text-mbit-blue hover:text-blue-600"
              >
                Módosítás
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Készletérték riport */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Készletérték riport</h2>
            <div className="text-right">
              <div className="text-sm text-gray-600">Összes készletérték:</div>
              <div className="text-2xl font-bold text-green-600">
                {totalValue.toLocaleString('hu-HU')} HUF
              </div>
              <div className="text-xs text-gray-500">
                {totalQuantity.toLocaleString('hu-HU')} db összesen
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : valuations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs készletérték adat</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Termék</th>
                  <th className="text-left p-4 font-medium text-gray-700">Raktár</th>
                  <th className="text-right p-4 font-medium text-gray-700">Mennyiség</th>
                  <th className="text-right p-4 font-medium text-gray-700">Átlag beszerzési ár</th>
                  <th className="text-right p-4 font-medium text-gray-700">Készletérték</th>
                  <th className="text-left p-4 font-medium text-gray-700">Módszer</th>
                  <th className="text-right p-4 font-medium text-gray-700">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {valuations.map((valuation) => (
                  <tr key={`${valuation.itemId}-${valuation.warehouseId}`} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{valuation.itemNev}</td>
                    <td className="p-4 text-sm text-gray-600">{valuation.warehouseNev}</td>
                    <td className="p-4 text-sm text-right text-gray-600">
                      {valuation.mennyiseg.toLocaleString('hu-HU')} db
                    </td>
                    <td className="p-4 text-sm text-right text-gray-600">
                      {valuation.atlagBeszerzesiAr.toLocaleString('hu-HU')} HUF
                    </td>
                    <td className="p-4 font-medium text-right text-gray-900">
                      {valuation.készletérték.toLocaleString('hu-HU')} HUF
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {ERTEKELESI_MODOK.find(m => m.kod === valuation.ertekelesMod)?.nev || valuation.ertekelesMod}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedValuation(valuation)}
                        className="text-mbit-blue hover:text-blue-600 text-sm"
                      >
                        Részletek
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t">
                <tr>
                  <td colSpan={4} className="p-4 font-medium text-right">Összesen:</td>
                  <td className="p-4 font-bold text-right text-green-600">
                    {totalValue.toLocaleString('hu-HU')} HUF
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Értékelési módszer módosítás modal */}
      <Modal
        isOpen={isMethodModalOpen}
        onClose={() => setIsMethodModalOpen(false)}
        title={selectedWarehouse ? `Értékelési módszer: ${selectedWarehouse.nev}` : 'Értékelési módszer'}
        size="md"
      >
        {selectedWarehouse && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Értékelési módszer <span className="text-red-500">*</span>
              </label>
              <select
                defaultValue={selectedWarehouse.ertekelesMod}
                onChange={(e) => handleUpdateMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ERTEKELESI_MODOK.map(m => (
                  <option key={m.kod} value={m.kod}>{m.nev}</option>
                ))}
              </select>
            </div>
            <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
              <div className="font-medium mb-1">Módszerek magyarázata:</div>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>FIFO:</strong> Első be, első ki - a legrégebben beszerzett tételek kerülnek először értékesítésre</li>
                <li><strong>LIFO:</strong> Utolsó be, első ki - a legújabb beszerzések kerülnek először értékesítésre</li>
                <li><strong>Átlag:</strong> Súlyozott átlagos beszerzési ár alapján történik az értékelés</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setIsMethodModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Bezárás
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Részletek modal */}
      <Modal
        isOpen={selectedValuation !== null}
        onClose={() => setSelectedValuation(null)}
        title={selectedValuation ? `Készletérték részletek: ${selectedValuation.itemNev}` : 'Részletek'}
        size="lg"
      >
        {selectedValuation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Raktár</div>
                <div className="font-medium">{selectedValuation.warehouseNev}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Értékelési módszer</div>
                <div className="font-medium">
                  {ERTEKELESI_MODOK.find(m => m.kod === selectedValuation.ertekelesMod)?.nev || selectedValuation.ertekelesMod}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Összes mennyiség</div>
                <div className="font-medium">{selectedValuation.mennyiseg.toLocaleString('hu-HU')} db</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Átlagos beszerzési ár</div>
                <div className="font-medium">{selectedValuation.atlagBeszerzesiAr.toLocaleString('hu-HU')} HUF</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-gray-600">Összes készletérték</div>
                <div className="text-2xl font-bold text-green-600">
                  {selectedValuation.készletérték.toLocaleString('hu-HU')} HUF
                </div>
              </div>
            </div>

            {/* Sarzs részletek */}
            {selectedValuation.lotDetails && selectedValuation.lotDetails.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Sarzs részletek</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 font-medium text-gray-700">Sarzs/Gyártási szám</th>
                        <th className="text-right p-2 font-medium text-gray-700">Mennyiség</th>
                        <th className="text-right p-2 font-medium text-gray-700">Beszerzési ár</th>
                        <th className="text-right p-2 font-medium text-gray-700">Érték</th>
                        <th className="text-left p-2 font-medium text-gray-700">Beszerzés dátuma</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedValuation.lotDetails.map((lot, index) => (
                        <tr key={lot.lotId}>
                          <td className="p-2">{lot.sarzsGyartasiSzam || `#${index + 1}`}</td>
                          <td className="p-2 text-right">{lot.mennyiseg.toLocaleString('hu-HU')} db</td>
                          <td className="p-2 text-right">{lot.beszerzesiAr.toLocaleString('hu-HU')} HUF</td>
                          <td className="p-2 text-right font-medium">{lot.ertek.toLocaleString('hu-HU')} HUF</td>
                          <td className="p-2 text-sm text-gray-600">
                            {new Date(lot.createdAt).toLocaleDateString('hu-HU')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

