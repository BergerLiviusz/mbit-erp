import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';

// Types
export interface Return {
  id: string;
  orderId?: string;
  purchaseOrderId?: string;
  itemId: string;
  warehouseId: string;
  mennyiseg: number;
  ok: 'hibas' | 'sertett' | 'tulcsordulas' | 'egyeb';
  allapot: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  visszaruDatum: string;
  megjegyzesek?: string;
  createdById?: string;
  approvedById?: string;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: string;
    azonosito: string;
  };
  purchaseOrder?: {
    id: string;
    azonosito: string;
  };
  item?: {
    id: string;
    azonosito: string;
    nev: string;
  };
  warehouse?: {
    id: string;
    azonosito: string;
    nev: string;
  };
  createdBy?: {
    id: string;
    nev: string;
    email: string;
  };
  approvedBy?: {
    id: string;
    nev: string;
    email: string;
  };
}

export interface Supplier {
  id: string;
  nev: string;
  adoszam?: string;
  cim?: string;
  email?: string;
  telefon?: string;
  aktiv: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    itemSuppliers: number;
    purchaseOrders: number;
  };
  itemSuppliers?: ItemSupplier[];
}

export interface ItemSupplier {
  id: string;
  itemId: string;
  supplierId: string;
  isPrimary: boolean;
  beszerzesiAr?: number;
  minMennyiseg?: number;
  szallitasiIdo?: number;
  megjegyzesek?: string;
  createdAt: string;
  updatedAt: string;
  item?: {
    id: string;
    azonosito: string;
    nev: string;
    egyseg: string;
  };
  supplier?: {
    id: string;
    nev: string;
  };
}

export interface CreateReturnDto {
  orderId?: string;
  purchaseOrderId?: string;
  itemId: string;
  warehouseId: string;
  mennyiseg: number;
  ok: 'hibas' | 'sertett' | 'tulcsordulas' | 'egyeb';
  visszaruDatum?: string;
  megjegyzesek?: string;
}

export interface UpdateReturnDto {
  itemId?: string;
  warehouseId?: string;
  mennyiseg?: number;
  ok?: 'hibas' | 'sertett' | 'tulcsordulas' | 'egyeb';
  visszaruDatum?: string;
  megjegyzesek?: string;
}

export interface CreateSupplierDto {
  nev: string;
  adoszam?: string;
  cim?: string;
  email?: string;
  telefon?: string;
  aktiv?: boolean;
}

export interface UpdateSupplierDto {
  nev?: string;
  adoszam?: string;
  cim?: string;
  email?: string;
  telefon?: string;
  aktiv?: boolean;
}

export interface LinkItemSupplierDto {
  supplierId: string;
  beszerzesiAr?: number;
  minMennyiseg?: number;
  szallitasiIdo?: number;
  megjegyzesek?: string;
  isPrimary?: boolean;
}

export interface InventoryReportFilters {
  warehouseId?: string;
  itemGroupId?: string;
  date?: string;
  format?: 'pdf' | 'csv' | 'excel';
  lowStockOnly?: boolean;
}

// Return hooks
export function useReturns(filters?: {
  orderId?: string;
  itemId?: string;
  warehouseId?: string;
  allapot?: string;
  skip?: number;
  take?: number;
}) {
  return useQuery({
    queryKey: ['returns', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      const response = await axios.get(`/api/logistics/returns?${params.toString()}`);
      return response.data;
    },
  });
}

export function useReturn(id: string) {
  return useQuery({
    queryKey: ['return', id],
    queryFn: async () => {
      const response = await axios.get(`/api/logistics/returns/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReturnDto) => {
      const response = await axios.post('/api/logistics/returns', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
    },
  });
}

export function useUpdateReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateReturnDto }) => {
      const response = await axios.put(`/api/logistics/returns/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['return', variables.id] });
    },
  });
}

export function useApproveReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, megjegyzesek }: { id: string; megjegyzesek?: string }) => {
      const response = await axios.post(`/api/logistics/returns/${id}/approve`, {
        megjegyzesek,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['return', variables.id] });
    },
  });
}

export function useRejectReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await axios.post(`/api/logistics/returns/${id}/reject`, {
        reason,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['return', variables.id] });
    },
  });
}

export function useCompleteReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.post(`/api/logistics/returns/${id}/complete`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['return', id] });
    },
  });
}

