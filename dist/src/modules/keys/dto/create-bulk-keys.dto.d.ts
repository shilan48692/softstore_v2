import { KeyStatus } from '@prisma/client';
export declare class CreateBulkKeysDto {
    productId: string;
    activationCodes: string[];
    note?: string;
    cost?: number;
    status?: KeyStatus;
}
