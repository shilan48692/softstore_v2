import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppException } from '../exceptions/app.exception';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof AppException) {
          return throwError(() => error);
        }

        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        // Xử lý các lỗi không xác định
        console.error('Unhandled error:', error);
        return throwError(
          () =>
            new AppException('INTERNAL_SERVER_ERROR', undefined, {
              originalError: error.message,
            }),
        );
      }),
    );
  }
} 