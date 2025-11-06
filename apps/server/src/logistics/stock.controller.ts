import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('logistics/stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.stockService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 100
    );
  }

  @Get('low-stock')
  getLowStock() {
    return this.stockService.getLowStock();
  }

  @Post('move')
  createStockMove(@Body() data: any) {
    return this.stockService.createStockMove(data);
  }
}
