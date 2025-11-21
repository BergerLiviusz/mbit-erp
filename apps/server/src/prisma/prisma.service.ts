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
    
    // In Electron mode, always ensure schema is up-to-date
    const isElectron = process.env.ELECTRON_RUN_AS_NODE === '1';
    if (isElectron) {
      try {
        // Always run db push in Electron to ensure schema is synced
        await this.ensureSchemaSync();
      } catch (error: any) {
        this.logger.warn('Schema sync check failed:', error.message);
        // Try fallback method
        try {
          await this.ensureSchema();
        } catch (fallbackError: any) {
          this.logger.warn('Fallback schema initialization also failed:', fallbackError.message);
        }
      }
    }
    
    // Check and add missing columns (migrations)
    try {
      await this.applyMigrations();
    } catch (error) {
      this.logger.warn('Migration check failed:', error);
    }
  }

  private async applyMigrations() {
    try {
      // Check if txtFajlUtvonal column exists in OCRJob table
      try {
        const tableInfo = await this.$queryRaw<Array<{ name: string }>>`
          PRAGMA table_info(ocr_feladatok);
        `;
        
        const hasTxtFajlUtvonal = tableInfo.some(col => col.name === 'txtFajlUtvonal');
        
        if (!hasTxtFajlUtvonal) {
          this.logger.log('Adding missing column txtFajlUtvonal to ocr_feladatok table...');
          await this.$executeRaw`
            ALTER TABLE ocr_feladatok ADD COLUMN txtFajlUtvonal TEXT;
          `;
          this.logger.log('✅ Column txtFajlUtvonal added successfully');
        }
      } catch (ocrError: any) {
        // OCR table might not exist yet, which is fine
        if (!ocrError.message?.includes('no such table')) {
          this.logger.warn('OCR table migration check error:', ocrError.message);
        }
      }

      // Check if task_boardok table exists
      try {
        await this.$queryRaw`SELECT 1 FROM task_boardok LIMIT 1`;
        this.logger.debug('Task board table exists');
      } catch (boardError: any) {
        if (boardError.message?.includes('no such table') || boardError.message?.includes('does not exist')) {
          this.logger.warn('⚠️ Task board table does not exist - migrations may not have run');
          this.logger.warn('This may cause errors when creating boards. Please run: npx prisma migrate deploy');
          
          // Try to run migrations programmatically if in Electron mode
          const isElectron = process.env.ELECTRON_RUN_AS_NODE === '1';
          if (isElectron) {
            try {
              await this.runMigrationsProgrammatically();
            } catch (migrateError: any) {
              this.logger.error('Failed to run migrations programmatically:', migrateError.message);
            }
          }
        }
      }
    } catch (error: any) {
      this.logger.warn('Migration check error:', error.message);
    }
  }

  private async runMigrationsProgrammatically() {
    try {
      const { execSync } = require('child_process');
      const { join } = require('path');
      
      const isElectron = process.env.ELECTRON_RUN_AS_NODE === '1';
      const resourcesPath = (process as any).resourcesPath;
      const prismaDir = isElectron && resourcesPath
        ? join(resourcesPath, 'backend', 'prisma')
        : join(__dirname, '..', '..', 'prisma');
      
      const nodeModulesDir = isElectron && resourcesPath
        ? join(resourcesPath, 'backend', 'node_modules')
        : join(__dirname, '..', '..', 'node_modules');
      
      const prismaCliJs = join(nodeModulesDir, 'prisma', 'build', 'index.js');
      
      if (!existsSync(prismaCliJs)) {
        this.logger.warn('Prisma CLI not found, skipping migrations');
        return;
      }
      
      this.logger.log('Running prisma migrate deploy...');
      
      const env = {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      };
      
      const command = `"${process.execPath}" "${prismaCliJs}" migrate deploy`;
      
      execSync(command, {
        cwd: prismaDir,
        stdio: 'pipe',
        env,
        shell: true,
      });
      
      this.logger.log('✅ Migrations applied successfully');
    } catch (error: any) {
      this.logger.warn('Failed to run migrations:', error.message);
      throw error;
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
        
        // Find Prisma CLI - use Node.js (process.execPath) to execute it directly
        // This works in Electron because process.execPath points to Electron's bundled Node.js
        const nodeModulesDir = isElectron && resourcesPath
          ? join(resourcesPath, 'backend', 'node_modules')
          : join(__dirname, '..', '..', 'node_modules');
        
        // Prisma CLI JavaScript file location
        const prismaCliJs = join(nodeModulesDir, 'prisma', 'build', 'index.js');
        
        if (!existsSync(prismaCliJs)) {
          this.logger.error('Prisma CLI not found at:', prismaCliJs);
          throw new Error('Prisma CLI not found in node_modules');
        }
        
        this.logger.log('Running prisma db push to create tables...');
        this.logger.log('Schema path:', schemaPath);
        this.logger.log('Working directory:', schemaDir);
        this.logger.log('Prisma CLI:', prismaCliJs);
        this.logger.log('Node executable:', process.execPath);
        
        // Use Electron's bundled Node.js to execute Prisma CLI directly
        // Escape paths for Windows
        const escapedPrismaCli = prismaCliJs.replace(/\\/g, '/');
        const escapedExecPath = process.execPath.replace(/\\/g, '/');
        
        // Set DATABASE_URL in environment for Prisma CLI
        const env = {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL,
        };
        
        // Execute: node prisma/build/index.js db push --skip-generate --accept-data-loss
        const command = `"${process.execPath}" "${prismaCliJs}" db push --skip-generate --accept-data-loss`;
        
        this.logger.log('Executing command:', command);
        
        execSync(command, {
          cwd: schemaDir,
          stdio: 'inherit',
          env,
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
        // Try alternative: use Prisma's programmatic API
        this.logger.log('Attempting alternative schema push method...');
        try {
          await this.pushSchemaProgrammatically();
        } catch (altError: any) {
          this.logger.error('Alternative schema push also failed:', altError.message);
          // Don't throw - let seed service try to handle it
          // If schema doesn't exist, seed will fail gracefully
        }
      }
    }
  }

  private async ensureSchemaSync() {
    // Always run db push in Electron to ensure schema is synced with Prisma schema
    try {
      const { execSync } = require('child_process');
      const { join } = require('path');
      
      const isElectron = process.env.ELECTRON_RUN_AS_NODE === '1';
      const resourcesPath = (process as any).resourcesPath;
      const schemaDir = isElectron && resourcesPath
        ? join(resourcesPath, 'backend', 'prisma')
        : join(__dirname, '..', '..', 'prisma');
      
      const schemaPath = join(schemaDir, 'schema.prisma');
      
      if (!existsSync(schemaPath)) {
        this.logger.error('Prisma schema file not found at:', schemaPath);
        throw new Error('Schema file not found');
      }
      
      const nodeModulesDir = isElectron && resourcesPath
        ? join(resourcesPath, 'backend', 'node_modules')
        : join(__dirname, '..', '..', 'node_modules');
      
      const prismaCliJs = join(nodeModulesDir, 'prisma', 'build', 'index.js');
      
      if (!existsSync(prismaCliJs)) {
        this.logger.warn('Prisma CLI not found, skipping schema sync');
        return;
      }
      
      this.logger.log('🔄 Syncing database schema with Prisma schema...');
      
      const env = {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      };
      
      // Run prisma db push to sync schema
      const command = `"${process.execPath}" "${prismaCliJs}" db push --skip-generate --accept-data-loss`;
      
      execSync(command, {
        cwd: schemaDir,
        stdio: 'pipe',
        env,
        shell: true,
      });
      
      this.logger.log('✅ Database schema synced successfully');
    } catch (error: any) {
      this.logger.error('Schema sync failed:', error.message);
      if (error.stdout) {
        this.logger.error('stdout:', error.stdout.toString());
      }
      if (error.stderr) {
        this.logger.error('stderr:', error.stderr.toString());
      }
      throw error;
    }
  }

  private async pushSchemaProgrammatically() {
    // Use Prisma's programmatic API via require
    try {
      const prismaPackagePath = process.env.ELECTRON_RUN_AS_NODE === '1' && (process as any).resourcesPath
        ? join((process as any).resourcesPath, 'backend', 'node_modules', 'prisma')
        : join(__dirname, '..', '..', '..', 'node_modules', 'prisma');
      
      // Dynamically require Prisma CLI
      const prismaCli = require(prismaPackagePath);
      
      // Execute db push programmatically
      await prismaCli.main(['db', 'push', '--skip-generate', '--accept-data-loss']);
      this.logger.log('✅ Database schema created successfully (programmatic method)');
    } catch (error: any) {
      this.logger.error('Programmatic schema push failed:', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
