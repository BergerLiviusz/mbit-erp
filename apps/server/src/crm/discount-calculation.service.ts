import { Injectable } from '@nestjs/common';

export type DiscountType = 'MENNYISEGI' | 'EGYEDI_AR' | 'ERTEKHATAR' | 'IDOSZAKI';

export interface LineInput {
  itemId: string;
  mennyiseg: number;
  egysegAr: number;
  lineKedvezmeny?: number;
}

export interface DiscountRuleInput {
  id: string;
  tipus: DiscountType | string;
  ertek: number;
  mennyisegiHatar?: number | null;
  ertekHatar?: number | null;
  kezdetDatum?: Date | string | null;
  vegesDatum?: Date | string | null;
  prioritas?: number;
  itemId?: string | null;
}

export interface CalculatedLine {
  itemId: string;
  mennyiseg: number;
  egysegAr: number;
  kedvezmeny: number;
  osszeg: number;
  appliedRules: string[];
}

@Injectable()
export class DiscountCalculationService {
  applyRules(
    lines: LineInput[],
    rules: DiscountRuleInput[],
    orderTotalBeforeRules?: number,
    referenceDate: Date = new Date(),
  ): { lines: CalculatedLine[]; osszeg: number; afa: number; vegosszeg: number } {
    const sortedRules = [...rules]
      .filter((r) => this.isRuleActive(r, referenceDate))
      .sort((a, b) => (a.prioritas ?? 100) - (b.prioritas ?? 100));

    const calculatedLines: CalculatedLine[] = lines.map((line) => {
      let unitPrice = line.egysegAr;
      const appliedRules: string[] = [];
      const linePct = line.lineKedvezmeny ?? 0;

      for (const rule of sortedRules) {
        if (rule.itemId && rule.itemId !== line.itemId) continue;

        switch (rule.tipus) {
          case 'MENNYISEGI':
            if (
              rule.mennyisegiHatar != null &&
              line.mennyiseg >= rule.mennyisegiHatar
            ) {
              unitPrice = unitPrice * (1 - rule.ertek / 100);
              appliedRules.push(rule.id);
            }
            break;
          case 'EGYEDI_AR':
            unitPrice = rule.ertek;
            appliedRules.push(rule.id);
            break;
          case 'ERTEKHATAR': {
            const total =
              orderTotalBeforeRules ??
              lines.reduce((s, l) => s + l.mennyiseg * l.egysegAr, 0);
            if (rule.ertekHatar != null && total >= rule.ertekHatar) {
              unitPrice = unitPrice * (1 - rule.ertek / 100);
              appliedRules.push(rule.id);
            }
            break;
          }
          case 'IDOSZAKI':
            unitPrice = unitPrice * (1 - rule.ertek / 100);
            appliedRules.push(rule.id);
            break;
        }
      }

      const kedvezmeny = linePct;
      const osszeg =
        line.mennyiseg * unitPrice * (1 - Math.min(100, Math.max(0, kedvezmeny)) / 100);

      return {
        itemId: line.itemId,
        mennyiseg: line.mennyiseg,
        egysegAr: unitPrice,
        kedvezmeny,
        osszeg,
        appliedRules,
      };
    });

    const osszeg = calculatedLines.reduce((s, l) => s + l.osszeg, 0);
    const afa = osszeg * 0.27;
    const vegosszeg = osszeg + afa;

    return { lines: calculatedLines, osszeg, afa, vegosszeg };
  }

  isRuleActive(rule: DiscountRuleInput, referenceDate: Date): boolean {
    if (rule.tipus === 'IDOSZAKI') {
      const start = rule.kezdetDatum ? new Date(rule.kezdetDatum) : null;
      const end = rule.vegesDatum ? new Date(rule.vegesDatum) : null;
      if (start && referenceDate < start) return false;
      if (end && referenceDate > end) return false;
    }
    return true;
  }
}
