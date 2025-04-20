import { AdminAuthService } from './admin-auth.service';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminAuthController {
    private readonly adminAuthService;
    private readonly prisma;
    private googleClient;
    constructor(adminAuthService: AdminAuthService, prisma: PrismaService);
    googleLogin(code: string): Promise<{
        accessToken: string;
        admin: {
            id: number;
            email: string;
            role: import(".prisma/client").$Enums.AdminRole;
        };
    }>;
}
