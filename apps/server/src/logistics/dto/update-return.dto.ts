import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { ReturnOk } from './create-return.dto';

export class UpdateReturnDto {
  @IsOptional()
  @IsString()
  itemId?: string;

  @IsOptional()
  @IsString()
  warehouseId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  mennyiseg?: number;

  @IsOptional()
  @IsEnum(ReturnOk)
  ok?: ReturnOk;

  @IsOptional()
  @IsDateString()
  visszaruDatum?: string;

  @IsOptional()
  @IsString()
  megjegyzesek?: string;
}

