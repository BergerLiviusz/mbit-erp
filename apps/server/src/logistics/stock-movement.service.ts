import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsService } from '../system/settings.service';

export type StockMovementType =
  | 'BEVETEL'
  | 'KIADAS'
  | 'KORREKCIO'
  | 'ATMOZGATAS';

export interface CreateStockMovementDto {
  tipus: StockMovementType;
  itemId: string;
  warehouseId: string;
  mennyiseg: number;
  forrasRaktarId?: string;
  celRaktarId?: string;
  sarzsGyartasiSzam?: string;
  lejarat?: string;
  beszerzesiAr?: number;
  referenciaId?: string;
  referenciaTipus?: string;
  referenciaAzonosito?: string;
  megjegyzesek?: string;
  userId?: string;
}

@Injectable()
export class StockMovementService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SystemSettingsService,
  ) {}

  private async allowNegativeStock(): Promise<boolean> {
    const v = await this.settingsService.get('logistics.allow_negative_stock');
    return v === 'true';
  }

  private async getStockLevel(
    itemId: string,
    warehouseId: string,
    locationId: string | null = null,
  ) {
    return this.prisma.stockLevel.findFirst({
      where: { itemId, warehouseId, locationId },
    });
  }

  private async ensureStockLevel(
    itemId: string,
    warehouseId: string,
    locationId: string | null = null,
  ) {
    const existing = await this.getStockLevel(itemId, warehouseId, locationId);
    if (existing) return existing;

    const item = await this.prisma.item.findUnique({ where: { id: itemId } });
    return this.prisma.stockLevel.create({
      data: {
        itemId,
        warehouseId,
        locationId,
        mennyiseg: 0,
        minimum: item?.minKeszlet ?? null,
        maximum: item?.maxKeszlet ?? null,
      },
    });
  }

  private async adjustLot(
    itemId: string,
    warehouseId: string,
    sarzsGyartasiSzam: string | null | undefined,
    delta: number,
    beszerzesiAr?: number,
    lejarat?: Date | null,
  ) {
    if (!sarzsGyartasiSzam?.trim()) return;

    const sarzs = sarzsGyartasiSzam.trim();
    const lot = await this.prisma.stockLot.findFirst({
      where: { itemId, warehouseId, sarzsGyartasiSzam: sarzs },
    });

    if (lot) {
      const nextQty = lot.mennyiseg + delta;
      if (nextQty < 0) {
        throw new BadRequestException(`Nincs elegendő sarzs készlet: ${sarzs}`);
      }
      if (nextQty === 0) {
        await this.prisma.stockLot.delete({ where: { id: lot.id } });
      } else {
        await this.prisma.stockLot.update({
          where: { id: lot.id },
          data: { mennyiseg: nextQty },
        });
      }
      return;
    }

    if (delta > 0) {
      const item = await this.prisma.item.findUnique({ where: { id: itemId } });
      await this.prisma.stockLot.create({
        data: {
          itemId,
          warehouseId,
          sarzsGyartasiSzam: sarzs,
          mennyiseg: delta,
          beszerzesiAr: beszerzesiAr ?? item?.beszerzesiAr ?? 0,
          minKeszlet: item?.minKeszlet ?? 0,
          maxKeszlet: item?.maxKeszlet ?? null,
          lejarat: lejarat ?? null,
        },
      });
    }
  }

  private async changeQuantity(
    itemId: string,
    warehouseId: string,
    delta: number,
    opts?: {
      sarzsGyartasiSzam?: string;
      beszerzesiAr?: number;
      lejarat?: Date | null;
    },
  ) {
    const item = await this.prisma.item.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Cikk nem található');

    if (item.sarzsKotelezo && !opts?.sarzsGyartasiSzam?.trim() && delta !== 0) {
      throw new BadRequestException('Sarzs/gyártási szám megadása kötelező ennél a cikknél');
    }

    const level = await this.ensureStockLevel(itemId, warehouseId, null);
    const next = level.mennyiseg + delta;

    if (next < 0 && !(await this.allowNegativeStock())) {
      throw new BadRequestException(
        `Negatív készlet nem engedélyezett (jelenlegi: ${level.mennyiseg}, változás: ${delta})`,
      );
    }

    await this.prisma.stockLevel.update({
      where: { id: level.id },
      data: { mennyiseg: next },
    });

    if (opts?.sarzsGyartasiSzam) {
      await this.adjustLot(
        itemId,
        warehouseId,
        opts.sarzsGyartasiSzam,
        delta,
        opts.beszerzesiAr,
        opts.lejarat,
      );
    }
  }

  async execute(dto: CreateStockMovementDto) {
    if (!dto.mennyiseg || dto.mennyiseg <= 0) {
      throw new BadRequestException('A mennyiségnek pozitívnak kell lennie');
    }

    const qty = dto.mennyiseg;
    const sarzsOpts = {
      sarzsGyartasiSzam: dto.sarzsGyartasiSzam,
      beszerzesiAr: dto.beszerzesiAr,
      lejarat: dto.lejarat ? new Date(dto.lejarat) : null,
    };

    switch (dto.tipus) {
      case 'BEVETEL':
        await this.changeQuantity(dto.itemId, dto.warehouseId, qty, sarzsOpts);
        break;
      case 'KIADAS':
        await this.changeQuantity(dto.itemId, dto.warehouseId, -qty, sarzsOpts);
        break;
      case 'KORREKCIO': {
        const level = await this.ensureStockLevel(dto.itemId, dto.warehouseId, null);
        const delta = qty - level.mennyiseg;
        await this.changeQuantity(dto.itemId, dto.warehouseId, delta, sarzsOpts);
        break;
      }
      case 'ATMOZGATAS': {
        const fromId = dto.forrasRaktarId || dto.warehouseId;
        const toId = dto.celRaktarId;
        if (!toId || fromId === toId) {
          throw new BadRequestException('Forrás és cél raktár megadása kötelező átmozgatáskor');
        }
        await this.changeQuantity(dto.itemId, fromId, -qty, sarzsOpts);
        await this.changeQuantity(dto.itemId, toId, qty, sarzsOpts);
        dto.warehouseId = fromId;
        break;
      }
      default:
        throw new BadRequestException(`Ismeretlen mozgástípus: ${dto.tipus}`);
    }

    return this.prisma.stockMove.create({
      data: {
        itemId: dto.itemId,
        warehouseId: dto.warehouseId,
        forrasRaktarId: dto.forrasRaktarId ?? (dto.tipus === 'ATMOZGATAS' ? dto.warehouseId : null),
        celRaktarId: dto.celRaktarId ?? null,
        tipus: dto.tipus,
        mennyiseg: qty,
        sarzsGyartasiSzam: dto.sarzsGyartasiSzam?.trim() || null,
        referenciaId: dto.referenciaId ?? null,
        referenciaTipus: dto.referenciaTipus ?? null,
        referenciaAzonosito: dto.referenciaAzonosito ?? null,
        userId: dto.userId ?? null,
        megjegyzesek: dto.megjegyzesek ?? null,
      },
      include: { item: true, warehouse: true },
    });
  }

  async findMovements(filters?: {
    itemId?: string;
    warehouseId?: string;
    tipus?: string;
    sarzsGyartasiSzam?: string;
    skip?: number;
    take?: number;
  }) {
    const where: Record<string, unknown> = {};
    if (filters?.itemId) where.itemId = filters.itemId;
    if (filters?.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters?.tipus) where.tipus = filters.tipus;
    if (filters?.sarzsGyartasiSzam) {
      where.sarzsGyartasiSzam = { contains: filters.sarzsGyartasiSzam };
    }

    const skip = filters?.skip ?? 0;
    const take = filters?.take ?? 100;

    const [total, movements] = await Promise.all([
      this.prisma.stockMove.count({ where }),
      this.prisma.stockMove.findMany({
        where,
        skip,
        take,
        include: { item: true, warehouse: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, movements };
  }

  async findLots(filters?: {
    warehouseId?: string;
    itemId?: string;
    sarzsGyartasiSzam?: string;
    expiringWithinDays?: number;
    skip?: number;
    take?: number;
  }) {
    const where: Record<string, unknown> = {};
    if (filters?.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters?.itemId) where.itemId = filters.itemId;
    if (filters?.sarzsGyartasiSzam) {
      where.sarzsGyartasiSzam = { contains: filters.sarzsGyartasiSzam };
    }
    if (filters?.expiringWithinDays != null) {
      const until = new Date();
      until.setDate(until.getDate() + filters.expiringWithinDays);
      where.lejarat = { lte: until, not: null };
    }

    const skip = filters?.skip ?? 0;
    const take = filters?.take ?? 100;

    const [total, lots] = await Promise.all([
      this.prisma.stockLot.count({ where }),
      this.prisma.stockLot.findMany({
        where,
        skip,
        take,
        include: { item: true, warehouse: true },
        orderBy: [{ lejarat: 'asc' }, { createdAt: 'desc' }],
      }),
    ]);

    return { total, lots };
  }

  async getStockAlerts() {
    const levels = await this.prisma.stockLevel.findMany({
      include: { item: true, warehouse: true },
    });

    const belowMin: typeof levels = [];
    const aboveMax: typeof levels = [];

    for (const sl of levels) {
      const min = sl.minimum ?? sl.item?.minKeszlet;
      const max = sl.maximum ?? sl.item?.maxKeszlet;
      if (min != null && sl.mennyiseg < min) belowMin.push(sl);
      if (max != null && sl.mennyiseg > max) aboveMax.push(sl);
    }

    return {
      belowMin: belowMin.map((s) => ({
        ...s,
        alertType: 'BELOW_MIN' as const,
        threshold: s.minimum ?? s.item?.minKeszlet,
      })),
      aboveMax: aboveMax.map((s) => ({
        ...s,
        alertType: 'ABOVE_MAX' as const,
        threshold: s.maximum ?? s.item?.maxKeszlet,
      })),
    };
  }
}
