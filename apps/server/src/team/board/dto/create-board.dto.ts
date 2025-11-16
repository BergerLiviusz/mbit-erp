import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  nev: string;

  @IsOptional()
  @IsString()
  leiras?: string;

  @IsOptional()
  @IsString()
  szin?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

