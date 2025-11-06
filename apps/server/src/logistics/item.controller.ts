import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('logistics/items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
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
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.itemService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.itemService.update(id, data);
  }
}
