import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, NotFoundException, Query, UseGuards, Header, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { AdminFindProductsDto } from './dto/admin-find-products.dto';
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard';
import { AdminRole } from '../admin/admin.service';
import { 
  BadRequestException, 
  ConflictException 
} from '../../common/exceptions/app.exception';

@Controller()
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  // Public routes
  @Get('products')
  @Header('Cache-Control', 'no-cache')
  async findAll(@Query() query: any) {
    try {
      return await this.productsService.findAll(query);
    } catch (error) {
      // Lỗi sẽ được xử lý bởi ErrorInterceptor
      throw error;
    }
  }

  @Get('products/:id')
  @Header('Cache-Control', 'no-cache')
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new NotFoundException('PRODUCT_NOT_FOUND');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  @Get('products/by-slug/:slug')
  @Header('Cache-Control', 'no-cache')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':slug')
  @Header('Cache-Control', 'no-cache')
  findBySlugRoot(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  // Admin routes
  @Post('admin/products')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      // Kiểm tra xem sản phẩm đã tồn tại chưa
      const existingProduct = await this.productsService.findByGameCode(createProductDto.gameCode);
      if (existingProduct) {
        throw new ConflictException('PRODUCT_ALREADY_EXISTS');
      }
      
      return await this.productsService.create(createProductDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch('admin/products/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    this.logger.log(`Attempting to update product with ID: ${id}`);
    this.logger.debug(`Update data: ${JSON.stringify(updateProductDto)}`);
    try {
      // Kiểm tra xem sản phẩm có tồn tại không
      const product = await this.productsService.findOne(id);
      if (!product) {
        this.logger.warn(`Product not found for update: ${id}`);
        throw new NotFoundException('PRODUCT_NOT_FOUND');
      }
      
      // Kiểm tra nếu thay đổi gameCode thì gameCode mới có tồn tại chưa
      if (updateProductDto.gameCode && updateProductDto.gameCode !== product.gameCode) {
        this.logger.log(`Checking for existing gameCode: ${updateProductDto.gameCode}`);
        const existingProduct = await this.productsService.findByGameCode(updateProductDto.gameCode);
        if (existingProduct) {
          this.logger.warn(`Conflict: New gameCode ${updateProductDto.gameCode} already exists.`);
          throw new ConflictException('PRODUCT_ALREADY_EXISTS');
        }
      }
      
      this.logger.log(`Calling productsService.update for ID: ${id}`);
      const updatedProduct = await this.productsService.update(id, updateProductDto);
      this.logger.log(`Successfully updated product with ID: ${id}`);
      return updatedProduct;
    } catch (error) {
      this.logger.error(`Failed to update product with ID: ${id}`, error.stack);
      throw error;
    }
  }

  @Delete('admin/products/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      // Kiểm tra xem sản phẩm có tồn tại không
      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new NotFoundException('PRODUCT_NOT_FOUND');
      }
      
      return await this.productsService.remove(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('admin/products/search')
  @UseGuards(JwtAuthGuard)
  search(@Query() query: AdminFindProductsDto) {
    this.logger.log(`Admin searching products with query: ${JSON.stringify(query)}`);
    return this.productsService.search(query);
  }
} 