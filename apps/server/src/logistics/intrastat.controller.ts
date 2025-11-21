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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  IntrastatService,
  CreateIntrastatDeclarationDto,
  CreateIntrastatItemDto,
  UpdateIntrastatItemDto,
} from './intrastat.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('logistics/intrastat')
@UseGuards(RbacGuard)
export class IntrastatController {
  constructor(
    private intrastatService: IntrastatService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.STOCK_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('ev') ev?: string,
    @Query('honap') honap?: string,
    @Query('allapot') allapot?: string,
  ) {
    return this.intrastatService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        ev: ev ? parseInt(ev) : undefined,
        honap: honap ? parseInt(honap) : undefined,
        allapot,
      },
    );
  }

  @Get('ev/:ev/honap/:honap')
  @Permissions(Permission.STOCK_VIEW)
  findByEvHonap(@Param('ev') ev: string, @Param('honap') honap: string) {
    return this.intrastatService.findByEvHonap(parseInt(ev), parseInt(honap));
  }

  @Get(':id')
  @Permissions(Permission.STOCK_VIEW)
  findOne(@Param('id') id: string) {
    return this.intrastatService.findOne(id);
  }

  @Get(':id/export/nav')
  @Permissions(Permission.STOCK_VIEW)
  async exportNav(@Param('id') id: string, @Res() res: Response) {
    const content = await this.intrastatService.generateNavFormat(id);
    const declaration = await this.intrastatService.findOne(id);
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="intrastat_${declaration.ev}_${declaration.honap}_nav.txt"`);
    res.send(content);
  }

  @Get(':id/export/xml')
  @Permissions(Permission.STOCK_VIEW)
  async exportXml(@Param('id') id: string, @Res() res: Response) {
    const content = await this.intrastatService.generateXmlFormat(id);
    const declaration = await this.intrastatService.findOne(id);
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="intrastat_${declaration.ev}_${declaration.honap}.xml"`);
    res.send(content);
  }

  @Post()
  @Permissions(Permission.STOCK_EDIT)
  async create(@Body() dto: CreateIntrastatDeclarationDto, @Request() req: any) {
    const declaration = await this.intrastatService.create(dto);
    
    await this.auditService.logCreate(
      'IntrastatDeclaration',
      declaration.id,
      declaration,
      req.user?.id,
    );

    return declaration;
  }

  @Post(':id/items')
  @Permissions(Permission.STOCK_EDIT)
  async addItem(
    @Param('id') declarationId: string,
    @Body() dto: CreateIntrastatItemDto,
    @Request() req: any,
  ) {
    const item = await this.intrastatService.addItem(declarationId, dto);
    
    await this.auditService.logCreate(
      'IntrastatItem',
      item.id,
      item,
      req.user?.id,
    );

    return item;
  }

  @Put(':id/items/:itemId')
  @Permissions(Permission.STOCK_EDIT)
  async updateItem(
    @Param('id') declarationId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateIntrastatItemDto,
    @Request() req: any,
  ) {
    const oldItem = await this.intrastatService.findOne(declarationId);
    const updated = await this.intrastatService.updateItem(declarationId, itemId, dto);
    
    await this.auditService.logUpdate(
      'IntrastatItem',
      itemId,
      oldItem,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Post(':id/mark-ready')
  @Permissions(Permission.STOCK_EDIT)
  async markAsReady(@Param('id') id: string, @Request() req: any) {
    const oldDeclaration = await this.intrastatService.findOne(id);
    const updated = await this.intrastatService.markAsReady(id);
    
    await this.auditService.logUpdate(
      'IntrastatDeclaration',
      id,
      oldDeclaration,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Post(':id/mark-sent')
  @Permissions(Permission.STOCK_EDIT)
  async markAsSent(@Param('id') id: string, @Request() req: any) {
    const oldDeclaration = await this.intrastatService.findOne(id);
    const updated = await this.intrastatService.markAsSent(id);
    
    await this.auditService.logUpdate(
      'IntrastatDeclaration',
      id,
      oldDeclaration,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Delete(':id/items/:itemId')
  @Permissions(Permission.STOCK_DELETE)
  async deleteItem(
    @Param('id') declarationId: string,
    @Param('itemId') itemId: string,
    @Request() req: any,
  ) {
    await this.intrastatService.deleteItem(declarationId, itemId);
    
    await this.auditService.logDelete(
      'IntrastatItem',
      itemId,
      {},
      req.user?.id,
    );

    return { message: 'INTRASTAT tétel törölve' };
  }

  @Delete(':id')
  @Permissions(Permission.STOCK_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const oldDeclaration = await this.intrastatService.findOne(id);
    await this.intrastatService.delete(id);
    
    await this.auditService.logDelete(
      'IntrastatDeclaration',
      id,
      oldDeclaration,
      req.user?.id,
    );

    return { message: 'INTRASTAT bejelentés törölve' };
  }
}

