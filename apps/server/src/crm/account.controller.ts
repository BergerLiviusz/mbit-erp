import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { AccountService } from './account.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/accounts')
@UseGuards(RbacGuard)
export class AccountController {
  constructor(
    private accountService: AccountService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.CUSTOMER_VIEW)
  async findAll(@Query('skip') skipParam?: string, @Query('take') takeParam?: string) {
    const skip = skipParam ? parseInt(skipParam, 10) : 0;
    const take = takeParam ? parseInt(takeParam, 10) : 50;
    
    if (isNaN(skip) || skip < 0) {
      throw new BadRequestException('Invalid skip parameter');
    }
    if (isNaN(take) || take < 1) {
      throw new BadRequestException('Invalid take parameter');
    }
    
    return await this.accountService.findAll(skip, take);
  }

  @Get(':id')
  @Permissions(Permission.CUSTOMER_VIEW)
  async findOne(@Param('id') id: string) {
    return await this.accountService.findOne(id);
  }

  @Post()
  @Permissions(Permission.CUSTOMER_CREATE)
  async create(@Body() data: any) {
    const account = await this.accountService.create(data);
    await this.auditService.logCreate('Account', account.id, data);
    return account;
  }

  @Put(':id')
  @Permissions(Permission.CUSTOMER_EDIT)
  async update(@Param('id') id: string, @Body() data: any) {
    const old = await this.accountService.findOne(id);
    const account = await this.accountService.update(id, data);
    await this.auditService.logUpdate('Account', id, old, data);
    return account;
  }

  @Delete(':id')
  @Permissions(Permission.CUSTOMER_DELETE)
  async delete(@Param('id') id: string) {
    const old = await this.accountService.findOne(id);
    await this.accountService.delete(id);
    await this.auditService.logDelete('Account', id, old);
    return { message: 'Ügyfél törölve' };
  }
}
