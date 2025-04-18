import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from './enums/role.enum';
import { CreateAdminDto } from './dto/create-admin.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private blacklistedTokens;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            username: string;
            fullName: string;
            role: Role;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            username: string;
            fullName: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    refreshToken(token: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            username: string;
            fullName: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    isTokenBlacklisted(token: string): boolean;
    createAdmin(createAdminDto: CreateAdminDto): Promise<{
        id: string;
        fullName: string;
        username: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        receiveNewsletter: boolean;
        isActive: boolean;
        otpPayment: import(".prisma/client").$Enums.OtpType;
        otpLogin: import(".prisma/client").$Enums.OtpType;
        totalPaid: number;
        totalProfit: number;
        note: string | null;
        chatLink: string | null;
        loginIPs: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
}
