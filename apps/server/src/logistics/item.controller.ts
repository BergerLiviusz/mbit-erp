import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { SupplierService } from './supplier.service';
import { AuditService } from '../common/audit/audit.service';
import { LinkItemSupplierDto } from './dto/link-item-supplier.dto';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('logistics/items')
@UseGuards(RbacGuard)
export class ItemController {
  constructor(
    private itemService: ItemService,
    private supplierService: SupplierService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.PRODUCT_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.itemService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      search,
      categoryId,
    );
  }

  @Get(':id')
  @Permissions(Permission.PRODUCT_VIEW)
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Post()
  @Permissions(Permission.PRODUCT_CREATE)
  async create(@Body() data: any) {
    const created = await this.itemService.create(data);
    await this.auditService.logCreate('Item', created.id, created);
    return created;
  }

  @Put(':id')
  @Permissions(Permission.PRODUCT_EDIT)
  async update(@Param('id') id: string, @Body() data: any) {
    const old = await this.itemService.findOne(id);
    const updated = await this.itemService.update(id, data);
    await this.auditService.logUpdate('Item', id, old, updated);
    return updated;
  }

  @Delete(':id')
  @Permissions(Permission.PRODUCT_DELETE)
  async delete(@Param('id') id: string) {
    const old = await this.itemService.findOne(id);
    await this.itemService.delete(id);
    await this.auditService.logDelete('Item', id, old);
    return { message: 'Cikk törölve / archiválva' };
  }

  @Get(':id/suppliers')
  @Permissions(Permission.PRODUCT_VIEW)
  getItemSuppliers(@Param('id') itemId: string) {
    return this.supplierService.getItemSuppliers(itemId);
  }

  @Post(':id/suppliers/:supplierId/link')
  @Permissions(Permission.PRODUCT_EDIT)
  linkSupplier(
    @Param('id') itemId: string,
    @Param('supplierId') supplierId: string,
    @Body() dto: LinkItemSupplierDto,
  ) {
    return this.supplierService.linkItemToSupplier(itemId, supplierId, dto);
  }

  @Delete(':id/suppliers/:supplierId/unlink')
  @Permissions(Permission.PRODUCT_EDIT)
  unlinkSupplier(
    @Param('id') itemId: string,
    @Param('supplierId') supplierId: string,
  ) {
    return this.supplierService.unlinkItemFromSupplier(itemId, supplierId);
  }

  @Put(':id/suppliers/:supplierId/primary')
  @Permissions(Permission.PRODUCT_EDIT)
  setPrimarySupplier(
    @Param('id') itemId: string,
    @Param('supplierId') supplierId: string,
  ) {
    return this.supplierService.setPrimarySupplier(itemId, supplierId);
  }
}

@Controller('logistics/item-groups')
@UseGuards(RbacGuard)
export class ItemGroupController {
  constructor(private itemService: ItemService) {}

  @Get()
  @Permissions(Permission.PRODUCT_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.itemService.findAllItemGroups(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 100,
    );
  }

  @Get(':id')
  @Permissions(Permission.PRODUCT_VIEW)
  findOne(@Param('id') id: string) {
    return this.itemService.findOneItemGroup(id);
  }

  @Post()
  @Permissions(Permission.PRODUCT_CREATE)
  create(@Body() data: { nev: string; leiras?: string }) {
    return this.itemService.createItemGroup(data);
  }

  @Put(':id')
  @Permissions(Permission.PRODUCT_EDIT)
  update(@Param('id') id: string, @Body() data: { nev?: string; leiras?: string }) {
    return this.itemService.updateItemGroup(id, data);
  }

  @Delete(':id')
  @Permissions(Permission.PRODUCT_DELETE)
  delete(@Param('id') id: string) {
    return this.itemService.deleteItemGroup(id);
  }
}
