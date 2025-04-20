import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ClientAuthService } from './client-auth.service';
import { ClientAuthController } from './client-auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_CLIENT_SECRET || 'client-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ClientAuthController],
  providers: [ClientAuthService, GoogleStrategy, JwtStrategy],
  exports: [ClientAuthService],
})
export class ClientAuthModule {} 