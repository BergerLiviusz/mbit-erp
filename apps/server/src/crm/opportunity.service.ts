import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateOpportunityDto {
  accountId: string;
  leadId?: string;
  nev: string;
  szakasz: string;
  ertek: number;
  valoszinuseg: number;
  zarvasDatum?: Date;
}

export interface UpdateOpportunityDto {
  nev?: string;
  szakasz?: string;
  ertek?: number;
  valoszinuseg?: number;
  zarvasDatum?: Date;
  lezartDatum?: Date;
}

@Injectable()
export class OpportunityService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number = 0, take: number = 10, szakasz?: string) {
    const where = szakasz ? { szakasz } : {};
    
    const [data, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where,
        skip,
        take,
        include: {
          account: {
            select: {
              id: true,
              nev: true,
              azonosito: true,
            },
          },
          lead: {
            select: {
              id: true,
              forras: true,
              allapot: true,
            },
          },
          quotes: {
            select: {
              id: true,
              azonosito: true,
              allapot: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.opportunity.count({ where }),
    ]);

    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findOne(id: string) {
    return await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        account: {
          include: {
            contacts: true,
          },
        },
        lead: true,
        quotes: {
          include: {
            items: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    });
  }

  async findByAccount(accountId: string) {
    return await this.prisma.opportunity.findMany({
      where: { accountId },
      include: {
        quotes: {
          select: {
            id: true,
            azonosito: true,
            allapot: true,
            vegosszeg: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateOpportunityDto) {
    return await this.prisma.opportunity.create({
      data: {
        nev: data.nev,
        szakasz: data.szakasz,
        ertek: data.ertek,
        valoszinuseg: data.valoszinuseg,
        zarvasDatum: data.zarvasDatum,
        account: {
          connect: { id: data.accountId },
        },
        ...(data.leadId && {
          lead: {
            connect: { id: data.leadId },
          },
        }),
      },
      include: {
        account: true,
        lead: true,
      },
    });
  }

  async update(id: string, data: UpdateOpportunityDto) {
    return await this.prisma.opportunity.update({
      where: { id },
      data,
      include: {
        account: true,
        lead: true,
        quotes: true,
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.opportunity.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, byStage] = await Promise.all([
      this.prisma.opportunity.count(),
      this.prisma.opportunity.groupBy({
        by: ['szakasz'],
        _count: {
          id: true,
        },
        _sum: {
          ertek: true,
        },
      }),
    ]);

    return {
      total,
      byStage: byStage.map(stage => ({
        szakasz: stage.szakasz,
        count: stage._count.id,
        value: stage._sum.ertek || 0,
      })),
    };
  }
}
