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
  EmployeeService,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from './employee.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('hr/employees')
@UseGuards(RbacGuard)
export class EmployeeController {
  constructor(
    private employeeService: EmployeeService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.HR_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('jobPositionId') jobPositionId?: string,
    @Query('osztaly') osztaly?: string,
    @Query('reszleg') reszleg?: string,
    @Query('aktiv') aktiv?: string,
    @Query('search') search?: string,
  ) {
    return this.employeeService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        jobPositionId,
        osztaly,
        reszleg,
        aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
        search,
      },
    );
  }

  @Get(':id')
  @Permissions(Permission.HR_VIEW)
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Post(':id/previous-employments')
  @Permissions(Permission.HR_CREATE)
  addPreviousEmployment(@Param('id') id: string, @Body() body: any) {
    return this.employeeService.createPreviousEmployment(id, body);
  }

  @Put('previous-employments/:recId')
  @Permissions(Permission.HR_EDIT)
  updatePreviousEmployment(@Param('recId') recId: string, @Body() body: any) {
    return this.employeeService.updatePreviousEmployment(recId, body);
  }

  @Delete('previous-employments/:recId')
  @Permissions(Permission.HR_DELETE)
  deletePreviousEmployment(@Param('recId') recId: string) {
    return this.employeeService.deletePreviousEmployment(recId);
  }

  @Post(':id/awards')
  @Permissions(Permission.HR_CREATE)
  addAward(@Param('id') id: string, @Body() body: any) {
    return this.employeeService.createAward(id, body);
  }

  @Put('awards/:recId')
  @Permissions(Permission.HR_EDIT)
  updateAward(@Param('recId') recId: string, @Body() body: any) {
    return this.employeeService.updateAward(recId, body);
  }

  @Delete('awards/:recId')
  @Permissions(Permission.HR_DELETE)
  deleteAward(@Param('recId') recId: string) {
    return this.employeeService.deleteAward(recId);
  }

  @Post(':id/educations')
  @Permissions(Permission.HR_CREATE)
  async addEducation(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const row = await this.employeeService.createEducation(id, body);
    await this.auditService.logCreate('Education', row.id, row, req.user?.id);
    return row;
  }

  @Put('educations/:recId')
  @Permissions(Permission.HR_EDIT)
  async updateEducation(@Param('recId') recId: string, @Body() body: any, @Request() req: any) {
    const row = await this.employeeService.updateEducation(recId, body);
    await this.auditService.logUpdate('Education', recId, {}, row, req.user?.id);
    return row;
  }

  @Delete('educations/:recId')
  @Permissions(Permission.HR_DELETE)
  async deleteEducation(@Param('recId') recId: string, @Request() req: any) {
    await this.employeeService.deleteEducation(recId);
    await this.auditService.logDelete('Education', recId, {}, req.user?.id);
    return { message: 'Törölve' };
  }

  @Post(':id/language-skills')
  @Permissions(Permission.HR_CREATE)
  async addLanguage(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const row = await this.employeeService.createLanguageSkill(id, body);
    await this.auditService.logCreate('LanguageSkill', row.id, row, req.user?.id);
    return row;
  }

  @Put('language-skills/:recId')
  @Permissions(Permission.HR_EDIT)
  updateLanguage(@Param('recId') recId: string, @Body() body: any) {
    return this.employeeService.updateLanguageSkill(recId, body);
  }

  @Delete('language-skills/:recId')
  @Permissions(Permission.HR_DELETE)
  deleteLanguage(@Param('recId') recId: string) {
    return this.employeeService.deleteLanguageSkill(recId);
  }

  @Post(':id/medical-examinations')
  @Permissions(Permission.HR_CREATE)
  async addMedical(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const row = await this.employeeService.createMedicalExamination(id, body);
    await this.auditService.logCreate('MedicalExamination', row.id, row, req.user?.id);
    return row;
  }

  @Put('medical-examinations/:recId')
  @Permissions(Permission.HR_EDIT)
  updateMedical(@Param('recId') recId: string, @Body() body: any) {
    return this.employeeService.updateMedicalExamination(recId, body);
  }

  @Delete('medical-examinations/:recId')
  @Permissions(Permission.HR_DELETE)
  deleteMedical(@Param('recId') recId: string) {
    return this.employeeService.deleteMedicalExamination(recId);
  }

  @Post(':id/disciplinary-actions')
  @Permissions(Permission.HR_CREATE)
  async addDisciplinary(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const row = await this.employeeService.createDisciplinaryAction(id, body);
    await this.auditService.logCreate('DisciplinaryAction', row.id, row, req.user?.id);
    return row;
  }

  @Put('disciplinary-actions/:recId')
  @Permissions(Permission.HR_EDIT)
  updateDisciplinary(@Param('recId') recId: string, @Body() body: any) {
    return this.employeeService.updateDisciplinaryAction(recId, body);
  }

  @Delete('disciplinary-actions/:recId')
  @Permissions(Permission.HR_DELETE)
  deleteDisciplinary(@Param('recId') recId: string) {
    return this.employeeService.deleteDisciplinaryAction(recId);
  }

  @Post(':id/study-contracts')
  @Permissions(Permission.HR_CREATE)
  async addStudyContract(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const row = await this.employeeService.createStudyContract(id, body);
    await this.auditService.logCreate('StudyContract', row.id, row, req.user?.id);
    return row;
  }

  @Put('study-contracts/:recId')
  @Permissions(Permission.HR_EDIT)
  updateStudyContract(@Param('recId') recId: string, @Body() body: any) {
    return this.employeeService.updateStudyContract(recId, body);
  }

  @Delete('study-contracts/:recId')
  @Permissions(Permission.HR_DELETE)
  deleteStudyContract(@Param('recId') recId: string) {
    return this.employeeService.deleteStudyContract(recId);
  }

  @Post()
  @Permissions(Permission.HR_CREATE)
  async create(@Body() dto: CreateEmployeeDto, @Request() req: any) {
    const employee = await this.employeeService.create(dto);
    
    await this.auditService.logCreate(
      'Employee',
      employee.id,
      employee,
      req.user?.id,
    );

    return employee;
  }

  @Put(':id')
  @Permissions(Permission.HR_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
    @Request() req: any,
  ) {
    const oldEmployee = await this.employeeService.findOne(id);
    const updated = await this.employeeService.update(id, dto);
    
    await this.auditService.logUpdate(
      'Employee',
      id,
      oldEmployee,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Delete(':id')
  @Permissions(Permission.HR_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const oldEmployee = await this.employeeService.findOne(id);
    await this.employeeService.delete(id);
    
    await this.auditService.logDelete(
      'Employee',
      id,
      oldEmployee,
      req.user?.id,
    );

    return { message: 'Dolgozó törölve' };
  }
}

