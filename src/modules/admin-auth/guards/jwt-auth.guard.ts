import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-admin') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.startsWith('Bearer ') 
                  ? request.headers.authorization.substring(7) 
                  : (request.cookies ? request.cookies['accessToken'] : undefined);
    console.log(`>>> JwtAuthGuard processing request for: ${request.url}`);
    console.log(`>>> Token presented (header or cookie): ${token ? 'Exists' : 'NONE'}`); 
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (err || !user) {
      let errorMessage = 'Unauthorized';
      if (info instanceof Error) {
          errorMessage = info.message;
      } else if (typeof info === 'string') {
          errorMessage = info;
      }
      console.error(`>>> JwtAuthGuard Unauthorized on path ${request.url}: ${errorMessage}`, err);
      throw err || new UnauthorizedException(errorMessage);
    }
    return user;
  }
} 