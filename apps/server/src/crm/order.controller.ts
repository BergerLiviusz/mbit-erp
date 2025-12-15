import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatusDto } from './dto/order-status.dto';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';
import { OrderStatus } from './enums/order-status.enum';

@Controller('crm/orders')
@UseGuards(RbacGuard)
export class OrderController {
  constructor(
    private orderService: OrderService,
    private auditService: AuditService,
  ) {}

  @Post()
  @Permissions(Permission.ORDER_CREATE)
  async create(@Request() req: any, @Body() dto: CreateOrderDto) {
    const newOrder = await this.orderService.create(dto);
    await this.auditService.logCreate('order', newOrder.id, newOrder);
    return newOrder;
  }

  @Get()
  @Permissions(Permission.ORDER_VIEW)
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('allapot') allapot?: string,
    @Query('accountId') accountId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters = { allapot, accountId, startDate, endDate };
    return this.orderService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      filters,
    );
  }

  @Get(':id')
  @Permissions(Permission.ORDER_VIEW)
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  @Permissions(Permission.ORDER_EDIT)
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    const oldOrder = await this.orderService.findOne(id);
    const updatedOrder = await this.orderService.update(id, dto);
    await this.auditService.logUpdate('order', id, oldOrder, updatedOrder);
    return updatedOrder;
  }

  @Post(':id/status')
  @Permissions(Permission.ORDER_FULFILL)
  async changeStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: OrderStatusDto,
  ) {
    const oldOrder = await this.orderService.findOne(id);
    const updatedOrder = await this.orderService.changeStatus(
      id,
      dto.allapot,
      dto.megjegyzesek,
      dto.warehouseId,
    );
    await this.auditService.logUpdate(
      'order',
      id,
      oldOrder,
      updatedOrder,
      `Status changed to ${dto.allapot}`,
    );
    return updatedOrder;
  }

  @Post(':id/cancel')
  @Permissions(Permission.ORDER_CANCEL)
  async cancel(@Request() req: any, @Param('id') id: string, @Body() dto: OrderStatusDto) {
    const oldOrder = await this.orderService.findOne(id);
    const cancelledOrder = await this.orderService.changeStatus(
      id,
      OrderStatus.CANCELLED,
      dto.megjegyzesek || 'Rendelés visszavonva',
    );
    await this.auditService.logUpdate(
      'order',
      id,
      oldOrder,
      cancelledOrder,
      'Order cancelled',
    );
    return cancelledOrder;
  }

  @Delete(':id')
  @Permissions(Permission.ORDER_DELETE)
  async delete(@Param('id') id: string) {
    const deletedOrder = await this.orderService.delete(id);
    await this.auditService.logDelete('order', id, deletedOrder);
    return deletedOrder;
  }
}