// Supplier hooks
export function useSuppliers(search?: string, skip = 0, take = 50) {
  return useQuery({
    queryKey: ['suppliers', search, skip, take],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('skip', String(skip));
      params.append('take', String(take));
      if (search) {
        params.append('search', search);
      }
      const response = await axios.get(`/api/logistics/suppliers?${params.toString()}`);
      return response.data;
    },
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: async () => {
      const response = await axios.get(`/api/logistics/suppliers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSupplierDto) => {
      const response = await axios.post('/api/logistics/suppliers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSupplierDto }) => {
      const response = await axios.put(`/api/logistics/suppliers/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier', variables.id] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/logistics/suppliers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

export function useLinkItemSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      itemId,
      supplierId,
      data,
    }: {
      itemId: string;
      supplierId: string;
      data: LinkItemSupplierDto;
    }) => {
      // Try item-based endpoint first, fallback to supplier-based endpoint
      try {
        const response = await axios.post(
          `/api/logistics/items/${itemId}/suppliers/${supplierId}/link`,
          data,
        );
        return response.data;
      } catch (error: any) {
        // Fallback to supplier-based endpoint if item-based doesn't exist
        if (error.response?.status === 404) {
          const response = await axios.post(
            `/api/logistics/suppliers/${supplierId}/items/${itemId}/link`,
            data,
          );
          return response.data;
        }
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier', variables.supplierId] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', variables.itemId] });
      queryClient.invalidateQueries({ queryKey: ['itemSuppliers', variables.itemId] });
    },
  });
}

export function useUnlinkItemSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, supplierId }: { itemId: string; supplierId: string }) => {
      // Try item-based endpoint first, fallback to supplier-based endpoint
      try {
        const response = await axios.delete(
          `/api/logistics/items/${itemId}/suppliers/${supplierId}/unlink`,
        );
        return response.data;
      } catch (error: any) {
        // Fallback to supplier-based endpoint if item-based doesn't exist
        if (error.response?.status === 404) {
          const response = await axios.delete(
            `/api/logistics/suppliers/${supplierId}/items/${itemId}/unlink`,
          );
          return response.data;
        }
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier', variables.supplierId] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', variables.itemId] });
      queryClient.invalidateQueries({ queryKey: ['itemSuppliers', variables.itemId] });
    },
  });
}

