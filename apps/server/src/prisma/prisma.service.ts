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
    // Ensure directory exists before Prisma tries to connect
    if (datasourceUrl?.startsWith('file:')) {
      const dbPath = datasourceUrl.replace('file:', '');
      // Ensure directory exists - handle both forward and backslashes
      const lastSlash = Math.max(dbPath.lastIndexOf('/'), dbPath.lastIndexOf('\\'));
      const dbDir = lastSlash > 0 ? dbPath.substring(0, lastSlash) : '';
      if (dbDir && !existsSync(dbDir)) {
        const fs = require('fs');
        fs.mkdirSync(dbDir, { recursive: true });
        // Can't use this.logger here, super() not called yet
        console.log(`[PrismaService] Created database directory: ${dbDir}`);
      }
    }
    
    // super() must be called before accessing 'this'
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
      await this.$queryRaw`SELECT 1 FROM felhasznalok LIMIT 1`;
      this.logger.debug('Database schema already initialized');
      return;
    } catch (error: any) {
      // Tables don't exist - need to create schema
      this.logger.log('🌱 New database detected - initializing schema...');
      
      try {
        // Use Prisma Migrate programmatically to push schema
        const { execSync } = require('child_process');
        const { join } = require('path');
        
        // In packaged Electron app, schema is in backend/prisma/schema.prisma
        const isElectron = process.env.ELECTRON_RUN_AS_NODE === '1';
        // process.resourcesPath is Electron-specific, cast to any to access it
        const resourcesPath = (process as any).resourcesPath;
        const schemaDir = isElectron && resourcesPath
          ? join(resourcesPath, 'backend', 'prisma')
          : join(__dirname, '..', '..', 'prisma');
        
        const schemaPath = join(schemaDir, 'schema.prisma');
        
        // Check if schema file exists
        if (!existsSync(schemaPath)) {
          this.logger.error('Prisma schema file not found at:', schemaPath);
          this.logger.error('Tried directory:', schemaDir);
          throw new Error('Schema file not found');
        }
        
        // Run prisma db push programmatically
        // Use Prisma CLI directly from node_modules
        const prismaCliPath = isElectron && resourcesPath
          ? join(resourcesPath, 'backend', 'node_modules', '.bin', 'prisma')
          : join(__dirname, '..', '..', '..', 'node_modules', '.bin', 'prisma');
        
        // Fallback to npx if direct path doesn't exist
        const prismaCommand = existsSync(prismaCliPath) 
          ? prismaCliPath 
          : 'npx prisma';
        
        this.logger.log('Running prisma db push to create tables...');
        this.logger.log('Schema path:', schemaPath);
        this.logger.log('Working directory:', schemaDir);
        this.logger.log('Prisma command:', prismaCommand);
        
        execSync(`${prismaCommand} db push --skip-generate --accept-data-loss`, {
          cwd: schemaDir,
          stdio: 'inherit',
          env: { ...process.env },
          shell: true,
        });
        this.logger.log('✅ Database schema created successfully');
      } catch (pushError: any) {
        this.logger.error('Failed to push schema:', pushError.message);
        if (pushError.stdout) {
          this.logger.error('stdout:', pushError.stdout.toString());
        }
        if (pushError.stderr) {
          this.logger.error('stderr:', pushError.stderr.toString());
        }
        // Don't throw - let seed service try to handle it
        // If schema doesn't exist, seed will fail gracefully
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
