import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsNumber, IsBoolean, IsString, IsArray, IsDateString, IsEnum } from 'class-validator';

// Define the enum locally or import from a shared location
export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  gameCode?: string;

  @IsOptional()
  @IsString()
  analyticsCode?: string;

  @IsOptional()
  @IsBoolean()
  requirePhone?: boolean;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  warrantyPolicy?: string;

  @IsOptional()
  @IsString()
  faq?: string;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  mainKeyword?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  secondaryKeywords?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  popupEnabled?: boolean;

  @IsOptional()
  @IsString()
  popupTitle?: string;

  @IsOptional()
  @IsString()
  popupContent?: string;

  @IsOptional()
  @IsString()
  guideUrl?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  originalPrice?: number;

  @IsOptional()
  @IsNumber()
  importPrice?: number;

  @IsOptional()
  @IsString()
  importSource?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsBoolean()
  autoSyncQuantityWithKey?: boolean;

  @IsOptional()
  @IsNumber()
  minPerOrder?: number;

  @IsOptional()
  @IsNumber()
  maxPerOrder?: number | null;

  @IsOptional()
  @IsBoolean()
  autoDeliverKey?: boolean;

  @IsOptional()
  @IsBoolean()
  showMoreDescription?: boolean;

  @IsOptional()
  @IsBoolean()
  promotionEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  lowStockWarning?: number;

  @IsOptional()
  @IsString()
  gameKeyText?: string;

  @IsOptional()
  @IsString()
  guideText?: string;

  @IsOptional()
  @IsNumber()
  expiryDays?: number;

  @IsOptional()
  @IsBoolean()
  allowComment?: boolean;

  @IsOptional()
  @IsNumber()
  promotionPrice?: number | null;

  @IsOptional()
  @IsDateString()
  promotionStartDate?: string | null;

  @IsOptional()
  @IsDateString()
  promotionEndDate?: string | null;

  @IsOptional()
  @IsNumber()
  promotionQuantity?: number | null;

  @IsOptional()
  @IsString()
  categoryId?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalRequirementIds?: string[];

  @IsOptional()
  @IsString()
  customHeadCode?: string;

  @IsOptional()
  @IsString()
  customBodyCode?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
} 