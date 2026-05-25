import { AccountImportService } from './account-import.service';

describe('AccountImportService', () => {
  const service = new AccountImportService({ account: { findUnique: jest.fn() } } as any);

  it('parses CSV with headers', () => {
    const csv = 'azonosito,nev,email\nU-1,Test Kft.,test@test.hu';
    const rows = service.parseCsv(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0].azonosito).toBe('U-1');
    expect(rows[0].nev).toBe('Test Kft.');
  });

  it('preview marks duplicates', async () => {
    const prisma = {
      account: {
        findUnique: jest
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({ id: 'existing' }),
      },
    };
    const svc = new AccountImportService(prisma as any);
    const preview = await svc.preview([
      { azonosito: 'NEW-1', nev: 'A' },
      { azonosito: 'DUP-1', nev: 'B' },
    ]);
    expect(preview.valid).toHaveLength(1);
    expect(preview.duplicates).toHaveLength(1);
  });
});
