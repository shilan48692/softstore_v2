import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { FindKeysDto } from './dto/find-keys.dto';
import { Prisma, KeyStatus } from '@prisma/client';
import { CreateBulkKeysDto } from './dto/create-bulk-keys.dto';

@Injectable()
export class KeysService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKeyDto: CreateKeyDto) {
    const { productId, ...restData } = createKeyDto;
    const status = restData.status as KeyStatus | undefined;
    return this.prisma.key.create({
      data: {
        ...restData,
        status: status ?? KeyStatus.AVAILABLE,
        product: {
          connect: { id: productId },
        },
      },
    });
  }

  async createBulk(createBulkKeysDto: CreateBulkKeysDto) {
    const { productId, activationCodes, note, cost, status } = createBulkKeysDto;

    const productExists = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!productExists) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    const keysData = activationCodes.map((activationCode) => ({
      activationCode,
      productId,
      note: note,
      cost: cost ?? 0,
      status: status ?? KeyStatus.AVAILABLE,
    }));

    try {
      const result = await this.prisma.key.createMany({
        data: keysData,
        skipDuplicates: true,
      });
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('One or more activation codes already exist.');
        }
      } 
      throw error;
    }
  }

  async findAll() {
    return this.prisma.key.findMany({
      include: {
        product: true,
      },
    });
  }

  async findOne(id: string) {
    const key = await this.prisma.key.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!key) {
      throw new NotFoundException(`Key with ID ${id} not found`);
    }

    return key;
  }

  async findByActivationCode(activationCode: string) {
    const key = await this.prisma.key.findFirst({
      where: { activationCode },
      include: {
        product: true,
      },
    });

    if (!key) {
      throw new NotFoundException(`Key with activation code ${activationCode} not found`);
    }

    return key;
  }

  async update(id: string, updateKeyDto: UpdateKeyDto) {
    const { productId, ...restData } = updateKeyDto;
    
    const dataToUpdate: Prisma.KeyUpdateInput = {
      ...restData,
      ...(productId && {
        product: { 
          connect: { id: productId },
        }
      }),
      ...(restData.status && { status: restData.status as KeyStatus })
    };

    if (restData.status) {
      if (restData.status === KeyStatus.SOLD || restData.status === KeyStatus.EXPORTED) {
        dataToUpdate.usedAt = new Date();
      } else if (restData.status === KeyStatus.AVAILABLE) {
        dataToUpdate.usedAt = null;
      }
    }

    try {
      return await this.prisma.key.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
         throw new NotFoundException(`Key with ID ${id} not found`);
      } 
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.key.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Key with ID ${id} not found`);
    }
  }

  async findByProductId(productId: string) {
    return this.prisma.key.findMany({
      where: { productId },
      include: {
        product: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.key.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }

  async findByUserEmail(userEmail: string) {
    return this.prisma.key.findMany({
      where: { userEmail },
      include: {
        product: true,
      },
    });
  }

  async findByOrderId(orderId: string) {
    return this.prisma.key.findMany({
      where: { orderId },
      include: {
        product: true,
      },
    });
  }

  async search(findKeysDto: FindKeysDto) {
    const {
      productName,
      activationCode,
      orderId,
      status,
      createdAtFrom,
      createdAtTo,
      usedAtFrom,
      usedAtTo,
      page = 1,
      limit = 10,
    } = findKeysDto;

    const pageInt = parseInt(String(page), 10) || 1;
    const limitInt = parseInt(String(limit), 10) || 10;
    const take = limitInt > 0 ? limitInt : 10;
    const skip = (pageInt > 0 ? pageInt - 1 : 0) * take;

    const whereClause = {} as any;

    if (productName) {
      whereClause.product = {
        name: {
          contains: productName,
          mode: 'insensitive',
        },
      };
    }

    if (activationCode) {
      whereClause.activationCode = {
        contains: activationCode,
        mode: 'insensitive',
      };
    }

    if (orderId) {
      whereClause.orderId = orderId;
    }

    if (status) {
      whereClause.status = status;
    }

    if (createdAtFrom || createdAtTo) {
      whereClause.createdAt = {};
      if (createdAtFrom) {
        whereClause.createdAt.gte = new Date(createdAtFrom);
      }
      if (createdAtTo) {
        whereClause.createdAt.lte = new Date(createdAtTo);
      }
    }

    if (usedAtFrom || usedAtTo) {
      whereClause.usedAt = {};
      if (usedAtFrom) {
        whereClause.usedAt.gte = new Date(usedAtFrom);
      }
      if (usedAtTo) {
        whereClause.usedAt.lte = new Date(usedAtTo);
      }
    }

    const [keys, total] = await Promise.all([
      this.prisma.key.findMany({
        where: whereClause,
        skip: skip,
        take: take,
        include: {
          product: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.key.count({ where: whereClause }),
    ]);

    return {
      data: keys,
      meta: {
        total,
        page: pageInt,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async deleteBulk(ids: string[]) {
    if (!ids || ids.length === 0) {
      return { count: 0 }; 
    }

    const result = await this.prisma.key.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return result; 
  }
} 