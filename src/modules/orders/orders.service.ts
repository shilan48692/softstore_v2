import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.prisma.order.create({
      data: createOrderDto,
    });

    // Tạo bản ghi lịch sử trạng thái đầu tiên
    await this.prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: order.status,
        updatedBy: 'system',
      },
    });

    return order;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: {
      userId?: string;
      status?: OrderStatus;
      startDate?: Date;
      endDate?: Date;
    };
  }) {
    const { skip, take, where } = params;

    const whereClause = {} as any;
    
    if (where?.userId) {
      whereClause.userId = where.userId;
    }
    
    if (where?.status) {
      whereClause.status = where.status;
    }
    
    if (where?.startDate || where?.endDate) {
      whereClause.purchasedAt = {};
      if (where.startDate) {
        whereClause.purchasedAt.gte = where.startDate;
      }
      if (where.endDate) {
        whereClause.purchasedAt.lte = where.endDate;
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take,
        where: whereClause,
        include: {
          user: true,
          statusHistory: true,
        },
      }),
      this.prisma.order.count({ where: whereClause }),
    ]);

    return {
      items,
      total,
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        statusHistory: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.prisma.order.update({
        where: { id },
        data: updateOrderDto,
      });

      // Nếu trạng thái thay đổi, tạo bản ghi lịch sử
      if (updateOrderDto.status && updateOrderDto.status !== order.status) {
        await this.prisma.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: updateOrderDto.status,
            updatedBy: 'system',
          },
        });
      }

      return order;
    } catch (error) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.order.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async search(findOrdersDto: FindOrdersDto) {
    const {
      userId,
      userEmail,
      productName,
      paymentMethod,
      status,
      page = 1,
      limit = 10,
    } = findOrdersDto;

    const skip = (page - 1) * limit;
    const whereClause = {} as any;

    if (userId) {
      whereClause.userId = userId;
    }

    if (userEmail) {
      whereClause.userEmail = {
        contains: userEmail,
        mode: 'insensitive',
      };
    }

    if (productName) {
      whereClause.productName = {
        contains: productName,
        mode: 'insensitive',
      };
    }

    if (paymentMethod) {
      whereClause.paymentMethod = paymentMethod;
    }

    if (status) {
      whereClause.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          user: true,
          statusHistory: true,
        },
        orderBy: {
          purchasedAt: 'desc',
        },
      }),
      this.prisma.order.count({ where: whereClause }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByUserId(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        user: true,
        statusHistory: true,
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });
  }

  async findByUserEmail(userEmail: string) {
    return this.prisma.order.findMany({
      where: { userEmail },
      include: {
        user: true,
        statusHistory: true,
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });
  }

  async updateStatus(id: string, status: OrderStatus, updatedBy: string, note?: string) {
    const order = await this.findOne(id);
    
    if (order.status === status) {
      return order;
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        statusHistory: true,
      },
    });

    await this.prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status,
        updatedBy,
        note,
      },
    });

    return updatedOrder;
  }
} 