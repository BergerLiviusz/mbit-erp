import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/leads')
@UseGuards(RbacGuard)
export class LeadController {
  constructor(
    private leadService: LeadService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.OPPORTUNITY_VIEW)
  async findAll(
    @Query('allapot') allapot?: string,
    @Query('campaignId') campaignId?: string,
  ) {
    return this.leadService.findAll({ allapot, campaignId });
  }

  @Get(':id')
  @Permissions(Permission.OPPORTUNITY_VIEW)
  async findOne(@Param('id') id: string) {
    return this.leadService.findOne(id);
  }

  @Post()
  @Permissions(Permission.OPPORTUNITY_CREATE)
  async create(@Body() data: Record<string, unknown>) {
    const lead = await this.leadService.create(data as any);
    await this.auditService.logCreate('Lead', lead.id, data);
    return lead;
  }

  @Put(':id')
  @Permissions(Permission.OPPORTUNITY_EDIT)
  async update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    const old = await this.leadService.findOne(id);
    const lead = await this.leadService.update(id, data);
    await this.auditService.logUpdate('Lead', id, old, data);
    return lead;
  }

  @Delete(':id')
  @Permissions(Permission.OPPORTUNITY_DELETE)
  async delete(@Param('id') id: string) {
    const old = await this.leadService.findOne(id);
    await this.leadService.delete(id);
    await this.auditService.logDelete('Lead', id, old);
    return { message: 'Lead törölve' };
  }
}
