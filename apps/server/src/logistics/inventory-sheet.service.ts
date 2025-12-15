import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { Response } from 'express';

export interface CreateInventorySheetDto {
  warehouseId: string;
  leltarDatum?: string;
  megjegyzesek?: string;
  itemIds?: string[]; // Opcionális: csak ezeket a cikkeket tartalmazza a leltárív
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
    const whereClause: any = { warehouseId: dto.warehouseId };
    
    // If itemIds are provided, filter by them (partial inventory)
    if (dto.itemIds && dto.itemIds.length > 0) {
      whereClause.itemId = { in: dto.itemIds };
    }

    const stockLevels = await this.prisma.stockLevel.findMany({
      where: whereClause,
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

      // Header with better formatting
      doc.fontSize(24).font('Helvetica-Bold').text('Leltárív', { align: 'center' });
      doc.moveDown(1);

      // Sheet information in two columns
      const infoLeft = 50;
      const infoRight = doc.page.width / 2 + 25;
      let infoY = doc.y;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Leltárív adatok', infoLeft, infoY);
      infoY += 15;

      doc.fontSize(9).font('Helvetica');
      doc.text(`Azonosító: ${sheet.azonosito}`, infoLeft, infoY);
      infoY += 12;
      doc.text(`Dátum: ${new Date(sheet.leltarDatum).toLocaleDateString('hu-HU')}`, infoLeft, infoY);
      infoY += 12;
      doc.text(`Állapot: ${sheet.allapot}`, infoLeft, infoY);
      infoY += 15;

      if (sheet.warehouse) {
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Raktár adatok', infoLeft, infoY);
        infoY += 15;
        doc.fontSize(9).font('Helvetica');
        doc.text(`${sheet.warehouse.nev} (${sheet.warehouse.azonosito})`, infoLeft, infoY);
        infoY += 12;
        if (sheet.warehouse.cim) {
          doc.text(`Cím: ${sheet.warehouse.cim}`, infoLeft, infoY);
          infoY += 12;
        }
      }

      let infoYRight = doc.y + 15;
      if (sheet.createdBy) {
        doc.fontSize(9).font('Helvetica');
        doc.text(`Létrehozta: ${sheet.createdBy.nev}`, infoRight, infoYRight);
        infoYRight += 12;
      }
      
      if (sheet.approvedBy) {
        doc.text(`Jóváhagyta: ${sheet.approvedBy.nev}`, infoRight, infoYRight);
        infoYRight += 12;
      }
      
      if (sheet.megjegyzesek) {
        doc.moveDown(1);
        doc.fontSize(9).font('Helvetica');
        doc.text(`Megjegyzések: ${sheet.megjegyzesek}`, infoLeft, doc.y, { width: pageWidth });
        doc.moveDown(0.5);
      }

      doc.moveDown(1);

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
        // Truncate or wrap long text
        const maxMegjegyzesLength = 40;
        const megjegyzesText = megjegyzes.length > maxMegjegyzesLength 
          ? megjegyzes.substring(0, maxMegjegyzesLength) + '...' 
          : megjegyzes;
        doc.text(megjegyzesText, tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + colWidths.hely + 5, y + 5, { width: colWidths.megjegyzesek - 10 });

        doc.fillColor('black');

        if (item.kulonbseg !== null) {
          totalKulonbseg += item.kulonbseg;
        }
        itemCount++;

        y += rowHeight;
      });

      // Summary
      doc.moveDown(1);
      y = doc.y;
      
      // Draw summary box
      const summaryBoxHeight = 40;
      doc.rect(tableLeft, y, pageWidth, summaryBoxHeight).stroke();
      doc.fillColor('lightgray');
      doc.rect(tableLeft, y, pageWidth, summaryBoxHeight).fill();
      doc.fillColor('black');
      
      y += 10;
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Összesítő:', tableLeft + 5, y);
      y += 15;
      
