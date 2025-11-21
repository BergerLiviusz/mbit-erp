import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BugReportService, CreateBugReportDto, UpdateBugReportDto, CreateBugReportCommentDto } from './bug-report.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('system/bug-reports')
@UseGuards(RbacGuard)
export class BugReportController {
  constructor(
    private bugReportService: BugReportService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.SYSTEM_DIAGNOSTICS)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('allapot') allapot?: string,
    @Query('prioritas') prioritas?: string,
    @Query('kategoria') kategoria?: string,
    @Query('userId') userId?: string,
  ) {
    return this.bugReportService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        allapot,
        prioritas,
        kategoria,
        userId,
      },
    );
  }

  @Get('stats')
  @Permissions(Permission.SYSTEM_DIAGNOSTICS)
  getStats() {
    return this.bugReportService.getStats();
  }

  @Get(':id')
  @Permissions(Permission.SYSTEM_DIAGNOSTICS)
  findOne(@Param('id') id: string) {
    return this.bugReportService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateBugReportDto, @Request() req: any) {
    const bugReport = await this.bugReportService.create(dto, req.user?.id);
    
    await this.auditService.logCreate(
      'BugReport',
      bugReport.id,
      bugReport,
      req.user?.id,
    );

    return bugReport;
  }

  @Put(':id')
  @Permissions(Permission.SYSTEM_DIAGNOSTICS)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBugReportDto,
    @Request() req: any,
  ) {
    const oldBugReport = await this.bugReportService.findOne(id);
    const updated = await this.bugReportService.update(id, dto);
    
    await this.auditService.logUpdate(
      'BugReport',
      id,
      oldBugReport,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') bugReportId: string,
    @Body() dto: CreateBugReportCommentDto,
    @Request() req: any,
  ) {
    const comment = await this.bugReportService.addComment(
      bugReportId,
      dto,
      req.user?.id,
    );

    await this.auditService.logCreate(
      'BugReportComment',
      comment.id,
      comment,
      req.user?.id,
    );

    return comment;
  }
}

