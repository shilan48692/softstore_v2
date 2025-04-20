import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from '../../prisma/prisma.module'; // Import PrismaModule

@Module({
  imports: [PrismaModule], // Make PrismaService available
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {} 