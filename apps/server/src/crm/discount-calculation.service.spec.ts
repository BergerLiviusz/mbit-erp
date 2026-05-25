import { DiscountCalculationService } from './discount-calculation.service';

describe('DiscountCalculationService', () => {
  const service = new DiscountCalculationService();

  it('applies quantity discount above threshold', () => {
    const result = service.applyRules(
      [{ itemId: 'i1', mennyiseg: 15, egysegAr: 100 }],
      [
        {
          id: 'r1',
          tipus: 'MENNYISEGI',
          ertek: 10,
          mennyisegiHatar: 10,
          prioritas: 1,
        },
      ],
    );
    expect(result.lines[0].osszeg).toBe(15 * 90);
  });

  it('applies custom price rule', () => {
    const result = service.applyRules(
      [{ itemId: 'i1', mennyiseg: 2, egysegAr: 100 }],
      [{ id: 'r2', tipus: 'EGYEDI_AR', ertek: 50, prioritas: 1, itemId: 'i1' }],
    );
    expect(result.lines[0].egysegAr).toBe(50);
    expect(result.lines[0].osszeg).toBe(100);
  });

  it('skips inactive period discount outside range', () => {
    const result = service.applyRules(
      [{ itemId: 'i1', mennyiseg: 1, egysegAr: 100 }],
      [
        {
          id: 'r3',
          tipus: 'IDOSZAKI',
          ertek: 20,
          kezdetDatum: new Date('2099-01-01'),
          vegesDatum: new Date('2099-12-31'),
          prioritas: 1,
        },
      ],
      undefined,
      new Date('2025-01-01'),
    );
    expect(result.lines[0].osszeg).toBe(100);
  });
});
