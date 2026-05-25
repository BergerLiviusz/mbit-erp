import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ImportRow {
  azonosito: string;
  nev: string;
  tipus?: string;
  adoszam?: string;
  szamlazasiCim?: string;
  szallitasiCim?: string;
  cim?: string;
  email?: string;
  telefon?: string;
  iparag?: string;
  regio?: string;
  kapcsolatNev?: string;
  kapcsolatEmail?: string;
  kapcsolatTelefon?: string;
}

export interface ImportPreviewResult {
  valid: ImportRow[];
  duplicates: Array<{ row: ImportRow; existingId: string; action: 'update' | 'skip' }>;
  errors: Array<{ row: number; message: string }>;
}

@Injectable()
export class AccountImportService {
  constructor(private prisma: PrismaService) {}

  parseCsv(content: string): ImportRow[] {
    const lines = content.replace(/^\ufeff/, '').split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return [];

    const headers = this.splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
    const rows: ImportRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cells = this.splitCsvLine(lines[i]);
      const map: Record<string, string> = {};
      headers.forEach((h, idx) => {
        map[h] = (cells[idx] || '').trim();
      });
      if (!map.azonosito && !map.nev) continue;
      rows.push({
        azonosito: map.azonosito || map['egyedi azonosító'] || `IMP-${i}`,
        nev: map.nev || map['ügyfél neve'] || map.name || '',
        tipus: map.tipus || 'vallalat',
        adoszam: map.adoszam,
        szamlazasiCim: map.szamlazasicim || map['számlázási cím'],
        szallitasiCim: map.szallitasicim || map['szállítási cím'],
        cim: map.cim,
        email: map.email,
        telefon: map.telefon,
        iparag: map.iparag,
        regio: map.regio,
        kapcsolatNev: map.kapcsolatnev || map['kapcsolattartó'],
        kapcsolatEmail: map.kapcsolatemail,
        kapcsolatTelefon: map.kapcsolattelefon,
      });
    }
    return rows;
  }

  async preview(rows: ImportRow[]): Promise<ImportPreviewResult> {
    const valid: ImportRow[] = [];
    const duplicates: ImportPreviewResult['duplicates'] = [];
    const errors: ImportPreviewResult['errors'] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.azonosito || !row.nev) {
        errors.push({ row: i + 1, message: 'azonosito és nev kötelező' });
        continue;
      }
      const existing = await this.prisma.account.findUnique({
        where: { azonosito: row.azonosito },
      });
      if (existing) {
        duplicates.push({ row, existingId: existing.id, action: 'update' });
      } else {
        valid.push(row);
      }
    }

    return { valid, duplicates, errors };
  }

  async importRows(
    rows: ImportRow[],
    options: { updateDuplicates?: boolean } = {},
  ): Promise<{ created: number; updated: number; skipped: number }> {
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of rows) {
      const existing = await this.prisma.account.findUnique({
        where: { azonosito: row.azonosito },
      });

      const accountData = {
        nev: row.nev,
        tipus: row.tipus || 'vallalat',
        adoszam: row.adoszam,
        cim: row.cim || row.szamlazasiCim,
        szamlazasiCim: row.szamlazasiCim || row.cim,
        szallitasiCim: row.szallitasiCim || row.cim,
        email: row.email,
        telefon: row.telefon,
        iparag: row.iparag,
        regio: row.regio,
      };

      if (existing) {
        if (!options.updateDuplicates) {
          skipped++;
          continue;
        }
        await this.prisma.account.update({
          where: { id: existing.id },
          data: accountData,
        });
        updated++;
      } else {
        const account = await this.prisma.account.create({
          data: { azonosito: row.azonosito, ...accountData },
        });
        if (row.kapcsolatNev) {
          await this.prisma.contact.create({
            data: {
              accountId: account.id,
              nev: row.kapcsolatNev,
              email: row.kapcsolatEmail,
              telefon: row.kapcsolatTelefon,
              elsodleges: true,
            },
          });
        }
        created++;
      }
    }

    return { created, updated, skipped };
  }

  private splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if ((char === ',' || char === ';') && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }
}
