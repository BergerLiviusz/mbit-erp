import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { CrmMessageService } from './crm-message.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/messages')
@UseGuards(RbacGuard)
export class CrmMessageController {
  constructor(
    private messageService: CrmMessageService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.CUSTOMER_VIEW)
  async findAll(
    @Query('accountId') accountId?: string,
    @Query('ticketId') ticketId?: string,
    @Query('channel') channel?: string,
  ) {
    return this.messageService.findAll({ accountId, ticketId, channel });
  }

  @Post()
  @Permissions(Permission.CUSTOMER_EDIT)
  async create(@Body() data: Record<string, unknown>) {
    const msg = await this.messageService.create(data as any);
    await this.auditService.logCreate('Message', msg.id, data);
    return msg;
  }
}
