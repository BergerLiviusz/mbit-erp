import { useState } from 'react';
import Modal from '../Modal';
import { downloadInventoryReport, InventoryReportFilters } from '../../lib/api/logistics';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';

interface InventoryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWarehouseId?: string;
}

export default function InventoryReportModal({
  isOpen,
  onClose,
  defaultWarehouseId,
}: InventoryReportModalProps) {
  const [filters, setFilters] = useState<InventoryReportFilters>({
    warehouseId: defaultWarehouseId,
    format: 'pdf',
    lowStockOnly: false,
  });
  const [generating, setGenerating] = useState(false);

  const { data: warehousesData } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const response = await apiFetch('/logistics/warehouses?skip=0&take=100');
      return response.json();
    },
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      downloadInventoryReport(filters);
      setTimeout(() => {
        setGenerating(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Hiba a riport generálása során:', error);
      setGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leltárív nyomtatása" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Raktár</label>
          <select
            value={filters.warehouseId || ''}
            onChange={(e) =>
              setFilters({ ...filters, warehouseId: e.target.value || undefined })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Összes raktár</option>
            {warehousesData?.data?.map((warehouse: any) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.nev}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dátum</label>
          <input
            type="date"
            value={filters.date || ''}
            onChange={(e) => setFilters({ ...filters, date: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Formátum</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                value="pdf"
                checked={filters.format === 'pdf'}
                onChange={() => setFilters({ ...filters, format: 'pdf' })}
                className="mr-2"
              />
              <span>PDF</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                value="csv"
                checked={filters.format === 'csv'}
                onChange={() => setFilters({ ...filters, format: 'csv' })}
                className="mr-2"
              />
              <span>CSV</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                value="excel"
                checked={filters.format === 'excel'}
                onChange={() => setFilters({ ...filters, format: 'excel' })}
                className="mr-2"
              />
              <span>Excel</span>
            </label>
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.lowStockOnly || false}
              onChange={(e) => setFilters({ ...filters, lowStockOnly: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Csak alacsony készletű tételek
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={generating}
          >
            Mégse
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 bg-mbit-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {generating ? 'Generálás...' : 'Riport generálása'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

