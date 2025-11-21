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
  ContractService,
  CreateEmploymentContractDto,
  UpdateEmploymentContractDto,
  CreateContractAmendmentDto,
} from './contract.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('hr/contracts')
@UseGuards(RbacGuard)
export class ContractController {
  constructor(
    private contractService: ContractService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.HR_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('employeeId') employeeId?: string,
    @Query('tipus') tipus?: string,
    @Query('aktiv') aktiv?: string,
  ) {
    return this.contractService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        employeeId,
        tipus,
        aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
      },
    );
  }

  @Get('expiring')
  @Permissions(Permission.HR_VIEW)
  getExpiringContracts(@Query('days') days?: string) {
    return this.contractService.getExpiringContracts(
      days ? parseInt(days) : 30,
    );
  }

  @Get(':id')
  @Permissions(Permission.HR_VIEW)
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }

  @Post()
  @Permissions(Permission.HR_CREATE)
  async create(@Body() dto: CreateEmploymentContractDto, @Request() req: any) {
    const contract = await this.contractService.create(dto);
    
    await this.auditService.logCreate(
      'EmploymentContract',
      contract.id,
      contract,
      req.user?.id,
    );

    return contract;
  }

  @Put(':id')
  @Permissions(Permission.HR_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEmploymentContractDto,
    @Request() req: any,
  ) {
    const oldContract = await this.contractService.findOne(id);
    const updated = await this.contractService.update(id, dto);
    
    await this.auditService.logUpdate(
      'EmploymentContract',
      id,
      oldContract,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Post(':id/amendments')
  @Permissions(Permission.HR_EDIT)
  async addAmendment(
    @Param('id') contractId: string,
    @Body() dto: CreateContractAmendmentDto,
    @Request() req: any,
  ) {
    const amendment = await this.contractService.addAmendment(contractId, dto);
    
    await this.auditService.logCreate(
      'ContractAmendment',
      amendment.id,
      amendment,
      req.user?.id,
    );

    return amendment;
  }

  @Delete(':id')
  @Permissions(Permission.HR_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const oldContract = await this.contractService.findOne(id);
    await this.contractService.delete(id);
    
    await this.auditService.logDelete(
      'EmploymentContract',
      id,
      oldContract,
      req.user?.id,
    );

    return { message: 'Munkaszerződés törölve' };
  }
}

