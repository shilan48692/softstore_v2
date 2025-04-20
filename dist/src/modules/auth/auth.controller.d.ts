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
