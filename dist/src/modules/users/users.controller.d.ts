import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        note: string;
        isActive: boolean;
        chatLink: string;
        fullName: string;
        loginIPs: string[];
        otpLogin: import(".prisma/client").$Enums.OtpType;
        otpPayment: import(".prisma/client").$Enums.OtpType;
        phone: string;
        receiveNewsletter: boolean;
        totalPaid: number;
        totalProfit: number;
        username: string;
    }>;
}
