import { Controller, Get, Post, Req, Res, UseGuards, Body, UnauthorizedException } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OAuth2Client } from 'google-auth-library';

function parseExpiresIn(expiresIn: string): number {
  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1), 10);
  if (isNaN(value)) return 24 * 60 * 60 * 1000;

  switch (unit) {
    case 'd': return value * 24 * 60 * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'm': return value * 60 * 1000;
    case 's': return value * 1000;
    default: return 24 * 60 * 60 * 1000;
  }
}

@Controller('admin/auth')
export class AdminAuthController {
  private googleClient: OAuth2Client;

  constructor(
    private adminAuthService: AdminAuthService,
    private configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      'postmessage'
    );
  }

  @Post('google/login')
  async googleLogin(@Body('code') code: string, @Res({ passthrough: true }) response: Response) {
    if (!code) {
      throw new UnauthorizedException('No authorization code provided');
    }

    try {
      console.log('Received code from frontend:', code ? code.substring(0, 10) + '...' : 'null');
      const { tokens } = await this.googleClient.getToken(code);
      console.log('Received tokens from Google');
      const id_token = tokens.id_token;

      if (!id_token) {
        console.log('No id_token received from Google');
        throw new UnauthorizedException('Failed to get ID token from Google');
      }

      const ticket = await this.googleClient.verifyIdToken({
        idToken: id_token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      console.log('Google ID Token Payload:', payload);

      if (!payload || !payload.email) {
        console.log('Invalid ID token payload or missing email');
        throw new UnauthorizedException('Invalid ID token from Google');
      }

      const emailFromGoogle = payload.email;
      const normalizedEmail = emailFromGoogle.toLowerCase();
      console.log(`Normalized email for lookup: ${normalizedEmail}`);
      const admin = await this.adminAuthService.findAdminByEmail(normalizedEmail);
      if (!admin) {
        console.log('Admin email not found:', normalizedEmail);
        throw new UnauthorizedException('Admin account not found for this email');
      }

      const jwtPayload = { sub: admin.id, email: admin.email, role: admin.role };
      console.log('JWT token payload:', jwtPayload);
      const accessToken = await this.adminAuthService.createToken(jwtPayload);
      console.log('Generated access token: ey...');

      const expiresInString = this.configService.get<string>('JWT_EXPIRES_IN', '1d');
      const maxAge = parseExpiresIn(expiresInString);
      response.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: maxAge,
      });

      const { password, ...adminInfo } = admin;
      return { admin: adminInfo };

    } catch (error) {
      console.error('Error during Google code exchange/login:', error.response?.data || error.message);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error.response?.data?.error === 'invalid_grant') {
         throw new UnauthorizedException('Invalid or expired authorization code.');
      }
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
    });
    return { message: 'Admin logged out successfully' };
  }
} 