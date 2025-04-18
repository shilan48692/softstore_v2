import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { KeysModule } from './modules/keys/keys.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LogsModule } from './modules/logs/logs.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    KeysModule,
    CommentsModule,
    LogsModule,
    AdminModule,
  ],
})
export class AppModule {} 