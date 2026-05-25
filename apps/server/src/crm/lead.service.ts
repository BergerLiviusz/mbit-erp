import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeadService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { allapot?: string; campaignId?: string }) {
    return this.prisma.lead.findMany({
      where: {
        ...(filters?.allapot && { allapot: filters.allapot }),
        ...(filters?.campaignId && { campaignId: filters.campaignId }),
      },
      include: {
        account: { select: { id: true, nev: true, azonosito: true } },
        campaign: { select: { id: true, nev: true } },
        opportunity: true,
        createdBy: { select: { id: true, nev: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { account: true, campaign: true, opportunity: true },
    });
    if (!lead) throw new NotFoundException('Lead nem található');
    return lead;
  }

  async create(data: {
    forras: string;
    allapot: string;
    accountId?: string;
    campaignId?: string;
    minositesScore?: number;
    megjegyzesek?: string;
    createdById?: string;
  }) {
    return this.prisma.lead.create({
      data,
      include: { account: true, campaign: true },
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    await this.findOne(id);
    return this.prisma.lead.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.lead.delete({ where: { id } });
  }
}
