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
  Request,
} from '@nestjs/common';
import {
  KpiService,
  CreateKPIDto,
  UpdateKPIDto,
} from './kpi.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('controlling/kpi')
@UseGuards(RbacGuard)
export class KpiController {
  constructor(
    private kpiService: KpiService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.REPORT_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('aktiv') aktiv?: string,
    @Query('tipus') tipus?: string,
  ) {
    return this.kpiService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
        tipus,
      },
    );
  }

  @Get(':id')
  @Permissions(Permission.REPORT_VIEW)
  findOne(@Param('id') id: string) {
    return this.kpiService.findOne(id);
  }

  @Post(':id/calculate')
  @Permissions(Permission.REPORT_VIEW)
  calculateKPI(@Param('id') id: string) {
    return this.kpiService.calculateKPI(id);
  }

  @Post()
  @Permissions(Permission.REPORT_CREATE)
  async create(@Body() dto: CreateKPIDto, @Request() req: any) {
    const kpi = await this.kpiService.create(dto);
    
    await this.auditService.logCreate(
      'KPI',
      kpi.id,
      kpi,
      req.user?.id,
    );

    return kpi;
  }

  @Put(':id')
  @Permissions(Permission.REPORT_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateKPIDto,
    @Request() req: any,
  ) {
    const oldKpi = await this.kpiService.findOne(id);
    const updated = await this.kpiService.update(id, dto);
    
    await this.auditService.logUpdate(
      'KPI',
      id,
      oldKpi,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Delete(':id')
  @Permissions(Permission.REPORT_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const oldKpi = await this.kpiService.findOne(id);
    await this.kpiService.delete(id);
    
    await this.auditService.logDelete(
      'KPI',
      id,
      oldKpi,
      req.user?.id,
    );

    return { message: 'KPI törölve' };
  }
}

