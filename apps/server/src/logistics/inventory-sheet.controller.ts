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
  InventorySheetService,
  CreateInventorySheetDto,
  UpdateInventorySheetDto,
  AddInventorySheetItemDto,
  UpdateInventorySheetItemDto,
} from './inventory-sheet.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('logistics/inventory-sheets')
@UseGuards(RbacGuard)
export class InventorySheetController {
  constructor(
    private inventorySheetService: InventorySheetService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.STOCK_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('allapot') allapot?: string,
  ) {
    return this.inventorySheetService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        warehouseId,
        allapot,
      },
    );
  }

  @Get(':id')
  @Permissions(Permission.STOCK_VIEW)
  findOne(@Param('id') id: string) {
    return this.inventorySheetService.findOne(id);
  }

  @Post()
  @Permissions(Permission.STOCK_EDIT)
  async create(@Body() dto: CreateInventorySheetDto, @Request() req: any) {
    const sheet = await this.inventorySheetService.create(dto, req.user?.id);
    
    await this.auditService.logCreate(
      'InventorySheet',
      sheet.id,
      sheet,
      req.user?.id,
    );

    return sheet;
  }

  @Put(':id')
  @Permissions(Permission.STOCK_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInventorySheetDto,
    @Request() req: any,
  ) {
    const oldSheet = await this.inventorySheetService.findOne(id);
    const updated = await this.inventorySheetService.update(id, dto);
    
    await this.auditService.logUpdate(
      'InventorySheet',
      id,
      oldSheet,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Put(':id/status')
  @Permissions(Permission.STOCK_EDIT)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { allapot: string },
    @Request() req: any,
  ) {
    const oldSheet = await this.inventorySheetService.findOne(id);
    
    let updated;
    if (body.allapot === 'BEFEJEZETT') {
      updated = await this.inventorySheetService.update(id, { allapot: 'BEFEJEZETT' });
    } else if (body.allapot === 'FOLYAMATBAN') {
      updated = await this.inventorySheetService.update(id, { allapot: 'FOLYAMATBAN' });
    } else {
      throw new Error('Érvénytelen állapot');
    }
    
    await this.auditService.logUpdate(
      'InventorySheet',
      id,
      oldSheet,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Post(':id/approve')
  @Permissions(Permission.STOCK_EDIT)
  async approve(@Param('id') id: string, @Request() req: any) {
    const oldSheet = await this.inventorySheetService.findOne(id);
    const approved = await this.inventorySheetService.approve(id, req.user?.id);
    
    await this.auditService.logUpdate(
      'InventorySheet',
      id,
      oldSheet,
      approved,
      req.user?.id,
    );

    return approved;
  }

  @Post(':id/close')
  @Permissions(Permission.STOCK_EDIT)
  async close(@Param('id') id: string, @Request() req: any) {
    const oldSheet = await this.inventorySheetService.findOne(id);
    const closed = await this.inventorySheetService.close(id);
    
    await this.auditService.logUpdate(
      'InventorySheet',
      id,
      oldSheet,
      closed,
      req.user?.id,
    );

    return closed;
  }

  @Post(':id/items')
  @Permissions(Permission.STOCK_EDIT)
  async addItem(
    @Param('id') sheetId: string,
    @Body() dto: AddInventorySheetItemDto,
    @Request() req: any,
  ) {
    const item = await this.inventorySheetService.addItem(sheetId, dto);
    
    await this.auditService.logCreate(
      'InventorySheetItem',
      item.id,
      item,
      req.user?.id,
    );

    return item;
  }

  @Put(':id/items/:itemId')
  @Permissions(Permission.STOCK_EDIT)
  async updateItem(
    @Param('id') sheetId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateInventorySheetItemDto,
    @Request() req: any,
  ) {
    const oldItem = await this.inventorySheetService.findOne(sheetId);
    const updated = await this.inventorySheetService.updateItem(sheetId, itemId, dto);
    
    await this.auditService.logUpdate(
      'InventorySheetItem',
      updated.id,
      oldItem,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Delete(':id')
  @Permissions(Permission.STOCK_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const oldSheet = await this.inventorySheetService.findOne(id);
    await this.inventorySheetService.delete(id);
    
    await this.auditService.logDelete(
      'InventorySheet',
      id,
      oldSheet,
      req.user?.id,
    );

    return { message: 'Leltárív törölve' };
  }
}

