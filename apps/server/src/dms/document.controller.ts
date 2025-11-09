import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService, CreateDocumentDto, UpdateDocumentDto, DocumentFilters } from './document.service';
import { AuditService } from '../common/audit/audit.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { StorageService } from '../common/storage/storage.service';
import { OcrService } from './ocr.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('dms/documents')
@UseGuards(RbacGuard)
export class DocumentController {
  constructor(
    private documentService: DocumentService,
    private auditService: AuditService,
    private storageService: StorageService,
    private ocrService: OcrService,
    private prisma: PrismaService,
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
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
      const allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
      ];
      
      if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Nem támogatott fájltípus'), false);
      }
    },
  }))
  async upload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Nincs fájl feltöltve');
    }

    const sanitizedFilename = this.storageService.sanitizeFilename(file.originalname);
    const relativePath = await this.storageService.saveFile(
      'files',
      sanitizedFilename,
      file.buffer,
    );

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: {
        fajlNev: file.originalname,
        fajlMeret: file.size,
        fajlUtvonal: relativePath,
        mimeType: file.mimetype,
      },
    });

    await this.auditService.log({
      userId: req.user?.id,
      esemeny: 'upload',
      entitas: 'Document',
      entitasId: id,
    });

    const settings = await this.prisma.systemSetting.findUnique({
      where: { kulcs: 'dms.ocr.enabled' },
    });

    if (settings?.ertek === 'true' && file.mimetype === 'application/pdf') {
      await this.ocrService.createJob(id);
    }

    return {
      success: true,
      message: 'Fájl sikeresen feltöltve',
      documentId: id,
      file: {
        nev: file.originalname,
        meret: file.size,
        utvonal: relativePath,
        mimeType: file.mimetype,
      },
    };
  }

  @Delete(':id')
  @Permissions(Permission.DOCUMENT_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const document = await this.documentService.findOne(id);
    
    if (!document) {
      throw new BadRequestException('Dokumentum nem található');
    }

    // Töröljük a fájlt is, ha létezik
    if (document.fajlUtvonal) {
      try {
        await this.storageService.deleteFile(document.fajlUtvonal);
      } catch (error) {
        // Logoljuk, de nem dobunk hibát, ha a fájl nem található
        console.warn(`Fájl törlése sikertelen: ${document.fajlUtvonal}`, error);
      }
    }

    await this.documentService.delete(id);
    
    await this.auditService.logDelete(
      'Document',
      id,
      document,
      req.user?.id,
    );

    return { message: 'Dokumentum sikeresen törölve' };
  }

  @Post(':id/ocr')
  @Permissions(Permission.DOCUMENT_VIEW)
  async triggerOcr(@Param('id') id: string, @Request() req: any) {
    const document = await this.documentService.findOne(id);
    
    if (!document) {
      throw new BadRequestException('Dokumentum nem található');
    }

    if (!document.fajlUtvonal) {
      throw new BadRequestException('A dokumentumhoz nincs fájl feltöltve');
    }

    const job = await this.ocrService.createJob(id);
    
    await this.auditService.log({
      userId: req.user?.id,
      esemeny: 'ocr_trigger',
      entitas: 'Document',
      entitasId: id,
    });

    return {
      message: 'OCR feldolgozás elindítva',
      jobId: job.id,
    };
  }
}
