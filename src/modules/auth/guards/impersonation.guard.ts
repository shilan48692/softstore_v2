import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ImpersonationService } from '../../impersonation/impersonation.service';

@Injectable()
export class ImpersonationGuard implements CanActivate {
  constructor(private readonly impersonationService: ImpersonationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No impersonation token provided');
    }

    try {
      const payload = await this.impersonationService.validateImpersonationToken(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired impersonation token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 