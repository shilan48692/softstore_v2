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
    const { productId, importSourceId: providedImportSourceId, ...restData } = createKeyDto;

    // 1. Check if Product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, importSource: true }, // Select product's default source name
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    // 2. Determine the importSourceId to use
    let finalImportSourceId: string | null = null;
    if (providedImportSourceId) {
      // If provided, validate it exists (optional, Prisma FK constraint handles it)
      const sourceExists = await this.prisma.importSource.findUnique({
        where: { id: providedImportSourceId },
        select: { id: true },
      });
      if (!sourceExists) {
        throw new NotFoundException(`ImportSource with ID ${providedImportSourceId} not found.`);
      }
      finalImportSourceId = providedImportSourceId;
    } else if (product.importSource) {
      // If not provided, try to find default from Product's importSource field (which is a name)
      const defaultSource = await this.prisma.importSource.findUnique({
        where: { name: product.importSource },
        select: { id: true },
      });
      if (defaultSource) {
        finalImportSourceId = defaultSource.id;
      }
      // If no default source found by name, finalImportSourceId remains null
    }

    // 3. Prepare data for key creation
    const status = restData.status as KeyStatus | undefined;
    const dataToCreate: Prisma.KeyCreateInput = {
      ...restData,
      status: status ?? KeyStatus.AVAILABLE,
      product: { connect: { id: productId } },
      // Connect to importSource only if finalImportSourceId is determined
      ...(finalImportSourceId && { 
        importSource: { connect: { id: finalImportSourceId } } 
      }),
    };

    return this.prisma.key.create({ data: dataToCreate });
  }

  async createBulk(createBulkKeysDto: CreateBulkKeysDto) {
    const { productId, activationCodes, note, cost, status, importSourceId } = createBulkKeysDto; // Destructure importSourceId

    // 1. Check if Product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, importSource: true }, // Select product's default source name
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    // 2. Determine the default importSourceId if none provided
    let defaultImportSourceId: string | null = null;
    if (importSourceId) {
       // If provided, validate it exists (optional)
       const sourceExists = await this.prisma.importSource.findUnique({
         where: { id: importSourceId },
         select: { id: true },
       });
       if (!sourceExists) {
         throw new NotFoundException(`ImportSource with ID ${importSourceId} not found.`);
       }
       defaultImportSourceId = importSourceId;
    } else if (product.importSource) {
       const defaultSource = await this.prisma.importSource.findUnique({
         where: { name: product.importSource },
         select: { id: true },
       });
       if (defaultSource) {
         defaultImportSourceId = defaultSource.id;
       }
    }

    // 3. Prepare data for multiple keys
    const keysData = activationCodes.map((activationCode) => ({
      activationCode,
      productId,
      note: note,
      cost: cost ?? 0,
      status: status ?? KeyStatus.AVAILABLE,
      importSourceId: defaultImportSourceId, // Assign determined source ID (can be null)
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
    // Destructure potential fields including importSourceId
    const { productId, importSourceId, ...restData } = updateKeyDto;

    const dataToUpdate: Prisma.KeyUpdateInput = {
      ...restData,
      // Connect product if productId is provided
      ...(productId && { product: { connect: { id: productId } } }),
      // Connect or disconnect importSource if importSourceId is provided (null disconnects)
      ...(importSourceId !== undefined && { 
           importSource: importSourceId 
             ? { connect: { id: importSourceId } } 
             : { disconnect: true } 
      }), 
      // Update status if provided
      ...(restData.status && { status: restData.status as KeyStatus })
    };

    // Update usedAt based on status logic (remains the same)
    if (restData.status) {
      if (restData.status === KeyStatus.SOLD || restData.status === KeyStatus.EXPORTED) {
        dataToUpdate.usedAt = new Date();
      } else if (restData.status === KeyStatus.AVAILABLE) {
        dataToUpdate.usedAt = null;
      }
    }

    try {
      // Validate importSourceId exists if provided (optional, handled by FK constraint)
      if (importSourceId) {
        const sourceExists = await this.prisma.importSource.findUnique({ where: { id: importSourceId }, select: { id: true } });
        if (!sourceExists) {
          throw new NotFoundException(`ImportSource with ID ${importSourceId} not found.`);
        }
      }

      return await this.prisma.key.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        // Handle case where key 'id' or related 'productId'/'importSourceId' for connect is not found
        throw new NotFoundException(`Key with ID ${id} or related entity not found`); 
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
      note,
      createdAtFrom,
      createdAtTo,
      usedAtFrom,
      usedAtTo,
      minCost,
      maxCost,
      page = 1,
      limit = 10,
      importSourceId,
    } = findKeysDto;

    const pageInt = parseInt(String(page), 10) || 1;
    const limitInt = parseInt(String(limit), 10) || 10;
    const take = limitInt > 0 ? limitInt : 10;
    const skip = (pageInt > 0 ? pageInt - 1 : 0) * take;

    const whereClause: Prisma.KeyWhereInput = {};

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
      whereClause.status = status as KeyStatus;
    }

    if (note) {
      whereClause.note = {
        contains: note,
        mode: 'insensitive',
      };
    }

    if (minCost !== undefined || maxCost !== undefined) {
      whereClause.cost = {};
      if (minCost !== undefined) {
        whereClause.cost.gte = minCost;
      }
      if (maxCost !== undefined) {
        whereClause.cost.lte = maxCost;
      }
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

    // Add filter by importSourceId if provided
    if (importSourceId) {
      whereClause.importSourceId = importSourceId;
    }

    const [keys, total] = await Promise.all([
      this.prisma.key.findMany({
        where: whereClause,
        skip: skip,
        take: take,
        include: {
          product: true,
          importSource: true // Ensure importSource is included here
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