import { AdminRole } from '@prisma/client';
export declare class CreateAdminDto {
    email: string;
    name: string;
    password: string;
    role?: AdminRole;
}
