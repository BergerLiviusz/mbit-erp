import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { createWorker, Worker } from 'tesseract.js';
import * as pdfParse from 'pdf-parse';
import * as path from 'path';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  private worker: Worker | null = null;

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async createJob(documentId: string) {
    const job = await this.prisma.oCRJob.create({
      data: {
        documentId,
        allapot: 'beerkezett',
        nyelv: 'hun',
      },
    });

    this.processJob(job.id).catch((error) => {
      this.logger.error(`OCR job ${job.id} processing failed:`, error);
    });

    return job;
  }

  async findAll(skip = 0, take = 50) {
    const [total, items] = await Promise.all([
      this.prisma.oCRJob.count(),
      this.prisma.oCRJob.findMany({
        skip,
        take,
        include: {
          document: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  async getJobStatus(jobId: string) {
    return this.prisma.oCRJob.findUnique({
      where: { id: jobId },
    });
  }

  private async processJob(jobId: string) {
    try {
      const job = await this.prisma.oCRJob.findUnique({
        where: { id: jobId },
        include: { document: true },
      });

      if (!job) {
        this.logger.error(`Job ${jobId} not found`);
        return;
      }

      await this.prisma.oCRJob.update({
        where: { id: jobId },
        data: { allapot: 'feldolgozas', feldolgozasKezdet: new Date() },
      });

      if (!job.document.fajlUtvonal) {
        throw new Error('Document has no file path');
      }

      const filePath = this.storage.getAbsolutePath(job.document.fajlUtvonal);
      let extractedText = '';

      // PDF fájlokhoz először próbáljuk meg a pdf-parse-t
      if (job.document.mimeType === 'application/pdf') {
        try {
          const pdfBuffer = await this.storage.readFile(job.document.fajlUtvonal);
          const pdfData = await pdfParse(pdfBuffer);
          extractedText = pdfData.text.trim();
          
          // Ha van szöveg a PDF-ben, használjuk azt
          if (extractedText.length > 0) {
            this.logger.log(`PDF text extracted using pdf-parse: ${extractedText.length} characters`);
          } else {
            // Ha nincs szöveg (pl. scanned PDF), használjuk a Tesseract.js-t
            this.logger.log('PDF has no embedded text, using OCR');
            extractedText = await this.extractTextWithTesseract(filePath);
          }
        } catch (error) {
          this.logger.warn(`pdf-parse failed, falling back to OCR: ${error}`);
          extractedText = await this.extractTextWithTesseract(filePath);
        }
      } else {
        // Kép fájlokhoz Tesseract.js-t használunk
        extractedText = await this.extractTextWithTesseract(filePath);
      }

      // Generáljuk a .txt fájlt
      const txtFilename = `${path.basename(job.document.fajlNev, path.extname(job.document.fajlNev))}_ocr.txt`;
      const txtBuffer = Buffer.from(extractedText, 'utf-8');
      const txtRelativePath = await this.storage.saveFile('ocr', txtFilename, txtBuffer);

      await this.prisma.oCRJob.update({
        where: { id: jobId },
        data: {
          allapot: 'kesz',
          eredmeny: extractedText,
          txtFajlUtvonal: txtRelativePath,
          feldolgozasVeg: new Date(),
        },
      });

      await this.prisma.document.update({
        where: { id: job.documentId },
        data: {
          tartalom: extractedText,
        },
      });

      this.logger.log(`OCR job ${jobId} completed successfully with ${extractedText.length} characters`);
    } catch (error) {
      this.logger.error(`OCR job ${jobId} failed:`, error);
      
      await this.prisma.oCRJob.update({
        where: { id: jobId },
        data: {
          allapot: 'hiba',
          hibalista: error instanceof Error ? error.message : 'Unknown error',
          feldolgozasVeg: new Date(),
        },
      });
    }
  }

  private async extractTextWithTesseract(filePath: string): Promise<string> {
    if (!this.worker) {
      this.worker = await createWorker('hun', undefined, {
        logger: (m) => this.logger.debug(m),
      });
    }

    const { data: { text } } = await this.worker.recognize(filePath);
    return text.trim();
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.terminate();
    }
  }
}
