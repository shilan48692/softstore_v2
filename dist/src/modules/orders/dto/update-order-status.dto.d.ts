import { OrderStatus } from '../enums/order-status.enum';
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
    updatedBy: string;
    note?: string;
}
