import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminManagementController } from './admin-management.controller';
import { AdminService } from './admin.service';
import { GoogleAdminStrategy } from './strategies/google-admin.strategy';
import { AdminGuard } from './guards/admin.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { ModeratorGuard } from './guards/moderator.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController, AdminManagementController],
  providers: [
    AdminService, 
    GoogleAdminStrategy, 
    AdminGuard,
    SuperAdminGuard,
    ModeratorGuard
  ],
  exports: [AdminService],
})
export class AdminModule {} 