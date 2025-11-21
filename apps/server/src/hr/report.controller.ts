import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import {
  HrReportService,
  NavPayrollReportDto,
  NavTaxReportDto,
  KshReportDto,
} from './report.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('hr/reports')
@UseGuards(RbacGuard)
export class HrReportController {
  constructor(
    private hrReportService: HrReportService,
    private auditService: AuditService,
  ) {}

  @Post('nav/payroll')
  @Permissions(Permission.HR_REPORT)
  async generateNavPayrollReport(
    @Body() dto: NavPayrollReportDto,
    @Res() res: Response,
    @Request() req: any,
  ) {
    const content = await this.hrReportService.generateNavPayrollReport(dto);
    
    await this.auditService.logCreate(
      'HrReport',
      `nav-payroll-${dto.ev}-${dto.honap}`,
      { type: 'NAV_PAYROLL', ...dto },
      req.user?.id,
    );

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="nav_berkifizetesi_${dto.ev}_${dto.honap}.txt"`);
    res.send('\ufeff' + content); // BOM for Excel compatibility
  }

  @Post('nav/tax')
  @Permissions(Permission.HR_REPORT)
  async generateNavTaxReport(
    @Body() dto: NavTaxReportDto,
    @Res() res: Response,
    @Request() req: any,
  ) {
    const content = await this.hrReportService.generateNavTaxReport(dto);
    
    await this.auditService.logCreate(
      'HrReport',
      `nav-tax-${dto.ev}-${dto.quarter || 'full'}`,
      { type: 'NAV_TAX', ...dto },
      req.user?.id,
    );

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const filename = dto.quarter
      ? `nav_szja_${dto.ev}_Q${dto.quarter}.txt`
      : `nav_szja_${dto.ev}.txt`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\ufeff' + content);
  }

  @Post('ksh/employment')
  @Permissions(Permission.HR_REPORT)
  async generateKshEmploymentReport(
    @Body() dto: KshReportDto,
    @Res() res: Response,
    @Request() req: any,
  ) {
    const content = await this.hrReportService.generateKshEmploymentReport(dto);
    
    await this.auditService.logCreate(
      'HrReport',
      `ksh-employment-${dto.ev}-${dto.honap || 'full'}`,
      { type: 'KSH_EMPLOYMENT', ...dto },
      req.user?.id,
    );

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const filename = dto.honap
      ? `ksh_foglalkoztatotti_${dto.ev}_${dto.honap}.txt`
      : `ksh_foglalkoztatotti_${dto.ev}.txt`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\ufeff' + content);
  }

  @Post('ksh/wage')
  @Permissions(Permission.HR_REPORT)
  async generateKshWageReport(
    @Body() dto: KshReportDto,
    @Res() res: Response,
    @Request() req: any,
  ) {
    const content = await this.hrReportService.generateKshWageReport(dto);
    
    await this.auditService.logCreate(
      'HrReport',
      `ksh-wage-${dto.ev}-${dto.honap || 'full'}`,
      { type: 'KSH_WAGE', ...dto },
      req.user?.id,
    );

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const filename = dto.honap
      ? `ksh_berstatisztika_${dto.ev}_${dto.honap}.txt`
      : `ksh_berstatisztika_${dto.ev}.txt`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\ufeff' + content);
  }

  @Post('ksh/contract')
  @Permissions(Permission.HR_REPORT)
  async generateKshContractReport(
    @Body() dto: KshReportDto,
    @Res() res: Response,
    @Request() req: any,
  ) {
    const content = await this.hrReportService.generateKshContractReport(dto);
    
    await this.auditService.logCreate(
      'HrReport',
      `ksh-contract-${dto.ev}-${dto.honap || 'full'}`,
      { type: 'KSH_CONTRACT', ...dto },
      req.user?.id,
    );

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const filename = dto.honap
      ? `ksh_szerzodes_${dto.ev}_${dto.honap}.txt`
      : `ksh_szerzodes_${dto.ev}.txt`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\ufeff' + content);
  }
}

