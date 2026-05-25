import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomerInteractionService } from './customer-interaction.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/interactions')
@UseGuards(RbacGuard)
export class CustomerInteractionController {
  constructor(
    private interactionService: CustomerInteractionService,
    private auditService: AuditService,
  ) {}

  @Get('lifecycle/:accountId')
  @Permissions(Permission.CUSTOMER_VIEW)
  async lifecycle(@Param('accountId') accountId: string) {
    return this.interactionService.getLifecycle(accountId);
  }

  @Get('report/:type')
  @Permissions(Permission.CRM_EXPORT)
  async report(@Param('type') type: string) {
    return this.interactionService.report(type as any);
  }

  @Get('report/:type/export/:format')
  @Permissions(Permission.CRM_EXPORT)
  async exportReport(
    @Param('type') type: string,
    @Param('format') format: 'csv' | 'excel',
    @Res() res: Response,
  ) {
    const data = await this.interactionService.exportReport(type, format);
    await this.auditService.log({
      esemeny: 'export',
      entitas: 'CustomerInteractionReport',
      uj: { type, format },
    });
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.send('\ufeff' + data);
    } else {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.end(data);
    }
  }

  @Get('account/:accountId')
  @Permissions(Permission.CUSTOMER_VIEW)
  async byAccount(@Param('accountId') accountId: string) {
    return this.interactionService.findByAccount(accountId);
  }

  @Post()
  @Permissions(Permission.CUSTOMER_EDIT)
  async create(@Body() data: Record<string, unknown>) {
    const row = await this.interactionService.create(data as any);
    await this.auditService.logCreate('CustomerInteraction', row.id, data);
    return row;
  }

  @Put(':id')
  @Permissions(Permission.CUSTOMER_EDIT)
  async update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    const row = await this.interactionService.update(id, data);
    await this.auditService.logUpdate('CustomerInteraction', id, {}, data);
    return row;
  }
}
