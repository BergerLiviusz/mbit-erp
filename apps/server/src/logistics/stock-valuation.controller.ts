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
import { StockValuationService } from './stock-valuation.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('logistics/stock-valuation')
@UseGuards(RbacGuard)
export class StockValuationController {
  constructor(
    private stockValuationService: StockValuationService,
    private auditService: AuditService,
  ) {}

  @Get('calculate/:itemId/:warehouseId')
  @Permissions(Permission.LOGISTICS_VIEW)
  calculateStockValue(
    @Param('itemId') itemId: string,
    @Param('warehouseId') warehouseId: string,
    @Query('ertekelesMod') ertekelesMod?: string,
  ) {
    return this.stockValuationService.calculateStockValue(
      itemId,
      warehouseId,
      ertekelesMod,
    );
  }

  @Post('calculate-sale')
  @Permissions(Permission.LOGISTICS_VIEW)
  calculateStockValueForSale(
    @Body() body: {
      itemId: string;
      warehouseId: string;
      mennyiseg: number;
      ertekelesMod?: string;
    },
  ) {
    return this.stockValuationService.calculateStockValueForSale(
      body.itemId,
      body.warehouseId,
      body.mennyiseg,
      body.ertekelesMod,
    );
  }

  @Get('report')
  @Permissions(Permission.LOGISTICS_VIEW)
  getStockValuationReport(
    @Query('warehouseId') warehouseId?: string,
    @Query('ertekelesMod') ertekelesMod?: string,
  ) {
    return this.stockValuationService.getStockValuationReport(
      warehouseId,
      ertekelesMod,
    );
  }

  @Put('warehouse/:warehouseId/method')
  @Permissions(Permission.LOGISTICS_EDIT)
  async updateWarehouseValuationMethod(
    @Param('warehouseId') warehouseId: string,
    @Body() body: { ertekelesMod: string },
    @Request() req: any,
  ) {
    const oldWarehouse = await this.stockValuationService.getWarehouse(warehouseId);
    
    const updated = await this.stockValuationService.updateWarehouseValuationMethod(
      warehouseId,
      body.ertekelesMod,
    );
    
    await this.auditService.logUpdate(
      'Warehouse',
      warehouseId,
      oldWarehouse || {},
      updated,
      req.user?.id,
    );

    return updated;
  }
}

