import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import * as cookieParser from 'cookie-parser';
import { NextFunction, Request, Response, json } from 'express';

// Simple logging middleware
function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  Logger.log(`Incoming Request: ${req.method} ${req.originalUrl}`, 'HttpRequest');
  // Log body only if it exists and is not empty
  if (body && Object.keys(body).length > 0) {
    Logger.debug(`Request Body: ${JSON.stringify(body)}`, 'HttpRequest');
  }
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // IMPORTANT: Use built-in JSON body parser BEFORE the logger middleware
  // so that req.body is populated when the logger runs.
  app.use(json({ limit: '50mb' })); // Adjust limit as needed

  app.use(loggerMiddleware); // Logger now runs AFTER body parser
  app.use(cookieParser());
  
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
    allowedHeaders: [
      'Accept',
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap(); 