import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { OrderStatus } from './enums/order-status.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
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

  async findAll(query: FindOrdersDto) {
    this.logger.log(`Finding orders with query: ${JSON.stringify(query)}`);
    const {
      userId,
      userEmail,
      productName,
      paymentMethod,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = query;

    const pageInt = parseInt(String(page), 10) || 1;
    const limitInt = parseInt(String(limit), 10) || 10;
    const skipInt = (pageInt - 1) * limitInt;

    // Use Prisma.OrderWhereInput for type safety
    const whereClause: Prisma.OrderWhereInput = {};

    if (userId) {
      whereClause.userId = userId;
    }
    if (userEmail) {
      whereClause.userEmail = { contains: userEmail, mode: 'insensitive' };
    }
    if (productName) {
      whereClause.productName = { contains: productName, mode: 'insensitive' };
    }
    if (paymentMethod) {
      whereClause.paymentMethod = { contains: paymentMethod, mode: 'insensitive' }; // Use contains for flexibility?
    }
    if (status) {
      whereClause.status = { equals: status }; // Use equals for enum
    }
    if (startDate || endDate) {
        whereClause.purchasedAt = {};
        if (startDate) whereClause.purchasedAt.gte = new Date(startDate);
        if (endDate) whereClause.purchasedAt.lte = new Date(endDate);
    }

    this.logger.debug(`Constructed Prisma WHERE clause: ${JSON.stringify(whereClause)}`);

    try {
      const [orders, total] = await this.prisma.$transaction([
        this.prisma.order.findMany({
          where: whereClause,
          skip: skipInt,
          take: limitInt,
          include: {
            // Optimize includes later if needed
            user: { select: { id: true, email: true, fullName: true } }, // Select specific user fields
            statusHistory: { // Get only the latest status history entry
                orderBy: { changedAt: 'desc' },
                take: 1,
            },
          },
          orderBy: {
            purchasedAt: 'desc',
          },
        }),
        this.prisma.order.count({ where: whereClause }),
      ]);

      this.logger.log(`Found ${total} orders, returning page ${pageInt} with limit ${limitInt}`);
      return {
        data: orders,
        meta: {
          total,
          page: pageInt,
          limit: limitInt,
          totalPages: Math.ceil(total / limitInt),
        },
      };
    } catch (error) {
      this.logger.error(`Error finding orders: ${error.message}`, error.stack);
      throw error;
    }
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

  async remove(id: string): Promise<Prisma.OrderGetPayload<{}>> {
    this.logger.log(`Attempting to remove order with ID: ${id}`);
    
    // 1. Check if order exists first
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
        this.logger.warn(`Order not found for removal: ${id}`);
        throw new NotFoundException('ORDER_NOT_FOUND');
    }
    
    try {
        // Order exists, proceed with deletion
        const deletedOrder = await this.prisma.order.delete({
            where: { id },
        });
        this.logger.log(`Successfully removed order: ${deletedOrder.id}`);
        return deletedOrder;
    } catch (error) {
        // Handle potential errors during deletion (e.g., foreign key constraints if cascades are not set up)
        this.logger.error(`Prisma delete failed for order ID ${id}: ${error.message}`, error.stack);
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // P2025 should be caught by the check above, but handle defensively
            if (error.code === 'P2025') {
                throw new NotFoundException('ORDER_NOT_FOUND');
            }
            // Handle other Prisma errors if necessary
         }
        throw error; // Re-throw other errors
    }
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