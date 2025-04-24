import { AdminAuthService } from './admin-auth.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export declare class AdminAuthController {
    private adminAuthService;
    private configService;
    private googleClient;
    private readonly logger;
    constructor(adminAuthService: AdminAuthService, configService: ConfigService);
    googleLogin(code: string, response: Response): Promise<{
        admin: {
            id: number;
            email: string;
            name: string | null;
            role: import(".prisma/client").$Enums.AdminRole;
            googleId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
