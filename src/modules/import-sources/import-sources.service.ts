import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateImportSourceDto } from './dto/create-import-source.dto';
import { UpdateImportSourceDto } from './dto/update-import-source.dto';
import { FindImportSourcesDto } from './dto/find-import-sources.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ImportSourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createImportSourceDto: CreateImportSourceDto) {
    try {
      return await this.prisma.importSource.create({
        data: createImportSourceDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Handle unique constraint violation (e.g., duplicate name)
        throw new NotFoundException('Import source with this name already exists.');
      }
      throw error; // Re-throw other errors
    }
  }

  async findAll() {
    return this.prisma.importSource.findMany({
      orderBy: {
        name: 'asc', // Order by name alphabetically
      },
    });
  }

  async findOne(id: string) {
    const source = await this.prisma.importSource.findUnique({
      where: { id },
    });
    if (!source) {
      throw new NotFoundException(`Import source with ID ${id} not found`);
    }
    return source;
  }

  async update(id: string, updateImportSourceDto: UpdateImportSourceDto) {
    try {
      return await this.prisma.importSource.update({
        where: { id },
        data: updateImportSourceDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Import source with ID ${id} not found`);
        } else if (error.code === 'P2002') {
           throw new NotFoundException('Import source with this name already exists.');
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
     // Check if the source is associated with any keys before deleting
     const keysCount = await this.prisma.key.count({
        where: { importSourceId: id },
      });
  
      if (keysCount > 0) {
        throw new NotFoundException(
          `Cannot delete import source with ID ${id} because it is associated with ${keysCount} key(s).`,
        );
      }

    try {
       await this.prisma.importSource.delete({
        where: { id },
      });
       return { message: `Import source with ID ${id} deleted successfully.` };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Import source with ID ${id} not found`);
      }
      throw error;
    }
  }

  async search(findImportSourcesDto: FindImportSourcesDto) {
    const {
      name,
      page = 1,
      limit = 10,
    } = findImportSourcesDto;

    const pageInt = parseInt(String(page), 10) || 1;
    const limitInt = parseInt(String(limit), 10) || 10;
    const take = limitInt > 0 ? limitInt : 10;
    const skip = (pageInt > 0 ? pageInt - 1 : 0) * take;

    const whereClause: Prisma.ImportSourceWhereInput = {};

    if (name) {
      whereClause.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    const [sources, total] = await Promise.all([
      this.prisma.importSource.findMany({
        where: whereClause,
        skip: skip,
        take: take,
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.importSource.count({ where: whereClause }),
    ]);

    return {
      data: sources,
      meta: {
        total,
        page: pageInt,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }
} 