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
        const slug = createProductDto.slug || this.generateSlug(createProductDto.name);
        const { status, categoryId, ...restOfDto } = createProductDto;
        if (categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${categoryId} not found`);
            }
        }
        const data = {
            ...restOfDto,
            slug,
            name: createProductDto.name,
            originalPrice: createProductDto.originalPrice,
            importPrice: createProductDto.importPrice ?? 0,
            gameCode: createProductDto.gameCode,
            analyticsCode: createProductDto.analyticsCode ?? '',
        };
        if (status !== undefined) {
            data.status = status;
        }
        if (categoryId) {
            data.category = { connect: { id: categoryId } };
        }
        this.logger.debug(`Prisma create data: ${JSON.stringify(data)}`);
        try {
            return await this.prisma.product.create({
                data: data,
            });
        }
        catch (error) {
            this.logger.error(`Prisma create failed: ${error.message}`, error.stack);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    const target = error.meta?.target || [];
                    if (target.includes('slug')) {
                        throw new common_1.BadRequestException(`Product with slug '${slug}' already exists.`);
                    }
                    else if (target.includes('gameCode')) {
                        throw new common_1.BadRequestException(`Product with game code '${createProductDto.gameCode}' already exists.`);
                    }
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
            this.logger.debug(`Received update DTO for ID ${id}: ${JSON.stringify(updateProductDto)}`);
            let slug = updateProductDto.slug;
            if (updateProductDto.name && !slug) {
                slug = this.generateSlug(updateProductDto.name);
            }
            const { categoryId, status, ...restOfDto } = updateProductDto;
            this.logger.debug(`HTML Fields in restOfDto: description=${restOfDto.description?.substring(0, 20)}..., warrantyPolicy=${restOfDto.warrantyPolicy?.substring(0, 20)}..., faq=${restOfDto.faq?.substring(0, 20)}...`);
            const dataToUpdate = {
                ...restOfDto,
                ...(slug && { slug }),
            };
            this.logger.debug(`Initial dataToUpdate object: ${JSON.stringify(dataToUpdate)}`);
            if (categoryId !== undefined) {
                if (categoryId === null) {
                    dataToUpdate.category = { disconnect: true };
                }
                else {
                    dataToUpdate.category = { connect: { id: categoryId } };
                }
            }
            if (status) {
                const validStatuses = Object.values(product_status_enum_1.ProductStatus);
                if (validStatuses.includes(status)) {
                    dataToUpdate.status = status;
                }
                else {
                    throw new common_1.BadRequestException(`Invalid status value: ${status}. Allowed values are: ${validStatuses.join(', ')}`);
                }
            }
            this.logger.debug(`Final dataToUpdate before Prisma call for ID ${id}: ${JSON.stringify(dataToUpdate)}`);
            return await this.prisma.product.update({
                where: { id },
                data: dataToUpdate,
            });
        }
        catch (error) {
            this.logger.error(`Prisma update failed for ID ${id}: ${error.message}`, error.stack);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    const meta = error.meta;
                    if (meta?.cause?.includes('related record') || meta?.target?.includes('Product_categoryId_fkey (index)')) {
                        throw new common_1.BadRequestException(`Category with ID ${updateProductDto.categoryId} not found.`);
                    }
                    else {
                        throw new common_1.NotFoundException(`Product with ID ${id} not found.`);
                    }
                }
            }
            throw error;
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
        if (status) {
            this.logger.warn(`Status filter in search is temporarily disabled due to type issues.`);
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