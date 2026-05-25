import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LogisticsExportService } from './logistics-export.service';
import { AuditService } from '../common/audit/audit.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('logistics/reports')
@UseGuards(RbacGuard)
export class LogisticsExportController {
  constructor(
    private exportService: LogisticsExportService,
    private auditService: AuditService,
  ) {}

  @Get('types')
  @Permissions(Permission.LOGISTICS_VIEW, Permission.REPORT_VIEW)
  listTypes() {
    return [
      { id: 'stock-current', label: 'Aktuális készlet' },
      { id: 'stock-by-warehouse', label: 'Készlet raktáranként' },
      { id: 'stock-movements', label: 'Készletmozgások' },
      { id: 'batches', label: 'Sarzs riport' },
      { id: 'batches-expiring', label: 'Lejáró sarzs' },
      { id: 'low-stock', label: 'Minimum alatti tételek' },
      { id: 'purchase-orders', label: 'Beszerzési rendelések' },
      { id: 'inventory-variance', label: 'Leltár eltérések' },
    ];
  }

  @Get(':reportType/export/:format')
  @Permissions(Permission.LOGISTICS_EXPORT, Permission.REPORT_EXPORT)
  async export(
    @Param('reportType') reportType: string,
    @Param('format') format: 'csv' | 'xlsx',
    @Query() query: Record<string, string>,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const fmt = format === 'xlsx' ? 'xlsx' : 'csv';
    const result = await this.exportService.exportReport(reportType, fmt, query);
    const userId = (req as any).user?.id ?? (req as any).user?.userId;
    await this.auditService.log({
      userId,
      esemeny: 'export',
      entitas: 'LogisticsReport',
      entitasId: reportType,
      uj: { format: fmt, filters: query },
    });
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.buffer);
  }
}
