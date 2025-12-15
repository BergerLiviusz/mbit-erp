import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReturnService } from './return.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { ApproveReturnDto } from './dto/approve-return.dto';
import { AuditService } from '../common/audit/audit.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('logistics/returns')
@UseGuards(RbacGuard)
export class ReturnController {
  constructor(
    private returnService: ReturnService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.RETURN_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('orderId') orderId?: string,
    @Query('purchaseOrderId') purchaseOrderId?: string,
    @Query('itemId') itemId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('allapot') allapot?: string,
  ) {
    const filters = { orderId, purchaseOrderId, itemId, warehouseId, allapot };
    return this.returnService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      filters,
    );
  }

  @Get(':id')
  @Permissions(Permission.RETURN_VIEW)
  findOne(@Param('id') id: string) {
    return this.returnService.findOne(id);
  }

  @Post()
  @Permissions(Permission.RETURN_CREATE)
  async create(@Body() dto: CreateReturnDto, @Request() req: any) {
    const returnItem = await this.returnService.create(dto, req.user?.id);
    await this.auditService.logCreate(
      'Return',
      returnItem.id,
      returnItem,
      req.user?.id,
    );
    return returnItem;
  }

  @Put(':id')
  @Permissions(Permission.RETURN_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReturnDto,
    @Request() req: any,
  ) {
    const old = await this.returnService.findOne(id);
    const updated = await this.returnService.update(id, dto, req.user?.id);
    await this.auditService.logUpdate('Return', id, old, updated, req.user?.id);
    return updated;
  }

  @Post(':id/approve')
  @Permissions(Permission.RETURN_APPROVE)
  async approve(
    @Param('id') id: string,
    @Body() dto: ApproveReturnDto,
    @Request() req: any,
  ) {
    const old = await this.returnService.findOne(id);
    const approved = await this.returnService.approve(
      id,
      req.user?.id,
      dto.megjegyzesek,
    );
    await this.auditService.logUpdate('Return', id, old, approved, req.user?.id);
    return approved;
  }

  @Post(':id/reject')
  @Permissions(Permission.RETURN_APPROVE)
  async reject(
    @Param('id') id: string,
    @Body() body: { reason?: string },
    @Request() req: any,
  ) {
    const old = await this.returnService.findOne(id);
    const rejected = await this.returnService.reject(
      id,
      req.user?.id,
      body.reason,
    );
    await this.auditService.logUpdate('Return', id, old, rejected, req.user?.id);
    return rejected;
  }

  @Post(':id/complete')
  @Permissions(Permission.RETURN_COMPLETE)
  async complete(@Param('id') id: string, @Request() req: any) {
    const old = await this.returnService.findOne(id);
    const completed = await this.returnService.complete(id, req.user?.id);
    await this.auditService.logUpdate(
      'Return',
      id,
      old,
      completed,
      req.user?.id,
    );
    return completed;
  }
}

