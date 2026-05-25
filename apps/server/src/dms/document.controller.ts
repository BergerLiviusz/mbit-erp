import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DocumentService, CreateDocumentDto, UpdateDocumentDto, DocumentFilters } from './document.service';
import { DocumentOperationsService } from './document-operations.service';
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
    private documentOps: DocumentOperationsService,
  ) {}

  @Get('export/:format')
  @Permissions(Permission.DMS_EXPORT)
  async exportList(
    @Param('format') format: 'csv' | 'excel',
    @Res() res: Response,
    @Query() query: DocumentFilters,
    @Request() req: any,
  ) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    const result = await this.documentOps.exportList(query, format, userId, isAdmin);
    res.setHeader('Content-Type', result.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="dokumentumok_${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}"`,
    );
    res.end(result.body);
  }

  @Get('reports/:reportType')
  @Permissions(Permission.DOCUMENT_VIEW)
  async report(@Param('reportType') reportType: string, @Request() req: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    return this.documentOps.getReport(reportType as any, userId, isAdmin);
  }

  @Get('lookup/iktato/:iktatoSzam')
  @Permissions(Permission.DOCUMENT_VIEW)
  async lookupIktato(@Param('iktatoSzam') iktatoSzam: string, @Request() req: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    const doc = await this.documentOps.findByIktatoSzam(iktatoSzam, userId, isAdmin);
    if (!doc) throw new BadRequestException('Dokumentum nem található');
    return doc;
  }

  @Get('ocr-jobs')
  @Permissions(Permission.DOCUMENT_VIEW)
  async ocrJobs(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Request() req?: any,
  ) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    return this.ocrService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      userId,
      isAdmin,
    );
  }

  @Get()
  @Permissions(Permission.DOCUMENT_VIEW)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('categoryId') categoryId?: string,
    @Query('allapot') allapot?: string,
    @Query('accountId') accountId?: string,
    @Query('irany') irany?: string,
    @Query('search') search?: string,
    @Query('tagId') tagId?: string,
    @Query('opportunityId') opportunityId?: string,
    @Query('quoteId') quoteId?: string,
    @Request() req?: any,
  ) {
    const filters: DocumentFilters = {
      categoryId,
      allapot,
      accountId,
      irany,
      search,
      tagId,
      opportunityId,
      quoteId,
    };

    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;

    return this.documentService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      filters,
      userId,
      isAdmin,
    );
  }

  @Get('versions/:versionId/file')
  @Permissions(Permission.DMS_DOWNLOAD)
  async downloadVersion(
    @Param('versionId') versionId: string,
    @Res() res: Response,
    @Request() req: any,
  ) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    const { buffer } = await this.documentOps.openVersionFile(versionId, userId, isAdmin);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
  }

  @Post()
  @Permissions(Permission.DOCUMENT_CREATE)
  async create(@Body() dto: CreateDocumentDto, @Request() req: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    try {
      const document = await this.documentService.create(dto, userId, {
        manualIktato: !!dto.iktatoSzam,
        isAdmin,
      });

      await this.auditService.log({
        userId,
        esemeny: 'iktatas',
        entitas: 'Document',
        entitasId: document.id,
        uj: { iktatoSzam: document.iktatoSzam },
      });
      await this.auditService.logCreate('Document', document.id, document, userId);

      return document;
    } catch (e: any) {
      throw new BadRequestException(e.message || 'Iktatás sikertelen');
    }
  }

  @Put(':id')
  @Permissions(Permission.DOCUMENT_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentDto,
    @Request() req: any,
  ) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    const oldDocument = await this.documentService.findOne(id, userId, isAdmin);
    if (!oldDocument) {
      throw new BadRequestException('Dokumentum nem található vagy nincs hozzáférése');
    }
    const updatedDocument = await this.documentOps.updateDocument(id, dto as any, userId, isAdmin);

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

    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    const updatedDocument = await this.documentOps.uploadFileToDocument(
      id,
      file,
      userId,
      isAdmin,
    );
    const relativePath = updatedDocument.fajlUtvonal;

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

  @Get(':id/download')
  @Permissions(Permission.DMS_DOWNLOAD)
  async downloadFile(@Param('id') id: string, @Res() res: Response, @Request() req: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    const { doc, buffer } = await this.documentOps.getFileBuffer(id, userId, isAdmin);
    res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(doc.fajlNev)}"`,
    );
    res.send(buffer);
  }

  @Post(':id/workflow')
  @Permissions(Permission.DOCUMENT_EDIT)
  async workflow(
    @Param('id') id: string,
    @Body() body: { ujAllapot: string; megjegyzes?: string; felelos?: string },
    @Request() req: any,
  ) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    return this.documentOps.changeWorkflow(id, body.ujAllapot, {
      megjegyzes: body.megjegyzes,
      felelos: body.felelos,
      userId,
      isAdmin,
    });
  }

  @Post(':id/archive')
  @Permissions(Permission.DOCUMENT_ARCHIVE)
  async archive(
    @Param('id') id: string,
    @Body('megjegyzes') megjegyzes: string,
    @Request() req: any,
  ) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    const doc = await this.documentOps.archive(id, userId, isAdmin, megjegyzes);
    await this.auditService.log({
      userId,
      esemeny: 'archive',
      entitas: 'Document',
      entitasId: id,
    });
    return doc;
  }

  @Post(':id/versions')
  @Permissions(Permission.DMS_VERSION)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }))
  async uploadVersion(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('valtoztatasLeiras') valtoztatasLeiras: string,
    @Request() req: any,
  ) {
    if (!file) throw new BadRequestException('Nincs fájl');
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    return this.documentOps.addVersion(id, file, valtoztatasLeiras, userId, isAdmin);
  }

  @Delete(':id')
  @Permissions(Permission.DOCUMENT_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    const document = await this.documentService.findOne(id, userId, isAdmin);
    
    if (!document) {
      throw new BadRequestException('Dokumentum nem található');
    }

    if (document.allapot === 'archivalva' && !isAdmin) {
      await this.auditService.log({
        userId,
        esemeny: 'delete_denied',
        entitas: 'Document',
        entitasId: id,
        uj: { reason: 'archived' },
      });
      throw new BadRequestException('Archivált dokumentum nem törölhető');
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

  @Get(':id/folder-path')
  @Permissions(Permission.DOCUMENT_VIEW)
  async getFolderPath(@Param('id') id: string, @Request() req: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    const document = await this.documentService.findOne(id, userId, isAdmin);

    if (!document) {
      throw new BadRequestException('Dokumentum nem található vagy nincs hozzáférése');
    }

    if (!document.fajlUtvonal) {
      throw new BadRequestException('A dokumentumhoz nincs fájl társítva');
    }

    const fullPath = await this.storageService.getResolvableAbsolutePath(document.fajlUtvonal);
    if (!fullPath) {
      throw new BadRequestException(
        'A fájl nem található a tárolóban. Lehetséges régi útvonal – töltse fel újra a dokumentumot.',
      );
    }

    const folderPath = require('path').dirname(fullPath);
    return { folderPath, fileFound: true };
  }

  @Get(':id/ocr/download')
  @Permissions(Permission.DOCUMENT_VIEW)
  async downloadOcrText(@Param('id') id: string, @Res() res: Response, @Request() req: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    const document = await this.documentService.findOne(id, userId, isAdmin);

    if (!document) {
      throw new BadRequestException('Dokumentum nem található vagy nincs hozzáférése');
    }

    const ocrJob = await this.prisma.oCRJob.findUnique({
      where: { documentId: id },
    });

    if (!ocrJob || ocrJob.allapot !== 'kesz') {
      throw new BadRequestException('OCR feldolgozás még nem készült el vagy nem található');
    }

    if (!ocrJob.txtFajlUtvonal) {
      throw new BadRequestException('OCR szövegfájl nem található');
    }

    try {
      const fileBuffer = await this.storageService.readFile(ocrJob.txtFajlUtvonal);
      const filename = `${document.fajlNev.replace(/\.[^/.]+$/, '')}_ocr.txt`;

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
      res.send(fileBuffer);
    } catch (error) {
      throw new BadRequestException('Nem sikerült betölteni az OCR szövegfájlt');
    }
  }

  @Post(':id/ocr')
  @Permissions(Permission.DOCUMENT_OCR)
  async triggerOcr(@Param('id') id: string, @Request() req: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    const document = await this.documentService.findOne(id, userId, isAdmin);
    
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

  @Post(':id/access')
  @Permissions(Permission.DOCUMENT_EDIT)
  async addAccess(
    @Param('id') id: string,
    @Body() body: { userId: string; jogosultsag: string },
    @Request() req: any,
  ) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    
    // Check if user has permission to manage access (admin or creator)
    const document = await this.documentService.findOne(id, userId, isAdmin);
    if (!document) {
      throw new BadRequestException('Dokumentum nem található vagy nincs hozzáférése');
    }

    if (!isAdmin && document.createdById !== userId) {
      throw new BadRequestException('Nincs jogosultsága a dokumentum hozzáférésének kezeléséhez');
    }

    const allowedLevels = ['READ', 'EDIT', 'FULL_ACCESS', 'ADMIN'];
    if (!allowedLevels.includes(body.jogosultsag)) {
      throw new BadRequestException(
        `Érvénytelen jogosultság. Engedélyezett: ${allowedLevels.join(', ')}`,
      );
    }

    const access = await this.prisma.documentAccess.upsert({
      where: {
        documentId_userId: {
          documentId: id,
          userId: body.userId,
        },
      },
      update: {
        jogosultsag: body.jogosultsag,
      },
      create: {
        documentId: id,
        userId: body.userId,
        jogosultsag: body.jogosultsag,
      },
      include: {
        user: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });

    await this.auditService.log({
      userId,
      esemeny: 'add_access',
      entitas: 'Document',
      entitasId: id,
    });

    return access;
  }

  @Delete(':id/access/:userId')
  @Permissions(Permission.DOCUMENT_EDIT)
  async removeAccess(
    @Param('id') id: string,
    @Param('userId') targetUserId: string,
    @Request() req: any,
  ) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    
    // Check if user has permission to manage access (admin or creator)
    const document = await this.documentService.findOne(id, userId, isAdmin);
    if (!document) {
      throw new BadRequestException('Dokumentum nem található vagy nincs hozzáférése');
    }

    if (!isAdmin && document.createdById !== userId) {
      throw new BadRequestException('Nincs jogosultsága a dokumentum hozzáférésének kezeléséhez');
    }

    await this.prisma.documentAccess.delete({
      where: {
        documentId_userId: {
          documentId: id,
          userId: targetUserId,
        },
      },
    });

    await this.auditService.log({
      userId,
      esemeny: 'remove_access',
      entitas: 'Document',
      entitasId: id,
    });

    return { success: true };
  }

  @Get(':id')
  @Permissions(Permission.DOCUMENT_VIEW)
  async findOne(@Param('id') id: string, @Request() req?: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;

    const document = await this.documentService.findOne(id, userId, isAdmin);
    if (!document) {
      throw new BadRequestException('Dokumentum nem található vagy nincs hozzáférése');
    }
    return document;
  }
}
