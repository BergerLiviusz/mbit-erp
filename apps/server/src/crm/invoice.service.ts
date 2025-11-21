import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateInvoiceDto {
  accountId: string;
  orderId?: string;
  kiallitasDatum?: string;
  teljesitesDatum: string;
  fizetesiHataridoDatum: string;
  tipus: string;
  fizetesiMod?: string;
  megjegyzesek?: string;
  items: CreateInvoiceItemDto[];
}

export interface CreateInvoiceItemDto {
  itemId?: string;
  nev: string;
  azonosito?: string;
  mennyiseg: number;
  egyseg: string;
  egysegAr: number;
  kedvezmeny?: number;
  afaKulcs: number;
  megjegyzes?: string;
}

export interface UpdateInvoiceDto {
  kiallitasDatum?: string;
  teljesitesDatum?: string;
  fizetesiHataridoDatum?: string;
  allapot?: string;
  fizetesiMod?: string;
  megjegyzesek?: string;
  items?: CreateInvoiceItemDto[];
}

export interface CreateInvoicePaymentDto {
  fizetesiDatum: string;
  osszeg: number;
  fizetesiMod: string;
  tranzakcioSzam?: string;
  megjegyzesek?: string;
}

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `SZ-${year}-`;
    
    const lastInvoice = await this.prisma.invoice.findFirst({
      where: {
        szamlaSzam: {
          startsWith: prefix,
        },
      },
      orderBy: {
        szamlaSzam: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.szamlaSzam.replace(prefix, ''));
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${String(nextNumber).padStart(6, '0')}`;
  }

  async findAll(skip = 0, take = 50, filters?: {
    accountId?: string;
    orderId?: string;
    allapot?: string;
    tipus?: string;
    kiallitasDatumFrom?: string;
    kiallitasDatumTo?: string;
  }) {
    const where: any = {};

    if (filters?.accountId) {
      where.accountId = filters.accountId;
    }

    if (filters?.orderId) {
      where.orderId = filters.orderId;
    }

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    if (filters?.tipus) {
      where.tipus = filters.tipus;
    }

    if (filters?.kiallitasDatumFrom || filters?.kiallitasDatumTo) {
      where.kiallitasDatum = {};
      if (filters.kiallitasDatumFrom) {
        where.kiallitasDatum.gte = new Date(filters.kiallitasDatumFrom);
      }
      if (filters.kiallitasDatumTo) {
        where.kiallitasDatum.lte = new Date(filters.kiallitasDatumTo);
      }
    }

    const [total, items] = await Promise.all([
      this.prisma.invoice.count({ where }),
      this.prisma.invoice.findMany({
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
          order: {
            select: {
              id: true,
              azonosito: true,
            },
          },
          items: true,
          _count: {
            select: {
              items: true,
              payments: true,
            },
          },
        },
        orderBy: {
          kiallitasDatum: 'desc',
        },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        account: true,
        order: {
          include: {
            items: {
              include: {
                item: true,
              },
            },
          },
        },
        items: {
          include: {
            item: true,
          },
          orderBy: {
            sorrend: 'asc',
          },
        },
        payments: {
          orderBy: {
            fizetesiDatum: 'desc',
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Számla nem található');
    }

    return invoice;
  }

  async create(dto: CreateInvoiceDto) {
    // Validate account
    const account = await this.prisma.account.findUnique({
      where: { id: dto.accountId },
    });

    if (!account) {
      throw new NotFoundException('Ügyfél nem található');
    }

    // Validate order if provided
    if (dto.orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: dto.orderId },
      });

      if (!order) {
        throw new NotFoundException('Rendelés nem található');
      }

      // Check if order already has an invoice
      const existingInvoice = await this.prisma.invoice.findUnique({
        where: { orderId: dto.orderId },
      });

      if (existingInvoice) {
        throw new BadRequestException('A rendeléshez már létezik számla');
      }
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('A számlának legalább egy tételre van szüksége');
    }

    // Calculate totals
    let osszeg = 0;
    let afa = 0;

    for (const itemDto of dto.items) {
      const nettoOsszeg = itemDto.mennyiseg * itemDto.egysegAr * (1 - (itemDto.kedvezmeny || 0) / 100);
      const afaOsszeg = nettoOsszeg * (itemDto.afaKulcs / 100);
      osszeg += nettoOsszeg;
      afa += afaOsszeg;
    }

    const vegosszeg = osszeg + afa;

    // Generate invoice number
    const szamlaSzam = await this.generateInvoiceNumber();

    // Create invoice with items
    const invoice = await this.prisma.invoice.create({
      data: {
        accountId: dto.accountId,
        orderId: dto.orderId,
        szamlaSzam,
        kiallitasDatum: dto.kiallitasDatum ? new Date(dto.kiallitasDatum) : new Date(),
        teljesitesDatum: new Date(dto.teljesitesDatum),
        fizetesiHataridoDatum: new Date(dto.fizetesiHataridoDatum),
        osszeg,
        afa,
        vegosszeg,
        tipus: dto.tipus,
        allapot: 'VAZLAT',
        fizetesiMod: dto.fizetesiMod,
        megjegyzesek: dto.megjegyzesek,
        items: {
          create: dto.items.map((itemDto, index) => {
            const nettoOsszeg = itemDto.mennyiseg * itemDto.egysegAr * (1 - (itemDto.kedvezmeny || 0) / 100);
            const afaOsszeg = nettoOsszeg * (itemDto.afaKulcs / 100);
            const bruttoOsszeg = nettoOsszeg + afaOsszeg;

            return {
              itemId: itemDto.itemId,
              nev: itemDto.nev,
              azonosito: itemDto.azonosito,
              mennyiseg: itemDto.mennyiseg,
              egyseg: itemDto.egyseg,
              egysegAr: itemDto.egysegAr,
              kedvezmeny: itemDto.kedvezmeny || 0,
              afaKulcs: itemDto.afaKulcs,
              nettoOsszeg,
              afaOsszeg,
              bruttoOsszeg,
              megjegyzes: itemDto.megjegyzes,
              sorrend: index,
            };
          }),
        },
      },
      include: {
        account: true,
        items: true,
      },
    });

    return invoice;
  }

  async createFromOrder(orderId: string, dto?: Partial<CreateInvoiceDto>) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        account: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Rendelés nem található');
    }

    // Check if invoice already exists
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { orderId },
    });

    if (existingInvoice) {
      throw new BadRequestException('A rendeléshez már létezik számla');
    }

    // Convert order items to invoice items
    const items: CreateInvoiceItemDto[] = order.items.map(orderItem => ({
      itemId: orderItem.itemId,
      nev: orderItem.item.nev,
      azonosito: orderItem.item.azonosito,
      mennyiseg: orderItem.mennyiseg,
      egyseg: orderItem.item.egyseg,
      egysegAr: orderItem.egysegAr,
      kedvezmeny: orderItem.kedvezmeny,
      afaKulcs: orderItem.item.afaKulcs,
    }));

    // Calculate payment due date (default: 30 days from today)
    const fizetesiHataridoDatum = dto?.fizetesiHataridoDatum
      ? new Date(dto.fizetesiHataridoDatum)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return this.create({
      accountId: order.accountId,
      orderId: order.id,
      kiallitasDatum: dto?.kiallitasDatum,
      teljesitesDatum: dto?.teljesitesDatum || order.teljesitesiDatum?.toISOString() || new Date().toISOString(),
      fizetesiHataridoDatum: fizetesiHataridoDatum.toISOString(),
      tipus: dto?.tipus || 'NORMAL',
      fizetesiMod: dto?.fizetesiMod,
      megjegyzesek: dto?.megjegyzesek,
      items,
    });
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    const invoice = await this.findOne(id);

    // Can't update issued invoices
    if (invoice.allapot !== 'VAZLAT' && invoice.allapot !== 'KIALLITVA') {
      throw new BadRequestException('Csak vázlat vagy kiallított számla szerkeszthető');
    }

    const updateData: any = {};

    if (dto.kiallitasDatum) {
      updateData.kiallitasDatum = new Date(dto.kiallitasDatum);
    }

    if (dto.teljesitesDatum) {
      updateData.teljesitesDatum = new Date(dto.teljesitesDatum);
    }

    if (dto.fizetesiHataridoDatum) {
      updateData.fizetesiHataridoDatum = new Date(dto.fizetesiHataridoDatum);
    }

    if (dto.allapot) {
      updateData.allapot = dto.allapot;
    }

    if (dto.fizetesiMod !== undefined) {
      updateData.fizetesiMod = dto.fizetesiMod;
    }

    if (dto.megjegyzesek !== undefined) {
      updateData.megjegyzesek = dto.megjegyzesek;
    }

    // Update items if provided
    if (dto.items) {
      // Delete existing items
      await this.prisma.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });

      // Recalculate totals
      let osszeg = 0;
      let afa = 0;

      for (const itemDto of dto.items) {
        const nettoOsszeg = itemDto.mennyiseg * itemDto.egysegAr * (1 - (itemDto.kedvezmeny || 0) / 100);
        const afaOsszeg = nettoOsszeg * (itemDto.afaKulcs / 100);
        osszeg += nettoOsszeg;
        afa += afaOsszeg;
      }

      updateData.osszeg = osszeg;
      updateData.afa = afa;
      updateData.vegosszeg = osszeg + afa;

      // Create new items
      await this.prisma.invoiceItem.createMany({
        data: dto.items.map((itemDto, index) => {
          const nettoOsszeg = itemDto.mennyiseg * itemDto.egysegAr * (1 - (itemDto.kedvezmeny || 0) / 100);
          const afaOsszeg = nettoOsszeg * (itemDto.afaKulcs / 100);
          const bruttoOsszeg = nettoOsszeg + afaOsszeg;

          return {
            invoiceId: id,
            itemId: itemDto.itemId,
            nev: itemDto.nev,
            azonosito: itemDto.azonosito,
            mennyiseg: itemDto.mennyiseg,
            egyseg: itemDto.egyseg,
            egysegAr: itemDto.egysegAr,
            kedvezmeny: itemDto.kedvezmeny || 0,
            afaKulcs: itemDto.afaKulcs,
            nettoOsszeg,
            afaOsszeg,
            bruttoOsszeg,
            megjegyzes: itemDto.megjegyzes,
            sorrend: index,
          };
        }),
      });
    }

    return this.prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        account: true,
        items: true,
      },
    });
  }

  async markAsIssued(id: string) {
    const invoice = await this.findOne(id);

    if (invoice.allapot !== 'VAZLAT') {
      throw new BadRequestException('Csak vázlat számla állítható kiallított állapotba');
    }

    return this.prisma.invoice.update({
      where: { id },
      data: {
        allapot: 'KIALLITVA',
      },
    });
  }

  async markAsSent(id: string) {
    const invoice = await this.findOne(id);

    if (invoice.allapot !== 'KIALLITVA') {
      throw new BadRequestException('Csak kiallított számla állítható elküldött állapotba');
    }

    return this.prisma.invoice.update({
      where: { id },
      data: {
        allapot: 'ELKULDVE',
      },
    });
  }

  async addPayment(id: string, dto: CreateInvoicePaymentDto) {
    const invoice = await this.findOne(id);

    if (invoice.allapot === 'STORNO') {
      throw new BadRequestException('Stornózott számlához nem adható hozzá fizetés');
    }

    // Calculate total paid amount
    const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.osszeg, 0);
    const remainingAmount = invoice.vegosszeg - totalPaid;

    if (dto.osszeg > remainingAmount) {
      throw new BadRequestException('A fizetés összege nem lehet nagyobb, mint a fennmaradó összeg');
    }

    const payment = await this.prisma.invoicePayment.create({
      data: {
        invoiceId: id,
        fizetesiDatum: new Date(dto.fizetesiDatum),
        osszeg: dto.osszeg,
        fizetesiMod: dto.fizetesiMod,
        tranzakcioSzam: dto.tranzakcioSzam,
        megjegyzesek: dto.megjegyzesek,
      },
    });

    // Check if invoice is fully paid
    const newTotalPaid = totalPaid + dto.osszeg;
    if (newTotalPaid >= invoice.vegosszeg) {
      await this.prisma.invoice.update({
        where: { id },
        data: {
          allapot: 'KIFIZETVE',
          fizetesiDatum: new Date(dto.fizetesiDatum),
        },
      });
    }

    return payment;
  }

  async storno(id: string, reason?: string) {
    const invoice = await this.findOne(id);

    if (invoice.allapot === 'STORNO') {
      throw new BadRequestException('A számla már stornózva van');
    }

    return this.prisma.invoice.update({
      where: { id },
      data: {
        allapot: 'STORNO',
        megjegyzesek: reason
          ? `${invoice.megjegyzesek || ''}\n\nStorno: ${reason}`.trim()
          : invoice.megjegyzesek,
      },
    });
  }

  async delete(id: string) {
    const invoice = await this.findOne(id);

    if (invoice.allapot !== 'VAZLAT') {
      throw new BadRequestException('Csak vázlat számla törölhető');
    }

    return this.prisma.invoice.delete({
      where: { id },
    });
  }
}

