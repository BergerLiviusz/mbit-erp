import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ReportCatalogService } from './report-catalog.service';
import { AuditService } from '../common/audit/audit.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('controlling/reports')
@UseGuards(RbacGuard)
export class ReportCatalogController {
  constructor(
    private catalog: ReportCatalogService,
    private audit: AuditService,
  ) {}

  @Get('templates')
  @Permissions(Permission.CONTROLLING_VIEW, Permission.REPORT_VIEW)
  list(@Query('kategoria') kategoria?: string) {
    return this.catalog.listTemplates(kategoria);
  }

  @Get('templates/:kod/run/:format')
  @Permissions(Permission.CONTROLLING_EXPORT, Permission.REPORT_EXPORT)
  async runGet(
    @Param('kod') kod: string,
    @Param('format') format: 'csv' | 'xlsx',
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const fmt = format === 'xlsx' ? 'xlsx' : 'csv';
    const userId = (req as any).user?.id;
    const result = await this.catalog.runReport(kod, fmt, userId);
    await this.audit.log({
      userId,
      esemeny: 'export',
      entitas: 'ReportTemplate',
      entitasId: kod,
      uj: { format: fmt },
    });
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.buffer);
  }

  @Post('adhoc/run/:format')
  @Permissions(Permission.CONTROLLING_EXPORT, Permission.REPORT_EXPORT)
  async adHoc(
    @Param('format') format: 'csv' | 'xlsx',
    @Body()
    body: {
      module: string;
      fields: string[];
      dateFrom?: string;
      dateTo?: string;
      status?: string;
    },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const fmt = format === 'xlsx' ? 'xlsx' : 'csv';
    const userId = (req as any).user?.id;
    const result = await this.catalog.runAdHoc(body, fmt);
    await this.audit.log({
      userId,
      esemeny: 'export',
      entitas: 'AdHocReport',
      uj: body,
    });
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.buffer);
  }
}
