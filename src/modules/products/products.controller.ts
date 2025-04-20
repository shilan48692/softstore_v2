import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, NotFoundException, Query, UseGuards, Header } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard';
import { AdminRole } from '../admin/admin.service';
import { 
  BadRequestException, 
  ConflictException 
} from '../../common/exceptions/app.exception';

@Controller()
export class ProductsController {
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
    try {
      // Kiểm tra xem sản phẩm có tồn tại không
      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new NotFoundException('PRODUCT_NOT_FOUND');
      }
      
      // Kiểm tra nếu thay đổi gameCode thì gameCode mới có tồn tại chưa
      if (updateProductDto.gameCode && updateProductDto.gameCode !== product.gameCode) {
        const existingProduct = await this.productsService.findByGameCode(updateProductDto.gameCode);
        if (existingProduct) {
          throw new ConflictException('PRODUCT_ALREADY_EXISTS');
        }
      }
      
      return await this.productsService.update(id, updateProductDto);
    } catch (error) {
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
  search(@Query() query: any) {
    return this.productsService.search(query);
  }
} 