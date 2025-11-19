import { IsString, IsUUID, IsOptional, IsArray, IsNumber, Min, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(0.01)
  mennyiseg: number;

  @IsNumber()
  @Min(0)
  egysegAr: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  kedvezmeny?: number;
}

export class CreateOrderDto {
  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsUUID()
  quoteId?: string;

  @IsOptional()
  @IsDateString()
  szallitasiDatum?: string;

  @IsOptional()
  @IsString()
  megjegyzesek?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

