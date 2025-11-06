import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OcrService {
  constructor(private prisma: PrismaService) {}

  async createJob(documentId: string) {
    return this.prisma.oCRJob.create({
      data: {
        documentId,
        allapot: 'beerkezett',
        nyelv: 'hun',
      },
    });
  }

  async findAll(skip = 0, take = 50) {
    const [total, items] = await Promise.all([
      this.prisma.oCRJob.count(),
      this.prisma.oCRJob.findMany({
        skip,
        take,
        include: {
          document: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }
}
