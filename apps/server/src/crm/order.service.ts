import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsService } from '../system/settings.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SystemSettingsService,
  ) {}

  async findAll(
    skip: number = 0,
    take: number = 50,
    filters?: {
      allapot?: string;
      accountId?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    const where: any = {};

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    if (filters?.accountId) {
      where.accountId = filters.accountId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.rendelesiDatum = {};
      if (filters.startDate) {
        where.rendelesiDatum.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.rendelesiDatum.lte = new Date(filters.endDate);
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        include: {
          account: {
            select: {
              id: true,
              nev: true,
              azonosito: true,
              email: true,
            },
          },
          quote: {
            select: {
              id: true,
              azonosito: true,
            },
          },
          items: {
            include: {
              item: {
                select: {
                  id: true,
                  nev: true,
                  azonosito: true,
                },
              },
            },
          },
          returns: {
            select: {
              id: true,
              allapot: true,
              mennyiseg: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        account: {
          include: {
            contacts: true,
          },
        },
        quote: {
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
        },
        discounts: true,
        shipments: true,
        returns: {
          include: {
            item: true,
            warehouse: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }

    return order;
  }

  async findByAccount(accountId: string) {
    return await this.prisma.order.findMany({
      where: { accountId },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateOrderDto) {
    // Check if account exists
    const account = await this.prisma.account.findUnique({
      where: { id: data.accountId },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${data.accountId} not found.`);
    }

    // If quoteId is provided, check if it exists and is approved
    if (data.quoteId) {
      const quote = await this.prisma.quote.findUnique({
        where: { id: data.quoteId },
      });
      if (!quote) {
        throw new NotFoundException(`Quote with ID ${data.quoteId} not found.`);
      }
      if (quote.allapot !== 'elfogadva' && quote.allapot !== 'jovahagyott') {
        throw new BadRequestException('Only approved or accepted quotes can be converted to orders.');
      }
    }

    const azonosito = await this.generateOrderNumber();

    let osszeg = 0;
    const orderItems = [];

    // Validate items and calculate totals
    for (const itemDto of data.items) {
      const item = await this.prisma.item.findUnique({
        where: { id: itemDto.itemId },
      });
      if (!item) {
        throw new NotFoundException(`Item with ID ${itemDto.itemId} not found.`);
      }

      const kedvezmeny = itemDto.kedvezmeny || 0;
      const itemOsszeg = itemDto.mennyiseg * itemDto.egysegAr * (1 - kedvezmeny / 100);
      osszeg += itemOsszeg;

      orderItems.push({
        itemId: itemDto.itemId,
        mennyiseg: itemDto.mennyiseg,
        egysegAr: itemDto.egysegAr,
        kedvezmeny,
        osszeg: itemOsszeg,
      });
    }

    const afa = osszeg * 0.27; // Default 27% VAT
    const vegosszeg = osszeg + afa;

    return await this.prisma.order.create({
      data: {
        azonosito,
        rendelesiDatum: new Date(),
        szallitasiDatum: data.szallitasiDatum ? new Date(data.szallitasiDatum) : null,
        osszeg,
        afa,
        vegosszeg,
        allapot: OrderStatus.NEW,
        megjegyzesek: data.megjegyzesek,
        account: {
          connect: { id: data.accountId },
        },
        ...(data.quoteId && {
          quote: {
            connect: { id: data.quoteId },
          },
        }),
        items: {
          create: orderItems,
        },
      },
      include: {
        account: true,
        quote: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateOrderDto) {
    const existingOrder = await this.findOne(id);

    // Only allow updates to NEW orders, or status changes
    if (existingOrder.allapot !== OrderStatus.NEW && data.allapot === undefined) {
      throw new BadRequestException('Only NEW orders can be updated. Use status change endpoint for workflow changes.');
    }

    // If updating items, recalculate totals
    let updateData: any = { ...data };
    if (data.items && data.items.length > 0) {
      let osszeg = 0;
      const orderItems = [];

      for (const itemDto of data.items) {
        const item = await this.prisma.item.findUnique({
          where: { id: itemDto.itemId },
        });
        if (!item) {
          throw new NotFoundException(`Item with ID ${itemDto.itemId} not found.`);
        }

        const kedvezmeny = itemDto.kedvezmeny || 0;
        const itemOsszeg = itemDto.mennyiseg * itemDto.egysegAr * (1 - kedvezmeny / 100);
        osszeg += itemOsszeg;

        orderItems.push({
          itemId: itemDto.itemId,
          mennyiseg: itemDto.mennyiseg,
          egysegAr: itemDto.egysegAr,
          kedvezmeny,
          osszeg: itemOsszeg,
        });
      }

      const afa = osszeg * 0.27;
      const vegosszeg = osszeg + afa;

      updateData.osszeg = osszeg;
      updateData.afa = afa;
      updateData.vegosszeg = vegosszeg;

      // Delete old items and create new ones
      await this.prisma.orderItem.deleteMany({
        where: { orderId: id },
      });
      updateData.items = {
        create: orderItems,
      };
    }

    if (data.szallitasiDatum) {
      updateData.szallitasiDatum = new Date(data.szallitasiDatum);
    }

    if (data.teljesitesiDatum) {
      updateData.teljesitesiDatum = new Date(data.teljesitesiDatum);
    }

    return await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        account: true,
        quote: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async changeStatus(id: string, newStatus: OrderStatus, megjegyzesek?: string) {
    const order = await this.findOne(id);

    // Validate status transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.NEW]: [OrderStatus.IN_PROCESS, OrderStatus.CANCELLED],
      [OrderStatus.IN_PROCESS]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const allowedStatuses = validTransitions[order.allapot as OrderStatus];
    if (!allowedStatuses || !allowedStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot change status from ${order.allapot} to ${newStatus}. Valid transitions: ${allowedStatuses.join(', ')}`,
      );
    }

    const updateData: any = {
      allapot: newStatus,
    };

    if (megjegyzesek) {
      updateData.megjegyzesek = order.megjegyzesek
        ? `${order.megjegyzesek}\n\n[${newStatus}] ${megjegyzesek}`
        : `[${newStatus}] ${megjegyzesek}`;
    }

    // Set completion date if status is COMPLETED
    if (newStatus === OrderStatus.COMPLETED) {
      updateData.teljesitesiDatum = new Date();
    }

    return await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        account: true,
        quote: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const order = await this.findOne(id);

    // Only allow deletion of NEW or CANCELLED orders
    if (order.allapot !== OrderStatus.NEW && order.allapot !== OrderStatus.CANCELLED) {
      throw new BadRequestException('Only NEW or CANCELLED orders can be deleted.');
    }

    return await this.prisma.order.delete({
      where: { id },
    });
  }

  private async generateOrderNumber(): Promise<string> {
    const prefix = await this.settingsService.get('order.number.prefix');
    const prefixValue = prefix || 'REND';

    const lastOrder = await this.prisma.order.findFirst({
      where: {
        azonosito: {
          startsWith: prefixValue,
        },
      },
      orderBy: {
        azonosito: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.azonosito.replace(prefixValue, '')) || 0;
      nextNumber = lastNumber + 1;
    }

    return `${prefixValue}-${nextNumber.toString().padStart(6, '0')}`;
  }
}

