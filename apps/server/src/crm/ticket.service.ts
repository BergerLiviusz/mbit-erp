import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50) {
    const [total, items] = await Promise.all([
      this.prisma.ticket.count(),
      this.prisma.ticket.findMany({
        skip,
        take,
        include: {
          account: true,
          createdBy: { select: { id: true, nev: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        account: true,
        messages: true,
      },
    });
  }

  async create(data: any) {
    const ticketCount = await this.prisma.ticket.count();
    const azonosito = `T-${new Date().getFullYear()}-${String(ticketCount + 1).padStart(5, '0')}`;
    
    return this.prisma.ticket.create({
      data: {
        ...data,
        azonosito,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.ticket.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.ticket.delete({
      where: { id },
    });
  }
}
