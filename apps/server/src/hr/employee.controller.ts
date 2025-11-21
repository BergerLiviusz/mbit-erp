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

