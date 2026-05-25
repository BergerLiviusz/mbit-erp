import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrmMessageService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { accountId?: string; ticketId?: string; channel?: string }) {
    return this.prisma.message.findMany({
      where: {
        ...(filters?.accountId && { accountId: filters.accountId }),
        ...(filters?.ticketId && { ticketId: filters.ticketId }),
        ...(filters?.channel && { channel: filters.channel }),
      },
      include: {
        account: { select: { id: true, nev: true } },
        ticket: { select: { id: true, azonosito: true, targy: true } },
        createdBy: { select: { id: true, nev: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    accountId?: string;
    ticketId?: string;
    channel: string;
    targy?: string;
    szoveg: string;
    tipus?: string;
    felhaszCsak?: string;
    createdById?: string;
  }) {
    return this.prisma.message.create({
      data: {
        channel: data.channel,
        targy: data.targy,
        szoveg: data.szoveg,
        tipus: data.tipus || 'KIMENO',
        felhaszCsak: data.felhaszCsak,
        accountId: data.accountId,
        ticketId: data.ticketId,
        createdById: data.createdById,
      },
      include: {
        account: true,
        createdBy: { select: { nev: true } },
      },
    });
  }
}
