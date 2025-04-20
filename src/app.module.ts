import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { KeysModule } from './modules/keys/keys.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LogsModule } from './modules/logs/logs.module';
import { AdminModule } from './modules/admin/admin.module';
import { AdminAuthModule } from './modules/admin-auth/admin-auth.module';
import { ClientAuthModule } from './modules/client-auth/client-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
    KeysModule,
    CommentsModule,
    LogsModule,
    AdminModule,
    AdminAuthModule,
    ClientAuthModule,
  ],
})
export class AppModule {} 