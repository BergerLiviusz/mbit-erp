import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CampaignFilters {
  tipus?: string;
  allapot?: string;
  iparag?: string;
  regio?: string;
  kezdetDatum?: string;
  befejezesDatum?: string;
}

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50, filters?: CampaignFilters) {
    const where: any = {};

    if (filters?.tipus) {
      where.tipus = filters.tipus;
    }

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    if (filters?.kezdetDatum) {
      where.kezdetDatum = {
        gte: new Date(filters.kezdetDatum),
      };
    }

    if (filters?.befejezesDatum) {
      where.befejezesDatum = {
        lte: new Date(filters.befejezesDatum),
      };
    }

    // Szűrés accountok alapján (iparág, régió)
    if (filters?.iparag || filters?.regio) {
      where.accounts = {
        some: {
          account: {
            ...(filters.iparag && { iparag: filters.iparag }),
            ...(filters.regio && { regio: filters.regio }),
          },
        },
      };
    }

    const [total, items] = await Promise.all([
      this.prisma.campaign.count({ where }),
      this.prisma.campaign.findMany({
        where,
        skip,
        take,
        include: {
          createdBy: { select: { id: true, nev: true } },
          accounts: {
            include: {
              account: {
                select: {
                  id: true,
                  nev: true,
                  tipus: true,
                  iparag: true,
                  regio: true,
                  email: true,
                },
              },
            },
          },
          _count: {
            select: {
              accounts: true,
              leads: true,
            },
          },
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

  async delete(id: string) {
    return this.prisma.campaign.delete({
      where: { id },
    });
  }

  async close(id: string) {
    return this.prisma.campaign.update({
      where: { id },
      data: { allapot: 'lezart', befejezesDatum: new Date() },
    });
  }

  async selectAudience(campaignId: string, filters: CampaignFilters) {
    const where: any = { aktiv: true };
    if (filters.iparag) where.iparag = filters.iparag;
    if (filters.regio) where.regio = filters.regio;
    if (filters.tipus) where.tipus = filters.tipus;

    const accounts = await this.prisma.account.findMany({
      where,
      include: { contacts: { where: { elsodleges: true }, take: 1 } },
    });

    for (const account of accounts) {
      await this.prisma.campaignAccount.upsert({
        where: {
          campaignId_accountId: { campaignId, accountId: account.id },
        },
        create: { campaignId, accountId: account.id },
        update: {},
      });
    }

    return this.findOne(campaignId);
  }

  async setFeedback(campaignId: string, accountId: string, visszajelzes: string) {
    return this.prisma.campaignAccount.upsert({
      where: {
        campaignId_accountId: { campaignId, accountId },
      },
      create: { campaignId, accountId, visszajelzes },
      update: { visszajelzes },
    });
  }

  async getResultsReport(campaignId?: string) {
    const campaigns = await this.prisma.campaign.findMany({
      where: campaignId ? { id: campaignId } : { allapot: 'lezart' },
      include: {
        accounts: { include: { account: true } },
        _count: { select: { leads: true, accounts: true } },
      },
    });

    return campaigns.map((c) => ({
      id: c.id,
      nev: c.nev,
      allapot: c.allapot,
      celcsoportSzam: c._count.accounts,
      leadSzam: c._count.leads,
      visszajelzesek: c.accounts.filter((a) => a.visszajelzes).length,
      pozitiv: c.accounts.filter((a) =>
        (a.visszajelzes || '').toLowerCase().includes('pozitiv'),
      ).length,
    }));
  }

  async exportAudience(campaignId: string, format: 'csv' | 'excel') {
    const rows = await this.prisma.campaignAccount.findMany({
      where: { campaignId },
      include: {
        account: {
          include: { contacts: true },
        },
      },
    });
    return { rows, format, campaignId };
  }

  async exportCampaigns(filters?: CampaignFilters, format: 'csv' | 'excel' = 'csv') {
    const campaigns = await this.prisma.campaign.findMany({
      where: filters ? this.buildWhereClause(filters) : {},
      include: {
        createdBy: { select: { id: true, nev: true, email: true } },
        accounts: {
          include: {
            account: {
              select: {
                id: true,
                nev: true,
                tipus: true,
                iparag: true,
                regio: true,
                email: true,
                telefon: true,
              },
            },
          },
        },
        _count: {
          select: {
            accounts: true,
            leads: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return campaigns;
  }

  private buildWhereClause(filters: CampaignFilters): any {
    const where: any = {};

    if (filters.tipus) {
      where.tipus = filters.tipus;
    }

    if (filters.allapot) {
      where.allapot = filters.allapot;
    }

    if (filters.kezdetDatum) {
      where.kezdetDatum = {
        gte: new Date(filters.kezdetDatum),
      };
    }

    if (filters.befejezesDatum) {
      where.befejezesDatum = {
        lte: new Date(filters.befejezesDatum),
      };
    }

    if (filters.iparag || filters.regio) {
      where.accounts = {
        some: {
          account: {
            ...(filters.iparag && { iparag: filters.iparag }),
            ...(filters.regio && { regio: filters.regio }),
          },
        },
      };
    }

    return where;
  }
}
