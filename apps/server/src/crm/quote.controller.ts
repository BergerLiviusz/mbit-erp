import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { QuoteService, CreateQuoteDto, UpdateQuoteDto } from './quote.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/quotes')
export class QuoteController {
  constructor(
    private quoteService: QuoteService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.QUOTE_VIEW)
  async findAll(
    @Query('skip') skipParam?: string,
    @Query('take') takeParam?: string,
    @Query('allapot') allapot?: string,
  ) {
    const skip = skipParam ? parseInt(skipParam, 10) : 0;
    const take = takeParam ? parseInt(takeParam, 10) : 10;
    
    if (isNaN(skip) || skip < 0) {
      throw new BadRequestException('Invalid skip parameter');
    }
    if (isNaN(take) || take < 1) {
      throw new BadRequestException('Invalid take parameter');
    }
    
    return await this.quoteService.findAll(skip, take, allapot);
  }

  @Get(':id')
  @Permissions(Permission.QUOTE_VIEW)
  async findOne(@Param('id') id: string) {
    return await this.quoteService.findOne(id);
  }

  @Post()
  @Permissions(Permission.QUOTE_CREATE)
  async create(@Body() createDto: CreateQuoteDto) {
    const quote = await this.quoteService.create(createDto);
    await this.auditService.logCreate('Quote', quote.id, createDto);
    return quote;
  }

  @Put(':id')
  @Permissions(Permission.QUOTE_EDIT)
  async update(@Param('id') id: string, @Body() updateDto: UpdateQuoteDto) {
    const old = await this.quoteService.findOne(id);
    const quote = await this.quoteService.update(id, updateDto);
    await this.auditService.logUpdate('Quote', id, old, updateDto);
    return quote;
  }

  @Post(':id/approve')
  @Permissions(Permission.QUOTE_APPROVE)
  async approve(@Param('id') id: string) {
    const old = await this.quoteService.findOne(id);
    const quote = await this.quoteService.approve(id);
    await this.auditService.logUpdate('Quote', id, old, { allapot: quote.allapot });
    return quote;
  }

  @Post(':id/reject')
  @Permissions(Permission.QUOTE_APPROVE)
  async reject(@Param('id') id: string) {
    const old = await this.quoteService.findOne(id);
    const quote = await this.quoteService.reject(id);
    await this.auditService.logUpdate('Quote', id, old, { allapot: 'elutasitott' });
    return quote;
  }

  @Delete(':id')
  @Permissions(Permission.QUOTE_DELETE)
  async delete(@Param('id') id: string) {
    const old = await this.quoteService.findOne(id);
    await this.quoteService.delete(id);
    await this.auditService.logDelete('Quote', id, old);
    return { message: 'Árajánlat törölve' };
  }
}
