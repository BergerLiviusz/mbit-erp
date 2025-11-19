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
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { LinkItemSupplierDto } from './dto/link-item-supplier.dto';
import { AuditService } from '../common/audit/audit.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('logistics/suppliers')
@UseGuards(RbacGuard)
export class SupplierController {
  constructor(
    private supplierService: SupplierService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.SUPPLIER_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    return this.supplierService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      search,
    );
  }

  @Get(':id')
  @Permissions(Permission.SUPPLIER_VIEW)
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Post()
  @Permissions(Permission.SUPPLIER_CREATE)
  async create(@Body() dto: CreateSupplierDto) {
    const supplier = await this.supplierService.create(dto);
    await this.auditService.logCreate('Supplier', supplier.id, supplier);
    return supplier;
  }

  @Put(':id')
  @Permissions(Permission.SUPPLIER_EDIT)
  async update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    const old = await this.supplierService.findOne(id);
    const updated = await this.supplierService.update(id, dto);
    await this.auditService.logUpdate('Supplier', id, old, updated);
    return updated;
  }

  @Delete(':id')
  @Permissions(Permission.SUPPLIER_DELETE)
  async delete(@Param('id') id: string) {
    const old = await this.supplierService.findOne(id);
    const deleted = await this.supplierService.delete(id);
    await this.auditService.logDelete('Supplier', id, old);
    return deleted;
  }

  @Post(':id/items/:itemId/link')
  @Permissions(Permission.SUPPLIER_EDIT)
  async linkItem(
    @Param('id') supplierId: string,
    @Param('itemId') itemId: string,
    @Body() dto: LinkItemSupplierDto,
  ) {
    return this.supplierService.linkItemToSupplier(itemId, supplierId, dto);
  }

  @Delete(':id/items/:itemId/unlink')
  @Permissions(Permission.SUPPLIER_EDIT)
  async unlinkItem(
    @Param('id') supplierId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.supplierService.unlinkItemFromSupplier(itemId, supplierId);
  }

  @Get(':id/items')
  @Permissions(Permission.SUPPLIER_VIEW)
  getSupplierItems(@Param('id') supplierId: string) {
    return this.supplierService.getSupplierItems(supplierId);
  }
}

