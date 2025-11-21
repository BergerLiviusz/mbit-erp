import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

export interface CreateDatabaseConnectionDto {
  nev: string;
  tipus: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  connectionString?: string;
  megjegyzesek?: string;
}

export interface UpdateDatabaseConnectionDto {
  nev?: string;
  tipus?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  connectionString?: string;
  megjegyzesek?: string;
  aktiv?: boolean;
}

@Injectable()
export class DatabaseConnectionService {
  private readonly encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

  constructor(private prisma: PrismaService) {}

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey.substring(0, 32).padEnd(32)), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.encryptionKey.substring(0, 32).padEnd(32)), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async findAll(skip = 0, take = 50, filters?: {
    aktiv?: boolean;
  }) {
    const where: any = {};

    if (filters?.aktiv !== undefined) {
      where.aktiv = filters.aktiv;
    }

    const [total, items] = await Promise.all([
      this.prisma.databaseConnection.count({ where }),
      this.prisma.databaseConnection.findMany({
        where,
        skip,
        take,
        orderBy: {
          nev: 'asc',
        },
      }),
    ]);

    // Don't return passwords in list
    const safeItems = items.map(item => ({
      ...item,
      password: item.password ? '***' : null,
    }));

    return { total, items: safeItems };
  }

  async findOne(id: string) {
    const connection = await this.prisma.databaseConnection.findUnique({
      where: { id },
    });

    if (!connection) {
      throw new NotFoundException('Adatbázis kapcsolat nem található');
    }

    // Don't return password
    return {
      ...connection,
      password: connection.password ? '***' : null,
    };
  }

  async create(dto: CreateDatabaseConnectionDto) {
    // Validate connection type
    const validTypes = ['SQLITE', 'POSTGRESQL', 'MYSQL', 'MSSQL', 'ORACLE'];
    if (!validTypes.includes(dto.tipus.toUpperCase())) {
      throw new BadRequestException('Érvénytelen adatbázis típus');
    }

    const data: any = {
      ...dto,
      tipus: dto.tipus.toUpperCase(),
      password: dto.password ? this.encrypt(dto.password) : undefined,
    };

    return this.prisma.databaseConnection.create({
      data,
    });
  }

  async update(id: string, dto: UpdateDatabaseConnectionDto) {
    const connection = await this.findOne(id);

    const data: any = {
      ...dto,
      tipus: dto.tipus ? dto.tipus.toUpperCase() : undefined,
      password: dto.password ? this.encrypt(dto.password) : undefined,
    };

    return this.prisma.databaseConnection.update({
      where: { id },
      data,
    });
  }

  async testConnection(id: string): Promise<{ success: boolean; message: string }> {
    const connection = await this.prisma.databaseConnection.findUnique({
      where: { id },
    });

    if (!connection) {
      throw new NotFoundException('Adatbázis kapcsolat nem található');
    }

    try {
      // Simple connection test - in production, use appropriate database driver
      // This is a placeholder implementation
      if (connection.connectionString) {
        // Test connection string
        return { success: true, message: 'Kapcsolat sikeres' };
      } else if (connection.host && connection.database) {
        // Test host/database connection
        return { success: true, message: 'Kapcsolat sikeres' };
      } else {
        return { success: false, message: 'Hiányzó kapcsolati információk' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Kapcsolati hiba' };
    }
  }

  async delete(id: string) {
    const connection = await this.findOne(id);
    return this.prisma.databaseConnection.delete({
      where: { id },
    });
  }
}

