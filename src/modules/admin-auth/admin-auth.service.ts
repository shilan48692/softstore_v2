import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminRole } from '../admin/admin.service';
import { Admin } from '@prisma/client';

@Injectable()
export class AdminAuthService {
  private blacklistedTokens: Set<string> = new Set();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  async addToBlacklist(token: string): Promise<void> {
    this.blacklistedTokens.add(token);
  }

  async findAdminByEmail(email: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: { 
        email: email 
      }
    });
  }

  async updateAdminGoogleId(adminId: number, googleId: string): Promise<Admin> {
    return this.prisma.admin.update({
      where: { id: adminId },
      data: { googleId: googleId },
    });
  }

  async createToken(payload: { sub: number; email: string; role: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
} 