import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    userId?: string;
    esemeny: string;
    entitas: string;
    entitasId?: string;
    regi?: any;
    uj?: any;
    ipCim?: string;
    userAgent?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        ...data,
        regi: data.regi ? JSON.stringify(data.regi) : null,
        uj: data.uj ? JSON.stringify(data.uj) : null,
      },
    });
  }

  async findAll(skip = 0, take = 100, entitas?: string) {
    const where = entitas ? { entitas } : {};

    const [total, items] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        skip,
        take,
        include: {
          user: { select: { id: true, nev: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }
}
