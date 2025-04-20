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
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const slugify_1 = require("slugify");
const client_1 = require("@prisma/client");
let ProductsService = ProductsService_1 = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ProductsService_1.name);
    }
    generateSlug(name) {
        return (0, slugify_1.default)(name, {
            lower: true,
            strict: true,
            locale: 'vi',
        });
    }
    async ensureUniqueId(slug) {
        let finalId = slug;
        let counter = 1;
        while (true) {
            const existingProduct = await this.prisma.product.findUnique({
                where: { id: finalId },
            });
            if (!existingProduct) {
                break;
            }
            finalId = `${slug}-${counter}`;
            counter++;
        }
        return finalId;
    }
    async create(createProductDto) {
        const slug = createProductDto.slug || this.generateSlug(createProductDto.name);
        if (createProductDto.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: createProductDto.categoryId },
            });
            if (!category) {
                throw new Error(`Category with ID ${createProductDto.categoryId} not found`);
            }
        }
        const data = {
            name: createProductDto.name,
            slug,
            description: createProductDto.description,
            originalPrice: createProductDto.originalPrice,
            importPrice: createProductDto.importPrice,
            importSource: createProductDto.importSource,
            quantity: createProductDto.quantity,
            tags: createProductDto.tags ?? [],
            gameCode: createProductDto.gameCode,
            analyticsCode: createProductDto.analyticsCode || null,
        };
        if (createProductDto.categoryId) {
            data['categoryId'] = createProductDto.categoryId;
        }
        return this.prisma.product.create({
            data,
        });
    }
    async findAll(query) {
        const where = {};
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        if (query.name) {
            where.name = {
                contains: query.name,
                mode: 'insensitive',
            };
        }
        if (query.categoryId) {
            where.categoryId = query.categoryId;
        }
        if (query.minPrice || query.maxPrice) {
            where.originalPrice = {};
            if (query.minPrice)
                where.originalPrice.gte = query.minPrice;
            if (query.maxPrice)
                where.originalPrice.lte = query.maxPrice;
        }
        if (query.inStock !== undefined) {
            where.quantity = {
                gt: query.inStock ? 0 : -1,
            };
        }
        if (query.tags && Array.isArray(query.tags) && query.tags.length > 0) {
            where.tags = {
                hasSome: query.tags,
            };
        }
        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.product.count({ where })
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with slug ${slug} not found`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        try {
            let slug = updateProductDto.slug;
            if (updateProductDto.name && !slug) {
                slug = this.generateSlug(updateProductDto.name);
            }
            const dataToUpdate = {
                ...updateProductDto,
                ...(slug && { slug }),
            };
            this.logger.debug(`Prisma update data for ID ${id}: ${JSON.stringify(dataToUpdate)}`);
            return await this.prisma.product.update({
                where: { id },
                data: dataToUpdate,
            });
        }
        catch (error) {
            this.logger.error(`Prisma update failed for ID ${id}: ${error.message}`, error.stack);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException(`Product with ID ${id} not found.`);
            }
            throw new Error(`Failed to update product with ID ${id}. Reason: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.product.delete({
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
    }
    async search(query) {
        this.logger.log(`Service searching products with query: ${JSON.stringify(query)}`);
        const { page = 1, limit = 10, search, status, categoryId, minQuantity, maxQuantity, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { gameCode: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status) {
            where.status = status;
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (minQuantity !== undefined || maxQuantity !== undefined) {
            where.quantity = {};
            if (minQuantity !== undefined)
                where.quantity.gte = minQuantity;
            if (maxQuantity !== undefined)
                where.quantity.lte = maxQuantity;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.originalPrice = {};
            if (minPrice !== undefined)
                where.originalPrice.gte = minPrice;
            if (maxPrice !== undefined)
                where.originalPrice.lte = maxPrice;
            this.logger.debug(`Applying simple originalPrice filter: gte=${minPrice}, lte=${maxPrice}`);
        }
        this.logger.debug(`Constructed Prisma WHERE clause: ${JSON.stringify(where)}`);
        const orderBy = {};
        const allowedSortFields = ['name', 'createdAt', 'updatedAt', 'originalPrice', 'quantity', 'status'];
        if (allowedSortFields.includes(sortBy)) {
            orderBy[sortBy] = sortOrder.toLowerCase();
        }
        else {
            orderBy['createdAt'] = 'desc';
        }
        this.logger.debug(`Constructed Prisma ORDER BY clause: ${JSON.stringify(orderBy)}`);
        try {
            const [data, total] = await this.prisma.$transaction([
                this.prisma.product.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy,
                    include: {
                        category: {
                            select: { name: true }
                        }
                    }
                }),
                this.prisma.product.count({ where })
            ]);
            this.logger.log(`Search found ${total} products, returning page ${page} with limit ${limit}`);
            return {
                data,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            this.logger.error(`Error during product search: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findByGameCode(gameCode) {
        return this.prisma.product.findFirst({
            where: { gameCode },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map