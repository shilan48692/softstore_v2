import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { TrimPipe } from './common/pipes/trim.pipe';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService instance from the app
  const configService = app.get(ConfigService);

  // IMPORTANT: Use built-in JSON body parser BEFORE the interceptors/pipes start processing
  app.use(json({ limit: '50mb' })); // Adjust limit as needed

  app.use(cookieParser());
  
  // Global Pipes (Order Matters! Trim first, then Validate)
  app.useGlobalPipes(new TrimPipe());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Đăng ký global interceptors
  app.useGlobalInterceptors(new ErrorInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // Cấu hình CORS
  const allowedOrigins = configService.get<string>('CORS_ALLOWED_ORIGINS');
  if (!allowedOrigins) {
    Logger.warn('CORS_ALLOWED_ORIGINS is not defined in environment variables. CORS might not work as expected.', 'Bootstrap');
  }
  const origins = allowedOrigins ? allowedOrigins.split(',').map(origin => origin.trim()) : [];
  
  app.enableCors({
    origin: origins.length > 0 ? origins : true, // Allow all if not specified, or restrict to list
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
      'Accept',
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],
    credentials: true,
  });

  const port = configService.get<number>('PORT', 3000); // Read port from env or default to 3000
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap(); 