import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  PurchaseOrderService,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from './purchase-order.service';
import { AuditService } from '../common/audit/audit.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('logistics/purchase-orders')
@UseGuards(RbacGuard)
export class PurchaseOrderController {
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.PURCHASE_ORDER_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('allapot') allapot?: string,
    @Query('supplierId') supplierId?: string,
  ) {
    const filters = { allapot, supplierId };

    return this.purchaseOrderService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      filters,
    );
  }

  @Get(':id')
  @Permissions(Permission.PURCHASE_ORDER_VIEW)
  findOne(@Param('id') id: string) {
    return this.purchaseOrderService.findOne(id);
  }

  @Post()
  @Permissions(Permission.PURCHASE_ORDER_CREATE, Permission.PURCHASE_MANAGE)
  async create(@Body() dto: CreatePurchaseOrderDto) {
    const payload = {
      ...dto,
      allapot: dto.allapot || 'draft',
    };
    const purchaseOrder = await this.purchaseOrderService.create(payload);
    await this.auditService.logCreate(
      'purchase_order',
      purchaseOrder.id,
      purchaseOrder,
    );
    return purchaseOrder;
  }

  @Put(':id')
  @Permissions(Permission.PURCHASE_ORDER_EDIT)
  async update(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderDto) {
    const old = await this.purchaseOrderService.findOne(id);
    const updated = await this.purchaseOrderService.update(id, dto);
    await this.auditService.logUpdate('purchase_order', id, old, updated);
    return updated;
  }

  @Post(':id/approve')
  @Permissions(Permission.PURCHASE_ORDER_APPROVE, Permission.PURCHASE_MANAGE)
  async approve(@Param('id') id: string) {
    const old = await this.purchaseOrderService.findOne(id);
    const updated = await this.purchaseOrderService.transitionStatus(id, 'approved');
    await this.auditService.logUpdate('purchase_order', id, old, updated);
    return updated;
  }

  @Post(':id/order')
  @Permissions(Permission.PURCHASE_ORDER_EDIT, Permission.PURCHASE_MANAGE)
  async markOrdered(@Param('id') id: string) {
    const old = await this.purchaseOrderService.findOne(id);
    const updated = await this.purchaseOrderService.transitionStatus(id, 'ordered');
    await this.auditService.logUpdate('purchase_order', id, old, updated);
    return updated;
  }

  @Post(':id/close')
  @Permissions(Permission.PURCHASE_ORDER_EDIT, Permission.PURCHASE_MANAGE)
  async close(@Param('id') id: string) {
    const old = await this.purchaseOrderService.findOne(id);
    const updated = await this.purchaseOrderService.transitionStatus(id, 'closed');
    await this.auditService.logUpdate('purchase_order', id, old, updated);
    return updated;
  }

  @Post(':id/receive')
  @Permissions(Permission.PURCHASE_ORDER_RECEIVE, Permission.PURCHASE_MANAGE)
  async receive(
    @Param('id') id: string,
    @Body() body: { warehouseId: string; receivedItems: Array<{ itemId: string; mennyiseg: number; sarzsGyartasiSzam?: string; beszerzesiAr?: number }> },
  ) {
    const old = await this.purchaseOrderService.findOne(id);
    const received = await this.purchaseOrderService.receive(id, body.warehouseId, body.receivedItems);
    await this.auditService.logUpdate('purchase_order', id, old, received);
    return received;
  }
}
