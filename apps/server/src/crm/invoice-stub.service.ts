import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SalesFlowService } from './sales-flow.service';

@Injectable()
export class InvoiceStubService {
  constructor(
    private prisma: PrismaService,
    private salesFlow: SalesFlowService,
  ) {}

  async findAll(accountId?: string) {
    return this.prisma.invoiceStub.findMany({
      where: accountId ? { accountId } : undefined,
      include: {
        account: { select: { id: true, nev: true, azonosito: true } },
        order: { select: { id: true, azonosito: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const stub = await this.prisma.invoiceStub.findUnique({
      where: { id },
      include: { account: true, order: true },
    });
    if (!stub) throw new NotFoundException('Számla-meta nem található');
    return stub;
  }

  async createFromOrder(orderId: string) {
    return this.salesFlow.createInvoiceStubFromOrder(orderId);
  }

  async createFromShipment(shipmentId: string) {
    return this.salesFlow.createInvoiceStubFromShipment(shipmentId);
  }
}
