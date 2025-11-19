import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class LinkItemSupplierDto {
  @IsString()
  supplierId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  beszerzesiAr?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minMennyiseg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  szallitasiIdo?: number;

  @IsOptional()
  @IsString()
  megjegyzesek?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

