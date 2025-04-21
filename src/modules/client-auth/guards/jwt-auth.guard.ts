import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-client') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      let errorMessage = 'Unauthorized';
      if (info instanceof Error) {
          errorMessage = info.message;
      } else if (typeof info === 'string') {
          errorMessage = info;
      }
      console.error(`>>> ClientJwtAuthGuard Unauthorized: ${errorMessage}`, err);
      throw err || new UnauthorizedException(errorMessage);
    }
    return user;
  }
} 