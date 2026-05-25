import { Controller, Get, Post, Param, Query, UseGuards, Body } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/shipments')
@UseGuards(RbacGuard)
export class ShipmentController {
  constructor(
    private shipmentService: ShipmentService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.SHIPMENT_VIEW)
  async findAll(@Query('orderId') orderId?: string) {
    return this.shipmentService.findAll(orderId);
  }

  @Get(':id')
  @Permissions(Permission.SHIPMENT_VIEW)
  async findOne(@Param('id') id: string) {
    return this.shipmentService.findOne(id);
  }

  @Post('from-order/:orderId')
  @Permissions(Permission.SHIPMENT_CREATE)
  async createFromOrder(
    @Param('orderId') orderId: string,
    @Body() body?: { szallitasiCim?: string; szallitasiMod?: string },
  ) {
    const shipment = await this.shipmentService.createFromOrder(orderId, body);
    await this.auditService.log({
      esemeny: 'generate',
      entitas: 'Shipment',
      entitasId: shipment.id,
      uj: { orderId, from: 'order' },
    });
    return shipment;
  }
}
