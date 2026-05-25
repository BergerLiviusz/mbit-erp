import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiscountCalculationService } from './discount-calculation.service';

@Injectable()
export class DiscountRuleService {
  constructor(
    private prisma: PrismaService,
    private discountCalc: DiscountCalculationService,
  ) {}

  async findAll(accountId?: string) {
    return this.prisma.discountRule.findMany({
      where: {
        aktiv: true,
        ...(accountId ? { OR: [{ accountId }, { accountId: null }] } : {}),
      },
      include: {
        account: { select: { id: true, nev: true, azonosito: true } },
        item: { select: { id: true, nev: true, azonosito: true } },
      },
      orderBy: [{ prioritas: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const rule = await this.prisma.discountRule.findUnique({
      where: { id },
      include: { account: true, item: true },
    });
    if (!rule) throw new NotFoundException('Kedvezményszabály nem található');
    return rule;
  }

  async create(data: {
    nev: string;
    tipus: string;
    ertek: number;
    mennyisegiHatar?: number;
    ertekHatar?: number;
    kezdetDatum?: Date;
    vegesDatum?: Date;
    prioritas?: number;
    accountId?: string;
    itemId?: string;
    leiras?: string;
  }) {
    return this.prisma.discountRule.create({ data });
  }

  async update(id: string, data: Record<string, unknown>) {
    await this.findOne(id);
    return this.prisma.discountRule.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.discountRule.update({
      where: { id },
      data: { aktiv: false },
    });
  }

  async calculateForQuote(quoteId: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
      include: { items: true, discounts: true },
    });
    if (!quote) throw new NotFoundException('Árajánlat nem található');

    const rules = await this.findAll(quote.accountId);
    const lineInputs = quote.items.map((i) => ({
      itemId: i.itemId,
      mennyiseg: i.mennyiseg,
      egysegAr: i.egysegAr,
      lineKedvezmeny: i.kedvezmeny,
    }));

    return this.discountCalc.applyRules(lineInputs, rules);
  }
}
