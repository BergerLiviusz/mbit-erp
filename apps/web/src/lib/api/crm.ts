import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';

// Order Interfaces
export interface Order {
  id: string;
  accountId: string;
  quoteId?: string;
  azonosito: string;
  rendelesiDatum: string;
  szallitasiDatum?: string | null;
  teljesitesiDatum?: string | null;
  osszeg: number;
  afa: number;
  vegosszeg: number;
  allapot: string;
  megjegyzesek?: string | null;
  account?: {
    id: string;
    nev: string;
    azonosito: string;
    email?: string;
  };
  quote?: {
    id: string;
    azonosito: string;
  };
  items?: OrderItem[];
  returns?: Array<{
    id: string;
    allapot: string;
    mennyiseg: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemId: string;
  mennyiseg: number;
  egysegAr: number;
  kedvezmeny: number;
  osszeg: number;
  item?: {
    id: string;
    nev: string;
    azonosito: string;
  };
}

export interface CreateOrderDto {
  accountId: string;
  quoteId?: string;
  szallitasiDatum?: string;
  megjegyzesek?: string;
  items: Array<{
    itemId: string;
    mennyiseg: number;
    egysegAr: number;
    kedvezmeny?: number;
  }>;
}

export interface UpdateOrderDto {
  accountId?: string;
  szallitasiDatum?: string;
  teljesitesiDatum?: string;
  allapot?: string;
  megjegyzesek?: string;
  items?: Array<{
    itemId: string;
    mennyiseg: number;
    egysegAr: number;
    kedvezmeny?: number;
  }>;
}

export interface OrderStatusDto {
  allapot: string;
  megjegyzesek?: string;
}

export interface OrderFilters {
  allapot?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
}

// Order Hooks
export function useOrders(filters?: OrderFilters, skip = 0, take = 50) {
  return useQuery<any, Error, { total: number; data: Order[] }>({
    queryKey: ['orders', filters, skip, take],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.allapot) params.append('allapot', filters.allapot);
      if (filters?.accountId) params.append('accountId', filters.accountId);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      params.append('skip', String(skip));
      params.append('take', String(take));
      const response = await axios.get(`/api/crm/orders?${params.toString()}`);
      return response.data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery<any, Error, Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await axios.get(`/api/crm/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, CreateOrderDto>({
    mutationFn: async (newOrder: CreateOrderDto) => {
      const response = await axios.post('/api/crm/orders', newOrder);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, { id: string; data: UpdateOrderDto }>({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/api/crm/orders/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}

export function useOrderStatusChange() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, { id: string; data: OrderStatusDto }>({
    mutationFn: async ({ id, data }) => {
      const response = await axios.post(`/api/crm/orders/${id}/status`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, { id: string; megjegyzesek?: string }>({
    mutationFn: async ({ id, megjegyzesek }) => {
      const response = await axios.post(`/api/crm/orders/${id}/cancel`, {
        allapot: 'CANCELLED',
        megjegyzesek,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/crm/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

