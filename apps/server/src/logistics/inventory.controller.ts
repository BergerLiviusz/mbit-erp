import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Res } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';
import { Response } from 'express';

@Controller('logistics/inventory')
@UseGuards(RbacGuard)
export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
    private auditService: AuditService,
  ) {}

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

  @Post('stock-levels')
  @Permissions(Permission.STOCK_EDIT)
  async createStockLevel(@Body() data: any) {
    const stockLevel = await this.inventoryService.createStockLevel(data);
    await this.auditService.logCreate('StockLevel', stockLevel.id, data);
    return stockLevel;
  }

  @Put('stock-levels/:id')
  @Permissions(Permission.STOCK_EDIT)
  async updateStockLevel(@Param('id') id: string, @Body() data: any) {
    // Get old data for audit
    const stockLevel = await this.inventoryService.findAllStockLevels(0, 1000);
    const oldStockLevel = stockLevel.data.find((sl: any) => sl.id === id);
    const updated = await this.inventoryService.updateStockLevel(id, data);
    if (oldStockLevel) {
      await this.auditService.logUpdate('StockLevel', id, oldStockLevel, data);
    }
    return updated;
  }

  @Delete('stock-levels/:id')
  @Permissions(Permission.STOCK_EDIT)
  async deleteStockLevel(@Param('id') id: string) {
    // Get old data for audit
    const stockLevel = await this.inventoryService.findAllStockLevels(0, 1000);
    const oldStockLevel = stockLevel.data.find((sl: any) => sl.id === id);
    await this.inventoryService.deleteStockLevel(id);
    if (oldStockLevel) {
      await this.auditService.logDelete('StockLevel', id, oldStockLevel);
    }
    return { message: 'Készletszint törölve' };
  }

  @Get('warehouse/:warehouseId/inventory-sheet/pdf')
  @Permissions(Permission.STOCK_VIEW)
  async generateInventorySheetPdf(
    @Param('warehouseId') warehouseId: string,
    @Res() res: Response,
  ) {
    await this.inventoryService.generateInventorySheetPdf(warehouseId, res);
  }

  @Get('warehouse/:warehouseId/inventory-sheet/excel')
  @Permissions(Permission.STOCK_VIEW)
  async generateInventorySheetExcel(
    @Param('warehouseId') warehouseId: string,
    @Res() res: Response,
  ) {
    await this.inventoryService.generateInventorySheetExcel(warehouseId, res);
  }
}
