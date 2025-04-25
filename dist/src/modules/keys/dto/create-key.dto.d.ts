import { KeyStatus } from '@prisma/client';
export declare class CreateKeyDto {
    activationCode: string;
    note?: string;
    cost?: number;
    status?: KeyStatus;
    productId: string;
    importSourceId?: string;
    orderId?: string;
    userId?: string;
    userEmail?: string;
}
