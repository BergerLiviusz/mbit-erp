import { Controller, Get, Query, UseGuards, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { AuditService } from './audit.service';
import { Permissions } from '../rbac/rbac.decorator';
import { Permission } from '../rbac/permission.enum';
import { RbacGuard } from '../rbac/rbac.guard';
import * as ExcelJS from 'exceljs';

@Controller('system/audit')
@UseGuards(RbacGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  @Permissions(Permission.SYSTEM_AUDIT_VIEW)
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('entitas') entitas?: string,
    @Query('entitasId') entitasId?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
  ) {
    if (entitas && entitasId) {
      return this.auditService.getActivityByEntity(entitas, entitasId);
    }
    if (limit && !startDate) {
      return this.auditService.getRecentActivity(parseInt(limit, 10) || 50);
    }
    return this.auditService.export({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      entitas,
      userId,
    });
  }

  @Get('export/:format')
  @Permissions(Permission.SYSTEM_AUDIT_EXPORT)
  async export(
    @Param('format') format: string,
    @Res() res: Response,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('entitas') entitas?: string,
  ) {
    const logs = await this.auditService.export({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      entitas,
    });

    if (format === 'csv') {
      const header = 'Datum,Felhasznalo,Esemeny,Entitas,EntitasId';
      const rows = logs.map(
        (l) =>
          `${l.createdAt},${l.user?.email || ''},${l.esemeny},${l.entitas},${l.entitasId || ''}`,
      );
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.send('\ufeff' + [header, ...rows].join('\n'));
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Audit');
    sheet.addRow(['Dátum', 'Felhasználó', 'Esemény', 'Entitás', 'Entitás ID']);
    logs.forEach((l) =>
      sheet.addRow([
        l.createdAt,
        l.user?.nev || l.user?.email,
        l.esemeny,
        l.entitas,
        l.entitasId,
      ]),
    );
    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.end(buffer);
  }
}
