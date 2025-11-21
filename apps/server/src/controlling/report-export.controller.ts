import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import { ReportExportService, ExportData } from './report-export.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('controlling/reports/export')
@UseGuards(RbacGuard)
export class ReportExportController {
  constructor(
    private reportExportService: ReportExportService,
    private auditService: AuditService,
  ) {}

  @Post('excel')
  @Permissions(Permission.REPORT_EXPORT)
  async exportToExcel(@Body() data: ExportData, @Res() res: Response, @Request() req: any) {
    const buffer = await this.reportExportService.exportToExcel(data);
    
    await this.auditService.logCreate(
      'ReportExport',
      `excel-${Date.now()}`,
      { format: 'EXCEL', title: data.title },
      req.user?.id,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="riport_${new Date().toISOString().split('T')[0]}.xlsx"`);
    res.end(buffer);
  }

  @Post('csv')
  @Permissions(Permission.REPORT_EXPORT)
  async exportToCsv(@Body() data: ExportData, @Res() res: Response, @Request() req: any) {
    const content = await this.reportExportService.exportToCsv(data);
    
    await this.auditService.logCreate(
      'ReportExport',
      `csv-${Date.now()}`,
      { format: 'CSV', title: data.title },
      req.user?.id,
    );

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="riport_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send('\ufeff' + content);
  }

  @Post('txt')
  @Permissions(Permission.REPORT_EXPORT)
  async exportToTxt(@Body() data: ExportData, @Res() res: Response, @Request() req: any) {
    const content = await this.reportExportService.exportToTxt(data);
    
    await this.auditService.logCreate(
      'ReportExport',
      `txt-${Date.now()}`,
      { format: 'TXT', title: data.title },
      req.user?.id,
    );

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="riport_${new Date().toISOString().split('T')[0]}.txt"`);
    res.send(content);
  }

  @Post('xml')
  @Permissions(Permission.REPORT_EXPORT)
  async exportToXml(@Body() data: ExportData, @Res() res: Response, @Request() req: any) {
    const content = await this.reportExportService.exportToXml(data);
    
    await this.auditService.logCreate(
      'ReportExport',
      `xml-${Date.now()}`,
      { format: 'XML', title: data.title },
      req.user?.id,
    );

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="riport_${new Date().toISOString().split('T')[0]}.xml"`);
    res.send(content);
  }
}

