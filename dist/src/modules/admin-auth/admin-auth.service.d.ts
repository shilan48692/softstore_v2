import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminRole } from '../admin/admin.service';
interface Admin {
    id: number;
    email: string;
    password?: string | null;
    name: string | null;
    role: AdminRole;
    googleId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AdminAuthService {
    private prisma;
    private jwtService;
    private blacklistedTokens;
    constructor(prisma: PrismaService, jwtService: JwtService);
    isTokenBlacklisted(token: string): boolean;
    addToBlacklist(token: string): Promise<void>;
    findAdminByEmail(email: string): Promise<Admin | null>;
    createToken(payload: {
        sub: number;
        email: string;
        role: string;
    }): Promise<string>;
}
export {};
