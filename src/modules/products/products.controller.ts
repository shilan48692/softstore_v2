import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, NotFoundException, Query, UseGuards, Header, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { AdminFindProductsDto } from './dto/admin-find-products.dto';
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard';
import { AdminRole } from '../admin/admin.service';
import { 
  // Remove unused exceptions previously thrown directly from controller
  // BadRequestException, 
  // ConflictException, 
  // NotFoundException // Service handles this now
} from '../../common/exceptions/app.exception';

@Controller()
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  // Public routes
  @Get('products')
  @Header('Cache-Control', 'no-cache')
  async findAll(@Query() query: any) {
    // Service handles logic and errors
    return await this.productsService.findAll(query);
  }

  @Get('products/:id')
  @Header('Cache-Control', 'no-cache')
  async findOne(@Param('id') id: string) {
    // Service handles not found check
    return await this.productsService.findOne(id);
  }

  @Get('products/by-slug/:slug')
  @Header('Cache-Control', 'no-cache')
  findBySlug(@Param('slug') slug: string) {
    // Service handles not found check
    return this.productsService.findBySlug(slug);
  }

  @Get(':slug') // Consider if this overlaps too much with /products/by-slug/:slug
  @Header('Cache-Control', 'no-cache')
  findBySlugRoot(@Param('slug') slug: string) {
    // Service handles not found check
    return this.productsService.findBySlug(slug);
  }

  // Admin routes
  @Post('admin/products')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createProductDto: CreateProductDto) {
    // Remove existence check, service handles it
    // const existingProduct = await this.productsService.findByGameCode(createProductDto.gameCode);
    // if (existingProduct) {
    //   throw new ConflictException('PRODUCT_ALREADY_EXISTS');
    // }
    return await this.productsService.create(createProductDto);
    // Errors (Conflict, Bad Request) are thrown by service and caught by global interceptor
  }

  @Patch('admin/products/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    this.logger.log(`Received request to update product with ID: ${id}`);
    // Remove existence and uniqueness checks, service handles them
    // const product = await this.productsService.findOne(id);
    // if (!product) { ... }
    // if (updateProductDto.gameCode && ...) { ... }
    return await this.productsService.update(id, updateProductDto);
    // Errors (Not Found, Conflict) are thrown by service and caught by global interceptor
  }

  @Delete('admin/products/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    this.logger.log(`Received request to remove product with ID: ${id}`);
    // Remove existence check, service handles it
    // const product = await this.productsService.findOne(id);
    // if (!product) { ... }
    return await this.productsService.remove(id);
     // Error (Not Found) is thrown by service and caught by global interceptor
  }

  @Get('admin/products/search')
  @UseGuards(JwtAuthGuard)
  search(@Query() query: AdminFindProductsDto) {
    this.logger.log(`Received admin product search request with query: ${JSON.stringify(query)}`);
    return this.productsService.search(query);
  }
} 