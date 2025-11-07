import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('logistics/items')
@UseGuards(RbacGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

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
}
