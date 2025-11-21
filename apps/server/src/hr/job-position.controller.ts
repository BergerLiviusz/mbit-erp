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
  JobPositionService,
  CreateJobPositionDto,
  UpdateJobPositionDto,
} from './job-position.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('hr/job-positions')
@UseGuards(RbacGuard)
export class JobPositionController {
  constructor(
    private jobPositionService: JobPositionService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.HR_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('osztaly') osztaly?: string,
    @Query('reszleg') reszleg?: string,
    @Query('aktiv') aktiv?: string,
  ) {
    return this.jobPositionService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        osztaly,
        reszleg,
        aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
      },
    );
  }

  @Get(':id')
  @Permissions(Permission.HR_VIEW)
  findOne(@Param('id') id: string) {
    return this.jobPositionService.findOne(id);
  }

  @Post()
  @Permissions(Permission.HR_CREATE)
  async create(@Body() dto: CreateJobPositionDto, @Request() req: any) {
    const position = await this.jobPositionService.create(dto);
    
    await this.auditService.logCreate(
      'JobPosition',
      position.id,
      position,
      req.user?.id,
    );

    return position;
  }

  @Put(':id')
  @Permissions(Permission.HR_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateJobPositionDto,
    @Request() req: any,
  ) {
    const oldPosition = await this.jobPositionService.findOne(id);
    const updated = await this.jobPositionService.update(id, dto);
    
    await this.auditService.logUpdate(
      'JobPosition',
      id,
      oldPosition,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Delete(':id')
  @Permissions(Permission.HR_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const oldPosition = await this.jobPositionService.findOne(id);
    await this.jobPositionService.delete(id);
    
    await this.auditService.logDelete(
      'JobPosition',
      id,
      oldPosition,
      req.user?.id,
    );

    return { message: 'Munkakör törölve' };
  }
}

