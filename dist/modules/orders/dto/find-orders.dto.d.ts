import { OrderStatus } from '../enums/order-status.enum';
export declare class FindOrdersDto {
    userId?: string;
    userEmail?: string;
    productName?: string;
    paymentMethod?: string;
    status?: OrderStatus;
    purchasedAtFrom?: string;
    purchasedAtTo?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}
