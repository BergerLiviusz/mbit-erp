import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Permission, PermissionDescriptions } from './permission.enum';

/** Szerepkör → jogosultság kódok (meglévő DB-k automatikus szinkronjához). */
const ROLE_PERMISSION_CODES: Record<string, string[]> = {
  Admin: [], // üres = minden permission
  'Logistics Admin': [
    Permission.LOGISTICS_VIEW,
    Permission.LOGISTICS_CREATE,
    Permission.LOGISTICS_EDIT,
    Permission.LOGISTICS_UPDATE,
    Permission.LOGISTICS_DELETE,
    Permission.LOGISTICS_EXPORT,
    Permission.LOGISTICS_ADMIN,
    Permission.INVENTORY_MANAGE,
    Permission.PURCHASE_MANAGE,
    Permission.PRODUCT_VIEW,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_EDIT,
    Permission.PRODUCT_DELETE,
    Permission.WAREHOUSE_VIEW,
    Permission.WAREHOUSE_CREATE,
    Permission.WAREHOUSE_EDIT,
    Permission.WAREHOUSE_DELETE,
    Permission.WAREHOUSE_MANAGE_LOCATIONS,
    Permission.STOCK_VIEW,
    Permission.STOCK_EDIT,
    Permission.STOCK_MOVE,
    Permission.STOCK_ADJUST,
    Permission.STOCK_INVENTORY,
    Permission.STOCK_TRANSFER,
    Permission.PURCHASE_ORDER_VIEW,
    Permission.PURCHASE_ORDER_CREATE,
    Permission.PURCHASE_ORDER_EDIT,
    Permission.PURCHASE_ORDER_DELETE,
    Permission.PURCHASE_ORDER_APPROVE,
    Permission.PURCHASE_ORDER_RECEIVE,
    Permission.SUPPLIER_VIEW,
    Permission.SUPPLIER_CREATE,
    Permission.SUPPLIER_EDIT,
    Permission.SUPPLIER_DELETE,
    Permission.PRICE_LIST_VIEW,
    Permission.PRICE_LIST_CREATE,
    Permission.PRICE_LIST_EDIT,
    Permission.PRICE_LIST_DELETE,
    Permission.PRICE_LIST_IMPORT,
    Permission.PRICE_LIST_EXPORT,
    Permission.RETURN_VIEW,
    Permission.RETURN_CREATE,
    Permission.RETURN_EDIT,
    Permission.RETURN_APPROVE,
    Permission.RETURN_COMPLETE,
    Permission.INVENTORY_REPORT_PRINT,
    Permission.REPORT_VIEW,
    Permission.REPORT_EXPORT,
    Permission.SYSTEM_AUDIT_VIEW,
  ],
  'Warehouse User': [
    Permission.LOGISTICS_VIEW,
    Permission.PRODUCT_VIEW,
    Permission.WAREHOUSE_VIEW,
    Permission.STOCK_VIEW,
    Permission.STOCK_MOVE,
    Permission.STOCK_ADJUST,
    Permission.STOCK_INVENTORY,
    Permission.STOCK_TRANSFER,
    Permission.INVENTORY_MANAGE,
    Permission.RETURN_VIEW,
    Permission.RETURN_CREATE,
    Permission.INVENTORY_REPORT_PRINT,
  ],
  'Controlling Admin': [
    Permission.CONTROLLING_VIEW,
    Permission.CONTROLLING_EXPORT,
    Permission.CONTROLLING_ADMIN,
    Permission.KPI_MANAGE,
    Permission.REPORT_MANAGE,
    Permission.REPORT_VIEW,
    Permission.REPORT_CREATE,
    Permission.REPORT_EDIT,
    Permission.REPORT_DELETE,
    Permission.REPORT_EXPORT,
    Permission.SYSTEM_AUDIT_VIEW,
    Permission.SYSTEM_AUDIT_EXPORT,
    Permission.CRM_VIEW,
    Permission.DMS_VIEW,
    Permission.HR_VIEW,
    Permission.LOGISTICS_VIEW,
  ],
  Manager: [
    Permission.CONTROLLING_VIEW,
    Permission.CONTROLLING_EXPORT,
    Permission.REPORT_VIEW,
    Permission.REPORT_EXPORT,
    Permission.CRM_VIEW,
    Permission.DMS_VIEW,
    Permission.HR_VIEW,
    Permission.HR_REPORT,
    Permission.LOGISTICS_VIEW,
    Permission.SYSTEM_AUDIT_VIEW,
  ],
  Viewer: [
    Permission.CONTROLLING_VIEW,
    Permission.CRM_VIEW,
    Permission.DMS_VIEW,
    Permission.HR_VIEW,
    Permission.LOGISTICS_VIEW,
    Permission.PRODUCT_VIEW,
    Permission.WAREHOUSE_VIEW,
    Permission.STOCK_VIEW,
    Permission.PURCHASE_ORDER_VIEW,
    Permission.SUPPLIER_VIEW,
    Permission.PRICE_LIST_VIEW,
    Permission.RETURN_VIEW,
    Permission.REPORT_VIEW,
    Permission.SYSTEM_AUDIT_VIEW,
  ],
};

