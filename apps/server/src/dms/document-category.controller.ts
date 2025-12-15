import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { DocumentCategoryService, CreateDocumentCategoryDto, UpdateDocumentCategoryDto } from './document-category.service';
import { AuditService } from '../common/audit/audit.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('dms/categories')
@UseGuards(RbacGuard)
export class DocumentCategoryController {
  constructor(
    private categoryService: DocumentCategoryService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.DOCUMENT_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.categoryService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
    );
  }

  @Get(':id')
  @Permissions(Permission.DOCUMENT_VIEW)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Post()
  @Permissions(Permission.DOCUMENT_CREATE)
  async create(@Body() dto: CreateDocumentCategoryDto, @Request() req: any) {
    const category = await this.categoryService.create(dto);
    
    await this.auditService.logCreate(
      'DocumentCategory',
      category.id,
      category,
      req.user?.id,
    );

    return category;
  }

  @Put(':id')
  @Permissions(Permission.DOCUMENT_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentCategoryDto,
    @Request() req: any,
  ) {
    const oldCategory = await this.categoryService.findOne(id);
    const updatedCategory = await this.categoryService.update(id, dto);

    await this.auditService.logUpdate(
      'DocumentCategory',
      id,
      oldCategory,
      updatedCategory,
      req.user?.id,
    );

    return updatedCategory;
  }

  @Delete(':id')
  @Permissions(Permission.DOCUMENT_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const category = await this.categoryService.findOne(id);
    
    if (!category) {
      throw new BadRequestException('Kategória nem található');
    }

    // Check if category has documents
    const documentCount = await this.categoryService.countDocuments(id);
    if (documentCount > 0) {
      throw new BadRequestException(`A kategória nem törölhető, mert ${documentCount} dokumentumhoz van hozzárendelve`);
    }

    await this.categoryService.delete(id);
    
    await this.auditService.logDelete(
      'DocumentCategory',
      id,
      category,
      req.user?.id,
    );

    return { message: 'Kategória sikeresen törölve' };
  }
}
