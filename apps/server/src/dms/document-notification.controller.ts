import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { DocumentNotificationService } from './document-notification.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('dms/document-notifications')
@UseGuards(RbacGuard)
export class DocumentNotificationController {
  constructor(private notificationService: DocumentNotificationService) {}

  @Get('expiring')
  @Permissions(Permission.DOCUMENT_VIEW)
  async getExpiringDocuments(@Request() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      return [];
    }
    return await this.notificationService.getExpiringDocumentsForUser(userId);
  }

  @Get('check')
  @Permissions(Permission.DOCUMENT_VIEW)
  async manualCheck() {
    return await this.notificationService.manualCheck();
  }
}

