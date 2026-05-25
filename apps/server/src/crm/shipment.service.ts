import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SalesFlowService } from './sales-flow.service';

@Injectable()
export class ShipmentService {
  constructor(
    private prisma: PrismaService,
    private salesFlow: SalesFlowService,
  ) {}

  async findAll(orderId?: string) {
    return this.prisma.shipment.findMany({
      where: orderId ? { orderId } : undefined,
      include: {
        order: {
          select: { id: true, azonosito: true, account: { select: { nev: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      include: { order: { include: { account: true, items: { include: { item: true } } } } },
    });
    if (!shipment) throw new NotFoundException('Szállítás nem található');
    return shipment;
  }

  async createFromOrder(orderId: string, body?: { szallitasiCim?: string; szallitasiMod?: string }) {
    return this.salesFlow.createShipmentFromOrder(orderId, body);
  }
}
