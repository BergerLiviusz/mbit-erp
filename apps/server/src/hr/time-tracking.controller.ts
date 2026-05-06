import { BadRequestException, Controller, Get, Post, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HrTimeTrackingService } from './time-tracking.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('hr/time')
@UseGuards(RbacGuard)
export class HrTimeTrackingController {
  constructor(private svc: HrTimeTrackingService) {}

  @Get('entries')
  @Permissions(Permission.HR_VIEW)
  listEntries(
    @Query('employeeId') employeeId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.svc.listEntries(employeeId, from, to);
  }

  @Post('entries')
  @Permissions(Permission.HR_EDIT)
  createEntry(@Body() body: any) {
    return this.svc.createEntry(body);
  }

  @Delete('entries/:id')
  @Permissions(Permission.HR_DELETE)
  deleteEntry(@Param('id') id: string) {
    return this.svc.deleteEntry(id);
  }

  @Get('import-batches')
  @Permissions(Permission.HR_VIEW)
  listBatches() {
    return this.svc.listImportBatches();
  }

  @Post('import/access-csv')
  @Permissions(Permission.HR_EDIT)
  @UseInterceptors(FileInterceptor('file'))
  importCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file?.buffer) throw new BadRequestException('Fájl szükséges');
    return this.svc.importAccessCsvBuffer(file.buffer, file.originalname);
  }
}
