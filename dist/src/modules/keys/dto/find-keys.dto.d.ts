import { KeyStatus } from '@prisma/client';
export declare class FindKeysDto {
    productName?: string;
    activationCode?: string;
    orderId?: string;
    status?: KeyStatus;
    note?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    usedAtFrom?: string;
    usedAtTo?: string;
    minCost?: number;
    maxCost?: number;
    page?: number;
    limit?: number;
}
