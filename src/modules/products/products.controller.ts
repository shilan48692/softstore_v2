import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, NotFoundException, Query, UseGuards, Header } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AdminRouteGuard } from '../auth/guards/admin-route.guard';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Public routes
  @Get('products')
  @Header('Cache-Control', 'no-cache')
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get('products/:id')
  @Header('Cache-Control', 'no-cache')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
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
  @UseGuards(JwtAuthGuard, RolesGuard, AdminRouteGuard)
  @Roles(Role.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch('admin/products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminRouteGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete('admin/products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminRouteGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('admin/products/search')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminRouteGuard)
  @Roles(Role.ADMIN)
  search(@Query() query: any) {
    return this.productsService.search(query);
  }
} 