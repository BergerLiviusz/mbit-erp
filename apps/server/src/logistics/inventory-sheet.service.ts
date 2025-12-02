import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

export interface CreateInventorySheetDto {
  warehouseId: string;
  leltarDatum?: string;
  megjegyzesek?: string;
}

export interface UpdateInventorySheetDto {
  allapot?: string;
  megjegyzesek?: string;
}

export interface AddInventorySheetItemDto {
  itemId: string;
  locationId?: string;
  tenylegesKeszlet: number;
  megjegyzesek?: string;
}

export interface UpdateInventorySheetItemDto {
  tenylegesKeszlet?: number;
  megjegyzesek?: string;
}

@Injectable()
export class InventorySheetService {
  constructor(private prisma: PrismaService) {}

  async generateSheetNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.inventorySheet.count({
      where: {
        azonosito: {
          startsWith: `L-${year}-`,
        },
      },
    });
    return `L-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async findAll(skip = 0, take = 50, filters?: {
    warehouseId?: string;
    allapot?: string;
  }) {
    const where: any = {};

    if (filters?.warehouseId) {
      where.warehouseId = filters.warehouseId;
    }

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    const [total, items] = await Promise.all([
      this.prisma.inventorySheet.count({ where }),
      this.prisma.inventorySheet.findMany({
        where,
        skip,
        take,
        include: {
          warehouse: {
            select: {
              id: true,
              nev: true,
              azonosito: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              nev: true,
              email: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              nev: true,
              email: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    const sheet = await this.prisma.inventorySheet.findUnique({
      where: { id },
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
            location: true,
          },
          orderBy: {
            item: {
              nev: 'asc',
            },
          },
        },
      },
    });

    if (!sheet) {
      throw new NotFoundException('Leltárív nem található');
    }

    return sheet;
  }

  async create(dto: CreateInventorySheetDto, userId?: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: dto.warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('Raktár nem található');
    }

    const azonosito = await this.generateSheetNumber();

    // Get current stock levels for the warehouse
    const stockLevels = await this.prisma.stockLevel.findMany({
      where: { warehouseId: dto.warehouseId },
      include: {
        item: true,
        location: true,
      },
    });

    // Create inventory sheet with items
    const sheet = await this.prisma.inventorySheet.create({
      data: {
        warehouseId: dto.warehouseId,
        azonosito,
        leltarDatum: dto.leltarDatum ? new Date(dto.leltarDatum) : new Date(),
        megjegyzesek: dto.megjegyzesek,
        createdById: userId,
        allapot: 'NYITOTT',
        items: {
          create: stockLevels.map(stock => ({
            itemId: stock.itemId,
            locationId: stock.locationId,
            konyvKeszlet: stock.mennyiseg,
            tenylegesKeszlet: null,
            kulonbseg: null,
          })),
        },
      },
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
            location: true,
          },
        },
      },
    });

    return sheet;
  }

  async update(id: string, dto: UpdateInventorySheetDto) {
    const sheet = await this.findOne(id);

    if (sheet.allapot === 'LEZARVA') {
      throw new BadRequestException('Lezárt leltárív nem módosítható');
    }

    return this.prisma.inventorySheet.update({
      where: { id },
      data: dto,
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
            location: true,
          },
        },
      },
    });
  }

  async addItem(sheetId: string, dto: AddInventorySheetItemDto) {
    const sheet = await this.findOne(sheetId);

    if (sheet.allapot === 'LEZARVA' || sheet.allapot === 'JOVAHAGYVA') {
      throw new BadRequestException('Ez a leltárív már nem módosítható');
    }

    // Get current stock level
    const stockLevel = await this.prisma.stockLevel.findFirst({
      where: {
        itemId: dto.itemId,
        warehouseId: sheet.warehouseId,
        locationId: dto.locationId || null,
      },
    });

    if (!stockLevel) {
      throw new NotFoundException('Készletszint nem található');
    }

    const kulonbseg = dto.tenylegesKeszlet - stockLevel.mennyiseg;

    return this.prisma.inventorySheetItem.create({
      data: {
        inventorySheetId: sheetId,
        itemId: dto.itemId,
        locationId: dto.locationId || null,
        konyvKeszlet: stockLevel.mennyiseg,
        tenylegesKeszlet: dto.tenylegesKeszlet,
        kulonbseg,
        megjegyzesek: dto.megjegyzesek,
      },
      include: {
        item: true,
        location: true,
      },
    });
  }

  async updateItem(sheetId: string, itemId: string, dto: UpdateInventorySheetItemDto) {
    const sheet = await this.findOne(sheetId);

    if (sheet.allapot === 'LEZARVA' || sheet.allapot === 'JOVAHAGYVA') {
      throw new BadRequestException('Ez a leltárív már nem módosítható');
    }

    const sheetItem = await this.prisma.inventorySheetItem.findFirst({
      where: {
        inventorySheetId: sheetId,
        itemId,
      },
    });

    if (!sheetItem) {
      throw new NotFoundException('Leltárív tétel nem található');
    }

    const tenylegesKeszlet = dto.tenylegesKeszlet !== undefined ? dto.tenylegesKeszlet : sheetItem.tenylegesKeszlet;
    const kulonbseg = tenylegesKeszlet !== null ? tenylegesKeszlet - sheetItem.konyvKeszlet : null;

    return this.prisma.inventorySheetItem.update({
      where: { id: sheetItem.id },
      data: {
        tenylegesKeszlet: dto.tenylegesKeszlet !== undefined ? dto.tenylegesKeszlet : undefined,
        kulonbseg,
        megjegyzesek: dto.megjegyzesek !== undefined ? dto.megjegyzesek : undefined,
      },
      include: {
        item: true,
        location: true,
      },
    });
  }

  async approve(sheetId: string, userId: string) {
    const sheet = await this.findOne(sheetId);

    if (sheet.allapot !== 'BEFEJEZETT') {
      throw new BadRequestException('Csak befejezett leltárív jóváhagyható');
    }

    // Update stock levels based on inventory sheet
    for (const item of sheet.items) {
      if (item.tenylegesKeszlet !== null && item.kulonbseg !== null && item.kulonbseg !== 0) {
        // Find or create stock level
        const stockLevel = await this.prisma.stockLevel.findFirst({
          where: {
            itemId: item.itemId,
            warehouseId: sheet.warehouseId,
            locationId: item.locationId || null,
          },
        });

        if (stockLevel) {
          // Update stock level
          await this.prisma.stockLevel.update({
            where: { id: stockLevel.id },
            data: {
              mennyiseg: item.tenylegesKeszlet,
            },
          });

          // Create stock move for audit trail
          await this.prisma.stockMove.create({
            data: {
              itemId: item.itemId,
              warehouseId: sheet.warehouseId,
              tipus: 'LELTAR_KORREKCIO',
              mennyiseg: item.kulonbseg,
              megjegyzesek: `Leltárív korrekció: ${sheet.azonosito}`,
            },
          });
        }
      }
    }

    // Update sheet status
    return this.prisma.inventorySheet.update({
      where: { id: sheetId },
      data: {
        allapot: 'JOVAHAGYVA',
        approvedById: userId,
      },
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
            location: true,
          },
        },
      },
    });
  }

  async close(sheetId: string) {
    const sheet = await this.findOne(sheetId);

    if (sheet.allapot !== 'JOVAHAGYVA') {
      throw new BadRequestException('Csak jóváhagyott leltárív zárható le');
    }

    return this.prisma.inventorySheet.update({
      where: { id: sheetId },
      data: {
        allapot: 'LEZARVA',
      },
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
            location: true,
          },
        },
      },
    });
  }

  async revertApproval(sheetId: string) {
    const sheet = await this.findOne(sheetId);

    if (sheet.allapot !== 'JOVAHAGYVA') {
      throw new BadRequestException('Csak jóváhagyott leltárív jóváhagyása vonható vissza');
    }

    // Revert stock levels back to original (konyvKeszlet)
    for (const item of sheet.items) {
      if (item.tenylegesKeszlet !== null && item.kulonbseg !== null && item.kulonbseg !== 0) {
        const stockLevel = await this.prisma.stockLevel.findFirst({
          where: {
            itemId: item.itemId,
            warehouseId: sheet.warehouseId,
            locationId: item.locationId || null,
          },
        });

        if (stockLevel) {
          // Revert to original stock level (konyvKeszlet)
          await this.prisma.stockLevel.update({
            where: { id: stockLevel.id },
            data: {
              mennyiseg: item.konyvKeszlet,
            },
          });

          // Create stock move for audit trail (revert)
          await this.prisma.stockMove.create({
            data: {
              itemId: item.itemId,
              warehouseId: sheet.warehouseId,
              tipus: 'LELTAR_VISSZAVONAS',
              mennyiseg: -item.kulonbseg,
              megjegyzesek: `Leltárív jóváhagyás visszavonása: ${sheet.azonosito}`,
            },
          });
        }
      }
    }

    // Update sheet status to BEFEJEZETT and clear approvedBy
    return this.prisma.inventorySheet.update({
      where: { id: sheetId },
      data: {
        allapot: 'BEFEJEZETT',
        approvedById: null,
      },
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
            location: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const sheet = await this.findOne(id);

    if (sheet.allapot === 'JOVAHAGYVA' || sheet.allapot === 'LEZARVA') {
      throw new BadRequestException('Jóváhagyott vagy lezárt leltárív nem törölhető');
    }

    return this.prisma.inventorySheet.delete({
      where: { id },
    });
  }

  async generatePdf(id: string, res: Response): Promise<void> {
    const sheet = await this.findOne(id);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="leltariv_${sheet.azonosito}_${new Date().toISOString().split('T')[0]}.pdf"`
      );

      doc.pipe(res);

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('Leltárív', { align: 'center' });
      doc.moveDown(0.5);

      // Sheet information
      doc.fontSize(12).font('Helvetica');
      doc.text(`Azonosító: ${sheet.azonosito}`, { align: 'left' });
      doc.text(`Dátum: ${new Date(sheet.leltarDatum).toLocaleDateString('hu-HU')}`, { align: 'left' });
      
      if (sheet.warehouse) {
        doc.text(`Raktár: ${sheet.warehouse.nev} (${sheet.warehouse.azonosito})`, { align: 'left' });
        if (sheet.warehouse.cim) {
          doc.text(`Raktár címe: ${sheet.warehouse.cim}`, { align: 'left' });
        }
      }
      
      if (sheet.createdBy) {
        doc.text(`Létrehozta: ${sheet.createdBy.nev}`, { align: 'left' });
      }
      
      if (sheet.approvedBy) {
        doc.text(`Jóváhagyta: ${sheet.approvedBy.nev}`, { align: 'left' });
      }
      
      doc.text(`Állapot: ${sheet.allapot}`, { align: 'left' });
      
      if (sheet.megjegyzesek) {
        doc.moveDown(0.5);
        doc.text(`Megjegyzések: ${sheet.megjegyzesek}`, { align: 'left' });
      }

      doc.moveDown();

      // Table header
      const tableTop = doc.y;
      const tableLeft = 50;
      const pageWidth = doc.page.width - 100;
      const colWidths = {
        azonosito: pageWidth * 0.15,
        nev: pageWidth * 0.25,
        konyvKeszlet: pageWidth * 0.12,
        tenylegesKeszlet: pageWidth * 0.12,
        kulonbseg: pageWidth * 0.12,
        hely: pageWidth * 0.12,
        megjegyzesek: pageWidth * 0.12,
      };
      const rowHeight = 20;

      let y = tableTop;

      // Draw table header
      doc.fontSize(9).font('Helvetica-Bold');
      doc.rect(tableLeft, y, pageWidth, rowHeight).stroke();
      
      doc.text('Cikk azon.', tableLeft + 5, y + 5, { width: colWidths.azonosito - 10 });
      doc.text('Cikk név', tableLeft + colWidths.azonosito + 5, y + 5, { width: colWidths.nev - 10 });
      doc.text('Könyv szerinti', tableLeft + colWidths.azonosito + colWidths.nev + 5, y + 5, { width: colWidths.konyvKeszlet - 10 });
      doc.text('Tényleges', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + 5, y + 5, { width: colWidths.tenylegesKeszlet - 10 });
      doc.text('Különbözet', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + 5, y + 5, { width: colWidths.kulonbseg - 10 });
      doc.text('Raktári hely', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + 5, y + 5, { width: colWidths.hely - 10 });
      doc.text('Megjegyzés', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + colWidths.hely + 5, y + 5, { width: colWidths.megjegyzesek - 10 });

      y += rowHeight;

      // Draw table rows
      doc.fontSize(8).font('Helvetica');
      let totalKulonbseg = 0;
      let itemCount = 0;

      sheet.items.forEach((item, index) => {
        // Check if we need a new page
        if (y + rowHeight > doc.page.height - 50) {
          doc.addPage();
          y = 50;
          
          // Redraw header on new page
          doc.fontSize(9).font('Helvetica-Bold');
          doc.rect(tableLeft, y, pageWidth, rowHeight).stroke();
          doc.text('Cikk azon.', tableLeft + 5, y + 5, { width: colWidths.azonosito - 10 });
          doc.text('Cikk név', tableLeft + colWidths.azonosito + 5, y + 5, { width: colWidths.nev - 10 });
          doc.text('Könyv szerinti', tableLeft + colWidths.azonosito + colWidths.nev + 5, y + 5, { width: colWidths.konyvKeszlet - 10 });
          doc.text('Tényleges', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + 5, y + 5, { width: colWidths.tenylegesKeszlet - 10 });
          doc.text('Különbözet', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + 5, y + 5, { width: colWidths.kulonbseg - 10 });
          doc.text('Raktári hely', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + 5, y + 5, { width: colWidths.hely - 10 });
          doc.text('Megjegyzés', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + colWidths.hely + 5, y + 5, { width: colWidths.megjegyzesek - 10 });
          y += rowHeight;
          doc.fontSize(8).font('Helvetica');
        }

        // Draw row border
        doc.rect(tableLeft, y, pageWidth, rowHeight).stroke();

        // Row data
        const itemNev = item.item?.nev || 'Ismeretlen';
        const itemAzonosito = item.item?.azonosito || '-';
        const konyvKeszlet = item.konyvKeszlet.toLocaleString('hu-HU');
        const tenylegesKeszlet = item.tenylegesKeszlet !== null ? item.tenylegesKeszlet.toLocaleString('hu-HU') : '-';
        const kulonbseg = item.kulonbseg !== null ? item.kulonbseg.toLocaleString('hu-HU') : '-';
        const hely = item.location?.nev || item.location?.azonosito || '-';
        const megjegyzes = item.megjegyzesek || '';

        // Color for difference
        if (item.kulonbseg !== null && item.kulonbseg !== 0) {
          if (item.kulonbseg > 0) {
            doc.fillColor('green');
          } else {
            doc.fillColor('red');
          }
        } else {
          doc.fillColor('black');
        }

        doc.text(itemAzonosito, tableLeft + 5, y + 5, { width: colWidths.azonosito - 10 });
        doc.text(itemNev, tableLeft + colWidths.azonosito + 5, y + 5, { width: colWidths.nev - 10 });
        doc.text(konyvKeszlet, tableLeft + colWidths.azonosito + colWidths.nev + 5, y + 5, { width: colWidths.konyvKeszlet - 10, align: 'right' });
        doc.text(tenylegesKeszlet, tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + 5, y + 5, { width: colWidths.tenylegesKeszlet - 10, align: 'right' });
        doc.text(kulonbseg, tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + 5, y + 5, { width: colWidths.kulonbseg - 10, align: 'right' });
        doc.text(hely, tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + 5, y + 5, { width: colWidths.hely - 10 });
        doc.text(megjegyzes.substring(0, 30), tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + colWidths.hely + 5, y + 5, { width: colWidths.megjegyzesek - 10 });

        doc.fillColor('black');

        if (item.kulonbseg !== null) {
          totalKulonbseg += item.kulonbseg;
        }
        itemCount++;

        y += rowHeight;
      });

      // Summary
      doc.moveDown();
      y += 10;
      
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Összesítő:', tableLeft, y);
      y += 15;
      
      doc.fontSize(9).font('Helvetica');
      doc.text(`Összes tétel száma: ${itemCount}`, tableLeft, y);
      y += 12;
      doc.text(`Összes különbözet: ${totalKulonbseg.toLocaleString('hu-HU')}`, tableLeft, y);

      // Footer
      doc.fontSize(8).font('Helvetica');
      doc.text(
        `Generálva: ${new Date().toLocaleString('hu-HU')}`,
        tableLeft,
        doc.page.height - 30,
        { align: 'left' }
      );

      doc.end();
      
      doc.on('end', () => resolve());
      doc.on('error', (err) => reject(err));
    });
  }
}

