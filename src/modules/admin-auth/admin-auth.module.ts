import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';

// Lấy lại secret từ biến môi trường
const adminJwtSecret = process.env.JWT_ADMIN_SECRET;
console.log('>>> AdminAuthModule using secret from ENV:', adminJwtSecret ? adminJwtSecret.substring(0, 5) + '...' : 'UNDEFINED');

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: adminJwtSecret, // Sử dụng lại biến môi trường
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, JwtStrategy],
  exports: [AdminAuthService],
})
export class AdminAuthModule {} 