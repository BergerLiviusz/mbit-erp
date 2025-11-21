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
  DataSourceService,
  CreateDataSourceDto,
  UpdateDataSourceDto,
  CreateDataLoadJobDto,
  UpdateDataLoadJobDto,
} from './data-source.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('controlling/data-sources')
@UseGuards(RbacGuard)
export class DataSourceController {
  constructor(
    private dataSourceService: DataSourceService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.REPORT_VIEW)
  findAllDataSources(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('aktiv') aktiv?: string,
    @Query('tipus') tipus?: string,
  ) {
    return this.dataSourceService.findAllDataSources(
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
  findDataSource(@Param('id') id: string) {
    return this.dataSourceService.findDataSource(id);
  }

  @Post()
  @Permissions(Permission.REPORT_CREATE)
  async createDataSource(@Body() dto: CreateDataSourceDto, @Request() req: any) {
    const source = await this.dataSourceService.createDataSource(dto);
    
    await this.auditService.logCreate(
      'DataSource',
      source.id,
      source,
      req.user?.id,
    );

    return source;
  }

  @Put(':id')
  @Permissions(Permission.REPORT_EDIT)
  async updateDataSource(
    @Param('id') id: string,
    @Body() dto: UpdateDataSourceDto,
    @Request() req: any,
  ) {
    const oldSource = await this.dataSourceService.findDataSource(id);
    const updated = await this.dataSourceService.updateDataSource(id, dto);
    
    await this.auditService.logUpdate(
      'DataSource',
      id,
      oldSource,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Delete(':id')
  @Permissions(Permission.REPORT_DELETE)
  async deleteDataSource(@Param('id') id: string, @Request() req: any) {
    const oldSource = await this.dataSourceService.findDataSource(id);
    await this.dataSourceService.deleteDataSource(id);
    
    await this.auditService.logDelete(
      'DataSource',
      id,
      oldSource,
      req.user?.id,
    );

    return { message: 'Adatforrás törölve' };
  }

  // Data Load Jobs
  @Get(':id/jobs')
  @Permissions(Permission.REPORT_VIEW)
  findAllDataLoadJobs(
    @Param('id') id: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('allapot') allapot?: string,
  ) {
    return this.dataSourceService.findAllDataLoadJobs(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        dataSourceId: id,
        allapot,
      },
    );
  }

  @Get('jobs/:jobId')
  @Permissions(Permission.REPORT_VIEW)
  findDataLoadJob(@Param('jobId') jobId: string) {
    return this.dataSourceService.findDataLoadJob(jobId);
  }

  @Post(':id/jobs')
  @Permissions(Permission.REPORT_CREATE)
  async createDataLoadJob(
    @Param('id') id: string,
    @Body() dto: Omit<CreateDataLoadJobDto, 'dataSourceId'>,
    @Request() req: any,
  ) {
    const job = await this.dataSourceService.createDataLoadJob({
      ...dto,
      dataSourceId: id,
    });
    
    await this.auditService.logCreate(
      'DataLoadJob',
      job.id,
      job,
      req.user?.id,
    );

    return job;
  }

  @Put('jobs/:jobId')
  @Permissions(Permission.REPORT_EDIT)
  async updateDataLoadJob(
    @Param('jobId') jobId: string,
    @Body() dto: UpdateDataLoadJobDto,
    @Request() req: any,
  ) {
    const oldJob = await this.dataSourceService.findDataLoadJob(jobId);
    const updated = await this.dataSourceService.updateDataLoadJob(jobId, dto);
    
    await this.auditService.logUpdate(
      'DataLoadJob',
      jobId,
      oldJob,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Delete('jobs/:jobId')
  @Permissions(Permission.REPORT_DELETE)
  async deleteDataLoadJob(@Param('jobId') jobId: string, @Request() req: any) {
    const oldJob = await this.dataSourceService.findDataLoadJob(jobId);
    await this.dataSourceService.deleteDataLoadJob(jobId);
    
    await this.auditService.logDelete(
      'DataLoadJob',
      jobId,
      oldJob,
      req.user?.id,
    );

    return { message: 'Adatbetöltési feladat törölve' };
  }
}

