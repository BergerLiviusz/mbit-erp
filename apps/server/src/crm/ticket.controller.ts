import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('crm/tickets')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.ticketService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.ticketService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.ticketService.update(id, data);
  }
}
