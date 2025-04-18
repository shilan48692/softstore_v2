import { IsString, IsOptional, IsInt, IsEnum, Min } from 'class-validator';
import { KeyStatus } from '../enums/key-status.enum';

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