import { PrismaService } from '../../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<{
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
