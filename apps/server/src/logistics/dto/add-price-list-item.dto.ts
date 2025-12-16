import { IsString, IsUUID, IsNumber, IsOptional, Min } from 'class-validator';

export class AddPriceListItemDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(0)
  ar: number;

  @IsOptional()
  @IsString()
  valuta?: string; // Default: 'HUF'
}

