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
    async ensureUniqueSlug(slug, existingId) {
        let finalSlug = slug;
        let counter = 1;
        while (true) {
            const existingProduct = await this.prisma.product.findUnique({
                where: {
                    slug: finalSlug,
                    NOT: existingId ? { id: existingId } : undefined,
                },
            });
            if (!existingProduct) {
                break;
            }
            finalSlug = `${slug}-${counter}`;
            counter++;
        }
        return finalSlug;
    }
    async create(createProductDto) {
        const slug = createProductDto.slug || this.generateSlug(createProductDto.name);
        const uniqueSlug = await this.ensureUniqueSlug(slug);
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
            slug: uniqueSlug,
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
                slug = await this.ensureUniqueSlug(slug, id);
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map