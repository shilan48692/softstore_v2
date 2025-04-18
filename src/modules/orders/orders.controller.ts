import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { OrderStatus } from './enums/order-status.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() query: FindOrdersDto) {
    return this.ordersService.findAll({
      skip: query.page ? (query.page - 1) * (query.limit || 10) : undefined,
      take: query.limit,
      where: {
        userId: query.userId,
        status: query.status,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
      },
    });
  }

  @Get('search')
  search(@Query() findOrdersDto: FindOrdersDto) {
    return this.ordersService.search(findOrdersDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.ordersService.findByUserId(userId);
  }

  @Get('email/:userEmail')
  findByUserEmail(@Param('userEmail') userEmail: string) {
    return this.ordersService.findByUserEmail(userEmail);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Post(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Body('updatedBy') updatedBy: string,
    @Body('note') note?: string,
  ) {
    return this.ordersService.updateStatus(id, status, updatedBy, note);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
} 