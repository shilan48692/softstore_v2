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
const client_1 = require("@prisma/client");
let KeysService = class KeysService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createKeyDto) {
        const { productId, importSourceId: providedImportSourceId, ...restData } = createKeyDto;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            select: { id: true, importSource: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found.`);
        }
        let finalImportSourceId = null;
        if (providedImportSourceId) {
            const sourceExists = await this.prisma.importSource.findUnique({
                where: { id: providedImportSourceId },
                select: { id: true },
            });
            if (!sourceExists) {
                throw new common_1.NotFoundException(`ImportSource with ID ${providedImportSourceId} not found.`);
            }
            finalImportSourceId = providedImportSourceId;
        }
        else if (product.importSource) {
            const defaultSource = await this.prisma.importSource.findUnique({
                where: { name: product.importSource },
                select: { id: true },
            });
            if (defaultSource) {
                finalImportSourceId = defaultSource.id;
            }
        }
        const status = restData.status;
        const dataToCreate = {
            ...restData,
            status: status ?? client_1.KeyStatus.AVAILABLE,
            product: { connect: { id: productId } },
            ...(finalImportSourceId && {
                importSource: { connect: { id: finalImportSourceId } }
            }),
        };
        return this.prisma.key.create({ data: dataToCreate });
    }
    async createBulk(createBulkKeysDto) {
        const { productId, activationCodes, note, cost, status, importSourceId } = createBulkKeysDto;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            select: { id: true, importSource: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found.`);
        }
        let defaultImportSourceId = null;
        if (importSourceId) {
            const sourceExists = await this.prisma.importSource.findUnique({
                where: { id: importSourceId },
                select: { id: true },
            });
            if (!sourceExists) {
                throw new common_1.NotFoundException(`ImportSource with ID ${importSourceId} not found.`);
            }
            defaultImportSourceId = importSourceId;
        }
        else if (product.importSource) {
            const defaultSource = await this.prisma.importSource.findUnique({
                where: { name: product.importSource },
                select: { id: true },
            });
            if (defaultSource) {
                defaultImportSourceId = defaultSource.id;
            }
        }
        const keysData = activationCodes.map((activationCode) => ({
            activationCode,
            productId,
            note: note,
            cost: cost ?? 0,
            status: status ?? client_1.KeyStatus.AVAILABLE,
            importSourceId: defaultImportSourceId,
        }));
        try {
            const result = await this.prisma.key.createMany({
                data: keysData,
                skipDuplicates: true,
            });
            return result;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.BadRequestException('One or more activation codes already exist.');
                }
            }
            throw error;
        }
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
        const { productId, importSourceId, ...restData } = updateKeyDto;
        const dataToUpdate = {
            ...restData,
            ...(productId && { product: { connect: { id: productId } } }),
            ...(importSourceId !== undefined && {
                importSource: importSourceId
                    ? { connect: { id: importSourceId } }
                    : { disconnect: true }
            }),
            ...(restData.status && { status: restData.status })
        };
        if (restData.status) {
            if (restData.status === client_1.KeyStatus.SOLD || restData.status === client_1.KeyStatus.EXPORTED) {
                dataToUpdate.usedAt = new Date();
            }
            else if (restData.status === client_1.KeyStatus.AVAILABLE) {
                dataToUpdate.usedAt = null;
            }
        }
        try {
            if (importSourceId) {
                const sourceExists = await this.prisma.importSource.findUnique({ where: { id: importSourceId }, select: { id: true } });
                if (!sourceExists) {
                    throw new common_1.NotFoundException(`ImportSource with ID ${importSourceId} not found.`);
                }
            }
            return await this.prisma.key.update({
                where: { id },
                data: dataToUpdate,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException(`Key with ID ${id} or related entity not found`);
            }
            throw error;
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
        const { productName, activationCode, orderId, status, note, createdAtFrom, createdAtTo, usedAtFrom, usedAtTo, minCost, maxCost, page = 1, limit = 10, importSourceId, } = findKeysDto;
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
        if (note) {
            whereClause.note = {
                contains: note,
                mode: 'insensitive',
            };
        }
        if (minCost !== undefined || maxCost !== undefined) {
            whereClause.cost = {};
            if (minCost !== undefined) {
                whereClause.cost.gte = minCost;
            }
            if (maxCost !== undefined) {
                whereClause.cost.lte = maxCost;
            }
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
        if (importSourceId) {
            whereClause.importSourceId = importSourceId;
        }
        const [keys, total] = await Promise.all([
            this.prisma.key.findMany({
                where: whereClause,
                skip: skip,
                take: take,
                include: {
                    product: true,
                    importSource: true
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