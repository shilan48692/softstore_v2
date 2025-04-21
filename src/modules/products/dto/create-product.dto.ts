import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsArray, IsDateString, IsUrl, IsEnum } from 'class-validator';
import { ProductStatus } from '../enums/product-status.enum';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  originalPrice: number;

  @IsNumber()
  @IsOptional()
  importPrice?: number;

  @IsString()
  @IsOptional()
  importSource?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  gameCode: string;

  @IsString()
  analyticsCode: string;

  @IsBoolean()
  @IsOptional()
  requirePhone?: boolean;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  warrantyPolicy?: string;

  @IsString()
  @IsOptional()
  faq?: string;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  mainKeyword?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  secondaryKeywords?: string[];

  @IsBoolean()
  @IsOptional()
  popupEnabled?: boolean;

  @IsString()
  @IsOptional()
  popupTitle?: string;

  @IsString()
  @IsOptional()
  popupContent?: string;

  @IsString()
  @IsOptional()
  guideUrl?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  autoSyncQuantityWithKey?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minPerOrder?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPerOrder?: number;

  @IsBoolean()
  @IsOptional()
  autoDeliverKey?: boolean;

  @IsBoolean()
  @IsOptional()
  showMoreDescription?: boolean;

  @IsBoolean()
  @IsOptional()
  promotionEnabled?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  lowStockWarning?: number;

  @IsString()
  @IsOptional()
  gameKeyText?: string;

  @IsString()
  @IsOptional()
  guideText?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  expiryDays?: number;

  @IsBoolean()
  @IsOptional()
  allowComment?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  promotionPrice?: number;

  @IsDateString()
  @IsOptional()
  promotionStartDate?: string;

  @IsDateString()
  @IsOptional()
  promotionEndDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  promotionQuantity?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  additionalRequirementIds?: string[];

  @IsString()
  @IsOptional()
  customHeadCode?: string;

  @IsString()
  @IsOptional()
  customBodyCode?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
} 