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
} from '@nestjs/common';
import { DiscountRuleService } from './discount-rule.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/discount-rules')
@UseGuards(RbacGuard)
export class DiscountRuleController {
  constructor(
    private discountRuleService: DiscountRuleService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.CRM_VIEW)
  async findAll(@Query('accountId') accountId?: string) {
    return this.discountRuleService.findAll(accountId);
  }

  @Get(':id')
  @Permissions(Permission.CRM_VIEW)
  async findOne(@Param('id') id: string) {
    return this.discountRuleService.findOne(id);
  }

  @Post()
  @Permissions(Permission.CRM_CREATE)
  async create(@Body() data: Record<string, unknown>) {
    const rule = await this.discountRuleService.create(data as any);
    await this.auditService.logCreate('DiscountRule', rule.id, data);
    return rule;
  }

  @Put(':id')
  @Permissions(Permission.CRM_EDIT)
  async update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    const old = await this.discountRuleService.findOne(id);
    const rule = await this.discountRuleService.update(id, data);
    await this.auditService.logUpdate('DiscountRule', id, old, data);
    return rule;
  }

  @Delete(':id')
  @Permissions(Permission.CRM_DELETE)
  async delete(@Param('id') id: string) {
    const old = await this.discountRuleService.findOne(id);
    await this.discountRuleService.delete(id);
    await this.auditService.logDelete('DiscountRule', id, old);
    return { message: 'Kedvezményszabály archiválva' };
  }

  @Post('calculate/quote/:quoteId')
  @Permissions(Permission.QUOTE_VIEW)
  async calculateQuote(@Param('quoteId') quoteId: string) {
    return this.discountRuleService.calculateForQuote(quoteId);
  }
}
