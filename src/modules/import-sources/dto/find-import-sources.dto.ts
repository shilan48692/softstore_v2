import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FindImportSourcesDto {
  @IsOptional()
  @IsString()
  name?: string; // Search by name (contains, case-insensitive)

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
} 