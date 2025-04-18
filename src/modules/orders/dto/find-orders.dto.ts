import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';

export class FindOrdersDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  userEmail?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsDateString()
  purchasedAtFrom?: string;

  @IsOptional()
  @IsDateString()
  purchasedAtTo?: string;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
} 