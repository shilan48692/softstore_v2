import { IsString, IsOptional, IsInt, IsEnum, Min, IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsEmail({}, { message: 'Invalid user email format' })
  @IsNotEmpty({ message: 'User email cannot be empty' })
  userEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'Product name cannot be empty' })
  productName: string;

  @IsString()
  @IsNotEmpty({ message: 'Payment method cannot be empty' })
  paymentMethod: string;

  @IsInt({ message: 'Total sell price must be an integer' })
  @Min(0)
  totalSellPrice: number;

  @IsInt({ message: 'Total cost price must be an integer' })
  @Min(0)
  totalCostPrice: number;

  @IsInt({ message: 'Total profit must be an integer' })
  @Min(0)
  totalProfit: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus = OrderStatus.PENDING;
} 