export function useSetPrimarySupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, supplierId }: { itemId: string; supplierId: string }) => {
      const response = await axios.put(
        `/api/logistics/items/${itemId}/suppliers/${supplierId}/primary`,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', variables.itemId] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

export function useItemSuppliers(itemId: string) {
  return useQuery({
    queryKey: ['item-suppliers', itemId],
    queryFn: async () => {
      const response = await axios.get(`/api/logistics/items/${itemId}/suppliers`);
      return response.data;
    },
    enabled: !!itemId,
  });
}

export function useSupplierItems(supplierId: string) {
  return useQuery({
    queryKey: ['supplier-items', supplierId],
    queryFn: async () => {
      const response = await axios.get(`/api/logistics/suppliers/${supplierId}/items`);
      return response.data;
    },
    enabled: !!supplierId,
  });
}

// Inventory Report hooks
export async function downloadInventoryReport(filters: InventoryReportFilters) {
  const params = new URLSearchParams();
  if (filters.warehouseId) {
    params.append('warehouseId', filters.warehouseId);
  }
  if (filters.itemGroupId) {
    params.append('itemGroupId', filters.itemGroupId);
  }
  if (filters.date) {
    params.append('date', filters.date);
  }
  if (filters.lowStockOnly) {
    params.append('lowStockOnly', 'true');
  }
  params.append('format', filters.format || 'pdf');

  const url = `/api/logistics/inventory/reports/print?${params.toString()}`;
  
  try {
    const response = await axios.get(url, {
      responseType: 'blob',
    });

    // Create blob URL
    const blob = new Blob([response.data]);
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = blobUrl;
    const extension = filters.format || 'pdf';
    link.download = `Leltariv_${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up blob URL
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Hiba a riport letöltése során:', error);
    throw error;
  }
}

// Price List types and hooks
export interface PriceList {
  id: string;
  supplierId: string;
  nev: string;
  ervenyessegKezdet: string;
  ervenyessegVeg?: string | null;
  aktiv: boolean;
  createdAt: string;
  updatedAt: string;
  supplier?: {
    id: string;
    nev: string;
    azonosito?: string;
  };
  items?: PriceListItem[];
  _count?: {
    items: number;
  };
}

export interface PriceListItem {
  id: string;
  priceListId: string;
  itemId: string;
  ar: number;
  valuta: string;
  createdAt: string;
  item?: {
    id: string;
    azonosito: string;
    nev: string;
    egyseg: string;
  };
}

export interface CreatePriceListDto {
  supplierId: string;
  nev: string;
  ervenyessegKezdet: string;
  ervenyessegVeg?: string;
  aktiv?: boolean;
}

export interface UpdatePriceListDto {
  nev?: string;
  ervenyessegKezdet?: string;
  ervenyessegVeg?: string;
  aktiv?: boolean;
}

export interface AddPriceListItemDto {
  itemId: string;
  ar: number;
  valuta?: string;
}

export interface UpdatePriceListItemDto {
  ar?: number;
  valuta?: string;
}

export function usePriceLists(filters?: {
  supplierId?: string;
  aktiv?: boolean;
  skip?: number;
  take?: number;
}) {
  return useQuery({
    queryKey: ['price-lists', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.supplierId) params.append('supplierId', filters.supplierId);
      if (filters?.aktiv !== undefined) params.append('aktiv', String(filters.aktiv));
      if (filters?.skip) params.append('skip', String(filters.skip));
      if (filters?.take) params.append('take', String(filters.take));

      const response = await axios.get(`/api/logistics/price-lists?${params.toString()}`);
      return response.data;
    },
  });
}

export function usePriceList(id: string) {
  return useQuery({
    queryKey: ['price-list', id],
    queryFn: async () => {
      const response = await axios.get(`/api/logistics/price-lists/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreatePriceList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePriceListDto) => {
      console.log('[useCreatePriceList] mutationFn called with data:', JSON.stringify(data, null, 2));
      console.log('[useCreatePriceList] data.supplierId:', data.supplierId, 'Type:', typeof data.supplierId);
      
      if (!data.supplierId || (typeof data.supplierId === 'string' && data.supplierId.trim() === '')) {
        console.error('[useCreatePriceList] ERROR: supplierId is empty!');
        throw new Error('Szállító megadása kötelező');
      }
      
      const response = await axios.post('/api/logistics/price-lists', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-lists'] });
    },
  });
}

export function useUpdatePriceList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePriceListDto }) => {
      const response = await axios.put(`/api/logistics/price-lists/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['price-lists'] });
      queryClient.invalidateQueries({ queryKey: ['price-list', variables.id] });
    },
  });
}

export function useDeletePriceList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/logistics/price-lists/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-lists'] });
    },
  });
}

export function useAddPriceListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ priceListId, data }: { priceListId: string; data: AddPriceListItemDto }) => {
      const response = await axios.post(`/api/logistics/price-lists/${priceListId}/items`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['price-list', variables.priceListId] });
      queryClient.invalidateQueries({ queryKey: ['price-lists'] });
    },
  });
}

export function useUpdatePriceListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ priceListId, itemId, data }: { priceListId: string; itemId: string; data: UpdatePriceListItemDto }) => {
      const response = await axios.put(`/api/logistics/price-lists/${priceListId}/items/${itemId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['price-list', variables.priceListId] });
      queryClient.invalidateQueries({ queryKey: ['price-lists'] });
    },
  });
}

export function useRemovePriceListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ priceListId, itemId }: { priceListId: string; itemId: string }) => {
      const response = await axios.delete(`/api/logistics/price-lists/${priceListId}/items/${itemId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['price-list', variables.priceListId] });
      queryClient.invalidateQueries({ queryKey: ['price-lists'] });
    },
  });
}

export async function importPriceListFromExcel(priceListId: string, file: File): Promise<{ success: number; errors: string[] }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`/api/logistics/price-lists/${priceListId}/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function exportPriceListToExcel(priceListId: string): Promise<void> {
  const response = await axios.get(`/api/logistics/price-lists/${priceListId}/export`, {
    responseType: 'blob',
  });

  // Get filename from Content-Disposition header
  const contentDisposition = response.headers['content-disposition'];
  let filename = `arlista_${priceListId}_${new Date().toISOString().split('T')[0]}.xlsx`;
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
    if (filenameMatch) {
      filename = filenameMatch[1];
    }
  }

  // Create blob URL
  const blob = new Blob([response.data]);
  const blobUrl = window.URL.createObjectURL(blob);
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up blob URL
  window.URL.revokeObjectURL(blobUrl);
}

