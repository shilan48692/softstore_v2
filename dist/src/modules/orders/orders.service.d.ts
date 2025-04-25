import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { OrderStatus } from './enums/order-status.enum';
import { Prisma } from '@prisma/client';
export declare class OrdersService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        userEmail: string;
        totalProfit: number;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        purchasedAt: Date;
    }>;
    findAll(query: FindOrdersDto): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                fullName: string;
            };
            statusHistory: {
                id: string;
                status: import(".prisma/client").$Enums.OrderStatus;
                note: string | null;
                orderId: string;
                changedAt: Date;
                updatedBy: string;
            }[];
        } & {
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            userId: string | null;
            userEmail: string;
            totalProfit: number;
            productName: string;
            paymentMethod: string;
            totalSellPrice: number;
            totalCostPrice: number;
            purchasedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            googleId: string | null;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            isActive: boolean;
            chatLink: string | null;
            fullName: string;
            loginIPs: string[];
            otpLogin: import(".prisma/client").$Enums.OtpType;
            otpPayment: import(".prisma/client").$Enums.OtpType;
            phone: string | null;
            receiveNewsletter: boolean;
            totalPaid: number;
            totalProfit: number;
            username: string;
            picture: string | null;
        };
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            note: string | null;
            orderId: string;
            changedAt: Date;
            updatedBy: string;
        }[];
    } & {
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        userEmail: string;
        totalProfit: number;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        purchasedAt: Date;
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        userEmail: string;
        totalProfit: number;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        purchasedAt: Date;
    }>;
    remove(id: string): Promise<Prisma.OrderGetPayload<{}>>;
    findByUserId(userId: string): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            googleId: string | null;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            isActive: boolean;
            chatLink: string | null;
            fullName: string;
            loginIPs: string[];
            otpLogin: import(".prisma/client").$Enums.OtpType;
            otpPayment: import(".prisma/client").$Enums.OtpType;
            phone: string | null;
            receiveNewsletter: boolean;
            totalPaid: number;
            totalProfit: number;
            username: string;
            picture: string | null;
        };
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            note: string | null;
            orderId: string;
            changedAt: Date;
            updatedBy: string;
        }[];
    } & {
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        userEmail: string;
        totalProfit: number;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        purchasedAt: Date;
    })[]>;
    findByUserEmail(userEmail: string): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            googleId: string | null;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            isActive: boolean;
            chatLink: string | null;
            fullName: string;
            loginIPs: string[];
            otpLogin: import(".prisma/client").$Enums.OtpType;
            otpPayment: import(".prisma/client").$Enums.OtpType;
            phone: string | null;
            receiveNewsletter: boolean;
            totalPaid: number;
            totalProfit: number;
            username: string;
            picture: string | null;
        };
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            note: string | null;
            orderId: string;
            changedAt: Date;
            updatedBy: string;
        }[];
    } & {
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        userEmail: string;
        totalProfit: number;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        purchasedAt: Date;
    })[]>;
    updateStatus(id: string, status: OrderStatus, updatedBy: string, note?: string): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            googleId: string | null;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            isActive: boolean;
            chatLink: string | null;
            fullName: string;
            loginIPs: string[];
            otpLogin: import(".prisma/client").$Enums.OtpType;
            otpPayment: import(".prisma/client").$Enums.OtpType;
            phone: string | null;
            receiveNewsletter: boolean;
            totalPaid: number;
            totalProfit: number;
            username: string;
            picture: string | null;
        };
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            note: string | null;
            orderId: string;
            changedAt: Date;
            updatedBy: string;
        }[];
    } & {
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        userEmail: string;
        totalProfit: number;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        purchasedAt: Date;
    }>;
}
