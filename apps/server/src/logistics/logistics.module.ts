import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  controllers: [ItemController, WarehouseController, StockController],
  providers: [ItemService, WarehouseService, StockService],
})
export class LogisticsModule {}
