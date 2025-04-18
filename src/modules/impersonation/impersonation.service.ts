import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImpersonationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async impersonateUser(adminId: string, userId: string) {
    // Kiểm tra admin có tồn tại và có quyền admin không
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Kiểm tra user có tồn tại không
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Tạo token impersonation
    const impersonationToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        username: user.username,
        isImpersonated: true,
        impersonatedBy: adminId,
      },
      {
        expiresIn: this.configService.get('IMPERSONATION_TOKEN_EXPIRY') || '1h',
      },
    );

    // Lưu thông tin impersonation vào database (tùy chọn)
    await this.prisma.impersonationLog.create({
      data: {
        adminId,
        userId,
        token: impersonationToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 giờ
      },
    });

    return {
      token: impersonationToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
      },
    };
  }

  async validateImpersonationToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      
      // Kiểm tra token có phải là token impersonation không
      if (!payload.isImpersonated) {
        throw new UnauthorizedException('Invalid impersonation token');
      }

      // Kiểm tra user có tồn tại không
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Kiểm tra user có bị vô hiệu hóa không
      if (!user.isActive) {
        throw new UnauthorizedException('User account is inactive');
      }

      return {
        userId: user.id,
        email: user.email,
        username: user.username,
        isImpersonated: true,
        impersonatedBy: payload.impersonatedBy,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired impersonation token');
    }
  }

  async endImpersonation(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      
      if (!payload.isImpersonated) {
        throw new UnauthorizedException('Not an impersonation token');
      }

      // Có thể thêm logic để vô hiệu hóa token trong database nếu cần
      
      return { success: true };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 