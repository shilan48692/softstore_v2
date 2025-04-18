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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
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
    async findAll(params) {
        const { skip, take, where } = params;
        const whereClause = {};
        if (where?.userId) {
            whereClause.userId = where.userId;
        }
        if (where?.status) {
            whereClause.status = where.status;
        }
        if (where?.startDate || where?.endDate) {
            whereClause.purchasedAt = {};
            if (where.startDate) {
                whereClause.purchasedAt.gte = where.startDate;
            }
            if (where.endDate) {
                whereClause.purchasedAt.lte = where.endDate;
            }
        }
        const [items, total] = await Promise.all([
            this.prisma.order.findMany({
                skip,
                take,
                where: whereClause,
                include: {
                    user: true,
                    statusHistory: true,
                },
            }),
            this.prisma.order.count({ where: whereClause }),
        ]);
        return {
            items,
            total,
        };
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
        try {
            return await this.prisma.order.delete({
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
    }
    async search(findOrdersDto) {
        const { userId, userEmail, productName, paymentMethod, status, page = 1, limit = 10, } = findOrdersDto;
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (userId) {
            whereClause.userId = userId;
        }
        if (userEmail) {
            whereClause.userEmail = {
                contains: userEmail,
                mode: 'insensitive',
            };
        }
        if (productName) {
            whereClause.productName = {
                contains: productName,
                mode: 'insensitive',
            };
        }
        if (paymentMethod) {
            whereClause.paymentMethod = paymentMethod;
        }
        if (status) {
            whereClause.status = status;
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    user: true,
                    statusHistory: true,
                },
                orderBy: {
                    purchasedAt: 'desc',
                },
            }),
            this.prisma.order.count({ where: whereClause }),
        ]);
        return {
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
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
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map