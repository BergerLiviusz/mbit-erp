import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  nev: string;

  @IsOptional()
  @IsString()
  adoszam?: string;

  @IsOptional()
  @IsString()
  cim?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  telefon?: string;

  @IsOptional()
  @IsBoolean()
  aktiv?: boolean;
}

