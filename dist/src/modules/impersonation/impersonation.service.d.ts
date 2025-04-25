import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class ImpersonationService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    impersonateUser(adminId: string, userId: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            username: string;
            fullName: string;
        };
    }>;
    validateImpersonationToken(token: string): Promise<{
        userId: string;
        email: string;
        username: string;
        isImpersonated: boolean;
        impersonatedBy: any;
    }>;
    endImpersonation(token: string): Promise<{
        success: boolean;
    }>;
}
