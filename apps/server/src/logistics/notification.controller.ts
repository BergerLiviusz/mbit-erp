import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('logistics/notifications')
@UseGuards(RbacGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('products')
  @Permissions(Permission.PRODUCT_VIEW)
  getExpiringProducts(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days) : 30;
    return this.notificationService.getExpiringProducts(daysNumber);
  }

  @Get('stock')
  @Permissions(Permission.STOCK_VIEW)
  getLowStockItems() {
    return this.notificationService.getLowStockItems();
  }
}

