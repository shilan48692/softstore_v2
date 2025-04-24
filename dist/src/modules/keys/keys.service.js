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
exports.KeysService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let KeysService = class KeysService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createKeyDto) {
        return this.prisma.key.create({
            data: createKeyDto,
        });
    }
    async findAll() {
        return this.prisma.key.findMany({
            include: {
                product: true,
            },
        });
    }
    async findOne(id) {
        const key = await this.prisma.key.findUnique({
            where: { id },
            include: {
                product: true,
            },
        });
        if (!key) {
            throw new common_1.NotFoundException(`Key with ID ${id} not found`);
        }
        return key;
    }
    async findByActivationCode(activationCode) {
        const key = await this.prisma.key.findFirst({
            where: { activationCode },
            include: {
                product: true,
            },
        });
        if (!key) {
            throw new common_1.NotFoundException(`Key with activation code ${activationCode} not found`);
        }
        return key;
    }
    async update(id, updateKeyDto) {
        try {
            return await this.prisma.key.update({
                where: { id },
                data: updateKeyDto,
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Key with ID ${id} not found`);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.key.delete({
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Key with ID ${id} not found`);
        }
    }
    async findByProductId(productId) {
        return this.prisma.key.findMany({
            where: { productId },
            include: {
                product: true,
            },
        });
    }
    async findByUserId(userId) {
        return this.prisma.key.findMany({
            where: { userId },
            include: {
                product: true,
            },
        });
    }
    async findByUserEmail(userEmail) {
        return this.prisma.key.findMany({
            where: { userEmail },
            include: {
                product: true,
            },
        });
    }
    async findByOrderId(orderId) {
        return this.prisma.key.findMany({
            where: { orderId },
            include: {
                product: true,
            },
        });
    }
    async search(findKeysDto) {
        const { productName, activationCode, orderId, status, createdAtFrom, createdAtTo, usedAtFrom, usedAtTo, page = 1, limit = 10, } = findKeysDto;
        const pageInt = parseInt(String(page), 10) || 1;
        const limitInt = parseInt(String(limit), 10) || 10;
        const take = limitInt > 0 ? limitInt : 10;
        const skip = (pageInt > 0 ? pageInt - 1 : 0) * take;
        const whereClause = {};
        if (productName) {
            whereClause.product = {
                name: {
                    contains: productName,
                    mode: 'insensitive',
                },
            };
        }
        if (activationCode) {
            whereClause.activationCode = {
                contains: activationCode,
                mode: 'insensitive',
            };
        }
        if (orderId) {
            whereClause.orderId = orderId;
        }
        if (status) {
            whereClause.status = status;
        }
        if (createdAtFrom || createdAtTo) {
            whereClause.createdAt = {};
            if (createdAtFrom) {
                whereClause.createdAt.gte = new Date(createdAtFrom);
            }
            if (createdAtTo) {
                whereClause.createdAt.lte = new Date(createdAtTo);
            }
        }
        if (usedAtFrom || usedAtTo) {
            whereClause.usedAt = {};
            if (usedAtFrom) {
                whereClause.usedAt.gte = new Date(usedAtFrom);
            }
            if (usedAtTo) {
                whereClause.usedAt.lte = new Date(usedAtTo);
            }
        }
        const [keys, total] = await Promise.all([
            this.prisma.key.findMany({
                where: whereClause,
                skip: skip,
                take: take,
                include: {
                    product: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.key.count({ where: whereClause }),
        ]);
        return {
            data: keys,
            meta: {
                total,
                page: pageInt,
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    }
    async deleteBulk(ids) {
        if (!ids || ids.length === 0) {
            return { count: 0 };
        }
        const result = await this.prisma.key.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
        return result;
    }
};
exports.KeysService = KeysService;
exports.KeysService = KeysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KeysService);
//# sourceMappingURL=keys.service.js.map