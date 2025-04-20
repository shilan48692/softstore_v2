import { AdminService } from './admin.service';
import { AdminRole } from '@prisma/client';
export declare class AdminManagementController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllAdmins(): Promise<{
        id: number;
        email: string;
        password?: string | null;
        name?: string | null;
        role: import("./admin.service").AdminRole;
        googleId?: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createAdmin(data: {
        email: string;
        name: string;
        password: string;
        role?: AdminRole;
    }): Promise<{
        id: number;
        email: string;
        password?: string | null;
        name?: string | null;
        role: import("./admin.service").AdminRole;
        googleId?: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAdmin(id: number): Promise<{
        id: number;
        email: string;
        password?: string | null;
        name?: string | null;
        role: import("./admin.service").AdminRole;
        googleId?: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAdminRole(id: number, data: {
        role: AdminRole;
    }): Promise<{
        id: number;
        email: string;
        password?: string | null;
        name?: string | null;
        role: import("./admin.service").AdminRole;
        googleId?: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
