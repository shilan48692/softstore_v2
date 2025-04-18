import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { OrderStatus } from './enums/order-status.enum';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto): Promise<{
        id: string;
        totalProfit: number;
        updatedAt: Date;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
    }>;
    findAll(params: {
        skip?: number;
        take?: number;
        where?: {
            userId?: string;
            status?: OrderStatus;
            startDate?: Date;
            endDate?: Date;
        };
    }): Promise<{
        items: ({
            user: {
                id: string;
                fullName: string;
                username: string;
                email: string;
                phone: string | null;
                password: string;
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
            };
            statusHistory: {
                id: string;
                note: string | null;
                status: import(".prisma/client").$Enums.OrderStatus;
                orderId: string;
                changedAt: Date;
                updatedBy: string;
            }[];
        } & {
            id: string;
            totalProfit: number;
            updatedAt: Date;
            userId: string | null;
            userEmail: string;
            productName: string;
            paymentMethod: string;
            totalSellPrice: number;
            totalCostPrice: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            purchasedAt: Date;
        })[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            fullName: string;
            username: string;
            email: string;
            phone: string | null;
            password: string;
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
        };
        statusHistory: {
            id: string;
            note: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            changedAt: Date;
            updatedBy: string;
        }[];
    } & {
        id: string;
        totalProfit: number;
        updatedAt: Date;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<{
        id: string;
        totalProfit: number;
        updatedAt: Date;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        totalProfit: number;
        updatedAt: Date;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
    }>;
    search(findOrdersDto: FindOrdersDto): Promise<{
        data: ({
            user: {
                id: string;
                fullName: string;
                username: string;
                email: string;
                phone: string | null;
                password: string;
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
            };
            statusHistory: {
                id: string;
                note: string | null;
                status: import(".prisma/client").$Enums.OrderStatus;
                orderId: string;
                changedAt: Date;
                updatedBy: string;
            }[];
        } & {
            id: string;
            totalProfit: number;
            updatedAt: Date;
            userId: string | null;
            userEmail: string;
            productName: string;
            paymentMethod: string;
            totalSellPrice: number;
            totalCostPrice: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            purchasedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByUserId(userId: string): Promise<({
        user: {
            id: string;
            fullName: string;
            username: string;
            email: string;
            phone: string | null;
            password: string;
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
        };
        statusHistory: {
            id: string;
            note: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            changedAt: Date;
            updatedBy: string;
        }[];
    } & {
        id: string;
        totalProfit: number;
        updatedAt: Date;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
    })[]>;
    findByUserEmail(userEmail: string): Promise<({
        user: {
            id: string;
            fullName: string;
            username: string;
            email: string;
            phone: string | null;
            password: string;
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
        };
        statusHistory: {
            id: string;
            note: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            changedAt: Date;
            updatedBy: string;
        }[];
    } & {
        id: string;
        totalProfit: number;
        updatedAt: Date;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
    })[]>;
    updateStatus(id: string, status: OrderStatus, updatedBy: string, note?: string): Promise<{
        user: {
            id: string;
            fullName: string;
            username: string;
            email: string;
            phone: string | null;
            password: string;
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
        };
        statusHistory: {
            id: string;
            note: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            changedAt: Date;
            updatedBy: string;
        }[];
    } & {
        id: string;
        totalProfit: number;
        updatedAt: Date;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
    }>;
}
