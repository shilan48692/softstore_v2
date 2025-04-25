import { KeyStatus } from '@prisma/client';
export declare class FindKeysDto {
    productName?: string;
    activationCode?: string;
    orderId?: string;
    status?: KeyStatus;
    createdAtFrom?: string;
    createdAtTo?: string;
    usedAtFrom?: string;
    usedAtTo?: string;
    page?: number;
    limit?: number;
}
