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
    const checks: any[] = [];

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.push({
        name: 'Database',
        status: 'ok',
        details: 'Connection successful',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      checks.push({
        name: 'Database',
        status: 'error',
        details: errorMessage,
      });
    }

    try {
      const dataDir = this.storage.getBasePath();
      await fs.access(dataDir);
      checks.push({
        name: 'Data Directory',
        status: 'ok',
        details: `Accessible at ${dataDir}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      checks.push({
        name: 'Data Directory',
        status: 'error',
        details: errorMessage,
      });
    }

    const memUsage = process.memoryUsage();
    checks.push({
      name: 'Memory',
      status: 'ok',
      details: {
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
        rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      },
    });

    checks.push({
      name: 'System',
      status: 'ok',
      details: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        freeMemory: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
        totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
        uptime: `${Math.round(os.uptime() / 60)} minutes`,
      },
    });

    const overallStatus = checks.every((c) => c.status === 'ok') ? 'ok' : 'degraded';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
