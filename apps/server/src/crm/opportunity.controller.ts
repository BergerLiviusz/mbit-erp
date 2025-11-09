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
  Logger,
} from '@nestjs/common';
import { OpportunityService, CreateOpportunityDto, UpdateOpportunityDto } from './opportunity.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/opportunities')
export class OpportunityController {
  private readonly logger = new Logger(OpportunityController.name);

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
  async create(@Body() createDto: any) {
    // Parse and validate date format
    if (createDto.zarvasDatum) {
      try {
        // Handle various date formats
        let dateStr = createDto.zarvasDatum;
        // If date is in format "1220-01-20" (invalid year), try to fix it
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const parts = dateStr.split('-');
          const year = parseInt(parts[0]);
          // If year is less than 1900 or greater than 2100, it's likely invalid
          if (year < 1900 || year > 2100) {
            // Try to interpret as MM/DD/YYYY or DD/MM/YYYY
            this.logger.warn(`Invalid year in date: ${dateStr}, ignoring date`);
            createDto.zarvasDatum = undefined;
          } else {
            // Ensure it's a valid ISO date string
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
              this.logger.warn(`Invalid date format: ${dateStr}, ignoring date`);
              createDto.zarvasDatum = undefined;
            } else {
              createDto.zarvasDatum = date;
            }
          }
        } else {
          // Try to parse as Date object or ISO string
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) {
            this.logger.warn(`Invalid date format: ${dateStr}, ignoring date`);
            createDto.zarvasDatum = undefined;
          } else {
            createDto.zarvasDatum = date;
          }
        }
      } catch (error) {
        this.logger.warn(`Error parsing date: ${createDto.zarvasDatum}, ignoring date`);
        createDto.zarvasDatum = undefined;
      }
    }
    
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
