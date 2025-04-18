import { IsString, IsOptional, IsInt, IsEnum, Min } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  userEmail: string;

  @IsString()
  productName: string;

  @IsString()
  paymentMethod: string;

  @IsInt()
  @Min(0)
  totalSellPrice: number;

  @IsInt()
  @Min(0)
  totalCostPrice: number;

  @IsInt()
  @Min(0)
  totalProfit: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus = OrderStatus.PENDING;
} 