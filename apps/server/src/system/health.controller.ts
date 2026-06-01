import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { Public } from '../common/rbac/rbac.decorator';
import {
  getActivePackageIdFromEnv,
  getPackageDefinition,
} from '@mbit-erp/config';
import * as fs from 'fs/promises';

@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
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
    const packageId = getActivePackageIdFromEnv();
    const pkg = getPackageDefinition(packageId);

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || pkg.version,
      packageId: pkg.id,
      edition: pkg.editionLabel,
      database: {
        status: dbStatus,
        latency: dbLatency,
      },
      storage: {
        status: storageStatus,
        dataDir: dataDir,
        available: storageAvailable,
      },
    };
  }
}
