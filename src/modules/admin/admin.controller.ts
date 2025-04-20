import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AdminRole } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get('login/google')
  @UseGuards(AuthGuard('google-admin'))
  async googleAuth() {
    // Trigger Google OAuth
  }

  @Get('login/google/callback')
  @UseGuards(AuthGuard('google-admin'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    // Xử lý callback từ Google
    const user = req.user;
    
    // Tạo hoặc cập nhật admin
    let admin = await this.adminService.findAdminByEmail(user.email);
    if (!admin) {
      // Kiểm tra xem có phải là super admin đầu tiên không
      const isFirstAdmin = await this.isFirstAdmin();
      const role = isFirstAdmin ? AdminRole.SUPER_ADMIN : AdminRole.ADMIN;
      
      admin = await this.adminService.createAdmin({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        googleId: user.googleId,
        role,
      });
    }

    // Tạo JWT token
    const token = this.jwtService.sign({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Lưu token vào cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Chuyển hướng về trang admin
    res.redirect(this.configService.get('ADMIN_FRONTEND_URL', 'http://localhost:3001'));
  }

  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('admin_token');
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  // Kiểm tra xem có phải là admin đầu tiên không
  private async isFirstAdmin(): Promise<boolean> {
    const count = await this.adminService.countAdmins();
    return count === 0;
  }
} 