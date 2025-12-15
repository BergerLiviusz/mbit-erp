export class CreatePriceListDto {
  supplierId: string;
  nev: string;
  ervenyessegKezdet: string; // ISO date string
  ervenyessegVeg?: string; // ISO date string
  aktiv?: boolean;
}

