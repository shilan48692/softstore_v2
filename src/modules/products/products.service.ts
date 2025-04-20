import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, ProductStatus } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { AdminFindProductsDto } from './dto/admin-find-products.dto';
import slugify from 'slugify';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
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

      // Log the data being sent to Prisma update
      const dataToUpdate = {
        ...updateProductDto,
        ...(slug && { slug }),
      };
      this.logger.debug(`Prisma update data for ID ${id}: ${JSON.stringify(dataToUpdate)}`);

      return await this.prisma.product.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      // Log the original error from Prisma
      this.logger.error(`Prisma update failed for ID ${id}: ${error.message}`, error.stack);
      
      // Check if the error is specifically a "record not found" error (P2025)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found.`);
      } 
      // For other errors (like constraint violations due to bad categoryId), throw a more general error
      throw new Error(`Failed to update product with ID ${id}. Reason: ${error.message}`);
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

  async search(query: AdminFindProductsDto) {
    this.logger.log(`Service searching products with query: ${JSON.stringify(query)}`);
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status,
      categoryId, 
      minQuantity, 
      maxQuantity, 
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { gameCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      (where as any).status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minQuantity !== undefined || maxQuantity !== undefined) {
      where.quantity = {};
      if (minQuantity !== undefined) where.quantity.gte = minQuantity;
      if (maxQuantity !== undefined) where.quantity.lte = maxQuantity;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.originalPrice = {};
      if (minPrice !== undefined) where.originalPrice.gte = minPrice;
      if (maxPrice !== undefined) where.originalPrice.lte = maxPrice;
      this.logger.debug(`Applying simple originalPrice filter: gte=${minPrice}, lte=${maxPrice}`);
    }
    
    this.logger.debug(`Constructed Prisma WHERE clause: ${JSON.stringify(where)}`);

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    const allowedSortFields = ['name', 'createdAt', 'updatedAt', 'originalPrice', 'quantity', 'status'];
    if (allowedSortFields.includes(sortBy)) {
        orderBy[sortBy] = sortOrder.toLowerCase() as Prisma.SortOrder;
    } else {
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
    } catch (error) {
        this.logger.error(`Error during product search: ${error.message}`, error.stack);
        throw error;
    }
  }

  async findByGameCode(gameCode: string) {
    return this.prisma.product.findFirst({
      where: { gameCode },
    });
  }
} 