      doc.fontSize(9).font('Helvetica');
      doc.text(`Összes tétel száma: ${itemCount}`, tableLeft + 5, y);
      y += 12;
      doc.text(`Összes különbözet: ${totalKulonbseg.toLocaleString('hu-HU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, tableLeft + 5, y);

      // Footer on each page
      const addFooter = (pageDoc: typeof doc) => {
        pageDoc.fontSize(7).font('Helvetica');
        pageDoc.text(
          `Generálva: ${new Date().toLocaleString('hu-HU')} | Oldal ${pageDoc.page.number}`,
          tableLeft,
          pageDoc.page.height - 20,
          { align: 'left' }
        );
      };

      // Add footer to all pages
      doc.on('pageAdded', () => {
        addFooter(doc);
      });
      
      // Add footer to first page
      addFooter(doc);

      doc.end();
      
      doc.on('end', () => resolve());
      doc.on('error', (err) => reject(err));
    });
  }

  async generateExcel(id: string, res: Response): Promise<void> {
    const sheet = await this.findOne(id);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leltárív');

    // Header
    worksheet.mergeCells('A1:H1');
    worksheet.getCell('A1').value = 'Leltárív';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

    // Sheet information
    let infoRow = 3;
    worksheet.getCell(`A${infoRow}`).value = 'Azonosító:';
    worksheet.getCell(`B${infoRow}`).value = sheet.azonosito;
    infoRow++;

    worksheet.getCell(`A${infoRow}`).value = 'Dátum:';
    worksheet.getCell(`B${infoRow}`).value = new Date(sheet.leltarDatum).toLocaleDateString('hu-HU');
    infoRow++;

    if (sheet.warehouse) {
      worksheet.getCell(`A${infoRow}`).value = 'Raktár:';
      worksheet.getCell(`B${infoRow}`).value = `${sheet.warehouse.nev} (${sheet.warehouse.azonosito})`;
      infoRow++;
      
      if (sheet.warehouse.cim) {
        worksheet.getCell(`A${infoRow}`).value = 'Raktár címe:';
        worksheet.getCell(`B${infoRow}`).value = sheet.warehouse.cim;
        infoRow++;
      }
    }

    if (sheet.createdBy) {
      worksheet.getCell(`A${infoRow}`).value = 'Létrehozta:';
      worksheet.getCell(`B${infoRow}`).value = sheet.createdBy.nev;
      infoRow++;
    }

    if (sheet.approvedBy) {
      worksheet.getCell(`A${infoRow}`).value = 'Jóváhagyta:';
      worksheet.getCell(`B${infoRow}`).value = sheet.approvedBy.nev;
      infoRow++;
    }

    worksheet.getCell(`A${infoRow}`).value = 'Állapot:';
    worksheet.getCell(`B${infoRow}`).value = sheet.allapot;
    infoRow++;

    if (sheet.megjegyzesek) {
      worksheet.getCell(`A${infoRow}`).value = 'Megjegyzések:';
      worksheet.getCell(`B${infoRow}`).value = sheet.megjegyzesek;
      infoRow++;
    }

    // Table header
    const headerRow = infoRow + 1;
    worksheet.getCell(`A${headerRow}`).value = 'Cikk azonosító';
    worksheet.getCell(`B${headerRow}`).value = 'Cikk név';
    worksheet.getCell(`C${headerRow}`).value = 'Könyv szerinti készlet';
    worksheet.getCell(`D${headerRow}`).value = 'Tényleges készlet';
    worksheet.getCell(`E${headerRow}`).value = 'Különbözet';
    worksheet.getCell(`F${headerRow}`).value = 'Raktári hely';
    worksheet.getCell(`G${headerRow}`).value = 'Megjegyzés';

    // Style header
    worksheet.getRow(headerRow).font = { bold: true };
    worksheet.getRow(headerRow).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };
    worksheet.getRow(headerRow).eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data rows
    let totalKulonbseg = 0;
    sheet.items.forEach((item, index) => {
      const row = headerRow + 1 + index;
      worksheet.getCell(`A${row}`).value = item.item?.azonosito || '-';
      worksheet.getCell(`B${row}`).value = item.item?.nev || 'Ismeretlen';
      worksheet.getCell(`C${row}`).value = item.konyvKeszlet;
      worksheet.getCell(`C${row}`).numFmt = '#,##0.00';
      worksheet.getCell(`D${row}`).value = item.tenylegesKeszlet !== null ? item.tenylegesKeszlet : '-';
      if (item.tenylegesKeszlet !== null) {
        worksheet.getCell(`D${row}`).numFmt = '#,##0.00';
      }
      worksheet.getCell(`E${row}`).value = item.kulonbseg !== null ? item.kulonbseg : '-';
      if (item.kulonbseg !== null) {
        worksheet.getCell(`E${row}`).numFmt = '#,##0.00';
        // Color coding for difference
        if (item.kulonbseg > 0) {
          worksheet.getCell(`E${row}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF90EE90' }, // Light green
          };
        } else if (item.kulonbseg < 0) {
          worksheet.getCell(`E${row}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFB6C1' }, // Light red
          };
        }
        totalKulonbseg += item.kulonbseg;
      }
      worksheet.getCell(`F${row}`).value = item.location?.nev || item.location?.azonosito || '-';
      worksheet.getCell(`G${row}`).value = item.megjegyzesek || '';

      // Add borders to data rows
      worksheet.getRow(row).eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Summary row
    const summaryRow = headerRow + sheet.items.length + 2;
    worksheet.getCell(`A${summaryRow}`).value = 'Összesítő:';
    worksheet.getCell(`A${summaryRow}`).font = { bold: true };
    
    worksheet.getCell(`B${summaryRow}`).value = 'Összes tétel száma:';
    worksheet.getCell(`C${summaryRow}`).value = sheet.items.length;
    worksheet.getCell(`C${summaryRow}`).font = { bold: true };
    
    worksheet.getCell(`D${summaryRow}`).value = 'Összes különbözet:';
    worksheet.getCell(`E${summaryRow}`).value = totalKulonbseg;
    worksheet.getCell(`E${summaryRow}`).numFmt = '#,##0.00';
    worksheet.getCell(`E${summaryRow}`).font = { bold: true };

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell!({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="leltariv_${sheet.azonosito}_${new Date().toISOString().split('T')[0]}.xlsx"`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}

