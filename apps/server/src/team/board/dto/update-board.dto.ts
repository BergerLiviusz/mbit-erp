import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  nev?: string;

  @IsOptional()
  @IsString()
  leiras?: string;

  @IsOptional()
  @IsString()
  szin?: string;

  @IsOptional()
  @IsBoolean()
  aktiv?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

