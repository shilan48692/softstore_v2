import { IsOptional, IsString, IsEnum, IsNumber, IsUUID, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from './update-product.dto'; // Reuse enum from Update DTO

export class AdminFindProductsDto {
  @IsOptional()
  @IsString()
  search?: string; // General search term (name, slug, gameCode etc.)

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @Type(() => Number) // Transform query param string to number
  @IsNumber()
  @Min(0)
  minQuantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxQuantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number; // Assuming this filters on originalPrice

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number; // Assuming this filters on originalPrice

  // Pagination and Sorting (Example)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'; // Default sort field

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC'; // Default sort order
} 