import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto, OrderItemDto } from './create-order.dto';
import { IsOptional, IsEnum, IsDateString, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];
}

