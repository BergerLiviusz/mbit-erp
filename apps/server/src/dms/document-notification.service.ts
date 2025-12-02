import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsService } from '../system/settings.service';
import * as cron from 'node-cron';

export interface DocumentNotification {
  id: string;
  documentId: string;
  documentNev: string;
  iktatoSzam?: string | null;
  lejaratDatum: Date;
  napokHatra: number;
  felelos?: string | null;
  createdBy?: {
    id: string;
    nev: string;
    email: string;
  } | null;
}

@Injectable()
export class DocumentNotificationService implements OnModuleInit {
  private readonly logger = new Logger(DocumentNotificationService.name);
  private checkTask: cron.ScheduledTask | null = null;

  constructor(
    private prisma: PrismaService,
    private systemSettings: SystemSettingsService,
  ) {}

  async onModuleInit() {
    // Run check daily at 8:00 AM
    this.checkTask = cron.schedule('0 8 * * *', async () => {
      this.logger.log('Running scheduled document deadline check');
      try {
        await this.checkDocumentDeadlines();
      } catch (error) {
        this.logger.error('Document deadline check failed:', error);
      }
    });

    this.logger.log('Document deadline notification scheduler initialized');
  }

  /**
   * Check documents with upcoming deadlines and return notifications
   */
  async checkDocumentDeadlines(): Promise<DocumentNotification[]> {
    const now = new Date();
    const notifications: DocumentNotification[] = [];

    // Get notification thresholds from settings (default: 7, 3, 1 days)
    const thresholds = await this.getNotificationThresholds();

    // Find documents with deadlines in the next 30 days
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const documents = await this.prisma.document.findMany({
      where: {
        OR: [
          { ervenyessegVeg: { gte: now, lte: thirtyDaysFromNow } },
          { lejarat: { gte: now, lte: thirtyDaysFromNow } },
        ],
      },
      include: {
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });

    for (const doc of documents) {
      const deadline = doc.ervenyessegVeg || doc.lejarat;
      if (!deadline) continue;

      const daysUntilDeadline = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Check if deadline matches any threshold
      if (thresholds.includes(daysUntilDeadline)) {
        notifications.push({
          id: doc.id,
          documentId: doc.id,
          documentNev: doc.nev,
          iktatoSzam: doc.iktatoSzam,
          lejaratDatum: deadline,
          napokHatra: daysUntilDeadline,
          felelos: doc.felelos,
          createdBy: doc.createdBy,
        });
      }
    }

    this.logger.log(`Found ${notifications.length} documents with upcoming deadlines`);
    return notifications;
  }

  /**
   * Get documents expiring soon for a specific user
   */
  async getExpiringDocumentsForUser(userId: string): Promise<DocumentNotification[]> {
    const now = new Date();
    const thresholds = await this.getNotificationThresholds();
    const maxDays = Math.max(...thresholds);

    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + maxDays);

    // Get documents accessible to user (via DocumentAccess or created by user)
    const documents = await this.prisma.document.findMany({
      where: {
        AND: [
          {
            OR: [
              { createdById: userId },
              { access: { some: { userId } } },
            ],
          },
          {
            OR: [
              { ervenyessegVeg: { gte: now, lte: futureDate } },
              { lejarat: { gte: now, lte: futureDate } },
            ],
          },
        ],
      },
      include: {
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });

    const notifications: DocumentNotification[] = [];

    for (const doc of documents) {
      const deadline = doc.ervenyessegVeg || doc.lejarat;
      if (!deadline) continue;

      const daysUntilDeadline = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (thresholds.includes(daysUntilDeadline)) {
        notifications.push({
          id: doc.id,
          documentId: doc.id,
          documentNev: doc.nev,
          iktatoSzam: doc.iktatoSzam,
          lejaratDatum: deadline,
          napokHatra: daysUntilDeadline,
          felelos: doc.felelos,
          createdBy: doc.createdBy,
        });
      }
    }

    return notifications;
  }

  /**
   * Get notification thresholds from system settings
   */
  private async getNotificationThresholds(): Promise<number[]> {
    try {
      const setting = await this.systemSettings.get('dms.deadline_notification_days');
      if (setting) {
        // Parse comma-separated values: "7,3,1"
        return setting
          .split(',')
          .map((s) => parseInt(s.trim()))
          .filter((n) => !isNaN(n) && n > 0)
          .sort((a, b) => b - a); // Sort descending
      }
    } catch (error) {
      this.logger.warn('Could not load notification thresholds, using defaults');
    }

    // Default: 7, 3, 1 days before deadline
    return [7, 3, 1];
  }

  /**
   * Manually trigger deadline check (for testing or manual execution)
   */
  async manualCheck(): Promise<DocumentNotification[]> {
    this.logger.log('Manual document deadline check triggered');
    return await this.checkDocumentDeadlines();
  }
}

