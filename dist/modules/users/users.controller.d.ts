import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: string;
        fullName: string;
        username: string;
        email: string;
        phone: string;
        receiveNewsletter: boolean;
        isActive: boolean;
        otpPayment: import(".prisma/client").$Enums.OtpType;
        otpLogin: import(".prisma/client").$Enums.OtpType;
        totalPaid: number;
        totalProfit: number;
        note: string;
        chatLink: string;
        loginIPs: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
}
