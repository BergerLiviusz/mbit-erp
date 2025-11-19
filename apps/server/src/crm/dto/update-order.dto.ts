import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional, IsEnum, IsDateString, IsString } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsEnum(OrderStatus)
  allapot?: OrderStatus;

  @IsOptional()
  @IsDateString()
  szallitasiDatum?: string;

  @IsOptional()
  @IsDateString()
  teljesitesiDatum?: string;

  @IsOptional()
  @IsString()
  megjegyzesek?: string;
}

