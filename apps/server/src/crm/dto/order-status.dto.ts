import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class OrderStatusDto {
  @IsEnum(OrderStatus)
  allapot: OrderStatus;

  @IsOptional()
  @IsString()
  megjegyzesek?: string;
}

