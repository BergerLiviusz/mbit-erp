import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { OpportunityService, CreateOpportunityDto, UpdateOpportunityDto } from './opportunity.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/opportunities')
export class OpportunityController {
  constructor(
    private opportunityService: OpportunityService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.OPPORTUNITY_VIEW)
  async findAll(
    @Query('skip') skipParam?: string,
    @Query('take') takeParam?: string,
    @Query('szakasz') szakasz?: string,
  ) {
    const skip = skipParam ? parseInt(skipParam, 10) : 0;
    const take = takeParam ? parseInt(takeParam, 10) : 10;
    
    if (isNaN(skip) || skip < 0) {
      throw new BadRequestException('Invalid skip parameter');
    }
    if (isNaN(take) || take < 1) {
      throw new BadRequestException('Invalid take parameter');
    }
    
    return await this.opportunityService.findAll(skip, take, szakasz);
  }

  @Get('stats')
  @Permissions(Permission.OPPORTUNITY_VIEW)
  async getStats() {
    return await this.opportunityService.getStats();
  }

  @Get(':id')
  @Permissions(Permission.OPPORTUNITY_VIEW)
  async findOne(@Param('id') id: string) {
    return await this.opportunityService.findOne(id);
  }

  @Post()
  @Permissions(Permission.OPPORTUNITY_CREATE)
  async create(@Body() createDto: CreateOpportunityDto) {
    const opportunity = await this.opportunityService.create(createDto);
    await this.auditService.logCreate('Opportunity', opportunity.id, createDto);
    return opportunity;
  }

  @Put(':id')
  @Permissions(Permission.OPPORTUNITY_EDIT)
  async update(@Param('id') id: string, @Body() updateDto: UpdateOpportunityDto) {
    const old = await this.opportunityService.findOne(id);
    const opportunity = await this.opportunityService.update(id, updateDto);
    await this.auditService.logUpdate('Opportunity', id, old, updateDto);
    return opportunity;
  }

  @Delete(':id')
  @Permissions(Permission.OPPORTUNITY_DELETE)
  async delete(@Param('id') id: string) {
    const old = await this.opportunityService.findOne(id);
    await this.opportunityService.delete(id);
    await this.auditService.logDelete('Opportunity', id, old);
    return { message: 'Lehetőség törölve' };
  }
}
