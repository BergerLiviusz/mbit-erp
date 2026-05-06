import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class HrMailService {
  private readonly logger = new Logger(HrMailService.name);

  constructor(private prisma: PrismaService) {}

  private async getSmtpConfig(): Promise<{
    host: string;
    port: number;
    secure: boolean;
    user?: string;
    pass?: string;
    from: string;
  } | null> {
    const host = await this.getSetting('hr.smtp.host');
    if (!host) return null;
    const port = parseInt((await this.getSetting('hr.smtp.port')) || '587', 10);
    const secure = (await this.getSetting('hr.smtp.secure')) === 'true';
    const user = (await this.getSetting('hr.smtp.user')) || undefined;
    const pass = (await this.getSetting('hr.smtp.pass')) || undefined;
    const from = (await this.getSetting('hr.smtp.from')) || user || 'noreply@mbit.local';
    return { host, port, secure, user, pass, from };
  }

  private async getSetting(kulcs: string): Promise<string | null> {
    const s = await this.prisma.systemSetting.findUnique({ where: { kulcs } });
    return s?.ertek || null;
  }

  async sendMail(to: string, subject: string, text: string, html?: string): Promise<{ sent: boolean; skippedReason?: string }> {
    const cfg = await this.getSmtpConfig();
    if (!cfg) {
      this.logger.warn('hr.smtp.host nincs beállítva – e-mail kihagyva');
      return { sent: false, skippedReason: 'no_smtp_config' };
    }
    try {
      const transporter = nodemailer.createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.secure,
        auth: cfg.user && cfg.pass ? { user: cfg.user, pass: cfg.pass } : undefined,
      });
      await transporter.sendMail({
        from: cfg.from,
        to,
        subject,
        text,
        html: html || text.replace(/\n/g, '<br/>'),
      });
      return { sent: true };
    } catch (e) {
      this.logger.error('HR e-mail küldés hiba', e as Error);
      return { sent: false, skippedReason: 'send_failed' };
    }
  }

  async notifyUserIds(userIds: string[], subject: string, text: string): Promise<void> {
    if (!userIds.length) return;
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds }, aktiv: true },
      select: { email: true },
    });
    for (const u of users) {
      if (u.email) await this.sendMail(u.email, subject, text);
    }
  }
}
