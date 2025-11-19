import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { LinkItemSupplierDto } from './dto/link-item-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50, search?: string) {
    const where: any = {};

    if (search) {
      where.OR = [
        { nev: { contains: search } },
        { adoszam: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.supplier.count({ where }),
      this.prisma.supplier.findMany({
        where,
        skip,
        take,
        include: {
          _count: {
            select: {
              itemSuppliers: true,
              purchaseOrders: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        itemSuppliers: {
          include: {
            item: {
              select: {
                id: true,
                azonosito: true,
                nev: true,
              },
            },
          },
        },
        purchaseOrders: {
          select: {
            id: true,
            azonosito: true,
            allapot: true,
            createdAt: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException('Szállító nem található');
    }

    return supplier;
  }

  async create(dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: {
        nev: dto.nev,
        adoszam: dto.adoszam || null,
        cim: dto.cim || null,
        email: dto.email || null,
        telefon: dto.telefon || null,
        aktiv: dto.aktiv !== undefined ? dto.aktiv : true,
      },
    });
  }

  async update(id: string, dto: UpdateSupplierDto) {
    const supplier = await this.findOne(id);

    return this.prisma.supplier.update({
      where: { id },
      data: {
        nev: dto.nev !== undefined ? dto.nev : supplier.nev,
        adoszam: dto.adoszam !== undefined ? dto.adoszam : supplier.adoszam,
        cim: dto.cim !== undefined ? dto.cim : supplier.cim,
        email: dto.email !== undefined ? dto.email : supplier.email,
        telefon: dto.telefon !== undefined ? dto.telefon : supplier.telefon,
        aktiv: dto.aktiv !== undefined ? dto.aktiv : supplier.aktiv,
      },
    });
  }

  async delete(id: string) {
    const supplier = await this.findOne(id);
    
    // Soft delete: set aktiv to false
    return this.prisma.supplier.update({
      where: { id },
      data: {
        aktiv: false,
      },
    });
  }

  async linkItemToSupplier(itemId: string, supplierId: string, dto: LinkItemSupplierDto) {
    // Validate item exists
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Áru nem található');
    }

    // Validate supplier exists
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Szállító nem található');
    }

    // Check if link already exists
    const existingLink = await this.prisma.itemSupplier.findUnique({
      where: {
        itemId_supplierId: {
          itemId,
          supplierId,
        },
      },
    });

    if (existingLink) {
      throw new BadRequestException('Az áru már kapcsolva van ehhez a szállítóhoz');
    }

    // If this is set as primary, unset other primary suppliers for this item
    if (dto.isPrimary) {
      await this.prisma.itemSupplier.updateMany({
        where: {
          itemId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    return this.prisma.itemSupplier.create({
      data: {
        itemId,
        supplierId,
        isPrimary: dto.isPrimary || false,
        beszerzesiAr: dto.beszerzesiAr || null,
        minMennyiseg: dto.minMennyiseg || null,
        szallitasiIdo: dto.szallitasiIdo || null,
        megjegyzesek: dto.megjegyzesek || null,
      },
      include: {
        item: {
          select: {
            id: true,
            azonosito: true,
            nev: true,
          },
        },
        supplier: {
          select: {
            id: true,
            nev: true,
          },
        },
      },
    });
  }

  async unlinkItemFromSupplier(itemId: string, supplierId: string) {
    const link = await this.prisma.itemSupplier.findUnique({
      where: {
        itemId_supplierId: {
          itemId,
          supplierId,
        },
      },
    });

    if (!link) {
      throw new NotFoundException('Kapcsolat nem található');
    }

    await this.prisma.itemSupplier.delete({
      where: {
        itemId_supplierId: {
          itemId,
          supplierId,
        },
      },
    });

    return { success: true };
  }

  async getItemSuppliers(itemId: string) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Áru nem található');
    }

    return this.prisma.itemSupplier.findMany({
      where: { itemId },
      include: {
        supplier: true,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async getSupplierItems(supplierId: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Szállító nem található');
    }

    return this.prisma.itemSupplier.findMany({
      where: { supplierId },
      include: {
        item: {
          select: {
            id: true,
            azonosito: true,
            nev: true,
            egyseg: true,
          },
        },
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async setPrimarySupplier(itemId: string, supplierId: string) {
    // Validate link exists
    const link = await this.prisma.itemSupplier.findUnique({
      where: {
        itemId_supplierId: {
          itemId,
          supplierId,
        },
      },
    });

    if (!link) {
      throw new NotFoundException('Kapcsolat nem található');
    }

    // Unset all other primary suppliers for this item
    await this.prisma.itemSupplier.updateMany({
      where: {
        itemId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });

    // Set this one as primary
    return this.prisma.itemSupplier.update({
      where: {
        itemId_supplierId: {
          itemId,
          supplierId,
        },
      },
      data: {
        isPrimary: true,
      },
      include: {
        item: {
          select: {
            id: true,
            azonosito: true,
            nev: true,
          },
        },
        supplier: {
          select: {
            id: true,
            nev: true,
          },
        },
      },
    });
  }
}

