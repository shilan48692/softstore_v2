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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const slugify_1 = require("slugify");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
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
            return await this.prisma.product.update({
                where: { id },
                data: {
                    ...updateProductDto,
                    ...(slug && { slug }),
                },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
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
        return this.prisma.product.findMany({
            where: {
                name: {
                    contains: query.name,
                    mode: 'insensitive',
                },
                categoryId: query.categoryId,
                originalPrice: {
                    gte: query.minPrice,
                    lte: query.maxPrice,
                },
                quantity: {
                    gt: query.inStock ? 0 : -1,
                },
                tags: {
                    hasSome: query.tags,
                },
            },
        });
    }
    async findByGameCode(gameCode) {
        return this.prisma.product.findUnique({
            where: { gameCode },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map