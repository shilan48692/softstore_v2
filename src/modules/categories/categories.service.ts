import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForAdmin() {
    // Fetch all categories, selecting only id and name
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc', // Order alphabetically for dropdowns
      },
    });
  }

  // Add other methods for category management (CRUD) later if needed
} 