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

  /**
   * Converts HH:mm format to cron expression
   * @param timeString Time in HH:mm format (e.g., "02:00")
   * @returns Cron expression (e.g., "0 2 * * *")
   */
  private timeToCron(timeString: string): string {
    const timeRegex = /^(\d{1,2}):(\d{2})$/;
    const match = timeString.match(timeRegex);
    
    if (!match) {
      // If it's already a cron expression, return as is
      if (cron.validate(timeString)) {
        return timeString;
      }
      throw new Error(`Invalid time format: ${timeString}. Expected HH:mm format (e.g., "02:00")`);
    }

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error(`Invalid time: ${timeString}. Hours must be 0-23, minutes must be 0-59`);
    }

    return `${minutes} ${hours} * * *`;
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
        const schedule = dailySchedule?.ertek || '02:00';
        this.scheduleDailyBackup(schedule);
      }

      if (weeklyEnabled?.ertek === 'true') {
        const schedule = weeklySchedule?.ertek || '03:00';
        this.scheduleWeeklyBackup(schedule);
      }

      this.logger.log('Backup schedules loaded from settings');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn('Failed to load backup schedules:', errorMessage);
      this.logger.log('Using default backup schedule');
      this.scheduleDailyBackup('02:00');
    }
  }

  scheduleDailyBackup(schedule: string) {
    if (this.dailyTask) {
      this.dailyTask.stop();
    }

    try {
      const cronExpression = this.timeToCron(schedule);
      
      if (!cron.validate(cronExpression)) {
        this.logger.error(`Invalid daily backup schedule: ${schedule} (converted to: ${cronExpression})`);
        return;
      }

      this.dailyTask = cron.schedule(cronExpression, async () => {
        this.logger.log('Running scheduled daily backup');
        try {
          await this.backupService.createBackup('daily');
          this.logger.log('Daily backup completed successfully');
        } catch (error) {
          this.logger.error('Daily backup failed:', error);
        }
      });

      this.logger.log(`Daily backup scheduled: ${schedule} (cron: ${cronExpression})`);
    } catch (error) {
      this.logger.error(`Failed to schedule daily backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  scheduleWeeklyBackup(schedule: string) {
    if (this.weeklyTask) {
      this.weeklyTask.stop();
    }

    try {
      const cronExpression = this.timeToCron(schedule);
      // For weekly backup, we need to add the day of week (0 = Sunday)
      const cronParts = cronExpression.split(' ');
      const weeklyCron = `${cronParts[0]} ${cronParts[1]} * * 0`;
      
      if (!cron.validate(weeklyCron)) {
        this.logger.error(`Invalid weekly backup schedule: ${schedule} (converted to: ${weeklyCron})`);
        return;
      }

      this.weeklyTask = cron.schedule(weeklyCron, async () => {
        this.logger.log('Running scheduled weekly backup');
        try {
          await this.backupService.createBackup('weekly');
          this.logger.log('Weekly backup completed successfully');
        } catch (error) {
          this.logger.error('Weekly backup failed:', error);
        }
      });

      this.logger.log(`Weekly backup scheduled: ${schedule} (cron: ${weeklyCron})`);
    } catch (error) {
      this.logger.error(`Failed to schedule weekly backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
