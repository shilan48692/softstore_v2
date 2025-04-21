import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP'); // Use 'HTTP' context for request logging

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url } = request;
    const userAgent = request.get('user-agent') || '';
    const contentLength = response.get('content-length'); // Get length *after* response finishes

    // Log on response finish to capture status code and content length
    response.on('finish', () => {
      const { statusCode } = response;
      this.logger.log(
        `${method} ${url} ${statusCode} ${contentLength || '-'} - ${userAgent} ${ip}`
      );
      // Optionally log request body (be cautious with sensitive data)
      // if (request.body && Object.keys(request.body).length > 0) {
      //   this.logger.debug(`Request Body: ${JSON.stringify(request.body)}`);
      // }
    });

    next();
  }
} 