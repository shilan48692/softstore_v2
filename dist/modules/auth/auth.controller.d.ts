import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            username: string;
            fullName: string;
            role: import("./enums/role.enum").Role;
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
    refresh(req: any): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            username: string;
            fullName: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
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
