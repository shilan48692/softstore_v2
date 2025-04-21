import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  @IsNotEmpty({ message: 'Status cannot be empty' })
  status: OrderStatus;

  // Assuming updatedBy is an ID or identifier string
  @IsString()
  @IsNotEmpty({ message: 'UpdatedBy cannot be empty' })
  updatedBy: string; 

  @IsOptional()
  @IsString()
  note?: string;
} 