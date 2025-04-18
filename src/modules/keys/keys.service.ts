import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { FindKeysDto } from './dto/find-keys.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class KeysService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKeyDto: CreateKeyDto) {
    return this.prisma.key.create({
      data: createKeyDto,
    });
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
    try {
      return await this.prisma.key.update({
        where: { id },
        data: updateKeyDto,
      });
    } catch (error) {
      throw new NotFoundException(`Key with ID ${id} not found`);
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

    const skip = (page - 1) * limit;

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
        skip,
        take: limit,
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
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
} 