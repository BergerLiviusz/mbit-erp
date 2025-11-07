import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { createWorker, Worker } from 'tesseract.js';

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
        data: { allapot: 'feldolgozas' },
      });

      if (!job.document.fajlUtvonal) {
        throw new Error('Document has no file path');
      }

      const filePath = this.storage.getAbsolutePath(job.document.fajlUtvonal);

      if (!this.worker) {
        this.worker = await createWorker('hun', undefined, {
          logger: (m) => this.logger.debug(m),
        });
      }

      const { data: { text } } = await this.worker.recognize(filePath);

      await this.prisma.oCRJob.update({
        where: { id: jobId },
        data: {
          allapot: 'kesz',
          eredmeny: text,
          feldolgozasVeg: new Date(),
        },
      });

      await this.prisma.document.update({
        where: { id: job.documentId },
        data: {
          tartalom: text,
        },
      });

      this.logger.log(`OCR job ${jobId} completed successfully with ${text.length} characters`);
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

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.terminate();
    }
  }
}
