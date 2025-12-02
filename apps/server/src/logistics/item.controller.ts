import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { SupplierService } from './supplier.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('logistics/items')
@UseGuards(RbacGuard)
export class ItemController {
  constructor(
    private itemService: ItemService,
    private supplierService: SupplierService,
  ) {}

  @Get()
  @Permissions(Permission.PRODUCT_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string
  ) {
    return this.itemService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      search
    );
  }

  @Get(':id')
  @Permissions(Permission.PRODUCT_VIEW)
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Post()
  @Permissions(Permission.PRODUCT_CREATE)
  create(@Body() data: any) {
    return this.itemService.create(data);
  }

  @Put(':id')
  @Permissions(Permission.PRODUCT_EDIT)
  update(@Param('id') id: string, @Body() data: any) {
    return this.itemService.update(id, data);
  }

  @Delete(':id')
  @Permissions(Permission.PRODUCT_DELETE)
  delete(@Param('id') id: string) {
    return this.itemService.delete(id);
  }

  @Get(':id/suppliers')
  @Permissions(Permission.PRODUCT_VIEW)
  getItemSuppliers(@Param('id') itemId: string) {
    return this.supplierService.getItemSuppliers(itemId);
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
}
