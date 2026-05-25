import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

/** @deprecated Használja a /logistics/stock-movements végpontokat */
@Controller('logistics/stock')
@UseGuards(RbacGuard)
export class StockController {
  constructor(private stockService: StockService) {}

  @Get()
  @Permissions(Permission.STOCK_VIEW, Permission.LOGISTICS_VIEW)
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.stockService.findAll(
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 100,
    );
  }

  @Get('low-stock')
  @Permissions(Permission.STOCK_VIEW, Permission.LOGISTICS_VIEW)
  getLowStock() {
    return this.stockService.getLowStock();
  }

  @Get('movements')
  @Permissions(Permission.STOCK_VIEW, Permission.LOGISTICS_VIEW)
  getStockMovements(
    @Query('itemId') itemId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.stockService.getStockMovements({
      itemId,
      warehouseId,
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }
}
