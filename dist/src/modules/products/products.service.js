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
const product_status_enum_1 = require("./enums/product-status.enum");
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
        const { name, slug: inputSlug, gameCode, categoryId, status, relatedProductIds, ...restOfDto } = createProductDto;
        const existingByGameCode = await this.findByGameCode(gameCode);
        if (existingByGameCode) {
            this.logger.warn(`Attempted to create product with existing game code: ${gameCode}`);
            throw new common_1.ConflictException('PRODUCT_GAME_CODE_EXISTS');
        }
        const slug = inputSlug || this.generateSlug(name);
        if (categoryId) {
            const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
            if (!category) {
                this.logger.warn(`Category not found for ID: ${categoryId}`);
                throw new common_1.BadRequestException('CATEGORY_NOT_FOUND');
            }
        }
        const data = {
            ...restOfDto,
            name,
            slug,
            gameCode,
            originalPrice: restOfDto.originalPrice,
            importPrice: restOfDto.importPrice ?? 0,
            analyticsCode: restOfDto.analyticsCode ?? '',
            ...(categoryId && { category: { connect: { id: categoryId } } }),
            ...(status && { status: status }),
            ...(relatedProductIds && relatedProductIds.length > 0 && {
                Product_A: {
                    connect: relatedProductIds.map(id => ({ id }))
                }
            })
        };
        this.logger.debug(`Attempting Prisma create with data: ${JSON.stringify(data)}`);
        try {
            const newProduct = await this.prisma.product.create({ data });
            this.logger.log(`Successfully created product: ${newProduct.id} (${newProduct.name})`);
            return newProduct;
        }
        catch (error) {
            this.logger.error(`Prisma create failed: ${error.message}`, error.stack);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                const target = error.meta?.target || [];
                if (target.includes('slug')) {
                    throw new common_1.ConflictException('PRODUCT_SLUG_EXISTS');
                }
                else if (target.includes('gameCode')) {
                    throw new common_1.ConflictException('PRODUCT_GAME_CODE_EXISTS');
                }
            }
            throw error;
        }
    }
    async findAll(query) {
        const where = {};
        const page = parseInt(String(query.page), 10) || 1;
        const limit = parseInt(String(query.limit), 10) || 10;
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
        try {
            const [data, total] = await Promise.all([
                this.prisma.product.findMany({
                    where,
                    skip: skip,
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
        catch (error) {
            this.logger.error(`Error during public product search: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                Product_A: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                Product_A: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with slug ${slug} not found`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        this.logger.log(`Attempting to update product with ID: ${id}`);
        this.logger.debug(`Update DTO: ${JSON.stringify(updateProductDto)}`);
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            this.logger.warn(`Product not found for update: ${id}`);
            throw new common_1.NotFoundException('PRODUCT_NOT_FOUND');
        }
        const { name, slug: inputSlug, gameCode, categoryId, status, relatedProductIds, ...restOfDto } = updateProductDto;
        if (gameCode && gameCode !== product.gameCode) {
            this.logger.log(`Checking uniqueness for new gameCode: ${gameCode}`);
            const existingByGameCode = await this.findByGameCode(gameCode);
            if (existingByGameCode) {
                this.logger.warn(`Conflict: New gameCode ${gameCode} already exists.`);
                throw new common_1.ConflictException('PRODUCT_GAME_CODE_EXISTS');
            }
        }
        let slug = inputSlug;
        if (name && !slug) {
            slug = this.generateSlug(name);
        }
        if (categoryId !== undefined && categoryId !== null) {
            const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
            if (!category) {
                this.logger.warn(`Category not found for connection during update: ${categoryId}`);
                throw new common_1.BadRequestException('CATEGORY_NOT_FOUND');
            }
        }
        if (status) {
            const validStatuses = Object.values(product_status_enum_1.ProductStatus);
            if (!validStatuses.includes(status)) {
                throw new common_1.BadRequestException(`Invalid status value: ${status}. Allowed values are: ${validStatuses.join(', ')}`);
            }
        }
        const dataToUpdate = {
            ...restOfDto,
            ...(name && { name }),
            ...(slug && { slug }),
            ...(gameCode && { gameCode }),
            ...(categoryId !== undefined && {
                category: categoryId === null ? { disconnect: true } : { connect: { id: categoryId } }
            }),
            ...(status && { status: status }),
            ...(relatedProductIds !== undefined && {
                Product_A: {
                    set: relatedProductIds.map(id => ({ id }))
                }
            })
        };
        Object.keys(dataToUpdate).forEach(key => dataToUpdate[key] === undefined && delete dataToUpdate[key]);
        this.logger.debug(`Attempting Prisma update for ID ${id} with data: ${JSON.stringify(dataToUpdate)}`);
        try {
            const updatedProduct = await this.prisma.product.update({
                where: { id },
                data: dataToUpdate,
            });
            this.logger.log(`Successfully updated product: ${updatedProduct.id} (${updatedProduct.name})`);
            return updatedProduct;
        }
        catch (error) {
            this.logger.error(`Prisma update failed for ID ${id}: ${error.message}`, error.stack);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    const target = error.meta?.target || [];
                    if (target.includes('slug')) {
                        throw new common_1.ConflictException('PRODUCT_SLUG_EXISTS');
                    }
                    else if (target.includes('gameCode')) {
                        throw new common_1.ConflictException('PRODUCT_GAME_CODE_EXISTS');
                    }
                }
                else if (error.code === 'P2025') {
                    throw new common_1.BadRequestException('RELATED_RECORD_NOT_FOUND');
                }
            }
            throw error;
        }
    }
    async remove(id) {
        this.logger.log(`Attempting to remove product with ID: ${id}`);
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            this.logger.warn(`Product not found for removal: ${id}`);
            throw new common_1.NotFoundException('PRODUCT_NOT_FOUND');
        }
        try {
            const deletedProduct = await this.prisma.product.delete({
                where: { id },
            });
            this.logger.log(`Successfully removed product: ${deletedProduct.id} (${deletedProduct.name})`);
            return deletedProduct;
        }
        catch (error) {
            this.logger.error(`Prisma delete failed for ID ${id}: ${error.message}`, error.stack);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException('PRODUCT_NOT_FOUND');
                }
            }
            throw error;
        }
    }
    async findByGameCode(gameCode) {
        return this.prisma.product.findFirst({
            where: { gameCode },
        });
    }
    async search(query) {
        this.logger.log(`Service searching products with query: ${JSON.stringify(query)}`);
        const { page = 1, limit = 10, search, status, categoryId, minQuantity, maxQuantity, minPrice, maxPrice, sortBy = 'updatedAt', sortOrder = 'desc' } = query;
        const pageInt = parseInt(String(page), 10) || 1;
        const limitInt = parseInt(String(limit), 10) || 10;
        const skipInt = (pageInt - 1) * limitInt;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { gameCode: { contains: search, mode: 'insensitive' } },
            ];
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
        const allowedSortFields = ['name', 'createdAt', 'updatedAt', 'originalPrice', 'quantity'];
        if (allowedSortFields.includes(sortBy)) {
            orderBy[sortBy] = sortOrder.toLowerCase();
        }
        else {
            orderBy['updatedAt'] = 'desc';
        }
        this.logger.debug(`Constructed Prisma ORDER BY clause: ${JSON.stringify(orderBy)}`);
        try {
            const [data, total] = await this.prisma.$transaction([
                this.prisma.product.findMany({
                    where,
                    skip: skipInt,
                    take: limitInt,
                    orderBy,
                    include: {
                        category: {
                            select: { name: true }
                        }
                    }
                }),
                this.prisma.product.count({ where })
            ]);
            this.logger.log(`Search found ${total} products, returning page ${pageInt} with limit ${limitInt}`);
            return {
                data,
                meta: {
                    total,
                    page: pageInt,
                    limit: limitInt,
                    totalPages: Math.ceil(total / limitInt)
                }
            };
        }
        catch (error) {
            this.logger.error(`Error during product search: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map