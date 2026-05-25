import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { AuditService } from '../common/audit/audit.service';
import { DocumentFilters } from './document.service';
import * as ExcelJS from 'exceljs';

export const DMS_WORKFLOW_STATES = [
  'beerkezett',
  'iktatott',
  'feldolgozas_alatt',
  'jovahagyasra_var',
  'jovahagyott',
  'archivalva',
  'elutasitva',
] as const;

@Injectable()
export class DocumentOperationsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private audit: AuditService,
  ) {}

  async assertDocumentAccess(
    documentId: string,
    userId: string | undefined,
    isAdmin: boolean,
    minLevel: 'READ' | 'EDIT' | 'ADMIN' = 'READ',
  ) {
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { access: true },
    });
    if (!doc) throw new NotFoundException('Dokumentum nem található');

    if (isAdmin) return doc;
    if (!userId) throw new ForbiddenException('Nincs hitelesítve');

    if (doc.createdById === userId) return doc;

    const acc = doc.access.find((a) => a.userId === userId);
    if (!acc) throw new ForbiddenException('Nincs hozzáférése a dokumentumhoz');

    const levels = { READ: 1, EDIT: 2, FULL_ACCESS: 3, ADMIN: 3 };
    const need = levels[minLevel] || 1;
    const have = levels[acc.jogosultsag as keyof typeof levels] || 1;
    if (have < need) throw new ForbiddenException('Nincs elegendő jogosultság');

    return doc;
  }

  async validateIktatoSzam(iktatoSzam: string, excludeId?: string): Promise<boolean> {
    const existing = await this.prisma.document.findUnique({
      where: { iktatoSzam },
    });
    if (!existing) return true;
    if (excludeId && existing.id === excludeId) return true;
    return false;
  }

  async changeWorkflow(
    documentId: string,
    ujAllapot: string,
    options: {
      megjegyzes?: string;
      felelos?: string;
      userId?: string;
      isAdmin?: boolean;
    },
  ) {
    if (!DMS_WORKFLOW_STATES.includes(ujAllapot as any)) {
      throw new BadRequestException(`Érvénytelen állapot: ${ujAllapot}`);
    }

    const doc = await this.assertDocumentAccess(
      documentId,
      options.userId,
      options.isAdmin || false,
      'EDIT',
    );

    const updated = await this.prisma.document.update({
      where: { id: documentId },
      data: {
        allapot: ujAllapot,
        ...(options.felelos !== undefined && { felelos: options.felelos }),
      },
    });

    await this.prisma.documentWorkflowLog.create({
      data: {
        documentId,
        regiAllapot: doc.allapot,
        ujAllapot,
        megjegyzes: options.megjegyzes,
        userId: options.userId,
      },
    });

    await this.audit.log({
      userId: options.userId,
      esemeny: 'workflow',
      entitas: 'Document',
      entitasId: documentId,
      regi: { allapot: doc.allapot },
      uj: { allapot: ujAllapot, megjegyzes: options.megjegyzes },
    });

    return updated;
  }

  async archive(
    documentId: string,
    userId: string | undefined,
    isAdmin: boolean,
    megjegyzes?: string,
  ) {
    return this.changeWorkflow(documentId, 'archivalva', {
      megjegyzes: megjegyzes || 'Archiválás',
      userId,
      isAdmin,
    });
  }

  async addVersion(
    documentId: string,
    file: Express.Multer.File,
    valtoztatasLeiras: string | undefined,
    userId: string | undefined,
    isAdmin: boolean,
  ) {
    const doc = await this.assertDocumentAccess(
      documentId,
      userId,
      isAdmin,
      'EDIT',
    );

    if (doc.allapot === 'archivalva' && !isAdmin) {
      throw new ForbiddenException('Archivált dokumentumhoz csak admin tölthet fel verziót');
    }

    const lastVersion = await this.prisma.documentVersion.findFirst({
      where: { documentId },
      orderBy: { verzioSzam: 'desc' },
    });
    const nextVer = (lastVersion?.verzioSzam || 0) + 1;

    if (doc.fajlUtvonal) {
      await this.prisma.documentVersion.create({
        data: {
          documentId,
          verzioSzam: lastVersion ? lastVersion.verzioSzam : 1,
          fajlUtvonal: doc.fajlUtvonal,
          valtoztatasLeiras: 'Automatikus mentés feltöltés előtt',
          createdById: userId,
        },
      });
    }

    const sanitized = this.storage.sanitizeFilename(file.originalname);
    const relativePath = await this.storage.saveFile('files', sanitized, file.buffer);

    const version = await this.prisma.documentVersion.create({
      data: {
        documentId,
        verzioSzam: nextVer,
        fajlUtvonal: relativePath,
        valtoztatasLeiras,
        createdById: userId,
      },
    });

    await this.prisma.document.update({
      where: { id: documentId },
      data: {
        fajlNev: file.originalname,
        fajlMeret: file.size,
        fajlUtvonal: relativePath,
        mimeType: file.mimetype,
      },
    });

    await this.audit.log({
      userId,
      esemeny: 'version_upload',
      entitas: 'Document',
      entitasId: documentId,
      uj: { verzioSzam: nextVer },
    });

    return version;
  }

  assertNotArchivedForMutation(doc: { allapot: string }, isAdmin: boolean, action: string) {
    if (doc.allapot === 'archivalva' && !isAdmin) {
      throw new ForbiddenException(`Archivált dokumentum nem ${action}`);
    }
  }

  async openVersionFile(
    versionId: string,
    userId?: string,
    isAdmin = false,
  ) {
    const version = await this.prisma.documentVersion.findUnique({
      where: { id: versionId },
      include: { document: { select: { id: true } } },
    });
    if (!version) throw new NotFoundException('Verzió nem található');

    await this.assertDocumentAccess(version.documentId, userId, isAdmin, 'READ');

    try {
      const buffer = await this.storage.readFile(version.fajlUtvonal);
      return { buffer, path: version.fajlUtvonal };
    } catch {
      throw new NotFoundException(
        'A verzió fájlja nem található a tárolóban. Ellenőrizze a fájl elérési útját vagy töltse fel újra.',
      );
    }
  }

  async getFileBuffer(documentId: string, userId?: string, isAdmin = false) {
    const doc = await this.assertDocumentAccess(documentId, userId, isAdmin, 'READ');
    if (!doc.fajlUtvonal) throw new BadRequestException('Nincs fájl');
    try {
      const buffer = await this.storage.readFile(doc.fajlUtvonal);
      return { doc, buffer };
    } catch {
      throw new NotFoundException(
        'A dokumentum fájlja nem található. Lehetséges, hogy régi tárolási útvonalról van szó – töltse fel újra a fájlt.',
      );
    }
  }

  async updateDocument(
    documentId: string,
    dto: Record<string, unknown>,
    userId?: string,
    isAdmin = false,
  ) {
    const doc = await this.assertDocumentAccess(documentId, userId, isAdmin, 'EDIT');
    this.assertNotArchivedForMutation(doc, isAdmin, 'módosítható');

    const updateData: Record<string, unknown> = { ...dto };
    if (dto.ervenyessegKezdet !== undefined) {
      updateData.ervenyessegKezdet = dto.ervenyessegKezdet
        ? new Date(dto.ervenyessegKezdet as string)
        : null;
    }
    if (dto.ervenyessegVeg !== undefined) {
      updateData.ervenyessegVeg = dto.ervenyessegVeg
        ? new Date(dto.ervenyessegVeg as string)
        : null;
    }
    if (dto.lejarat !== undefined) {
      updateData.lejarat = dto.lejarat ? new Date(dto.lejarat as string) : null;
    }
    if (dto.irany !== undefined) {
      updateData.irany = dto.irany || null;
    }

    return this.prisma.document.update({
      where: { id: documentId },
      data: updateData,
    });
  }

  async uploadFileToDocument(
    documentId: string,
    file: Express.Multer.File,
    userId?: string,
    isAdmin = false,
  ) {
    const doc = await this.assertDocumentAccess(documentId, userId, isAdmin, 'EDIT');
    this.assertNotArchivedForMutation(doc, isAdmin, 'tölthető fel');

    const sanitizedFilename = this.storage.sanitizeFilename(file.originalname);
    const relativePath = await this.storage.saveFile('files', sanitizedFilename, file.buffer);

    return this.prisma.document.update({
      where: { id: documentId },
      data: {
        fajlNev: file.originalname,
        fajlMeret: file.size,
        fajlUtvonal: relativePath,
        mimeType: file.mimetype,
      },
    });
  }

  async exportList(
    filters: DocumentFilters,
    format: 'csv' | 'excel',
    userId?: string,
    isAdmin = false,
  ) {
    const where: any = {};
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.allapot) where.allapot = filters.allapot;
    if (filters?.accountId) where.accountId = filters.accountId;
    if (!isAdmin && userId) {
      where.OR = [
        { createdById: userId },
        { access: { some: { userId } } },
      ];
    }

    const rows = await this.prisma.document.findMany({
      where,
      include: {
        category: true,
        account: true,
        ocrJob: { select: { allapot: true } },
        createdBy: { select: { nev: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5000,
    });

    await this.audit.log({
      userId,
      esemeny: 'export',
      entitas: 'Document',
      uj: { format, count: rows.length },
    });

    if (format === 'csv') {
      const header =
        'Iktatoszam;Nev;Tipus;Allapot;Kategoria;Ugyfel;Felelos;OCR;Letrehozva';
      const lines = rows.map((r) =>
        [
          r.iktatoSzam,
          r.nev,
          r.tipus,
          r.allapot,
          r.category?.nev,
          r.account?.nev,
          r.felelos,
          r.ocrJob?.allapot,
          r.createdAt.toISOString(),
        ]
          .map((c) => `"${(c || '').toString().replace(/"/g, '""')}"`)
          .join(';'),
      );
      return { contentType: 'text/csv; charset=utf-8', body: '\ufeff' + [header, ...lines].join('\n') };
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Dokumentumok');
    sheet.addRow([
      'Iktatószám',
      'Név',
      'Típus',
      'Állapot',
      'Kategória',
      'Ügyfél',
      'Felelős',
      'OCR',
      'Létrehozva',
    ]);
    rows.forEach((r) =>
      sheet.addRow([
        r.iktatoSzam,
        r.nev,
        r.tipus,
        r.allapot,
        r.category?.nev,
        r.account?.nev,
        r.felelos,
        r.ocrJob?.allapot,
        r.createdAt,
      ]),
    );
    const buffer = await workbook.xlsx.writeBuffer();
    return {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      body: buffer,
    };
  }

  async getReport(
    type: 'expiring' | 'by-type' | 'by-responsible' | 'ocr-errors' | 'archived',
    userId?: string,
    isAdmin = false,
  ) {
    const accessFilter = !isAdmin && userId
      ? {
          OR: [{ createdById: userId }, { access: { some: { userId } } }],
        }
      : {};

    switch (type) {
      case 'expiring': {
        const in30 = new Date();
        in30.setDate(in30.getDate() + 30);
        return this.prisma.document.findMany({
          where: {
            ...accessFilter,
            lejarat: { lte: in30, gte: new Date() },
            allapot: { not: 'archivalva' },
          },
          include: { account: true, category: true },
          orderBy: { lejarat: 'asc' },
        });
      }
      case 'by-type':
        return this.prisma.document.groupBy({
          by: ['tipus'],
          where: accessFilter,
          _count: { id: true },
        });
      case 'by-responsible':
        return this.prisma.document.groupBy({
          by: ['felelos'],
          where: { ...accessFilter, allapot: { not: 'archivalva' } },
          _count: { id: true },
        });
      case 'ocr-errors': {
        const jobs = await this.prisma.oCRJob.findMany({
          where: { allapot: 'hiba' },
          include: {
            document: {
              select: {
                id: true,
                nev: true,
                iktatoSzam: true,
                createdById: true,
                access: { select: { userId: true } },
              },
            },
          },
        });
        if (isAdmin || !userId) return jobs;
        return jobs.filter(
          (j) =>
            j.document.createdById === userId ||
            j.document.access.some((a) => a.userId === userId),
        );
      }
      case 'archived':
        return this.prisma.document.findMany({
          where: { ...accessFilter, allapot: 'archivalva' },
          orderBy: { updatedAt: 'desc' },
        });
      default:
        return [];
    }
  }

  async findByIktatoSzam(iktatoSzam: string, userId?: string, isAdmin = false) {
    const doc = await this.prisma.document.findUnique({
      where: { iktatoSzam },
      include: { category: true, account: true, ocrJob: true },
    });
    if (!doc) return null;
    if (!isAdmin && userId) {
      const has =
        doc.createdById === userId ||
        (await this.prisma.documentAccess.count({
          where: { documentId: doc.id, userId },
        })) > 0;
      if (!has) return null;
    }
    return doc;
  }
}
