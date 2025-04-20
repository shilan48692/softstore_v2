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
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        isActive: boolean;
        chatLink: string | null;
        fullName: string;
        loginIPs: string[];
        note: string | null;
        otpLogin: import(".prisma/client").$Enums.OtpType;
        otpPayment: import(".prisma/client").$Enums.OtpType;
        phone: string | null;
        receiveNewsletter: boolean;
        totalPaid: number;
        totalProfit: number;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        picture: string | null;
        googleId: string | null;
    }>;
}
