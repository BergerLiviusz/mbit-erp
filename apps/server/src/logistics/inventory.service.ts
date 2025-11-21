import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsService } from '../system/settings.service';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { Response } from 'express';

export interface StockLevelDto {
  id: string;
  itemId: string;
  warehouseId: string;
  locationId: string | null;
  mennyiseg: number;
  minimum: number | null;
  maximum: number | null;
  createdAt: Date;
  updatedAt: Date;
  lowStockFlag: boolean;
  item?: any;
  warehouse?: any;
  location?: any;
}

export interface StockFilters {
  warehouseId?: string;
  itemId?: string;
  lowStockOnly?: boolean;
}

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SystemSettingsService,
  ) {}

  private async getLowStockThreshold(): Promise<number> {
    const threshold = await this.settingsService.get('logistics.low_stock_threshold');
    return threshold ? parseFloat(threshold) : 10;
  }

  private async addLowStockFlag(stockLevel: any): Promise<StockLevelDto> {
    const threshold = await this.getLowStockThreshold();
    const lowStockFlag = stockLevel.minimum
      ? stockLevel.mennyiseg <= stockLevel.minimum
      : stockLevel.mennyiseg <= threshold;

    return {
      ...stockLevel,
      lowStockFlag,
    };
  }

  async findAllStockLevels(skip = 0, take = 50, filters?: StockFilters) {
    const where: any = {};

    if (filters?.warehouseId) {
      where.warehouseId = filters.warehouseId;
    }

    if (filters?.itemId) {
      where.itemId = filters.itemId;
    }

    const [total, items] = await Promise.all([
      this.prisma.stockLevel.count({ where }),
      this.prisma.stockLevel.findMany({
        where,
        skip,
        take,
        include: {
          item: true,
          warehouse: true,
          location: true,
        },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    const data = await Promise.all(
      items.map((item) => this.addLowStockFlag(item)),
    );

    const page = Math.floor(skip / take) + 1;
    const pageSize = take;

    return { data, total, page, pageSize };
  }

  async getStockByWarehouse(warehouseId: string) {
    const stockLevels = await this.prisma.stockLevel.findMany({
      where: { warehouseId },
      include: {
        item: true,
        warehouse: true,
        location: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return await Promise.all(
      stockLevels.map((item) => this.addLowStockFlag(item)),
    );
  }

  async checkLowStock() {
    const threshold = await this.getLowStockThreshold();

    const allStockLevels = await this.prisma.stockLevel.findMany({
      include: {
        item: true,
        warehouse: true,
        location: true,
      },
    });

    const lowStockItems = allStockLevels.filter((stockLevel) => {
      return stockLevel.minimum
        ? stockLevel.mennyiseg <= stockLevel.minimum
        : stockLevel.mennyiseg <= threshold;
    });

    return await Promise.all(
      lowStockItems.map((item) => this.addLowStockFlag(item)),
    );
  }

  async createStockLevel(data: {
    itemId: string;
    warehouseId: string;
    locationId?: string | null;
    mennyiseg?: number;
    minimum?: number | null;
    maximum?: number | null;
  }) {
    // Normalize locationId: use null if undefined or null
    const locationId = data.locationId === undefined || data.locationId === null ? null : data.locationId;

    // Check if stock level already exists
    // Use findFirst when locationId is null, as findUnique doesn't handle null in compound unique keys
    let existing;
    if (locationId === null) {
      existing = await this.prisma.stockLevel.findFirst({
        where: {
          itemId: data.itemId,
          warehouseId: data.warehouseId,
          locationId: null,
        },
      });
    } else {
      existing = await this.prisma.stockLevel.findUnique({
        where: {
          itemId_warehouseId_locationId: {
            itemId: data.itemId,
            warehouseId: data.warehouseId,
            locationId: locationId,
          },
        },
      });
    }

    if (existing) {
      // Update existing stock level
      return await this.prisma.stockLevel.update({
        where: { id: existing.id },
        data: {
          mennyiseg: data.mennyiseg !== undefined ? data.mennyiseg : existing.mennyiseg,
          minimum: data.minimum !== undefined ? data.minimum : existing.minimum,
          maximum: data.maximum !== undefined ? data.maximum : existing.maximum,
        },
        include: {
          item: true,
          warehouse: true,
          location: true,
        },
      });
    }

    // Create new stock level
    return await this.prisma.stockLevel.create({
      data: {
        itemId: data.itemId,
        warehouseId: data.warehouseId,
        locationId: locationId,
        mennyiseg: data.mennyiseg || 0,
        minimum: data.minimum || null,
        maximum: data.maximum || null,
      },
      include: {
        item: true,
        warehouse: true,
        location: true,
      },
    });
  }

  async updateStockLevel(
    id: string,
    data: {
      mennyiseg?: number;
      minimum?: number | null;
      maximum?: number | null;
    },
  ) {
    return await this.prisma.stockLevel.update({
      where: { id },
      data,
      include: {
        item: true,
        warehouse: true,
        location: true,
      },
    });
  }

  async deleteStockLevel(id: string) {
    return await this.prisma.stockLevel.delete({
      where: { id },
    });
  }

  async generateInventorySheetPdf(warehouseId: string, res: Response) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new Error('Raktár nem található');
    }

    const stockLevels = await this.prisma.stockLevel.findMany({
      where: { warehouseId },
      include: {
        item: true,
        location: true,
      },
      orderBy: [
        { item: { nev: 'asc' } },
      ],
    });

    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="leltar_${warehouse.azonosito}_${new Date().toISOString().split('T')[0]}.pdf"`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Leltár Ív', { align: 'center' });
    doc.moveDown();
    
    // Warehouse info
    doc.fontSize(12);
    doc.text(`Raktár: ${warehouse.nev}`, { align: 'left' });
    doc.text(`Azonosító: ${warehouse.azonosito}`, { align: 'left' });
    if (warehouse.cim) {
      doc.text(`Cím: ${warehouse.cim}`, { align: 'left' });
    }
    doc.text(`Dátum: ${new Date().toLocaleDateString('hu-HU')}`, { align: 'left' });
    doc.moveDown();

    // Table header
    const tableTop = doc.y;
    const itemHeight = 20;
    const pageWidth = doc.page.width;
    const pageMargins = doc.page.margins;
    const tableWidth = pageWidth - pageMargins.left - pageMargins.right;
    
    const colWidths = {
      nev: tableWidth * 0.25,
      azonosito: tableWidth * 0.15,
      mennyiseg: tableWidth * 0.12,
      hely: tableWidth * 0.15,
      minimum: tableWidth * 0.11,
      maximum: tableWidth * 0.11,
      egyseg: tableWidth * 0.11,
    };

    let y = tableTop;
    
    // Header row
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Terméknév', pageMargins.left, y, { width: colWidths.nev });
    doc.text('Azonosító', pageMargins.left + colWidths.nev, y, { width: colWidths.azonosito });
    doc.text('Készlet', pageMargins.left + colWidths.nev + colWidths.azonosito, y, { width: colWidths.mennyiseg });
    doc.text('Hely', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg, y, { width: colWidths.hely });
    doc.text('Minimum', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg + colWidths.hely, y, { width: colWidths.minimum });
    doc.text('Maximum', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg + colWidths.hely + colWidths.minimum, y, { width: colWidths.maximum });
    doc.text('Egység', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg + colWidths.hely + colWidths.minimum + colWidths.maximum, y, { width: colWidths.egyseg });
    
    y += itemHeight;
    doc.moveTo(pageMargins.left, y).lineTo(pageMargins.left + tableWidth, y).stroke();
    y += 5;

    // Data rows
    doc.fontSize(9).font('Helvetica');
    for (const stock of stockLevels) {
      if (y > doc.page.height - pageMargins.bottom - itemHeight) {
        doc.addPage();
        y = pageMargins.top;
      }

      doc.text(stock.item?.nev || '-', pageMargins.left, y, { width: colWidths.nev });
      doc.text(stock.item?.azonosito || '-', pageMargins.left + colWidths.nev, y, { width: colWidths.azonosito });
      doc.text(stock.mennyiseg?.toLocaleString('hu-HU') || '0', pageMargins.left + colWidths.nev + colWidths.azonosito, y, { width: colWidths.mennyiseg });
      doc.text(stock.location?.nev || '-', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg, y, { width: colWidths.hely });
      doc.text(stock.minimum !== null && stock.minimum !== undefined ? stock.minimum.toLocaleString('hu-HU') : '-', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg + colWidths.hely, y, { width: colWidths.minimum });
      doc.text(stock.maximum !== null && stock.maximum !== undefined ? stock.maximum.toLocaleString('hu-HU') : '-', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg + colWidths.hely + colWidths.minimum, y, { width: colWidths.maximum });
      doc.text(stock.item?.egyseg || '-', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg + colWidths.hely + colWidths.minimum + colWidths.maximum, y, { width: colWidths.egyseg });
      
      y += itemHeight;
    }

    // Footer
    doc.fontSize(8).font('Helvetica');
    doc.text(`Összesen: ${stockLevels.length} tétel`, pageMargins.left, doc.page.height - pageMargins.bottom - 20);

    doc.end();
  }

  async generateInventorySheetExcel(warehouseId: string, res: Response) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new Error('Raktár nem található');
    }

    const stockLevels = await this.prisma.stockLevel.findMany({
      where: { warehouseId },
      include: {
        item: true,
        location: true,
      },
      orderBy: [
        { item: { nev: 'asc' } },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leltár Ív');

    // Header
    worksheet.mergeCells('A1:H1');
    worksheet.getCell('A1').value = 'Leltár Ív';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

    // Warehouse info
    worksheet.getCell('A3').value = 'Raktár:';
    worksheet.getCell('B3').value = warehouse.nev;
    worksheet.getCell('A4').value = 'Azonosító:';
    worksheet.getCell('B4').value = warehouse.azonosito;
    if (warehouse.cim) {
      worksheet.getCell('A5').value = 'Cím:';
      worksheet.getCell('B5').value = warehouse.cim;
    }
    worksheet.getCell('A6').value = 'Dátum:';
    worksheet.getCell('B6').value = new Date().toLocaleDateString('hu-HU');

    // Table header
    const headerRow = 8;
    worksheet.getCell(`A${headerRow}`).value = 'Terméknév';
    worksheet.getCell(`B${headerRow}`).value = 'Azonosító';
    worksheet.getCell(`C${headerRow}`).value = 'Készlet';
    worksheet.getCell(`D${headerRow}`).value = 'Hely';
    worksheet.getCell(`E${headerRow}`).value = 'Minimum';
    worksheet.getCell(`F${headerRow}`).value = 'Maximum';
    worksheet.getCell(`G${headerRow}`).value = 'Egység';
    worksheet.getCell(`H${headerRow}`).value = 'Beszerzési ár';
    worksheet.getCell(`I${headerRow}`).value = 'Eladási ár';
    worksheet.getCell(`J${headerRow}`).value = 'ÁFA kulcs';
    worksheet.getCell(`K${headerRow}`).value = 'Szavatossági idő (nap)';

    // Style header
    worksheet.getRow(headerRow).font = { bold: true };
    worksheet.getRow(headerRow).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Data rows
    stockLevels.forEach((stock, index) => {
      const row = headerRow + 1 + index;
      worksheet.getCell(`A${row}`).value = stock.item?.nev || '-';
      worksheet.getCell(`B${row}`).value = stock.item?.azonosito || '-';
      worksheet.getCell(`C${row}`).value = stock.mennyiseg || 0;
      worksheet.getCell(`C${row}`).numFmt = '#,##0.00';
      worksheet.getCell(`D${row}`).value = stock.location?.nev || '-';
      worksheet.getCell(`E${row}`).value = stock.minimum !== null && stock.minimum !== undefined ? stock.minimum : '-';
      if (stock.minimum !== null && stock.minimum !== undefined) {
        worksheet.getCell(`E${row}`).numFmt = '#,##0.00';
      }
      worksheet.getCell(`F${row}`).value = stock.maximum !== null && stock.maximum !== undefined ? stock.maximum : '-';
      if (stock.maximum !== null && stock.maximum !== undefined) {
        worksheet.getCell(`F${row}`).numFmt = '#,##0.00';
      }
      worksheet.getCell(`G${row}`).value = stock.item?.egyseg || '-';
      worksheet.getCell(`H${row}`).value = stock.item?.beszerzesiAr || 0;
      worksheet.getCell(`H${row}`).numFmt = '#,##0';
      worksheet.getCell(`I${row}`).value = stock.item?.eladasiAr || 0;
      worksheet.getCell(`I${row}`).numFmt = '#,##0';
      worksheet.getCell(`J${row}`).value = stock.item?.afaKulcs || 0;
      worksheet.getCell(`J${row}`).numFmt = '0.00%';
      worksheet.getCell(`K${row}`).value = stock.item?.szavatossagiIdoNap !== null && stock.item?.szavatossagiIdoNap !== undefined ? stock.item.szavatossagiIdoNap : '-';
    });

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="leltar_${warehouse.azonosito}_${new Date().toISOString().split('T')[0]}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  }
}
