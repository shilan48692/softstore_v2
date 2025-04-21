import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request } from 'express';
import { AppException } from '../exceptions/app.exception';
import { ErrorCode, ErrorMessages } from '../constants/error-messages';

interface IErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errorCode: string;
  timestamp: string;
  path: string;
  details?: any;
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const path = request.url;

    return next.handle().pipe(
      catchError((error) => {
        let statusCode: number;
        let message: string;
        let errorCode: string;
        let details: any;

        if (error instanceof AppException) {
          const response = error.getResponse() as { message: string; errorCode: ErrorCode; details?: any };
          statusCode = error.getStatus();
          message = response.message || 'An application error occurred';
          errorCode = response.errorCode || 'APP_ERROR';
          details = response.details;
          this.logger.warn(
            `[AppException] Path: ${path} | Status: ${statusCode} | Code: ${errorCode} | Message: ${message}${details ? ' | Details: ' + JSON.stringify(details) : ''}`,
          );

        } else if (error instanceof HttpException) {
          statusCode = error.getStatus();
          const response = error.getResponse();
          if (typeof response === 'string') {
            message = response;
          } else if (typeof response === 'object' && response !== null && 'message' in response) {
            message = Array.isArray((response as any).message) ? (response as any).message.join(', ') : (response as any).message;
            details = response;
          } else {
            message = error.message || 'An HTTP error occurred';
          }
          errorCode = error.name || `HTTP_${statusCode}`;
          this.logger.warn(
            `[HttpException] Path: ${path} | Status: ${statusCode} | Message: ${message}${details ? ' | Details: ' + JSON.stringify(details) : ''}`,
          );

        } else {
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          message = ErrorMessages['INTERNAL_SERVER_ERROR'] || 'An unexpected internal server error occurred.';
          errorCode = 'INTERNAL_SERVER_ERROR';
          details = { originalError: error.message };
          this.logger.error(
            `[UnhandledException] Path: ${path} | Status: ${statusCode} | Message: ${message} | Error: ${error.message}`,
            error.stack,
          );
        }

        const errorResponse: IErrorResponse = {
          success: false,
          statusCode,
          message,
          errorCode,
          timestamp: new Date().toISOString(),
          path,
          details,
        };

        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
} 