import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/campaigns')
@UseGuards(RbacGuard)
export class CampaignController {
  constructor(
    private campaignService: CampaignService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.CAMPAIGN_VIEW)
  async findAll(@Query('skip') skipParam?: string, @Query('take') takeParam?: string) {
    const skip = skipParam ? parseInt(skipParam, 10) : 0;
    const take = takeParam ? parseInt(takeParam, 10) : 50;
    
    if (isNaN(skip) || skip < 0) {
      throw new BadRequestException('Invalid skip parameter');
    }
    if (isNaN(take) || take < 1) {
      throw new BadRequestException('Invalid take parameter');
    }
    
    return await this.campaignService.findAll(skip, take);
  }

  @Get(':id')
  @Permissions(Permission.CAMPAIGN_VIEW)
  async findOne(@Param('id') id: string) {
    return await this.campaignService.findOne(id);
  }

  @Post()
  @Permissions(Permission.CAMPAIGN_CREATE)
  async create(@Body() data: any) {
    const campaign = await this.campaignService.create(data);
    await this.auditService.logCreate('Campaign', campaign.id, data);
    return campaign;
  }

  @Put(':id')
  @Permissions(Permission.CAMPAIGN_EDIT)
  async update(@Param('id') id: string, @Body() data: any) {
    const old = await this.campaignService.findOne(id);
    const campaign = await this.campaignService.update(id, data);
    await this.auditService.logUpdate('Campaign', id, old, data);
    return campaign;
  }

  @Delete(':id')
  @Permissions(Permission.CAMPAIGN_DELETE)
  async delete(@Param('id') id: string) {
    const old = await this.campaignService.findOne(id);
    await this.campaignService.delete(id);
    await this.auditService.logDelete('Campaign', id, old);
    return { message: 'Kampány törölve' };
  }
}
