import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50) {
    const [total, items] = await Promise.all([
      this.prisma.campaign.count(),
      this.prisma.campaign.findMany({
        skip,
        take,
        include: {
          createdBy: { select: { id: true, nev: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: {
        accounts: {
          include: {
            account: true,
          },
        },
        leads: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.campaign.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.campaign.update({
      where: { id },
      data,
    });
  }
}
