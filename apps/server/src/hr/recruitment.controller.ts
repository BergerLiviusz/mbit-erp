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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HrRecruitmentService } from './recruitment.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { StorageService } from '../common/storage/storage.service';

@Controller('hr/recruitment')
@UseGuards(RbacGuard)
export class RecruitmentController {
  constructor(
    private svc: HrRecruitmentService,
    private storage: StorageService,
  ) {}

  @Get('postings')
  @Permissions(Permission.HR_VIEW)
  listPostings(@Query('allapot') allapot?: string) {
    return this.svc.listPostings(allapot);
  }

  @Get('postings/:id')
  @Permissions(Permission.HR_VIEW)
  getPosting(@Param('id') id: string) {
    return this.svc.getPosting(id);
  }

  @Post('postings')
  @Permissions(Permission.HR_CREATE)
  createPosting(@Body() body: any) {
    return this.svc.createPosting(body);
  }

  @Put('postings/:id')
  @Permissions(Permission.HR_EDIT)
  updatePosting(@Param('id') id: string, @Body() body: any) {
    return this.svc.updatePosting(id, body);
  }

  @Delete('postings/:id')
  @Permissions(Permission.HR_DELETE)
  deletePosting(@Param('id') id: string) {
    return this.svc.deletePosting(id);
  }

  @Post('postings/:postingId/applications')
  @Permissions(Permission.HR_CREATE)
  @UseInterceptors(FileInterceptor('cv'))
  async createApplication(
    @Param('postingId') postingId: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    let cvFajlUtvonal: string | undefined;
    let cvFajlNev: string | undefined;
    if (file?.buffer) {
      cvFajlNev = file.originalname;
      cvFajlUtvonal = await this.storage.saveFile('hr/cv', file.originalname, file.buffer);
    }
    return this.svc.createApplication({
      postingId,
      jelentkezoNev: body.jelentkezoNev,
      email: body.email,
      telefon: body.telefon,
      cvFajlUtvonal,
      cvFajlNev,
      cvDocumentId: body.cvDocumentId,
      megjegyzes: body.megjegyzes,
    });
  }

  @Put('applications/:id')
  @Permissions(Permission.HR_EDIT)
  updateApplication(@Param('id') id: string, @Body() body: any) {
    return this.svc.updateApplication(id, body);
  }

  @Get('analytics/status')
  @Permissions(Permission.HR_VIEW)
  analytics() {
    return this.svc.analyticsByStatus();
  }
}
