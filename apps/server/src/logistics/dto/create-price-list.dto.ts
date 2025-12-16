import { IsString, IsUUID, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreatePriceListDto {
  @IsUUID()
  supplierId: string;

  @IsString()
  nev: string;

  @IsDateString()
  ervenyessegKezdet: string; // ISO date string

  @IsOptional()
  @IsDateString()
  ervenyessegVeg?: string; // ISO date string

  @IsOptional()
  @IsBoolean()
  aktiv?: boolean;
}

