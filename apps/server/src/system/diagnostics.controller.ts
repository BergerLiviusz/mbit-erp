import { Controller, Get, Post, Res, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { StorageService } from '../common/storage/storage.service';
import { BackupService } from '../common/backup/backup.service';
import { AuditService } from '../common/audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

@Controller('system/diagnostics')
@UseGuards(RbacGuard)
export class DiagnosticsController {
  constructor(
    private storage: StorageService,
    private backupService: BackupService,
    private auditService: AuditService,
    private prisma: PrismaService,
  ) {}

  @Get('logs/download')
  @Permissions(Permission.SYSTEM_DIAGNOSTICS)
  async downloadLogs(@Res() res: Response) {
    const logsDir = this.storage.getPath('logs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const zipFileName = `diagnostics-${timestamp}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.pipe(res);

    const manifest = {
      generated: new Date().toISOString(),
      type: 'diagnostics',
      version: '1.0.0',
    };

    archive.append(JSON.stringify(manifest, null, 2), {
      name: 'manifest.json',
    });

    try {
      const logFiles = await this.storage.listFiles('logs');
      const now = Date.now();
      const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;

      for (const file of logFiles) {
        try {
          const filePath = path.join(logsDir, file);
          const stats = await fs.promises.stat(filePath);

          if (stats.mtimeMs >= threeDaysAgo) {
            archive.file(filePath, { name: `logs/${file}` });
          }
        } catch (error) {
          console.error(`Failed to add log file ${file}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to read log directory:', error);
    }

    await archive.finalize();

    await this.auditService.log({
      esemeny: 'export',
      entitas: 'Diagnostics',
      entitasId: 'logs',
    });
  }

  @Get('stats')
  @Permissions(Permission.SYSTEM_DIAGNOSTICS)
  async getStats() {
    const backupStats = await this.backupService.getBackupStats();
    const recentActivity = await this.auditService.getRecentActivity(10);

    return {
      backup: backupStats,
      recentActivity,
    };
  }

  @Post('backup/now')
  @Permissions(Permission.SYSTEM_BACKUP)
  async runBackupNow() {
    const result = await this.backupService.createBackup('manual');
    await this.auditService.log({
      esemeny: 'create',
      entitas: 'Backup',
      entitasId: result.id,
    });
    return {
      message: 'Biztonsági mentés elindítva',
      ...result,
    };
  }

  @Get('backup/list')
  @Permissions(Permission.SYSTEM_BACKUP)
  async listBackups() {
    return await this.backupService.listBackups();
  }

  @Get('permissions/check-admin')
  @Permissions(Permission.SYSTEM_DIAGNOSTICS)
  async checkAdminPermissions() {
    const adminUser = await this.prisma.user.findUnique({
      where: { email: 'admin@mbit.hu' },
      include: {
        roles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!adminUser) {
      return { error: 'Admin user not found' };
    }

    const allPermissions = new Set<string>();
    const roles = [];

    for (const userRole of adminUser.roles) {
      const rolePerms = userRole.role.rolePermissions.map(rp => rp.permission.kod);
      roles.push({
        name: userRole.role.nev,
        permissionsCount: rolePerms.length,
        permissions: rolePerms.sort(),
      });
      rolePerms.forEach(p => allPermissions.add(p));
    }

    return {
      user: adminUser.email,
      rolesCount: adminUser.roles.length,
      roles,
      totalUniquePermissions: allPermissions.size,
      hasCustomerCreate: allPermissions.has('customer:create'),
      customerPermissions: Array.from(allPermissions).filter(p => p.startsWith('customer:')),
      crmPermissions: Array.from(allPermissions).filter(p => p.startsWith('crm:')),
    };
  }

  @Post('permissions/fix-admin')
  @Permissions(Permission.SYSTEM_DIAGNOSTICS)
  @HttpCode(HttpStatus.OK)
  async fixAdminPermissions() {
    const adminUser = await this.prisma.user.findUnique({
      where: { email: 'admin@mbit.hu' },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!adminUser || adminUser.roles.length === 0) {
      return { error: 'Admin user or role not found' };
    }

    const adminRole = adminUser.roles[0].role;
    
    // Get all permissions that admin should have
    const allPermissions = await this.prisma.permission.findMany({
      where: {
        OR: [
          { modulo: 'CRM' },
          { modulo: 'DMS' },
          { modulo: 'Logisztika' },
          { modulo: 'Rendszer' },
          { modulo: 'Felhasználók' },
          { modulo: 'Szerepkörök' },
          { modulo: 'Jelentések' },
        ],
      },
    });

    let addedCount = 0;

    for (const perm of allPermissions) {
      const exists = await this.prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: perm.id,
          },
        },
      });

      if (!exists) {
        await this.prisma.rolePermission.create({
          data: {
            roleId: adminRole.id,
            permissionId: perm.id,
          },
        });
        addedCount++;
      }
    }

    return {
      message: 'Admin permissions updated successfully',
      addedPermissions: addedCount,
      totalPermissions: allPermissions.length,
      adminRole: adminRole.nev,
    };
  }
}
