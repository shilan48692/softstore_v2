import { OrderStatus } from '../enums/order-status.enum';
export declare class CreateOrderStatusHistoryDto {
    orderId: string;
    status: OrderStatus;
    note?: string;
    updatedBy: string;
}
