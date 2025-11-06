import { Module, Global } from '@nestjs/common';
import { BackupService } from './backup.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Global()
@Module({
  imports: [PrismaModule, StorageModule],
  providers: [BackupService],
  exports: [BackupService],
})
export class BackupModule {}
