import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';
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
    createAdmin(createAdminDto: CreateAdminDto): Promise<{
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
    updateAdminRole(id: number, updateAdminRoleDto: UpdateAdminRoleDto): Promise<{
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
