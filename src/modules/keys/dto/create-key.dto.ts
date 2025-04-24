import { IsString, IsOptional, IsInt, IsEnum, Min } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateKeyDto {
  @IsString()
  activationCode: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  cost?: number;

  @IsOptional()
  @IsEnum(Prisma.KeyStatus)
  status?: Prisma.KeyStatus;

  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  userEmail?: string;
} 