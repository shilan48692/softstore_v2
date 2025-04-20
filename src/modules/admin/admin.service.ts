import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

// Định nghĩa AdminRole từ Prisma
export const AdminRole = {
  SUPER_ADMIN: 'SUPER_ADMIN' as const,
  ADMIN: 'ADMIN' as const,
  MODERATOR: 'MODERATOR' as const,
} as const;

export type AdminRole = typeof AdminRole[keyof typeof AdminRole];

// Định nghĩa kiểu Admin
type Admin = {
  id: number;
  email: string;
  password?: string | null;
  name?: string | null;
  role: AdminRole;
  googleId?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: AdminLoginDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async validateAdminEmail(email: string): Promise<boolean> {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });
    return !!admin;
  }

  async createAdmin(data: {
    email: string;
    name: string;
    password?: string;
    googleId?: string;
    role?: AdminRole;
  }): Promise<Admin> {
    const result = await this.prisma.admin.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        googleId: data.googleId,
        role: data.role || AdminRole.ADMIN,
      },
    });
    return {
      id: result.id,
      email: result.email,
      password: result.password,
      name: result.name,
      role: result.role as AdminRole,
      googleId: result.googleId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findAdminByEmail(email: string): Promise<Admin | null> {
    const result = await this.prisma.admin.findUnique({
      where: { email },
    });
    if (!result) return null;
    return {
      id: result.id,
      email: result.email,
      password: result.password,
      name: result.name,
      role: result.role as AdminRole,
      googleId: result.googleId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findAdminByGoogleId(googleId: string): Promise<Admin | null> {
    const result = await this.prisma.admin.findUnique({
      where: { googleId },
    });
    if (!result) return null;
    return {
      id: result.id,
      email: result.email,
      password: result.password,
      name: result.name,
      role: result.role as AdminRole,
      googleId: result.googleId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async getAdminRole(adminId: string): Promise<AdminRole> {
    const admin = await this.prisma.admin.findUnique({
      where: { id: parseInt(adminId, 10) },
      select: { role: true },
    });
    return (admin?.role || AdminRole.ADMIN) as AdminRole;
  }

  async isSuperAdmin(adminId: string): Promise<boolean> {
    const role = await this.getAdminRole(adminId);
    return role === AdminRole.SUPER_ADMIN;
  }

  async isAdmin(adminId: string): Promise<boolean> {
    const role = await this.getAdminRole(adminId);
    return role === AdminRole.ADMIN || role === AdminRole.SUPER_ADMIN;
  }

  async isModerator(adminId: string): Promise<boolean> {
    const role = await this.getAdminRole(adminId);
    return role === AdminRole.MODERATOR || role === AdminRole.ADMIN || role === AdminRole.SUPER_ADMIN;
  }

  async countAdmins(): Promise<number> {
    return this.prisma.admin.count();
  }

  async findAll(params?: {
    select?: Record<string, any>;
    where?: Record<string, any>;
    orderBy?: Record<string, any>;
  }): Promise<Admin[]> {
    const { select, where, orderBy } = params || {};
    const results = await this.prisma.admin.findMany({
      select,
      where,
      orderBy,
    });
    return results.map(result => ({
      id: result.id,
      email: result.email,
      password: result.password,
      name: result.name,
      role: result.role as AdminRole,
      googleId: result.googleId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }));
  }

  async findOne(params: {
    select?: Record<string, any>;
    where: { id: number } | { email: string } | { googleId: string };
  }): Promise<Admin> {
    const { select, where } = params;
    const admin = await this.prisma.admin.findUnique({
      select,
      where,
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return {
      id: admin.id,
      email: admin.email,
      password: admin.password,
      name: admin.name,
      role: admin.role as AdminRole,
      googleId: admin.googleId,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }

  async update(params: {
    where: { id: number } | { email: string } | { googleId: string };
    data: Partial<Admin>;
    select?: Record<string, any>;
  }): Promise<Admin> {
    const { where, data, select } = params;
    const result = await this.prisma.admin.update({
      data,
      where,
      select,
    });
    return {
      id: result.id,
      email: result.email,
      password: result.password,
      name: result.name,
      role: result.role as AdminRole,
      googleId: result.googleId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
} 