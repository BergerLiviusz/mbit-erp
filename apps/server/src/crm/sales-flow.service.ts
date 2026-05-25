import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsService } from '../system/settings.service';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class SalesFlowService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SystemSettingsService,
  ) {}

  async convertQuoteToOrder(quoteId: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
      include: { items: true, order: true, discounts: true },
    });
    if (!quote) throw new NotFoundException('Árajánlat nem található');
    if (quote.order) throw new BadRequestException('Ehhez az árajánlathoz már létezik rendelés');
    if (!['jovahagyott', 'elfogadva'].includes(quote.allapot)) {
      throw new BadRequestException('Csak jóváhagyott vagy elfogadott árajánlatból hozható létre rendelés');
    }

    const azonosito = await this.generateOrderNumber();
    const order = await this.prisma.order.create({
      data: {
        azonosito,
        accountId: quote.accountId,
        quoteId: quote.id,
        rendelesiDatum: new Date(),
        osszeg: quote.osszeg,
        afa: quote.afa,
        vegosszeg: quote.vegosszeg,
        allapot: OrderStatus.NEW,
        megjegyzesek: `Árajánlatból: ${quote.azonosito}`,
        items: {
          create: quote.items.map((item) => ({
            itemId: item.itemId,
            mennyiseg: item.mennyiseg,
            egysegAr: item.egysegAr,
            kedvezmeny: item.kedvezmeny,
            osszeg: item.osszeg,
          })),
        },
        ...(quote.discounts.length > 0 && {
          discounts: {
            create: quote.discounts.map((d) => ({
              tipus: d.tipus,
              ertek: d.ertek,
              mennyisegiHatar: d.mennyisegiHatar,
              ertekHatar: d.ertekHatar,
              kezdetDatum: d.kezdetDatum,
              vegesDatum: d.vegesDatum,
              leiras: d.leiras,
            })),
          },
        }),
      },
      include: {
        account: true,
        quote: true,
        items: { include: { item: true } },
      },
    });

    await this.prisma.quote.update({
      where: { id: quoteId },
      data: { allapot: 'elfogadva' },
    });

    return order;
  }

  async createShipmentFromOrder(orderId: string, data?: { szallitasiCim?: string; szallitasiMod?: string }) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { account: true, shipments: true },
    });
    if (!order) throw new NotFoundException('Rendelés nem található');

    const szallitasiCim =
      data?.szallitasiCim ||
      order.account?.szallitasiCim ||
      order.account?.cim ||
      'Nincs megadva szállítási cím';

    return this.prisma.shipment.create({
      data: {
        orderId,
        szallitasiCim,
        szallitasiMod: data?.szallitasiMod || 'standard',
        szallitasiDatum: new Date(),
        allapot: 'ELKESZULT',
        megjegyzesek: `Rendelés: ${order.azonosito}`,
      },
    });
  }

  async createInvoiceStubFromOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { invoiceStub: true, account: true },
    });
    if (!order) throw new NotFoundException('Rendelés nem található');
    if (order.invoiceStub) throw new BadRequestException('Ehhez a rendeléshez már létezik számla-meta');

    const count = await this.prisma.invoiceStub.count();
    const szamlaSzam = `SZM-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    const now = new Date();
    const fizetesiHatarido = new Date(now);
    fizetesiHatarido.setDate(fizetesiHatarido.getDate() + 30);

    return this.prisma.invoiceStub.create({
      data: {
        accountId: order.accountId,
        orderId: order.id,
        szamlaSzam,
        teljesitesDatum: now,
        fizetesiHataridoDatum: fizetesiHatarido,
        osszeg: order.osszeg,
        afa: order.afa,
        vegosszeg: order.vegosszeg,
        tipus: 'NORMAL',
        allapot: 'TERVEZET',
        megjegyzesek: `Rendelésből: ${order.azonosito}`,
      },
      include: { account: true, order: true },
    });
  }

  async createInvoiceStubFromShipment(shipmentId: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { order: { include: { invoiceStub: true, account: true } } },
    });
    if (!shipment?.order) throw new NotFoundException('Szállítás / rendelés nem található');
    return this.createInvoiceStubFromOrder(shipment.order.id);
  }

  private async generateOrderNumber(): Promise<string> {
    const prefix = (await this.settingsService.get('order.number.prefix')) || 'REND';
    const lastOrder = await this.prisma.order.findFirst({
      where: { azonosito: { startsWith: prefix } },
      orderBy: { azonosito: 'desc' },
    });
    let nextNumber = 1;
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.azonosito.replace(prefix, ''), 10) || 0;
      nextNumber = lastNumber + 1;
    }
    return `${prefix}-${nextNumber.toString().padStart(6, '0')}`;
  }
}
