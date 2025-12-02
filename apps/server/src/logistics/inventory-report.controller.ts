import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { InventoryReportService } from './inventory-report.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { Response } from 'express';

@Controller('logistics/inventory/reports')
@UseGuards(RbacGuard)
export class InventoryReportController {
  constructor(private reportService: InventoryReportService) {}

  @Get('print')
  @Permissions(Permission.INVENTORY_REPORT_PRINT)
  async print(
    @Query('warehouseId') warehouseId?: string,
    @Query('itemGroupId') itemGroupId?: string,
    @Query('format') format: 'pdf' | 'csv' | 'excel' = 'pdf',
    @Query('date') date?: string,
    @Query('lowStockOnly') lowStockOnly?: string,
    @Res() res?: Response,
  ) {
    const filters = {
      warehouseId,
      itemGroupId,
      date,
      lowStockOnly: lowStockOnly === 'true',
    };

    const dateStr = new Date().toISOString().split('T')[0];
    const warehouse = warehouseId ? `_raktar_${warehouseId}` : '';

    try {
      if (format === 'pdf') {
        const buffer = await this.reportService.generatePDF(filters);
        res?.setHeader('Content-Type', 'application/pdf');
        res?.setHeader(
          'Content-Disposition',
          `attachment; filename="Leltariv_${dateStr}${warehouse}.pdf"`,
        );
        res?.send(buffer);
      } else if (format === 'csv') {
        const csv = await this.reportService.generateCSV(filters);
        res?.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res?.setHeader(
          'Content-Disposition',
          `attachment; filename="Leltariv_${dateStr}${warehouse}.csv"`,
        );
        res?.send(Buffer.from(csv, 'utf-8'));
      } else if (format === 'excel') {
        const buffer = await this.reportService.generateExcel(filters);
        res?.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res?.setHeader(
          'Content-Disposition',
          `attachment; filename="Leltariv_${dateStr}${warehouse}.xlsx"`,
        );
        res?.send(buffer);
      } else {
        res?.status(HttpStatus.BAD_REQUEST).json({
          error: 'Érvénytelen formátum. Használjon: pdf, csv vagy excel',
        });
      }
    } catch (error) {
      res?.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Hiba a riport generálása során',
        message: error instanceof Error ? error.message : 'Ismeretlen hiba',
      });
    }
  }

  @Get('by-item-group')
  @Permissions(Permission.INVENTORY_REPORT_PRINT)
  async getByItemGroup(
    @Query('warehouseId') warehouseId?: string,
    @Query('itemGroupId') itemGroupId?: string,
    @Query('date') date?: string,
    @Query('lowStockOnly') lowStockOnly?: string,
  ) {
    const filters = {
      warehouseId,
      itemGroupId,
      date,
      lowStockOnly: lowStockOnly === 'true',
    };

    return await this.reportService.getReportDataByItemGroup(filters);
  }
}

