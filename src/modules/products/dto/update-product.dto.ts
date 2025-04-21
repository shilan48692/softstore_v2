import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ProductStatus } from '../enums/product-status.enum';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  name?: string;

  slug?: string;

  gameCode?: string;

  analyticsCode?: string;

  requirePhone?: boolean;

  shortDescription?: string;

  description?: string;

  warrantyPolicy?: string;

  faq?: string;

  metaTitle?: string;

  metaDescription?: string;

  mainKeyword?: string;

  secondaryKeywords?: string[];

  tags?: string[];

  popupEnabled?: boolean;

  popupTitle?: string;

  popupContent?: string;

  guideUrl?: string;

  imageUrl?: string;

  originalPrice?: number;

  importPrice?: number;

  importSource?: string;

  quantity?: number;

  autoSyncQuantityWithKey?: boolean;

  minPerOrder?: number;

  maxPerOrder?: number | null;

  autoDeliverKey?: boolean;

  showMoreDescription?: boolean;

  promotionEnabled?: boolean;

  lowStockWarning?: number;

  gameKeyText?: string;

  guideText?: string;

  expiryDays?: number;

  allowComment?: boolean;

  promotionPrice?: number | null;

  promotionStartDate?: string | null;

  promotionEndDate?: string | null;

  promotionQuantity?: number | null;

  categoryId?: string | null;

  additionalRequirementIds?: string[];

  customHeadCode?: string;

  customBodyCode?: string;

  status?: ProductStatus;
} 