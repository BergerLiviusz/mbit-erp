import { IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';

export class UpdatePriceListDto {
  @IsOptional()
  @IsString()
  nev?: string;

  @IsOptional()
  @IsDateString()
  ervenyessegKezdet?: string; // ISO date string

  @IsOptional()
  @IsDateString()
  ervenyessegVeg?: string; // ISO date string

  @IsOptional()
  @IsBoolean()
  aktiv?: boolean;
}

