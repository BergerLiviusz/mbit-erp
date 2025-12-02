import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from './inventory.service';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { Response } from 'express';

export interface InventoryReportFilters {
  warehouseId?: string;
  itemId?: string;
  itemGroupId?: string;
  date?: string;
  lowStockOnly?: boolean;
}

@Injectable()
export class InventoryReportService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
  ) {}

  async getReportData(filters?: InventoryReportFilters) {
    const stockFilters: any = {};

    if (filters?.warehouseId) {
      stockFilters.warehouseId = filters.warehouseId;
    }

    if (filters?.itemId) {
      stockFilters.itemId = filters.itemId;
    }

    const stockLevels = await this.inventoryService.findAllStockLevels(
      0,
      10000,
      stockFilters,
    );

    let data = stockLevels.data;

    // Filter by item group if provided
    if (filters?.itemGroupId) {
      data = data.filter((item) => item.item?.itemGroupId === filters.itemGroupId);
    }

    // Filter low stock if requested
    if (filters?.lowStockOnly) {
      data = data.filter((item) => item.lowStockFlag);
    }

    // Filter by date if provided
    if (filters?.date) {
      const filterDate = new Date(filters.date);
      data = data.filter((item) => {
        const itemDate = new Date(item.updatedAt);
        return itemDate.toDateString() === filterDate.toDateString();
      });
    }

    return data;
  }

  async getReportDataByItemGroup(filters?: InventoryReportFilters) {
    const stockLevels = await this.getReportData(filters);

    // Group by item group
    const groupedData: Record<string, any[]> = {};
    
    stockLevels.forEach((level: any) => {
      const groupId = level.item?.itemGroupId || 'Nincs csoport';
      const groupName = level.item?.itemGroup?.nev || 'Nincs csoport';
      const key = `${groupId}|${groupName}`;
      
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(level);
    });

    // Calculate totals for each group
    const result = Object.entries(groupedData).map(([key, items]) => {
      const [groupId, groupName] = key.split('|');
      const totalQuantity = items.reduce((sum, item) => sum + (item.mennyiseg || 0), 0);
      const totalValue = items.reduce((sum, item) => sum + ((item.mennyiseg || 0) * (item.item?.beszerzesiAr || 0)), 0);
      const itemCount = items.length;

      return {
        groupId: groupId === 'Nincs csoport' ? null : groupId,
        groupName,
        itemCount,
        totalQuantity,
        totalValue,
        items,
      };
    });

    return result;
  }

  async generatePDF(filters?: InventoryReportFilters, res?: Response): Promise<Buffer> {
    const data = await this.getReportData(filters);

    // Get warehouse info if needed
    let warehouse = null;
    if (filters?.warehouseId) {
      warehouse = await this.prisma.warehouse.findUnique({
        where: { id: filters.warehouseId },
      });
    }

    // Get item group info if needed
    let itemGroup = null;
    if (filters?.itemGroupId) {
      itemGroup = await this.prisma.itemGroup.findUnique({
        where: { id: filters.itemGroupId },
      });
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('Leltárív', { align: 'center' });
      doc.moveDown(0.5);

      doc.fontSize(12);
      doc.text(`Dátum: ${new Date().toLocaleDateString('hu-HU')}`, { align: 'left' });
      if (warehouse) {
        doc.text(`Raktár: ${warehouse.nev} (${warehouse.azonosito})`, { align: 'left' });
      } else {
        doc.text('Raktár: Összes raktár', { align: 'left' });
      }
      if (itemGroup) {
        doc.text(`Cikkcsoport: ${itemGroup.nev}`, { align: 'left' });
      }
      doc.moveDown();

      // Table header
      const tableTop = doc.y;
      const tableLeft = 50;
      const colWidths = [80, 150, 80, 60, 100, 70, 70, 60];
      const rowHeight = 25;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Azonosító', tableLeft, tableTop);
      doc.text('Név', tableLeft + colWidths[0], tableTop);
      doc.text('Mennyiség', tableLeft + colWidths[0] + colWidths[1], tableTop);
      doc.text('Egység', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop);
      doc.text('Raktári hely', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop);
      doc.text('Minimum', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], tableTop);
      doc.text('Maximum', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], tableTop);
      doc.text('Státusz', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], tableTop);

      // Draw header line
      doc.moveTo(tableLeft, tableTop + 15).lineTo(tableLeft + colWidths.reduce((a, b) => a + b, 0), tableTop + 15).stroke();

      // Table rows
      doc.font('Helvetica').fontSize(9);
      let y = tableTop + rowHeight;
      let totalQuantity = 0;
      let lowStockCount = 0;

      data.forEach((item) => {
        if (y > 750) {
          // New page
          doc.addPage();
          y = 50;
        }

        totalQuantity += item.mennyiseg;
        if (item.lowStockFlag) {
          lowStockCount++;
        }

        doc.text(item.item?.azonosito || '-', tableLeft, y);
        doc.text(item.item?.nev || '-', tableLeft + colWidths[0], y, { width: colWidths[1] });
        doc.text(item.mennyiseg.toString(), tableLeft + colWidths[0] + colWidths[1], y, { align: 'right' });
        doc.text(item.item?.egyseg || '-', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], y);
        doc.text(item.location?.nev || '-', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
        doc.text(item.minimum?.toString() || '-', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { align: 'right' });
        doc.text(item.maximum?.toString() || '-', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { align: 'right' });
        doc.text(item.lowStockFlag ? 'Alacsony' : 'Normál', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], y);

        y += rowHeight;
      });

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text(`Összesített mennyiség: ${totalQuantity}`, { align: 'left' });
      doc.text(`Alacsony készletű tételek száma: ${lowStockCount}`, { align: 'left' });

      doc.end();
    });
  }

  async generateCSV(filters?: InventoryReportFilters): Promise<string> {
    const data = await this.getReportData(filters);

    // CSV header with UTF-8 BOM for Excel compatibility
    let csv = '\uFEFF';
    csv += 'Azonosító,Név,Mennyiség,Egység,Raktár,Raktári hely,Minimum,Maximum,Státusz\n';

    data.forEach((item) => {
      const row = [
        item.item?.azonosito || '',
        `"${(item.item?.nev || '').replace(/"/g, '""')}"`,
        item.mennyiseg.toString(),
        item.item?.egyseg || '',
        item.warehouse?.nev || '',
        item.location?.nev || '',
        item.minimum?.toString() || '',
        item.maximum?.toString() || '',
        item.lowStockFlag ? 'Alacsony' : 'Normál',
      ];
      csv += row.join(',') + '\n';
    });

    return csv;
  }

  async generateExcel(filters?: InventoryReportFilters): Promise<Buffer> {
    const data = await this.getReportData(filters);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leltárív');

    // Header row
    worksheet.columns = [
      { header: 'Azonosító', key: 'azonosito', width: 15 },
      { header: 'Név', key: 'nev', width: 30 },
      { header: 'Mennyiség', key: 'mennyiseg', width: 12 },
      { header: 'Egység', key: 'egyseg', width: 10 },
      { header: 'Raktár', key: 'raktar', width: 20 },
      { header: 'Raktári hely', key: 'hely', width: 20 },
      { header: 'Minimum', key: 'minimum', width: 12 },
      { header: 'Maximum', key: 'maximum', width: 12 },
      { header: 'Státusz', key: 'status', width: 12 },
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' },
    };

    // Add data rows
    data.forEach((item) => {
      worksheet.addRow({
        azonosito: item.item?.azonosito || '',
        nev: item.item?.nev || '',
        mennyiseg: item.mennyiseg,
        egyseg: item.item?.egyseg || '',
        raktar: item.warehouse?.nev || '',
        hely: item.location?.nev || '',
        minimum: item.minimum || '',
        maximum: item.maximum || '',
        status: item.lowStockFlag ? 'Alacsony' : 'Normál',
      });
    });

    // Add summary row
    const totalRow = worksheet.addRow({});
    totalRow.getCell(1).value = 'Összesített mennyiség:';
    totalRow.getCell(2).value = data.reduce((sum, item) => sum + item.mennyiseg, 0);
    totalRow.getCell(1).font = { bold: true };
    totalRow.getCell(2).font = { bold: true };

    const lowStockRow = worksheet.addRow({});
    lowStockRow.getCell(1).value = 'Alacsony készletű tételek száma:';
    lowStockRow.getCell(2).value = data.filter((item) => item.lowStockFlag).length;
    lowStockRow.getCell(1).font = { bold: true };
    lowStockRow.getCell(2).font = { bold: true };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}

