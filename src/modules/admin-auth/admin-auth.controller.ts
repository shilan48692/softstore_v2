import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminRole } from '../admin/admin.service';

@Controller('admin/auth')
export class AdminAuthController {
  private googleClient: OAuth2Client;

  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly prisma: PrismaService
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  @Post('google/login')
  async googleLogin(@Body('id_token') idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const { email } = payload;
      
      const admin = await this.prisma.admin.findUnique({
        where: { email }
      });

      if (!admin) {
        throw new UnauthorizedException('Email not found in admin list');
      }

      // Update googleId if needed
      if (!admin.googleId) {
        await this.prisma.admin.update({
          where: { id: admin.id },
          data: { googleId: payload.sub }
        });
      }

      const tokenPayload = {
        sub: admin.id,
        email: admin.email,
        role: admin.role
      };

      const accessToken = await this.adminAuthService.createToken(tokenPayload);
      
      return {
        accessToken,
        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role
        }
      };

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
} 