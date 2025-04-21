"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let OrdersService = OrdersService_1 = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(OrdersService_1.name);
    }
    async create(createOrderDto) {
        const order = await this.prisma.order.create({
            data: createOrderDto,
        });
        await this.prisma.orderStatusHistory.create({
            data: {
                orderId: order.id,
                status: order.status,
                updatedBy: 'system',
            },
        });
        return order;
    }
    async findAll(query) {
        this.logger.log(`Finding orders with query: ${JSON.stringify(query)}`);
        const { userId, userEmail, productName, paymentMethod, status, startDate, endDate, page = 1, limit = 10, } = query;
        const pageInt = parseInt(String(page), 10) || 1;
        const limitInt = parseInt(String(limit), 10) || 10;
        const skipInt = (pageInt - 1) * limitInt;
        const whereClause = {};
        if (userId) {
            whereClause.userId = userId;
        }
        if (userEmail) {
            whereClause.userEmail = { contains: userEmail, mode: 'insensitive' };
        }
        if (productName) {
            whereClause.productName = { contains: productName, mode: 'insensitive' };
        }
        if (paymentMethod) {
            whereClause.paymentMethod = { contains: paymentMethod, mode: 'insensitive' };
        }
        if (status) {
            whereClause.status = { equals: status };
        }
        if (startDate || endDate) {
            whereClause.purchasedAt = {};
            if (startDate)
                whereClause.purchasedAt.gte = new Date(startDate);
            if (endDate)
                whereClause.purchasedAt.lte = new Date(endDate);
        }
        this.logger.debug(`Constructed Prisma WHERE clause: ${JSON.stringify(whereClause)}`);
        try {
            const [orders, total] = await this.prisma.$transaction([
                this.prisma.order.findMany({
                    where: whereClause,
                    skip: skipInt,
                    take: limitInt,
                    include: {
                        user: { select: { id: true, email: true, fullName: true } },
                        statusHistory: {
                            orderBy: { changedAt: 'desc' },
                            take: 1,
                        },
                    },
                    orderBy: {
                        purchasedAt: 'desc',
                    },
                }),
                this.prisma.order.count({ where: whereClause }),
            ]);
            this.logger.log(`Found ${total} orders, returning page ${pageInt} with limit ${limitInt}`);
            return {
                data: orders,
                meta: {
                    total,
                    page: pageInt,
                    limit: limitInt,
                    totalPages: Math.ceil(total / limitInt),
                },
            };
        }
        catch (error) {
            this.logger.error(`Error finding orders: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                statusHistory: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        try {
            const order = await this.prisma.order.update({
                where: { id },
                data: updateOrderDto,
            });
            if (updateOrderDto.status && updateOrderDto.status !== order.status) {
                await this.prisma.orderStatusHistory.create({
                    data: {
                        orderId: order.id,
                        status: updateOrderDto.status,
                        updatedBy: 'system',
                    },
                });
            }
            return order;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
    }
    async remove(id) {
        this.logger.log(`Attempting to remove order with ID: ${id}`);
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) {
            this.logger.warn(`Order not found for removal: ${id}`);
            throw new common_1.NotFoundException('ORDER_NOT_FOUND');
        }
        try {
            const deletedOrder = await this.prisma.order.delete({
                where: { id },
            });
            this.logger.log(`Successfully removed order: ${deletedOrder.id}`);
            return deletedOrder;
        }
        catch (error) {
            this.logger.error(`Prisma delete failed for order ID ${id}: ${error.message}`, error.stack);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException('ORDER_NOT_FOUND');
                }
            }
            throw error;
        }
    }
    async findByUserId(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                user: true,
                statusHistory: true,
            },
            orderBy: {
                purchasedAt: 'desc',
            },
        });
    }
    async findByUserEmail(userEmail) {
        return this.prisma.order.findMany({
            where: { userEmail },
            include: {
                user: true,
                statusHistory: true,
            },
            orderBy: {
                purchasedAt: 'desc',
            },
        });
    }
    async updateStatus(id, status, updatedBy, note) {
        const order = await this.findOne(id);
        if (order.status === status) {
            return order;
        }
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                user: true,
                statusHistory: true,
            },
        });
        await this.prisma.orderStatusHistory.create({
            data: {
                orderId: id,
                status,
                updatedBy,
                note,
            },
        });
        return updatedOrder;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map