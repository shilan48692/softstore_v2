import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
import { CategoriesModule } from './modules/categories/categories.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
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
    CategoriesModule,
    UploadModule,
  ],
})
export class AppModule {} 