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
import {
  StockReservationService,
  CreateStockReservationDto,
  UpdateStockReservationDto,
  CreateExpectedReceiptDto,
} from './stock-reservation.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('logistics/stock-reservations')
@UseGuards(RbacGuard)
export class StockReservationController {
  constructor(
    private stockReservationService: StockReservationService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.LOGISTICS_VIEW)
  findAllReservations(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('itemId') itemId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('orderId') orderId?: string,
    @Query('allapot') allapot?: string,
  ) {
    return this.stockReservationService.findAllReservations(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        itemId,
        warehouseId,
        orderId,
        allapot,
      },
    );
  }

  @Get('available/:itemId/:warehouseId')
  @Permissions(Permission.LOGISTICS_VIEW)
  getAvailableStock(
    @Param('itemId') itemId: string,
    @Param('warehouseId') warehouseId: string,
    @Query('locationId') locationId?: string,
  ) {
    return this.stockReservationService.getAvailableStock(
      itemId,
      warehouseId,
      locationId,
    );
  }

  @Get(':id')
  @Permissions(Permission.LOGISTICS_VIEW)
  findOneReservation(@Param('id') id: string) {
    return this.stockReservationService.findOneReservation(id);
  }

  @Post()
  @Permissions(Permission.LOGISTICS_CREATE)
  async createReservation(@Body() dto: CreateStockReservationDto, @Request() req: any) {
    const reservation = await this.stockReservationService.createReservation(dto);
    
    await this.auditService.logCreate(
      'StockReservation',
      reservation.id,
      reservation,
      req.user?.id,
    );

    return reservation;
  }

  @Put(':id')
  @Permissions(Permission.LOGISTICS_EDIT)
  async updateReservation(
    @Param('id') id: string,
    @Body() dto: UpdateStockReservationDto,
    @Request() req: any,
  ) {
    const oldReservation = await this.stockReservationService.findOneReservation(id);
    const updated = await this.stockReservationService.updateReservation(id, dto);
    
    await this.auditService.logUpdate(
      'StockReservation',
      id,
      oldReservation,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Delete(':id')
  @Permissions(Permission.LOGISTICS_DELETE)
  async deleteReservation(@Param('id') id: string, @Request() req: any) {
    const oldReservation = await this.stockReservationService.findOneReservation(id);
    await this.stockReservationService.deleteReservation(id);
    
    await this.auditService.logDelete(
      'StockReservation',
      id,
      oldReservation,
      req.user?.id,
    );

    return { message: 'Készletfoglalás törölve' };
  }

  // Expected Receipts
  @Get('expected-receipts')
  @Permissions(Permission.LOGISTICS_VIEW)
  findAllExpectedReceipts(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('purchaseOrderId') purchaseOrderId?: string,
    @Query('allapot') allapot?: string,
    @Query('vartBeerkezesFrom') vartBeerkezesFrom?: string,
    @Query('vartBeerkezesTo') vartBeerkezesTo?: string,
  ) {
    return this.stockReservationService.findAllExpectedReceipts(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        warehouseId,
        purchaseOrderId,
        allapot,
        vartBeerkezesFrom,
        vartBeerkezesTo,
      },
    );
  }

  @Get('expected-receipts/:id')
  @Permissions(Permission.LOGISTICS_VIEW)
  findOneExpectedReceipt(@Param('id') id: string) {
    return this.stockReservationService.findOneExpectedReceipt(id);
  }

  @Post('expected-receipts')
  @Permissions(Permission.LOGISTICS_CREATE)
  async createExpectedReceipt(@Body() dto: CreateExpectedReceiptDto, @Request() req: any) {
    const receipt = await this.stockReservationService.createExpectedReceipt(dto);
    
    await this.auditService.logCreate(
      'ExpectedReceipt',
      receipt.id,
      receipt,
      req.user?.id,
    );

    return receipt;
  }

  @Post('expected-receipts/:id/mark-received')
  @Permissions(Permission.LOGISTICS_EDIT)
  async markExpectedReceiptAsReceived(@Param('id') id: string, @Request() req: any) {
    const receipt = await this.stockReservationService.markExpectedReceiptAsReceived(id);
    
    await this.auditService.logUpdate(
      'ExpectedReceipt',
      id,
      { allapot: 'VAR' },
      { allapot: 'ERKEZETT' },
      req.user?.id,
    );

    return receipt;
  }

  @Delete('expected-receipts/:id')
  @Permissions(Permission.LOGISTICS_DELETE)
  async deleteExpectedReceipt(@Param('id') id: string, @Request() req: any) {
    const oldReceipt = await this.stockReservationService.findOneExpectedReceipt(id);
    await this.stockReservationService.deleteExpectedReceipt(id);
    
    await this.auditService.logDelete(
      'ExpectedReceipt',
      id,
      oldReceipt,
      req.user?.id,
    );

    return { message: 'Várható beérkezés törölve' };
  }
}

