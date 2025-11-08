import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Resolve relative DATABASE_URL to absolute path for consistency across environments
    let datasourceUrl = process.env.DATABASE_URL;
    
    if (datasourceUrl?.startsWith('file:./')) {
      const relativePath = datasourceUrl.replace('file:./', '');
      const absolutePath = join(process.cwd(), 'apps', 'server', relativePath);
      datasourceUrl = `file:${absolutePath}`;
    }
    
    // For Electron desktop mode, ensure the database file path is properly formatted
    // Prisma SQLite expects forward slashes even on Windows
    if (datasourceUrl?.startsWith('file:')) {
      const dbPath = datasourceUrl.replace('file:', '');
      // Ensure directory exists
      const dbDir = dbPath.substring(0, dbPath.lastIndexOf('/') || dbPath.lastIndexOf('\\'));
      if (dbDir && !existsSync(dbDir)) {
        const fs = require('fs');
        fs.mkdirSync(dbDir, { recursive: true });
        this.logger.log(`Created database directory: ${dbDir}`);
      }
    }
    
    super({
      datasources: {
        db: {
          url: datasourceUrl,
        },
      },
    });
    
    this.$use(async (params, next) => {
      const result = await next(params);
      return result;
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ Adatbázis kapcsolat létrejött');
    
    // In Electron mode, check if schema needs to be initialized
    const isElectron = process.env.ELECTRON_RUN_AS_NODE === '1';
    if (isElectron) {
      try {
        await this.ensureSchema();
      } catch (error) {
        this.logger.warn('Schema initialization check failed:', error);
      }
    }
  }

  private async ensureSchema() {
    try {
      // Try to query a table to see if schema exists
      await this.$queryRaw`SELECT 1 FROM felhasznalok LIMIT 1`.catch(() => {
        throw new Error('Tables do not exist');
      });
      this.logger.debug('Database schema already initialized');
    } catch (error) {
      // Tables don't exist - this is expected for new installations
      // The seed service will handle initialization through Prisma operations
      // which will create tables automatically when data is inserted
      this.logger.log('🌱 New database detected - schema will be initialized by seed service');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
