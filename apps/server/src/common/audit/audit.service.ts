import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AuditEntry {
  userId?: string;
  esemeny: string;
  entitas: string;
  entitasId?: string;
  regi?: any;
  uj?: any;
  ipCim?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async log(entry: AuditEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: entry.userId,
          esemeny: entry.esemeny,
          entitas: entry.entitas,
          entitasId: entry.entitasId,
          regi: entry.regi ? JSON.stringify(entry.regi) : null,
          uj: entry.uj ? JSON.stringify(entry.uj) : null,
          ipCim: entry.ipCim,
          userAgent: entry.userAgent,
        },
      });
      this.logger.log(
        `Audit: ${entry.esemeny} ${entry.entitas} ${entry.entitasId || ''}`,
      );
    } catch (error) {
      this.logger.error('Failed to create audit log:', error);
    }
  }

  async logCreate(
    entitas: string,
    entitasId: string,
    data: any,
    userId?: string,
    metadata?: { ipCim?: string; userAgent?: string },
  ): Promise<void> {
    await this.log({
      userId,
      esemeny: 'create',
      entitas,
      entitasId,
      uj: data,
      ...metadata,
    });
  }

  async logUpdate(
    entitas: string,
    entitasId: string,
    oldData: any,
    newData: any,
    userId?: string,
    metadata?: { ipCim?: string; userAgent?: string },
  ): Promise<void> {
    await this.log({
      userId,
      esemeny: 'update',
      entitas,
      entitasId,
      regi: oldData,
      uj: newData,
      ...metadata,
    });
  }

  async logDelete(
    entitas: string,
    entitasId: string,
    data: any,
    userId?: string,
    metadata?: { ipCim?: string; userAgent?: string },
  ): Promise<void> {
    await this.log({
      userId,
      esemeny: 'delete',
      entitas,
      entitasId,
      regi: data,
      ...metadata,
    });
  }

  async export(options: {
    startDate?: Date;
    endDate?: Date;
    entitas?: string;
    userId?: string;
  }): Promise<any[]> {
    const where: any = {};

    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) {
        where.createdAt.gte = options.startDate;
      }
      if (options.endDate) {
        where.createdAt.lte = options.endDate;
      }
    }

    if (options.entitas) {
      where.entitas = options.entitas;
    }

    if (options.userId) {
      where.userId = options.userId;
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            nev: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return logs;
  }

  async getRecentActivity(limit: number = 50): Promise<any[]> {
    return await this.prisma.auditLog.findMany({
      take: limit,
      include: {
        user: {
          select: {
            email: true,
            nev: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getActivityByEntity(
    entitas: string,
    entitasId: string,
  ): Promise<any[]> {
    return await this.prisma.auditLog.findMany({
      where: {
        entitas,
        entitasId,
      },
      include: {
        user: {
          select: {
            email: true,
            nev: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
