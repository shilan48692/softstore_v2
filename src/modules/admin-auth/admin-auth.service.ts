import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminRole } from '../admin/admin.service';

interface Admin {
  id: number;
  email: string;
  password?: string | null;
  name: string | null;
  role: AdminRole;
  googleId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

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

  async createToken(payload: { sub: number; email: string; role: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
} 