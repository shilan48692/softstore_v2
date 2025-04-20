import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import slugify from 'slugify';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }

  private async ensureUniqueId(slug: string): Promise<string> {
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

  async create(createProductDto: CreateProductDto) {
    // Tạo slug nếu không được cung cấp
    const slug = createProductDto.slug || this.generateSlug(createProductDto.name);

    // Nếu có categoryId, kiểm tra xem category có tồn tại không
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

    // Chỉ thêm categoryId vào data nếu nó tồn tại
    if (createProductDto.categoryId) {
      data['categoryId'] = createProductDto.categoryId;
    }

    return this.prisma.product.create({
      data,
    });
  }

  async findAll(query: FindProductsDto) {
    const where: any = {};
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Xử lý name
    if (query.name) {
      where.name = {
        contains: query.name,
        mode: 'insensitive',
      };
    }

    // Xử lý categoryId
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    // Xử lý price
    if (query.minPrice || query.maxPrice) {
      where.originalPrice = {};
      if (query.minPrice) where.originalPrice.gte = query.minPrice;
      if (query.maxPrice) where.originalPrice.lte = query.maxPrice;
    }

    // Xử lý quantity
    if (query.inStock !== undefined) {
      where.quantity = {
        gt: query.inStock ? 0 : -1,
      };
    }

    // Xử lý tags
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

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
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
    } catch (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async search(query: any) {
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

  async findByGameCode(gameCode: string) {
    return this.prisma.product.findUnique({
      where: { gameCode },
    });
  }
} 