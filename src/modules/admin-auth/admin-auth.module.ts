import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_ADMIN_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN', '1d');
        console.log('>>> AdminAuthModule using secret from ConfigService:', secret ? secret.substring(0, 5) + '...' : 'UNDEFINED');
        if (!secret) {
          throw new Error('JWT_ADMIN_SECRET is not defined in environment variables');
        }
        return {
          global: true,
          secret: secret,
          signOptions: { expiresIn: expiresIn },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, JwtStrategy],
  exports: [AdminAuthService, JwtModule],
})
export class AdminAuthModule {} 