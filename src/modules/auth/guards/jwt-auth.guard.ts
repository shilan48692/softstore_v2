import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Kiểm tra token có trong blacklist không
      if (this.authService.isTokenBlacklisted(token)) {
        throw new UnauthorizedException('Token has been revoked');
      }

      const result = (await super.canActivate(context)) as boolean;
      return result;
    } catch (error) {
      console.error('Authentication error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid token type');
    }
    return token;
  }
} 