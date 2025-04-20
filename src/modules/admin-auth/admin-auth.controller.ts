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
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );
    console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
  }

  @Post('google/login')
  async googleLogin(@Body('code') code: string) {
    try {
      console.log('Received code:', code);
      
      // Exchange code for tokens
      const { tokens } = await this.googleClient.getToken(code);
      console.log('Received tokens from Google');
      
      const { id_token } = tokens;
      if (!id_token) {
        console.log('No id_token in response');
        throw new UnauthorizedException('Invalid code');
      }

      // Verify id_token
      const ticket = await this.googleClient.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      console.log('Google token payload:', payload);
      
      if (!payload) {
        console.log('Invalid token payload');
        throw new UnauthorizedException('Invalid token payload');
      }

      const { email } = payload;
      console.log('Email from token:', email);
      
      const admin = await this.prisma.admin.findUnique({
        where: { email }
      });
      console.log('Found admin:', admin);

      if (!admin) {
        console.log('Email not found in admin list');
        throw new UnauthorizedException('Email not found in admin list');
      }

      // Update googleId if needed
      if (!admin.googleId) {
        console.log('Updating googleId for admin');
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
      console.log('JWT token payload:', tokenPayload);

      const accessToken = await this.adminAuthService.createToken(tokenPayload);
      console.log('Generated access token:', accessToken);
      
      return {
        accessToken,
        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role
        }
      };

    } catch (error) {
      console.error('Error during Google login:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid code');
    }
  }
} 