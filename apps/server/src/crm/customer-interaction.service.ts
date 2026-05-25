import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class CustomerInteractionService {
  constructor(private prisma: PrismaService) {}

  async findByAccount(accountId: string) {
    return this.prisma.customerInteraction.findMany({
      where: { accountId },
      include: { felelos: { select: { id: true, nev: true, email: true } } },
      orderBy: { datum: 'desc' },
    });
  }

  async getLifecycle(accountId: string) {
    const [interactions, messages, tickets, quotes, orders, tasks] = await Promise.all([
      this.findByAccount(accountId),
      this.prisma.message.findMany({
        where: { accountId },
        include: { createdBy: { select: { nev: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.ticket.findMany({
        where: { accountId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.quote.findMany({
        where: { accountId },
        select: { id: true, azonosito: true, allapot: true, vegosszeg: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.findMany({
        where: { accountId },
        select: { id: true, azonosito: true, allapot: true, vegosszeg: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.findMany({
        where: { accountId },
        select: { id: true, cim: true, allapot: true, hataridoDatum: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const timeline = [
      ...interactions.map((i) => ({
        type: 'interaction' as const,
        date: i.datum,
        id: i.id,
        title: i.targy,
        detail: i.tartalom,
        meta: i,
      })),
      ...messages.map((m) => ({
        type: 'communication' as const,
        date: m.createdAt,
        id: m.id,
        title: m.targy || m.channel,
        detail: m.szoveg,
        meta: m,
      })),
      ...tickets.map((t) => ({
        type: 'ticket' as const,
        date: t.createdAt,
        id: t.id,
        title: t.targy,
        detail: t.allapot,
        meta: t,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { timeline, interactions, messages, tickets, quotes, orders, tasks };
  }

  async create(data: {
    accountId: string;
    tipus: string;
    targy: string;
    tartalom?: string;
    felelosId?: string;
    kovetkezoFeladat?: string;
    kovetkezoHatarido?: Date | string;
    datum?: Date | string;
  }) {
    return this.prisma.customerInteraction.create({
      data: {
        ...data,
        datum: data.datum ? new Date(data.datum) : new Date(),
        kovetkezoHatarido: data.kovetkezoHatarido
          ? new Date(data.kovetkezoHatarido)
          : undefined,
      },
      include: { felelos: { select: { id: true, nev: true } } },
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await this.prisma.customerInteraction.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Interakció nem található');
    return this.prisma.customerInteraction.update({
      where: { id },
      data: {
        ...data,
        ...(data.kovetkezoHatarido && {
          kovetkezoHatarido: new Date(data.kovetkezoHatarido as string),
        }),
      },
    });
  }

  async report(type: 'by-account' | 'by-sales' | 'open-followups' | 'overdue') {
    switch (type) {
      case 'by-account':
        return this.prisma.customerInteraction.groupBy({
          by: ['accountId'],
          _count: { id: true },
        });
      case 'by-sales':
        return this.prisma.customerInteraction.groupBy({
          by: ['felelosId'],
          _count: { id: true },
        });
      case 'open-followups':
        return this.prisma.customerInteraction.findMany({
          where: { allapot: 'NYITOTT', kovetkezoHatarido: { not: null } },
          include: {
            account: { select: { nev: true, azonosito: true } },
            felelos: { select: { nev: true } },
          },
        });
      case 'overdue':
        return this.prisma.customerInteraction.findMany({
          where: {
            allapot: 'NYITOTT',
            kovetkezoHatarido: { lt: new Date() },
          },
          include: {
            account: { select: { nev: true, azonosito: true } },
            felelos: { select: { nev: true } },
          },
        });
      default:
        return [];
    }
  }

  async exportReport(type: string, format: 'csv' | 'excel') {
    const rows = await this.report(type as any);
    if (format === 'csv') {
      return JSON.stringify(rows);
    }
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Riport');
    sheet.addRow(['Adat']);
    (Array.isArray(rows) ? rows : []).forEach((r) => sheet.addRow([JSON.stringify(r)]));
    return workbook.xlsx.writeBuffer();
  }
}
