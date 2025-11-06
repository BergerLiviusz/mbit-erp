import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { StorageService } from '../common/storage/storage.service';
import { BackupService } from '../common/backup/backup.service';
import { AuditService } from '../common/audit/audit.service';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

@Controller('system/diagnostics')
export class DiagnosticsController {
  constructor(
    private storage: StorageService,
    private backupService: BackupService,
    private auditService: AuditService,
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
}
