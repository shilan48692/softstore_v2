import { KeyStatus } from '../enums/key-status.enum';
export declare class CreateKeyDto {
    activationCode: string;
    note?: string;
    cost?: number;
    status?: KeyStatus;
    productId: string;
    orderId?: string;
    userId?: string;
    userEmail?: string;
}
