import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';
import * as fsp from 'fs/promises';

export interface BackupOptions {
  includeDatabase?: boolean;
  includeFiles?: boolean;
  password?: string;
}

export interface BackupManifest {
  version: string;
  timestamp: string;
  database: boolean;
  files: boolean;
  fileCount: number;
  databaseSize: number;
  totalSize: number;
}

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async createBackup(
    tipus: string = 'manual',
    options: BackupOptions = {},
  ): Promise<{ id: string; fajlUtvonal: string; meret: number }> {
    const backupJob = await this.prisma.backupJob.create({
      data: {
        tipus,
        allapot: 'folyamatban',
        inditas: new Date(),
      },
    });

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup-${timestamp}.zip`;
      const backupPath = this.storage.getPath('backups', backupFileName);

      await this.storage.ensureDir(this.storage.getPath('backups'));

      const manifest: BackupManifest = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        database: options.includeDatabase ?? true,
        files: options.includeFiles ?? true,
        fileCount: 0,
        databaseSize: 0,
        totalSize: 0,
      };

      const output = fs.createWriteStream(backupPath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      if (options.password) {
        this.logger.warn('Password protection not yet implemented');
      }

      archive.pipe(output);

      if (options.includeDatabase ?? true) {
        const dbPath = path.join(
          process.cwd(),
          'apps',
          'server',
          'prisma',
          'dev.db',
        );
        try {
          const dbStats = await fsp.stat(dbPath);
          manifest.databaseSize = dbStats.size;
          archive.file(dbPath, { name: 'database.db' });
          this.logger.log(`Added database to backup: ${dbStats.size} bytes`);
        } catch (error) {
          this.logger.error('Failed to add database to backup:', error);
        }
      }

      if (options.includeFiles ?? true) {
        const filesDir = this.storage.getPath('files');
        try {
          const files = await this.storage.listFiles('files');
          manifest.fileCount = files.length;
          
          if (files.length > 0) {
            archive.directory(filesDir, 'files');
            this.logger.log(`Added ${files.length} files to backup`);
          }
        } catch (error) {
          this.logger.error('Failed to add files to backup:', error);
        }
      }

      archive.append(JSON.stringify(manifest, null, 2), {
        name: 'manifest.json',
      });

      await archive.finalize();

      await new Promise<void>((resolve, reject) => {
        output.on('close', () => resolve());
        output.on('error', reject);
      });

      const backupStats = await fsp.stat(backupPath);
      manifest.totalSize = backupStats.size;

      const relativePath = path.relative(this.storage.getBasePath(), backupPath);

      await this.prisma.backupJob.update({
        where: { id: backupJob.id },
        data: {
          allapot: 'kesz',
          fajlUtvonal: relativePath,
          fajlNev: backupFileName,
          meret: backupStats.size,
          tartalomManifeszt: JSON.stringify(manifest),
          befejezes: new Date(),
        },
      });

      this.logger.log(
        `Backup created successfully: ${backupFileName} (${backupStats.size} bytes)`,
      );

      await this.cleanupOldBackups();

      return {
        id: backupJob.id,
        fajlUtvonal: relativePath,
        meret: backupStats.size,
      };
    } catch (error) {
      this.logger.error('Backup failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.prisma.backupJob.update({
        where: { id: backupJob.id },
        data: {
          allapot: 'hiba',
          hibaUzenet: errorMessage,
          befejezes: new Date(),
        },
      });
      throw error;
    }
  }

  async listBackups(): Promise<any[]> {
    return await this.prisma.backupJob.findMany({
      where: {
        allapot: 'kesz',
      },
      orderBy: {
        inditas: 'desc',
      },
    });
  }

  async getBackup(id: string): Promise<any> {
    return await this.prisma.backupJob.findUnique({
      where: { id },
    });
  }

  async deleteBackup(id: string): Promise<void> {
    const backup = await this.prisma.backupJob.findUnique({
      where: { id },
    });

    if (!backup) {
      throw new Error('Backup not found');
    }

    if (backup.fajlUtvonal) {
      try {
        await this.storage.deleteFile(backup.fajlUtvonal);
      } catch (error) {
        this.logger.error('Failed to delete backup file:', error);
      }
    }

    await this.prisma.backupJob.delete({
      where: { id },
    });

    this.logger.log(`Backup deleted: ${id}`);
  }

  private async cleanupOldBackups(): Promise<void> {
    const retentionCount = parseInt(
      process.env.BACKUP_RETENTION_COUNT || '10',
      10,
    );

    const backups = await this.prisma.backupJob.findMany({
      where: {
        allapot: 'kesz',
      },
      orderBy: {
        inditas: 'desc',
      },
    });

    if (backups.length > retentionCount) {
      const toDelete = backups.slice(retentionCount);
      for (const backup of toDelete) {
        try {
          await this.deleteBackup(backup.id);
        } catch (error) {
          this.logger.error(`Failed to delete old backup ${backup.id}:`, error);
        }
      }
      this.logger.log(`Cleaned up ${toDelete.length} old backups`);
    }
  }

  async getBackupStats(): Promise<{
    total: number;
    totalSize: number;
    latest?: any;
  }> {
    const backups = await this.prisma.backupJob.findMany({
      where: {
        allapot: 'kesz',
      },
      orderBy: {
        inditas: 'desc',
      },
    });

    const totalSize = backups.reduce((sum, b) => sum + (b.meret || 0), 0);

    return {
      total: backups.length,
      totalSize,
      latest: backups[0] || null,
    };
  }
}
