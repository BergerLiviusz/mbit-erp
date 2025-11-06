import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { DocumentService, CreateDocumentDto, UpdateDocumentDto, DocumentFilters } from './document.service';
import { AuditService } from '../common/audit/audit.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('dms/documents')
@UseGuards(RbacGuard)
export class DocumentController {
  constructor(
    private documentService: DocumentService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.DOCUMENT_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('categoryId') categoryId?: string,
    @Query('allapot') allapot?: string,
    @Query('accountId') accountId?: string,
    @Query('search') search?: string,
  ) {
    const filters: DocumentFilters = {
      categoryId,
      allapot,
      accountId,
      search,
    };

    return this.documentService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      filters,
    );
  }

  @Get(':id')
  @Permissions(Permission.DOCUMENT_VIEW)
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  @Post()
  @Permissions(Permission.DOCUMENT_CREATE)
  async create(@Body() dto: CreateDocumentDto, @Request() req: any) {
    const document = await this.documentService.create(dto);

    await this.auditService.logCreate(
      'Document',
      document.id,
      document,
      req.user?.id,
    );

    return document;
  }

  @Put(':id')
  @Permissions(Permission.DOCUMENT_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentDto,
    @Request() req: any,
  ) {
    const oldDocument = await this.documentService.findOne(id);
    const updatedDocument = await this.documentService.update(id, dto);

    await this.auditService.logUpdate(
      'Document',
      id,
      oldDocument,
      updatedDocument,
      req.user?.id,
    );

    return updatedDocument;
  }

  @Post(':id/upload')
  @Permissions(Permission.DMS_UPLOAD)
  async upload(@Param('id') id: string, @Request() req: any) {
    await this.auditService.log({
      userId: req.user?.id,
      esemeny: 'upload',
      entitas: 'Document',
      entitasId: id,
    });

    return {
      success: true,
      message: 'File upload endpoint ready - implementation pending',
      documentId: id,
    };
  }
}
