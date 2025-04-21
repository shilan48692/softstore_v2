import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<{
        id: string;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        totalProfit: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
        updatedAt: Date;
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
                changedAt: Date;
                orderId: string;
                updatedBy: string;
            }[];
        } & {
            id: string;
            userId: string | null;
            userEmail: string;
            productName: string;
            paymentMethod: string;
            totalSellPrice: number;
            totalCostPrice: number;
            totalProfit: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            purchasedAt: Date;
            updatedAt: Date;
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
            totalProfit: number;
            updatedAt: Date;
            email: string;
            password: string;
            isActive: boolean;
            createdAt: Date;
            chatLink: string | null;
            fullName: string;
            loginIPs: string[];
            note: string | null;
            otpLogin: import(".prisma/client").$Enums.OtpType;
            otpPayment: import(".prisma/client").$Enums.OtpType;
            phone: string | null;
            receiveNewsletter: boolean;
            totalPaid: number;
            username: string;
            role: import(".prisma/client").$Enums.Role;
            picture: string | null;
            googleId: string | null;
        };
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            note: string | null;
            changedAt: Date;
            orderId: string;
            updatedBy: string;
        }[];
    } & {
        id: string;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        totalProfit: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
        updatedAt: Date;
    }>;
    findByUserId(userId: string): Promise<({
        user: {
            id: string;
            totalProfit: number;
            updatedAt: Date;
            email: string;
            password: string;
            isActive: boolean;
            createdAt: Date;
            chatLink: string | null;
            fullName: string;
            loginIPs: string[];
            note: string | null;
            otpLogin: import(".prisma/client").$Enums.OtpType;
            otpPayment: import(".prisma/client").$Enums.OtpType;
            phone: string | null;
            receiveNewsletter: boolean;
            totalPaid: number;
            username: string;
            role: import(".prisma/client").$Enums.Role;
            picture: string | null;
            googleId: string | null;
        };
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            note: string | null;
            changedAt: Date;
            orderId: string;
            updatedBy: string;
        }[];
    } & {
        id: string;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        totalProfit: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
        updatedAt: Date;
    })[]>;
    findByUserEmail(userEmail: string): Promise<({
        user: {
            id: string;
            totalProfit: number;
            updatedAt: Date;
            email: string;
            password: string;
            isActive: boolean;
            createdAt: Date;
            chatLink: string | null;
            fullName: string;
            loginIPs: string[];
            note: string | null;
            otpLogin: import(".prisma/client").$Enums.OtpType;
            otpPayment: import(".prisma/client").$Enums.OtpType;
            phone: string | null;
            receiveNewsletter: boolean;
            totalPaid: number;
            username: string;
            role: import(".prisma/client").$Enums.Role;
            picture: string | null;
            googleId: string | null;
        };
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            note: string | null;
            changedAt: Date;
            orderId: string;
            updatedBy: string;
        }[];
    } & {
        id: string;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        totalProfit: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
        updatedAt: Date;
    })[]>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<{
        id: string;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        totalProfit: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        user: {
            id: string;
            totalProfit: number;
            updatedAt: Date;
            email: string;
            password: string;
            isActive: boolean;
            createdAt: Date;
            chatLink: string | null;
            fullName: string;
            loginIPs: string[];
            note: string | null;
            otpLogin: import(".prisma/client").$Enums.OtpType;
            otpPayment: import(".prisma/client").$Enums.OtpType;
            phone: string | null;
            receiveNewsletter: boolean;
            totalPaid: number;
            username: string;
            role: import(".prisma/client").$Enums.Role;
            picture: string | null;
            googleId: string | null;
        };
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            note: string | null;
            changedAt: Date;
            orderId: string;
            updatedBy: string;
        }[];
    } & {
        id: string;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        totalProfit: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        userId: string | null;
        userEmail: string;
        productName: string;
        paymentMethod: string;
        totalSellPrice: number;
        totalCostPrice: number;
        totalProfit: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        purchasedAt: Date;
        updatedAt: Date;
    }>;
}
