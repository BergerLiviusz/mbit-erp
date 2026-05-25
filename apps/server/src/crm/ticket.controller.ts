import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/tickets')
@UseGuards(RbacGuard)
export class TicketController {
  constructor(
    private ticketService: TicketService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.TICKET_VIEW)
  async findAll(@Query('skip') skipParam?: string, @Query('take') takeParam?: string) {
    const skip = skipParam ? parseInt(skipParam, 10) : 0;
    const take = takeParam ? parseInt(takeParam, 10) : 50;
    
    if (isNaN(skip) || skip < 0) {
      throw new BadRequestException('Invalid skip parameter');
    }
    if (isNaN(take) || take < 1) {
      throw new BadRequestException('Invalid take parameter');
    }
    
    return await this.ticketService.findAll(skip, take);
  }

  @Get('export/report')
  @Permissions(Permission.TICKET_VIEW)
  async exportReport() {
    return this.ticketService.exportReport();
  }

  @Get(':id')
  @Permissions(Permission.TICKET_VIEW)
  async findOne(@Param('id') id: string) {
    return await this.ticketService.findOne(id);
  }

  @Post(':id/assign')
  @Permissions(Permission.TICKET_ASSIGN)
  async assign(@Param('id') id: string, @Body('assignedToId') assignedToId: string) {
    const old = await this.ticketService.findOne(id);
    const ticket = await this.ticketService.assign(id, assignedToId);
    await this.auditService.logUpdate('Ticket', id, old, { assignedToId });
    return ticket;
  }

  @Post(':id/escalate')
  @Permissions(Permission.TICKET_EDIT)
  async escalate(@Param('id') id: string) {
    const old = await this.ticketService.findOne(id);
    const ticket = await this.ticketService.escalate(id);
    await this.auditService.logUpdate('Ticket', id, old, { eszkalalva: true, allapot: 'eszkalalt' });
    return ticket;
  }

  @Post(':id/status')
  @Permissions(Permission.TICKET_EDIT)
  async changeStatus(@Param('id') id: string, @Body('allapot') allapot: string) {
    const old = await this.ticketService.findOne(id);
    const ticket = await this.ticketService.changeStatus(id, allapot);
    await this.auditService.logUpdate('Ticket', id, old, { allapot });
    return ticket;
  }

  @Post()
  @Permissions(Permission.TICKET_CREATE)
  async create(@Body() data: any) {
    const ticket = await this.ticketService.create(data);
    await this.auditService.logCreate('Ticket', ticket.id, data);
    return ticket;
  }

  @Put(':id')
  @Permissions(Permission.TICKET_EDIT)
  async update(@Param('id') id: string, @Body() data: any) {
    const old = await this.ticketService.findOne(id);
    const ticket = await this.ticketService.update(id, data);
    await this.auditService.logUpdate('Ticket', id, old, data);
    return ticket;
  }

  @Delete(':id')
  @Permissions(Permission.TICKET_DELETE)
  async delete(@Param('id') id: string) {
    const old = await this.ticketService.findOne(id);
    await this.ticketService.delete(id);
    await this.auditService.logDelete('Ticket', id, old);
    return { message: 'Reklamáció törölve' };
  }
}
