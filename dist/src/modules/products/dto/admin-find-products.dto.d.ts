import { ProductStatus } from '../enums/product-status.enum';
export declare class AdminFindProductsDto {
    search?: string;
    status?: ProductStatus;
    categoryId?: string;
    minQuantity?: number;
    maxQuantity?: number;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