@Injectable()
export class PermissionSyncService implements OnModuleInit {
  private readonly logger = new Logger(PermissionSyncService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await this.syncAll();
    } catch (e: any) {
      this.logger.warn(`Permission sync skipped: ${e.message}`);
    }
  }

  async syncAll() {
    await this.syncPermissions();
    await this.syncRoles();
    await this.ensureControllingRoles();
    this.logger.log('Permission sync completed');
  }

  private async syncPermissions() {
    const entries = Object.values(Permission).map((kod) => ({
      kod,
      ...PermissionDescriptions[kod as Permission],
    }));

    for (const perm of entries) {
      await this.prisma.permission.upsert({
        where: { kod: perm.kod },
        update: { nev: perm.nev, modulo: perm.modulo, leiras: perm.leiras },
        create: perm,
      });
    }
  }

  private async ensureControllingRoles() {
    for (const [nev, leiras] of [
      ['Controlling Admin', 'Kontrolling modul teljes kezelése'],
      ['Manager', 'Vezetői riportok és export'],
    ] as const) {
      await this.prisma.role.upsert({
        where: { nev },
        update: {},
        create: { nev, leiras, permissions: JSON.stringify([]) },
      });
    }
  }

  private async syncRoles() {
    const allPerms = await this.prisma.permission.findMany();
    const permByCode = new Map(allPerms.map((p) => [p.kod, p.id]));
    const adminRole = await this.prisma.role.findFirst({ where: { nev: 'Admin' } });

    if (adminRole) {
      const adminModules = ['CRM', 'DMS', 'Logisztika', 'HR', 'Kontrolling', 'Rendszer', 'Jelentések', 'Felhasználók', 'Szerepkörök', 'Csapat kommunikáció'];
      for (const p of allPerms.filter((x) => adminModules.includes(x.modulo))) {
        await this.linkRolePermission(adminRole.id, p.id);
      }
    }

    for (const [roleName, codes] of Object.entries(ROLE_PERMISSION_CODES)) {
      if (roleName === 'Admin' && codes.length === 0) continue;
      const role = await this.prisma.role.findFirst({ where: { nev: roleName } });
      if (!role) continue;

      for (const kod of codes) {
        const pid = permByCode.get(kod);
        if (pid) await this.linkRolePermission(role.id, pid);
      }
    }

    const hrAdmin = await this.prisma.role.findFirst({ where: { nev: 'HR Admin' } });
    if (hrAdmin) {
      for (const p of allPerms.filter((x) => x.modulo === 'HR')) {
        await this.linkRolePermission(hrAdmin.id, p.id);
      }
    }
  }

  private async linkRolePermission(roleId: string, permissionId: string) {
    await this.prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId, permissionId },
      },
      update: {},
      create: { roleId, permissionId },
    });
  }
}
