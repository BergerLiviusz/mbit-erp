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
  InvoiceService,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  CreateInvoicePaymentDto,
} from './invoice.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/invoices')
@UseGuards(RbacGuard)
export class InvoiceController {
  constructor(
    private invoiceService: InvoiceService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.CRM_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('accountId') accountId?: string,
    @Query('orderId') orderId?: string,
    @Query('allapot') allapot?: string,
    @Query('tipus') tipus?: string,
    @Query('kiallitasDatumFrom') kiallitasDatumFrom?: string,
    @Query('kiallitasDatumTo') kiallitasDatumTo?: string,
  ) {
    return this.invoiceService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        accountId,
        orderId,
        allapot,
        tipus,
        kiallitasDatumFrom,
        kiallitasDatumTo,
      },
    );
  }

  @Get(':id')
  @Permissions(Permission.CRM_VIEW)
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Post()
  @Permissions(Permission.CRM_CREATE)
  async create(@Body() dto: CreateInvoiceDto, @Request() req: any) {
    const invoice = await this.invoiceService.create(dto);
    
    await this.auditService.logCreate(
      'Invoice',
      invoice.id,
      invoice,
      req.user?.id,
    );

    return invoice;
  }

  @Post('from-order/:orderId')
  @Permissions(Permission.CRM_CREATE)
  async createFromOrder(
    @Param('orderId') orderId: string,
    @Body() dto?: Partial<CreateInvoiceDto>,
    @Request() req: any,
  ) {
    const invoice = await this.invoiceService.createFromOrder(orderId, dto);
    
    await this.auditService.logCreate(
      'Invoice',
      invoice.id,
      { ...invoice, source: 'order', orderId },
      req.user?.id,
    );

    return invoice;
  }

  @Put(':id')
  @Permissions(Permission.CRM_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
    @Request() req: any,
  ) {
    const oldInvoice = await this.invoiceService.findOne(id);
    const updated = await this.invoiceService.update(id, dto);
    
    await this.auditService.logUpdate(
      'Invoice',
      id,
      oldInvoice,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Post(':id/mark-issued')
  @Permissions(Permission.CRM_EDIT)
  async markAsIssued(@Param('id') id: string, @Request() req: any) {
    const invoice = await this.invoiceService.markAsIssued(id);
    
    await this.auditService.logUpdate(
      'Invoice',
      id,
      { allapot: 'VAZLAT' },
      { allapot: 'KIALLITVA' },
      req.user?.id,
    );

    return invoice;
  }

  @Post(':id/mark-sent')
  @Permissions(Permission.CRM_EDIT)
  async markAsSent(@Param('id') id: string, @Request() req: any) {
    const invoice = await this.invoiceService.markAsSent(id);
    
    await this.auditService.logUpdate(
      'Invoice',
      id,
      { allapot: 'KIALLITVA' },
      { allapot: 'ELKULDVE' },
      req.user?.id,
    );

    return invoice;
  }

  @Post(':id/payments')
  @Permissions(Permission.CRM_EDIT)
  async addPayment(
    @Param('id') id: string,
    @Body() dto: CreateInvoicePaymentDto,
    @Request() req: any,
  ) {
    const payment = await this.invoiceService.addPayment(id, dto);
    
    await this.auditService.logCreate(
      'InvoicePayment',
      payment.id,
      payment,
      req.user?.id,
    );

    return payment;
  }

  @Post(':id/storno')
  @Permissions(Permission.CRM_EDIT)
  async storno(
    @Param('id') id: string,
    @Body() body: { reason?: string },
    @Request() req: any,
  ) {
    const invoice = await this.invoiceService.storno(id, body.reason);
    
    await this.auditService.logUpdate(
      'Invoice',
      id,
      { allapot: invoice.allapot },
      { allapot: 'STORNO' },
      req.user?.id,
    );

    return invoice;
  }

  @Delete(':id')
  @Permissions(Permission.CRM_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const oldInvoice = await this.invoiceService.findOne(id);
    await this.invoiceService.delete(id);
    
    await this.auditService.logDelete(
      'Invoice',
      id,
      oldInvoice,
      req.user?.id,
    );

    return { message: 'Számla törölve' };
  }
}

