import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { InvoiceStubService } from './invoice-stub.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/invoice-stubs')
@UseGuards(RbacGuard)
export class InvoiceStubController {
  constructor(
    private invoiceStubService: InvoiceStubService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.CRM_VIEW)
  async findAll(@Query('accountId') accountId?: string) {
    return this.invoiceStubService.findAll(accountId);
  }

  @Get(':id')
  @Permissions(Permission.CRM_VIEW)
  async findOne(@Param('id') id: string) {
    return this.invoiceStubService.findOne(id);
  }

  @Post('from-order/:orderId')
  @Permissions(Permission.ORDER_CREATE)
  async fromOrder(@Param('orderId') orderId: string) {
    const stub = await this.invoiceStubService.createFromOrder(orderId);
    await this.auditService.log({
      esemeny: 'generate',
      entitas: 'InvoiceStub',
      entitasId: stub.id,
      uj: { orderId },
    });
    return stub;
  }

  @Post('from-shipment/:shipmentId')
  @Permissions(Permission.ORDER_CREATE)
  async fromShipment(@Param('shipmentId') shipmentId: string) {
    const stub = await this.invoiceStubService.createFromShipment(shipmentId);
    await this.auditService.log({
      esemeny: 'generate',
      entitas: 'InvoiceStub',
      entitasId: stub.id,
      uj: { shipmentId },
    });
    return stub;
  }
}
