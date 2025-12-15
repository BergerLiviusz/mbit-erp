import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';

export enum ReturnOk {
  HIBAS = 'hibas',
  SERTETT = 'sertett',
  TULCSORDULAS = 'tulcsordulas',
  EGYEB = 'egyeb',
}

export class CreateReturnDto {
  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  purchaseOrderId?: string;

  @IsString()
  itemId: string;

  @IsString()
  warehouseId: string;

  @IsNumber()
  @Min(0.01)
  mennyiseg: number;

  @IsEnum(ReturnOk)
  ok: ReturnOk;

  @IsOptional()
  @IsDateString()
  visszaruDatum?: string;

  @IsOptional()
  @IsString()
  megjegyzesek?: string;
}

