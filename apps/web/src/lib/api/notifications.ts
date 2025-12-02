import { apiFetch } from '../api';

export interface ExpiringProduct {
  itemId: string;
  itemName: string;
  itemAzonosito: string;
  warehouseId: string;
  warehouseName: string;
  expirationDate: string;
  daysUntilExpiration: number;
  quantity: number;
}

export interface LowStockItem {
  id: string;
  itemId: string;
  itemName: string;
  itemAzonosito: string;
  warehouseId: string;
  warehouseName: string;
  currentStock: number;
  minimumStock: number | null;
  maximumStock: number | null;
}

export interface UpcomingTask {
  id: string;
  cim: string;
  hataridoDatum: string | null;
  daysUntilDeadline: number | null;
  prioritas: string;
  allapot: string;
  assignedTo?: {
    id: string;
    nev: string;
    email: string;
  } | null;
  createdBy?: {
    id: string;
    nev: string;
    email: string;
  } | null;
}

export interface ExpiringDocument {
  id: string;
  documentId: string;
  documentNev: string;
  iktatoSzam?: string | null;
  lejaratDatum: string;
  napokHatra: number;
  felelos?: string | null;
  createdBy?: {
    id: string;
    nev: string;
    email: string;
  } | null;
}

export async function getExpiringProducts(days: number = 30): Promise<ExpiringProduct[]> {
  const response = await apiFetch(`/logistics/notifications/products?days=${days}`);
  if (!response.ok) {
    throw new Error('Failed to fetch expiring products');
  }
  return response.json();
}

export async function getLowStockItems(): Promise<LowStockItem[]> {
  const response = await apiFetch('/logistics/notifications/stock');
  if (!response.ok) {
    throw new Error('Failed to fetch low stock items');
  }
  return response.json();
}

export async function getUpcomingTaskDeadlines(days: number = 7): Promise<UpcomingTask[]> {
  const response = await apiFetch(`/team/tasks/upcoming-deadlines?days=${days}`);
  if (!response.ok) {
    throw new Error('Failed to fetch upcoming task deadlines');
  }
  return response.json();
}

export async function getExpiringDocuments(): Promise<ExpiringDocument[]> {
  const response = await apiFetch('/dms/document-notifications/expiring');
  if (!response.ok) {
    throw new Error('Failed to fetch expiring documents');
  }
  return response.json();
}

