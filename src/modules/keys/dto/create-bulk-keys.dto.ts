import { IsString, IsOptional, IsInt, IsEnum, Min, IsUUID, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { KeyStatus } from '@prisma/client';

export class CreateBulkKeysDto {
  @IsUUID('4', { message: 'productId must be a valid UUID' })
  productId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true, message: 'Each activation code must be a string' })
  activationCodes: string[];

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
} 