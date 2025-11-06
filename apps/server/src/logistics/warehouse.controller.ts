import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WarehouseService, CreateWarehouseDto, UpdateWarehouseDto } from './warehouse.service';
import { AuditService } from '../common/audit/audit.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('logistics/warehouses')
@UseGuards(RbacGuard)
export class WarehouseController {
  constructor(
    private warehouseService: WarehouseService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.WAREHOUSE_VIEW)
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.warehouseService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
    );
  }

  @Get(':id')
  @Permissions(Permission.WAREHOUSE_VIEW)
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(id);
  }

  @Post()
  @Permissions(Permission.WAREHOUSE_CREATE)
  async create(@Body() dto: CreateWarehouseDto) {
    const warehouse = await this.warehouseService.create(dto);
    await this.auditService.logCreate('warehouse', warehouse.id, warehouse);
    return warehouse;
  }

  @Put(':id')
  @Permissions(Permission.WAREHOUSE_EDIT)
  async update(@Param('id') id: string, @Body() dto: UpdateWarehouseDto) {
    const old = await this.warehouseService.findOne(id);
    const updated = await this.warehouseService.update(id, dto);
    await this.auditService.logUpdate('warehouse', id, old, updated);
    return updated;
  }
}
