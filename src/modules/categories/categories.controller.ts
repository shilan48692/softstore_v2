import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard';

@Controller('admin/categories') // Base path for admin category routes
@UseGuards(JwtAuthGuard)      // Protect all routes in this controller
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAllForAdmin() {
    return this.categoriesService.findAllForAdmin();
  }

  // Add POST, PATCH, DELETE endpoints later if needed
} 