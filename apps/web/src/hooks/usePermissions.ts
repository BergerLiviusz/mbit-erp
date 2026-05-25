import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const cached = localStorage.getItem('user');
    if (cached) {
      try {
        const u = JSON.parse(cached);
        if (u.permissions?.length) {
          setPermissions(u.permissions);
          setRoles(u.roles || []);
          setLoading(false);
        }
      } catch {
        /* ignore */
      }
    }
    try {
      const res = await apiFetch('/auth/me');
      if (res.ok) {
        const data = await res.json();
        setPermissions(data.permissions || []);
        setRoles(data.roles || []);
        const prev = cached ? JSON.parse(cached) : {};
        localStorage.setItem(
          'user',
          JSON.stringify({ ...prev, ...data, permissions: data.permissions }),
        );
      }
    } catch {
      /* desktop may use admin fallback */
      setRoles(['Admin']);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isAdmin = roles.includes('Admin');

  const has = useCallback(
    (code: string) => {
      if (isAdmin) return true;
      return permissions.includes(code);
    },
    [permissions, isAdmin],
  );

  const hasAny = useCallback(
    (...codes: string[]) => codes.some((c) => has(c)),
    [has],
  );

  return {
    permissions,
    roles,
    loading,
    isAdmin,
    has,
    hasAny,
    canViewHr: has('hr:view'),
    canEditHr: hasAny('hr:edit', 'hr:create'),
    canDeleteHr: has('hr:delete'),
    canExportHr: hasAny('hr:export', 'hr:report'),
    canManageContracts: hasAny('hr:contract_manage', 'hr:edit', 'hr:create'),
    canViewCrm: has('crm:view'),
    canExportCrm: has('crm:export'),
    canViewDms: hasAny('document:view', 'dms:view'),
    canCreateDms: hasAny('dms:create', 'document:create', 'dms:upload'),
    canEditDms: hasAny('dms:edit', 'document:edit'),
    canExportDms: has('dms:export'),
    canViewAudit: has('system:audit_view'),
    canBackup: has('system:backup'),
    canViewLogistics: hasAny('logistics:view', 'product:view', 'stock:view'),
    canEditLogistics: hasAny('logistics:edit', 'logistics:create', 'inventory:manage'),
    canExportLogistics: hasAny('logistics:export', 'report:export', 'price_list:export'),
    canManagePurchase: hasAny('purchase:manage', 'purchase_order:create', 'purchase_order:receive'),
    canManageInventory: hasAny('inventory:manage', 'stock:move', 'stock:inventory'),
    canCreateProduct: hasAny('product:create', 'logistics:create'),
    canEditProduct: hasAny('product:edit', 'logistics:edit', 'logistics:update'),
    canDeleteProduct: hasAny('product:delete', 'logistics:delete'),
    canCreateWarehouse: hasAny('warehouse:create', 'logistics:create'),
    canEditWarehouse: hasAny('warehouse:edit', 'logistics:edit'),
    canDeleteWarehouse: hasAny('warehouse:delete', 'logistics:delete'),
    canClosePurchase: hasAny('purchase:manage', 'purchase_order:edit'),
    canViewControlling: hasAny('controlling:view', 'report:view'),
    canExportControlling: hasAny('controlling:export', 'report:export'),
    canManageKpi: hasAny('kpi:manage', 'controlling:admin'),
    canManageReports: hasAny('report:manage', 'controlling:admin'),
  };
}
