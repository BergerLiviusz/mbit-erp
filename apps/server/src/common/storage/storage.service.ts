import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly baseDir: string;

  constructor() {
    this.baseDir = process.env.MBIT_DATA_DIR || path.join(os.homedir(), 'mbit-data');
    this.logger.log(`Data directory: ${this.baseDir}`);
    this.initializeDirectories();
  }

  private async initializeDirectories() {
    const dirs = [
      'uploads',
      'files',
      'backups',
      'logs',
      'exports',
      'temp',
      'ocr',
    ];

    for (const dir of dirs) {
      const fullPath = path.join(this.baseDir, dir);
      try {
        await fs.mkdir(fullPath, { recursive: true });
      } catch (error) {
        this.logger.error(`Failed to create directory ${fullPath}:`, error);
      }
    }
  }

  getBasePath(): string {
    return this.baseDir;
  }

  getPath(subdir: string, ...segments: string[]): string {
    return path.join(this.baseDir, subdir, ...segments);
  }

  async ensureDir(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ\-_.]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 200);
  }

  generateUniqueFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);
    const sanitized = this.sanitizeFilename(base);
    const unique = crypto.randomBytes(8).toString('hex');
    return `${sanitized}-${unique}${ext}`;
  }

  async saveFile(
    subdir: string,
    filename: string,
    buffer: Buffer,
  ): Promise<string> {
    const dirPath = this.getPath(subdir);
    await this.ensureDir(dirPath);

    const safeName = this.generateUniqueFilename(filename);
    const fullPath = path.join(dirPath, safeName);

    await fs.writeFile(fullPath, buffer);
    this.logger.log(`File saved: ${fullPath}`);

    return path.relative(this.baseDir, fullPath);
  }

  async readFile(relativePath: string): Promise<Buffer> {
    const fullPath = path.join(this.baseDir, relativePath);
    
    if (!this.isPathSafe(fullPath)) {
      throw new Error('Unsafe file path detected');
    }

    return await fs.readFile(fullPath);
  }

  async deleteFile(relativePath: string): Promise<void> {
    const fullPath = path.join(this.baseDir, relativePath);
    
    if (!this.isPathSafe(fullPath)) {
      throw new Error('Unsafe file path detected');
    }

    await fs.unlink(fullPath);
    this.logger.log(`File deleted: ${fullPath}`);
  }

  async fileExists(relativePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.baseDir, relativePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async getFileSize(relativePath: string): Promise<number> {
    const fullPath = path.join(this.baseDir, relativePath);
    const stats = await fs.stat(fullPath);
    return stats.size;
  }

  private isPathSafe(fullPath: string): boolean {
    const resolved = path.resolve(fullPath);
    const base = path.resolve(this.baseDir);
    return resolved.startsWith(base);
  }

  async listFiles(subdir: string): Promise<string[]> {
    const dirPath = this.getPath(subdir);
    try {
      const files = await fs.readdir(dirPath);
      return files;
    } catch {
      return [];
    }
  }

  async copyFile(source: string, destination: string): Promise<void> {
    const srcPath = path.join(this.baseDir, source);
    const destPath = path.join(this.baseDir, destination);

    if (!this.isPathSafe(srcPath) || !this.isPathSafe(destPath)) {
      throw new Error('Unsafe file path detected');
    }

    await fs.copyFile(srcPath, destPath);
  }

  async moveFile(source: string, destination: string): Promise<void> {
    const srcPath = path.join(this.baseDir, source);
    const destPath = path.join(this.baseDir, destination);

    if (!this.isPathSafe(srcPath) || !this.isPathSafe(destPath)) {
      throw new Error('Unsafe file path detected');
    }

    await fs.rename(srcPath, destPath);
  }

  getAbsolutePath(relativePath: string): string {
    const fullPath = path.join(this.baseDir, relativePath);
    
    if (!this.isPathSafe(fullPath)) {
      throw new Error('Unsafe file path detected');
    }

    return fullPath;
  }
}
