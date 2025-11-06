import { Controller, Get, Param, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';

@Controller('logistics/inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  @Permissions(Permission.STOCK_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('itemId') itemId?: string,
    @Query('lowStockOnly') lowStockOnly?: string,
  ) {
    const filters = {
      warehouseId,
      itemId,
      lowStockOnly: lowStockOnly === 'true',
    };

    return this.inventoryService.findAllStockLevels(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      filters,
    );
  }

  @Get('warehouse/:warehouseId')
  @Permissions(Permission.STOCK_VIEW)
  getStockByWarehouse(@Param('warehouseId') warehouseId: string) {
    return this.inventoryService.getStockByWarehouse(warehouseId);
  }

  @Get('alerts')
  @Permissions(Permission.STOCK_VIEW)
  getLowStockAlerts() {
    return this.inventoryService.checkLowStock();
  }
}
