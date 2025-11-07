import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { Public } from '../common/rbac/rbac.decorator';
import * as os from 'os';
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

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
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
