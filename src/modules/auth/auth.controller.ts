import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refreshToken(req.headers.authorization.split(' ')[1]);
  }

  @Post('create-admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    // Verify admin secret
    const adminSecret = this.configService.get<string>('ADMIN_SECRET');
    if (createAdminDto.adminSecret !== adminSecret) {
      throw new UnauthorizedException('Invalid admin secret');
    }

    return this.authService.createAdmin(createAdminDto);
  }
} 