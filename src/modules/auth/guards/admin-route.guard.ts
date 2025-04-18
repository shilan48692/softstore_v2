import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminRouteGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const referer = request.headers.referer || '';
    const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';

    // Trong môi trường development, cho phép tất cả request
    if (isDevelopment) {
      return true;
    }

    // Trong môi trường production, kiểm tra referer
    return referer.includes('/admin');
  }
} 