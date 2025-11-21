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
  QueryService,
  CreateQueryTemplateDto,
  UpdateQueryTemplateDto,
  CreateAdHocQueryDto,
  ExecuteQueryDto,
} from './query.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('controlling/queries')
@UseGuards(RbacGuard)
export class QueryController {
  constructor(
    private queryService: QueryService,
    private auditService: AuditService,
  ) {}

  @Get('templates')
  @Permissions(Permission.REPORT_VIEW)
  findAllTemplates(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('kategoria') kategoria?: string,
    @Query('aktiv') aktiv?: string,
  ) {
    return this.queryService.findAllTemplates(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        kategoria,
        aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
      },
    );
  }

  @Get('templates/:id')
  @Permissions(Permission.REPORT_VIEW)
  findTemplate(@Param('id') id: string) {
    return this.queryService.findTemplate(id);
  }

  @Post('templates')
  @Permissions(Permission.REPORT_CREATE)
  async createTemplate(@Body() dto: CreateQueryTemplateDto, @Request() req: any) {
    const template = await this.queryService.createTemplate(dto);
    
    await this.auditService.logCreate(
      'QueryTemplate',
      template.id,
      template,
      req.user?.id,
    );

    return template;
  }

  @Put('templates/:id')
  @Permissions(Permission.REPORT_EDIT)
  async updateTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateQueryTemplateDto,
    @Request() req: any,
  ) {
    const oldTemplate = await this.queryService.findTemplate(id);
    const updated = await this.queryService.updateTemplate(id, dto);
    
    await this.auditService.logUpdate(
      'QueryTemplate',
      id,
      oldTemplate,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Delete('templates/:id')
  @Permissions(Permission.REPORT_DELETE)
  async deleteTemplate(@Param('id') id: string, @Request() req: any) {
    const oldTemplate = await this.queryService.findTemplate(id);
    await this.queryService.deleteTemplate(id);
    
    await this.auditService.logDelete(
      'QueryTemplate',
      id,
      oldTemplate,
      req.user?.id,
    );

    return { message: 'Lekérdezés sablon törölve' };
  }

  @Get('ad-hoc')
  @Permissions(Permission.REPORT_VIEW)
  findAllAdHocQueries(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.queryService.findAllAdHocQueries(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
    );
  }

  @Get('ad-hoc/:id')
  @Permissions(Permission.REPORT_VIEW)
  findAdHocQuery(@Param('id') id: string) {
    return this.queryService.findAdHocQuery(id);
  }

  @Post('ad-hoc')
  @Permissions(Permission.REPORT_CREATE)
  async createAdHocQuery(@Body() dto: CreateAdHocQueryDto, @Request() req: any) {
    const query = await this.queryService.createAdHocQuery(dto, req.user?.id);
    
    await this.auditService.logCreate(
      'AdHocQuery',
      query.id,
      query,
      req.user?.id,
    );

    return query;
  }

  @Post('execute')
  @Permissions(Permission.REPORT_VIEW)
  async executeQuery(@Body() dto: ExecuteQueryDto) {
    return this.queryService.executeQuery(dto);
  }

  @Delete('ad-hoc/:id')
  @Permissions(Permission.REPORT_DELETE)
  async deleteAdHocQuery(@Param('id') id: string, @Request() req: any) {
    const oldQuery = await this.queryService.findAdHocQuery(id);
    await this.queryService.deleteAdHocQuery(id);
    
    await this.auditService.logDelete(
      'AdHocQuery',
      id,
      oldQuery,
      req.user?.id,
    );

    return { message: 'Ad-hoc lekérdezés törölve' };
  }
}

