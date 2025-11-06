import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('crm/accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.accountService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.accountService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.accountService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.accountService.delete(id);
  }
}
