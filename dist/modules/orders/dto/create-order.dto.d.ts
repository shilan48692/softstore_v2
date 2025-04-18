import { OrderStatus } from '../enums/order-status.enum';
export declare class CreateOrderDto {
    userId?: string;
    userEmail: string;
    productName: string;
    paymentMethod: string;
    totalSellPrice: number;
    totalCostPrice: number;
    totalProfit: number;
    status?: OrderStatus;
}
