import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { OrderStatus } from './enums/order-status.enum';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalProfit: number;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        purchasedAt: Date;
    }>;
    findAll(query: FindOrdersDto): Promise<{
        items: ({
            user: {
                id: string;
                email: string;
                password: string;
                role: import(".prisma/client").$Enums.Role;
                googleId: string | null;
                createdAt: Date;
                updatedAt: Date;
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
            totalProfit: number;
            userId: string | null;
            userEmail: string;
            productName: string;
            paymentMethod: string;
            totalSellPrice: number;
            totalCostPrice: number;
            purchasedAt: Date;
        })[];
        total: number;
    }>;
    search(findOrdersDto: FindOrdersDto): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                password: string;
                role: import(".prisma/client").$Enums.Role;
                googleId: string | null;
                createdAt: Date;
                updatedAt: Date;
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
            totalProfit: number;
            userId: string | null;
            userEmail: string;
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
        totalProfit: number;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        purchasedAt: Date;
    }>;
    findByUserId(userId: string): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            googleId: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        totalProfit: number;
        userId: string | null;
        userEmail: string;
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
        totalProfit: number;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        purchasedAt: Date;
    })[]>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalProfit: number;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        purchasedAt: Date;
    }>;
    updateStatus(id: string, status: OrderStatus, updatedBy: string, note?: string): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            googleId: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        totalProfit: number;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        purchasedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalProfit: number;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        purchasedAt: Date;
    }>;
}
