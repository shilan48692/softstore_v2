import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        phone: true,
        isActive: true,
        receiveNewsletter: true,
        otpPayment: true,
        otpLogin: true,
        totalPaid: true,
        totalProfit: true,
        note: true,
        chatLink: true,
        loginIPs: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    email: string;
    name: string;
    password: string;
    picture?: string;
    googleId?: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        fullName: data.name,
        password: data.password,
        username: data.email.split('@')[0], // Tạo username từ email
        role: Role.USER,
        isActive: true,
        loginIPs: [],
        totalPaid: 0,
        totalProfit: 0,
      },
    });
  }
} 