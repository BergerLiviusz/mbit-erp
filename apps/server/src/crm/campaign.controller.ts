import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, BadRequestException, Res } from '@nestjs/common';
import { Response } from 'express';
import { CampaignService, CampaignFilters } from './campaign.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';
import * as ExcelJS from 'exceljs';

@Controller('crm/campaigns')
@UseGuards(RbacGuard)
export class CampaignController {
  constructor(
    private campaignService: CampaignService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.CAMPAIGN_VIEW)
  async findAll(
    @Query('skip') skipParam?: string,
    @Query('take') takeParam?: string,
    @Query('tipus') tipus?: string,
    @Query('allapot') allapot?: string,
    @Query('iparag') iparag?: string,
    @Query('regio') regio?: string,
    @Query('kezdetDatum') kezdetDatum?: string,
    @Query('befejezesDatum') befejezesDatum?: string,
  ) {
    const skip = skipParam ? parseInt(skipParam, 10) : 0;
    const take = takeParam ? parseInt(takeParam, 10) : 50;
    
    if (isNaN(skip) || skip < 0) {
      throw new BadRequestException('Invalid skip parameter');
    }
    if (isNaN(take) || take < 1) {
      throw new BadRequestException('Invalid take parameter');
    }

    const filters: CampaignFilters = {};
    if (tipus) filters.tipus = tipus;
    if (allapot) filters.allapot = allapot;
    if (iparag) filters.iparag = iparag;
    if (regio) filters.regio = regio;
    if (kezdetDatum) filters.kezdetDatum = kezdetDatum;
    if (befejezesDatum) filters.befejezesDatum = befejezesDatum;
    
    return await this.campaignService.findAll(skip, take, filters);
  }

  @Get('export/:format')
  @Permissions(Permission.CAMPAIGN_VIEW)
  async exportCampaigns(
    @Param('format') format: 'csv' | 'excel',
    @Query('tipus') tipus?: string,
    @Query('allapot') allapot?: string,
    @Query('iparag') iparag?: string,
    @Query('regio') regio?: string,
    @Query('kezdetDatum') kezdetDatum?: string,
    @Query('befejezesDatum') befejezesDatum?: string,
    @Res() res: Response,
  ) {
    const filters: CampaignFilters = {};
    if (tipus) filters.tipus = tipus;
    if (allapot) filters.allapot = allapot;
    if (iparag) filters.iparag = iparag;
    if (regio) filters.regio = regio;
    if (kezdetDatum) filters.kezdetDatum = kezdetDatum;
    if (befejezesDatum) filters.befejezesDatum = befejezesDatum;

    const campaigns = await this.campaignService.exportCampaigns(filters, format);

    if (format === 'csv') {
      // CSV export
      const csvHeaders = [
        'Kampány neve',
        'Típus',
        'Állapot',
        'Kezdés dátuma',
        'Befejezés dátuma',
        'Költségvetés',
        'Létrehozta',
        'Célcsoportok száma',
        'Leadek száma',
      ];

      const csvRows = campaigns.map(campaign => [
        campaign.nev,
        campaign.tipus,
        campaign.allapot,
        campaign.kezdetDatum.toISOString().split('T')[0],
        campaign.befejezesDatum ? campaign.befejezesDatum.toISOString().split('T')[0] : '',
        campaign.koltsegvetes?.toString() || '',
        campaign.createdBy?.nev || '',
        campaign._count?.accounts?.toString() || '0',
        campaign._count?.leads?.toString() || '0',
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="kampanyok_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send('\ufeff' + csvContent); // BOM for Excel compatibility
    } else {
      // Excel export
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Kampányok');

      // Headers
      worksheet.addRow([
        'Kampány neve',
        'Típus',
        'Állapot',
        'Kezdés dátuma',
        'Befejezés dátuma',
        'Költségvetés',
        'Létrehozta',
        'Célcsoportok száma',
        'Leadek száma',
      ]);

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' },
      };

      // Data rows
      campaigns.forEach(campaign => {
        worksheet.addRow([
          campaign.nev,
          campaign.tipus,
          campaign.allapot,
          campaign.kezdetDatum.toISOString().split('T')[0],
          campaign.befejezesDatum ? campaign.befejezesDatum.toISOString().split('T')[0] : '',
          campaign.koltsegvetes || 0,
          campaign.createdBy?.nev || '',
          campaign._count?.accounts || 0,
          campaign._count?.leads || 0,
        ]);
      });

      // Adjust column widths
      worksheet.columns.forEach((column, i) => {
        let maxLength = 0;
        column.eachCell!({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 0;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="kampanyok_${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.end(buffer);
    }
  }

  @Get(':id')
  @Permissions(Permission.CAMPAIGN_VIEW)
  async findOne(@Param('id') id: string) {
    return await this.campaignService.findOne(id);
  }

  @Post()
  @Permissions(Permission.CAMPAIGN_CREATE)
  async create(@Body() data: any) {
    const campaign = await this.campaignService.create(data);
    await this.auditService.logCreate('Campaign', campaign.id, data);
    return campaign;
  }

  @Put(':id')
  @Permissions(Permission.CAMPAIGN_EDIT)
  async update(@Param('id') id: string, @Body() data: any) {
    const old = await this.campaignService.findOne(id);
    const campaign = await this.campaignService.update(id, data);
    await this.auditService.logUpdate('Campaign', id, old, data);
    return campaign;
  }

  @Delete(':id')
  @Permissions(Permission.CAMPAIGN_DELETE)
  async delete(@Param('id') id: string) {
    const old = await this.campaignService.findOne(id);
    await this.campaignService.delete(id);
    await this.auditService.logDelete('Campaign', id, old);
    return { message: 'Kampány törölve' };
  }
}
