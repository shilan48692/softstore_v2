import { IsString, IsOptional, IsInt, IsEnum, Min, IsUUID } from 'class-validator';
import { Prisma, KeyStatus } from '@prisma/client';

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
  @IsEnum(KeyStatus)
  status?: KeyStatus;

  @IsString()
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  importSourceId?: string;

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