import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Đăng ký global pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Đăng ký global interceptors
  app.useGlobalInterceptors(new ErrorInterceptor());
  
  // Sử dụng cookie-parser
  app.use(cookieParser());
  
  // Cấu hình CORS
  app.enableCors({
    origin: ['http://localhost:8080', process.env.ADMIN_FRONTEND_URL || 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: '*',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap(); 