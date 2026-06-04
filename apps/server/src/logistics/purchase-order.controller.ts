import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
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
  @Permissions(Permission.PURCHASE_ORDER_CREATE)
  async create(@Body() dto: CreatePurchaseOrderDto, @Request() req: any) {
    const purchaseOrder = await this.purchaseOrderService.create(dto);
    await this.auditService.logCreate('purchase_order', purchaseOrder.id, purchaseOrder, req.user?.id);
    return purchaseOrder;
  }

  @Put(':id')
  @Permissions(Permission.PURCHASE_ORDER_EDIT)
  async update(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderDto, @Request() req: any) {
    const old = await this.purchaseOrderService.findOne(id);
    const updated = await this.purchaseOrderService.update(id, dto);
    await this.auditService.logUpdate('purchase_order', id, old, updated, req.user?.id);
    return updated;
  }

  @Patch(':id')
  @Permissions(Permission.PURCHASE_ORDER_EDIT)
  async patch(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderDto, @Request() req: any) {
    const old = await this.purchaseOrderService.findOne(id);
    const updated = await this.purchaseOrderService.update(id, dto);
    await this.auditService.logUpdate('purchase_order', id, old, updated, req.user?.id);
    return updated;
  }

  @Delete(':id')
  @Permissions(Permission.PURCHASE_ORDER_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const old = await this.purchaseOrderService.findOne(id);
    await this.purchaseOrderService.delete(id);
    await this.auditService.logDelete('purchase_order', id, old, req.user?.id);
    return { message: 'Beszerzési rendelés törölve' };
  }

  @Post(':id/archive')
  @Permissions(Permission.PURCHASE_ORDER_EDIT)
  async archive(@Param('id') id: string, @Request() req: any) {
    const old = await this.purchaseOrderService.findOne(id);
    const archived = await this.purchaseOrderService.archive(id);
    await this.auditService.logUpdate('purchase_order', id, old, archived, req.user?.id);
    return archived;
  }

  @Post(':id/receive')
  @Permissions(Permission.PURCHASE_ORDER_RECEIVE)
  async receive(
    @Param('id') id: string,
    @Body()
    body: {
      warehouseId: string;
      receivedItems: Array<{
        itemId: string;
        mennyiseg: number;
        sarzsGyartasiSzam?: string;
        beszerzesiAr?: number;
      }>;
    },
    @Request() req: any,
  ) {
    const old = await this.purchaseOrderService.findOne(id);
    const received = await this.purchaseOrderService.receive(id, body.warehouseId, body.receivedItems);
    await this.auditService.logUpdate('purchase_order', id, old, received, req.user?.id);
    return received;
  }
}
