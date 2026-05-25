import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  StockMovementService,
  CreateStockMovementDto,
} from './stock-movement.service';
import { AuditService } from '../common/audit/audit.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('logistics/stock-movements')
@UseGuards(RbacGuard)
export class StockMovementController {
  constructor(
    private movementService: StockMovementService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.STOCK_VIEW, Permission.LOGISTICS_VIEW)
  findAll(
    @Query('itemId') itemId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('tipus') tipus?: string,
    @Query('sarzsGyartasiSzam') sarzsGyartasiSzam?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.movementService.findMovements({
      itemId,
      warehouseId,
      tipus,
      sarzsGyartasiSzam,
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 100,
    });
  }

  @Get('lots')
  @Permissions(Permission.STOCK_VIEW, Permission.LOGISTICS_VIEW)
  findLots(
    @Query('warehouseId') warehouseId?: string,
    @Query('itemId') itemId?: string,
    @Query('sarzsGyartasiSzam') sarzsGyartasiSzam?: string,
    @Query('expiringWithinDays') expiringWithinDays?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.movementService.findLots({
      warehouseId,
      itemId,
      sarzsGyartasiSzam,
      expiringWithinDays: expiringWithinDays
        ? parseInt(expiringWithinDays, 10)
        : undefined,
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 100,
    });
  }

  @Get('alerts')
  @Permissions(Permission.STOCK_VIEW, Permission.LOGISTICS_VIEW)
  alerts() {
    return this.movementService.getStockAlerts();
  }

  @Post()
  @Permissions(
    Permission.STOCK_MOVE,
    Permission.INVENTORY_MANAGE,
    Permission.LOGISTICS_EDIT,
  )
  async execute(@Body() dto: CreateStockMovementDto, @Req() req: Request) {
    const userId = (req as any).user?.id ?? (req as any).user?.userId;
    const move = await this.movementService.execute({ ...dto, userId });
    await this.auditService.logCreate('StockMove', move.id, move, userId);
    return move;
  }
}
