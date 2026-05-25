import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockMovementService } from './stock-movement.service';
import ExcelJS from 'exceljs';

export type LogisticsExportFormat = 'csv' | 'xlsx';

@Injectable()
export class LogisticsExportService {
  constructor(
    private prisma: PrismaService,
    private stockMovementService: StockMovementService,
  ) {}

  private toCsv(rows: string[][]): string {
    return rows
      .map((r) =>
        r
          .map((c) => {
            const s = String(c ?? '');
            return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(','),
      )
      .join('\n');
  }

  private async toXlsxBuffer(
    sheetName: string,
    headers: string[],
    rows: (string | number)[][],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName);
    sheet.addRow(headers);
    rows.forEach((r) => sheet.addRow(r));
    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  async exportReport(
    reportType: string,
    format: LogisticsExportFormat,
    filters?: Record<string, string>,
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    const ext = format === 'csv' ? 'csv' : 'xlsx';
    const date = new Date().toISOString().split('T')[0];

    switch (reportType) {
      case 'stock-current': {
        const levels = await this.prisma.stockLevel.findMany({
          include: { item: true, warehouse: true },
          orderBy: { updatedAt: 'desc' },
        });
        const headers = ['Cikk', 'Azonosító', 'Raktár', 'Mennyiség', 'Min', 'Max', 'Egység'];
        const rows = levels.map((l) => [
          l.item?.nev ?? '',
          l.item?.azonosito ?? '',
          l.warehouse?.nev ?? '',
          l.mennyiseg,
          l.minimum ?? l.item?.minKeszlet ?? '',
          l.maximum ?? l.item?.maxKeszlet ?? '',
          l.item?.egyseg ?? '',
        ]);
        return this.pack('Aktualis_keszlet', headers, rows, format, ext, date);
      }
      case 'stock-by-warehouse': {
        const wid = filters?.warehouseId;
        const levels = await this.prisma.stockLevel.findMany({
          where: wid ? { warehouseId: wid } : undefined,
          include: { item: true, warehouse: true },
        });
        const headers = ['Raktár', 'Cikk', 'Mennyiség'];
        const rows = levels.map((l) => [
          l.warehouse?.nev ?? '',
          l.item?.nev ?? '',
          l.mennyiseg,
        ]);
        return this.pack('Keszlet_raktarankent', headers, rows, format, ext, date);
      }
      case 'stock-movements': {
        const { movements } = await this.stockMovementService.findMovements({
          warehouseId: filters?.warehouseId,
          itemId: filters?.itemId,
          take: 10000,
        });
        const headers = ['Dátum', 'Típus', 'Cikk', 'Raktár', 'Mennyiség', 'Sarzs', 'Megjegyzés'];
        const rows = movements.map((m) => [
          m.createdAt.toISOString(),
          m.tipus,
          m.item?.nev ?? '',
          m.warehouse?.nev ?? '',
          m.mennyiseg,
          m.sarzsGyartasiSzam ?? '',
          m.megjegyzesek ?? '',
        ]);
        return this.pack('Keszletmozgasok', headers, rows, format, ext, date);
      }
      case 'batches': {
        const { lots } = await this.stockMovementService.findLots({
          warehouseId: filters?.warehouseId,
          take: 10000,
        });
        const headers = ['Sarzs', 'Cikk', 'Raktár', 'Mennyiség', 'Lejárat'];
        const rows = lots.map((l) => [
          l.sarzsGyartasiSzam ?? '',
          l.item?.nev ?? '',
          l.warehouse?.nev ?? '',
          l.mennyiseg,
          l.lejarat ? l.lejarat.toISOString().split('T')[0] : '',
        ]);
        return this.pack('Sarzs_riport', headers, rows, format, ext, date);
      }
      case 'batches-expiring': {
        const days = parseInt(filters?.days || '30', 10);
        const { lots } = await this.stockMovementService.findLots({
          expiringWithinDays: days,
          take: 10000,
        });
        const headers = ['Sarzs', 'Cikk', 'Raktár', 'Mennyiség', 'Lejárat'];
        const rows = lots.map((l) => [
          l.sarzsGyartasiSzam ?? '',
          l.item?.nev ?? '',
          l.warehouse?.nev ?? '',
          l.mennyiseg,
          l.lejarat ? l.lejarat.toISOString().split('T')[0] : '',
        ]);
        return this.pack('Lejaro_sarzs', headers, rows, format, ext, date);
      }
      case 'low-stock': {
        const alerts = await this.stockMovementService.getStockAlerts();
        const headers = ['Cikk', 'Raktár', 'Aktuális', 'Küszöb', 'Típus'];
        const rows = [
          ...alerts.belowMin.map((s) => [
            s.item?.nev ?? '',
            s.warehouse?.nev ?? '',
            s.mennyiseg,
            s.threshold ?? '',
            'minimum alatt',
          ]),
        ];
        return this.pack('Min_keszlet_alatt', headers, rows, format, ext, date);
      }
      case 'purchase-orders': {
        const orders = await this.prisma.purchaseOrder.findMany({
          include: { supplier: true, items: { include: { item: true } } },
          orderBy: { createdAt: 'desc' },
        });
        const headers = ['Azonosító', 'Szállító', 'Állapot', 'Összeg', 'Dátum'];
        const rows = orders.map((o) => [
          o.azonosito,
          o.supplier?.nev ?? '',
          o.allapot,
          o.vegosszeg,
          o.rendelesiDatum.toISOString().split('T')[0],
        ]);
        return this.pack('Beszerzesi_rendelesek', headers, rows, format, ext, date);
      }
      case 'inventory-variance': {
        const sheets = await this.prisma.inventorySheet.findMany({
          where: { allapot: { in: ['BEFEJEZETT', 'JOVAHAGYVA', 'FOLYAMATBAN'] } },
          include: {
            warehouse: true,
            items: { include: { item: true } },
          },
          take: 50,
          orderBy: { createdAt: 'desc' },
        });
        const headers = ['Leltár', 'Cikk', 'Könyv', 'Tényleges', 'Eltérés'];
        const rows: (string | number)[][] = [];
        for (const sh of sheets) {
          for (const it of sh.items) {
            if (it.kulonbseg != null && it.kulonbseg !== 0) {
              rows.push([
                sh.azonosito,
                it.item?.nev ?? '',
                it.konyvKeszlet,
                it.tenylegesKeszlet ?? '',
                it.kulonbseg,
              ]);
            }
          }
        }
        return this.pack('Leltar_elteres', headers, rows, format, ext, date);
      }
      default:
        throw new Error(`Ismeretlen riport típus: ${reportType}`);
    }
  }

  async packRows(
    baseName: string,
    headers: string[],
    rows: (string | number)[][],
    format: LogisticsExportFormat,
  ) {
    const ext = format === 'csv' ? 'csv' : 'xlsx';
    const date = new Date().toISOString().split('T')[0];
    return this.pack(baseName, headers, rows, format, ext, date);
  }

  private async pack(
    baseName: string,
    headers: string[],
    rows: (string | number)[][],
    format: LogisticsExportFormat,
    ext: string,
    date: string,
  ) {
    const filename = `${baseName}_${date}.${ext}`;
    if (format === 'csv') {
      const csv = this.toCsv([headers, ...rows.map((r) => r.map(String))]);
      return {
        buffer: Buffer.from('\uFEFF' + csv, 'utf-8'),
        contentType: 'text/csv; charset=utf-8',
        filename,
      };
    }
    return {
      buffer: await this.toXlsxBuffer(baseName, headers, rows),
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename,
    };
  }
}
