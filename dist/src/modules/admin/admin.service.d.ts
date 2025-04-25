import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
export declare const AdminRole: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly ADMIN: "ADMIN";
    readonly MODERATOR: "MODERATOR";
};
export type AdminRole = typeof AdminRole[keyof typeof AdminRole];
type Admin = {
    id: number;
    email: string;
    password?: string | null;
    name?: string | null;
    role: AdminRole;
    googleId?: string | null;
    createdAt: Date;
    updatedAt: Date;
};
export declare class AdminService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: AdminLoginDto): Promise<{
        token: string;
        admin: {
            id: number;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.AdminRole;
        };
    }>;
    validateAdminEmail(email: string): Promise<boolean>;
    createAdmin(data: {
        email: string;
        name: string;
        password?: string;
        googleId?: string;
        role?: AdminRole;
    }): Promise<Admin>;
    findAdminByEmail(email: string): Promise<Admin | null>;
    findAdminByGoogleId(googleId: string): Promise<Admin | null>;
    getAdminRole(adminId: string): Promise<AdminRole>;
    isSuperAdmin(adminId: string): Promise<boolean>;
    isAdmin(adminId: string): Promise<boolean>;
    isModerator(adminId: string): Promise<boolean>;
    countAdmins(): Promise<number>;
    findAll(params?: {
        select?: Record<string, any>;
        where?: Record<string, any>;
        orderBy?: Record<string, any>;
    }): Promise<Admin[]>;
    findOne(params: {
        select?: Record<string, any>;
        where: {
            id: number;
        } | {
            email: string;
        } | {
            googleId: string;
        };
    }): Promise<Admin>;
    update(params: {
        where: {
            id: number;
        } | {
            email: string;
        } | {
            googleId: string;
        };
        data: Partial<Admin>;
        select?: Record<string, any>;
    }): Promise<Admin>;
}
export {};
