import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TaskNotificationService {
  constructor(private prisma: PrismaService) {}

  async generateMailtoLink(taskId: string, userId?: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
            nev: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            nev: true,
          },
        },
        board: {
          select: {
            id: true,
            nev: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Feladat nem található');
    }

    // Determine recipient - use provided userId or assignedToId
    const recipientId = userId || task.assignedToId;
    if (!recipientId) {
      throw new NotFoundException('Nincs címzett megadva a feladathoz');
    }

    const recipient = await this.prisma.user.findUnique({
      where: { id: recipientId },
      select: {
        email: true,
        nev: true,
      },
    });

    if (!recipient || !recipient.email) {
      throw new NotFoundException('Címzett email címe nem található');
    }

    const subject = this.generateEmailSubject(task);
    const body = this.generateEmailBody(task);

    // Encode mailto URL
    const mailtoUrl = `mailto:${encodeURIComponent(recipient.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return {
      mailtoUrl,
      subject,
      body,
      recipient: {
        email: recipient.email,
        nev: recipient.nev,
      },
    };
  }

  private generateEmailSubject(task: any): string {
    return 'Új feladat az Mbit rendszerben!';
  }

  private generateEmailBody(task: any): string {
    let body = '';

    // Header
    body += 'Kedves Kolléga!\n\n';
    body += 'Új feladatot rendeltem hozzá Önhöz az Mbit ERP rendszerben.\n\n';

    // Task title
    body += '═══════════════════════════════════════\n';
    body += `FELADAT: ${task.cim}\n`;
    body += '═══════════════════════════════════════\n\n';

    // Description
    if (task.leiras) {
      body += `Leírás:\n${task.leiras}\n\n`;
    }

    // Details
    body += 'Részletek:\n';
    body += '───────────────────────────────────────\n';

    if (task.board) {
      body += `Board: ${task.board.nev}\n`;
    }

    if (task.prioritas) {
      const priorityMap: Record<string, string> = {
        LOW: 'Alacsony',
        MEDIUM: 'Közepes',
        HIGH: 'Magas',
        URGENT: 'Sürgős',
      };
      body += `Prioritás: ${priorityMap[task.prioritas] || task.prioritas}\n`;
    }

    if (task.hataridoDatum) {
      const deadline = new Date(task.hataridoDatum);
      body += `Határidő: ${deadline.toLocaleDateString('hu-HU')}\n`;
    }

    if (task.createdBy) {
      body += `Létrehozta: ${task.createdBy.nev}\n`;
    }

    body += '───────────────────────────────────────\n\n';

    // Footer
    body += 'Kérjük, hogy tekintse át a feladatot a rendszerben.\n\n';
    body += 'Üdvözlettel,\n';
    body += task.createdBy?.nev || 'Mbit ERP Rendszer';

    return body;
  }
}

