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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  PriceListService,
  CreatePriceListDto,
  UpdatePriceListDto,
  AddPriceListItemDto,
  UpdatePriceListItemDto,
} from './price-list.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('logistics/price-lists')
@UseGuards(RbacGuard)
export class PriceListController {
  constructor(
    private priceListService: PriceListService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.PRICE_LIST_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('supplierId') supplierId?: string,
    @Query('aktiv') aktiv?: string,
  ) {
    return this.priceListService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        supplierId,
        aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
      },
    );
  }

  @Get(':id')
  @Permissions(Permission.PRICE_LIST_VIEW)
  findOne(@Param('id') id: string) {
    return this.priceListService.findOne(id);
  }

  @Post()
  @Permissions(Permission.PRICE_LIST_CREATE)
  async create(@Body() dto: CreatePriceListDto, @Request() req: any) {
    const priceList = await this.priceListService.create(dto);
    
    await this.auditService.logCreate(
      'PriceList',
      priceList.id,
      priceList,
      req.user?.id,
    );

    return priceList;
  }

  @Put(':id')
  @Permissions(Permission.PRICE_LIST_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePriceListDto,
    @Request() req: any,
  ) {
    const oldPriceList = await this.priceListService.findOne(id);
    const updated = await this.priceListService.update(id, dto);
    
    await this.auditService.logUpdate(
      'PriceList',
      id,
      oldPriceList,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Delete(':id')
  @Permissions(Permission.PRICE_LIST_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const oldPriceList = await this.priceListService.findOne(id);
    await this.priceListService.delete(id);
    
    await this.auditService.logDelete(
      'PriceList',
      id,
      oldPriceList,
      req.user?.id,
    );

    return { message: 'Árlista törölve' };
  }

  @Post(':id/items')
  @Permissions(Permission.PRICE_LIST_EDIT)
  async addItem(
    @Param('id') priceListId: string,
    @Body() dto: AddPriceListItemDto,
    @Request() req: any,
  ) {
    const item = await this.priceListService.addItem(priceListId, dto);
    
    await this.auditService.logCreate(
      'PriceListItem',
      `${priceListId}-${item.itemId}`,
      item,
      req.user?.id,
    );

    return item;
  }

  @Put(':id/items/:itemId')
  @Permissions(Permission.PRICE_LIST_EDIT)
  async updateItem(
    @Param('id') priceListId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdatePriceListItemDto,
    @Request() req: any,
  ) {
    const oldItem = await this.priceListService.findOne(priceListId);
    const updated = await this.priceListService.updateItem(priceListId, itemId, dto);
    
    await this.auditService.logUpdate(
      'PriceListItem',
      `${priceListId}-${itemId}`,
      oldItem,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Delete(':id/items/:itemId')
  @Permissions(Permission.PRICE_LIST_EDIT)
  async removeItem(
    @Param('id') priceListId: string,
    @Param('itemId') itemId: string,
    @Request() req: any,
  ) {
    const oldItem = await this.priceListService.findOne(priceListId);
    await this.priceListService.removeItem(priceListId, itemId);
    
    await this.auditService.logDelete(
      'PriceListItem',
      `${priceListId}-${itemId}`,
      oldItem,
      req.user?.id,
    );

    return { message: 'Árlista tétel törölve' };
  }

  @Post(':id/import')
  @Permissions(Permission.PRICE_LIST_IMPORT)
  @UseInterceptors(FileInterceptor('file'))
  async import(
    @Param('id') priceListId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new Error('Fájl feltöltése kötelező');
    }

    const result = await this.priceListService.importFromExcel(priceListId, file);
    
    await this.auditService.logCreate(
      'PriceListImport',
      `${priceListId}-${Date.now()}`,
      result,
      req.user?.id,
    );

    return result;
  }

  @Get(':id/export')
  @Permissions(Permission.PRICE_LIST_EXPORT)
  async export(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.priceListService.exportToExcel(id);
    const priceList = await this.priceListService.findOne(id);
    
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="arlista_${priceList.nev.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx"`,
    );
    
    res.send(buffer);
  }
}

