import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { BackupService } from './backup.service';
import * as cron from 'node-cron';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BackupScheduler implements OnModuleInit {
  private readonly logger = new Logger(BackupScheduler.name);
  private dailyTask: cron.ScheduledTask | null = null;
  private weeklyTask: cron.ScheduledTask | null = null;

  constructor(
    private backupService: BackupService,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.loadScheduleFromSettings();
  }

  private async loadScheduleFromSettings() {
    try {
      const dailyEnabled = await this.prisma.systemSetting.findUnique({
        where: { kulcs: 'backup.daily.enabled' },
      });

      const weeklyEnabled = await this.prisma.systemSetting.findUnique({
        where: { kulcs: 'backup.weekly.enabled' },
      });

      const dailySchedule = await this.prisma.systemSetting.findUnique({
        where: { kulcs: 'backup.daily.schedule' },
      });

      const weeklySchedule = await this.prisma.systemSetting.findUnique({
        where: { kulcs: 'backup.weekly.schedule' },
      });

      if (dailyEnabled?.ertek === 'true') {
        this.scheduleDailyBackup(dailySchedule?.ertek || '0 2 * * *');
      }

      if (weeklyEnabled?.ertek === 'true') {
        this.scheduleWeeklyBackup(weeklySchedule?.ertek || '0 3 * * 0');
      }

      this.logger.log('Backup schedules loaded from settings');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn('Failed to load backup schedules:', errorMessage);
      this.logger.log('Using default backup schedule');
      this.scheduleDailyBackup('0 2 * * *');
    }
  }

  scheduleDailyBackup(schedule: string) {
    if (this.dailyTask) {
      this.dailyTask.stop();
    }

    if (!cron.validate(schedule)) {
      this.logger.error(`Invalid daily backup schedule: ${schedule}`);
      return;
    }

    this.dailyTask = cron.schedule(schedule, async () => {
      this.logger.log('Running scheduled daily backup');
      try {
        await this.backupService.createBackup('daily');
        this.logger.log('Daily backup completed successfully');
      } catch (error) {
        this.logger.error('Daily backup failed:', error);
      }
    });

    this.logger.log(`Daily backup scheduled: ${schedule}`);
  }

  scheduleWeeklyBackup(schedule: string) {
    if (this.weeklyTask) {
      this.weeklyTask.stop();
    }

    if (!cron.validate(schedule)) {
      this.logger.error(`Invalid weekly backup schedule: ${schedule}`);
      return;
    }

    this.weeklyTask = cron.schedule(schedule, async () => {
      this.logger.log('Running scheduled weekly backup');
      try {
        await this.backupService.createBackup('weekly');
        this.logger.log('Weekly backup completed successfully');
      } catch (error) {
        this.logger.error('Weekly backup failed:', error);
      }
    });

    this.logger.log(`Weekly backup scheduled: ${schedule}`);
  }

  stopAllSchedules() {
    if (this.dailyTask) {
      this.dailyTask.stop();
      this.logger.log('Daily backup schedule stopped');
    }
    if (this.weeklyTask) {
      this.weeklyTask.stop();
      this.logger.log('Weekly backup schedule stopped');
    }
  }

  async runBackupNow(): Promise<void> {
    this.logger.log('Running immediate backup');
    await this.backupService.createBackup('manual');
  }
}
