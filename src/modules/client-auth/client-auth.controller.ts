import { Controller, Post, Body, UseGuards, Get, Request, Req, Res } from '@nestjs/common';
import { ClientAuthService } from './client-auth.service';
import { ClientLoginDto } from './dto/client-login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class ClientAuthController {
  constructor(private readonly clientAuthService: ClientAuthService) {}

  @Post('login')
  async login(@Body() loginDto: ClientLoginDto) {
    return this.clientAuthService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Trigger Google OAuth
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const result = req.user;
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.access_token}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
} 