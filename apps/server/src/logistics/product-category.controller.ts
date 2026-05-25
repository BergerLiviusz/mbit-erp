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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductCategoryService } from './product-category.service';
import { LogisticsExportService } from './logistics-export.service';
import { AuditService } from '../common/audit/audit.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('logistics/categories')
@UseGuards(RbacGuard)
export class ProductCategoryController {
  constructor(
    private categoryService: ProductCategoryService,
    private exportService: LogisticsExportService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.LOGISTICS_VIEW, Permission.PRODUCT_VIEW)
  findAll(@Query('tree') tree?: string) {
    if (tree === 'true') return this.categoryService.findTree();
    return this.categoryService.findAll();
  }

  @Get('report')
  @Permissions(Permission.LOGISTICS_VIEW, Permission.REPORT_VIEW)
  report() {
    return this.categoryService.reportByCategory();
  }

  @Get('export/:format')
  @Permissions(Permission.LOGISTICS_EXPORT, Permission.REPORT_EXPORT)
  async exportCategoryReport(
    @Param('format') format: 'csv' | 'xlsx',
    @Res() res: Response,
  ) {
    const data = await this.categoryService.reportByCategory();
    const headers = ['Kategória', 'Cikkek száma', 'Össz mennyiség', 'Érték'];
    const rows = data.map((r) => [
      r.categoryName,
      r.itemCount,
      r.totalQty,
      r.totalValue,
    ]);
    const fmt = format === 'xlsx' ? 'xlsx' : 'csv';
    const result = await this.exportService.packRows(
      'Kategoria_riport',
      headers,
      rows,
      fmt,
    );
    await this.auditService.log({
      esemeny: 'export',
      entitas: 'ProductCategory',
      uj: { format: fmt, rowCount: rows.length },
    });
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.buffer);
  }

  @Post()
  @Permissions(Permission.LOGISTICS_CREATE, Permission.PRODUCT_CREATE)
  async create(@Body() data: { nev: string; leiras?: string; parentId?: string }) {
    const created = await this.categoryService.create(data);
    await this.auditService.logCreate('ProductCategory', created.id, created);
    return created;
  }

  @Put(':id')
  @Permissions(Permission.LOGISTICS_EDIT, Permission.PRODUCT_EDIT)
  async update(
    @Param('id') id: string,
    @Body() data: { nev?: string; leiras?: string; parentId?: string | null; aktiv?: boolean },
  ) {
    const old = await this.categoryService.findAll(0, 1000);
    const prev = old.data.find((c: { id: string }) => c.id === id);
    const updated = await this.categoryService.update(id, data);
    await this.auditService.logUpdate('ProductCategory', id, prev, updated);
    return updated;
  }

  @Delete(':id')
  @Permissions(Permission.LOGISTICS_DELETE, Permission.PRODUCT_DELETE)
  async delete(@Param('id') id: string) {
    const deleted = await this.categoryService.delete(id);
    await this.auditService.logDelete('ProductCategory', id, deleted);
    return deleted;
  }
}
