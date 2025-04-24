import { Injectable, NotFoundException, Logger, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus } from './enums/product-status.enum';
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

  async create(createProductDto: CreateProductDto): Promise<Prisma.ProductGetPayload<{}>> {
    const { name, slug: inputSlug, gameCode, categoryId, status, relatedProductIds, ...restOfDto } = createProductDto;

    const existingByGameCode = await this.findByGameCode(gameCode);
    if (existingByGameCode) {
      this.logger.warn(`Attempted to create product with existing game code: ${gameCode}`);
      throw new ConflictException('PRODUCT_GAME_CODE_EXISTS');
    }

    const slug = inputSlug || this.generateSlug(name);

    if (categoryId) {
      const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        this.logger.warn(`Category not found for ID: ${categoryId}`);
        throw new BadRequestException('CATEGORY_NOT_FOUND');
      }
    }

    const data: Prisma.ProductCreateInput = {
      ...restOfDto,
      name,
      slug,
      gameCode,
      originalPrice: restOfDto.originalPrice,
      importPrice: restOfDto.importPrice ?? 0,
      analyticsCode: restOfDto.analyticsCode ?? '',
      ...(categoryId && { category: { connect: { id: categoryId } } }),
      ...(status && { status: status as ProductStatus }),
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
    } catch (error) {
      this.logger.error(`Prisma create failed: ${error.message}`, error.stack);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          const target = (error.meta?.target as string[]) || [];
          if (target.includes('slug')) {
              throw new ConflictException('PRODUCT_SLUG_EXISTS');
          } else if (target.includes('gameCode')) {
              throw new ConflictException('PRODUCT_GAME_CODE_EXISTS');
          }
      }
      throw error;
    }
  }

  async findAll(query: FindProductsDto) {
    const where: any = {};
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
      if (query.minPrice) where.originalPrice.gte = query.minPrice;
      if (query.maxPrice) where.originalPrice.lte = query.maxPrice;
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
    } catch (error) {
        this.logger.error(`Error during public product search: ${error.message}`, error.stack);
        throw error;
    }
  }

  async findOne(id: string) {
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
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
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
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Prisma.ProductGetPayload<{}>> {
    this.logger.log(`Attempting to update product with ID: ${id}`);
    this.logger.debug(`Update DTO: ${JSON.stringify(updateProductDto)}`);

    // 1. Check if product exists
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      this.logger.warn(`Product not found for update: ${id}`);
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }

    // 2. Check for gameCode uniqueness if it's being changed
    const { name, slug: inputSlug, gameCode, categoryId, status, relatedProductIds, ...restOfDto } = updateProductDto;
    if (gameCode && gameCode !== product.gameCode) {
      this.logger.log(`Checking uniqueness for new gameCode: ${gameCode}`);
      const existingByGameCode = await this.findByGameCode(gameCode);
      if (existingByGameCode) {
        this.logger.warn(`Conflict: New gameCode ${gameCode} already exists.`);
        throw new ConflictException('PRODUCT_GAME_CODE_EXISTS');
      }
    }

    // 3. Generate slug if name is provided and slug isn't
    let slug = inputSlug;
    if (name && !slug) {
      slug = this.generateSlug(name);
      // Optionally, check for slug uniqueness if slug is changing
      // if (slug !== product.slug) { ... check uniqueness ... }
    }

    // 4. Validate Category ID if provided (null means disconnect, string means connect)
    if (categoryId !== undefined && categoryId !== null) {
      const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        this.logger.warn(`Category not found for connection during update: ${categoryId}`);
        throw new BadRequestException('CATEGORY_NOT_FOUND');
      }
    }

    // 5. Validate status if provided
    if (status) {
      const validStatuses = Object.values(ProductStatus);
      if (!validStatuses.includes(status as ProductStatus)) {
        throw new BadRequestException(`Invalid status value: ${status}. Allowed values are: ${validStatuses.join(', ')}`);
      }
    }

    // 6. Construct Prisma update data (more type-safe)
    const dataToUpdate: Prisma.ProductUpdateInput = {
      ...restOfDto, // Include all other fields from DTO
      ...(name && { name }), // Update name if provided
      ...(slug && { slug }), // Update slug if generated or provided
      ...(gameCode && { gameCode }), // Update gameCode if provided
      ...(categoryId !== undefined && { // Handle category connection/disconnection
          category: categoryId === null ? { disconnect: true } : { connect: { id: categoryId } }
      }),
      ...(status && { status: status as ProductStatus }), // Update status if provided
      ...(relatedProductIds !== undefined && {
        Product_A: {
          set: relatedProductIds.map(id => ({ id }))
        }
      })
    };

    // Remove undefined fields (important for Prisma update)
    Object.keys(dataToUpdate).forEach(key => dataToUpdate[key] === undefined && delete dataToUpdate[key]);
    
    this.logger.debug(`Attempting Prisma update for ID ${id} with data: ${JSON.stringify(dataToUpdate)}`);

    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: dataToUpdate,
      });
      this.logger.log(`Successfully updated product: ${updatedProduct.id} (${updatedProduct.name})`);
      return updatedProduct;
    } catch (error) {
      this.logger.error(`Prisma update failed for ID ${id}: ${error.message}`, error.stack);
      // Handle potential race condition for slug/gameCode unique constraints
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') { 
              const target = (error.meta?.target as string[]) || [];
              if (target.includes('slug')) {
                  throw new ConflictException('PRODUCT_SLUG_EXISTS');
              } else if (target.includes('gameCode')) {
                  throw new ConflictException('PRODUCT_GAME_CODE_EXISTS');
              }
          } else if (error.code === 'P2025') {
              // Error finding related record (e.g., category to connect)
              // This should be caught by the check above, but handle as fallback
              throw new BadRequestException('RELATED_RECORD_NOT_FOUND'); 
          }
      }
      throw error; // Re-throw other errors
    }
  }

  async remove(id: string): Promise<Prisma.ProductGetPayload<{}>> {
    this.logger.log(`Attempting to remove product with ID: ${id}`);

    // 1. Check if product exists first
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      this.logger.warn(`Product not found for removal: ${id}`);
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }

    try {
      // Product exists, proceed with deletion
      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });
      this.logger.log(`Successfully removed product: ${deletedProduct.id} (${deletedProduct.name})`);
      return deletedProduct;
    } catch (error) {
      // Catch potential Prisma errors during delete, though existence check should prevent P2025
      this.logger.error(`Prisma delete failed for ID ${id}: ${error.message}`, error.stack);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: Record to delete not found (should not happen due to check above, but handle defensively)
        if (error.code === 'P2025') {
            throw new NotFoundException('PRODUCT_NOT_FOUND');
        }
        // Handle other potential Prisma errors (e.g., foreign key constraints if not handled by schema)
      }
      // Re-throw other errors
      throw error;
    }
  }

  async findByGameCode(gameCode: string) {
    return this.prisma.product.findFirst({
      where: { gameCode },
    });
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
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = query;

    const pageInt = parseInt(String(page), 10) || 1;
    const limitInt = parseInt(String(limit), 10) || 10;
    const skipInt = (pageInt - 1) * limitInt;

    const where: Prisma.ProductWhereInput = {};

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
    const allowedSortFields = ['name', 'createdAt', 'updatedAt', 'originalPrice', 'quantity'];
    if (allowedSortFields.includes(sortBy)) {
        orderBy[sortBy] = sortOrder.toLowerCase() as Prisma.SortOrder;
    } else {
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
    } catch (error) {
        this.logger.error(`Error during product search: ${error.message}`, error.stack);
        throw error;
    }
  }
}