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
  DatabaseConnectionService,
  CreateDatabaseConnectionDto,
  UpdateDatabaseConnectionDto,
} from './database-connection.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('controlling/database-connections')
@UseGuards(RbacGuard)
export class DatabaseConnectionController {
  constructor(
    private databaseConnectionService: DatabaseConnectionService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.REPORT_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('aktiv') aktiv?: string,
  ) {
    return this.databaseConnectionService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
      },
    );
  }

  @Get(':id')
  @Permissions(Permission.REPORT_VIEW)
  findOne(@Param('id') id: string) {
    return this.databaseConnectionService.findOne(id);
  }

  @Post(':id/test')
  @Permissions(Permission.REPORT_VIEW)
  testConnection(@Param('id') id: string) {
    return this.databaseConnectionService.testConnection(id);
  }

  @Post()
  @Permissions(Permission.REPORT_CREATE)
  async create(@Body() dto: CreateDatabaseConnectionDto, @Request() req: any) {
    const connection = await this.databaseConnectionService.create(dto);
    
    await this.auditService.logCreate(
      'DatabaseConnection',
      connection.id,
      { ...connection, password: '***' },
      req.user?.id,
    );

    return connection;
  }

  @Put(':id')
  @Permissions(Permission.REPORT_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDatabaseConnectionDto,
    @Request() req: any,
  ) {
    const oldConnection = await this.databaseConnectionService.findOne(id);
    const updated = await this.databaseConnectionService.update(id, dto);
    
    await this.auditService.logUpdate(
      'DatabaseConnection',
      id,
      oldConnection,
      { ...updated, password: '***' },
      req.user?.id,
    );

    return updated;
  }

  @Delete(':id')
  @Permissions(Permission.REPORT_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const oldConnection = await this.databaseConnectionService.findOne(id);
    await this.databaseConnectionService.delete(id);
    
    await this.auditService.logDelete(
      'DatabaseConnection',
      id,
      oldConnection,
      req.user?.id,
    );

    return { message: 'Adatbázis kapcsolat törölve' };
  }
}

