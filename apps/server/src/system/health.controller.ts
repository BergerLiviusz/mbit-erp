import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { BackupService } from '../common/backup/backup.service';
import { Public } from '../common/rbac/rbac.decorator';
import { PackageResolverService } from '../common/package/package-resolver.service';
import * as fs from 'fs/promises';

@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private backupService: BackupService,
    private packages: PackageResolverService,
  ) {}

  @Get()
  @Public()
  async getBasicHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('detailed')
  async getDetailedHealth() {
    let dbStatus = 'healthy';
    let dbLatency = 0;
    const dbStartTime = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStartTime;
    } catch (error) {
      dbStatus = 'unhealthy';
      dbLatency = -1;
    }

    let storageStatus = 'ok';
    let storageAvailable = true;
    const dataDir = this.storage.getBasePath();

    try {
      await fs.access(dataDir);
    } catch (error) {
      storageStatus = 'error';
      storageAvailable = false;
    }

    const overallStatus = dbStatus === 'healthy' && storageAvailable ? 'ok' : 'degraded';

    let ocrEnabled = false;
    try {
      const ocrSetting = await this.prisma.systemSetting.findUnique({
        where: { kulcs: 'dms.ocr.enabled' },
      });
      ocrEnabled = ocrSetting?.ertek === 'true';
    } catch {
      ocrEnabled = false;
    }

    let backupRaw: { total: number; latest?: { inditas?: Date } | null } = {
      total: 0,
      latest: null,
    };
    try {
      backupRaw = await this.backupService.getBackupStats();
    } catch {
      backupRaw = { total: 0, latest: null };
    }

    let orgName = '';
    try {
      const org = await this.prisma.systemSetting.findUnique({
        where: { kulcs: 'organization.name' },
      });
      orgName = org?.ertek || '';
    } catch {
      orgName = '';
    }

    const versionInfo = this.packages.getVersionInfo();

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: versionInfo.version,
      versionLabel: versionInfo.versionLabel,
      packageId: versionInfo.packageId,
      packageDisplayName: versionInfo.packageDisplayName,
      editionLabel: versionInfo.editionLabel,
      buildSha: versionInfo.buildSha,
      buildDate: versionInfo.buildDate,
      environment: versionInfo.environment,
      enabledModules: versionInfo.enabledModules,
      runtime: 'electron-desktop-on-premise',
      database: {
        type: 'sqlite',
        status: dbStatus,
        latency: dbLatency,
      },
      storage: {
        status: storageStatus,
        dataDir: dataDir,
        available: storageAvailable,
      },
      ocr: { enabled: ocrEnabled },
      backup: {
        totalBackups: backupRaw.total,
        lastBackup: backupRaw.latest?.inditas || null,
      },
      organizationName: orgName,
    };
  }
}
