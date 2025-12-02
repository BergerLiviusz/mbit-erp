import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../common/audit/audit.module';
import { StorageModule } from '../common/storage/storage.module';
import { SystemModule } from '../system/system.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentCategoryController } from './document-category.controller';
import { DocumentCategoryService } from './document-category.service';
import { OcrService } from './ocr.service';
import { DocumentNotificationController } from './document-notification.controller';
import { DocumentNotificationService } from './document-notification.service';
import { TagController } from './tag.controller';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    StorageModule,
    SystemModule,
  ],
  controllers: [
    DocumentController,
    DocumentCategoryController,
    DocumentNotificationController,
    TagController,
  ],
  providers: [
    DocumentService,
    DocumentCategoryService,
    OcrService,
    DocumentNotificationService,
  ],
  exports: [
    DocumentService,
    DocumentCategoryService,
  ],
})
export class DmsModule {}
