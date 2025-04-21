import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Admin } from '@prisma/client';
export declare class AdminAuthService {
    private prisma;
    private jwtService;
    private blacklistedTokens;
    constructor(prisma: PrismaService, jwtService: JwtService);
    isTokenBlacklisted(token: string): boolean;
    addToBlacklist(token: string): Promise<void>;
    findAdminByEmail(email: string): Promise<Admin | null>;
    updateAdminGoogleId(adminId: number, googleId: string): Promise<Admin>;
    createToken(payload: {
        sub: number;
        email: string;
        role: string;
    }): Promise<string>;
}
