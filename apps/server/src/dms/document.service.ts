import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50, search?: string) {
    const where = search ? {
      OR: [
        { nev: { contains: search } },
        { iktatoSzam: { contains: search } },
      ],
    } : {};

    const [total, items] = await Promise.all([
      this.prisma.document.count({ where }),
      this.prisma.document.findMany({
        where,
        skip,
        take,
        include: {
          account: true,
          createdBy: { select: { id: true, nev: true } },
          ocrJob: true,
          tags: { include: { tag: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
      include: {
        account: true,
        versions: true,
        ocrJob: true,
        tags: { include: { tag: true } },
        access: { include: { user: true } },
      },
    });
  }

  async create(data: any) {
    const docCount = await this.prisma.document.count();
    const iktatoSzam = data.iktatoSzam || `IK-${new Date().getFullYear()}-${String(docCount + 1).padStart(6, '0')}`;
    
    return this.prisma.document.create({
      data: {
        ...data,
        iktatoSzam,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.document.update({
      where: { id },
      data,
    });
  }
}
