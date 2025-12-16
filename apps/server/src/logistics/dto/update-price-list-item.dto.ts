import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class UpdatePriceListItemDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  ar?: number;

  @IsOptional()
  @IsString()
  valuta?: string;
}

