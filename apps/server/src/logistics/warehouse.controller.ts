import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Controller('logistics/warehouses')
export class WarehouseController {
  constructor(private warehouseService: WarehouseService) {}

  @Get()
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.warehouseService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.warehouseService.update(id, data);
  }
}
